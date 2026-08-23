import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, n, type TopicMeta, type FwMeta } from './_parametric'

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
} satisfies Record<string, TopicMeta>

const FW = {
  algebra: { id: 'algebra', zh: '代數', en: 'Algebra', emoji: '🔢' },
  calc: { id: 'calculus', zh: '微積分', en: 'Calculus', emoji: '📈' },
  geom: { id: 'vector_geometry', zh: '向量幾何', en: 'Vector Geometry', emoji: '➡️' },
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
