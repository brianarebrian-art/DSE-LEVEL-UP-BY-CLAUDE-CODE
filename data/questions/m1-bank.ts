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

// ═══════════════════════════════════════════════════════════════════════════
// 第三批母模板 —— 平均分佈補強（2026-08-28）
// ---------------------------------------------------------------------------
// 補強前實測 M1 十二個課題：微分 142 條，而概率分佈（高階）18 條、
// 二項式定理 32 條、積分 35 條、統計推斷 36 條（平均目標 83），不均比 7.9×。
// 依指示先補題數最少者；微分已遠高於平均，本節不動。
//
// 二項式定理與積分兩族刻意避開 m2-bank 已有的題幹形式（(1+x)^n 的 x^r 係數、
// ∫₀^a xⁿ dx、∫₁^b (px+q) dx），改用項數、係數總和、對數與指數積分等切入點，
// 免得兩科出現題幹完全相同的題目（全站撞題閘 global-dedup.test.mts 會攔）。
// ═══════════════════════════════════════════════════════════════════════════

// ── 概率分佈（高階）────────────────────────────────────────────────────────

// PDH1 — 離散隨機變數的期望：E(X) = Σ x·P(x)
for (const [p1, p2, p3] of [[1, 2, 7], [2, 3, 5], [1, 4, 5], [3, 3, 4], [2, 5, 3], [1, 1, 8],
  [4, 4, 2], [2, 2, 6], [3, 5, 2], [1, 6, 3], [5, 3, 2], [2, 6, 2]] as [number, number, number][]) {
  const num = 1 * p1 + 2 * p2 + 3 * p3
  add(`m1c_pdh1_${p1}${p2}${p3}`, T.distHigh, FW.stats, 'medium',
    [`隨機變數 $X$ 只取值 1、2、3，其概率分別為 $${frac(p1, 10)}$、$${frac(p2, 10)}$、$${frac(p3, 10)}$。求 $E(X)$。`,
     `A random variable $X$ takes the values 1, 2 and 3 with probabilities $${frac(p1, 10)}$, $${frac(p2, 10)}$ and $${frac(p3, 10)}$ respectively. Find $E(X)$.`],
    [n(`$${round(num / 10, 2)}$`), n('$2$'), n(`$${round((p1 + p2 + p3) / 10, 2)}$`), n(`$${round((1 + 2 + 3) / 3, 2)}$`)],
    [`$E(X) = \\sum x P(x) = 1(${frac(p1, 10)}) + 2(${frac(p2, 10)}) + 3(${frac(p3, 10)}) = ${frac(num, 10)} = ${round(num / 10, 2)}$。期望值是以概率為權重的平均，並非各取值的簡單平均，亦不必等於任何一個可能取值。陷阱：$2$ 取了三個取值的中位數；$${round((p1 + p2 + p3) / 10, 2)}$ 只把概率相加（其和必為 1）；$${round((1 + 2 + 3) / 3, 2)}$ 是三個取值的簡單平均，忽略了概率。`,
     `$E(X) = \\sum x P(x) = 1(${frac(p1, 10)}) + 2(${frac(p2, 10)}) + 3(${frac(p3, 10)}) = ${frac(num, 10)} = ${round(num / 10, 2)}$. The expectation is a probability-weighted mean, not a simple average of the values, and need not equal any attainable value. Traps: $2$ takes the median of the three values; $${round((p1 + p2 + p3) / 10, 2)}$ merely sums the probabilities, which is always 1; $${round((1 + 2 + 3) / 3, 2)}$ is the unweighted mean and ignores the probabilities.`])
}

// PDH2 — 方差：Var(X) = E(X²) − [E(X)]²
for (const ex of [2, 3, 4, 5, 6]) {
  for (const varv of [1, 2, 4, 6, 9]) {
    const ex2 = varv + ex * ex
    add(`m1c_pdh2_${ex}_${varv}`, T.distHigh, FW.stats, 'hard',
      [`已知隨機變數 $X$ 的 $E(X) = ${ex}$、$E(X^2) = ${ex2}$。求 $\\operatorname{Var}(X)$。`,
       `A random variable $X$ satisfies $E(X) = ${ex}$ and $E(X^2) = ${ex2}$. Find $\\operatorname{Var}(X)$.`],
      [n(`$${varv}$`), n(`$${ex2 - ex}$`), n(`$${ex2}$`), n(`$${ex * ex}$`)],
      [`$\\operatorname{Var}(X) = E(X^2) - [E(X)]^2 = ${ex2} - ${ex}^2 = ${ex2} - ${ex * ex} = ${varv}$。要減的是【期望的平方】而非期望本身，這是本公式最常見的失分位；方差必為非負，可用作即時驗算。陷阱：$${ex2 - ex}$ 減了 $E(X)$ 而非 $[E(X)]^2$；$${ex2}$ 忘記相減；$${ex * ex}$ 只計了 $[E(X)]^2$。`,
       `$\\operatorname{Var}(X) = E(X^2) - [E(X)]^2 = ${ex2} - ${ex}^2 = ${ex2} - ${ex * ex} = ${varv}$. What is subtracted is the SQUARE of the expectation, not the expectation itself, which is where this formula is most often mishandled; a variance is never negative, which gives an immediate check. Traps: $${ex2 - ex}$ subtracts $E(X)$ instead of $[E(X)]^2$; $${ex2}$ omits the subtraction; $${ex * ex}$ gives only $[E(X)]^2$.`])
  }
}

