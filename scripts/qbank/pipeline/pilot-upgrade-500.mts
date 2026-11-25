/**
 * Sprint 3 pilot: select up to 500 high-risk-subject MC items, run deterministic
 * gates, write lifecycle ledger. Does NOT rewrite stems with LLM (A7).
 * Does NOT mark RELEASED. ai_blind = SKIPPED_NO_LLM.
 *
 * Usage: npx tsx scripts/qbank/pipeline/pilot-upgrade-500.mts
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { adversarialCheck, paramCheck } from './param-check.mts'
import type { ItemStatus, StatusAudit } from '../../../data/questions/lifecycle/statuses.ts'
import { canTransition } from '../../../data/questions/lifecycle/statuses.ts'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const PILOT_SUBJECTS = [
  'math',
  'physics',
  'chemistry',
  'biology',
  'bafs',
  'economics',
] as const
const TARGET = 500
const PER_SUBJECT = Math.ceil(TARGET / PILOT_SUBJECTS.length)

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

type LedgerRow = {
  id: string
  subject: string
  topic: string
  review_status: ItemStatus
  calibration_status: 'NONE' | 'INSUFFICIENT'
  source_status: 'PARAM_UPGRADED' | 'LEGACY'
  ai_blind: 'SKIPPED_NO_LLM'
  df_intent: 'DSE_PLUS_10_UNCALIBRATED'
  curriculum_version: '2024+'
  version: number
  errors: string[]
  warnings: string[]
}

const audits: StatusAudit[] = []
const ledger: LedgerRow[] = []
const now = new Date().toISOString()

function audit(
  itemId: string,
  from: ItemStatus,
  to: ItemStatus,
  reason: string,
) {
  if (!canTransition(from, to)) throw new Error(`${itemId}: ${from}->${to}`)
  audits.push({
    itemId,
    from,
    to,
    actor: 'pipeline:pilot-upgrade-500',
    at: now,
    version: 1,
    reason,
  })
}

for (const subject of PILOT_SUBJECTS) {
  const all = await loadSubjectQuestions(subject)
  const mc = all.filter((q) => q.type === 'mc')
  const picked: typeof mc = []
  const used = new Set<number>()
  while (picked.length < Math.min(PER_SUBJECT, mc.length) && used.size < mc.length) {
    const i = Math.floor(rand() * mc.length)
    if (used.has(i)) continue
    used.add(i)
    picked.push(mc[i])
  }

  for (const q of picked) {
    if (ledger.length >= TARGET) break
    const id = String(q.id)
    const p = paramCheck(q)
    const a = adversarialCheck(q)
    audit(id, 'DRAFT', 'PARAM_CHECKED', 'pilot param check')
    if (!p.ok || !a.ok) {
      audit(id, 'PARAM_CHECKED', 'REJECTED', [...p.errors, ...a.errors].join('|'))
      ledger.push({
        id,
        subject,
        topic: String(q.topic ?? ''),
        review_status: 'REJECTED',
        calibration_status: 'NONE',
        source_status: 'LEGACY',
        ai_blind: 'SKIPPED_NO_LLM',
        df_intent: 'DSE_PLUS_10_UNCALIBRATED',
        curriculum_version: '2024+',
        version: 1,
        errors: [...p.errors, ...a.errors],
        warnings: [...p.warnings, ...a.warnings],
      })
      continue
    }
    audit(
      id,
      'PARAM_CHECKED',
      'ADVERSARIAL_PASSED',
      'deterministic adversarial; ai_blind=SKIPPED_NO_LLM; stem not LLM-rewritten',
    )
    ledger.push({
      id,
      subject,
      topic: String(q.topic ?? ''),
      review_status: 'ADVERSARIAL_PASSED',
      calibration_status: 'INSUFFICIENT',
      source_status: 'PARAM_UPGRADED',
      ai_blind: 'SKIPPED_NO_LLM',
      df_intent: 'DSE_PLUS_10_UNCALIBRATED',
      curriculum_version: '2024+',
      version: 1,
      errors: [],
      warnings: [...p.warnings, ...a.warnings],
    })
  }
}

mkdirSync('data/questions/lifecycle', { recursive: true })
const passed = ledger.filter((r) => r.review_status === 'ADVERSARIAL_PASSED')
const rejected = ledger.filter((r) => r.review_status === 'REJECTED')

// Stratified spot-check sample: 10% of passed, min 20, max 50 — for human sign-off pack
const spotN = Math.min(50, Math.max(20, Math.floor(passed.length * 0.1)))
const spot: typeof passed = []
const spotUsed = new Set<number>()
while (spot.length < spotN && spotUsed.size < passed.length) {
  const i = Math.floor(rand() * passed.length)
  if (spotUsed.has(i)) continue
  spotUsed.add(i)
  spot.push(passed[i])
}

const summary = {
  generatedAt: now,
  target: TARGET,
  selected: ledger.length,
  adversarial_passed: passed.length,
  rejected: rejected.length,
  ai_blind: 'SKIPPED_NO_LLM',
  released: 0,
  human_spot_check_pack_size: spot.length,
  note:
    'No student-visible bank files mutated. No RELEASED. LLM rewrite pending C2. Spot-check pack requires founder signatures.',
  bySubject: Object.fromEntries(
    PILOT_SUBJECTS.map((s) => [
      s,
      {
        n: ledger.filter((r) => r.subject === s).length,
        passed: ledger.filter(
          (r) => r.subject === s && r.review_status === 'ADVERSARIAL_PASSED',
        ).length,
      },
    ]),
  ),
}

writeFileSync(
  'data/questions/lifecycle/pilot-500-ledger.json',
  JSON.stringify({ summary, ledger, audits, spotCheckPack: spot }, null, 2),
)
writeFileSync(
  'docs/daily-ledger.csv',
  [
    'date,generated,blind_passed,adversarial_passed,human_checked,released,retired,human_check_quota_used,human_check_backlog,items_with_30_responses,note',
    [
      '2026-11-26',
      ledger.length,
      0,
      passed.length,
      0,
      0,
      0,
      0,
      spot.length,
      0,
      'deterministic pilot; ai_blind skipped',
    ].join(','),
  ].join('\n') + '\n',
)

console.log(JSON.stringify(summary, null, 2))
