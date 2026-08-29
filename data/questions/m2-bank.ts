import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, n, type TopicMeta, type FwMeta, round, frac } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// M2 (Algebra & Calculus) — PARAMETRIC BANK (Mode A, correct-by-construction)
//
// ── 2026-08-23：移除複數（complex_numbers）30 條 ──────────────────────────
// 創辦人拍板剷走。HKDSE 數學延伸部分單元二（代數與微積分）的課程範圍為
// 三個範疇：基礎知識（根式、數學歸納法、二項式定理、三角函數、常數 e）、
// 代數（矩陣、線性方程組、向量）、微積分（極限、微分法、積分法）。
// 複數並不在其中 —— 它屬於【必修部分】的方程與代數範疇。
//
// 移除的是三組生成器：E2（模，10 條易）、M2（乘積實部，12 條中）、
// H3（模的乘積，8 條難），連同 T.complex、m2BankTopics 的登記項，
// 以及只服務這三組的 cplx() 輔助函數。
// 影響（憲章 §6 —— 動數據前必查）：m2 由 308 條減至 278 條，難度分佈
// 由 28/50/22 變 27/51/22，仍然貼近 3:5:2，亦遠高於任何下限。
// 無測試、無 cap-plan、無其他科目引用此課題。
// PROPER M2 content: matrices/determinants, vectors, complex numbers, limits.
// Every answer + distractor computed by formula; shared add() drops non-4-distinct.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  matrices: { id: 'matrices', zh: '矩陣與行列式', en: 'Matrices & Determinants' },
  vectors: { id: 'vectors', zh: '向量', en: 'Vectors' },
  limits: { id: 'limits', zh: '極限', en: 'Limits' },
  systems: { id: 'linear_systems', zh: '線性方程組', en: 'Systems of Linear Equations' },
  // ── 2026-08-28 平均分佈補強 ────────────────────────────────────────────
  // 實測 M2 10 個課題：matrices 已有 79 條，而 m2_vectors_3d 僅 2 條、
  // binomial_theorem 12 條（平均目標 100）。依指示先補題數最少者。
  vec3d: { id: 'm2_vectors_3d', zh: '三維向量', en: '3-D vectors' },
  binomial: { id: 'binomial_theorem', zh: '二項式定理', en: 'Binomial Theorem' },
  induction: { id: 'mathematical_induction', zh: '數學歸納法', en: 'Mathematical Induction' },
  integration: { id: 'integration', zh: '積分法', en: 'Integration' },
  diff: { id: 'differentiation', zh: '微分法', en: 'Differentiation' },
  calcapp: { id: 'calculus_app', zh: '微積分應用', en: 'Applications of Calculus' },
} satisfies Record<string, TopicMeta>

const FW = {
  algebra: { id: 'algebra', zh: '代數', en: 'Algebra', emoji: '🔢' },
  calc: { id: 'calculus', zh: '微積分', en: 'Calculus', emoji: '📈' },
  geom: { id: 'vector_geometry', zh: '向量幾何', en: 'Vector Geometry', emoji: '➡️' },
  modelling: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  transform: { id: 'transformative_thinking', zh: '轉化思維', en: 'Transformative Thinking', emoji: '🔄' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('m2')

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
        [`$2\\times2$ 行列式 $= ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}$。陷阱：$${a * d + b * c}$ 加了（符號錯）；$${a * d}$ 漏了 $-bc$。`,
         `$\\det = ad-bc = ${det}$. Trap: $${a * d + b * c}$ adds instead of subtracts.`])
    }
  }
}

