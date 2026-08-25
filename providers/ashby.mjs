// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

// Ashby provider — hits the public posting-api endpoint.
// Auto-detects from careers_url pattern `https://jobs.ashbyhq.com/<slug>`.
//
// Ashby's public posting-api carries a ~10s+ server-side latency floor
// (response time is independent of board size) and rate-limits repeated
// unauthenticated hits. The global default timeout (10s, providers/_http.mjs)
// sits right on that floor, so requests race the timeout and abort. We give
// Ashby a longer timeout plus a backoff+jitter retry (the backoff spaces
// requests out to dodge rate-limiting).
// See .planning/codebase/ashby-scan-abort-diagnosis.md.
const ASHBY_TIMEOUT_MS = 30_000;
const ASHBY_RETRIES = 2;

const ALLOWED_ASHBY_HOSTS = new Set(['api.ashbyhq.com']);

function assertAshbyUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`ashby: invalid URL: ${url}`);
  }
  if (parsed.protocol !== 'https:') throw new Error(`ashby: URL must use HTTPS: ${url}`);
  if (!ALLOWED_ASHBY_HOSTS.has(parsed.hostname)) {
    throw new Error(`ashby: untrusted hostname "${parsed.hostname}" — must be one of: ${[...ALLOWED_ASHBY_HOSTS].join(', ')}`);
  }
  return url;
}

// Validate a posting URL echoed back by the API. These land in pipeline.md
// and scan-history.tsv, and are later handed to Playwright and to the OS URL
// opener in the dashboard — so an off-domain or non-https value is dropped
// rather than propagated. Mirrors the recruitee/smartrecruiters parsers.
function safePostingUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return '';
    if (parsed.hostname !== 'jobs.ashbyhq.com') return '';
    return parsed.href;
  } catch {
    return '';
  }
}

function resolveApiUrl(entry) {
  const raw = typeof entry.careers_url === 'string' ? entry.careers_url : '';
  if (!raw) return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  // Parse the URL rather than regexing the raw string: an unanchored match
  // also fires on `https://attacker.example/jobs.ashbyhq.com/slug`.
  if (parsed.protocol !== 'https:') return null;
  if (parsed.hostname !== 'jobs.ashbyhq.com') return null;
  const slug = parsed.pathname.split('/').filter(Boolean)[0];
  if (!slug) return null;
  return `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(slug)}?includeCompensation=true`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @type {Provider} */
export default {
  id: 'ashby',

  detect(entry) {
    const apiUrl = resolveApiUrl(entry);
    return apiUrl ? { url: apiUrl } : null;
  },

  async fetch(entry, ctx) {
    const apiUrl = resolveApiUrl(entry);
    if (!apiUrl) throw new Error(`ashby: cannot derive API URL for ${entry.name}`);
    assertAshbyUrl(apiUrl);

    let lastErr;
    for (let attempt = 0; attempt <= ASHBY_RETRIES; attempt++) {
      if (attempt > 0) {
        // exponential backoff + jitter — spaces out retries to dodge Ashby rate-limiting
        const backoff = 1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 500);
        await sleep(backoff);
      }
      try {
        // redirect:'error' prevents SSRF via server-side redirects; combined with
        // assertAshbyUrl above it guarantees the final hostname stays in the allowlist.
        const json = await ctx.fetchJson(apiUrl, { timeoutMs: ASHBY_TIMEOUT_MS, redirect: 'error' });
        const jobs = Array.isArray(json?.jobs) ? json.jobs : [];
        return jobs.map((j) => ({
          title: j.title || '',
          url: safePostingUrl(j.jobUrl),
          company: entry.name,
          location: j.location || '',
        }));
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  },
};
