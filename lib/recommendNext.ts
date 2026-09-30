// Adaptive recommendation V1: which topic in this subject is worth the next session
// (refinement loop 2, 2026-09-30; prompt §8–§13).
//
// Zero migration: it only reads what this device already keeps (dse_topic_stats,
// dse_reverse_log, dse_progress) and the published per-topic question counts. No skill
// metadata, no new storage, nothing written. A topic is only judged once it has at least
// MIN_EVIDENCE answers, and the wording is "needs consolidating", never "weakest".

import { SESSION_SIZE, sessionMinutes } from '@/lib/entitlements'
import { MIN_EVIDENCE, topicEvidence } from '@/lib/topicEvidence'

/** How many of the student's latest wrong answers in this subject we look at. */
export const RECENT_ERROR_WINDOW = 10
/** Wrong answers older than this do not count as recent. */
export const RECENT_ERROR_DAYS = 14
/** A topic needs at least this many of those recent wrong answers to be named for them. */
export const MIN_RECENT_ERRORS = 2
/** A topic finished at 80%+ within this many hours is not suggested again straight away. */
export const JUST_PRACTISED_HOURS = 3

export interface RecommendInput {
  subject: string
  /** Published topics with their question counts (SUBJECT_TOPICS). */
  questionCounts: readonly { id: string; count: number; mcCount?: number }[]
  /** This subject's per-topic tally from dse_topic_stats, keyed by topic id. */
  topicEvidence: Readonly<Record<string, { total: number; wrong: number }>>
  /** dse_reverse_log entries (any subject; filtered here). */
  recentErrors: readonly { subjectId: string; topicId?: string; ts: number }[]
  /** dse_progress attempts (any subject; filtered here). */
  recentSessions: readonly { subjectId: string; topicFilter: string | null; score: number; total: number; timestamp: number }[]
  now?: number
}

export type RecommendReason =
  | { kind: 'recentErrors'; inTopic: number; considered: number }
  | { kind: 'lowAccuracy'; correct: number; answered: number }
  | { kind: 'untried' }

export interface Recommendation {
  subject: string
  topic: string
  reason: RecommendReason
  estimatedMinutes: number
}

export function recommendNextPractice(input: RecommendInput): Recommendation | null {
  const now = input.now ?? Date.now()
  // Only topics students can actually practise: published multiple-choice questions.
  const practisable = input.questionCounts.filter((t) => (t.mcCount ?? t.count) > 0)
  const ids = new Set(practisable.map((t) => t.id))

  const justPractised = new Set(
    input.recentSessions
      .filter(
        (s) =>
          s.subjectId === input.subject &&
          s.topicFilter &&
          now - s.timestamp < JUST_PRACTISED_HOURS * 3600_000 &&
          s.total > 0 &&
          s.score / s.total >= 0.8,
      )
      .map((s) => s.topicFilter as string),
  )
  const usable = (id: string) => ids.has(id) && !justPractised.has(id)
  const evidence = (id: string) => topicEvidence(input.topicEvidence[id])
  const make = (topic: string, reason: RecommendReason): Recommendation => ({
    subject: input.subject,
    topic,
    reason,
    estimatedMinutes: sessionMinutes(SESSION_SIZE),
  })

  // 1. Recent wrong answers cluster in one topic (and that topic has enough evidence).
  const recent = input.recentErrors
    .filter((e) => e.subjectId === input.subject && now - e.ts <= RECENT_ERROR_DAYS * 86400_000)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, RECENT_ERROR_WINDOW)
  const byTopic = new Map<string, number>()
  for (const e of recent) if (e.topicId) byTopic.set(e.topicId, (byTopic.get(e.topicId) ?? 0) + 1)
  let cluster: { id: string; n: number } | null = null
  for (const [id, n] of byTopic) {
    if (n < MIN_RECENT_ERRORS || !usable(id) || evidence(id).answered < MIN_EVIDENCE) continue
    if (!cluster || n > cluster.n) cluster = { id, n }
  }
  if (cluster) return make(cluster.id, { kind: 'recentErrors', inTopic: cluster.n, considered: recent.length })

  // 2. Lowest accuracy among topics with enough evidence that are not yet steady.
  let low: { id: string; correct: number; answered: number; acc: number } | null = null
  for (const t of practisable) {
    if (!usable(t.id)) continue
    const e = evidence(t.id)
    if (e.level !== 'weak' && e.level !== 'fair') continue
    if (!low || e.accuracy < low.acc) {
      low = { id: t.id, correct: Math.round(e.accuracy * e.answered), answered: e.answered, acc: e.accuracy }
    }
  }
  if (low) return make(low.id, { kind: 'lowAccuracy', correct: low.correct, answered: low.answered })

  // 3. A topic not tried yet on this device.
  const untried = practisable.find((t) => usable(t.id) && !(input.topicEvidence[t.id]?.total > 0))
  return untried ? make(untried.id, { kind: 'untried' }) : null
}