// E3 — dot product: a·b = a₁b₁ + a₂b₂
for (let a1 = 1; a1 <= 4; a1++) {
  for (let a2 = 1; a2 <= 4; a2++) {
    const b1 = 3, b2 = 2
    const dot = a1 * b1 + a2 * b2
    add(`m2_e3_${a1}_${a2}`, T.vectors, FW.geom, 'easy',
      [`設 $\\mathbf{a} = (${a1}, ${a2})$、$\\mathbf{b} = (${b1}, ${b2})$，求 $\\mathbf{a} \\cdot \\mathbf{b}$。`,
       `Given $\\mathbf{a} = (${a1}, ${a2})$, $\\mathbf{b} = (${b1}, ${b2})$, find $\\mathbf{a} \\cdot \\mathbf{b}$.`],
      [n(`$${dot}$`), n(`$${a1 * b1}$`), n(`$${a1 * a2 + b1 * b2}$`), n(`$${a1 + a2 + b1 + b2}$`)],
      [`點積 $= a_1b_1 + a_2b_2 = (${a1})(${b1}) + (${a2})(${b2}) = ${a1 * b1} + ${a2 * b2} = ${dot}$。陷阱：$${a1 * b1}$ 只計了第一項。`,
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
      [`$(1,1)$ 項 $= a_{11}b_{11} + a_{12}b_{21} = (${a11})(${b11}) + (${a12})(${b21}) = ${a11 * b11} + ${a12 * b21} = ${c11}$。陷阱：$${a11 * b11}$ 漏了第二項；$${a11 * b11 + a12 * b22}$ 用錯了 $b_{22}$。`,
       `$(1,1) = a_{11}b_{11}+a_{12}b_{21} = ${c11}$. Trap: $${a11 * b11}$ drops the second term.`])
  }
}

// M3 — limit (x² − a²)/(x − a) as x→a = 2a
for (let a = 2; a <= 22; a++) {
  add(`m2_m3_${a}`, T.limits, FW.calc, 'medium',
    [`求 $\\displaystyle\\lim_{x \\to ${a}} \\dfrac{x^2 - ${a * a}}{x - ${a}}$。`,
     `Find $\\displaystyle\\lim_{x \\to ${a}} \\dfrac{x^2 - ${a * a}}{x - ${a}}$.`],
    [n(`$${2 * a}$`), n(`$${a}$`), n(`$${a * a}$`), n(`$0$`)],
    [`因式分解：$\\dfrac{x^2 - ${a * a}}{x - ${a}} = \\dfrac{(x-${a})(x+${a})}{x-${a}} = x + ${a}$，代 $x = ${a}$ 得 $${2 * a}$。陷阱：$0$ 誤以為 $\\tfrac00$ 無定義；$${a}$ 漏了加 $a$。`,
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
      [`面積 $= |a_1b_2 - a_2b_1| = |(${a1})(${b2}) - (${a2})(${b1})| = |${a1 * b2} - ${a2 * b1}| = ${area}$。陷阱：$${a1 * b1 + a2 * b2}$ 是點積（並非面積）。`,
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
      [`克拉瑪法則：$\\Delta = ${a1}\\cdot${b2} - ${b1}\\cdot${a2} = ${det}$，$x = \\dfrac{\\begin{vmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{vmatrix}}{\\Delta} = \\dfrac{${c1 * b2 - b1 * c2}}{${det}} = ${x0}$。陷阱：$${y0}$ 是 $y$ 的解，並非 $x$。`,
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
      [`沿第一行餘因子展開：$${a}(${e}\\cdot${k}-${f}\\cdot${h}) - ${b}(${d}\\cdot${k}-${f}\\cdot${g}) + ${c}(${d}\\cdot${h}-${e}\\cdot${g}) = ${det}$。陷阱：$${wrongSign}$ 漏了中間項的負號；$${a * e * k}$ 只乘了對角線。`,
       `Cofactor expansion along row 1 $= ${det}$. Trap: $${wrongSign}$ drops the alternating sign; $${a * e * k}$ multiplies only the diagonal.`])
  })

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 四個最薄課題（2026-08-28）
// ═══════════════════════════════════════════════════════════════════════════

const nCr = (nn: number, r: number): number => {
  let v = 1
  for (let i = 0; i < r; i++) v = (v * (nn - i)) / (i + 1)
  return Math.round(v)
}

// V1 — 三維向量的模：|v| = √(a² + b² + c²)（只取完全平方，避免無理數）
for (const [a, b, c] of [[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 6, 9], [4, 4, 7], [3, 4, 12], [2, 10, 11], [6, 6, 7], [4, 8, 19], [2, 5, 14], [1, 12, 12], [3, 12, 4]] as [number, number, number][]) {
  const sq = a * a + b * b + c * c
  const mag = Math.sqrt(sq)
  if (!Number.isInteger(mag)) continue
  add(`m2b_v1_${a}_${b}_${c}`, T.vec3d, FW.modelling, 'easy',
    [`求三維向量 $\\mathbf{v} = (${a},\\ ${b},\\ ${c})$ 的模。`, `Find the magnitude of the 3-D vector $\\mathbf{v} = (${a},\\ ${b},\\ ${c})$.`],
    [n(`$${mag}$`), n(`$${a + b + c}$`), n(`$${sq}$`), n(`$${round(Math.sqrt(a + b + c), 3)}$`)],
    [`三維向量的模 $|\\mathbf{v}| = \\sqrt{a^2 + b^2 + c^2} = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${sq}} = ${mag}$。陷阱：$${a + b + c}$ 直接把分量相加；$${sq}$ 停在平方和而未開方；$${round(Math.sqrt(a + b + c), 3)}$ 先加後開方，次序倒轉。`,
     `The magnitude is $|\\mathbf{v}| = \\sqrt{a^2 + b^2 + c^2} = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${sq}} = ${mag}$. Traps: $${a + b + c}$ simply adds the components; $${sq}$ stops at the sum of squares without taking the root; $${round(Math.sqrt(a + b + c), 3)}$ adds before squaring, reversing the order.`])
}

// V2 — 三維向量點積 a·b = a₁b₁ + a₂b₂ + a₃b₃
for (const [a1, a2, a3, b1, b2, b3] of [[1, 2, 3, 4, 5, 6], [2, 0, 1, 3, 4, 5], [1, 1, 1, 2, 3, 4], [3, 2, 1, 1, 2, 3], [2, 3, 4, 1, 0, 2], [5, 1, 2, 2, 3, 1], [1, 4, 2, 3, 1, 5], [2, 2, 3, 4, 1, 1]] as [number, number, number, number, number, number][]) {
  const dot = a1 * b1 + a2 * b2 + a3 * b3
  add(`m2b_v2_${a1}${a2}${a3}_${b1}${b2}${b3}`, T.vec3d, FW.modelling, 'medium',
    [`設 $\\mathbf{a} = (${a1},\\ ${a2},\\ ${a3})$、$\\mathbf{b} = (${b1},\\ ${b2},\\ ${b3})$。求 $\\mathbf{a} \\cdot \\mathbf{b}$。`,
     `Let $\\mathbf{a} = (${a1},\\ ${a2},\\ ${a3})$ and $\\mathbf{b} = (${b1},\\ ${b2},\\ ${b3})$. Find $\\mathbf{a} \\cdot \\mathbf{b}$.`],
    [n(`$${dot}$`), n(`$${(a1 + b1) + (a2 + b2) + (a3 + b3)}$`), n(`$${a1 * b1}$`), n(`$${a1 * a2 * a3 + b1 * b2 * b3}$`)],
    [`點積是對應分量相乘後相加：$${a1}(${b1}) + ${a2}(${b2}) + ${a3}(${b3}) = ${a1 * b1} + ${a2 * b2} + ${a3 * b3} = ${dot}$。點積的結果是一個純量而非向量，這是它與叉積最重要的分別。陷阱：$${(a1 + b1) + (a2 + b2) + (a3 + b3)}$ 把分量相加；$${a1 * b1}$ 只算了第一項。`,
     `The dot product multiplies corresponding components and adds: $${a1}(${b1}) + ${a2}(${b2}) + ${a3}(${b3}) = ${a1 * b1} + ${a2 * b2} + ${a3 * b3} = ${dot}$. The result is a scalar rather than a vector, which is the key difference from the cross product. Traps: $${(a1 + b1) + (a2 + b2) + (a3 + b3)}$ adds the components; $${a1 * b1}$ takes only the first term.`])
}

// B1 — 二項式定理：(1+x)ⁿ 中 xʳ 的係數 = C(n, r)
for (const nn of [5, 6, 7, 8, 9, 10]) {
  for (const r of [2, 3, 4]) {
    if (r >= nn) continue
    const c = nCr(nn, r)
    add(`m2b_b1_${nn}_${r}`, T.binomial, FW.decompose, 'medium',
      [`在 $(1 + x)^{${nn}}$ 的展開式中，$x^{${r}}$ 的係數是多少？`,
       `In the expansion of $(1 + x)^{${nn}}$, what is the coefficient of $x^{${r}}$?`],
      [n(`$${c}$`), n(`$${nCr(nn, r + 1)}$`), n(`$${nn * r}$`), n(`$${nn}$`)],
      [`由二項式定理，$(1+x)^{n}$ 中 $x^{r}$ 的係數為 $\\binom{n}{r}$。代入 $n = ${nn}$、$r = ${r}$：$\\binom{${nn}}{${r}} = ${c}$。陷阱：$${nCr(nn, r + 1)}$ 取錯了項（$r$ 差一，因為展開式由 $x^0$ 開始數，第 $k$ 項對應 $x^{k-1}$）；$${nn * r}$ 用了相乘；$${nn}$ 只抄了指數。`,
       `By the binomial theorem the coefficient of $x^{r}$ in $(1+x)^{n}$ is $\\binom{n}{r}$. With $n = ${nn}$ and $r = ${r}$ this is $\\binom{${nn}}{${r}} = ${c}$. Traps: $${nCr(nn, r + 1)}$ takes the wrong term, since the expansion is counted from $x^0$ so the $k$-th term carries $x^{k-1}$; $${nn * r}$ multiplies; $${nn}$ copies the exponent.`])
  }
}

// I1 — 定積分 ∫₀ᵃ xⁿ dx = a^{n+1}/(n+1)
// 刻意用【定】積分而非不定積分：m1-bank 已有 ∫kxⁿ dx 一族，寫成不定積分
// 會與之題幹完全相同（實測撞三條），而定積分本身亦更貼 M2 的卷面。
// 只取 a^{n+1} 可被 (n+1) 整除的組合，令答案為整數。
for (const [aa, nn] of [[3, 2], [4, 1], [2, 3], [6, 2], [6, 1], [5, 4], [4, 3], [9, 2], [10, 1], [6, 3], [2, 1], [8, 1], [12, 2], [3, 3]] as [number, number][]) {
  const val = aa ** (nn + 1) / (nn + 1)
  if (!Number.isInteger(val)) continue
  add(`m2b_i1_${aa}_${nn}`, T.integration, FW.transform, 'medium',
    [`求定積分 $\\displaystyle\\int_{0}^{${aa}} x^{${nn}}\\,dx$。`,
     `Evaluate the definite integral $\\displaystyle\\int_{0}^{${aa}} x^{${nn}}\\,dx$.`],
    [n(`$${val}$`), n(`$${aa ** (nn + 1)}$`), n(`$${round(aa ** nn / (nn + 1), 3)}$`), n(`$${nn * aa ** (nn - 1)}$`)],
    [`先求原函數：$\\int x^{${nn}}\\,dx = \\dfrac{x^{${nn + 1}}}{${nn + 1}}$。再代入上下限：$\\left[\\dfrac{x^{${nn + 1}}}{${nn + 1}}\\right]_{0}^{${aa}} = \\dfrac{${aa}^{${nn + 1}}}{${nn + 1}} - 0 = \\dfrac{${aa ** (nn + 1)}}{${nn + 1}} = ${val}$。定積分的結果是一個數值，不需要積分常數 $C$——這是它與不定積分最基本的分別。陷阱：$${aa ** (nn + 1)}$ 漏了除以新指數；$${round(aa ** nn / (nn + 1), 3)}$ 指數未加一；$${nn * aa ** (nn - 1)}$ 做了微分。`,
     `First find the antiderivative: $\\int x^{${nn}}\\,dx = \\frac{x^{${nn + 1}}}{${nn + 1}}$. Then substitute the limits: $\\left[\\frac{x^{${nn + 1}}}{${nn + 1}}\\right]_{0}^{${aa}} = \\frac{${aa}^{${nn + 1}}}{${nn + 1}} - 0 = \\frac{${aa ** (nn + 1)}}{${nn + 1}} = ${val}$. A definite integral evaluates to a number and needs no constant of integration $C$, which is the most basic difference from an indefinite integral. Traps: $${aa ** (nn + 1)}$ omits the division by the new exponent; $${round(aa ** nn / (nn + 1), 3)}$ fails to raise the exponent; $${nn * aa ** (nn - 1)}$ differentiates instead.`])
}

// MI1 — 數學歸納法常用求和公式
for (const nn of [5, 6, 8, 10, 12, 15, 20]) {
  const s1 = (nn * (nn + 1)) / 2, s2 = (nn * (nn + 1) * (2 * nn + 1)) / 6
  add(`m2b_mi1a_${nn}`, T.induction, FW.decompose, 'easy',
    [`由數學歸納法可證 $\\displaystyle\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$。求 $\\displaystyle\\sum_{k=1}^{${nn}} k$。`,
     `Mathematical induction gives $\\displaystyle\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$. Evaluate $\\displaystyle\\sum_{k=1}^{${nn}} k$.`],
    [n(`$${s1}$`), n(`$${nn * nn}$`), n(`$${(nn * (nn - 1)) / 2}$`), n(`$${nn * (nn + 1)}$`)],
    [`代入 $n = ${nn}$：$\\dfrac{${nn}(${nn}+1)}{2} = \\dfrac{${nn} \\times ${nn + 1}}{2} = ${s1}$。陷阱：$${nn * (nn + 1)}$ 漏了除以 2；$${(nn * (nn - 1)) / 2}$ 把 $n+1$ 寫成 $n-1$；$${nn * nn}$ 誤用 $n^2$。`,
     `With $n = ${nn}$: $\\frac{${nn}(${nn}+1)}{2} = \\frac{${nn} \\times ${nn + 1}}{2} = ${s1}$. Traps: $${nn * (nn + 1)}$ omits the division by 2; $${(nn * (nn - 1)) / 2}$ writes $n-1$ for $n+1$; $${nn * nn}$ uses $n^2$.`])
  add(`m2b_mi1b_${nn}`, T.induction, FW.decompose, 'medium',
    [`已知 $\\displaystyle\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}$。求 $\\displaystyle\\sum_{k=1}^{${nn}} k^2$。`,
     `Given $\\displaystyle\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}$, evaluate $\\displaystyle\\sum_{k=1}^{${nn}} k^2$.`],
    [n(`$${s2}$`), n(`$${s1 * s1}$`), n(`$${s1}$`), n(`$${(nn * (nn + 1) * (2 * nn + 1))}$`)],
    [`代入 $n = ${nn}$：$\\dfrac{${nn} \\times ${nn + 1} \\times ${2 * nn + 1}}{6} = ${s2}$。陷阱：$${(nn * (nn + 1) * (2 * nn + 1))}$ 漏了除以 6；$${s1}$ 是 $\\sum k$ 而非 $\\sum k^2$；$${s1 * s1}$ 是 $\\left(\\sum k\\right)^2$ —— 留意 $\\sum k^2 \\neq \\left(\\sum k\\right)^2$，兩者絕不可互換。`,
     `With $n = ${nn}$: $\\frac{${nn} \\times ${nn + 1} \\times ${2 * nn + 1}}{6} = ${s2}$. Traps: $${(nn * (nn + 1) * (2 * nn + 1))}$ omits the division by 6; $${s1}$ is $\\sum k$ rather than $\\sum k^2$; $${s1 * s1}$ is $\\left(\\sum k\\right)^2$ — note that $\\sum k^2 \\neq \\left(\\sum k\\right)^2$ and the two must never be interchanged.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 第三批母模板 —— 平均分佈補強（2026-08-28）
// ---------------------------------------------------------------------------
// 依創辦人指示：先補題數最少的課題，不動已達標者。補強前實測 M2 十個課題：
// 微積分應用 16、微分法 18、三維向量 20、二項式定理 24、積分法 27、
// 數學歸納法 27、向量 33、線性方程組 34、極限 54、矩陣 79，
// 每課題目標約 100 條。以下模板按缺口由大到小排列。
// 每個選項（答案與三個誘答）一律由公式計算，誘答對應具名錯誤。
// ═══════════════════════════════════════════════════════════════════════════

/** 係數格式化：係數為 1 時省略，避免出現 $1x^2$ 這種不規範寫法。 */
const co = (v: number): string => (v === 1 ? '' : v === -1 ? '-' : String(v))

// ── 微分法 ────────────────────────────────────────────────────────────────

// D1 — 冪法則後代入一點：f(x) = ax^n，f'(c) = anc^(n-1)
for (let a = 2; a <= 5; a++) {
  for (let nn = 2; nn <= 5; nn++) {
    for (let c = 2; c <= 4; c++) {
      if (nn === c) continue // 此時「忘記求導」的誘答會與答案相等
      const ans = a * nn * c ** (nn - 1)
      add(`m2c_d1_${a}_${nn}_${c}`, T.diff, FW.calc, 'easy',
        [`設 $f(x) = ${co(a)}x^{${nn}}$。求 $f'(${c})$。`,
         `Let $f(x) = ${co(a)}x^{${nn}}$. Find $f'(${c})$.`],
        [n(`$${ans}$`), n(`$${a * c ** nn}$`), n(`$${a * nn * c ** nn}$`), n(`$${nn * c ** (nn - 1)}$`)],
        [`由冪法則，$f'(x) = ${a} \\times ${nn} x^{${nn - 1}} = ${a * nn}x^{${nn - 1}}$。代入 $x = ${c}$：$${a * nn} \\times ${c}^{${nn - 1}} = ${ans}$。陷阱：$${a * c ** nn}$ 只計算了 $f(${c})$ 而未求導；$${a * nn * c ** nn}$ 忘記把指數減一；$${nn * c ** (nn - 1)}$ 漏掉了係數 $${a}$。`,
         `By the power rule $f'(x) = ${a} \\times ${nn} x^{${nn - 1}} = ${a * nn}x^{${nn - 1}}$. At $x = ${c}$ this gives $${a * nn} \\times ${c}^{${nn - 1}} = ${ans}$. Traps: $${a * c ** nn}$ evaluates $f(${c})$ without differentiating; $${a * nn * c ** nn}$ forgets to reduce the exponent by one; $${nn * c ** (nn - 1)}$ drops the coefficient $${a}$.`])
    }
  }
}

// D2 — 連鎖法則：f(x) = (ax + b)^n，f'(1) = na(a+b)^(n-1)
for (let a = 2; a <= 4; a++) {
  for (let b = 1; b <= 3; b++) {
    for (let nn = 2; nn <= 4; nn++) {
      const s = a + b
      const ans = nn * a * s ** (nn - 1)
      add(`m2c_d2_${a}_${b}_${nn}`, T.diff, FW.transform, 'medium',
        [`設 $f(x) = (${co(a)}x + ${b})^{${nn}}$。求 $f'(1)$。`,
         `Let $f(x) = (${co(a)}x + ${b})^{${nn}}$. Find $f'(1)$.`],
        [n(`$${ans}$`), n(`$${nn * s ** (nn - 1)}$`), n(`$${a * s ** nn}$`), n(`$${nn * a * s ** nn}$`)],
        [`連鎖法則：$f'(x) = ${nn}(${co(a)}x + ${b})^{${nn - 1}} \\times ${a}$。代入 $x = 1$，內層為 $${a} + ${b} = ${s}$，故 $f'(1) = ${nn} \\times ${a} \\times ${s}^{${nn - 1}} = ${ans}$。陷阱：$${nn * s ** (nn - 1)}$ 漏了內層導數 $${a}$；$${a * s ** nn}$ 只乘了內層導數而未用冪法則；$${nn * a * s ** nn}$ 忘記把指數減一。`,
         `By the chain rule $f'(x) = ${nn}(${co(a)}x + ${b})^{${nn - 1}} \\times ${a}$. At $x = 1$ the inner value is $${a} + ${b} = ${s}$, so $f'(1) = ${nn} \\times ${a} \\times ${s}^{${nn - 1}} = ${ans}$. Traps: $${nn * s ** (nn - 1)}$ omits the inner derivative $${a}$; $${a * s ** nn}$ applies only the inner derivative; $${nn * a * s ** nn}$ forgets to reduce the exponent.`])
    }
  }
}

// D3 — 乘積法則：f(x) = (ax + b)(cx + d)，f'(1) = 2ac + ad + bc
for (let a = 1; a <= 3; a++) {
  for (let c = 1; c <= 3; c++) {
    for (let b = 1; b <= 2; b++) {
      for (let d = 1; d <= 2; d++) {
        const ans = 2 * a * c + a * d + b * c
        add(`m2c_d3_${a}${c}${b}${d}`, T.diff, FW.decompose, 'medium',
          [`設 $f(x) = (${co(a)}x + ${b})(${co(c)}x + ${d})$。求 $f'(1)$。`,
           `Let $f(x) = (${co(a)}x + ${b})(${co(c)}x + ${d})$. Find $f'(1)$.`],
          [n(`$${ans}$`), n(`$${a * c + a * d + b * c}$`), n(`$${a * c}$`), n(`$${(a + b) * (c + d)}$`)],
          [`先展開：$f(x) = ${co(a * c)}x^2 + ${co(a * d + b * c)}x + ${b * d}$，故 $f'(x) = ${2 * a * c}x + ${a * d + b * c}$，$f'(1) = ${2 * a * c} + ${a * d + b * c} = ${ans}$。亦可用乘積法則 $f' = ${a}(${co(c)}x + ${d}) + ${c}(${co(a)}x + ${b})$ 得同一結果。陷阱：$${a * c + a * d + b * c}$ 漏了二次項求導時的因子 2；$${a * c}$ 只把兩個一次項係數相乘；$${(a + b) * (c + d)}$ 計算的是 $f(1)$ 而非 $f'(1)$。`,
           `Expanding, $f(x) = ${co(a * c)}x^2 + ${co(a * d + b * c)}x + ${b * d}$, so $f'(x) = ${2 * a * c}x + ${a * d + b * c}$ and $f'(1) = ${2 * a * c} + ${a * d + b * c} = ${ans}$. The product rule $f' = ${a}(${co(c)}x + ${d}) + ${c}(${co(a)}x + ${b})$ gives the same value. Traps: $${a * c + a * d + b * c}$ loses the factor 2 from differentiating the quadratic term; $${a * c}$ merely multiplies the two leading coefficients; $${(a + b) * (c + d)}$ is $f(1)$, not $f'(1)$.`])
      }
    }
  }
}

// ── 微積分應用 ────────────────────────────────────────────────────────────

// C1 — 切線斜率：y = ax² + bx 在 x = c 的切線斜率為 2ac + b
for (let a = 1; a <= 3; a++) {
  for (let b = 1; b <= 4; b++) {
    for (let c = 1; c <= 3; c++) {
      const ans = 2 * a * c + b
      add(`m2c_c1_${a}_${b}_${c}`, T.calcapp, FW.calc, 'medium',
        [`曲線 $y = ${co(a)}x^2 + ${co(b)}x$ 在 $x = ${c}$ 處的切線斜率是多少？`,
         `What is the slope of the tangent to the curve $y = ${co(a)}x^2 + ${co(b)}x$ at $x = ${c}$?`],
        [n(`$${ans}$`), n(`$${a * c + b}$`), n(`$${a * c * c + b * c}$`), n(`$${2 * a * c}$`)],
        [`切線斜率就是導數值。$\\dfrac{dy}{dx} = ${2 * a}x + ${b}$，代入 $x = ${c}$ 得 $${2 * a * c} + ${b} = ${ans}$。陷阱：$${a * c + b}$ 求導時漏了因子 2；$${a * c * c + b * c}$ 是曲線上該點的 $y$ 坐標而非斜率；$${2 * a * c}$ 漏掉了一次項的導數 $${b}$。`,
         `The slope of the tangent is the value of the derivative. Since $\\frac{dy}{dx} = ${2 * a}x + ${b}$, at $x = ${c}$ it equals $${2 * a * c} + ${b} = ${ans}$. Traps: $${a * c + b}$ loses the factor 2 when differentiating; $${a * c * c + b * c}$ is the $y$-coordinate of the point, not the slope; $${2 * a * c}$ omits the derivative $${b}$ of the linear term.`])
    }
  }
}

// C2 — 二次函數的最小值：f(x) = ax² − 2amx + k，於 x = m 取最小值 k − am²
for (let a = 1; a <= 3; a++) {
  for (let m = 1; m <= 4; m++) {
    for (let k = 5; k <= 8; k++) {
      const ans = k - a * m * m
      add(`m2c_c2_${a}_${m}_${k}`, T.calcapp, FW.calc, 'medium',
        [`求 $f(x) = ${co(a)}x^2 - ${2 * a * m}x + ${k}$ 的最小值。`,
         `Find the minimum value of $f(x) = ${co(a)}x^2 - ${2 * a * m}x + ${k}$.`],
        [n(`$${ans}$`), n(`$${k + a * m * m}$`), n(`$${k}$`), n(`$${m}$`)],
        [`$f'(x) = ${2 * a}x - ${2 * a * m}$，令其為零得 $x = ${m}$；$f''(x) = ${2 * a} > 0$，故此點為最小值點。代入：$f(${m}) = ${a}(${m})^2 - ${2 * a * m}(${m}) + ${k} = ${a * m * m} - ${2 * a * m * m} + ${k} = ${ans}$。陷阱：$${k + a * m * m}$ 在代入時符號出錯；$${k}$ 是 $f(0)$；$${m}$ 是最小值點的 $x$ 坐標，並非最小值本身。`,
         `From $f'(x) = ${2 * a}x - ${2 * a * m}$, setting it to zero gives $x = ${m}$; since $f''(x) = ${2 * a} > 0$ this is a minimum. Substituting, $f(${m}) = ${a}(${m})^2 - ${2 * a * m}(${m}) + ${k} = ${a * m * m} - ${2 * a * m * m} + ${k} = ${ans}$. Traps: $${k + a * m * m}$ makes a sign error on substitution; $${k}$ is $f(0)$; $${m}$ is the $x$-coordinate of the minimum point rather than the minimum value.`])
    }
  }
}

// C3 — 相關變率：正方體 V = s³，dV/dt = 3s²·(ds/dt)
for (let s = 2; s <= 6; s++) {
  for (let r = 1; r <= 4; r++) {
    const ans = 3 * s * s * r
    add(`m2c_c3_${s}_${r}`, T.calcapp, FW.modelling, 'hard',
      [`一個正方體的邊長以每秒 ${r} 厘米的速率增加。當邊長為 ${s} 厘米時，其體積的變化率是多少（立方厘米每秒）？`,
       `The edge of a cube increases at ${r} cm per second. When the edge is ${s} cm, what is the rate of change of its volume, in cm³ per second?`],
      [n(`$${ans}$`), n(`$${3 * s * r}$`), n(`$${s * s * r}$`), n(`$${s ** 3 * r}$`)],
      [`體積 $V = s^3$，兩邊對時間求導得 $\\dfrac{dV}{dt} = 3s^2 \\dfrac{ds}{dt}$。代入 $s = ${s}$、$\\dfrac{ds}{dt} = ${r}$：$3(${s})^2(${r}) = ${ans}$。陷阱：$${3 * s * r}$ 把 $3s^2$ 誤寫成 $3s$；$${s * s * r}$ 漏了係數 3；$${s ** 3 * r}$ 直接用了體積公式而未求導。`,
       `With $V = s^3$, differentiating with respect to time gives $\\frac{dV}{dt} = 3s^2 \\frac{ds}{dt}$. Substituting $s = ${s}$ and $\\frac{ds}{dt} = ${r}$ gives $3(${s})^2(${r}) = ${ans}$. Traps: $${3 * s * r}$ writes $3s$ for $3s^2$; $${s * s * r}$ drops the coefficient 3; $${s ** 3 * r}$ uses the volume formula without differentiating.`])
  }
}

// ── 極限 ──────────────────────────────────────────────────────────────────

// L1 — 消去型極限：lim(x→c) (x² − c²)/(x − c) = 2c
for (let c = 1; c <= 15; c++) {
  add(`m2c_l1_${c}`, T.limits, FW.transform, 'medium',
    [`求 $\\displaystyle\\lim_{x \\to ${c}} \\frac{x^2 - ${c * c}}{x - ${c}}$。`,
     `Evaluate $\\displaystyle\\lim_{x \\to ${c}} \\frac{x^2 - ${c * c}}{x - ${c}}$.`],
    [n(`$${2 * c}$`), n(`$${c * c}$`), n('$0$'), n(`$${c}$`)],
    [`直接代入會得到 $\\frac{0}{0}$，屬未定式，必須先化簡。因式分解分子：$x^2 - ${c * c} = (x - ${c})(x + ${c})$，約去 $(x - ${c})$ 後得 $x + ${c}$，再代入 $x = ${c}$ 得 $${2 * c}$。陷阱：$0$ 誤以為分子趨近零則極限為零，忽略了分母同時趨近零；$${c}$ 只代入了一半；$${c * c}$ 誤用了 $c^2$。`,
     `Direct substitution gives the indeterminate form $\\frac{0}{0}$, so the expression must first be simplified. Factorising the numerator, $x^2 - ${c * c} = (x - ${c})(x + ${c})$; cancelling $(x - ${c})$ leaves $x + ${c}$, which at $x = ${c}$ equals $${2 * c}$. Traps: $0$ assumes the limit is zero because the numerator tends to zero, ignoring that the denominator does too; $${c}$ substitutes only half of the factor; $${c * c}$ uses $c^2$.`])
}

// L2 — 無窮遠處的有理函數極限：lim(x→∞) (ax + b)/(cx + d) = a/c
for (let a = 1; a <= 4; a++) {
  for (let c = 2; c <= 4; c++) {
    for (const [b, d] of [[1, 3], [2, 5]] as [number, number][]) {
      add(`m2c_l2_${a}_${c}_${b}${d}`, T.limits, FW.transform, 'medium',
        [`求 $\\displaystyle\\lim_{x \\to \\infty} \\frac{${co(a)}x + ${b}}{${co(c)}x + ${d}}$。`,
         `Evaluate $\\displaystyle\\lim_{x \\to \\infty} \\frac{${co(a)}x + ${b}}{${co(c)}x + ${d}}$.`],
        [n(`$${frac(a, c)}$`), n(`$${frac(b, d)}$`), n(`$${frac(a + b, c + d)}$`), n('$0$')],
        [`分子分母同除以 $x$：$\\dfrac{${a} + ${b}/x}{${c} + ${d}/x}$。當 $x \\to \\infty$ 時 $${b}/x \\to 0$、$${d}/x \\to 0$，故極限為 $\\dfrac{${a}}{${c}} = ${frac(a, c)}$。分子分母次數相同時，極限等於最高次項係數之比。陷阱：$${frac(b, d)}$ 取了常數項之比；$${frac(a + b, c + d)}$ 把係數與常數項相加；$0$ 誤以為所有無窮遠極限皆為零。`,
         `Divide numerator and denominator by $x$ to get $\\frac{${a} + ${b}/x}{${c} + ${d}/x}$. As $x \\to \\infty$ both $${b}/x$ and $${d}/x$ tend to 0, so the limit is $\\frac{${a}}{${c}} = ${frac(a, c)}$. When numerator and denominator have the same degree the limit is the ratio of the leading coefficients. Traps: $${frac(b, d)}$ takes the ratio of the constant terms; $${frac(a + b, c + d)}$ adds coefficients to constants; $0$ assumes every limit at infinity is zero.`])
    }
  }
}

// L3 — 三角極限：lim(x→0) sin(kx)/x = k
for (let k = 2; k <= 13; k++) {
  add(`m2c_l3_${k}`, T.limits, FW.transform, 'medium',
    [`求 $\\displaystyle\\lim_{x \\to 0} \\frac{\\sin ${k}x}{x}$。`,
     `Evaluate $\\displaystyle\\lim_{x \\to 0} \\frac{\\sin ${k}x}{x}$.`],
    [n(`$${k}$`), n('$1$'), n('$0$'), n(`$${frac(1, k)}$`)],
    [`利用基本極限 $\\displaystyle\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$。把原式改寫為 $${k} \\times \\dfrac{\\sin ${k}x}{${k}x}$，當 $x \\to 0$ 時 $${k}x \\to 0$，故括號部分趨近 1，極限為 $${k}$。陷阱：$1$ 直接套用基本極限而忽略了係數；$0$ 誤以為分子趨近零則整體為零；$${frac(1, k)}$ 把係數放到了分母。`,
     `Use the standard limit $\\displaystyle\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$. Rewriting the expression as $${k} \\times \\frac{\\sin ${k}x}{${k}x}$, the bracket tends to 1 as $${k}x \\to 0$, so the limit is $${k}$. Traps: $1$ applies the standard limit while ignoring the coefficient; $0$ assumes the whole expression vanishes because the numerator does; $${frac(1, k)}$ places the coefficient in the denominator.`])
}

// ── 向量（二維）────────────────────────────────────────────────────────────

// VE1 — 二維向量的模（只取畢氏三元組，確保答案為整數）
for (const [a, b, m] of [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15],
  [12, 16, 20], [20, 21, 29], [10, 24, 26], [15, 20, 25], [18, 24, 30], [16, 30, 34],
  [9, 40, 41], [12, 35, 37], [28, 45, 53], [33, 56, 65], [16, 63, 65], [48, 55, 73],
  [13, 84, 85], [11, 60, 61]] as [number, number, number][]) {
  add(`m2c_ve1_${a}_${b}`, T.vectors, FW.geom, 'easy',
    [`求向量 $\\mathbf{v} = ${a}\\mathbf{i} + ${b}\\mathbf{j}$ 的模。`,
     `Find the magnitude of the vector $\\mathbf{v} = ${a}\\mathbf{i} + ${b}\\mathbf{j}$.`],
    [n(`$${m}$`), n(`$${a + b}$`), n(`$${a * a + b * b}$`), n(`$${Math.abs(a - b)}$`)],
    [`$|\\mathbf{v}| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${m * m}} = ${m}$。陷阱：$${a + b}$ 直接把兩個分量相加；$${a * a + b * b}$ 停在平方和而未開方；$${Math.abs(a - b)}$ 把分量相減。`,
     `$|\\mathbf{v}| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${m * m}} = ${m}$. Traps: $${a + b}$ simply adds the components; $${a * a + b * b}$ stops at the sum of squares without taking the root; $${Math.abs(a - b)}$ subtracts the components.`])
}

