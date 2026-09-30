// How sure we can be about a student's standing in one topic (UX loop 32, 2026-09-30;
// hardening prompt §9 and §41).
//
// Only the student's own tally on this device (dse_topic_stats) is used. A label is shown
// only with the number of questions behind it, and never "mastered": a handful of answers
// cannot say that, and a false "you've got this" costs a student more than no label.

/** Fewer answers than this: no label at all, only the count. */
export const MIN_EVIDENCE = 5
/** Fewer answers than this: the label comes with "little evidence". */
export const SOLID_EVIDENCE = 15

export type TopicLevel = 'unknown' | 'weak' | 'fair' | 'steady'

export interface TopicEvidence {
  answered: number
  /** 0–1; 0 when nothing answered. */
  accuracy: number
  level: TopicLevel
  lowConfidence: boolean
}

export function topicEvidence(row: { total: number; wrong: number } | undefined): TopicEvidence {
  const answered = Math.max(0, row?.total ?? 0)
  const wrong = Math.min(answered, Math.max(0, row?.wrong ?? 0))
  const accuracy = answered > 0 ? (answered - wrong) / answered : 0
  const level: TopicLevel =
    answered < MIN_EVIDENCE ? 'unknown' : accuracy < 0.5 ? 'weak' : accuracy < 0.8 ? 'fair' : 'steady'
  return { answered, accuracy, level, lowConfidence: answered < SOLID_EVIDENCE }
}

export const LEVEL_LABEL: Record<Exclude<TopicLevel, 'unknown'>, { zh: string; en: string }> = {
  weak: { zh: '要加強', en: 'needs work' },
  fair: { zh: '一般', en: 'fair' },
  steady: { zh: '穩定', en: 'steady' },
}

export type NextStep =
  | { kind: 'weak'; topicId: string; evidence: TopicEvidence }
  | { kind: 'untried'; topicId: string }

/**
 * The one topic most worth the next ten minutes: the lowest-accuracy topic that has
 * enough evidence and is not yet steady; failing that, the first topic with MC questions
 * the student has not tried; otherwise nothing.
 */
export function nextStep(
  topics: readonly { id: string; mcCount?: number; count: number }[],
  statsByTopic: Readonly<Record<string, { total: number; wrong: number }>>,
): NextStep | null {
  const withMc = topics.filter((t) => (t.mcCount ?? t.count) > 0)
  let best: { topicId: string; evidence: TopicEvidence } | null = null
  for (const t of withMc) {
    const e = topicEvidence(statsByTopic[t.id])
    if (e.level !== 'weak' && e.level !== 'fair') continue
    if (!best || e.accuracy < best.evidence.accuracy) best = { topicId: t.id, evidence: e }
  }
  if (best) return { kind: 'weak', ...best }
  const untried = withMc.find((t) => !(statsByTopic[t.id]?.total > 0))
  return untried ? { kind: 'untried', topicId: untried.id } : null
}

/** 本科最需要練的課題：有足夠題數、未達「穩定」、答對率最低的幾個（練習頁 1440px 左欄，LOOP 40）。 */
export function weakestInSubject<R extends { subjectId: string; total: number; wrong: number }>(
  rows: readonly R[],
  subjectId: string,
  limit = 3,
): { r: R; e: TopicEvidence }[] {
  return rows
    .filter((r) => r.subjectId === subjectId)
    .map((r) => ({ r, e: topicEvidence(r) }))
    .filter(({ e }) => e.level === 'weak' || e.level === 'fair')
    .sort((a, b) => a.e.accuracy - b.e.accuracy)
    .slice(0, limit)
}
