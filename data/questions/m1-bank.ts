import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, n, frac, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// M1 (Calculus & Statistics) — PARAMETRIC BANK (Mode A, correct-by-construction)
// PROPER M1 syllabus content (differentiation/integration, binomial theorem,
// binomial/Poisson/normal distributions) — NOT recycled core-math. Every answer
// + distractor computed by formula; the shared add() drops non-4-distinct tuples.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  diff: { id: 'differentiation', zh: '微分', en: 'Differentiation' },
  integ: { id: 'integration', zh: '積分', en: 'Integration' },
  // 2026-08-23：id 由 'binomial_theorem' 改為 'binomial'。
  // m1.ts 早已註冊 'binomial'（二項式定理），本檔卻另立一個 'binomial_theorem'，
  // 令 10 條題目掛在一個【未註冊】的課題之上，學生由課題入口永遠篩不到。
  // 與 chemistry-bank.ts 的 'mole_concept' 屬同一個病：code-generated bank 的
  // T map 自行開了一個與註冊表不同的 id。
  // ⚠️ m2.ts 同樣使用 'binomial_theorem'，但該 id 在 m2 是【已註冊】的，
  //    故不可一併改動 —— 兩科的註冊表本來就不同。
  binomialThm: { id: 'binomial', zh: '二項式定理', en: 'Binomial Theorem' },
  // ── 2026-08-28 平均分佈補強 ────────────────────────────────────────────
  // 實測 M1 12 個課題：differentiation 已有 142 條，而 m1_normal_calc 僅 1 條、
  // m1_distributions 3 條（平均目標 83）。依指示先補題數最少者。
  normalCalc: { id: 'm1_normal_calc', zh: '正態分佈計算', en: 'Normal distribution — calculation' },
  distHigh: { id: 'm1_distributions', zh: '概率分佈（高階）', en: 'Probability distributions' },
  statInf: { id: 'statistics_inference', zh: '統計推斷', en: 'Statistical Inference' },
  probDist: { id: 'probability_dist', zh: '概率分佈', en: 'Probability Distributions' },
  expLog: { id: 'exp_log_calculus', zh: '指數對數微積分', en: 'Exponential & Logarithmic Calculus' },
  calcApp: { id: 'calculus_app', zh: '微積分應用', en: 'Applications of Calculus' },
  permComb: { id: 'permutation_combination', zh: '排列與組合', en: 'Permutations & Combinations' },
  binomialDist: { id: 'binomial_distribution', zh: '二項分佈', en: 'Binomial Distribution' },
  poisson: { id: 'poisson_distribution', zh: '泊松分佈', en: 'Poisson Distribution' },
  normal: { id: 'normal_distribution', zh: '正態分佈', en: 'Normal Distribution' },
} satisfies Record<string, TopicMeta>

const FW = {
  calc: { id: 'calculus', zh: '微積分', en: 'Calculus', emoji: '📈' },
  stats: { id: 'statistics', zh: '統計', en: 'Statistics', emoji: '📊' },
  modelling: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  rate: { id: 'rate_of_change', zh: '變化率直覺', en: 'Rate-of-change Intuition', emoji: '📈' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('m1')

const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1))
const nCr = (k: number, r: number): number => (r < 0 || r > k ? 0 : fact(k) / (fact(r) * fact(k - r)))
const nPr = (k: number, r: number): number => (r < 0 || r > k ? 0 : fact(k) / fact(k - r))
// format "k x^{p}" — drops a coefficient of ±1 (so "1x²" renders as "x²")
const pw = (k: number, p: number): string => {
  if (p === 0) return `${k}`
  const base = p === 1 ? 'x' : `x^{${p}}`
  if (k === 1) return base
  if (k === -1) return `-${base}`
  return `${k}${base}`
}

// ═══════════════════════════════════════════════════════════════════════════
// 補底 (easy) — target ~30%
// ═══════════════════════════════════════════════════════════════════════════

// E1 — differentiate a power: d/dx(a xⁿ) = a·n·xⁿ⁻¹
for (let a = 2; a <= 6; a++) {
  for (let p = 2; p <= 6; p++) {
    if (a === p) continue
    add(`m1_e1_${a}_${p}`, T.diff, FW.calc, 'easy',
      [`求 $\\dfrac{d}{dx}(${pw(a, p)})$。`, `Find $\\dfrac{d}{dx}(${pw(a, p)})$.`],
      [n(`$${pw(a * p, p - 1)}$`), n(`$${pw(a, p - 1)}$`), n(`$${pw(a * p, p)}$`), n(`$${pw(p, p - 1)}$`)],
      [`冪法則：$\\dfrac{d}{dx}(ax^n) = an\\,x^{n-1} = ${pw(a * p, p - 1)}$。陷阱：$${pw(a, p - 1)}$ 漏了 $\\times n$；$${pw(a * p, p)}$ 漏了指數減一。`,
       `Power rule: $\\frac{d}{dx}(ax^n)=an\\,x^{n-1}=${pw(a * p, p - 1)}$. Trap: $${pw(a, p - 1)}$ forgets $\\times n$.`])
  }
}

