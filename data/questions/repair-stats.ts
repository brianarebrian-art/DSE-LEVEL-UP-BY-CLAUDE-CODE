// Counts for /transparency about the positional-explanation repairs (Yuna 2026-09-29,
// fourth decision; docs/rationale-repairs.md). Called from the server component
// app/transparency/page.tsx, so only the numbers reach the browser, not the two
// JSON files they are counted from.
//
// Two separate figures, because they mean different things (the decision's point 6):
//   repairs    questions withdrawn because an explanation names an option by position.
//              Counted per finding and as a union of question ids, never by adding.
//   candidates hits in the hand-written banks. A hit is not a fault: 「數列的第二項」 is
//              content. Each is classified A (option reference, withdrawn), B (content,
//              kept) or C (unclear; held back from practice since 2026-09-30 until a person decides).
import repairLog from './rationale-repairs.json'
import classification from './posref-classification.json'
import { WITHDRAWN, WITHDRAW_CODES, type WithdrawnEntry } from './hidden-topics'
import { getSubject } from '../subjects'

export const COHORTS = ['positional-first', 'positional-machine', 'positional-handwritten'] as const
export type Cohort = (typeof COHORTS)[number]

type Rec = { subject: string; stage: string; cohort?: string }

export interface RepairStats {
  /** All withdrawn questions, for any reason. */
  withdrawnNow: number
  /** Union of the three cohorts, by subject/id. */
  found: number
  byCohort: Record<Cohort, number>
  /** Cumulative: rewritten includes what was later reviewed and restored. */
  rewritten: number
  restored: number
  /** Hand-written candidates. `A` comes from the repair log, so it does not fall as questions are fixed. */
  candidates: { total: number; A: number; B: number; C: number }
}

export function repairStats(): RepairStats {
  const log = repairLog as Record<string, Rec>
  const byCohort = Object.fromEntries(COHORTS.map((c) => [c, new Set<string>()])) as Record<Cohort, Set<string>>
  for (const [id, r] of Object.entries(log)) {
    const c = (r.cohort ?? 'positional-first') as Cohort
    if (!byCohort[c]) throw new Error(`rationale-repairs.json: ${id} has unknown cohort ${r.cohort}`)
    byCohort[c].add(`${r.subject}/${id}`)
  }
  const union = new Set(COHORTS.flatMap((c) => [...byCohort[c]]))
  const sum = COHORTS.reduce((n, c) => n + byCohort[c].size, 0)
  // Disjoint by construction (one record per id), but say so if it ever is not.
  if (union.size !== sum) throw new Error(`positional cohorts overlap: ${sum} records, ${union.size} questions`)

  const stages = Object.values(log).map((r) => r.stage)
  const hand = (classification as { counts: { handwritten: { B: number; C: number } } }).counts.handwritten
  const A = byCohort['positional-handwritten'].size
  return {
    withdrawnNow: Object.values(WITHDRAWN).reduce((n, byId) => n + Object.keys(byId).length, 0),
    found: union.size,
    byCohort: Object.fromEntries(COHORTS.map((c) => [c, byCohort[c].size])) as Record<Cohort, number>,
    rewritten: stages.filter((s) => ['automated-checked', 'content-reviewed', 'restored'].includes(s)).length,
    restored: stages.filter((s) => s === 'restored').length,
    candidates: { total: A + hand.B + hand.C, A, B: hand.B, C: hand.C },
  }
}

// Withdrawal log for /transparency (audit #7, founders' reply A7-3 A, 2026-10-04): the latest
// batches by date and reason, with the number of questions per subject. Question ids and text
// are not listed. A free-text reason (withdraw.mts --reason "...") is written for the team, so it
// is grouped as OTHER and published only as a generic label; give a reason a code in
// WITHDRAW_CODES and a label in TransparencyClient to publish it.
export interface WithdrawalBatch {
  date: string
  /** A WITHDRAW_CODES key, or 'OTHER'. */
  reason: string
  total: number
  subjects: { zh: string; en: string; count: number }[]
}

type Withdrawn = Readonly<Record<string, Readonly<Record<string, WithdrawnEntry>>>>

export function groupWithdrawals(
  data: Withdrawn,
  codes: Readonly<Record<string, string>>,
  nameOf: (subject: string) => { zh: string; en: string },
  limit: number,
): WithdrawalBatch[] {
  const batches = new Map<string, { date: string; reason: string; bySubject: Map<string, number> }>()
  for (const [subject, byId] of Object.entries(data)) {
    for (const { date, reason } of Object.values(byId)) {
      const code = Object.hasOwn(codes, reason) ? reason : 'OTHER'
      const key = `${date}|${code}`
      const b = batches.get(key) ?? { date, reason: code, bySubject: new Map<string, number>() }
      b.bySubject.set(subject, (b.bySubject.get(subject) ?? 0) + 1)
      batches.set(key, b)
    }
  }
  return [...batches.values()]
    .sort((a, b) => b.date.localeCompare(a.date) || a.reason.localeCompare(b.reason))
    .slice(0, limit)
    .map(({ date, reason, bySubject }) => {
      const subjects = [...bySubject]
        .map(([id, count]) => ({ ...nameOf(id), count }))
        .sort((a, b) => b.count - a.count || a.en.localeCompare(b.en))
      return { date, reason, total: subjects.reduce((n, x) => n + x.count, 0), subjects }
    })
}

export function recentWithdrawals(limit = 10): WithdrawalBatch[] {
  return groupWithdrawals(WITHDRAWN, WITHDRAW_CODES, (id) => {
    const s = getSubject(id)
    return { zh: s?.name ?? id, en: s?.nameEn ?? id }
  }, limit)
}