// VE2 — 二維點積：a·b = a₁b₁ + a₂b₂
for (let a1 = 1; a1 <= 5; a1++) {
  for (let a2 = 1; a2 <= 4; a2++) {
    for (const [b1, b2] of [[2, 3], [3, 1]] as [number, number][]) {
      const ans = a1 * b1 + a2 * b2
      add(`m2c_ve2_${a1}${a2}_${b1}${b2}`, T.vectors, FW.geom, 'medium',
        [`設 $\\mathbf{a} = ${a1}\\mathbf{i} + ${a2}\\mathbf{j}$、$\\mathbf{b} = ${b1}\\mathbf{i} + ${b2}\\mathbf{j}$。求 $\\mathbf{a} \\cdot \\mathbf{b}$。`,
         `Let $\\mathbf{a} = ${a1}\\mathbf{i} + ${a2}\\mathbf{j}$ and $\\mathbf{b} = ${b1}\\mathbf{i} + ${b2}\\mathbf{j}$. Find $\\mathbf{a} \\cdot \\mathbf{b}$.`],
        [n(`$${ans}$`), n(`$${a1 * b2 + a2 * b1}$`), n(`$${a1 * b1 * a2 * b2}$`), n(`$${a1 + a2 + b1 + b2}$`)],
        [`點積為對應分量相乘後相加：$${a1}(${b1}) + ${a2}(${b2}) = ${a1 * b1} + ${a2 * b2} = ${ans}$。結果為純量。陷阱：$${a1 * b2 + a2 * b1}$ 把分量交叉相乘（這是行列式的形式，並非點積）；$${a1 * b1 * a2 * b2}$ 把四個分量全部相乘；$${a1 + a2 + b1 + b2}$ 把分量相加。`,
         `The dot product multiplies corresponding components and adds them: $${a1}(${b1}) + ${a2}(${b2}) = ${a1 * b1} + ${a2 * b2} = ${ans}$, a scalar. Traps: $${a1 * b2 + a2 * b1}$ pairs the components crosswise, which is a determinant form rather than a dot product; $${a1 * b1 * a2 * b2}$ multiplies all four components; $${a1 + a2 + b1 + b2}$ adds them.`])
    }
  }
}

