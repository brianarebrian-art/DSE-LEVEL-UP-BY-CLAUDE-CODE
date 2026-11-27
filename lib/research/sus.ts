export const SUS_STATEMENTS = [
  '我會想經常使用呢個系統。',
  '我覺得呢個系統複雜得冇必要。',
  '我覺得呢個系統容易使用。',
  '我覺得我需要技術人員幫手先用到呢個系統。',
  '我覺得呢個系統嘅各項功能整合得好好。',
  '我覺得呢個系統有太多前後不一致。',
  '我覺得大多數人會好快學識用呢個系統。',
  '我覺得呢個系統用起上嚟好礙手礙腳。',
  '我用呢個系統嘅時候好有信心。',
  '我要學好多嘢先可以開始用呢個系統。',
] as const

/** Brooke SUS：單數題用分數減 1，雙數題用 5 減分數，總和再乘 2.5，範圍 0–100。 */
export function susScore(scores: readonly number[]): number | null {
  if (scores.length !== SUS_STATEMENTS.length) return null
  if (scores.some((score) => !Number.isInteger(score) || score < 1 || score > 5)) return null
  let sum = 0
  scores.forEach((score, index) => {
    sum += index % 2 === 0 ? score - 1 : 5 - score
  })
  return sum * 2.5
}
