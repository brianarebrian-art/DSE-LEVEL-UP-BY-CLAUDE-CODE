export interface CutoffTable {
  subject: string
  totalMarks: number
  cutoffs: {
    '5**': number
    '5*': number
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
  }
}

// Percentage boundaries for a generic MC practice session.
// Approximates typical DSE grade distributions; scales to any question count.
const practicePercentages: Record<keyof CutoffTable['cutoffs'], number> = {
  '5**': 0.92,
  '5*': 0.83,
  '5': 0.7,
  '4': 0.55,
  '3': 0.4,
  '2': 0.25,
  '1': 0.12,
}

const gradeKeys: (keyof CutoffTable['cutoffs'])[] = ['5**', '5*', '5', '4', '3', '2', '1']

// Build absolute cutoffs for a practice of `total` questions/marks.
// Enforces strictly-decreasing boundaries so each grade stays distinct where possible.
export function getPracticeCutoffs(total: number, subject = 'practice'): CutoffTable {
  const cutoffs = {} as CutoffTable['cutoffs']
  let prev = total + 1
  for (const g of gradeKeys) {
    let mark = Math.round(practicePercentages[g] * total)
    if (mark >= prev) mark = prev - 1
    if (mark < 0) mark = 0
    cutoffs[g] = mark
    prev = mark
  }
  return { subject, totalMarks: total, cutoffs }
}

// Convenience default for the 12-question math综合 practice.
export const practiceCutoffs: CutoffTable = getPracticeCutoffs(12, 'math')

// Official DSE Math Paper 1 cutoffs (2018–2023 average approximation)
export const mathPaper1Cutoffs: CutoffTable = {
  subject: 'math_paper1',
  totalMarks: 105,
  cutoffs: {
    '5**': 93,
    '5*': 83,
    '5': 72,
    '4': 56,
    '3': 40,
    '2': 24,
    '1': 12,
  },
}