// VE3 — 向量的線性組合：2a − b 的分量
for (let a1 = 1; a1 <= 4; a1++) {
  for (let a2 = 1; a2 <= 3; a2++) {
    for (const [b1, b2] of [[1, 2], [2, 1]] as [number, number][]) {
      add(`m2c_ve3_${a1}${a2}_${b1}${b2}`, T.vectors, FW.algebra, 'easy',
        [`設 $\\mathbf{a} = (${a1},\\ ${a2})$、$\\mathbf{b} = (${b1},\\ ${b2})$。求 $2\\mathbf{a} - \\mathbf{b}$。`,
         `Let $\\mathbf{a} = (${a1},\\ ${a2})$ and $\\mathbf{b} = (${b1},\\ ${b2})$. Find $2\\mathbf{a} - \\mathbf{b}$.`],
        [n(`$(${2 * a1 - b1},\\ ${2 * a2 - b2})$`), n(`$(${2 * (a1 - b1)},\\ ${2 * (a2 - b2)})$`),
         n(`$(${a1 - b1},\\ ${a2 - b2})$`), n(`$(${2 * a1 + b1},\\ ${2 * a2 + b2})$`)],
        [`純量倍只作用於 $\\mathbf{a}$：$2\\mathbf{a} = (${2 * a1},\\ ${2 * a2})$，再逐項減去 $\\mathbf{b}$ 得 $(${2 * a1 - b1},\\ ${2 * a2 - b2})$。陷阱：$(${2 * (a1 - b1)},\\ ${2 * (a2 - b2)})$ 把 2 也乘到了 $\\mathbf{b}$ 上；$(${a1 - b1},\\ ${a2 - b2})$ 漏了純量倍；$(${2 * a1 + b1},\\ ${2 * a2 + b2})$ 符號出錯。`,
         `The scalar multiple applies to $\\mathbf{a}$ only: $2\\mathbf{a} = (${2 * a1},\\ ${2 * a2})$, and subtracting $\\mathbf{b}$ componentwise gives $(${2 * a1 - b1},\\ ${2 * a2 - b2})$. Traps: $(${2 * (a1 - b1)},\\ ${2 * (a2 - b2)})$ multiplies $\\mathbf{b}$ by 2 as well; $(${a1 - b1},\\ ${a2 - b2})$ omits the scalar multiple; $(${2 * a1 + b1},\\ ${2 * a2 + b2})$ has a sign error.`])
    }
  }
}

// ── 線性方程組 ────────────────────────────────────────────────────────────