// PDH3 — 幾何分佈：首次成功的期望試驗次數 E(X) = 1/p
for (const k of [2, 3, 4, 5, 6, 8, 10, 12, 20]) {
  add(`m1c_pdh3_${k}`, T.distHigh, FW.stats, 'medium',
    [`重複進行獨立試驗直至首次成功為止，每次成功的概率為 $${frac(1, k)}$。所需試驗次數的期望值是多少？`,
     `Independent trials are repeated until the first success, each trial succeeding with probability $${frac(1, k)}$. What is the expected number of trials required?`],
    [n(`$${k}$`), n(`$${frac(1, k)}$`), n(`$${k - 1}$`), n(`$${k * k}$`)],
    [`幾何分佈的期望為 $E(X) = \\dfrac{1}{p}$。代入 $p = ${frac(1, k)}$ 得 $E(X) = ${k}$ 次。直觀理解：若每 ${k} 次試驗平均有一次成功，平均便要等 ${k} 次。陷阱：$${frac(1, k)}$ 直接抄了概率本身；$${k - 1}$ 是首次成功【之前】的失敗次數期望；$${k * k}$ 誤把倒數平方。`,
     `For a geometric distribution $E(X) = \\frac{1}{p}$. With $p = ${frac(1, k)}$ this gives $E(X) = ${k}$ trials. Intuitively, if on average one trial in ${k} succeeds, the wait is ${k} trials. Traps: $${frac(1, k)}$ copies the probability itself; $${k - 1}$ is the expected number of FAILURES before the first success; $${k * k}$ squares the reciprocal.`])
}

// ── 二項式定理 ────────────────────────────────────────────────────────────

// BT1 — 展開式的項數 = n + 1
for (let nn = 3; nn <= 20; nn++) {
  add(`m1c_bt1_${nn}`, T.binomialThm, FW.decompose, 'easy',
    [`$(a + b)^{${nn}}$ 的展開式共有多少項（合併同類項後）？`,
     `How many terms are there in the expansion of $(a + b)^{${nn}}$ after collecting like terms?`],
    [n(`$${nn + 1}$`), n(`$${nn}$`), n(`$${2 * nn}$`), n(`$${2 ** nn}$`)],
    [`$(a+b)^{n}$ 的一般項為 $\\binom{n}{r}a^{n-r}b^{r}$，其中 $r$ 由 0 數到 $n$，共 $n + 1$ 個值，故有 ${nn + 1} 項。陷阱：$${nn}$ 漏了 $r = 0$ 那一項（由 0 起數是本題的關鍵）；$${2 * nn}$ 把指數乘以 2；$${2 ** nn}$ 是所有二項式係數之【和】而非項數。`,
     `The general term of $(a+b)^{n}$ is $\\binom{n}{r}a^{n-r}b^{r}$ with $r$ running from 0 to $n$, giving $n + 1$ values and hence ${nn + 1} terms. Traps: $${nn}$ omits the $r = 0$ term, and counting from zero is the whole point here; $${2 * nn}$ doubles the exponent; $${2 ** nn}$ is the SUM of the binomial coefficients, not the number of terms.`])
}

// BT2 — 二項式係數之和 = 2^n（以 x = 1 代入）
for (let nn = 3; nn <= 14; nn++) {
  add(`m1c_bt2_${nn}`, T.binomialThm, FW.decompose, 'medium',
    [`求 $\\displaystyle\\sum_{r=0}^{${nn}} \\binom{${nn}}{r}$，即 $(1 + x)^{${nn}}$ 展開式中所有係數之和。`,
     `Evaluate $\\displaystyle\\sum_{r=0}^{${nn}} \\binom{${nn}}{r}$, the sum of all coefficients in the expansion of $(1 + x)^{${nn}}$.`],
    [n(`$${2 ** nn}$`), n(`$${nn + 1}$`), n(`$${2 * nn}$`), n(`$${nCr(nn, Math.floor(nn / 2))}$`)],
    [`把 $x = 1$ 代入 $(1 + x)^{${nn}}$，左邊成為 $2^{${nn}} = ${2 ** nn}$，右邊則是所有係數之和，故兩者相等。以代入特定數值求係數和，是二項式定理最常用的一招。陷阱：$${nn + 1}$ 是項數而非係數和；$${2 * nn}$ 把底數與指數的角色調轉；$${nCr(nn, Math.floor(nn / 2))}$ 只是其中最大的一個係數。`,
     `Substituting $x = 1$ into $(1 + x)^{${nn}}$ makes the left side $2^{${nn}} = ${2 ** nn}$ while the right side becomes the sum of all coefficients, so the two are equal. Substituting a convenient value is the standard technique for coefficient sums. Traps: $${nn + 1}$ is the number of terms; $${2 * nn}$ interchanges base and exponent; $${nCr(nn, Math.floor(nn / 2))}$ is merely the largest single coefficient.`])
}

