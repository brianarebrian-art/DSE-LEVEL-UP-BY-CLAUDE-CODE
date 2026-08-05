// 結果覆核 —— 由服務端用答案庫重新批一次卷，同前端計出嘅分數對數。
//
// ⚠️ 呢個【唔係防作弊】。答案庫本身就 ship 咗落瀏覽器（實測：正解原文出現喺
//    `.next/static/chunks/` 嘅 client chunk 入面），而且必須咁樣 —— 離線批改
//    係硬需求。一個真心想改自己分數嘅學生，讀 bundle 就得，覆核攔唔到。
//
// 佢真正擋到嘅係兩件事，兩件都值得擋：
//   1. `dse_result` 被直接改（改個 key 就算，唔重做卷）—— 一覆核就對唔上。
//   2. 【前後端批改不一致】。選項每次 render 都 Fisher-Yates 洗牌，前端係按
//      選項文字批。如果洗牌邏輯出錯、題庫嘅正解改咗、或者學生揸住舊 bundle，
//      前端同服務端就會計出唔同分數 —— 呢個係真 bug 訊號，而唔係學生問題。
//
// 純函數放呢度（可測），答案庫載入同 HTTP 交畀 route。

/** 學生提交嘅一題。`selectedZh` 為 null = 冇作答。 */
export interface SubmittedAnswer {
  questionId: string
  selectedZh: string | null
}

export interface RegradeOutcome {
  /** 服務端重批出嚟嘅得分 */
  score: number
  /** 有效題數（喺答案庫搵到嘅） */
  total: number
  /** 提交咗但答案庫冇呢個 id —— 題庫改過或者 payload 唔可信 */
  unknownIds: string[]
}

export const MAX_ANSWERS = 200

/**
 * 用答案庫重批。
 *
 * @param answers 學生提交嘅逐題答案
 * @param correctZhOf 由題目 id 攞正解文字；搵唔到回 undefined
 *
 * 比較用【去邊界空白後嘅原文】。刻意唔做更寬鬆嘅正規化（唔剷全形／標點）——
 * 前端批改用嘅係嚴格相等，覆核如果寬鬆過前端，就會反過來遮蔽咗前端嘅
 * 批改 bug，令呢個覆核失去佢唯一嘅實際用途。
 */
export function regrade(
  answers: readonly SubmittedAnswer[],
  correctZhOf: (questionId: string) => string | undefined,
): RegradeOutcome {
  let score = 0
  let total = 0
  const unknownIds: string[] = []

  for (const a of answers) {
    const correct = correctZhOf(a.questionId)
    if (correct === undefined) {
      unknownIds.push(a.questionId)
      continue
    }
    total++
    if (a.selectedZh !== null && a.selectedZh.trim() === correct.trim()) score++
  }

  return { score, total, unknownIds }
}

/** 提交 payload 嘅 shape-guard。呢啲嘢由瀏覽器嚟，一律當唔可信輸入。 */
export function isSubmittedAnswers(v: unknown): v is SubmittedAnswer[] {
  if (!Array.isArray(v) || v.length === 0 || v.length > MAX_ANSWERS) return false
  return v.every(
    (a) =>
      !!a &&
      typeof a === 'object' &&
      typeof (a as SubmittedAnswer).questionId === 'string' &&
      (a as SubmittedAnswer).questionId.length > 0 &&
      (a as SubmittedAnswer).questionId.length <= 100 &&
      ((a as SubmittedAnswer).selectedZh === null ||
        (typeof (a as SubmittedAnswer).selectedZh === 'string' &&
          ((a as SubmittedAnswer).selectedZh as string).length <= 500)),
  )
}
