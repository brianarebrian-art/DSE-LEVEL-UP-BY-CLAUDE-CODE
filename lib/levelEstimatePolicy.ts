// Whether a subject may show a cumulative DSE-level range.
//
// Two independent holds, both display-only: practice history is still stored.
//   no-mc-exam     the 2027 paper has no multiple-choice (data/dse-paper-formats.ts).
//                  MC drills are a concept warm-up and must not be mapped to a level.
//   option-length  the live bank, or the 2026-10-23 audit list, rewards the longest option.
//                  Estimates stay off until that bank is regenerated. The named list does
//                  not drop by itself when a rate dips under the threshold.

import { isMCExamFormat } from '@/data/dse-paper-formats'
import { isLengthBiased } from '@/lib/optionLengthBias'

export const LENGTH_BIAS_ESTIMATE_HOLD = [
  'chinese-history',
  'chinese',
  'chinese-literature',
  'english-literature',
  'ethics-religious',
  'csd',
  'history',
  'visual-arts',
] as const

export type LevelEstimateBlock = 'no-mc-exam' | 'option-length'

export function levelEstimateBlock(subjectId: string): LevelEstimateBlock | null {
  if (!isMCExamFormat(subjectId)) return 'no-mc-exam'
  if ((LENGTH_BIAS_ESTIMATE_HOLD as readonly string[]).includes(subjectId) || isLengthBiased(subjectId)) {
    return 'option-length'
  }
  return null
}