// BT3 — 楊輝三角的遞推關係 C(n,r) = C(n−1,r−1) + C(n−1,r)
for (let nn = 5; nn <= 12; nn++) {
  for (let r = 2; r <= 4; r++) {
    if (r >= nn) continue
    add(`m1c_bt3_${nn}_${r}`, T.binomialThm, FW.decompose, 'hard',
      [`已知 $\\binom{${nn - 1}}{${r - 1}} = ${nCr(nn - 1, r - 1)}$、$\\binom{${nn - 1}}{${r}} = ${nCr(nn - 1, r)}$。利用楊輝三角的遞推關係求 $\\binom{${nn}}{${r}}$。`,
       `Given $\\binom{${nn - 1}}{${r - 1}} = ${nCr(nn - 1, r - 1)}$ and $\\binom{${nn - 1}}{${r}} = ${nCr(nn - 1, r)}$, use Pascal's rule to find $\\binom{${nn}}{${r}}$.`],
      [n(`$${nCr(nn, r)}$`), n(`$${nCr(nn - 1, r - 1) * nCr(nn - 1, r)}$`), n(`$${Math.abs(nCr(nn - 1, r) - nCr(nn - 1, r - 1))}$`), n(`$${nCr(nn - 1, r)}$`)],
      [`楊輝三角的遞推關係為 $\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}$，即三角形中每一項等於其上方兩項之和。代入得 $${nCr(nn - 1, r - 1)} + ${nCr(nn - 1, r)} = ${nCr(nn, r)}$。陷阱：$${nCr(nn - 1, r - 1) * nCr(nn - 1, r)}$ 把兩項相乘；$${Math.abs(nCr(nn - 1, r) - nCr(nn - 1, r - 1))}$ 相減；$${nCr(nn - 1, r)}$ 只抄了其中一項。`,
       `Pascal's rule states $\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}$: each entry of the triangle is the sum of the two above it. Hence $${nCr(nn - 1, r - 1)} + ${nCr(nn - 1, r)} = ${nCr(nn, r)}$. Traps: $${nCr(nn - 1, r - 1) * nCr(nn - 1, r)}$ multiplies the two; $${Math.abs(nCr(nn - 1, r) - nCr(nn - 1, r - 1))}$ subtracts; $${nCr(nn - 1, r)}$ copies one of them.`])
  }
}

// ── 積分 ──────────────────────────────────────────────────────────────────

// IN1 — 對數積分：∫₁^b (a/x) dx = a ln b
for (const a of [1, 2, 3, 4, 5]) {
  for (const b of [2, 3, 5, 7, 10]) {
    add(`m1c_in1_${a}_${b}`, T.integ, FW.calc, 'medium',
      [`求 $\\displaystyle\\int_{1}^{${b}} \\frac{${a}}{x}\\,dx$。`,
       `Evaluate $\\displaystyle\\int_{1}^{${b}} \\frac{${a}}{x}\\,dx$.`],
      [n(`$${a === 1 ? '' : a}\\ln ${b}$`), n(`$${a}\\ln ${b} - ${a}$`), n(`$${frac(a, b)}$`), n(`$${a === 1 ? '' : a}\\ln ${b + 1}$`)],
      [`$\\dfrac{1}{x}$ 的原函數是 $\\ln|x|$（並非 $\\dfrac{x^{0}}{0}$ —— 冪法則在指數為 $-1$ 時失效，這正是本題要考的例外）。故 $\\int_{1}^{${b}} \\dfrac{${a}}{x}dx = ${a === 1 ? '' : a}\\left[\\ln x\\right]_{1}^{${b}} = ${a === 1 ? '' : a}(\\ln ${b} - \\ln 1) = ${a === 1 ? '' : a}\\ln ${b}$。陷阱：$${a}\\ln ${b} - ${a}$ 誤以為 $\\ln 1 = 1$；$${frac(a, b)}$ 把被積函數當作常數代入；$${a === 1 ? '' : a}\\ln ${b + 1}$ 上限抄錯。`,
       `The antiderivative of $\\frac{1}{x}$ is $\\ln|x|$, not $\\frac{x^{0}}{0}$ — the power rule fails at exponent $-1$, and that exception is exactly what this item tests. So $\\int_{1}^{${b}} \\frac{${a}}{x}dx = ${a === 1 ? '' : a}\\left[\\ln x\\right]_{1}^{${b}} = ${a === 1 ? '' : a}(\\ln ${b} - \\ln 1) = ${a === 1 ? '' : a}\\ln ${b}$. Traps: $${a}\\ln ${b} - ${a}$ assumes $\\ln 1 = 1$; $${frac(a, b)}$ substitutes into the integrand as if it were constant; $${a === 1 ? '' : a}\\ln ${b + 1}$ misreads the upper limit.`])
  }
}

