import type { CutoffTable } from '@/data/cutoffs'

export type Grade = '5**' | '5*' | '5' | '4' | '3' | '2' | '1' | 'U'

export interface GradeResult {
  grade: Grade
  score: number
  totalMarks: number
  percentage: number
  marksToNextGrade: number | null
  nextGrade: Grade | null
  gradePosition: number // 0–1, position between current and next cutoff
}

const gradeOrder: Grade[] = ['5**', '5*', '5', '4', '3', '2', '1']

export function predictGrade(score: number, table: CutoffTable): GradeResult {
  const { totalMarks, cutoffs } = table
  const percentage = Math.round((score / totalMarks) * 100)

  let grade: Grade = 'U'
  let nextGrade: Grade | null = null
  let marksToNextGrade: number | null = null
  let gradePosition = 0

  for (let i = 0; i < gradeOrder.length; i++) {
    const g = gradeOrder[i]
    if (score >= cutoffs[g as keyof typeof cutoffs]) {
      grade = g
      nextGrade = i > 0 ? gradeOrder[i - 1] : null
      if (nextGrade) {
        const nextCutoff = cutoffs[nextGrade as keyof typeof cutoffs]
        const currentCutoff = cutoffs[g as keyof typeof cutoffs]
        marksToNextGrade = nextCutoff - score
        gradePosition = (score - currentCutoff) / (nextCutoff - currentCutoff)
      } else {
        gradePosition = 1
      }
      break
    }
  }

  if (grade === 'U') {
    nextGrade = '1'
    marksToNextGrade = cutoffs['1'] - score
    gradePosition = Math.max(0, score / cutoffs['1'])
  }

  return {
    grade,
    score,
    totalMarks,
    percentage,
    marksToNextGrade,
    nextGrade,
    gradePosition: Math.max(0, Math.min(1, gradePosition)),
  }
}

export const gradeColors: Record<string, string> = {
  '5**': '#F59E0B',
  '5*': '#FBBF24',
  '5': '#22C55E',
  '4': '#3B82F6',
  '3': '#A855F7',
  '2': '#64748B',
  '1': '#475569',
  U: '#EF4444',
}

export const gradeBgColors: Record<string, string> = {
  '5**': 'bg-amber-500',
  '5*': 'bg-amber-400',
  '5': 'bg-green-500',
  '4': 'bg-blue-500',
  '3': 'bg-purple-500',
  '2': 'bg-slate-500',
  '1': 'bg-slate-600',
  U: 'bg-red-500',
}

export const gradeMessages: Record<string, string> = {
  '5**': '頂尖水平！完美發揮！',
  '5*': '優秀成績！繼續加油！',
  '5': '5 級達標！你掌握到核心邏輯！',
  '4': '不錯！距離 5 級不遠了！',
  '3': '有進步空間，繼續練習！',
  '2': '需要加油，多做練習！',
  '1': '基礎需要鞏固！',
  U: '繼續努力，你可以的！',
}
