import type { Question } from './types'
import { createBank, n, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// M2 (Algebra & Calculus) — PARAMETRIC BANK (Mode A, correct-by-construction)
// PROPER M2 content: matrices/determinants, vectors, complex numbers, limits.
// Every answer + distractor computed by formula; shared add() drops non-4-distinct.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  matrices: { id: 'matrices', zh: '矩陣與行列式', en: 'Matrices & Determinants' },
  vectors: { id: 'vectors', zh: '向量', en: 'Vectors' },
  complex: { id: 'complex_numbers', zh: '複數', en: 'Complex Numbers' },
  limits: { id: 'limits', zh: '極限', en: 'Limits' },
  systems: { id: 'linear_systems', zh: '線性方程組', en: 'Systems of Linear Equations' },
} satisfies Record<string, TopicMeta>

const FW = {
  algebra: { id: 'algebra', zh: '代數', en: 'Algebra', emoji: '🔢' },
  calc: { id: 'calculus', zh: '微積分', en: 'Calculus', emoji: '📈' },
  geom: { id: 'vector_geometry', zh: '向量幾何', en: 'Vector Geometry', emoji: '➡️' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('m2')

// complex-number formatter: drops ±1 coefficient on i, handles signs
const cplx = (a: number, b: number): string => {
  if (b === 0) return `${a}`
  const im = b === 1 ? 'i' : b === -1 ? '-i' : `${b}i`
  if (a === 0) return im
  return b > 0 ? `${a} + ${b === 1 ? '' : b}i` : `${a} - ${b === -1 ? '' : Math.abs(b)}i`
}

// ═══════════════════════════════════════════════════════════════════════════
// 補底 (easy)
// ═══════════════════════════════════════════════════════════════════════════

// E1 — 2×2 determinant: |a b; c d| = ad − bc
for (let a = 2; a <= 4; a++) {
  for (let b = 1; b <= 3; b++) {
    for (let d = 2; d <= 4; d++) {
      const c = 2
      const det = a * d - b * c
      add(`m2_e1_${a}_${b}_${d}`, T.matrices, FW.algebra, 'easy',
        [`求行列式 $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}$。`,
         `Evaluate $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}$.`],
        [n(`$${det}$`), n(`$${a * d + b * c}$`), n(`$${a * c - b * d}$`), n(`$${a * d}$`)],
        [`$2\\times2$ 行列式 $= ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}$。陷阱：$${a * d + b * c}$ 加咗（符號錯）；$${a * d}$ 漏咗 $-bc$。`,
         `$\\det = ad-bc = ${det}$. Trap: $${a * d + b * c}$ adds instead of subtracts.`])
    }
  }
}

// E2 — modulus of a complex number: |a+bi| = √(a²+b²) (Pythagorean → integer)
;([[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [7, 24], [20, 21], [12, 16], [8, 6], [24, 7]] as const)
  .forEach(([a, b], i) => {
    const mod = Math.round(Math.hypot(a, b))
    add(`m2_e2_${i}`, T.complex, FW.algebra, 'easy',
      [`求複數 $${cplx(a, b)}$ 的模 $|z|$。`, `Find the modulus $|z|$ of $${cplx(a, b)}$.`],
      [n(`$${mod}$`), n(`$${a * a + b * b}$`), n(`$${a + b}$`), n(`$${Math.abs(a - b)}$`)],
      [`$|a+bi| = \\sqrt{a^2+b^2} = \\sqrt{${a * a}+${b * b}} = \\sqrt{${a * a + b * b}} = ${mod}$。陷阱：$${a * a + b * b}$ 漏咗開方；$${a + b}$ 直接相加。`,
       `$|z| = \\sqrt{a^2+b^2} = ${mod}$. Trap: $${a * a + b * b}$ forgets the square root.`])
  })

// E3 — dot product: a·b = a₁b₁ + a₂b₂
for (let a1 = 1; a1 <= 4; a1++) {
  for (let a2 = 1; a2 <= 4; a2++) {
    const b1 = 3, b2 = 2
    const dot = a1 * b1 + a2 * b2
    add(`m2_e3_${a1}_${a2}`, T.vectors, FW.geom, 'easy',
      [`設 $\\mathbf{a} = (${a1}, ${a2})$、$\\mathbf{b} = (${b1}, ${b2})$，求 $\\mathbf{a} \\cdot \\mathbf{b}$。`,
       `Given $\\mathbf{a} = (${a1}, ${a2})$, $\\mathbf{b} = (${b1}, ${b2})$, find $\\mathbf{a} \\cdot \\mathbf{b}$.`],
      [n(`$${dot}$`), n(`$${a1 * b1}$`), n(`$${a1 * a2 + b1 * b2}$`), n(`$${a1 + a2 + b1 + b2}$`)],
      [`點積 $= a_1b_1 + a_2b_2 = (${a1})(${b1}) + (${a2})(${b2}) = ${a1 * b1} + ${a2 * b2} = ${dot}$。陷阱：$${a1 * b1}$ 淨計咗第一項。`,
       `Dot product $= a_1b_1+a_2b_2 = ${dot}$. Trap: $${a1 * b1}$ is only the first term.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 普通 (medium)
// ═══════════════════════════════════════════════════════════════════════════

// M1 — 2×2 matrix product, (1,1) entry: c₁₁ = a₁₁b₁₁ + a₁₂b₂₁
for (let x = 1; x <= 4; x++) {
  for (let y = 1; y <= 4; y++) {
    const a11 = x, a12 = y, b11 = 2, b21 = 3, b12 = 1, b22 = 4
    const c11 = a11 * b11 + a12 * b21
    add(`m2_m1_${x}_${y}`, T.matrices, FW.algebra, 'medium',
      [`設 $A = \\begin{pmatrix} ${a11} & ${a12} \\\\ 1 & 1 \\end{pmatrix}$、$B = \\begin{pmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{pmatrix}$，求 $AB$ 的第 $(1,1)$ 項。`,
       `Given $A = \\begin{pmatrix} ${a11} & ${a12} \\\\ 1 & 1 \\end{pmatrix}$, $B = \\begin{pmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{pmatrix}$, find the $(1,1)$ entry of $AB$.`],
      [n(`$${c11}$`), n(`$${a11 * b11}$`), n(`$${a11 * b11 + a12 * b22}$`), n(`$${a11 * b12 + a12 * b22}$`)],
      [`$(1,1)$ 項 $= a_{11}b_{11} + a_{12}b_{21} = (${a11})(${b11}) + (${a12})(${b21}) = ${a11 * b11} + ${a12 * b21} = ${c11}$。陷阱：$${a11 * b11}$ 漏咗第二項；$${a11 * b11 + a12 * b22}$ 用錯咗 $b_{22}$。`,
       `$(1,1) = a_{11}b_{11}+a_{12}b_{21} = ${c11}$. Trap: $${a11 * b11}$ drops the second term.`])
  }
}

// M2 — complex multiplication, real part: Re[(a+bi)(c+di)] = ac − bd
for (let a = 1; a <= 4; a++) {
  for (let b = 1; b <= 4; b++) {
    const c = 2, d = 3
    const re = a * c - b * d
    add(`m2_m2_${a}_${b}`, T.complex, FW.algebra, 'medium',
      [`求 $(${cplx(a, b)})(${cplx(c, d)})$ 的實部。`, `Find the real part of $(${cplx(a, b)})(${cplx(c, d)})$.`],
      [n(`$${re}$`), n(`$${a * c + b * d}$`), n(`$${a * c}$`), n(`$${a * d + b * c}$`)],
      [`$(a+bi)(c+di) = (ac - bd) + (ad + bc)i$，實部 $= ac - bd = (${a})(${c}) - (${b})(${d}) = ${a * c} - ${b * d} = ${re}$。陷阱：$${a * c + b * d}$ 漏咗 $i^2 = -1$（加咗）；$${a * d + b * c}$ 係虛部。`,
       `Re $= ac-bd = ${re}$. Trap: $${a * c + b * d}$ forgets $i^2=-1$; $${a * d + b * c}$ is the imaginary part.`])
  }
}

// M3 — limit (x² − a²)/(x − a) as x→a = 2a
for (let a = 2; a <= 22; a++) {
  add(`m2_m3_${a}`, T.limits, FW.calc, 'medium',
    [`求 $\\displaystyle\\lim_{x \\to ${a}} \\dfrac{x^2 - ${a * a}}{x - ${a}}$。`,
     `Find $\\displaystyle\\lim_{x \\to ${a}} \\dfrac{x^2 - ${a * a}}{x - ${a}}$.`],
    [n(`$${2 * a}$`), n(`$${a}$`), n(`$${a * a}$`), n(`$0$`)],
    [`因式分解：$\\dfrac{x^2 - ${a * a}}{x - ${a}} = \\dfrac{(x-${a})(x+${a})}{x-${a}} = x + ${a}$，代 $x = ${a}$ 得 $${2 * a}$。陷阱：$0$ 誤以為 $\\tfrac00$ 無定義；$${a}$ 漏咗加 $a$。`,
     `Factor: $\\frac{(x-${a})(x+${a})}{x-${a}} = x+${a} \\to ${2 * a}$. Trap: $0$ assumes $\\frac00$ is undefined.`])
}

// M4 — 2D "cross" magnitude / parallelogram area: |a₁b₂ − a₂b₁|
for (let a1 = 1; a1 <= 4; a1++) {
  for (let a2 = 1; a2 <= 4; a2++) {
    const b1 = 1, b2 = 3
    const area = Math.abs(a1 * b2 - a2 * b1)
    if (area === 0) continue
    add(`m2_m4_${a1}_${a2}`, T.vectors, FW.geom, 'medium',
      [`設 $\\mathbf{a} = (${a1}, ${a2})$、$\\mathbf{b} = (${b1}, ${b2})$，求以兩者為鄰邊的平行四邊形面積。`,
       `Given $\\mathbf{a} = (${a1}, ${a2})$, $\\mathbf{b} = (${b1}, ${b2})$, find the area of the parallelogram they span.`],
      [n(`$${area}$`), n(`$${a1 * b2 + a2 * b1}$`), n(`$${a1 * b1 + a2 * b2}$`), n(`$${Math.abs(a1 * a2 - b1 * b2)}$`)],
      [`面積 $= |a_1b_2 - a_2b_1| = |(${a1})(${b2}) - (${a2})(${b1})| = |${a1 * b2} - ${a2 * b1}| = ${area}$。陷阱：$${a1 * b1 + a2 * b2}$ 係點積（唔係面積）。`,
       `Area $= |a_1b_2 - a_2b_1| = ${area}$. Trap: $${a1 * b1 + a2 * b2}$ is the dot product.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 拔尖 (hard)
// ═══════════════════════════════════════════════════════════════════════════

// H1 — solve a 2×2 system by Cramer's rule (constructed to have integer x)
for (let x0 = 1; x0 <= 5; x0++) {
  for (let y0 = 1; y0 <= 5; y0++) {
    if (x0 === y0) continue // keep the correct answer distinct from the y-solution distractor
    const a1 = 2, b1 = 1, a2 = 1, b2 = 3 // det = 2*3 - 1*1 = 5 ≠ 0
    const c1 = a1 * x0 + b1 * y0
    const c2 = a2 * x0 + b2 * y0
    const det = a1 * b2 - b1 * a2
    // a1,b1,a2,b2 fixed = 2,1,1,3 → write coefficients cleanly (no "1x"/"1y")
    add(`m2_h1_${x0}_${y0}`, T.systems, FW.algebra, 'hard',
      [`解方程組 $\\begin{cases} 2x + y = ${c1} \\\\ x + 3y = ${c2} \\end{cases}$，求 $x$。`,
       `Solve $\\begin{cases} 2x + y = ${c1} \\\\ x + 3y = ${c2} \\end{cases}$ for $x$.`],
      [n(`$${x0}$`), n(`$${y0}$`), n(`$${x0 + y0}$`), n(`$${-x0}$`)],
      [`克拉瑪法則：$\\Delta = ${a1}\\cdot${b2} - ${b1}\\cdot${a2} = ${det}$，$x = \\dfrac{\\begin{vmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{vmatrix}}{\\Delta} = \\dfrac{${c1 * b2 - b1 * c2}}{${det}} = ${x0}$。陷阱：$${y0}$ 係 $y$ 的解，唔係 $x$。`,
       `Cramer: $x = \\frac{c_1b_2 - b_1c_2}{\\Delta} = ${x0}$. Trap: $${y0}$ is $y$, not $x$.`])
  }
}

// H2 — 3×3 determinant (upper-triangular-ish so it stays clean but non-trivial)
;([[1, 2, 3, 0, 1, 4, 0, 0, 2], [2, 1, 0, 1, 3, 1, 0, 2, 2], [1, 0, 2, 3, 1, 0, 0, 2, 1], [2, 0, 1, 0, 3, 2, 1, 0, 2], [1, 1, 0, 0, 2, 1, 3, 0, 1],
  [3, 1, 2, 0, 2, 1, 1, 0, 3], [2, 2, 1, 1, 3, 0, 0, 1, 2], [1, 3, 0, 2, 1, 1, 0, 2, 3], [4, 0, 1, 1, 2, 0, 0, 3, 2], [2, 1, 3, 0, 4, 1, 1, 0, 2],
  [1, 0, 0, 2, 3, 1, 1, 2, 4], [3, 2, 0, 0, 1, 2, 2, 0, 1], [2, 0, 3, 1, 4, 0, 0, 1, 2], [1, 2, 0, 3, 0, 1, 0, 2, 2], [2, 3, 1, 0, 2, 0, 1, 0, 4]] as const)
  .forEach((m, i) => {
    const [a, b, c, d, e, f, g, h, k] = m
    const det = a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g)
    const wrongSign = a * (e * k - f * h) + b * (d * k - f * g) + c * (d * h - e * g) // forgot alternating sign
    add(`m2_h2_${i}`, T.matrices, FW.algebra, 'hard',
      [`求行列式 $\\begin{vmatrix} ${a} & ${b} & ${c} \\\\ ${d} & ${e} & ${f} \\\\ ${g} & ${h} & ${k} \\end{vmatrix}$。`,
       `Evaluate $\\begin{vmatrix} ${a} & ${b} & ${c} \\\\ ${d} & ${e} & ${f} \\\\ ${g} & ${h} & ${k} \\end{vmatrix}$.`],
      [n(`$${det}$`), n(`$${wrongSign}$`), n(`$${a * e * k}$`), n(`$${det + 1}$`)],
      [`沿第一行餘因子展開：$${a}(${e}\\cdot${k}-${f}\\cdot${h}) - ${b}(${d}\\cdot${k}-${f}\\cdot${g}) + ${c}(${d}\\cdot${h}-${e}\\cdot${g}) = ${det}$。陷阱：$${wrongSign}$ 漏咗中間項嘅負號；$${a * e * k}$ 淨乘咗對角線。`,
       `Cofactor expansion along row 1 $= ${det}$. Trap: $${wrongSign}$ drops the alternating sign; $${a * e * k}$ multiplies only the diagonal.`])
  })

// H3 — modulus of a product: |z₁z₂| = |z₁||z₂| (Pythagorean parts → integer)
;([[3, 4, 5, 12], [6, 8, 8, 15], [5, 12, 20, 21], [3, 4, 24, 7], [8, 15, 9, 12], [5, 12, 8, 6], [3, 4, 6, 8], [7, 24, 3, 4]] as const)
  .forEach(([a, b, c, d], i) => {
    const m1 = Math.round(Math.hypot(a, b)), m2 = Math.round(Math.hypot(c, d))
    const prod = m1 * m2
    add(`m2_h3_${i}`, T.complex, FW.algebra, 'hard',
      [`設 $z_1 = ${cplx(a, b)}$、$z_2 = ${cplx(c, d)}$，求 $|z_1 z_2|$。`,
       `Given $z_1 = ${cplx(a, b)}$, $z_2 = ${cplx(c, d)}$, find $|z_1 z_2|$.`],
      [n(`$${prod}$`), n(`$${m1 + m2}$`), n(`$${prod * prod}$`), n(`$${Math.abs(m1 - m2)}$`)],
      [`$|z_1 z_2| = |z_1||z_2| = ${m1} \\times ${m2} = ${prod}$（$|z_1| = \\sqrt{${a * a}+${b * b}} = ${m1}$、$|z_2| = ${m2}$）。陷阱：$${m1 + m2}$ 加咗模；$${prod * prod}$ 漏咗開方。`,
       `$|z_1 z_2| = |z_1||z_2| = ${prod}$. Trap: $${m1 + m2}$ adds the moduli.`])
  })

export const m2BankQuestions: Question[] = bank
