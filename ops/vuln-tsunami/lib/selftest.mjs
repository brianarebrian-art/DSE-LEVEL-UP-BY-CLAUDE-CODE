// Offline self-test — no NVD network. Run: node lib/selftest.mjs
import { matchWatchlist, shouldAlert, rankAlerts } from './match.mjs'
import { formatReport } from './format.mjs'
import { normalizeCve } from './nvd.mjs'

const watchlist = [
  {
    id: 'next',
    label: 'Next.js',
    keywords: ['next.js', 'nextjs'],
    actionHint: 'Upgrade next.',
  },
  {
    id: 'node',
    label: 'Node.js runtime',
    keywords: ['node.js', 'nodejs'],
    actionHint: 'Check Node runtime.',
  },
]

const triage = { minScore: 7, alwaysAlertKev: true, alwaysAlertCritical: true }

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

// Real Next.js-shaped hit
const nextCve = {
  id: 'CVE-TEST-NEXT',
  description: 'A vulnerability in next.js before 15.0 allows RCE.',
  score: 9.8,
  severity: 'CRITICAL',
  kev: false,
  references: ['https://github.com/vercel/next.js/security'],
}
assert(matchWatchlist(nextCve, watchlist).some((h) => h.id === 'next'), 'next should match')

// Noisy "for Node.js" must NOT page as runtime
const noisy = {
  id: 'CVE-TEST-NOISE',
  description: 'vm2 is a sandbox for Node.js. Prior to 3.11 sandbox breakout.',
  score: 9.8,
  severity: 'CRITICAL',
  kev: false,
  references: [],
}
assert(matchWatchlist(noisy, watchlist).length === 0, 'noisy node mention must not match')

// Strong Node/Brotli signal should match
const brotli = {
  id: 'CVE-2026-111497',
  description:
    'A buffer overflow in the Brotli decoder used by Node.js runtime versions before patched release.',
  score: 9.8,
  severity: 'CRITICAL',
  kev: true,
  references: [],
}
assert(matchWatchlist(brotli, watchlist).some((h) => h.id === 'node'), 'brotli/node should match')

const alerts = rankAlerts([
  { cve: brotli, hits: matchWatchlist(brotli, watchlist) },
  { cve: nextCve, hits: matchWatchlist(nextCve, watchlist) },
].filter((a) => shouldAlert(a.cve, a.hits, triage)))

assert(alerts[0].cve.kev === true, 'KEV ranks first')

const report = formatReport({
  window: { start: '2026-11-04T00:00:00.000Z', end: '2026-11-04T12:00:00.000Z' },
  scanned: 2,
  alerts,
  newAlerts: alerts,
  quiet: true,
  maxShown: 5,
})
assert(report.startsWith('Treat ') || report.startsWith('Upgrade ') || report.startsWith('Check '), 'ADHD lead-with-action')
assert(report.includes('Next:'), 'ADHD ends with next step')

const normalized = normalizeCve({
  cve: {
    id: 'CVE-X',
    published: '2026-01-01',
    lastModified: '2026-01-02',
    descriptions: [{ lang: 'en', value: 'test' }],
    metrics: { cvssMetricV31: [{ cvssData: { baseScore: 7.5, baseSeverity: 'HIGH', version: '3.1' } }] },
    references: [],
  },
})
assert(normalized.severity === 'HIGH', 'normalize severity')

console.log('selftest OK — 5 checks passed')
console.log('Next: node monitor.mjs --hours 24')
