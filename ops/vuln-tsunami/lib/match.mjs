// Match NVD CVEs against the DSE Level Up stack watchlist.

function haystack(cve) {
  return `${cve.id} ${cve.description} ${(cve.references || []).join(' ')}`.toLowerCase()
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Whole-phrase match with loose word boundaries (handles next.js / @supabase). */
function phraseHit(text, kw) {
  const raw = String(kw).toLowerCase().trim()
  if (!raw) return false
  const escaped = escapeRe(raw).replace(/\s+/g, '\\s+')
  // Allow . @ / - inside tokens; bound by non-token chars
  const re = new RegExp(`(?:^|[^a-z0-9_])${escaped}(?:[^a-z0-9_]|$)`, 'i')
  return re.test(text)
}

/**
 * Short / noisy keywords (react, node) need a stronger secondary signal
 * so "written in Node.js" does not page the founder for every sandbox CVE.
 */
const NOISY = new Set(['react', 'react-dom', 'node.js', 'nodejs', 'vercel'])

function strongNodeSignal(text) {
  return (
    /node\.js\s+(runtime|before|prior|through|version|versions)/i.test(text) ||
    /nodejs\.org/i.test(text) ||
    /cpe:2\.3:[ao]:nodejs:node\.js/i.test(text) ||
    /brotli.*(node|nodejs)/i.test(text) ||
    /(node|nodejs).*(brotli|buffer overflow)/i.test(text)
  )
}

function strongReactSignal(text) {
  return (
    /react(\.js)?\s+(before|prior|through|version|versions)/i.test(text) ||
    /facebook\/react|github\.com\/facebook\/react/i.test(text) ||
    /cpe:2\.3:[ao]:facebook:react/i.test(text) ||
    /react-dom/i.test(text)
  )
}

function strongVercelSignal(text) {
  return (
    /vercel\s+(cli|platform|serverless|firewall)/i.test(text) ||
    /github\.com\/vercel\//i.test(text) ||
    /@vercel\//i.test(text)
  )
}

export function matchWatchlist(cve, watchlist) {
  const text = haystack(cve)
  const hits = []
  for (const item of watchlist) {
    const keywords = item.keywords || []
    const any = keywords.some((kw) => phraseHit(text, kw))
    if (!any) continue

    const noisy = keywords.some((kw) => NOISY.has(String(kw).toLowerCase()))
    if (noisy) {
      if (item.id === 'node' && !strongNodeSignal(text)) continue
      if (item.id === 'react' && !strongReactSignal(text)) continue
      if (item.id === 'vercel' && !strongVercelSignal(text)) continue
    }
    hits.push(item)
  }
  return hits
}

export function shouldAlert(cve, hits, triage = {}) {
  if (!hits.length) return false
  if (triage.alwaysAlertKev && cve.kev) return true
  if (triage.alwaysAlertCritical && cve.severity === 'CRITICAL') return true
  if (cve.score != null && cve.score >= (triage.minScore ?? 7)) return true
  if (cve.severity === 'HIGH' || cve.severity === 'CRITICAL') return true
  return false
}

export function rankAlerts(alerts) {
  const sevRank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, UNKNOWN: 4 }
  return [...alerts].sort((a, b) => {
    if (a.cve.kev !== b.cve.kev) return a.cve.kev ? -1 : 1
    const sa = sevRank[a.cve.severity] ?? 9
    const sb = sevRank[b.cve.severity] ?? 9
    if (sa !== sb) return sa - sb
    return (b.cve.score ?? 0) - (a.cve.score ?? 0)
  })
}
