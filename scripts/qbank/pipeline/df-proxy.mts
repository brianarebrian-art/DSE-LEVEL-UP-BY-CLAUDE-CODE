/**
 * Deterministic DF proxy (docs/05-difficulty-model.md).
 * Structural / reproducible — NOT empirical ratio_p from student attempts.
 */
import { bigramJaccard } from './param-check.mts'

export type DfDims = {
  C: number
  S: number
  R: number
  D: number
  U: number
  M: number
  DF: number
}

/** docs/05: DSE_PLUS_10 intent ≈ median + 0.4～0.6σ → ~8–12% relative accuracy drop.
 * Midpoint 0.5σ maps to 10% relative hardness (P_post/P_pre ≈ 0.9). */
export const PLUS10_SIGMA_MIN = 0.4
export const PLUS10_SIGMA_TARGET = 0.5
export const PLUS10_SIGMA_MAX = 0.6
export const PLUS10_RELATIVE_HARDNESS = 0.1 // → ratio ≈ 0.9

export function computeDf(q: Record<string, unknown>): DfDims {
  const stem = String(q.content ?? '')
  const opts = Array.isArray(q.options) ? (q.options as string[]).map(String) : []
  const expl = String(q.explanation ?? '')
  const type = String(q.type ?? 'mc')

  // C — cognitive (1–6): dual-condition / analyze verbs score higher
  let C = 2
  if (/評價|evaluate|創造|design|批判/i.test(stem)) C = 5
  else if (/解釋|為何|why|compare|分析|analyze|同時符合|both .* and/i.test(stem)) C = 4
  else if (/計算|求|calculate|找出|which/i.test(stem)) C = 3

  // S — reasoning steps (1–10): explanation length + explicit step markers
  const stepMarks = (stem.match(/步驟|先|再|然後|and then|given that|前提/gi) || []).length
  const fromExpl = Math.round(expl.replace(/【全庫升級】[\s\S]*$/, '').length / 80)
  const S = Math.min(10, Math.max(1, Math.max(fromExpl, 1 + stepMarks)))

  // R — representation shift (0–2)
  const R = /圖|表|下圖|graph|table|圖示/i.test(stem)
    ? 2
    : /\$|\\frac|°|μ|Δ|∑|∫/.test(stem)
      ? 1
      : 0

  // D — distractor strength (1–5)
  let D = 2
  if (opts.length >= 2) {
    const lengths = opts.map((o) => o.length)
    const skew = Math.max(...lengths) / Math.max(1, Math.min(...lengths))
    D = skew > 2.5 ? 4 : skew > 1.6 ? 3 : 2
    let nearDup = 0
    for (let i = 0; i < opts.length; i++) {
      for (let j = i + 1; j < opts.length; j++) {
        if (bigramJaccard(opts[i], opts[j]) > 0.7) nearDup++
      }
    }
    // Near-duplicate options weaken distractor quality (docs/05 D)
    if (nearDup > 0) D = Math.max(1, D - 1)
  } else if (type !== 'mc') {
    D = /評分|rubric|步驟|必須/i.test(expl) ? 3 : 2
  }

  // U — unfamiliarity / stem load (1–5)
  const U = stem.length > 220 ? 4 : stem.length > 120 ? 3 : 2

  // M — multi-constraint / cross-topic (1–3)
  const multi =
    (stem.match(/以及|同時|and then|given that|both |雙重|跨課題/gi) || []).length > 0
  const M = /跨課題|cross-?topic/i.test(stem) ? 3 : multi ? 2 : 1

  const DF = 0.3 * C + 0.2 * S + 0.15 * R + 0.15 * D + 0.1 * U + 0.1 * M
  return {
    C,
    S,
    R,
    D,
    U,
    M,
    DF: Math.round(DF * 1000) / 1000,
  }
}

export function mean(xs: number[]): number {
  if (!xs.length) return 0
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

export function stdev(xs: number[]): number {
  if (xs.length < 2) return 0
  const m = mean(xs)
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1)
  return Math.sqrt(v)
}

export function median(xs: number[]): number {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/**
 * Map σ-lift to implied relative accuracy drop using docs/05 midpoint:
 * 0.5σ → 10% relative (ratio 0.9). Linear in the 0.4–0.6σ band.
 */
export function sigmaToRelativeHardness(sigmaLift: number): number {
  if (!Number.isFinite(sigmaLift) || sigmaLift <= 0) return 0
  return (sigmaLift / PLUS10_SIGMA_TARGET) * PLUS10_RELATIVE_HARDNESS
}

/** Implied facility ratio vs own baseline: P_post/P_pre ≈ 1 - relative_hardness. */
export function impliedRatioFromSigma(sigmaLift: number): number {
  return Math.max(0.05, 1 - sigmaToRelativeHardness(sigmaLift))
}

export function meetsPlus10(sigmaLift: number): boolean {
  return sigmaLift + 1e-9 >= PLUS10_SIGMA_MIN
}