// IN2 — 指數積分：∫₀^t k·e^{kx} dx = e^{kt} − 1
for (const k of [1, 2, 3, 4]) {
  for (const t of [1, 2, 3]) {
    add(`m1c_in2_${k}_${t}`, T.integ, FW.calc, 'hard',
      [`求 $\\displaystyle\\int_{0}^{${t}} ${k === 1 ? '' : k}e^{${k === 1 ? '' : k}x}\\,dx$。`,
       `Evaluate $\\displaystyle\\int_{0}^{${t}} ${k === 1 ? '' : k}e^{${k === 1 ? '' : k}x}\\,dx$.`],
      [n(`$e^{${k * t}} - 1$`), n(`$e^{${k * t}}$`), n(`$${k}e^{${k * t}} - ${k}$`), n(`$${frac(1, k)}\\left(e^{${k * t}} - 1\\right)$`)],
      [`$e^{${k === 1 ? '' : k}x}$ 的原函數為 $${frac(1, k)}e^{${k === 1 ? '' : k}x}$，乘上被積函數前的係數 $${k}$ 後恰好抵銷，得原函數 $e^{${k === 1 ? '' : k}x}$。代入上下限：$e^{${k * t}} - e^{0} = e^{${k * t}} - 1$。陷阱：$e^{${k * t}}$ 忘記減去下限的 $e^{0} = 1$；$${k}e^{${k * t}} - ${k}$ 漏了連鎖法則帶來的 $\\dfrac{1}{${k}}$；$${frac(1, k)}\\left(e^{${k * t}} - 1\\right)$ 把係數 $${k}$ 多除了一次。`,
       `The antiderivative of $e^{${k === 1 ? '' : k}x}$ is $${frac(1, k)}e^{${k === 1 ? '' : k}x}$, and the leading coefficient $${k}$ cancels it exactly, leaving $e^{${k === 1 ? '' : k}x}$. Evaluating the limits gives $e^{${k * t}} - e^{0} = e^{${k * t}} - 1$. Traps: $e^{${k * t}}$ omits $e^{0} = 1$ at the lower limit; $${k}e^{${k * t}} - ${k}$ drops the $\\frac{1}{${k}}$ from the chain rule; $${frac(1, k)}\\left(e^{${k * t}} - 1\\right)$ divides by $${k}$ once too often.`])
  }
}

// IN3 — 拋物線與 x 軸圍成的面積：∫₀^c x(c − x) dx = c³/6
for (const c of [6, 12, 18, 24, 30, 36, 42, 48]) {
  const area = (c ** 3) / 6
  add(`m1c_in3_${c}`, T.integ, FW.modelling, 'hard',
    [`求曲線 $y = x(${c} - x)$ 與 $x$ 軸所圍成的面積。`,
     `Find the area enclosed between the curve $y = x(${c} - x)$ and the $x$-axis.`],
    [n(`$${area}$`), n(`$${(c ** 3) / 2}$`), n(`$${(c ** 3) / 3}$`), n(`$${c * c}$`)],
    [`先求交點：$x(${c} - x) = 0$ 得 $x = 0$ 及 $x = ${c}$，兩者就是積分的上下限（不先求交點是本類題最常見的失分位）。$\\int_{0}^{${c}} (${c}x - x^2)\\,dx = \\left[\\dfrac{${c}x^2}{2} - \\dfrac{x^3}{3}\\right]_{0}^{${c}} = ${(c ** 3) / 2} - ${(c ** 3) / 3} = ${area}$。陷阱：$${(c ** 3) / 2}$ 與 $${(c ** 3) / 3}$ 分別只算了其中一項；$${c * c}$ 把區間長度平方當成面積。`,
     `First find the intercepts: $x(${c} - x) = 0$ gives $x = 0$ and $x = ${c}$, which are the limits of integration — failing to find them first is where this type of item is most often lost. Then $\\int_{0}^{${c}} (${c}x - x^2)\\,dx = \\left[\\frac{${c}x^2}{2} - \\frac{x^3}{3}\\right]_{0}^{${c}} = ${(c ** 3) / 2} - ${(c ** 3) / 3} = ${area}$. Traps: $${(c ** 3) / 2}$ and $${(c ** 3) / 3}$ each keep only one of the two terms; $${c * c}$ squares the width of the interval.`])
}

// ── 統計推斷 ──────────────────────────────────────────────────────────────

