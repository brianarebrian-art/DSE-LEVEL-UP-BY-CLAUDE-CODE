/**
 * Sprint 1 throughput probe — 50 items, deterministic gates only.
 * Usage: npx tsx scripts/qbank/pipeline/throughput-probe.mts
 */
import { writeFileSync } from 'node:fs'
import { adversarialCheck, bigramJaccard, paramCheck } from './param-check.mts'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const SUBJECTS = ['math', 'physics', 'chemistry', 'biology', 'bafs'] as const
const PER = 10

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20261126)
const t0 = Date.now()

type Row = {
  subject: string
  id: string
  param_ok: boolean
  adv_ok: boolean
  similarity_flag: boolean
  errors: string[]
  warnings: string[]
  ms: number
}

const rows: Row[] = []
let paramPass = 0
let advPass = 0
let simFlag = 0

for (const subject of SUBJECTS) {
  const all = await loadSubjectQuestions(subject)
  const mc = all.filter((q) => q.type === 'mc')
  const picked: typeof mc = []
  const used = new Set<number>()
  while (picked.length < Math.min(PER, mc.length)) {
    const i = Math.floor(rand() * mc.length)
    if (used.has(i)) continue
    used.add(i)
    picked.push(mc[i])
  }

  for (const q of picked) {
    const s0 = Date.now()
    const p = paramCheck(q)
    const a = adversarialCheck(q)
    // compare against up to 20 others in subject
    let maxSim = 0
    const sample = mc.slice(0, 40)
    for (const other of sample) {
      if (other.id === q.id) continue
      const s = bigramJaccard(String(q.content), String(other.content))
      if (s > maxSim) maxSim = s
    }
    const similarity_flag = maxSim >= 0.85
    if (p.ok) paramPass++
    if (a.ok) advPass++
    if (similarity_flag) simFlag++
    rows.push({
      subject,
      id: String(q.id),
      param_ok: p.ok,
      adv_ok: a.ok,
      similarity_flag,
      errors: a.errors,
      warnings: [...new Set([...p.warnings, ...a.warnings])],
      ms: Date.now() - s0,
    })
  }
}

const elapsed = Date.now() - t0
const n = rows.length
const avgMs = n ? rows.reduce((s, r) => s + r.ms, 0) / n : 0
// Parallel estimate: 6 workers × 8h
const perDayDeterministic = avgMs > 0 ? Math.floor((6 * 8 * 3600 * 1000) / avgMs) : 0

const out = {
  generatedAt: new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date())
    .replace(',', ''),
  mode: 'deterministic_gates_only',
  llmCostPerItemUsd: null,
  note: 'LLM blind-review cost UNKNOWN until FOUNDER_AI budget approved (A7)',
  n,
  paramPass,
  advPass,
  simFlag,
  elapsedMs: elapsed,
  avgMsPerItem: Math.round(avgMs * 100) / 100,
  estimatedDeterministicDayCapacity_6x8h: perDayDeterministic,
  pilotCapRecommendation: perDayDeterministic >= 250 ? 2500 : 500,
  failures: rows.filter((r) => !r.adv_ok).slice(0, 20),
  rows,
}

writeFileSync('docs/04-throughput-probe-results.json', JSON.stringify(out, null, 2))
console.log(JSON.stringify({
  n: out.n,
  paramPass: out.paramPass,
  advPass: out.advPass,
  simFlag: out.simFlag,
  avgMsPerItem: out.avgMsPerItem,
  estimatedDeterministicDayCapacity_6x8h: out.estimatedDeterministicDayCapacity_6x8h,
  pilotCapRecommendation: out.pilotCapRecommendation,
  llmCostPerItemUsd: out.llmCostPerItemUsd,
}, null, 2))