// E2 — integrate a power: ∫ a xⁿ dx = [a/(n+1)] xⁿ⁺¹ + C  (a chosen = (n+1)·k → clean coeff)
for (let p = 1; p <= 5; p++) {
  for (let k = 1; k <= 4; k++) {
    const a = (p + 1) * k // integral coefficient becomes k
    add(`m1_e2_${p}_${k}`, T.integ, FW.calc, 'easy',
      [`求 $\\displaystyle\\int ${pw(a, p)}\\,dx$。`, `Find $\\displaystyle\\int ${pw(a, p)}\\,dx$.`],
      [n(`$${pw(k, p + 1)} + C$`), n(`$${pw(a, p + 1)} + C$`), n(`$${pw(a * (p + 1), p + 1)} + C$`), n(`$${pw(k, p - 1)} + C$`)],
      [`冪的積分：$\\int ax^n\\,dx = \\dfrac{a}{n+1}x^{n+1}+C = ${pw(k, p + 1)}+C$。陷阱：$${pw(a, p + 1)}+C$ 漏了除以 $(n+1)$。`,
       `$\\int ax^n\\,dx = \\frac{a}{n+1}x^{n+1}+C = ${pw(k, p + 1)}+C$. Trap: $${pw(a, p + 1)}+C$ forgets $\\div(n+1)$.`])
  }
}

// E3 — binomial coefficient C(n, r)
for (let m = 4; m <= 8; m++) {
  for (let r = 2; r <= m - 2; r++) {
    add(`m1_e3_${m}_${r}`, T.binomialThm, FW.stats, 'easy',
      [`求 $\\binom{${m}}{${r}}$（即 $C^{${m}}_{${r}}$）的值。`, `Find $\\binom{${m}}{${r}}$ (i.e. $C^{${m}}_{${r}}$).`],
      [n(`$${nCr(m, r)}$`), n(`$${nPr(m, r)}$`), n(`$${nCr(m, r) * 2}$`), n(`$${m * r}$`)],
      [`$\\binom{${m}}{${r}} = \\dfrac{${m}!}{${r}!(${m}-${r})!} = ${nCr(m, r)}$。陷阱：$${nPr(m, r)}$ 是排列 $P^{${m}}_{${r}}$（沒有除 $r!$）。`,
       `$\\binom{${m}}{${r}} = ${nCr(m, r)}$. Trap: $${nPr(m, r)}$ is the permutation $P^{${m}}_{${r}}$ (missing $\\div r!$).`])
  }
}