// LS1 — 克拉瑪法則解二元一次方程組（由解反推常數項，確保整數解）
for (const [a, b, c, d] of [[1, 2, 3, 1], [2, 1, 1, 3], [3, 1, 2, 5], [1, 3, 2, 1]] as [number, number, number, number][]) {
  const det = a * d - b * c
  for (let x0 = 1; x0 <= 4; x0++) {
    for (let y0 = 1; y0 <= 3; y0++) {
      if (x0 === y0) continue
      const e = a * x0 + b * y0, f = c * x0 + d * y0
      add(`m2c_ls1_${a}${b}${c}${d}_${x0}_${y0}`, T.systems, FW.algebra, 'medium',
        [`解方程組 $\\begin{cases} ${co(a)}x + ${co(b)}y = ${e} \\\\ ${co(c)}x + ${co(d)}y = ${f} \\end{cases}$，求 $x$ 的值。`,
         `Solve $\\begin{cases} ${co(a)}x + ${co(b)}y = ${e} \\\\ ${co(c)}x + ${co(d)}y = ${f} \\end{cases}$ for $x$.`],
        [n(`$${x0}$`), n(`$${y0}$`), n(`$${x0 + y0}$`), n(`$${x0 * det}$`)],
        [`係數行列式 $\\Delta = ${a}(${d}) - ${b}(${c}) = ${det} \\neq 0$，故有唯一解。以常數項取代第一列：$\\Delta_x = ${e}(${d}) - ${b}(${f}) = ${e * d - b * f}$，因此 $x = \\dfrac{\\Delta_x}{\\Delta} = \\dfrac{${e * d - b * f}}{${det}} = ${x0}$。陷阱：$${y0}$ 是 $y$ 的值；$${x0 + y0}$ 是 $x + y$；$${x0 * det}$ 停在分子 $\\Delta_x$ 而忘記除以行列式。`,
         `The coefficient determinant is $\\Delta = ${a}(${d}) - ${b}(${c}) = ${det} \\neq 0$, so the solution is unique. Replacing the first column by the constants, $\\Delta_x = ${e}(${d}) - ${b}(${f}) = ${e * d - b * f}$, hence $x = \\frac{\\Delta_x}{\\Delta} = \\frac{${e * d - b * f}}{${det}} = ${x0}$. Traps: $${y0}$ is the value of $y$; $${x0 + y0}$ is $x + y$; $${x0 * det}$ stops at the numerator $\\Delta_x$ and forgets to divide by the determinant.`])
    }
  }
}

// LS2 — 唯一解的條件：當係數行列式為零時，方程組沒有唯一解
for (const [a, b, d, e, f] of [[2, 3, 6, 5, 7], [1, 2, 4, 3, 5], [3, 2, 4, 7, 9], [2, 5, 10, 4, 9],
  [4, 3, 6, 8, 5], [1, 3, 6, 2, 7], [5, 2, 4, 3, 8], [3, 4, 8, 6, 5], [2, 3, 9, 5, 4],
  [1, 4, 8, 3, 6], [2, 7, 14, 3, 5], [3, 5, 10, 8, 2], [1, 5, 10, 4, 7], [4, 5, 10, 3, 8],
  [5, 3, 6, 2, 9], [2, 4, 10, 7, 3], [3, 6, 8, 5, 2], [5, 2, 6, 4, 9], [5, 4, 8, 6, 3],
  [6, 5, 10, 2, 7]] as [number, number, number, number, number][]) {
  const k = (a * d) / b
  add(`m2c_ls2_${a}${b}${d}`, T.systems, FW.decompose, 'hard',
    [`若方程組 $\\begin{cases} ${co(a)}x + ${co(b)}y = ${e} \\\\ kx + ${co(d)}y = ${f} \\end{cases}$ 沒有唯一解，求 $k$ 的值。`,
     `The system $\\begin{cases} ${co(a)}x + ${co(b)}y = ${e} \\\\ kx + ${co(d)}y = ${f} \\end{cases}$ has no unique solution. Find $k$.`],
    [n(`$${k}$`), n(`$${a * d}$`), n(`$${a + d}$`), n(`$${b * d}$`)],
    [`二元一次方程組有唯一解的充要條件是係數行列式不為零。令 $\\Delta = ${a}(${d}) - ${b}k = 0$，得 $k = \\dfrac{${a} \\times ${d}}{${b}} = ${k}$。此時兩條方程的係數成比例，圖像為兩條平行或重合的直線。陷阱：$${a * d}$ 忘記除以 $${b}$；$${a + d}$ 把係數相加；$${b * d}$ 取錯了相乘的配對。`,
     `A system of two linear equations has a unique solution exactly when the coefficient determinant is non-zero. Setting $\\Delta = ${a}(${d}) - ${b}k = 0$ gives $k = \\frac{${a} \\times ${d}}{${b}} = ${k}$. At this value the coefficients of the two equations are proportional, so the lines are parallel or coincident. Traps: $${a * d}$ forgets to divide by $${b}$; $${a + d}$ adds the coefficients; $${b * d}$ pairs the wrong factors.`])
}

// ── 三維向量 ──────────────────────────────────────────────────────────────

// V3 — 叉積：a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁)
for (const [a1, a2, a3, b1, b2, b3] of [[1, 2, 3, 4, 5, 6], [2, 1, 3, 1, 4, 2], [3, 0, 1, 2, 5, 1],
  [1, 4, 2, 3, 1, 5], [2, 3, 1, 5, 2, 4], [4, 1, 2, 1, 3, 6], [1, 1, 2, 3, 4, 1],
  [5, 2, 1, 2, 1, 4], [2, 5, 3, 1, 2, 6], [3, 2, 4, 5, 1, 2], [1, 3, 5, 2, 4, 1],
  [4, 2, 3, 1, 5, 2]] as [number, number, number, number, number, number][]) {
  const c1 = a2 * b3 - a3 * b2, c2 = a3 * b1 - a1 * b3, c3 = a1 * b2 - a2 * b1
  add(`m2c_v3_${a1}${a2}${a3}_${b1}${b2}${b3}`, T.vec3d, FW.geom, 'hard',
    [`設 $\\mathbf{a} = (${a1},\\ ${a2},\\ ${a3})$、$\\mathbf{b} = (${b1},\\ ${b2},\\ ${b3})$。求 $\\mathbf{a} \\times \\mathbf{b}$。`,
     `Let $\\mathbf{a} = (${a1},\\ ${a2},\\ ${a3})$ and $\\mathbf{b} = (${b1},\\ ${b2},\\ ${b3})$. Find $\\mathbf{a} \\times \\mathbf{b}$.`],
    [n(`$(${c1},\\ ${c2},\\ ${c3})$`), n(`$(${c1},\\ ${-c2},\\ ${c3})$`),
     n(`$(${a1 * b1},\\ ${a2 * b2},\\ ${a3 * b3})$`), n(`$(${a2 * b3 + a3 * b2},\\ ${a3 * b1 + a1 * b3},\\ ${a1 * b2 + a2 * b1})$`)],
    [`叉積的第二個分量帶負號：$\\mathbf{a} \\times \\mathbf{b} = (a_2b_3 - a_3b_2,\\ a_3b_1 - a_1b_3,\\ a_1b_2 - a_2b_1)$。逐項計算得 $(${c1},\\ ${c2},\\ ${c3})$。結果為向量，且同時垂直於 $\\mathbf{a}$ 與 $\\mathbf{b}$，這是它與點積最重要的分別。陷阱：$(${c1},\\ ${-c2},\\ ${c3})$ 第二個分量符號寫反；$(${a1 * b1},\\ ${a2 * b2},\\ ${a3 * b3})$ 把對應分量相乘；$(${a2 * b3 + a3 * b2},\\ ${a3 * b1 + a1 * b3},\\ ${a1 * b2 + a2 * b1})$ 全部用了加號。`,
     `The second component of a cross product carries a minus sign: $\\mathbf{a} \\times \\mathbf{b} = (a_2b_3 - a_3b_2,\\ a_3b_1 - a_1b_3,\\ a_1b_2 - a_2b_1)$, which evaluates to $(${c1},\\ ${c2},\\ ${c3})$. The result is a vector perpendicular to both $\\mathbf{a}$ and $\\mathbf{b}$, the key difference from the dot product. Traps: $(${c1},\\ ${-c2},\\ ${c3})$ reverses the sign of the second component; $(${a1 * b1},\\ ${a2 * b2},\\ ${a3 * b3})$ multiplies corresponding components; $(${a2 * b3 + a3 * b2},\\ ${a3 * b1 + a1 * b3},\\ ${a1 * b2 + a2 * b1})$ uses addition throughout.`])
}

// V4 — 單位向量：v/|v|（只取模為整數的向量）
for (const [a, b, c, m] of [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9],
  [3, 4, 12, 13], [2, 10, 11, 15], [6, 6, 7, 11], [1, 12, 12, 17], [3, 12, 4, 13],
  [4, 8, 19, 21], [2, 5, 14, 15]] as [number, number, number, number][]) {
  const s = a + b + c
  add(`m2c_v4_${a}_${b}_${c}`, T.vec3d, FW.modelling, 'medium',
    [`求與 $\\mathbf{v} = (${a},\\ ${b},\\ ${c})$ 同向的單位向量。`,
     `Find the unit vector in the direction of $\\mathbf{v} = (${a},\\ ${b},\\ ${c})$.`],
    [n(`$\\left(${frac(a, m)},\\ ${frac(b, m)},\\ ${frac(c, m)}\\right)$`),
     n(`$(${a},\\ ${b},\\ ${c})$`),
     n(`$\\left(${frac(a, s)},\\ ${frac(b, s)},\\ ${frac(c, s)}\\right)$`),
     n(`$\\left(${frac(a, m * m)},\\ ${frac(b, m * m)},\\ ${frac(c, m * m)}\\right)$`)],
    [`單位向量為 $\\hat{\\mathbf{v}} = \\dfrac{\\mathbf{v}}{|\\mathbf{v}|}$。先求模：$|\\mathbf{v}| = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${m * m}} = ${m}$，故 $\\hat{\\mathbf{v}} = \\left(${frac(a, m)},\\ ${frac(b, m)},\\ ${frac(c, m)}\\right)$，其模為 1。陷阱：$(${a},\\ ${b},\\ ${c})$ 未作單位化；除以 $${s}$ 者誤用了分量之和；除以 $${m * m}$ 者誤除以模的平方。`,
     `The unit vector is $\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{|\\mathbf{v}|}$. The magnitude is $|\\mathbf{v}| = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${m * m}} = ${m}$, so $\\hat{\\mathbf{v}} = \\left(${frac(a, m)},\\ ${frac(b, m)},\\ ${frac(c, m)}\\right)$, whose magnitude is 1. Traps: $(${a},\\ ${b},\\ ${c})$ is not normalised; dividing by $${s}$ uses the sum of the components; dividing by $${m * m}$ uses the square of the magnitude.`])
}

