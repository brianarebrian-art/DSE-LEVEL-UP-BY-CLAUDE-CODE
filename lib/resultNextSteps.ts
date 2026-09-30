import { practiceHref } from '@/lib/sessionResume'

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
}

const TOPIC_ID = /^[A-Za-z0-9_-]{1,80}$/

/** Lowest correct ratio below 80%, or null. Same rule as the advice line on /result. */
export function weakestTopic(results: readonly TopicTally[]): TopicTally | null {
  const ranked = results.filter((t) => t.total > 0).sort((a, b) => a.correct / a.total - b.correct / b.total)
  const weak = ranked[0]
  return weak && weak.correct / weak.total < 0.8 ? weak : null
}

export function resultNextSteps(r: { subjectId?: string; topicResults: readonly TopicTally[]; topicIds?: unknown }): NextSteps {
  const subject = r.subjectId ?? 'math'
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
  }
}
