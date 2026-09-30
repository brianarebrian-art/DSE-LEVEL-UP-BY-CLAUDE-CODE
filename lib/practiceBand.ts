// One session's performance in plain learning language (refinement loop 2, 2026-09-30;
// prompt §4–§5).
//
// The result page used to turn ten rewritten questions into a DSE level (5**, 5*, …).
// That reads as an official grade, and ten questions cannot carry it. What we can say
// honestly is how this session went, with the count beside it. There are three bands and
// no "mastered": the words describe a practice session, not the student.

import { MIN_EVIDENCE } from '@/lib/topicEvidence'

/** Fewer questions than this: no band, only the score. Same threshold as topic evidence. */
export const MIN_BAND_EVIDENCE = MIN_EVIDENCE

export type PracticeBand = 'insufficient' | 'consolidate' | 'developing' | 'stable'

export function getPracticePerformanceBand(correct: number, total: number): PracticeBand {
  const n = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0
  if (n < MIN_BAND_EVIDENCE) return 'insufficient'
  const c = Number.isFinite(correct) ? Math.min(n, Math.max(0, Math.floor(correct))) : 0
  const ratio = c / n
  if (ratio < 0.5) return 'consolidate'
  if (ratio < 0.8) return 'developing'
  return 'stable'
}

export const PRACTICE_BAND_LABEL: Record<PracticeBand, { zh: string; en: string }> = {
  insufficient: { zh: '證據不足', en: 'Not enough evidence' },
  consolidate: { zh: '需要鞏固', en: 'Needs consolidating' },
  developing: { zh: '發展中', en: 'Developing' },
  stable: { zh: '相對穩定', en: 'Fairly steady' },
}
