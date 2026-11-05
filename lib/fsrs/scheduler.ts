/**
 * FSRS-5 排程。公式與預設權重對照 open-spaced-repetition 公開說明
 * （awesome-fsrs Wiki「The Algorithm」的 FSRS-5 一節）。
 * 不在請求路徑跑優化器：未滿 200 次，以及已滿但未經離線核准，都沿用預設權重。
 */

export const FSRS5_DEFAULT_WEIGHTS = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
  0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
] as const

export const FSRS_DECAY = -0.5
/** 令經過 stability 日之後，可提取性剛好是 0.9。 */
export const FSRS_FACTOR = 19 / 81
export const PERSONALIZE_AFTER_REVIEWS = 200
export const DUE_RETRIEVABILITY = 0.9

export type FsrsRating = 1 | 2 | 3 | 4
export type FsrsWeights = readonly number[]

export type CardState = {
  stability: number
  difficulty: number
  retrievability: number
  reviews: number
  elapsedDays: number
}

export type WeightDecision = {
  weights: FsrsWeights
  personalized: false
  reason: 'below-200-reviews' | 'optimizer-not-approved'
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function weightsForReviewCount(reviewCount: number, w: FsrsWeights = FSRS5_DEFAULT_WEIGHTS): WeightDecision {
  if (w.length !== 19) throw new Error('FSRS-5 requires 19 weights')
  if (reviewCount < PERSONALIZE_AFTER_REVIEWS) {
    return { weights: w, personalized: false, reason: 'below-200-reviews' }
  }
  return { weights: w, personalized: false, reason: 'optimizer-not-approved' }
}

export function initialDifficulty(rating: FsrsRating, w: FsrsWeights = FSRS5_DEFAULT_WEIGHTS): number {
  return clamp(w[4] - Math.exp(w[5] * (rating - 1)) + 1, 1, 10)
}

export function initialStability(rating: FsrsRating, w: FsrsWeights = FSRS5_DEFAULT_WEIGHTS): number {
  return w[rating - 1]
}

export function retrievability(elapsedDays: number, stability: number): number {
  if (!(stability > 0) || !(elapsedDays >= 0)) return 0
  if (elapsedDays === 0) return 1
  return (1 + (FSRS_FACTOR * elapsedDays) / stability) ** FSRS_DECAY
}

export function isDue(elapsedDays: number, stability: number, threshold = DUE_RETRIEVABILITY): boolean {
  return retrievability(elapsedDays, stability) < threshold
}

/** 請求保留率 0.9 時，間隔日數等於穩定度（四捨五入，最少 1 日）。 */
export function intervalDays(stability: number, requestRetention = DUE_RETRIEVABILITY): number {
  if (!(stability > 0)) return 1
  const raw = (stability / FSRS_FACTOR) * (requestRetention ** (1 / FSRS_DECAY) - 1)
  return Math.max(1, Math.round(raw))
}

function nextDifficulty(difficulty: number, rating: FsrsRating, w: FsrsWeights): number {
  const delta = -w[6] * (rating - 3)
  const damped = difficulty + delta * ((10 - difficulty) / 9)
  const target = initialDifficulty(4, w)
  return clamp(w[7] * target + (1 - w[7]) * damped, 1, 10)
}

function stabilityAfterSuccess(difficulty: number, stability: number, remembered: number, rating: FsrsRating, w: FsrsWeights): number {
  const hardPenalty = rating === 2 ? w[15] : 1
  const easyBonus = rating === 4 ? w[16] : 1
  const gain = Math.exp(w[8])
    * (11 - difficulty)
    * stability ** -w[9]
    * (Math.exp((1 - remembered) * w[10]) - 1)
    * hardPenalty
    * easyBonus
  return stability * (gain + 1)
}

function stabilityAfterFailure(difficulty: number, stability: number, remembered: number, w: FsrsWeights): number {
  return w[11]
    * difficulty ** -w[12]
    * ((stability + 1) ** w[13] - 1)
    * Math.exp(w[14] * (1 - remembered))
}

function stabilitySameDay(stability: number, rating: FsrsRating, w: FsrsWeights): number {
  return stability * Math.exp(w[17] * (rating - 3 + w[18]))
}

export function applyReview(previous: CardState | null, rating: FsrsRating, elapsedDays: number, w: FsrsWeights = FSRS5_DEFAULT_WEIGHTS): CardState {
  if (w.length !== 19) throw new Error('FSRS-5 requires 19 weights')
  if (!previous) {
    return {
      stability: initialStability(rating, w),
      difficulty: initialDifficulty(rating, w),
      retrievability: 1,
      reviews: 1,
      elapsedDays: 0,
    }
  }
  const elapsed = Math.max(0, elapsedDays)
  const remembered = retrievability(elapsed, previous.stability)
  const difficulty = nextDifficulty(previous.difficulty, rating, w)
  const stability = elapsed < 1
    ? stabilitySameDay(previous.stability, rating, w)
    : rating === 1
      ? stabilityAfterFailure(difficulty, previous.stability, remembered, w)
      : stabilityAfterSuccess(difficulty, previous.stability, remembered, rating, w)
  return {
    stability: Math.min(Math.max(stability, 0.01), 36500),
    difficulty,
    retrievability: remembered,
    reviews: previous.reviews + 1,
    elapsedDays: 0,
  }
}

export function selectDue<T extends { stability: number; elapsedDays: number }>(cards: readonly T[], threshold = DUE_RETRIEVABILITY): T[] {
  return cards.filter((card) => isDue(card.elapsedDays, card.stability, threshold))
}
