import { isMCExamFormat } from '@/data/dse-paper-formats'
import { isLengthBiased } from '@/lib/optionLengthBias'

// Why a cumulative level range is withheld. Two independent reasons, both
// already admitted elsewhere: the exam has no multiple-choice paper, or the
// live bank still rewards picking the longest option.
export type EstimateBlock = 'no-mc-exam' | 'length-bias'

export function cumulativeEstimateBlocked(subjectId: string): EstimateBlock | null {
  if (!isMCExamFormat(subjectId)) return 'no-mc-exam'
  if (isLengthBiased(subjectId)) return 'length-bias'
  return null
}