// SI2 — 95% 置信區間的半寬 = 1.96σ/√n
for (const sd of [10, 15, 20, 30, 40]) {
  for (const nn of [4, 9, 16, 25, 100]) {
    const se = sd / Math.sqrt(nn)
    const half = 1.96 * se
    add(`m1c_si2_${sd}_${nn}`, T.statInf, FW.stats, 'hard',
      [`由一個母體標準差為 ${sd} 的正態母體抽出 ${nn} 個樣本。母體平均數的 95% 置信區間半寬約為多少？（取 $z = 1.96$）`,
       `A sample of ${nn} observations is drawn from a normal population with standard deviation ${sd}. What is the half-width of the 95% confidence interval for the population mean, taking $z = 1.96$?`],
      [n(`$${round(half, 2)}$`), n(`$${round(1.96 * sd, 2)}$`), n(`$${round(se, 2)}$`), n(`$${round((1.96 * sd) / nn, 2)}$`)],
      [`置信區間半寬 $= z \\times \\dfrac{\\sigma}{\\sqrt{n}} = 1.96 \\times \\dfrac{${sd}}{\\sqrt{${nn}}} = 1.96 \\times ${round(se, 2)} = ${round(half, 2)}$。分母是 $\\sqrt{n}$ 而非 $n$：樣本量增至四倍，區間才收窄一半，這說明提高精確度的代價是遞增的。陷阱：$${round(1.96 * sd, 2)}$ 漏了除以 $\\sqrt{n}$；$${round(se, 2)}$ 是標準誤本身，未乘 $z$；$${round((1.96 * sd) / nn, 2)}$ 除了 $n$ 而非 $\\sqrt{n}$。`,
       `The half-width is $z \\times \\frac{\\sigma}{\\sqrt{n}} = 1.96 \\times \\frac{${sd}}{\\sqrt{${nn}}} = 1.96 \\times ${round(se, 2)} = ${round(half, 2)}$. The denominator is $\\sqrt{n}$, not $n$: quadrupling the sample only halves the interval, so precision gets progressively more expensive. Traps: $${round(1.96 * sd, 2)}$ omits the division by $\\sqrt{n}$; $${round(se, 2)}$ is the standard error itself without the factor $z$; $${round((1.96 * sd) / nn, 2)}$ divides by $n$ rather than $\\sqrt{n}$.`])
  }
}

// ── 二項分佈 ──────────────────────────────────────────────────────────────

// BD2 — 二項分佈的方差 Var(X) = npq
for (const nn of [10, 20, 25, 40, 50, 100]) {
  for (const [pn, pd] of [[1, 2], [1, 4], [1, 5], [3, 10]] as [number, number][]) {
    const varv = (nn * pn * (pd - pn)) / (pd * pd)
    if (!Number.isInteger(varv)) continue
    add(`m1c_bd2_${nn}_${pn}${pd}`, T.binomialDist, FW.stats, 'medium',
      [`設 $X \\sim B(${nn},\\ ${frac(pn, pd)})$。求 $\\operatorname{Var}(X)$。`,
       `Let $X \\sim B(${nn},\\ ${frac(pn, pd)})$. Find $\\operatorname{Var}(X)$.`],
      [n(`$${varv}$`), n(`$${round((nn * pn) / pd, 2)}$`), n(`$${round((nn * pn * pn) / (pd * pd), 2)}$`), n(`$${round(Math.sqrt(varv), 3)}$`)],
      [`二項分佈的方差為 $\\operatorname{Var}(X) = npq$，其中 $q = 1 - p = ${frac(pd - pn, pd)}$。代入得 $${nn} \\times ${frac(pn, pd)} \\times ${frac(pd - pn, pd)} = ${varv}$。陷阱：$${round((nn * pn) / pd, 2)}$ 是期望 $np$；$${round((nn * pn * pn) / (pd * pd), 2)}$ 把 $q$ 誤寫成 $p$；$${round(Math.sqrt(varv), 3)}$ 是標準差而非方差。`,
       `For a binomial distribution $\\operatorname{Var}(X) = npq$ with $q = 1 - p = ${frac(pd - pn, pd)}$, giving $${nn} \\times ${frac(pn, pd)} \\times ${frac(pd - pn, pd)} = ${varv}$. Traps: $${round((nn * pn) / pd, 2)}$ is the mean $np$; $${round((nn * pn * pn) / (pd * pd), 2)}$ writes $p$ for $q$; $${round(Math.sqrt(varv), 3)}$ is the standard deviation rather than the variance.`])
  }
}

