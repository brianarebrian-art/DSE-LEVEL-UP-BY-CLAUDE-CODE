/**
 * Bayesian Knowledge Tracing。
 * 先由觀察更新掌握後驗，再套用學習轉移。參數是教學起點，不是個人擬合結果。
 */

export type BktParams = {
  pL0: number
  pTransit: number
  pGuess: number
  pSlip: number
}

export const DEFAULT_BKT: BktParams = {
  pL0: 0.3,
  pTransit: 0.1,
  pGuess: 0.2,
  pSlip: 0.1,
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function updateMastery(prior: number, correct: boolean, params: BktParams = DEFAULT_BKT): number {
  const pL = clamp01(prior)
  const numerator = correct ? pL * (1 - params.pSlip) : pL * params.pSlip
  const denominator = correct
    ? numerator + (1 - pL) * params.pGuess
    : numerator + (1 - pL) * (1 - params.pGuess)
  const posterior = denominator === 0 ? pL : numerator / denominator
  return clamp01(posterior + (1 - posterior) * params.pTransit)
}
