/**
 * Annotate pilot ADVERSARIAL_PASSED items with deterministic DF proxies.
 * Does not mutate student-visible banks. No external LLM.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { bigramJaccard } from './param-check.mts'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const pilot = JSON.parse(
  readFileSync('data/questions/lifecycle/pilot-500-ledger.json', 'utf8'),
) as { ledger: Array<{ id: string; subject: string; review_status: string }> }

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

const cache = new Map<string, Array<Record<string, unknown>>>()
async function bank(subject: string) {
  if (!cache.has(subject)) cache.set(subject, await loadSubjectQuestions(subject))
  return cache.get(subject)!
}

type Anno = {
  id: string
  subject: string
  C: number
  S: number
  R: number
  D: number
  U: number
  M: number
  DF: number
  band: string
  trap_patterns: string[]
  note: string
}

const annos: Anno[] = []
const passed = pilot.ledger.filter((r) => r.review_status === 'ADVERSARIAL_PASSED')

for (const row of passed) {
  const qs = await bank(row.subject)
  const q = qs.find((x) => x.id === row.id)
  if (!q || q.type !== 'mc') continue
  const stem = String(q.content ?? '')
  const opts = (q.options as string[]) || []
  const expl = String(q.explanation ?? '')

  // Heuristic proxies — documented as non-empirical
  const C = /解釋|為何|why|compare|分析|評價/i.test(stem) ? 4 : /計算|求|calculate/i.test(stem) ? 3 : 2
  const S = Math.min(10, Math.max(1, Math.round(expl.length / 80)))
  const R = /圖|表|下圖|graph|table|圖示/i.test(stem) ? 2 : /\$|\\frac|°|μ|Δ/.test(stem) ? 1 : 0
  const lengths = opts.map((o) => o.length)
  const skew = lengths.length ? Math.max(...lengths) / Math.max(1, Math.min(...lengths)) : 1
  const D = skew > 2.5 ? 4 : skew > 1.6 ? 3 : 2
  const U = stem.length > 120 ? 3 : 2
  const M = (stem.match(/以及|同時|and then|given that/gi) || []).length > 0 ? 2 : 1
  const DF = 0.3 * C + 0.2 * S + 0.15 * R + 0.15 * D + 0.1 * U + 0.1 * M

  const traps: string[] = []
  if (skew > 2) traps.push('option_length_skew')
  if (opts.some((o) => /以上皆|all of the above/i.test(o))) traps.push('all_of_above')
  // near-duplicate options
  for (let i = 0; i < opts.length; i++) {
    for (let j = i + 1; j < opts.length; j++) {
      if (bigramJaccard(opts[i], opts[j]) > 0.7) traps.push('near_duplicate_options')
    }
  }

  let band = 'STANDARD'
  if (DF < 2.2) band = 'FOUNDATION'
  else if (DF < 2.8) band = 'STANDARD'
  else if (DF < 3.4) band = 'CHALLENGING'
  else band = 'DSE_PLUS_10_UNCALIBRATED'

  annos.push({
    id: row.id,
    subject: row.subject,
    C,
    S,
    R,
    D,
    U,
    M,
    DF: Math.round(DF * 100) / 100,
    band,
    trap_patterns: [...new Set(traps)],
    note: 'proxy_only_not_empirical_plus10',
  })
}

const summary = {
  generatedAt: new Date().toISOString(),
  n: annos.length,
  bands: annos.reduce(
    (acc, a) => {
      acc[a.band] = (acc[a.band] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  ),
  external_llm: false,
}

writeFileSync(
  'data/questions/lifecycle/pilot-500-df-annotations.json',
  JSON.stringify({ summary, annos }, null, 2),
)
console.log(JSON.stringify(summary, null, 2))