// E4 — binomial distribution mean = np
for (let m = 5; m <= 20; m += 5) {
  for (const [pn, pd] of [[1, 2], [1, 5], [2, 5], [3, 10], [1, 4]] as const) {
    if ((m * pn) % pd !== 0) continue
    const mean = (m * pn) / pd
    add(`m1_e4_${m}_${pn}_${pd}`, T.binomialDist, FW.stats, 'easy',
      [`$X \\sim B(${m}, ${frac(pn, pd)})$，求 $X$ 的期望值 $E(X)$。`, `$X \\sim B(${m}, ${frac(pn, pd)})$. Find $E(X)$.`],
      [n(`$${mean}$`), n(`$${round(m * pn / pd * (1 - pn / pd), 2)}$`), n(`$${m + round(pn / pd, 2)}$`), n(`$${round(pn / pd, 2)}$`)],
      [`二項分佈 $E(X) = np = ${m} \\times ${frac(pn, pd)} = ${mean}$。陷阱：$${round(m * pn / pd * (1 - pn / pd), 2)}$ 是方差 $np(1-p)$。`,
       `Binomial $E(X)=np=${mean}$. Trap: $${round(m * pn / pd * (1 - pn / pd), 2)}$ is the variance $np(1-p)$.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 普通 (medium) — target ~50%
// ═══════════════════════════════════════════════════════════════════════════

// M1 — differentiate a polynomial term and evaluate: d/dx(xⁿ)|_{x=k} = n·kⁿ⁻¹
for (let p = 2; p <= 4; p++) {
  for (let k = 2; k <= 8; k++) {
    const val = p * Math.pow(k, p - 1)
    add(`m1_m1_${p}_${k}`, T.diff, FW.calc, 'medium',
      [`設 $f(x) = x^{${p}}$，求 $f'(${k})$。`, `Let $f(x) = x^{${p}}$. Find $f'(${k})$.`],
      [n(`$${val}$`), n(`$${Math.pow(k, p)}$`), n(`$${p * Math.pow(k, p)}$`), n(`$${Math.pow(k, p - 1)}$`)],
      [`$f'(x) = ${p}x^{${p - 1}}$，故 $f'(${k}) = ${p}\\times${k}^{${p - 1}} = ${val}$。陷阱：$${Math.pow(k, p)}$ 沒有求導（是 $f(${k})$）。`,
       `$f'(x)=${p}x^{${p - 1}}$ ⇒ $f'(${k})=${val}$. Trap: $${Math.pow(k, p)}$ is $f(${k})$, not $f'(${k})$.`])
  }
}

// M2 — differentiate an exponential: d/dx(e^{ax}) = a·e^{ax}
for (let a = 2; a <= 15; a++) {
  add(`m1_m2_${a}`, T.diff, FW.calc, 'medium',
    [`求 $\\dfrac{d}{dx}(e^{${a}x})$。`, `Find $\\dfrac{d}{dx}(e^{${a}x})$.`],
    [n(`$${a}e^{${a}x}$`), n(`$e^{${a}x}$`), n(`$${a}xe^{${a}x}$`), n(`$${a}e^{${a - 1 === 1 ? '' : a - 1}x}$`)],
    [`鏈式法則：$\\dfrac{d}{dx}(e^{ax}) = a\\,e^{ax} = ${a}e^{${a}x}$。陷阱：$e^{${a}x}$ 漏了 $\\times a$；$${a}xe^{${a}x}$ 誤當冪函數。`,
     `Chain rule: $\\frac{d}{dx}(e^{ax})=a\\,e^{ax}=${a}e^{${a}x}$. Trap: $e^{${a}x}$ forgets $\\times a$.`])
}

// M3 — definite integral of a power: ∫₀ᵇ a xⁿ dx = a·bⁿ⁺¹/(n+1)  (chosen clean)
for (let p = 1; p <= 3; p++) {
  for (let b = 2; b <= 4; b++) {
    const a = p + 1 // makes a/(n+1) = 1
    const val = (a * Math.pow(b, p + 1)) / (p + 1)
    const noDiv = a * Math.pow(b, p + 1) // forgot ÷(n+1)
    add(`m1_m3_${p}_${b}`, T.integ, FW.calc, 'medium',
      [`求 $\\displaystyle\\int_{0}^{${b}} ${pw(a, p)}\\,dx$。`, `Find $\\displaystyle\\int_{0}^{${b}} ${pw(a, p)}\\,dx$.`],
      [n(`$${val}$`), n(`$${noDiv}$`), n(`$${a * Math.pow(b, p)}$`), n(`$${round(val / 2, 2)}$`)],
      [`$\\int_0^{${b}} ${pw(a, p)}\\,dx = \\left[${pw(1, p + 1)}\\right]_0^{${b}} = ${b}^{${p + 1}} = ${val}$。陷阱：$${noDiv}$ 漏了除以 $(n+1)$。`,
       `$\\int_0^{${b}} ${pw(a, p)}\\,dx = ${val}$. Trap: $${noDiv}$ forgets $\\div(n+1)$.`])
  }
}

// M4 — binomial probability with p = 1/2: P(X=r) = C(n,r)/2ⁿ
for (let m = 3; m <= 6; m++) {
  for (let r = 1; r <= m - 1; r++) {
    const den = Math.pow(2, m)
    add(`m1_m4_${m}_${r}`, T.binomialDist, FW.stats, 'medium',
      [`$X \\sim B(${m}, \\tfrac12)$，求 $P(X = ${r})$。`, `$X \\sim B(${m}, \\tfrac12)$. Find $P(X = ${r})$.`],
      [n(`$${frac(nCr(m, r), den)}$`), n(`$${frac(nCr(m, r), Math.pow(2, r))}$`), n(`$${frac(nPr(m, r), den)}$`), n(`$${frac(1, den)}$`)],
      [`$P(X=r) = \\binom{${m}}{${r}}\\left(\\tfrac12\\right)^{${r}}\\left(\\tfrac12\\right)^{${m - r}} = \\dfrac{${nCr(m, r)}}{2^{${m}}} = ${frac(nCr(m, r), den)}$。陷阱：分母應為 $2^{${m}}$ 而非 $2^{${r}}$。`,
       `$P(X=r) = \\frac{\\binom{${m}}{${r}}}{2^{${m}}} = ${frac(nCr(m, r), den)}$. Trap: denominator is $2^{${m}}$, not $2^{${r}}$.`])
  }
}

// M5 — standardise a normal variable: z = (x − μ)/σ
for (const mu of [50, 60, 100]) {
  for (const sigma of [4, 5, 8, 10]) {
    for (const dz of [1, 2, 3]) {
      const x = mu + dz * sigma // z comes out an integer
      add(`m1_m5_${mu}_${sigma}_${dz}`, T.normal, FW.stats, 'medium',
        [`$X \\sim N(${mu}, ${sigma}^2)$，求 $X = ${x}$ 的標準分數 $z$。`, `$X \\sim N(${mu}, ${sigma}^2)$. Find the $z$-score of $X = ${x}$.`],
        [n(`$${dz}$`), n(`$${round((x - mu) / (sigma * sigma), 3)}$`), n(`$${x - mu}$`), n(`$${round((x + mu) / sigma, 2)}$`)],
        [`$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sigma}} = ${dz}$。陷阱：$${round((x - mu) / (sigma * sigma), 3)}$ 誤除以方差 $\\sigma^2$；$${x - mu}$ 漏了除以 $\\sigma$。`,
         `$z = \\frac{x-\\mu}{\\sigma} = ${dz}$. Trap: dividing by the variance $\\sigma^2$ gives $${round((x - mu) / (sigma * sigma), 3)}$.`])
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 拔尖 (hard) — target ~20%
// ═══════════════════════════════════════════════════════════════════════════

// H1 — product rule: d/dx(xⁿ e^{ax}) = e^{ax}(a xⁿ + n xⁿ⁻¹)
for (let a = 2; a <= 5; a++) {
  for (let p = 2; p <= 4; p++) {
    add(`m1_h1_${a}_${p}`, T.diff, FW.calc, 'hard',
      [`求 $\\dfrac{d}{dx}(x^{${p}} e^{${a}x})$。`, `Find $\\dfrac{d}{dx}(x^{${p}} e^{${a}x})$.`],
      [n(`$e^{${a}x}(${pw(a, p)} + ${pw(p, p - 1)})$`),
       n(`$${a}${pw(p, p - 1)}e^{${a}x}$`),
       n(`$e^{${a}x}(${pw(a, p)} - ${pw(p, p - 1)})$`),
       n(`$${pw(p, p - 1)}e^{${a}x}$`)],
      [`乘積法則：$(uv)' = u'v + uv'$，$u=x^{${p}}$、$v=e^{${a}x}$ ⇒ $\\dfrac{d}{dx} = ${pw(p, p - 1)}e^{${a}x} + x^{${p}}\\cdot${a}e^{${a}x} = e^{${a}x}(${pw(a, p)} + ${pw(p, p - 1)})$。陷阱：$${pw(p, p - 1)}e^{${a}x}$ 只求了 $x^{${p}}$ 一項，漏了 $e^{${a}x}$ 求導。`,
       `Product rule ⇒ $e^{${a}x}(${pw(a, p)} + ${pw(p, p - 1)})$. Trap: $${pw(p, p - 1)}e^{${a}x}$ differentiates only $x^{${p}}$.`])
  }
}

// H2 — minimum value of a quadratic: f(x)=a x²+b x+c has min c − b²/(4a) (a>0)
for (let a = 1; a <= 3; a++) {
  for (let b = -6; b <= 6; b += 2) {
    for (const c of [1, 3, 5]) {
      if (b === 0) continue
      if ((b * b) % (4 * a) !== 0) continue // keep the minimum an integer
      const minVal = c - (b * b) / (4 * a)
      const sgn = (v: number) => (v < 0 ? ` - ${Math.abs(v)}x` : ` + ${v}x`)
      const eq = `${a === 1 ? '' : a}x^2${sgn(b)} + ${c}`
      add(`m1_h2_${a}_${b + 8}_${c}`, T.diff, FW.calc, 'hard',
        [`求函數 $f(x) = ${eq}$ 的最小值。`, `Find the minimum value of $f(x) = ${eq}$.`],
        [n(`$${minVal}$`), n(`$${c}$`), n(`$${c + (b * b) / (4 * a)}$`), n(`$${round(-b / (2 * a), 2)}$`)],
        [`$f'(x) = ${2 * a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = 0$ ⇒ $x = ${frac(-b, 2 * a)}$，代回 $f = c - \\dfrac{b^2}{4a} = ${c} - ${(b * b) / (4 * a)} = ${minVal}$。陷阱：$${round(-b / (2 * a), 2)}$ 是取得最小值的 $x$，並非最小值本身。`,
         `Stationary at $x=${frac(-b, 2 * a)}$; min $= c-\\frac{b^2}{4a} = ${minVal}$. Trap: $${round(-b / (2 * a), 2)}$ is the $x$-value, not the minimum.`])
    }
  }
}

// H3 — binomial "at least one": P(X ≥ 1) = 1 − (1−p)ⁿ, p = 1/2 ⇒ (2ⁿ−1)/2ⁿ
for (let m = 3; m <= 7; m++) {
  const den = Math.pow(2, m)
  add(`m1_h3_${m}`, T.binomialDist, FW.stats, 'hard',
    [`$X \\sim B(${m}, \\tfrac12)$，求 $P(X \\ge 1)$。`, `$X \\sim B(${m}, \\tfrac12)$. Find $P(X \\ge 1)$.`],
    [n(`$${frac(den - 1, den)}$`), n(`$${frac(1, den)}$`), n(`$${frac(m, den)}$`), n(`$${frac(den - 1, Math.pow(2, m - 1))}$`)],
    [`用補集：$P(X\\ge1) = 1 - P(X=0) = 1 - \\left(\\tfrac12\\right)^{${m}} = 1 - \\dfrac{1}{2^{${m}}} = ${frac(den - 1, den)}$。陷阱：$${frac(1, den)}$ 是 $P(X=0)$ 本身（未用補集）。`,
     `Complement: $P(X\\ge1)=1-\\left(\\tfrac12\\right)^{${m}}=${frac(den - 1, den)}$. Trap: $${frac(1, den)}$ is $P(X=0)$ itself.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 四個最薄課題（2026-08-28）
// ═══════════════════════════════════════════════════════════════════════════

// NC1 — 標準分數 z = (x − μ) / σ
for (const mu of [50, 60, 70, 80, 100]) {
  for (const sd of [4, 5, 8, 10]) {
    for (const z of [1, 2, 3, -1, -2]) {
      const x = mu + z * sd
      add(`m1b_nc1_${mu}_${sd}_${z}`, T.normalCalc, FW.modelling, 'easy',
        [`某正態分佈的平均數 $\\mu = ${mu}$、標準差 $\\sigma = ${sd}$。數值 $x = ${x}$ 的標準分數是多少？`,
         `A normal distribution has mean $\\mu = ${mu}$ and standard deviation $\\sigma = ${sd}$. What is the standard score of $x = ${x}$?`],
        [n(`$${z}$`), n(`$${round((x + mu) / sd, 3)}$`), n(`$${x - mu}$`), n(`$${round(sd / (x - mu === 0 ? 1 : x - mu), 3)}$`)],
        [`標準分數 $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sd}} = ${z}$。$z$ 表示該數值距離平均數多少個標準差，負值代表在平均數之下。陷阱：$${x - mu}$ 只求了差而未除以標準差；$${round((x + mu) / sd, 3)}$ 把減號寫成加號；$${round(sd / (x - mu === 0 ? 1 : x - mu), 3)}$ 上下倒轉。`,
         `The standard score is $z = \\frac{x - \\mu}{\\sigma} = \\frac{${x} - ${mu}}{${sd}} = ${z}$, giving the number of standard deviations from the mean, with a negative value meaning below the mean. Traps: $${x - mu}$ stops at the difference without dividing; $${round((x + mu) / sd, 3)}$ adds instead of subtracting; $${round(sd / (x - mu === 0 ? 1 : x - mu), 3)}$ inverts the fraction.`])
    }
  }
}

// PD1 — 二項分佈期望值 E(X) = np 與方差 Var(X) = np(1−p)
for (const nn of [10, 20, 40, 50, 80, 100]) {
  for (const pp of [0.1, 0.2, 0.25, 0.5]) {
    const ev = nn * pp, va = nn * pp * (1 - pp)
    if (!Number.isInteger(ev)) continue
    add(`m1b_pd1a_${nn}_${String(pp).replace('.', '')}`, T.probDist, FW.modelling, 'easy',
      [`設 $X \\sim B(${nn},\\ ${pp})$。求 $E(X)$。`, `Let $X \\sim B(${nn},\\ ${pp})$. Find $E(X)$.`],
      [n(`$${ev}$`), n(`$${round(va, 3)}$`), n(`$${nn}$`), n(`$${round(nn / pp, 2)}$`)],
      [`二項分佈的期望值 $E(X) = np = ${nn} \\times ${pp} = ${ev}$。陷阱：$${round(va, 3)}$ 是方差 $np(1-p)$；$${nn}$ 只抄了試驗次數；$${round(nn / pp, 2)}$ 用了除法。`,
       `For a binomial distribution $E(X) = np = ${nn} \\times ${pp} = ${ev}$. Traps: $${round(va, 3)}$ is the variance $np(1-p)$; $${nn}$ copies the number of trials; $${round(nn / pp, 2)}$ divides.`])
    add(`m1b_pd1b_${nn}_${String(pp).replace('.', '')}`, T.distHigh, FW.decompose, 'medium',
      [`設 $X \\sim B(${nn},\\ ${pp})$。求 $\\operatorname{Var}(X)$。`, `Let $X \\sim B(${nn},\\ ${pp})$. Find $\\operatorname{Var}(X)$.`],
      [n(`$${round(va, 3)}$`), n(`$${ev}$`), n(`$${round(nn * pp * pp, 3)}$`), n(`$${round(Math.sqrt(va), 3)}$`)],
      [`二項分佈的方差 $\\operatorname{Var}(X) = np(1-p) = ${nn} \\times ${pp} \\times ${round(1 - pp, 2)} = ${round(va, 3)}$。陷阱：$${ev}$ 是期望值 $np$；$${round(nn * pp * pp, 3)}$ 誤用 $np^2$；$${round(Math.sqrt(va), 3)}$ 是標準差，即方差的平方根。`,
       `For a binomial distribution $\\operatorname{Var}(X) = np(1-p) = ${nn} \\times ${pp} \\times ${round(1 - pp, 2)} = ${round(va, 3)}$. Traps: $${ev}$ is the mean $np$; $${round(nn * pp * pp, 3)}$ uses $np^2$; $${round(Math.sqrt(va), 3)}$ is the standard deviation, the square root of the variance.`])
  }
}

// PD2 — 泊松分佈期望值與方差同為 λ
for (const lam of [2, 3, 4, 5, 6, 8]) {
  add(`m1b_pd2_${lam}`, T.probDist, FW.modelling, 'medium',
    [`設 $X \\sim \\mathrm{Po}(${lam})$。$E(X)$ 與 $\\operatorname{Var}(X)$ 分別是多少？`,
     `Let $X \\sim \\mathrm{Po}(${lam})$. What are $E(X)$ and $\\operatorname{Var}(X)$?`],
    [[`$${lam}$ 與 $${lam}$`, `$${lam}$ and $${lam}$`],
     [`$${lam}$ 與 $${round(Math.sqrt(lam), 3)}$`, `$${lam}$ and $${round(Math.sqrt(lam), 3)}$`],
     [`$${lam}$ 與 $${lam * lam}$`, `$${lam}$ and $${lam * lam}$`],
     [`$${round(Math.sqrt(lam), 3)}$ 與 $${lam}$`, `$${round(Math.sqrt(lam), 3)}$ and $${lam}$`]],
    [`泊松分佈的期望值與方差同樣等於參數 $\\lambda$，故兩者皆為 $${lam}$。這是泊松分佈的標誌性特徵，亦是判別題目該用泊松還是二項的線索之一。陷阱：$${round(Math.sqrt(lam), 3)}$ 是標準差；$${lam * lam}$ 誤以為方差是 $\\lambda^2$。`,
     `For a Poisson distribution both the mean and the variance equal the parameter $\\lambda$, so both are $${lam}$. This equality is the signature of the Poisson distribution and one clue for deciding between Poisson and binomial. Traps: $${round(Math.sqrt(lam), 3)}$ is the standard deviation; $${lam * lam}$ takes the variance as $\\lambda^2$.`])
}

// SI1 — 樣本平均數的標準誤 σ/√n
for (const sd of [6, 10, 12, 20, 30]) {
  for (const nn of [4, 9, 16, 25, 36]) {
    const se = sd / Math.sqrt(nn)
    if (!Number.isInteger(se * 100)) continue
    add(`m1b_si1_${sd}_${nn}`, T.statInf, FW.modelling, 'medium',
      [`某母體的標準差為 $${sd}$。由該母體抽取大小為 $${nn}$ 的樣本，其樣本平均數的標準誤是多少？`,
       `A population has standard deviation $${sd}$. For samples of size $${nn}$, what is the standard error of the sample mean?`],
      [n(`$${round(se, 2)}$`), n(`$${sd}$`), n(`$${round(sd / nn, 3)}$`), n(`$${round(sd * Math.sqrt(nn), 2)}$`)],
      [`樣本平均數的標準誤 $= \\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sd}}{\\sqrt{${nn}}} = \\dfrac{${sd}}{${Math.sqrt(nn)}} = ${round(se, 2)}$。陷阱：$${sd}$ 是母體標準差本身，未除以 $\\sqrt{n}$；$${round(sd / nn, 3)}$ 除了 $n$ 而非 $\\sqrt{n}$；$${round(sd * Math.sqrt(nn), 2)}$ 用了乘法。留意樣本愈大標準誤愈細，但因為分母是 $\\sqrt{n}$，樣本要增至四倍才能令標準誤減半。`,
       `The standard error of the sample mean is $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sd}}{\\sqrt{${nn}}} = \\frac{${sd}}{${Math.sqrt(nn)}} = ${round(se, 2)}$. Traps: $${sd}$ is the population standard deviation itself, undivided; $${round(sd / nn, 3)}$ divides by $n$ rather than $\\sqrt{n}$; $${round(sd * Math.sqrt(nn), 2)}$ multiplies. Note that a larger sample gives a smaller standard error, but since the denominator is $\\sqrt{n}$ the sample must quadruple to halve it.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// M1 第二批平均分佈補強（2026-08-28）—— 三個最薄課題
// differentiation 已有 142 條，不予改動。
// ═══════════════════════════════════════════════════════════════════════════

const nCr1 = (nn: number, r: number): number => {
  let v = 1
  for (let i = 0; i < r; i++) v = (v * (nn - i)) / (i + 1)
  return Math.round(v)
}

// EL1 — 指數函數微分 d/dx(e^{ax}) = a·e^{ax}
// 指數的係數為 1 時必須省略：寫 e^{1x} 會被 validate-banks 的
// redundant-coefficient 檢查攔下（a = 2 時干擾項的 a−1 剛好等於 1）。
const ex1 = (k: number) => (k === 1 ? 'x' : `${k}x`)
for (const a of [2, 3, 4, 5, 6, 7]) {
  for (const k of [1, 2, 3, 5]) {
    add(`m1b_el1_${a}_${k}`, T.expLog, FW.rate, 'medium',
      [`求 $\\dfrac{d}{dx}\\left(${k === 1 ? '' : k}e^{${a}x}\\right)$。`,
       `Differentiate $${k === 1 ? '' : k}e^{${a}x}$ with respect to $x$.`],
      [n(`$${a * k}e^{${a}x}$`), n(`$${k === 1 ? '' : k}e^{${a}x}$`), n(`$${a * k}e^{${ex1(a - 1)}}$`), n(`$${k === 1 ? '' : k}e^{${a}x}/${a}$`)],
      [`鏈式法則：$\\dfrac{d}{dx}e^{u} = e^{u}\\dfrac{du}{dx}$。此處 $u = ${a}x$，$\\dfrac{du}{dx} = ${a}$，故導數 $= ${a * k}e^{${a}x}$。陷阱：$${k === 1 ? '' : k}e^{${a}x}$ 漏了乘以內函數的導數（$e^x$ 的導數是自己，但 $e^{ax}$ 不是）；$${a * k}e^{${ex1(a - 1)}}$ 誤把指數當成冪函數而減一；最後一項用了除法。指數函數與冪函數的求導規則完全不同，混用是本課最常見的失分位。`,
       `By the chain rule $\\frac{d}{dx}e^{u} = e^{u}\\frac{du}{dx}$. Here $u = ${a}x$ and $\\frac{du}{dx} = ${a}$, so the derivative is $${a * k}e^{${a}x}$. Traps: $${k === 1 ? '' : k}e^{${a}x}$ omits the derivative of the inner function — $e^x$ is its own derivative but $e^{ax}$ is not; $${a * k}e^{${ex1(a - 1)}}$ treats the exponential as a power and reduces the exponent; the last option divides. The rules for exponentials and powers are quite different, and confusing them is where marks are most often lost here.`])
  }
}

// EL2 — 對數函數微分 d/dx(ln ax) = 1/x
for (const a of [2, 3, 5, 7, 10]) {
  for (const k of [1, 2, 4]) {
    add(`m1b_el2_${a}_${k}`, T.expLog, FW.rate, 'medium',
      [`求 $\\dfrac{d}{dx}\\left(${k === 1 ? '' : k}\\ln ${a}x\\right)$。`,
       `Differentiate $${k === 1 ? '' : k}\\ln ${a}x$ with respect to $x$.`],
      [n(`$\\dfrac{${k}}{x}$`), n(`$\\dfrac{${k}}{${a}x}$`), n(`$\\dfrac{${a * k}}{x}$`), n(`$${k === 1 ? '' : k}\\ln x$`)],
      [`$\\ln ${a}x = \\ln ${a} + \\ln x$，而 $\\ln ${a}$ 是常數，導數為 $0$，故 $\\dfrac{d}{dx}\\ln ${a}x = \\dfrac{1}{x}$，乘以係數得 $\\dfrac{${k}}{x}$。留意答案與 $${a}$ 無關 —— 這是本題的考點。陷阱：$\\dfrac{${k}}{${a}x}$ 誤以為分母要保留 $${a}$；$\\dfrac{${a * k}}{x}$ 誤把 $${a}$ 乘到分子；最後一項根本未求導。`,
       `Since $\\ln ${a}x = \\ln ${a} + \\ln x$ and $\\ln ${a}$ is a constant with zero derivative, $\\frac{d}{dx}\\ln ${a}x = \\frac{1}{x}$, and with the coefficient this is $\\frac{${k}}{x}$. Note that the answer does not involve $${a}$ at all, which is the point being tested. Traps: $\\frac{${k}}{${a}x}$ keeps $${a}$ in the denominator; $\\frac{${a * k}}{x}$ moves it to the numerator; the last option has not been differentiated.`])
  }
}

// CA1 — 微積分應用：由位移函數求瞬時速度 v = ds/dt
for (const a of [2, 3, 4, 5]) {
  for (const b of [3, 5, 6, 8]) {
    for (const tt of [2, 3, 4]) {
      const v = 2 * a * tt + b
      add(`m1b_ca1_${a}_${b}_${tt}`, T.calcApp, FW.modelling, 'medium',
        [`一物體的位移函數為 $s(t) = ${a}t^2 + ${b}t$（米，$t$ 以秒計）。求 $t = ${tt}$ 秒時的瞬時速度。`,
         `An object has displacement $s(t) = ${a}t^2 + ${b}t$ metres, with $t$ in seconds. Find its instantaneous velocity at $t = ${tt}$ s.`],
        [n(`$${v}$ m/s`), n(`$${a * tt * tt + b * tt}$ m/s`), n(`$${2 * a}$ m/s`), n(`$${round((a * tt * tt + b * tt) / tt, 2)}$ m/s`)],
        [`瞬時速度是位移對時間的導數：$v(t) = \\dfrac{ds}{dt} = ${2 * a}t + ${b}$。代入 $t = ${tt}$：$v = ${2 * a}(${tt}) + ${b} = ${v}$ m/s。陷阱：$${a * tt * tt + b * tt}$ m/s 是 $t = ${tt}$ 時的【位移】而非速度；$${2 * a}$ m/s 是加速度 $\\dfrac{d^2s}{dt^2}$；$${round((a * tt * tt + b * tt) / tt, 2)}$ m/s 是【平均】速度（位移÷時間），與瞬時速度不同。位移、速度、加速度三者相差一次求導，讀題時要看清楚問邊一個。`,
         `Instantaneous velocity is the derivative of displacement: $v(t) = \\frac{ds}{dt} = ${2 * a}t + ${b}$. At $t = ${tt}$ this gives $v = ${2 * a}(${tt}) + ${b} = ${v}$ m/s. Traps: $${a * tt * tt + b * tt}$ m/s is the displacement at $t = ${tt}$, not the velocity; $${2 * a}$ m/s is the acceleration $\\frac{d^2s}{dt^2}$; $${round((a * tt * tt + b * tt) / tt, 2)}$ m/s is the average velocity, displacement over time, which differs from the instantaneous value. Displacement, velocity and acceleration are each one differentiation apart, so read carefully which is wanted.`])
    }
  }
}

// CA2 — 微積分應用：求二次函數的極值點
for (const a of [1, 2, 3]) {
  for (const b of [4, 8, 12, 16, 20, 24]) {
    const xStar = b / (2 * a)
    if (!Number.isInteger(xStar)) continue
    const yStar = -a * xStar * xStar + b * xStar
    add(`m1b_ca2_${a}_${b}`, T.calcApp, FW.modelling, 'medium',
      [`某函數為 $y = -${a}x^2 + ${b}x$。求 $y$ 取得最大值時的 $x$ 值。`,
       `A function is $y = -${a}x^2 + ${b}x$. Find the value of $x$ at which $y$ is a maximum.`],
      [n(`$x = ${xStar}$`), n(`$x = ${b}$`), n(`$x = ${yStar}$`), n(`$x = ${round(b / a, 2)}$`)],
      [`極值點出現在導數為零之處：$\\dfrac{dy}{dx} = -${2 * a}x + ${b} = 0$，解得 $x = \\dfrac{${b}}{${2 * a}} = ${xStar}$。由於 $x^2$ 的係數為負，二階導數 $-${2 * a} < 0$，該點確為【最大】值。陷阱：$x = ${b}$ 直接抄了一次項係數；$x = ${yStar}$ 是最大值 $y$ 本身而非對應的 $x$；$x = ${round(b / a, 2)}$ 漏了分母的 $2$。求極值必須做兩步：先解 $\\dfrac{dy}{dx} = 0$，再用二階導數的正負判斷是最大還是最小。`,
       `A turning point occurs where the derivative vanishes: $\\frac{dy}{dx} = -${2 * a}x + ${b} = 0$, giving $x = \\frac{${b}}{${2 * a}} = ${xStar}$. Since the coefficient of $x^2$ is negative the second derivative is $-${2 * a} < 0$, confirming a maximum. Traps: $x = ${b}$ copies the linear coefficient; $x = ${yStar}$ is the maximum value of $y$ rather than the $x$ at which it occurs; $x = ${round(b / a, 2)}$ omits the 2 in the denominator. Finding an extremum takes two steps: solve $\\frac{dy}{dx} = 0$, then use the sign of the second derivative to decide maximum or minimum.`])
  }
}

// PC1 — 組合數 C(n, r)
for (const nn of [5, 6, 7, 8, 9, 10, 12]) {
  for (const r of [2, 3, 4]) {
    if (r >= nn) continue
    const c = nCr1(nn, r)
    let perm = 1
    for (let i = 0; i < r; i++) perm *= nn - i
    add(`m1b_pc1_${nn}_${r}`, T.permComb, FW.decompose, 'medium',
      [`由 $${nn}$ 名學生之中選出 $${r}$ 名組成一個委員會（不分職位）。共有多少種選法？`,
       `A committee of $${r}$ is chosen from $${nn}$ students, with no distinction of role. How many ways are there?`],
      [n(`$${c}$`), n(`$${perm}$`), n(`$${nn * r}$`), n(`$${nn ** r}$`)],
      [`委員會不分職位，即次序無關，屬【組合】：$\\binom{${nn}}{${r}} = ${c}$。陷阱：$${perm}$ 是【排列】 $P(${nn}, ${r})$，適用於職位有分別（例如選主席、秘書、司庫）的情況，數值大 $${r}!$ 倍；$${nn * r}$ 用了相乘；$${nn ** r}$ 是可重複選取的情況。判斷用排列還是組合，只需問一句：調換兩個被選者的次序，結果算不算同一種？算，就是組合。`,
       `A committee with no distinction of role means order does not matter, so this is a combination: $\\binom{${nn}}{${r}} = ${c}$. Traps: $${perm}$ is the permutation $P(${nn}, ${r})$, which applies when the roles differ — chair, secretary, treasurer — and is larger by a factor of $${r}!$; $${nn * r}$ multiplies; $${nn ** r}$ allows repetition. To choose between permutation and combination, ask one question: if two chosen people swap places, is it the same outcome? If so, it is a combination.`])
  }
}

export const m1BankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const m1BankTopics: Topic[] = topicList([
  { topic: T.diff, fw: FW.calc, count: 0 },
  { topic: T.integ, fw: FW.calc, count: 0 },
  { topic: T.binomialDist, fw: FW.stats, count: 0 },
])
