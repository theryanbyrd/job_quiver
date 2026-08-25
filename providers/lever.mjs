// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

// Lever provider — hits the public postings endpoint.
// Auto-detects from careers_url pattern `https://jobs.lever.co/<slug>`.

const ALLOWED_LEVER_HOSTS = new Set(['api.lever.co']);

function assertLeverUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`lever: invalid URL: ${url}`);
  }
  if (parsed.protocol !== 'https:') throw new Error(`lever: URL must use HTTPS: ${url}`);
  if (!ALLOWED_LEVER_HOSTS.has(parsed.hostname)) {
    throw new Error(`lever: untrusted hostname "${parsed.hostname}" — must be one of: ${[...ALLOWED_LEVER_HOSTS].join(', ')}`);
  }
  return url;
}

// Validate a posting URL echoed back by the API. These land in pipeline.md
// and scan-history.tsv, and are later handed to Playwright and to the OS URL
// opener in the dashboard — so an off-domain or non-https value is dropped
// rather than propagated. Mirrors the recruitee/smartrecruiters parsers.
const LEVER_POSTING_HOST_RE = /^(jobs\.lever\.co|jobs\.eu\.lever\.co)$/;

function safePostingUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return '';
    if (!LEVER_POSTING_HOST_RE.test(parsed.hostname)) return '';
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
  // also fires on `https://attacker.example/jobs.lever.co/slug`.
  if (parsed.protocol !== 'https:') return null;
  if (parsed.hostname !== 'jobs.lever.co') return null;
  const slug = parsed.pathname.split('/').filter(Boolean)[0];
  if (!slug) return null;
  return `https://api.lever.co/v0/postings/${encodeURIComponent(slug)}`;
}

/** @type {Provider} */
export default {
  id: 'lever',

  detect(entry) {
    const apiUrl = resolveApiUrl(entry);
    return apiUrl ? { url: apiUrl } : null;
  },

  async fetch(entry, ctx) {
    const apiUrl = resolveApiUrl(entry);
    if (!apiUrl) throw new Error(`lever: cannot derive API URL for ${entry.name}`);
    assertLeverUrl(apiUrl);
    // redirect:'error' prevents SSRF via server-side redirects; combined with
    // assertLeverUrl above it guarantees the final hostname stays in the allowlist.
    const json = await ctx.fetchJson(apiUrl, { redirect: 'error' });
    if (!Array.isArray(json)) return [];
    return json.map(j => ({
      title: j.text || '',
      url: safePostingUrl(j.hostedUrl),
      company: entry.name,
      location: j.categories?.location || '',
    }));
  },
};