// V5 — 三維兩點距離
for (const [a, b, c, m] of [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9],
  [3, 4, 12, 13], [2, 10, 11, 15], [6, 6, 7, 11], [1, 12, 12, 17], [3, 12, 4, 13],
  [4, 8, 19, 21], [2, 5, 14, 15]] as [number, number, number, number][]) {
  add(`m2c_v5_${a}_${b}_${c}`, T.vec3d, FW.geom, 'medium',
    [`空間中兩點 $P(1,\\ 1,\\ 1)$ 與 $Q(${1 + a},\\ ${1 + b},\\ ${1 + c})$。求 $PQ$ 的長度。`,
     `Two points in space are $P(1,\\ 1,\\ 1)$ and $Q(${1 + a},\\ ${1 + b},\\ ${1 + c})$. Find the length of $PQ$.`],
    [n(`$${m}$`), n(`$${a + b + c}$`), n(`$${m * m}$`), n(`$${Math.max(a, b, c)}$`)],
    [`兩點距離為 $\\sqrt{(\\Delta x)^2 + (\\Delta y)^2 + (\\Delta z)^2}$。三個差為 $${a}$、$${b}$、$${c}$，故 $PQ = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${m * m}} = ${m}$。陷阱：$${a + b + c}$ 把三個差直接相加；$${m * m}$ 停在平方和而未開方；$${Math.max(a, b, c)}$ 只取了最大的一個差。`,
     `The distance is $\\sqrt{(\\Delta x)^2 + (\\Delta y)^2 + (\\Delta z)^2}$. The three differences are $${a}$, $${b}$ and $${c}$, so $PQ = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${m * m}} = ${m}$. Traps: $${a + b + c}$ adds the differences directly; $${m * m}$ stops at the sum of squares; $${Math.max(a, b, c)}$ takes only the largest difference.`])
}

// V6 — 垂直條件：求使 a·b = 0 的參數
for (let p = 1; p <= 3; p++) {
  for (let q = 1; q <= 3; q++) {
    for (let r = 1; r <= 2; r++) {
      for (let s = 1; s <= 2; s++) {
        const ans = -(p * r + q * s)
        add(`m2c_v6_${p}${q}${r}${s}`, T.vec3d, FW.decompose, 'hard',
          [`設 $\\mathbf{a} = (${p},\\ ${q},\\ k)$、$\\mathbf{b} = (${r},\\ ${s},\\ 1)$。若 $\\mathbf{a}$ 與 $\\mathbf{b}$ 互相垂直，求 $k$。`,
           `Let $\\mathbf{a} = (${p},\\ ${q},\\ k)$ and $\\mathbf{b} = (${r},\\ ${s},\\ 1)$. If $\\mathbf{a}$ and $\\mathbf{b}$ are perpendicular, find $k$.`],
          [n(`$${ans}$`), n(`$${p * r + q * s}$`), n(`$${-(p * r)}$`), n(`$${-(p + q + r + s)}$`)],
          [`兩個非零向量垂直的充要條件是點積為零。$\\mathbf{a} \\cdot \\mathbf{b} = ${p}(${r}) + ${q}(${s}) + k(1) = ${p * r + q * s} + k = 0$，故 $k = ${ans}$。陷阱：$${p * r + q * s}$ 移項時漏了變號；$${-(p * r)}$ 只算了第一項；$${-(p + q + r + s)}$ 把分量相加而非相乘。`,
           `Two non-zero vectors are perpendicular exactly when their dot product vanishes. Here $\\mathbf{a} \\cdot \\mathbf{b} = ${p}(${r}) + ${q}(${s}) + k(1) = ${p * r + q * s} + k = 0$, so $k = ${ans}$. Traps: $${p * r + q * s}$ omits the sign change when rearranging; $${-(p * r)}$ uses only the first term; $${-(p + q + r + s)}$ adds the components instead of multiplying.`])
      }
    }
  }
}

// ── 二項式定理 ────────────────────────────────────────────────────────────

// B2 — (a + bx)^n 中 x^r 的係數 = C(n, r)·a^(n−r)·b^r
for (let nn = 4; nn <= 7; nn++) {
  for (let r = 1; r <= 3; r++) {
    for (let a = 1; a <= 3; a++) {
      for (let b = 2; b <= 3; b++) {
        const ans = nCr(nn, r) * a ** (nn - r) * b ** r
        add(`m2c_b2_${nn}_${r}_${a}${b}`, T.binomial, FW.decompose, 'medium',
          [`在 $(${a} + ${co(b)}x)^{${nn}}$ 的展開式中，$x^{${r}}$ 的係數是多少？`,
           `In the expansion of $(${a} + ${co(b)}x)^{${nn}}$, what is the coefficient of $x^{${r}}$?`],
          [n(`$${ans}$`), n(`$${nCr(nn, r)}$`), n(`$${nCr(nn, r) * a ** r * b ** (nn - r)}$`), n(`$${a ** (nn - r) * b ** r}$`)],
          [`由二項式定理，$(a + bx)^{n}$ 的一般項為 $\\binom{n}{r} a^{n-r}(bx)^{r}$，故 $x^{${r}}$ 的係數為 $\\binom{${nn}}{${r}} \\times ${a}^{${nn - r}} \\times ${b}^{${r}} = ${nCr(nn, r)} \\times ${a ** (nn - r)} \\times ${b ** r} = ${ans}$。陷阱：$${nCr(nn, r)}$ 只寫了二項式係數而漏了 $a$、$b$ 的冪；$${nCr(nn, r) * a ** r * b ** (nn - r)}$ 把兩個指數對調；$${a ** (nn - r) * b ** r}$ 漏掉了二項式係數。`,
           `By the binomial theorem the general term of $(a + bx)^{n}$ is $\\binom{n}{r} a^{n-r}(bx)^{r}$, so the coefficient of $x^{${r}}$ is $\\binom{${nn}}{${r}} \\times ${a}^{${nn - r}} \\times ${b}^{${r}} = ${nCr(nn, r)} \\times ${a ** (nn - r)} \\times ${b ** r} = ${ans}$. Traps: $${nCr(nn, r)}$ gives only the binomial coefficient and omits the powers of $a$ and $b$; $${nCr(nn, r) * a ** r * b ** (nn - r)}$ interchanges the two exponents; $${a ** (nn - r) * b ** r}$ drops the binomial coefficient.`])
      }
    }
  }
}

// B3 — (ax − b)^n 中 x^(n−1) 的係數 = −n·a^(n−1)·b
for (let nn = 3; nn <= 6; nn++) {
  for (let a = 2; a <= 4; a++) {
    for (let b = 1; b <= 3; b++) {
      const ans = -(nn * a ** (nn - 1) * b)
      add(`m2c_b3_${nn}_${a}${b}`, T.binomial, FW.decompose, 'hard',
        [`在 $(${co(a)}x - ${b})^{${nn}}$ 的展開式中，$x^{${nn - 1}}$ 的係數是多少？`,
         `In the expansion of $(${co(a)}x - ${b})^{${nn}}$, what is the coefficient of $x^{${nn - 1}}$?`],
        [n(`$${ans}$`), n(`$${nn * a ** (nn - 1) * b}$`), n(`$${-(nn * a * b)}$`), n(`$${-(a ** (nn - 1) * b)}$`)],
        [`把式子視為 $(${a}x + (-${b}))^{${nn}}$，$x^{${nn - 1}}$ 對應取一個 $(-${b})$：係數為 $\\binom{${nn}}{1} \\times ${a}^{${nn - 1}} \\times (-${b}) = ${nn} \\times ${a ** (nn - 1)} \\times (-${b}) = ${ans}$。減號必須連同 $${b}$ 一併代入，這是符號出錯最常見的位置。陷阱：$${nn * a ** (nn - 1) * b}$ 漏了負號；$${-(nn * a * b)}$ 把 $a^{${nn - 1}}$ 誤寫成 $a$；$${-(a ** (nn - 1) * b)}$ 漏掉了二項式係數 $${nn}$。`,
         `Write the expression as $(${a}x + (-${b}))^{${nn}}$; the term in $x^{${nn - 1}}$ takes one factor of $(-${b})$, giving $\\binom{${nn}}{1} \\times ${a}^{${nn - 1}} \\times (-${b}) = ${nn} \\times ${a ** (nn - 1)} \\times (-${b}) = ${ans}$. The minus sign must travel with $${b}$; this is where sign errors most often occur. Traps: $${nn * a ** (nn - 1) * b}$ loses the minus sign; $${-(nn * a * b)}$ writes $a$ for $a^{${nn - 1}}$; $${-(a ** (nn - 1) * b)}$ drops the binomial coefficient $${nn}$.`])
    }
  }
}

// ── 積分法 ────────────────────────────────────────────────────────────────

// I2 — 定積分 ∫₁^b (px + q) dx（p 取偶數以保證結果為整數）
for (const p of [2, 4, 6]) {
  for (let q = 1; q <= 3; q++) {
    for (let b = 2; b <= 5; b++) {
      const ans = (p * (b * b - 1)) / 2 + q * (b - 1)
      add(`m2c_i2_${p}_${q}_${b}`, T.integration, FW.calc, 'medium',
        [`求 $\\displaystyle\\int_{1}^{${b}} (${co(p)}x + ${q})\\,dx$。`,
         `Evaluate $\\displaystyle\\int_{1}^{${b}} (${co(p)}x + ${q})\\,dx$.`],
        [n(`$${ans}$`), n(`$${p * b + q * b}$`), n(`$${(p * (b * b - 1)) / 2}$`), n(`$${(p * (b * b - 1)) / 2 + q * b}$`)],
        [`原函數為 $\\dfrac{${p}}{2}x^2 + ${co(q)}x = ${co(p / 2)}x^2 + ${co(q)}x$。代入上下限：$\\left[${co(p / 2)}x^2 + ${co(q)}x\\right]_{1}^{${b}} = (${(p / 2) * b * b} + ${q * b}) - (${p / 2} + ${q}) = ${ans}$。陷阱：$${p * b + q * b}$ 未求原函數而直接代入被積函數；$${(p * (b * b - 1)) / 2}$ 漏了常數項 $${q}$ 的貢獻；$${(p * (b * b - 1)) / 2 + q * b}$ 在常數項只代入了上限而忘記減去下限。`,
         `The antiderivative is $\\frac{${p}}{2}x^2 + ${co(q)}x = ${co(p / 2)}x^2 + ${co(q)}x$. Evaluating between the limits, $\\left[${co(p / 2)}x^2 + ${co(q)}x\\right]_{1}^{${b}} = (${(p / 2) * b * b} + ${q * b}) - (${p / 2} + ${q}) = ${ans}$. Traps: $${p * b + q * b}$ substitutes into the integrand without finding an antiderivative; $${(p * (b * b - 1)) / 2}$ omits the contribution of the constant term $${q}$; $${(p * (b * b - 1)) / 2 + q * b}$ substitutes only the upper limit for the constant term.`])
    }
  }
}