// BD3 — 至少一次成功的概率 P(X ≥ 1) = 1 − qⁿ
for (const nn of [2, 3, 4, 5]) {
  for (const pd of [2, 3, 4, 5, 6]) {
    const q = pd - 1
    add(`m1c_bd3_${nn}_${pd}`, T.binomialDist, FW.decompose, 'hard',
      [`某試驗每次成功的概率為 $${frac(1, pd)}$，獨立重複 ${nn} 次。至少成功一次的概率是多少？`,
       `A trial succeeds with probability $${frac(1, pd)}$ and is repeated independently ${nn} times. What is the probability of at least one success?`],
      [n(`$${frac(pd ** nn - q ** nn, pd ** nn)}$`), n(`$${frac(q ** nn, pd ** nn)}$`), n(`$${frac(nn, pd)}$`), n(`$${frac(1, pd ** nn)}$`)],
      [`「至少一次」的對立事件是「一次都無」，用補事件計算遠比逐項相加簡單：$P(X \\geq 1) = 1 - P(X = 0) = 1 - \\left(${frac(q, pd)}\\right)^{${nn}} = 1 - ${frac(q ** nn, pd ** nn)} = ${frac(pd ** nn - q ** nn, pd ** nn)}$。陷阱：$${frac(q ** nn, pd ** nn)}$ 是「一次都無」的概率，忘記用 1 減；$${frac(nn, pd)}$ 把各次的概率直接相加（概率不能這樣疊加）；$${frac(1, pd ** nn)}$ 是「每次都成功」的概率。`,
       `The complement of "at least one" is "none at all", and using the complement is far shorter than summing term by term: $P(X \\geq 1) = 1 - P(X = 0) = 1 - \\left(${frac(q, pd)}\\right)^{${nn}} = 1 - ${frac(q ** nn, pd ** nn)} = ${frac(pd ** nn - q ** nn, pd ** nn)}$. Traps: $${frac(q ** nn, pd ** nn)}$ is the probability of no success and omits the subtraction from 1; $${frac(nn, pd)}$ adds the individual probabilities, which is not how probabilities combine; $${frac(1, pd ** nn)}$ is the probability that every trial succeeds.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 第四批母模板 —— 推向 1,000（2026-08-29）
// 微分 142 條已遠高於平均，一條不動；其餘十一個課題由 42–84 補向約 78。
// ═══════════════════════════════════════════════════════════════════════════

// PC2 — 排列 nPr（有次序之分）
for (const nn of [5, 6, 7, 8, 9, 10]) {
  for (const r of [2, 3]) {
    const p = fact(nn) / fact(nn - r)
    add(`m1d_pc2_${nn}_${r}`, T.permComb, FW.decompose, 'medium',
      [`從 ${nn} 名學生之中選出 ${r} 名，分別擔任主席與秘書等【不同】職位。共有多少種安排？`,
       `From ${nn} students, ${r} are chosen to fill ${r} DISTINCT posts such as chair and secretary. How many arrangements are there?`],
      [n(`$${p}$`), n(`$${nCr(nn, r)}$`), n(`$${nn ** r}$`), n(`$${nn * r}$`)],
      [`職位不同，即次序有分別，屬排列：$P^{${nn}}_{${r}} = \\dfrac{${nn}!}{(${nn}-${r})!} = ${p}$。陷阱：$${nCr(nn, r)}$ 是組合 $\\binom{${nn}}{${r}}$，適用於「不分職位」的情況 —— 排列比組合多出 $${r}!$ 倍，正是同一組人排出不同職位的種數；$${nn ** r}$ 容許同一人擔任多個職位（有放回）；$${nn * r}$ 把兩數相乘。`,
       `Distinct posts mean order matters, so this is a permutation: $P^{${nn}}_{${r}} = \\frac{${nn}!}{(${nn}-${r})!} = ${p}$. Traps: $${nCr(nn, r)}$ is the combination $\\binom{${nn}}{${r}}$, which applies when the posts are not distinguished — a permutation exceeds it by the factor $${r}!$, the number of ways one chosen group can fill the posts; $${nn ** r}$ allows one person to hold several posts, as if with replacement; $${nn * r}$ merely multiplies.`])
  }
}

// PC3 — 圓形排列 (n − 1)!
for (const nn of [4, 5, 6, 7, 8]) {
  add(`m1d_pc3_${nn}`, T.permComb, FW.decompose, 'hard',
    [`${nn} 個人圍着圓桌就座，只考慮相對位置（旋轉後相同的座位安排視為同一種）。共有多少種坐法？`,
     `${nn} people sit around a round table, with arrangements that differ only by rotation counted as the same. How many seatings are there?`],
    [n(`$${fact(nn - 1)}$`), n(`$${fact(nn)}$`), n(`$${fact(nn - 2)}$`), n(`$${fact(nn) / 2}$`)],
    [`圓形排列先固定其中一人作參照點以消去旋轉造成的重複，餘下 $${nn} - 1 = ${nn - 1}$ 人作直線排列，故共 $(${nn}-1)! = ${fact(nn - 1)}$ 種。陷阱：$${fact(nn)}$ 是直線排列，把 $${nn}$ 種只差旋轉的座位重複計算了；$${fact(nn - 2)}$ 多固定了一個人；$${fact(nn) / 2}$ 用了「翻轉亦視為相同」的除以 2，但本題只說旋轉，並未提及翻轉。`,
     `A circular arrangement first fixes one person as a reference to remove rotational duplicates, leaving $${nn} - 1 = ${nn - 1}$ people to arrange in a line, giving $(${nn}-1)! = ${fact(nn - 1)}$. Traps: $${fact(nn)}$ is the linear count and double-counts each seating $${nn}$ times over its rotations; $${fact(nn - 2)}$ fixes one person too many; $${fact(nn) / 2}$ divides by 2 for reflections, which the question does not mention.`])
}

// PC4 — 有重複字母的排列
;([['LEVEL', 5, 4], ['BANANA', 6, 12], ['SUCCESS', 7, 24], ['LETTER', 6, 4],
  ['COFFEE', 6, 4], ['MAMMAL', 6, 12], ['ARRANGE', 7, 4], ['STATISTICS', 10, 48]] as [string, number, number][])
  .forEach(([word, len, div]) => {
    const ans = fact(len) / div
    add(`m1d_pc4_${word}`, T.permComb, FW.decompose, 'hard',
      [`把英文字「${word}」的所有字母重新排列，可組成多少個不同的字串？`,
       `In how many distinguishable ways can the letters of the word ${word} be rearranged?`],
      [n(`$${ans}$`), n(`$${fact(len)}$`), n(`$${Math.round(fact(len) / (div * 2))}$`), n(`$${fact(len - 1)}$`)],
      [`若 $${len}$ 個字母全部相異，排法為 $${len}! = ${fact(len)}$ 種。但「${word}」有重複字母，交換相同字母並不產生新字串，故須除以各組重複字母個數的階乘之積（此處為 $${div}$），得 $\\dfrac{${fact(len)}}{${div}} = ${ans}$。陷阱：$${fact(len)}$ 完全沒有處理重複；$${Math.round(fact(len) / (div * 2))}$ 多除了一次；$${fact(len - 1)}$ 錯用了圓形排列的公式。`,
       `If all $${len}$ letters were distinct there would be $${len}! = ${fact(len)}$ arrangements. Because ${word} repeats letters, swapping identical letters produces no new string, so the count is divided by the product of the factorials of the repeat counts — here $${div}$ — giving $\\frac{${fact(len)}}{${div}} = ${ans}$. Traps: $${fact(len)}$ ignores the repetition entirely; $${Math.round(fact(len) / (div * 2))}$ divides once too often; $${fact(len - 1)}$ applies the circular-arrangement formula.`])
  })

// PR1 — 條件概率 P(A|B) = P(A∩B) / P(B)
for (const [both, b] of [[1, 4], [1, 3], [2, 5], [1, 6], [3, 8], [2, 7], [3, 10], [1, 5],
  [2, 9], [4, 9], [3, 7], [5, 12]] as [number, number][]) {
  if (both >= b) continue
  add(`m1d_pr1_${both}_${b}`, T.probDist, FW.stats, 'hard',
    [`已知 $P(A \\cap B) = ${frac(both, 20)}$、$P(B) = ${frac(b, 20)}$。求 $P(A \\mid B)$。`,
     `Given $P(A \\cap B) = ${frac(both, 20)}$ and $P(B) = ${frac(b, 20)}$, find $P(A \\mid B)$.`],
    [n(`$${frac(both, b)}$`), n(`$${frac(b, both)}$`), n(`$${frac(both, 20)}$`), n(`$${frac(both * b, 400)}$`)],
    [`條件概率 $P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{${frac(both, 20)}}{${frac(b, 20)}} = ${frac(both, b)}$。分母是【給定條件】那個事件的概率 —— 意思是把樣本空間縮窄至 $B$ 已經發生的情況。陷阱：$${frac(b, both)}$ 把分子分母倒轉，求了 $P(B \\mid A)$ 的形式；$${frac(both, 20)}$ 只抄了 $P(A \\cap B)$；$${frac(both * b, 400)}$ 把兩個概率相乘，那是【獨立】事件求交集的算法，方向剛好相反。`,
     `Conditional probability is $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${frac(both, 20)}}{${frac(b, 20)}} = ${frac(both, b)}$. The denominator is the probability of the CONDITIONING event, which amounts to restricting the sample space to the case that $B$ has occurred. Traps: $${frac(b, both)}$ inverts the fraction and gives the form of $P(B \\mid A)$; $${frac(both, 20)}$ copies $P(A \\cap B)$; $${frac(both * b, 400)}$ multiplies the probabilities, which is how an intersection is found for INDEPENDENT events and runs the other way.`])
}

// PR2 — 互斥事件的加法定律與補事件
for (const [a, b] of [[3, 5], [2, 7], [4, 9], [1, 6], [5, 12], [3, 8], [2, 9], [7, 20],
  [3, 10], [1, 4], [5, 16], [3, 14]] as [number, number][]) {
  const num = a + b
  if (num >= 20) continue
  add(`m1d_pr2_${a}_${b}`, T.probDist, FW.stats, 'medium',
    [`兩個【互斥】事件的概率分別為 $${frac(a, 20)}$ 與 $${frac(b, 20)}$。兩者【皆不發生】的概率是多少？`,
     `Two MUTUALLY EXCLUSIVE events have probabilities $${frac(a, 20)}$ and $${frac(b, 20)}$. What is the probability that NEITHER occurs?`],
    [n(`$${frac(20 - num, 20)}$`), n(`$${frac(num, 20)}$`), n(`$${frac(a * b, 400)}$`), n(`$${frac(20 - a, 20)}$`)],
    [`互斥即兩者不能同時發生，故「其中之一發生」的概率為兩者相加：$${frac(a, 20)} + ${frac(b, 20)} = ${frac(num, 20)}$。「皆不發生」是它的補事件，用 1 減去：$1 - ${frac(num, 20)} = ${frac(20 - num, 20)}$。陷阱：$${frac(num, 20)}$ 是「其中之一發生」，忘記取補；$${frac(a * b, 400)}$ 把兩者相乘，但互斥事件的交集概率為零，相乘在此並不適用；$${frac(20 - a, 20)}$ 只處理了其中一個事件。`,
     `Mutually exclusive means the two cannot occur together, so the probability that EITHER occurs is their sum: $${frac(a, 20)} + ${frac(b, 20)} = ${frac(num, 20)}$. "Neither" is the complement of that, so subtract from 1: $1 - ${frac(num, 20)} = ${frac(20 - num, 20)}$. Traps: $${frac(num, 20)}$ is "either occurs" and omits the complement; $${frac(a * b, 400)}$ multiplies, but mutually exclusive events have zero intersection so multiplication does not apply; $${frac(20 - a, 20)}$ handles only one of the events.`])
}

// EL3 — 指數與對數函數的積分
for (const k of [2, 3, 4, 5]) {
  add(`m1d_el3a_${k}`, T.expLog, FW.calc, 'medium',
    [`求 $\\displaystyle\\int ${k}e^{${k}x}\\,dx$。`, `Evaluate $\\displaystyle\\int ${k}e^{${k}x}\\,dx$.`],
    [n(`$e^{${k}x} + C$`), n(`$${k}e^{${k}x} + C$`), n(`$${frac(1, k)}e^{${k}x} + C$`), n(`$${k * k}e^{${k}x} + C$`)],
    [`$\\int e^{kx}dx = \\dfrac{1}{k}e^{kx} + C$。此處被積函數前已有係數 $${k}$，與 $\\dfrac{1}{${k}}$ 恰好抵銷，故答案為 $e^{${k}x} + C$。不定積分必須寫上積分常數 $C$，這是它與定積分最基本的分別。陷阱：$${k}e^{${k}x} + C$ 漏了連鎖法則帶來的 $\\dfrac{1}{${k}}$；$${frac(1, k)}e^{${k}x} + C$ 多除了一次；$${k * k}e^{${k}x} + C$ 把係數乘了兩次。`,
     `Since $\\int e^{kx}dx = \\frac{1}{k}e^{kx} + C$, and the integrand already carries the factor $${k}$, the two cancel exactly to give $e^{${k}x} + C$. An indefinite integral must carry the constant $C$, which is the most basic difference from a definite integral. Traps: $${k}e^{${k}x} + C$ drops the $\\frac{1}{${k}}$ from the chain rule; $${frac(1, k)}e^{${k}x} + C$ divides once too often; $${k * k}e^{${k}x} + C$ applies the coefficient twice.`])
  add(`m1d_el3b_${k}`, T.expLog, FW.calc, 'medium',
    [`求 $\\dfrac{d}{dx}\\left[\\ln(${k}x)\\right]$。`, `Find $\\frac{d}{dx}\\left[\\ln(${k}x)\\right]$.`],
    [n(`$\\dfrac{1}{x}$`), n(`$\\dfrac{${k}}{x}$`), n(`$\\dfrac{1}{${k}x}$`), n(`$${k}\\ln x$`)],
    [`由連鎖法則，$\\dfrac{d}{dx}\\ln(${k}x) = \\dfrac{1}{${k}x} \\times ${k} = \\dfrac{1}{x}$。亦可先用對數法則化簡：$\\ln(${k}x) = \\ln ${k} + \\ln x$，而 $\\ln ${k}$ 是常數，求導後只剩 $\\dfrac{1}{x}$ —— 兩條路殊途同歸，正好互相驗算。留意常數倍數在對數內部並不影響導數。陷阱：$\\dfrac{${k}}{x}$ 把係數留了在分子；$\\dfrac{1}{${k}x}$ 漏了乘內層導數；$${k}\\ln x$ 根本未求導。`,
     `By the chain rule $\\frac{d}{dx}\\ln(${k}x) = \\frac{1}{${k}x} \\times ${k} = \\frac{1}{x}$. Alternatively simplify first: $\\ln(${k}x) = \\ln ${k} + \\ln x$, and since $\\ln ${k}$ is constant only $\\frac{1}{x}$ survives — the two routes agree and check each other. Note that a constant multiple inside a logarithm does not affect the derivative. Traps: $\\frac{${k}}{x}$ keeps the coefficient in the numerator; $\\frac{1}{${k}x}$ omits the inner derivative; $${k}\\ln x$ has not been differentiated at all.`])
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
