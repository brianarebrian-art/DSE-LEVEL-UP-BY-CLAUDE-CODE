/**
 * Full deterministic pipeline dry-run on 50 items.
 * AI_BLIND_REVIEWED is recorded as SKIPPED_NO_LLM (A7) — not silently passed.
 */
import { writeFileSync } from 'node:fs'
import { adversarialCheck, paramCheck } from './param-check.mts'
import {
  canTransition,
  type ItemStatus,
  type StatusAudit,
} from '../../../data/questions/lifecycle/statuses.ts'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

const SUBJECTS = ['math', 'physics', 'chemistry', 'biology', 'bafs']
const audits: StatusAudit[] = []
const now = new Date().toISOString()

function transition(
  itemId: string,
  from: ItemStatus,
  to: ItemStatus,
  reason: string,
  version: number,
) {
  if (!canTransition(from, to)) {
    throw new Error(`illegal transition ${from} -> ${to} for ${itemId}`)
  }
  audits.push({
    itemId,
    from,
    to,
    actor: 'pipeline:dry-run',
    at: now,
    version,
    reason,
  })
}

const results: Array<Record<string, unknown>> = []

for (const subject of SUBJECTS) {
  const all = await loadSubjectQuestions(subject)
  const mc = all.filter((q) => q.type === 'mc').slice(0, 10)
  for (const q of mc) {
    const id = String(q.id)
    let status: ItemStatus = 'DRAFT'
    transition(id, 'DRAFT', 'PARAM_CHECKED', 'param-check start', 1)
    status = 'PARAM_CHECKED'
    const p = paramCheck(q)
    if (!p.ok) {
      transition(id, status, 'REJECTED', p.errors.join('|'), 1)
      results.push({ id, subject, final: 'REJECTED', errors: p.errors })
      continue
    }
    // AI blind skipped — stay PARAM_CHECKED then only go to ADVERSARIAL if
    // deterministic adversarial passes; record skip explicitly.
    const a = adversarialCheck(q)
    if (!a.ok) {
      transition(id, status, 'REJECTED', a.errors.join('|'), 1)
      results.push({ id, subject, final: 'REJECTED', errors: a.errors })
      continue
    }
    transition(
      id,
      status,
      'ADVERSARIAL_PASSED',
      'deterministic_adversarial_ok; ai_blind=SKIPPED_NO_LLM',
      1,
    )
    results.push({
      id,
      subject,
      final: 'ADVERSARIAL_PASSED',
      ai_blind: 'SKIPPED_NO_LLM',
      warnings: a.warnings,
    })
  }
}

const summary = {
  generatedAt: now,
  n: results.length,
  adversarial_passed: results.filter((r) => r.final === 'ADVERSARIAL_PASSED').length,
  rejected: results.filter((r) => r.final === 'REJECTED').length,
  ai_blind: 'SKIPPED_NO_LLM',
  rollbackNote: 'dry-run writes no student-visible banks; delete this JSON to discard',
  results,
  audits,
}

writeFileSync('docs/pipeline-dry-run-50.json', JSON.stringify(summary, null, 2))
console.log(
  JSON.stringify({
    n: summary.n,
    adversarial_passed: summary.adversarial_passed,
    rejected: summary.rejected,
    ai_blind: summary.ai_blind,
    audits: audits.length,
  }),
)
