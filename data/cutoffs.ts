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

// 練習卷嘅百分比分界線。
//
// ⚠️ 呢組數字係【平台自訂】嘅，唔係考評局公布嘅分數線 —— 考評局從來冇公布過。
// 任何顯示呢組數字嘅畫面，都必須同時講明佢係平台自訂（見 components/
// MasteryEstimate.tsx 同 /methodology）。
//
// 亦因為冇真值可以對，呢組數字【校準唔到】。等級預測 v3 嘅做法係離開分數
// 空間，改用逐層掌握度（lib/mastery.ts）；呢個表保留係因為結果頁仍然要出
// 「本節成績」，而嗰個係一個描述性數字，唔係一個預測。
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

// ── 2026-08-23：已移除 `mathPaper1Cutoffs`（原註釋寫「Official DSE Math
//    Paper 1 cutoffs」）──────────────────────────────────────────────────
//
// 考評局從來冇公布過任何一科嘅分數線。DSE 用水平參照，分數線每年按評卷結果
// 訂立，本身就唔係一個固定數字，亦從來冇對外公開過。把一組平台自行推算嘅
// 數字標成「Official」，係一句冇來源嘅聲稱，而且係最難被學生察覺嗰種 ——
// 佢會用「官方」兩個字借走一份我哋冇嘅權威。
//
// 該常數喺 app 入面從未被使用（只有自己嘅測試引用過），故直接移除，
// 而唔係改個名留低。測試需要一張「非 20 題制」嘅表去證明評級邏輯唔係寫死
// 20 題，嗰張表已改為喺測試檔內自建並明確標示為 fixture。