// I3 — 定積分 ∫₀^b (ax² + c) dx，a 取 3 的倍數以保證結果為整數
for (const a of [3, 6]) {
  for (let c = 1; c <= 4; c++) {
    for (let b = 1; b <= 4; b++) {
      const ans = (a * b ** 3) / 3 + c * b
      add(`m2c_i3_${a}_${c}_${b}`, T.integration, FW.calc, 'medium',
        [`求 $\\displaystyle\\int_{0}^{${b}} (${co(a)}x^2 + ${c})\\,dx$。`,
         `Evaluate $\\displaystyle\\int_{0}^{${b}} (${co(a)}x^2 + ${c})\\,dx$.`],
        [n(`$${ans}$`), n(`$${(a * b ** 3) / 3}$`), n(`$${a * b * b + c}$`), n(`$${a * b ** 3 + c * b}$`)],
        [`原函數為 $\\dfrac{${a}}{3}x^3 + ${co(c)}x = ${co(a / 3)}x^3 + ${co(c)}x$。代入上限 $${b}$ 並減去下限 0：$${(a / 3) * b ** 3} + ${c * b} = ${ans}$。陷阱：$${(a * b ** 3) / 3}$ 漏了常數項 $${c}$ 的積分；$${a * b * b + c}$ 未積分而直接代入被積函數；$${a * b ** 3 + c * b}$ 積分二次項時忘記除以新指數 3。`,
         `The antiderivative is $\\frac{${a}}{3}x^3 + ${co(c)}x = ${co(a / 3)}x^3 + ${co(c)}x$. Substituting the upper limit $${b}$ and subtracting the value at 0 gives $${(a / 3) * b ** 3} + ${c * b} = ${ans}$. Traps: $${(a * b ** 3) / 3}$ omits the integral of the constant term $${c}$; $${a * b * b + c}$ substitutes into the integrand without integrating; $${a * b ** 3 + c * b}$ forgets to divide by the new exponent 3.`])
    }
  }
}

// ── 數學歸納法 ────────────────────────────────────────────────────────────

// MI2 — Σk³ = [n(n+1)/2]²
for (let nn = 3; nn <= 16; nn++) {
  const s1 = (nn * (nn + 1)) / 2
  add(`m2c_mi2_${nn}`, T.induction, FW.decompose, 'medium',
    [`已知 $\\displaystyle\\sum_{k=1}^{n} k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$。求 $\\displaystyle\\sum_{k=1}^{${nn}} k^3$。`,
     `Given $\\displaystyle\\sum_{k=1}^{n} k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$, evaluate $\\displaystyle\\sum_{k=1}^{${nn}} k^3$.`],
    [n(`$${s1 * s1}$`), n(`$${s1}$`), n(`$${(nn * (nn + 1) * (2 * nn + 1)) / 6}$`), n(`$${s1 ** 3}$`)],
    [`代入 $n = ${nn}$：$\\dfrac{${nn} \\times ${nn + 1}}{2} = ${s1}$，再平方得 $${s1}^2 = ${s1 * s1}$。留意 $\\sum k^3 = \\left(\\sum k\\right)^2$ 是一個罕見而漂亮的恆等式，但 $\\sum k^2 \\neq \\left(\\sum k\\right)^2$。陷阱：$${s1}$ 忘記平方；$${(nn * (nn + 1) * (2 * nn + 1)) / 6}$ 用了 $\\sum k^2$ 的公式；$${s1 ** 3}$ 誤把指數 3 加到括號外。`,
     `With $n = ${nn}$: $\\frac{${nn} \\times ${nn + 1}}{2} = ${s1}$, and squaring gives $${s1}^2 = ${s1 * s1}$. Note that $\\sum k^3 = \\left(\\sum k\\right)^2$ is a rare and elegant identity, whereas $\\sum k^2 \\neq \\left(\\sum k\\right)^2$. Traps: $${s1}$ forgets to square; $${(nn * (nn + 1) * (2 * nn + 1)) / 6}$ uses the formula for $\\sum k^2$; $${s1 ** 3}$ moves the exponent 3 outside the bracket.`])
}

// MI3 — Σ(2k−1) = n²（前 n 個正奇數之和）
for (let nn = 3; nn <= 20; nn++) {
  add(`m2c_mi3_${nn}`, T.induction, FW.decompose, 'easy',
    [`由數學歸納法可證前 $n$ 個正奇數之和 $\\displaystyle\\sum_{k=1}^{n} (2k - 1) = n^2$。求 $1 + 3 + 5 + \\cdots + ${2 * nn - 1}$。`,
     `Mathematical induction gives $\\displaystyle\\sum_{k=1}^{n} (2k - 1) = n^2$ for the sum of the first $n$ positive odd numbers. Evaluate $1 + 3 + 5 + \\cdots + ${2 * nn - 1}$.`],
    [n(`$${nn * nn}$`), n(`$${(nn * (nn + 1)) / 2}$`), n(`$${2 * nn * nn - nn}$`), n(`$${nn * (nn + 1)}$`)],
    [`末項為 $${2 * nn - 1}$，解 $2n - 1 = ${2 * nn - 1}$ 得 $n = ${nn}$，故總和為 $${nn}^2 = ${nn * nn}$。先確定項數再套公式，是這類題最容易出錯的一步。陷阱：$${(nn * (nn + 1)) / 2}$ 用了 $\\sum k$ 的公式；$${2 * nn * nn - nn}$ 把末項公式當成了總和；$${nn * (nn + 1)}$ 多乘了一個因子。`,
     `The last term is $${2 * nn - 1}$; solving $2n - 1 = ${2 * nn - 1}$ gives $n = ${nn}$, so the sum is $${nn}^2 = ${nn * nn}$. Identifying the number of terms before applying the formula is where this type of question is most often lost. Traps: $${(nn * (nn + 1)) / 2}$ uses the formula for $\\sum k$; $${2 * nn * nn - nn}$ mistakes the formula for the last term for the sum; $${nn * (nn + 1)}$ carries an extra factor.`])
}

// MI4 — 等比數列之和 Σ r^k = (r^n − 1)/(r − 1)
for (let r = 2; r <= 4; r++) {
  for (let nn = 3; nn <= 8; nn++) {
    const ans = (r ** nn - 1) / (r - 1)
    add(`m2c_mi4_${r}_${nn}`, T.induction, FW.transform, 'medium',
      [`由數學歸納法可證 $\\displaystyle\\sum_{k=0}^{n-1} ${r}^{k} = \\frac{${r}^{n} - 1}{${r} - 1}$。求 $1 + ${r} + ${r * r} + \\cdots + ${r ** (nn - 1)}$。`,
       `Mathematical induction gives $\\displaystyle\\sum_{k=0}^{n-1} ${r}^{k} = \\frac{${r}^{n} - 1}{${r} - 1}$. Evaluate $1 + ${r} + ${r * r} + \\cdots + ${r ** (nn - 1)}$.`],
      [n(`$${ans}$`), n(`$${r ** nn - 1}$`), n(`$${r ** (nn - 1)}$`), n(`$${(r ** (nn + 1) - 1) / (r - 1)}$`)],
      [`末項為 $${r ** (nn - 1)} = ${r}^{${nn - 1}}$，故項數 $n = ${nn}$。代入公式：$\\dfrac{${r}^{${nn}} - 1}{${r} - 1} = \\dfrac{${r ** nn - 1}}{${r - 1}} = ${ans}$。陷阱：$${r ** nn - 1}$ 忘記除以 $${r} - 1$；$${r ** (nn - 1)}$ 只寫了末項；$${(r ** (nn + 1) - 1) / (r - 1)}$ 把項數多數了一項（末項的指數是 $n-1$ 而非 $n$）。`,
       `The last term is $${r ** (nn - 1)} = ${r}^{${nn - 1}}$, so there are $n = ${nn}$ terms. Substituting, $\\frac{${r}^{${nn}} - 1}{${r} - 1} = \\frac{${r ** nn - 1}}{${r - 1}} = ${ans}$. Traps: $${r ** nn - 1}$ forgets to divide by $${r} - 1$; $${r ** (nn - 1)}$ gives only the last term; $${(r ** (nn + 1) - 1) / (r - 1)}$ counts one term too many, since the last exponent is $n-1$ rather than $n$.`])
  }
}

// MI5 — Σk(k+1) = n(n+1)(n+2)/3
for (let nn = 3; nn <= 16; nn++) {
  const ans = (nn * (nn + 1) * (nn + 2)) / 3
  add(`m2c_mi5_${nn}`, T.induction, FW.decompose, 'hard',
    [`已知 $\\displaystyle\\sum_{k=1}^{n} k(k+1) = \\frac{n(n+1)(n+2)}{3}$。求 $\\displaystyle\\sum_{k=1}^{${nn}} k(k+1)$。`,
     `Given $\\displaystyle\\sum_{k=1}^{n} k(k+1) = \\frac{n(n+1)(n+2)}{3}$, evaluate $\\displaystyle\\sum_{k=1}^{${nn}} k(k+1)$.`],
    [n(`$${ans}$`), n(`$${nn * (nn + 1) * (nn + 2)}$`), n(`$${(nn * (nn + 1)) / 2}$`), n(`$${(nn * (nn + 1) * (2 * nn + 1)) / 6}$`)],
    [`代入 $n = ${nn}$：$\\dfrac{${nn} \\times ${nn + 1} \\times ${nn + 2}}{3} = \\dfrac{${nn * (nn + 1) * (nn + 2)}}{3} = ${ans}$。此結果亦可由 $\\sum k^2 + \\sum k$ 拆項驗證。陷阱：$${nn * (nn + 1) * (nn + 2)}$ 忘記除以 3；$${(nn * (nn + 1)) / 2}$ 只算了 $\\sum k$；$${(nn * (nn + 1) * (2 * nn + 1)) / 6}$ 只算了 $\\sum k^2$。`,
     `With $n = ${nn}$: $\\frac{${nn} \\times ${nn + 1} \\times ${nn + 2}}{3} = \\frac{${nn * (nn + 1) * (nn + 2)}}{3} = ${ans}$. The result can also be checked by splitting the sum into $\\sum k^2 + \\sum k$. Traps: $${nn * (nn + 1) * (nn + 2)}$ forgets to divide by 3; $${(nn * (nn + 1)) / 2}$ computes only $\\sum k$; $${(nn * (nn + 1) * (2 * nn + 1)) / 6}$ computes only $\\sum k^2$.`])
}

// ── 矩陣與行列式 ──────────────────────────────────────────────────────────

