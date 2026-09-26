// Practice by error cause (`/practice?mode=cause&cause=A|B|C`).
//
// UX audit F1 (a): chosen by Yuna 2026-09-21, carried out 2026-09-26 under charter §18.
// Entry point: the "You found a pattern" card in components/ErrorDNA.tsx.
//
// Like mode='weakness', this only changes the ORDER of the pool. pickByDifficulty in
// PracticeSession still stratifies 3:5:2 afterwards, so the difficulty mix is kept by
// structure, not by promise (charter §7). Nothing new is stored: it reads the existing
// dse_reverse_log and the question bank.
//
//   B misreading the question: questions whose Chinese or English stem contains a
//     command word. Both stems, because the Chinese list has no 「不是」: on 2026-09-26
//     the Chinese stem alone matched 6 of 1,016 economics MC questions, the English
//     stem 77. Needs no history.
//   A concept blind spot:       questions from topics the student marked A.
//   C careless calculation:     questions from topics marked C that contain numbers
//                               or formulae.
//
// The log keeps the latest 200 entries (lib/reverseLog.ts CAP), so A and C use recent
// history only.

import type { ReverseCause, ReverseLogEntry } from '@/lib/reverseLog'
import { hasCommandWord } from '@/lib/commandWords'

export function parseCause(v: string | null | undefined): ReverseCause | null {
  return v === 'A' || v === 'B' || v === 'C' ? v : null
}

interface CauseQuestion {
  topic: string
  content: string
  contentEn?: string
}

const HAS_NUMBER = /\$|\d/

/** Topic ids the student marked with this cause in this subject. */
export function causeTopics(log: ReverseLogEntry[], subjectId: string, cause: ReverseCause): Set<string> {
  const out = new Set<string>()
  for (const e of log) {
    if (e.subjectId === subjectId && e.cause === cause && e.topicId) out.add(e.topicId)
  }
  return out
}

export function matchesCause(q: CauseQuestion, cause: ReverseCause, topics: Set<string>): boolean {
  if (cause === 'B') return hasCommandWord(q.content) || hasCommandWord(q.contentEn)
  if (!topics.has(q.topic)) return false
  return cause === 'A' || HAS_NUMBER.test(q.content)
}

/** Whether a cause session would find anything to put first. */
export function causeHasMaterial(log: ReverseLogEntry[], subjectId: string, cause: ReverseCause): boolean {
  return cause === 'B' || causeTopics(log, subjectId, cause).size > 0
}

/** Matching questions first, each group keeping its incoming (recency) order. */
export function orderByCause<T extends CauseQuestion>(
  ordered: T[],
  cause: ReverseCause,
  log: ReverseLogEntry[],
  subjectId: string,
): T[] {
  const topics = causeTopics(log, subjectId, cause)
  const hit: T[] = []
  const rest: T[] = []
  for (const q of ordered) (matchesCause(q, cause, topics) ? hit : rest).push(q)
  return [...hit, ...rest]
}
