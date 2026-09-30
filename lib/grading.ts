import type { CutoffTable } from '@/data/cutoffs'

// 公民與社會發展科（csd）唔設 1–5** 等級 —— 官方只有「達標／不達標」二元評級。
// 其餘 24 科維持原有等級制。
export type Grade = '5**' | '5*' | '5' | '4' | '3' | '2' | '1' | 'U' | '達標' | '不達標'

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

// 公社科達標參考線。考評局從未公布過達標分數，所以呢個數【係平台自訂嘅練習
// 參考值，唔係官方線】—— UI 必須明講，唔可以扮成官方標準。
export const CSD_PASS_RATIO = 0.5

export function predictGrade(score: number, table: CutoffTable, subjectSlug?: string): GradeResult {
  const { totalMarks, cutoffs } = table
  const percentage = Math.round((score / totalMarks) * 100)

  // 公社科分支：只回達標／不達標，冇「距離下一級」概念，故 next 相關欄位為 null。
  // 其餘 24 科完全行返落面原有邏輯，一行都冇改。
  if (subjectSlug === 'csd') {
    const passed = score >= totalMarks * CSD_PASS_RATIO
    return {
      grade: passed ? '達標' : '不達標',
      score,
      totalMarks,
      percentage,
      marksToNextGrade: null,
      nextGrade: null,
      gradePosition: passed ? 1 : Math.max(0, Math.min(1, score / (totalMarks * CSD_PASS_RATIO))),
    }
  }

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

// 等級色（做【文字色】用，例如 /result 嘅等級刻度同大字等級）。
//
// 2026-07-30 對比度修正：原本係一組固定亮色，兩個主題都有唔合格 ——
//   Light（落白卡）：5** 1.96 · 5* 1.53 · 5 2.08 · 4 3.36 · 3 3.62 · 2 4.35
//   Cyber（落深卡）：1 2.25 · 2 3.58 · 3 4.30 · 4 4.63
// 亦即學生睇自己攞幾級嗰一刻，個等級色本身係睇唔清嘅。改為主題變數（見
// globals.css `--grade-*`），Light 全部 ≥4.58、Cyber 全部 ≥6.44。
//
// ⚠️ WCAG 1.4.1：等級【唔可以只靠顏色分辨】。Light 下 5** 與 5* 同屬深金褐、
// 色相接近，分辨主要靠字面「5**」／「5*」本身 —— 呢個係正確做法，唔好為咗
// 拉開色相而犧牲對比度。
export const gradeColors: Record<string, string> = {
  '5**': 'var(--grade-5ss)',
  '5*': 'var(--grade-5s)',
  '5': 'var(--grade-5)',
  '4': 'var(--grade-4)',
  '3': 'var(--grade-3)',
  '2': 'var(--grade-2)',
  '1': 'var(--grade-1)',
  U: 'var(--grade-u)',
  // 公社科：達標用主色青（同 accent 一致），不達標用 gold 而【唔用紅】—— 憲章 §7
  // 禁大紅／打擊自信元素，「未達標」係一個狀態，唔係一個責備。
  達標: 'var(--color-accent)',
  不達標: 'var(--color-gold)',
}

// gradeBgColors（等級徽章底色）及 gradeMessages（「頂尖水平！」等等級訊息）已於 2026-09-30
// （改進循環 2）刪除：結果頁及進度頁不再向學生顯示由練習推出的 DSE 等級，兩者已無人使用。
