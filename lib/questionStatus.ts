// 練習頁各題狀態（UX 循環 LOOP 19；創辦人決定 2，2026-09-30）。
//
// 只顯示，不可撳：決定 2 選 A，作答維持只能向前，不設跳題。
// 答錯稱為「發現盲點」，與結果頁及回饋的用語一致（憲章第 7 條：不用紅色、不寫判決）。

export type QuestionStatus = 'correct' | 'blindSpot' | 'current' | 'todo'

/** 每題一個狀態；已作答的題目按對錯，其餘為「而家」或「未做」。 */
export function questionStatuses(
  total: number,
  answers: readonly ({ isCorrect: boolean } | null | undefined)[],
  current: number,
): QuestionStatus[] {
  return Array.from({ length: Math.max(0, total) }, (_, i) => {
    const a = answers[i]
    if (a) return a.isCorrect ? 'correct' : 'blindSpot'
    return i === current ? 'current' : 'todo'
  })
}

export const QUESTION_STATUS_LABEL: Record<QuestionStatus, { zh: string; en: string }> = {
  correct: { zh: '答啱', en: 'correct' },
  blindSpot: { zh: '發現盲點', en: 'blind spot found' },
  current: { zh: '而家做緊', en: 'current' },
  todo: { zh: '未做', en: 'not yet' },
}
