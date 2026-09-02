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

// 等級徽章（實心底＋字）。底色刻意【主題無關】——兩個主題渲染一樣，所以呢批值
// 保持字面色而唔用 token。正因為底色固定，字色必須逐個等級配對：深底配白字、
// 亮底配深字。舊版全部硬套 `text-black`，深藍灰底只有 2.35:1（第 1 級）／
// ── 2026-09-02 莫蘭迪化（規格 v4.0-B §1.2）────────────────────────────────
// 舊值用 Tailwind amber／green／blue-500 一套高飽和色，同莫蘭迪色板格格不入。
// 現改為一條【暗→淺】嘅莫蘭迪階梯，全部配暖白字 #FFFDF9（唔用純白）。
//
// 實測（暖白字落各底色）：
//   5** #3C443A 9.94 · 5* #4A5544 7.73 · 5 #5E6B5A 5.55 · 4 #5B666F 5.78
//   3   #76644F 5.58 · 2  #6B6560 5.65 · 1 #767068 4.82 · U #8A6E6A 4.57
//   達標 #5E6B5A 5.55 · 不達標 #8B5E4A 5.44         —— 全部 ≥ 4.5
//
// ⚠️ 同規格書有一處【刻意偏離】：規格把第 4 級同 5／5*／5** 一齊歸做灰綠，
// 即係四級共用一個色相。實測四者亮度差只有 0.008–0.053，擠喺同一條色相上
// 會分唔開。故第 4 級改用藍灰 #5B666F —— 「上到 L4」係本地學位嘅實際門檻，
// 呢條界要讀得出。第 3／2 級同理用暖土同中性灰，靠【色相】而唔係亮度分級。
//
// U 級用玫瑰灰 #8A6E6A 而唔用紅：憲章禁大紅交叉，U 唔應該睇落似懲罰。
// 字色寫死 hex 而唔用 token：呢批係語意數據色，同 lib/grading.ts 其餘
// gradeColors 一致，唔應該生成 bg-grade-5 之類 utility（見上方原註）。
export const gradeBgColors: Record<string, string> = {
  '5**': 'bg-[#3C443A] text-[#FFFDF9]',
  '5*': 'bg-[#4A5544] text-[#FFFDF9]',
  '5': 'bg-[#5E6B5A] text-[#FFFDF9]',
  '4': 'bg-[#5B666F] text-[#FFFDF9]',
  '3': 'bg-[#76644F] text-[#FFFDF9]',
  '2': 'bg-[#6B6560] text-[#FFFDF9]',
  '1': 'bg-[#767068] text-[#FFFDF9]',
  U: 'bg-[#8A6E6A] text-[#FFFDF9]',
  達標: 'bg-[#5E6B5A] text-[#FFFDF9]',
  不達標: 'bg-[#8B5E4A] text-[#FFFDF9]',
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
  達標: '已達參考水平！繼續保持這個節奏。',
  不達標: '距離參考水平還差一點，再練幾組就補得回來。',
}
