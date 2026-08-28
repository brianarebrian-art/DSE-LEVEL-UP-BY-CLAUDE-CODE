import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, n, type TopicMeta, type FwMeta, round } from './_parametric'

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
