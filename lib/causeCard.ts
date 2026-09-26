// Data for the cause card, the second share card on the result page.
//
// UX audit A2 (c): chosen by Yuna 2026-09-21, carried out 2026-09-26 under charter §18.
// The score card stays; the student picks which one to share.
//
// The cause card names the error causes the student identified today in this subject
// and one thing to do next. It carries no score: no accuracy, no correct count, no time,
// no per-tier results, and not even how many times each cause came up, because a count
// of mistakes is a score by another name.
//
// Source: the existing dse_reverse_log. It only has entries when the student answered
// wrongly and then picked a cause, so on many days there is nothing to show. In that
// case this returns null and the result page greys out the option (impact report
// docs/PHASE1-impact-2026-09-21.md, option 甲). Nothing is inferred (charter §8).

import type { ReverseCause, ReverseLogEntry } from '@/lib/reverseLog'

export interface CauseCardData {
  date: string
  subject: string
  /** Causes found today, most frequent first. Never empty. */
  causes: ReverseCause[]
  siteUrl: string
}

const sameLocalDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString()

/** Causes the student picked today in this subject, most frequent first; [] when none. */
export function causesToday(log: ReverseLogEntry[], subjectId: string, now: number = Date.now()): ReverseCause[] {
  const n: Record<ReverseCause, number> = { A: 0, B: 0, C: 0 }
  for (const e of log) {
    if (e.subjectId !== subjectId || !sameLocalDay(e.ts, now)) continue
    if (e.cause === 'A' || e.cause === 'B' || e.cause === 'C') n[e.cause]++
  }
  return (['A', 'B', 'C'] as ReverseCause[]).filter((c) => n[c] > 0).sort((a, b) => n[b] - n[a])
}

export function buildCauseCardData(
  log: ReverseLogEntry[],
  subjectId: string,
  meta: { date: string; subject: string; siteUrl: string },
  now: number = Date.now(),
): CauseCardData | null {
  const causes = causesToday(log, subjectId, now)
  return causes.length ? { ...meta, causes } : null
}
