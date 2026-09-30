import { practiceHref } from '@/lib/sessionResume'
import { causeHasMaterial, causePracticeHref } from '@/lib/causeMode'
import type { ReverseCause, ReverseLogEntry } from '@/lib/reverseLog'

// What to do after a session, shown under the score on /result (UX loop 7, 2026-09-30).
//
// Measured at 360×800 before this: 再做一次 and 揀另一個課題 sat at y≈2,470,
// below the teacher report and the Instagram card, and the weakest-topic advice
// ("建議加強：…") was plain text with no way to act on it.
//
// The weakest topic follows the advice line's existing rule: lowest correct ratio,
// only when below 80%. It becomes a link only when the session recorded the topic's
// id (`topicIds` in dse_result, written from 2026-09-30); older results show the
// other two steps.

export interface TopicTally {
  topic: string
  correct: number
  total: number
}

export interface NextSteps {
  retryHref: string
  topicsHref: string
  weakest: { label: string; href: string; correct: number; total: number } | null
  /** UX loop 10 (P1-F): the error cause chosen most in this session, as a cause-ordered session. */
  cause: { cause: ReverseCause; count: number; href: string } | null
}

/**
 * The cause the student chose most often in this session: entries for this subject
 * logged at or after `startedAt`. The log is newest first, so a tie goes to the cause
 * chosen most recently.
 */
export function sessionCause(
  log: readonly ReverseLogEntry[],
  subjectId: string,
  startedAt: number,
): { cause: ReverseCause; count: number } | null {
  const counts = new Map<ReverseCause, number>()
  for (const e of log) {
    if (e.subjectId !== subjectId || !(e.ts >= startedAt)) continue
    if (e.cause !== 'A' && e.cause !== 'B' && e.cause !== 'C') continue
    counts.set(e.cause, (counts.get(e.cause) ?? 0) + 1)
  }
  let best: { cause: ReverseCause; count: number } | null = null
  for (const [cause, count] of counts) if (!best || count > best.count) best = { cause, count }
  return best
}

const TOPIC_ID = /^[A-Za-z0-9_-]{1,80}$/

/** Lowest correct ratio below 80%, or null. Same rule as the advice line on /result. */
export function weakestTopic(results: readonly TopicTally[]): TopicTally | null {
  const ranked = results.filter((t) => t.total > 0).sort((a, b) => a.correct / a.total - b.correct / b.total)
  const weak = ranked[0]
  return weak && weak.correct / weak.total < 0.8 ? weak : null
}

export function resultNextSteps(r: {
  subjectId?: string
  topicResults: readonly TopicTally[]
  topicIds?: unknown
  startedAt?: number
  log?: readonly ReverseLogEntry[]
}): NextSteps {
  const subject = r.subjectId ?? 'math'
  // Only when the session's start is known (results from 2026-09-05 on) and the
  // cause session would find something to put first (lib/causeMode.ts).
  const top = r.log && typeof r.startedAt === 'number' ? sessionCause(r.log, subject, r.startedAt) : null
  const cause =
    top && r.log && causeHasMaterial([...r.log], subject, top.cause)
      ? { ...top, href: causePracticeHref(subject, top.cause) }
      : null
  const weak = weakestTopic(r.topicResults)
  const ids = r.topicIds && typeof r.topicIds === 'object' && !Array.isArray(r.topicIds) ? (r.topicIds as Record<string, unknown>) : {}
  const id = weak ? ids[weak.topic] : undefined
  return {
    retryHref: practiceHref(subject, null, 'normal'),
    topicsHref: `/subjects/${encodeURIComponent(subject)}`,
    weakest:
      weak && typeof id === 'string' && TOPIC_ID.test(id)
        ? { label: weak.topic, href: practiceHref(subject, id, 'normal'), correct: weak.correct, total: weak.total }
        : null,
    cause,
  }
}
