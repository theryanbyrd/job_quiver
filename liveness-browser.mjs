/**
 * liveness-browser.mjs — Playwright-driven liveness check for a single URL.
 *
 * Shared by check-liveness.mjs (CLI tool) and scan.mjs (--verify flag).
 * Returns the same shape as classifyLiveness: { result, reason }.
 */

import { lookup } from 'dns/promises';
import net from 'net';

import { classifyLiveness } from './liveness-core.mjs';

const NAVIGATE_TIMEOUT_MS = 15_000;
const HYDRATION_WAIT_MS = 2_000;

// Defensive guards: URLs come from ATS feeds (mostly trusted) but a misconfigured
// portals.yml entry or a hijacked feed shouldn't be able to point Playwright at
// internal infrastructure.
//
// This checks the resolved IP rather than pattern-matching the hostname string,
// and re-checks on every navigation rather than only the entry URL. The previous
// hostname-regex denylist was bypassable by:
//   - an HTTP redirect from an allowed host (the guard never ran again)
//   - alternate IP encodings: http://2130706433/, http://0177.0.0.1/, http://0/
//   - DNS names that resolve to loopback: 127.0.0.1.nip.io, localtest.me
//   - IPv4-mapped IPv6: http://[::ffff:169.254.169.254]/, http://[::]/
//   - cloud metadata by name: metadata.google.internal
// Resolving to an IP collapses all of those into one check, because getaddrinfo
// already normalizes the alternate encodings.

function stripBrackets(host) {
  return host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
}

function ipv4IsPrivate(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true; // unparseable — fail closed
  }
  const [a, b] = parts;
  if (a === 0) return true;                        // 0.0.0.0/8 ("this host")
  if (a === 10) return true;                       // RFC1918
  if (a === 127) return true;                      // loopback
  if (a === 169 && b === 254) return true;         // link-local (incl. 169.254.169.254 metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
  if (a === 192 && b === 168) return true;         // RFC1918
  if (a === 192 && b === 0) return true;           // 192.0.0.0/24, 192.0.2.0/24
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT RFC6598
  if (a >= 224) return true;                       // multicast + reserved
  return false;
}

function ipv6IsPrivate(ip) {
  const lower = ip.toLowerCase();
  if (lower === '::' || lower === '::1') return true;
  if (lower.startsWith('fe80:')) return true;      // link-local
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true; // unique local fc00::/7

  // IPv4-mapped / IPv4-compatible, dotted form: ::ffff:169.254.169.254
  const dotted = lower.match(/^::(?:ffff:)?(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) return ipv4IsPrivate(dotted[1]);

  // Same thing after WHATWG URL normalization, which rewrites the dotted tail
  // as hex groups: `::ffff:169.254.169.254` becomes `::ffff:a9fe:a9fe`.
  // Without this branch, bracketed IPv4-mapped literals slip past the guard.
  const hex = lower.match(/^::(?:ffff:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex) {
    const high = parseInt(hex[1], 16);
    const low = parseInt(hex[2], 16);
    const v4 = [high >> 8, high & 0xff, low >> 8, low & 0xff].join('.');
    return ipv4IsPrivate(v4);
  }
  return false;
}

function ipIsPrivate(ip) {
  const version = net.isIP(ip);
  if (version === 4) return ipv4IsPrivate(ip);
  if (version === 6) return ipv6IsPrivate(ip);
  return true; // not an IP at all — fail closed
}

// Hostnames that never legitimately host a public job posting, blocked before
// we even resolve them.
const BLOCKED_NAME_RE = /(^|\.)(localhost|local|internal|localdomain)$/i;

async function hostIsBlocked(hostname) {
  const host = stripBrackets(hostname);
  if (!host) return true;
  if (net.isIP(host)) return ipIsPrivate(host);
  if (BLOCKED_NAME_RE.test(host)) return true;

  let addresses;
  try {
    addresses = await lookup(host, { all: true });
  } catch {
    return true; // unresolvable — fail closed
  }
  if (!addresses || addresses.length === 0) return true;
  // Block if ANY resolved address is private: a DNS-rebinding name that
  // returns both a public and a private address must not be allowed through.
  return addresses.some((a) => ipIsPrivate(a.address));
}

// Returns null when the URL is safe to fetch, otherwise a structured guard
// result with a stable `code` (used for routing in scan.mjs) plus a human
// `reason`. Stable codes — not regex on reason strings — drive downstream
// dispatch so the wording can change freely without breaking callers.
async function rejectPrivateOrInvalid(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { code: 'invalid_url', reason: 'invalid URL' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { code: 'unsupported_protocol', reason: `unsupported protocol ${parsed.protocol}` };
  }
  if (await hostIsBlocked(parsed.hostname)) {
    return { code: 'blocked_host', reason: `blocked host ${parsed.hostname}` };
  }
  return null;
}

export async function checkUrlLiveness(page, url) {
  const guardError = await rejectPrivateOrInvalid(url);
  if (guardError) {
    return { result: 'uncertain', code: guardError.code, reason: guardError.reason };
  }

  // The entry URL passed. Now enforce the same guard on every navigation the
  // page makes, so a 302 from an allowed host to 169.254.169.254 is blocked
  // too. Without this the check above only covers the first hop.
  let redirectBlock = null;
  const guardRoute = async (route) => {
    const request = route.request();
    if (!request.isNavigationRequest()) {
      return route.continue();
    }
    const violation = await rejectPrivateOrInvalid(request.url());
    if (violation) {
      redirectBlock = { ...violation, reason: `${violation.reason} (via redirect to ${request.url()})` };
      return route.abort('blockedbyclient');
    }
    return route.continue();
  };
  await page.route('**/*', guardRoute);

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAVIGATE_TIMEOUT_MS });
    const status = response?.status() ?? 0;

    // Give SPAs (Ashby, Lever, Workday) time to hydrate
    await page.waitForTimeout(HYDRATION_WAIT_MS);

    const finalUrl = page.url();
    const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
    const applyControls = await page.evaluate(() => {
      const candidates = Array.from(
        document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [role="button"]')
      );

      return candidates
        .filter((element) => {
          if (element.closest('nav, header, footer')) return false;
          if (element.closest('[aria-hidden="true"]')) return false;

          const style = window.getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (!element.getClientRects().length) return false;

          return Array.from(element.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
        })
        .map((element) => {
          const label = [
            element.innerText,
            element.value,
            element.getAttribute('aria-label'),
            element.getAttribute('title'),
          ]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          return label;
        })
        .filter(Boolean);
    });

    return classifyLiveness({ status, finalUrl, bodyText, applyControls });
  } catch (err) {
    // A guard-aborted redirect surfaces here as a generic navigation failure.
    // Report it with its own permanent code instead, so scan.mjs routes it to
    // `invalid` rather than treating it as a transient error to retry forever.
    if (redirectBlock) {
      return { result: 'uncertain', code: redirectBlock.code, reason: redirectBlock.reason };
    }
    // Transient failures (timeout, DNS, TLS, 5xx) shouldn't be treated as expired —
    // doing so would cause scan --verify to drop the URL and write it to scan-history,
    // permanently filtering it out on subsequent scans.
    return {
      result: 'uncertain',
      code: 'navigation_error',
      reason: `navigation error: ${err.message.split('\n')[0]}`,
    };
  } finally {
    // The caller reuses one page across many URLs, so handlers must not stack.
    await page.unroute('**/*', guardRoute).catch(() => {});
  }
}