// M3 — 純量倍的行列式：對 2×2 矩陣，det(kA) = k²·det(A)
for (let k = 2; k <= 5; k++) {
  for (const d of [2, 3, 5, 7, -3, -4]) {
    add(`m2c_m3_${k}_${d < 0 ? `neg${-d}` : d}`, T.matrices, FW.algebra, 'hard',
      [`設 $A$ 為 $2 \\times 2$ 矩陣，且 $\\det A = ${d}$。求 $\\det(${k}A)$。`,
       `Let $A$ be a $2 \\times 2$ matrix with $\\det A = ${d}$. Find $\\det(${k}A)$.`],
      [n(`$${k * k * d}$`), n(`$${k * d}$`), n(`$${d}$`), n(`$${k ** 3 * d}$`)],
      [`把矩陣乘以純量 $k$，等於每一列都乘以 $k$；行列式對每一列都是齊次的，故 $n \\times n$ 矩陣有 $\\det(kA) = k^{n}\\det A$。此處 $n = 2$，所以 $\\det(${k}A) = ${k}^2 \\times ${d} = ${k * k * d}$。陷阱：$${k * d}$ 只乘了一次 $k$；$${d}$ 誤以為純量倍不影響行列式；$${k ** 3 * d}$ 錯用了 $3 \\times 3$ 的 $k^3$。`,
       `Multiplying a matrix by a scalar $k$ multiplies every row by $k$, and the determinant is homogeneous in each row, so for an $n \\times n$ matrix $\\det(kA) = k^{n}\\det A$. Here $n = 2$, so $\\det(${k}A) = ${k}^2 \\times ${d} = ${k * k * d}$. Traps: $${k * d}$ applies the factor only once; $${d}$ assumes a scalar multiple leaves the determinant unchanged; $${k ** 3 * d}$ uses the $3 \\times 3$ exponent $k^3$.`])
  }
}

// ── 收口批次：四個仍未達每課題約 100 條的課題（2026-08-28）────────────────

// V7 — 中點的位置向量
for (let u = 1; u <= 3; u++) {
  for (let v = 1; v <= 3; v++) {
    for (let w = 1; w <= 2; w++) {
      const [qx, qy, qz] = [1 + 2 * u, 2 + 2 * v, 3 + 2 * w]
      add(`m2c_v7_${u}${v}${w}`, T.vec3d, FW.geom, 'medium',
        [`空間中 $P(1,\\ 2,\\ 3)$、$Q(${qx},\\ ${qy},\\ ${qz})$。求線段 $PQ$ 中點的位置向量。`,
         `In space $P(1,\\ 2,\\ 3)$ and $Q(${qx},\\ ${qy},\\ ${qz})$. Find the position vector of the midpoint of $PQ$.`],
        [n(`$(${1 + u},\\ ${2 + v},\\ ${3 + w})$`), n(`$(${2 * u},\\ ${2 * v},\\ ${2 * w})$`),
         n(`$(${1 + qx},\\ ${2 + qy},\\ ${3 + qz})$`), n(`$(${u},\\ ${v},\\ ${w})$`)],
        [`中點的位置向量為 $\\dfrac{1}{2}\\left(\\overrightarrow{OP} + \\overrightarrow{OQ}\\right)$，即逐個坐標取平均：$\\left(\\dfrac{1 + ${qx}}{2},\\ \\dfrac{2 + ${qy}}{2},\\ \\dfrac{3 + ${qz}}{2}\\right) = (${1 + u},\\ ${2 + v},\\ ${3 + w})$。陷阱：$(${2 * u},\\ ${2 * v},\\ ${2 * w})$ 求的是 $\\overrightarrow{PQ}$ 而非中點；$(${1 + qx},\\ ${2 + qy},\\ ${3 + qz})$ 相加後忘記除以 2；$(${u},\\ ${v},\\ ${w})$ 取了位移的一半而未加回 $P$ 的坐標。`,
         `The midpoint has position vector $\\frac{1}{2}\\left(\\overrightarrow{OP} + \\overrightarrow{OQ}\\right)$, that is the coordinatewise average: $\\left(\\frac{1 + ${qx}}{2},\\ \\frac{2 + ${qy}}{2},\\ \\frac{3 + ${qz}}{2}\\right) = (${1 + u},\\ ${2 + v},\\ ${3 + w})$. Traps: $(${2 * u},\\ ${2 * v},\\ ${2 * w})$ is $\\overrightarrow{PQ}$, not the midpoint; $(${1 + qx},\\ ${2 + qy},\\ ${3 + qz})$ adds without halving; $(${u},\\ ${v},\\ ${w})$ takes half the displacement without adding back the coordinates of $P$.`])
    }
  }
}

// I4 — 定積分的幾何意義：曲線下方的面積
for (const a of [2, 4]) {
  for (let q = 1; q <= 2; q++) {
    for (let b = 2; b <= 5; b++) {
      const ans = (a * b * b) / 2 + q * b
      add(`m2c_i4_${a}_${q}_${b}`, T.integration, FW.modelling, 'hard',
        [`求曲線 $y = ${co(a)}x + ${q}$、$x$ 軸、直線 $x = 0$ 及 $x = ${b}$ 所圍成的面積。`,
         `Find the area bounded by the line $y = ${co(a)}x + ${q}$, the $x$-axis, and the lines $x = 0$ and $x = ${b}$.`],
        [n(`$${ans}$`), n(`$${a * b + q}$`), n(`$${(a * b * b) / 2}$`), n(`$${a * b * b + q * b}$`)],
        [`該面積等於定積分 $\\displaystyle\\int_{0}^{${b}} (${co(a)}x + ${q})\\,dx$。原函數為 $${co(a / 2)}x^2 + ${co(q)}x$，代入上限 $${b}$ 並減去下限 0 得 $${(a / 2) * b * b} + ${q * b} = ${ans}$。在此區間內被積函數恆為正，故定積分值即為面積。陷阱：$${a * b + q}$ 只把 $x = ${b}$ 代入原式，求的是該處的 $y$ 值；$${(a * b * b) / 2}$ 漏了常數項 $${q}$ 所貢獻的長方形面積；$${a * b * b + q * b}$ 積分一次項時忘記除以 2。`,
         `The area equals the definite integral $\\displaystyle\\int_{0}^{${b}} (${co(a)}x + ${q})\\,dx$. The antiderivative is $${co(a / 2)}x^2 + ${co(q)}x$, and evaluating from 0 to $${b}$ gives $${(a / 2) * b * b} + ${q * b} = ${ans}$. The integrand is positive throughout the interval, so the integral is the area. Traps: $${a * b + q}$ substitutes $x = ${b}$ into the original expression and gives the $y$-value there; $${(a * b * b) / 2}$ omits the rectangle contributed by the constant term $${q}$; $${a * b * b + q * b}$ forgets to divide by 2 when integrating the linear term.`])
    }
  }
}

// MI6 — Σk(k+2) = n(n+1)(2n+7)/6
for (let nn = 3; nn <= 16; nn++) {
  const ans = (nn * (nn + 1) * (2 * nn + 7)) / 6
  add(`m2c_mi6_${nn}`, T.induction, FW.decompose, 'hard',
    [`已知 $\\displaystyle\\sum_{k=1}^{n} k(k+2) = \\frac{n(n+1)(2n+7)}{6}$。求 $\\displaystyle\\sum_{k=1}^{${nn}} k(k+2)$。`,
     `Given $\\displaystyle\\sum_{k=1}^{n} k(k+2) = \\frac{n(n+1)(2n+7)}{6}$, evaluate $\\displaystyle\\sum_{k=1}^{${nn}} k(k+2)$.`],
    [n(`$${ans}$`), n(`$${nn * (nn + 1) * (2 * nn + 7)}$`), n(`$${(nn * (nn + 1) * (2 * nn + 1)) / 6}$`), n(`$${(nn * (nn + 1) * (nn + 2)) / 3}$`)],
    [`代入 $n = ${nn}$：$\\dfrac{${nn} \\times ${nn + 1} \\times ${2 * nn + 7}}{6} = \\dfrac{${nn * (nn + 1) * (2 * nn + 7)}}{6} = ${ans}$。此式亦可拆成 $\\sum k^2 + 2\\sum k$ 驗證。陷阱：$${nn * (nn + 1) * (2 * nn + 7)}$ 忘記除以 6；$${(nn * (nn + 1) * (2 * nn + 1)) / 6}$ 把 $2n+7$ 誤寫成 $2n+1$，即只算了 $\\sum k^2$；$${(nn * (nn + 1) * (nn + 2)) / 3}$ 用了 $\\sum k(k+1)$ 的公式。`,
     `With $n = ${nn}$: $\\frac{${nn} \\times ${nn + 1} \\times ${2 * nn + 7}}{6} = \\frac{${nn * (nn + 1) * (2 * nn + 7)}}{6} = ${ans}$. The result can be checked by splitting the sum into $\\sum k^2 + 2\\sum k$. Traps: $${nn * (nn + 1) * (2 * nn + 7)}$ forgets to divide by 6; $${(nn * (nn + 1) * (2 * nn + 1)) / 6}$ writes $2n+1$ for $2n+7$, computing only $\\sum k^2$; $${(nn * (nn + 1) * (nn + 2)) / 3}$ uses the formula for $\\sum k(k+1)$.`])
}

// LS3 — 克拉瑪法則求 y（以常數項取代第二列）
for (const [a, b, c, d] of [[2, 3, 1, 4], [1, 4, 3, 2]] as [number, number, number, number][]) {
  const det = a * d - b * c
  for (let x0 = 1; x0 <= 4; x0++) {
    for (let y0 = 1; y0 <= 2; y0++) {
      if (x0 === y0) continue
      const e = a * x0 + b * y0, f = c * x0 + d * y0
      add(`m2c_ls3_${a}${b}${c}${d}_${x0}_${y0}`, T.systems, FW.algebra, 'medium',
        [`解方程組 $\\begin{cases} ${co(a)}x + ${co(b)}y = ${e} \\\\ ${co(c)}x + ${co(d)}y = ${f} \\end{cases}$，求 $y$ 的值。`,
         `Solve $\\begin{cases} ${co(a)}x + ${co(b)}y = ${e} \\\\ ${co(c)}x + ${co(d)}y = ${f} \\end{cases}$ for $y$.`],
        [n(`$${y0}$`), n(`$${x0}$`), n(`$${x0 + y0}$`), n(`$${y0 * det}$`)],
        [`係數行列式 $\\Delta = ${a}(${d}) - ${b}(${c}) = ${det} \\neq 0$。求 $y$ 時以常數項取代【第二】列：$\\Delta_y = ${a}(${f}) - ${e}(${c}) = ${a * f - e * c}$，故 $y = \\dfrac{${a * f - e * c}}{${det}} = ${y0}$。取代哪一列由所求的未知數決定，這是克拉瑪法則最容易混淆之處。陷阱：$${x0}$ 是 $x$ 的值，即取代了第一列；$${x0 + y0}$ 是 $x + y$；$${y0 * det}$ 停在分子而忘記除以行列式。`,
         `The coefficient determinant is $\\Delta = ${a}(${d}) - ${b}(${c}) = ${det} \\neq 0$. To find $y$, the constants replace the SECOND column: $\\Delta_y = ${a}(${f}) - ${e}(${c}) = ${a * f - e * c}$, so $y = \\frac{${a * f - e * c}}{${det}} = ${y0}$. Which column is replaced depends on the unknown sought, and this is where Cramer's rule is most often confused. Traps: $${x0}$ replaces the first column and gives $x$; $${x0 + y0}$ is $x + y$; $${y0 * det}$ stops at the numerator without dividing by the determinant.`])
    }
  }
}

export const m2BankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const m2BankTopics: Topic[] = topicList([
  { topic: T.systems, fw: FW.algebra, count: 0 },
])
