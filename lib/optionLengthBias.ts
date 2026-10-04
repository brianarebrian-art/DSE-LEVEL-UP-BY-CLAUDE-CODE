import { LONGEST_OPTION, OPTION_LENGTH_MEASURED_AT } from '@/data/questions/option-length.generated'

// Founders' reply 17C (2026-10-04, wording approved as drafted): where picking the
// longest option succeeds more than half the time, the practice estimate for that
// subject may be too high, and the practice estimate pages say so. The list is
// derived from the live bank (data/questions/option-length.generated.ts), so a
// subject leaves it by itself once its questions are fixed.

/** More than half: the wording promised to students is "超過一半". */
export const LENGTH_BIAS_THRESHOLD = 0.5

export { OPTION_LENGTH_MEASURED_AT }

/** Share of questions with a single longest option where that option is correct; null when none. */
export function longestOptionRate(subjectId: string): number | null {
  const s = LONGEST_OPTION[subjectId]
  return s && s.unique > 0 ? s.correct / s.unique : null
}

export function isLengthBiased(subjectId: string): boolean {
  const r = longestOptionRate(subjectId)
  return r !== null && r > LENGTH_BIAS_THRESHOLD
}

/** Subject ids over the threshold, highest rate first. */
export function lengthBiasedSubjects(): string[] {
  return Object.keys(LONGEST_OPTION)
    .filter(isLengthBiased)
    .sort((a, b) => (longestOptionRate(b) ?? 0) - (longestOptionRate(a) ?? 0))
}
