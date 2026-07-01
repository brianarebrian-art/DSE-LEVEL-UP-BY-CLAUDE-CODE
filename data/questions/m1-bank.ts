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
  binomialThm: { id: 'binomial_theorem', zh: '二項式定理', en: 'Binomial Theorem' },
  binomialDist: { id: 'binomial_distribution', zh: '二項分佈', en: 'Binomial Distribution' },
  poisson: { id: 'poisson_distribution', zh: '泊松分佈', en: 'Poisson Distribution' },
  normal: { id: 'normal_distribution', zh: '正態分佈', en: 'Normal Distribution' },
} satisfies Record<string, TopicMeta>

const FW = {
  calc: { id: 'calculus', zh: '微積分', en: 'Calculus', emoji: '📈' },
  stats: { id: 'statistics', zh: '統計', en: 'Statistics', emoji: '📊' },
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
      [`冪法則：$\\dfrac{d}{dx}(ax^n) = an\\,x^{n-1} = ${pw(a * p, p - 1)}$。陷阱：$${pw(a, p - 1)}$ 漏咗 $\\times n$；$${pw(a * p, p)}$ 漏咗指數減一。`,
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
      [`冪的積分：$\\int ax^n\\,dx = \\dfrac{a}{n+1}x^{n+1}+C = ${pw(k, p + 1)}+C$。陷阱：$${pw(a, p + 1)}+C$ 漏咗除以 $(n+1)$。`,
       `$\\int ax^n\\,dx = \\frac{a}{n+1}x^{n+1}+C = ${pw(k, p + 1)}+C$. Trap: $${pw(a, p + 1)}+C$ forgets $\\div(n+1)$.`])
  }
}

// E3 — binomial coefficient C(n, r)
for (let m = 4; m <= 8; m++) {
  for (let r = 2; r <= m - 2; r++) {
    add(`m1_e3_${m}_${r}`, T.binomialThm, FW.stats, 'easy',
      [`求 $\\binom{${m}}{${r}}$（即 $C^{${m}}_{${r}}$）的值。`, `Find $\\binom{${m}}{${r}}$ (i.e. $C^{${m}}_{${r}}$).`],
      [n(`$${nCr(m, r)}$`), n(`$${nPr(m, r)}$`), n(`$${nCr(m, r) * 2}$`), n(`$${m * r}$`)],
      [`$\\binom{${m}}{${r}} = \\dfrac{${m}!}{${r}!(${m}-${r})!} = ${nCr(m, r)}$。陷阱：$${nPr(m, r)}$ 係排列 $P^{${m}}_{${r}}$（冇除 $r!$）。`,
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
      [`二項分佈 $E(X) = np = ${m} \\times ${frac(pn, pd)} = ${mean}$。陷阱：$${round(m * pn / pd * (1 - pn / pd), 2)}$ 係方差 $np(1-p)$。`,
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
      [`$f'(x) = ${p}x^{${p - 1}}$，故 $f'(${k}) = ${p}\\times${k}^{${p - 1}} = ${val}$。陷阱：$${Math.pow(k, p)}$ 冇求導（係 $f(${k})$）。`,
       `$f'(x)=${p}x^{${p - 1}}$ ⇒ $f'(${k})=${val}$. Trap: $${Math.pow(k, p)}$ is $f(${k})$, not $f'(${k})$.`])
  }
}

// M2 — differentiate an exponential: d/dx(e^{ax}) = a·e^{ax}
for (let a = 2; a <= 15; a++) {
  add(`m1_m2_${a}`, T.diff, FW.calc, 'medium',
    [`求 $\\dfrac{d}{dx}(e^{${a}x})$。`, `Find $\\dfrac{d}{dx}(e^{${a}x})$.`],
    [n(`$${a}e^{${a}x}$`), n(`$e^{${a}x}$`), n(`$${a}xe^{${a}x}$`), n(`$${a}e^{${a - 1 === 1 ? '' : a - 1}x}$`)],
    [`鏈式法則：$\\dfrac{d}{dx}(e^{ax}) = a\\,e^{ax} = ${a}e^{${a}x}$。陷阱：$e^{${a}x}$ 漏咗 $\\times a$；$${a}xe^{${a}x}$ 誤當冪函數。`,
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
      [`$\\int_0^{${b}} ${pw(a, p)}\\,dx = \\left[${pw(1, p + 1)}\\right]_0^{${b}} = ${b}^{${p + 1}} = ${val}$。陷阱：$${noDiv}$ 漏咗除以 $(n+1)$。`,
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
        [`$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sigma}} = ${dz}$。陷阱：$${round((x - mu) / (sigma * sigma), 3)}$ 誤除以方差 $\\sigma^2$；$${x - mu}$ 漏咗除以 $\\sigma$。`,
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
      [`乘積法則：$(uv)' = u'v + uv'$，$u=x^{${p}}$、$v=e^{${a}x}$ ⇒ $\\dfrac{d}{dx} = ${pw(p, p - 1)}e^{${a}x} + x^{${p}}\\cdot${a}e^{${a}x} = e^{${a}x}(${pw(a, p)} + ${pw(p, p - 1)})$。陷阱：$${pw(p, p - 1)}e^{${a}x}$ 淨係求咗 $x^{${p}}$ 個項，漏咗 $e^{${a}x}$ 求導。`,
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
        [`$f'(x) = ${2 * a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = 0$ ⇒ $x = ${frac(-b, 2 * a)}$，代回 $f = c - \\dfrac{b^2}{4a} = ${c} - ${(b * b) / (4 * a)} = ${minVal}$。陷阱：$${round(-b / (2 * a), 2)}$ 係取得最小值嘅 $x$，唔係最小值本身。`,
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
    [`用補集：$P(X\\ge1) = 1 - P(X=0) = 1 - \\left(\\tfrac12\\right)^{${m}} = 1 - \\dfrac{1}{2^{${m}}} = ${frac(den - 1, den)}$。陷阱：$${frac(1, den)}$ 係 $P(X=0)$ 本身（未用補集）。`,
     `Complement: $P(X\\ge1)=1-\\left(\\tfrac12\\right)^{${m}}=${frac(den - 1, den)}$. Trap: $${frac(1, den)}$ is $P(X=0)$ itself.`])
}

export const m1BankQuestions: Question[] = bank
