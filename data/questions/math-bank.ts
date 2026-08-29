import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question, Difficulty } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// MATH — PARAMETRIC BANK (correct-by-construction, all three tiers)
// ---------------------------------------------------------------------------
// Every question is emitted by a mother-template that iterates over integer
// parameter tuples. The CORRECT answer and ALL THREE distractors are COMPUTED
// by formula (distractors model specific, named mistakes), so nothing here is a
// guessed / unverified answer — that is the whole point (生死線: never ship an
// answer we can't verify). `add()` puts the correct value at index 0 and SKIPS
// any tuple whose 4 option strings aren't all distinct, so the build stays green
// and no ambiguous item is emitted. The practice runner shuffles options at
// render time, so a fixed correctIndex:0 is not a giveaway.
//
// Difficulty tiers map to the site's language:  easy = 補底 · medium = 普通 ·
// hard = 拔尖 5★★.  Ranges are tuned so the emitted mix lands near the DSE
// 30% hard / 50% medium / 20% easy target (see math-bank.count.mjs to re-measure).
// To grow toward 1,000: widen the loop ranges or add more mother-templates.
// ═══════════════════════════════════════════════════════════════════════════

type Pair = [zh: string, en: string]
const n = (s: string): Pair => [s, s] // language-free (numbers / LaTeX): same both sides

interface TopicMeta { id: string; zh: string; en: string }
interface FwMeta { id: string; zh: string; en: string; emoji: string }

const T = {
  indices: { id: 'indices', zh: '指數定律', en: 'Laws of Indices' },
  linear: { id: 'linear_functions', zh: '一次函數', en: 'Linear Functions' },
  percentage: { id: 'percentage', zh: '百分數', en: 'Percentages' },
  factors: { id: 'factors_multiples', zh: '因數與倍數', en: 'Factors & Multiples' },
  quadratic: { id: 'quadratic_equations', zh: '二次方程', en: 'Quadratic Equations' },
  arithSeq: { id: 'arithmetic_sequence', zh: '等差數列', en: 'Arithmetic Sequences' },
  geoSeq: { id: 'geometric_sequence', zh: '等比數列', en: 'Geometric Sequences' },
  coord: { id: 'coordinate_geometry', zh: '坐標幾何', en: 'Coordinate Geometry' },
  logs: { id: 'logarithms', zh: '對數', en: 'Logarithms' },
  polynomial: { id: 'polynomials', zh: '餘式與因式定理', en: 'Remainder & Factor Theorem' },
  // ── 2026-08-28 平均分佈補強（Yuna 目標：每科 1,000 MC 且各課題均勻）──────
  // 實測數學 25 個課題之中，19 個低於平均值 40 條（總缺 436），而
  // quadratic_equations 一個課題已有 283 條。依指示：已達標者不予改動，先補題數最少者，
  // 下列五個最薄課題（各僅 10–11 條）各加母模板。全部 correct-by-construction。
  polygons: { id: 'polygons', zh: '多邊形與角', en: 'Polygons & Angles' },
  similarSolids: { id: 'similar_solids', zh: '相似形與相似立體', en: 'Similar Figures & Solids' },
  variation: { id: 'variation', zh: '變分', en: 'Variation' },
  approximation: { id: 'approximation', zh: '近似與誤差', en: 'Approximation & Error' },
  numberSystems: { id: 'number_systems', zh: '數系', en: 'Number Systems' },
} satisfies Record<string, TopicMeta>

const FW = {
  compute: { id: 'foundation_computation', zh: '基礎運算', en: 'Foundation Computation', emoji: '🧮' },
  algebra: { id: 'algebraic_thinking', zh: '代數思維', en: 'Algebraic Thinking', emoji: '🔢' },
  geometry: { id: 'geometric_intuition', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
  modelling: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
} satisfies Record<string, FwMeta>

const bank: Question[] = []

/** Emit one MC. Correct value goes to index 0; skip the tuple if options aren't 4-distinct. */
function add(
  id: string, topic: TopicMeta, fw: FwMeta, difficulty: Difficulty,
  content: Pair, opts: Pair[], explanation: Pair,
): void {
  if (opts.length !== 4) return
  const zh = opts.map((o) => o[0])
  if (new Set(zh).size !== 4) return // degenerate parameters → drop, don't ship an ambiguous item
  bank.push({
    id, type: 'mc', subject: 'math',
    topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
    framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
    difficulty, year: 0,
    content: content[0], contentEn: content[1],
    options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
    correctIndex: 0,
    explanation: explanation[0], explanationEn: explanation[1],
    marks: difficulty === 'hard' ? 2 : 1,
  })
}

// ── helpers ──────────────────────────────────────────────────────────────────
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))
function frac(num: number, den: number): string {
  if (num === 0) return '0'
  const g = gcd(num, den) || 1
  let p = num / g, q = den / g
  if (q < 0) { p = -p; q = -q }
  return q === 1 ? `${p}` : `\\frac{${p}}{${q}}`
}

// ═══════════════════════════════════════════════════════════════════════════
// 補底 (easy) — direct, single-step application
// ═══════════════════════════════════════════════════════════════════════════

// E1 — Laws of indices: aᵐ · aⁿ = aᵐ⁺ⁿ
for (let a = 2; a <= 7; a++) {
  for (let b = 2; b <= 6; b++) {
    if (a === b) continue
    add(`mb_e1_${a}_${b}`, T.indices, FW.compute, 'easy',
      [`化簡 $x^{${a}} \\cdot x^{${b}}$。`, `Simplify $x^{${a}} \\cdot x^{${b}}$.`],
      [n(`$x^{${a + b}}$`), n(`$x^{${a * b}}$`), n(`$x^{${Math.abs(a - b)}}$`), n(`$${a + b}x$`)],
      [`同底數相乘，指數相加：$x^{${a}} \\cdot x^{${b}} = x^{${a}+${b}} = x^{${a + b}}$。陷阱：$x^{${a * b}}$ 誤把指數相乘；$x^{${Math.abs(a - b)}}$ 誤作相除。`,
       `Same base multiplied ⇒ add exponents: $x^{${a + b}}$. Trap: $x^{${a * b}}$ multiplies the exponents.`])
  }
}

// E2 — Evaluate a linear function f(x)=ax+b at x=k
for (let a = 2; a <= 6; a++) {
  for (let b = 1; b <= 5; b++) {
    for (let k = 2; k <= 5; k++) {
      add(`mb_e2_${a}_${b}_${k}`, T.linear, FW.compute, 'easy',
        [`若 $f(x) = ${a}x + ${b}$，求 $f(${k})$。`, `If $f(x) = ${a}x + ${b}$, find $f(${k})$.`],
        [n(`$${a * k + b}$`), n(`$${a * k - b}$`), n(`$${a + b * k}$`), n(`$${(a + b) * k}$`)],
        [`代入 $x=${k}$：$f(${k}) = ${a}(${k}) + ${b} = ${a * k} + ${b} = ${a * k + b}$。陷阱：$${a + b * k}$ 錯把常數項當係數。`,
         `Substitute $x=${k}$: $${a}(${k})+${b}=${a * k + b}$.`])
    }
  }
}

// E3 — Percentage increase: P raised by r%
for (const P of [200, 300, 400, 500, 600, 800]) {
  for (const r of [5, 10, 15, 20, 25]) {
    if ((P * (100 + r)) % 100 !== 0) continue
    const up = (P * (100 + r)) / 100
    const down = (P * (100 - r)) / 100
    add(`mb_e3_${P}_${r}`, T.percentage, FW.compute, 'easy',
      [`某商品原價 $\\$${P}$，加價 $${r}\\%$ 後的售價是多少？`, `An item priced $\\$${P}$ rises by $${r}\\%$. Find the new price.`],
      [n(`$\\$${up}$`), n(`$\\$${down}$`), n(`$\\$${P + r}$`), n(`$\\$${P * (1 + r)}$`)],
      [`加價 $${r}\\%$：新價 $= ${P} \\times (1 + ${r}\\%) = ${P} \\times ${(100 + r) / 100} = ${up}$。陷阱：$\\$${down}$ 做了減價；$\\$${P + r}$ 直接加了 $${r}$ 而非 $${r}\\%$。`,
       `New price $= ${P}\\times(1+${r}\\%) = ${up}$. Trap: $\\$${down}$ decreases instead.`])
  }
}

// E4 — HCF of two numbers (HCF/LCM confusion trap)
;([[12, 18], [24, 36], [16, 40], [18, 24], [20, 30], [15, 25], [28, 42], [30, 45], [14, 21], [27, 36], [32, 48], [21, 35]] as const)
  .forEach(([A, B], i) => {
    const h = gcd(A, B), l = (A * B) / h
    add(`mb_e4_${i}`, T.factors, FW.compute, 'easy',
      [`求 $${A}$ 與 $${B}$ 的最大公因數 (H.C.F.)。`, `Find the H.C.F. of $${A}$ and $${B}$.`],
      [n(`$${h}$`), n(`$${l}$`), n(`$${A}$`), n(`$${B}$`)],
      [`$${A} = ${h} \\times ${A / h}$、$${B} = ${h} \\times ${B / h}$，公有最大因數為 $${h}$。陷阱：$${l}$ 是最小公倍數 (L.C.M.)，不可混淆。`,
       `$${A}$ and $${B}$ share the largest factor $${h}$. Trap: $${l}$ is the L.C.M., not the H.C.F.`])
  })

// ═══════════════════════════════════════════════════════════════════════════
// 普通 (medium) — two-step / multi-concept
// ═══════════════════════════════════════════════════════════════════════════

// M1 — Vieta: sum of roots of a monic quadratic x²+bx+c=0  (α+β = −b)
for (let b = -6; b <= 6; b++) {
  for (let c = -6; c <= 6; c++) {
    if (b === 0 || c === 0) continue
    if (b * b - 4 * c <= 0) continue // ensure two real roots (a genuine quadratic scenario)
    const sgn = (v: number, s: string) => (v < 0 ? ` - ${Math.abs(v) === 1 && s ? '' : Math.abs(v)}${s}` : ` + ${Math.abs(v) === 1 && s ? '' : v}${s}`)
    const eq = `x^2${sgn(b, 'x')}${sgn(c, '')} = 0`
    add(`mb_m1_${b + 7}_${c + 7}`, T.quadratic, FW.algebra, 'medium',
      [`設 $\\alpha$、$\\beta$ 為方程 $${eq}$ 的兩根，求 $\\alpha + \\beta$。`,
       `Let $\\alpha,\\beta$ be the roots of $${eq}$. Find $\\alpha + \\beta$.`],
      [n(`$${-b}$`), n(`$${b}$`), n(`$${c}$`), n(`$${-c}$`)],
      [`韋達定理：首項係數為 $1$，$\\alpha + \\beta = -\\dfrac{b}{a} = -(${b}) = ${-b}$。陷阱：$${b}$ 漏了負號；$${c}$ 是兩根之積 $\\alpha\\beta$。`,
       `Vieta: $\\alpha+\\beta = -b = ${-b}$. Trap: $${c}$ is the product $\\alpha\\beta$, not the sum.`])
  }
}

// M2 — Arithmetic sequence: nth term  T_n = a + (n−1)d
for (let a = 1; a <= 8; a++) {
  for (let d = 2; d <= 6; d++) {
    for (const nn of [6, 8, 10, 12]) {
      const Tn = a + (nn - 1) * d
      add(`mb_m2_${a}_${d}_${nn}`, T.arithSeq, FW.algebra, 'medium',
        [`一等差數列首項為 $${a}$，公差為 $${d}$。求第 $${nn}$ 項。`,
         `An arithmetic sequence has first term $${a}$ and common difference $${d}$. Find the $${nn}$th term.`],
        [n(`$${Tn}$`), n(`$${a + nn * d}$`), n(`$${a * nn}$`), n(`$${nn * d}$`)],
        [`$T_n = a + (n-1)d = ${a} + (${nn}-1)\\times${d} = ${a} + ${(nn - 1) * d} = ${Tn}$。陷阱：$${a + nn * d}$ 用了 $n$ 而非 $n-1$（off-by-one）。`,
         `$T_n = a+(n-1)d = ${Tn}$. Trap: $${a + nn * d}$ uses $n$ instead of $n-1$.`])
    }
  }
}

// M3 — Geometric sequence: nth term  T_n = a·rⁿ⁻¹
for (let a = 1; a <= 4; a++) {
  for (const r of [2, 3]) {
    for (const nn of [4, 5, 6]) {
      const Tn = a * Math.pow(r, nn - 1)
      add(`mb_m3_${a}_${r}_${nn}`, T.geoSeq, FW.algebra, 'medium',
        [`一等比數列首項為 $${a}$，公比為 $${r}$。求第 $${nn}$ 項。`,
         `A geometric sequence has first term $${a}$ and common ratio $${r}$. Find the $${nn}$th term.`],
        [n(`$${Tn}$`), n(`$${a * Math.pow(r, nn)}$`), n(`$${a * r * (nn - 1)}$`), n(`$${a * nn * r}$`)],
        [`$T_n = a r^{\\,n-1} = ${a}\\times ${r}^{${nn - 1}} = ${a}\\times ${Math.pow(r, nn - 1)} = ${Tn}$。陷阱：$${a * Math.pow(r, nn)}$ 用了 $r^{n}$（漏減一）。`,
         `$T_n = a r^{n-1} = ${Tn}$. Trap: $${a * Math.pow(r, nn)}$ uses $r^{n}$.`])
    }
  }
}

// M4 — Distance between two points (Pythagorean legs → integer distance)
;([[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [7, 24], [20, 21], [12, 16], [10, 24], [15, 20]] as const)
  .forEach(([dx, dy], i) => {
    const dist = Math.round(Math.hypot(dx, dy))
    add(`mb_m4_${i}`, T.coord, FW.geometry, 'medium',
      [`兩點 $A(0,0)$ 及 $B(${dx},${dy})$，求 $AB$ 的距離。`,
       `Find the distance $AB$ where $A(0,0)$ and $B(${dx},${dy})$.`],
      [n(`$${dist}$`), n(`$${dx * dx + dy * dy}$`), n(`$${dx + dy}$`), n(`$${Math.abs(dx - dy)}$`)],
      [`$AB = \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${dx * dx + dy * dy}} = ${dist}$。陷阱：$${dx * dx + dy * dy}$ 漏了開方；$${dx + dy}$ 直接加了坐標差。`,
       `$AB=\\sqrt{${dx}^2+${dy}^2}=${dist}$. Trap: $${dx * dx + dy * dy}$ forgets the square root.`])
  })

// M5 — Midpoint of a segment
;([[2, 4, 6, 10], [1, 3, 5, 7], [-2, 0, 4, 6], [0, -4, 8, 2], [3, 1, 9, 5], [-6, 2, 2, 8], [4, 4, 10, 12], [-8, -2, 0, 6]] as const)
  .forEach(([x1, y1, x2, y2], i) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
    add(`mb_m5_${i}`, T.coord, FW.geometry, 'medium',
      [`求連接 $A(${x1},${y1})$ 及 $B(${x2},${y2})$ 的線段的中點坐標。`,
       `Find the midpoint of the segment joining $A(${x1},${y1})$ and $B(${x2},${y2})$.`],
      [n(`$(${mx}, ${my})$`), n(`$(${(x2 - x1) / 2}, ${(y2 - y1) / 2})$`), n(`$(${x1 + x2}, ${y1 + y2})$`), n(`$(${my}, ${mx})$`)],
      [`中點 $= \\left(\\dfrac{${x1}+${x2}}{2}, \\dfrac{${y1}+${y2}}{2}\\right) = (${mx}, ${my})$。陷阱：$(${x1 + x2}, ${y1 + y2})$ 漏了除以 $2$。`,
       `Midpoint $= \\left(\\frac{${x1}+${x2}}{2},\\frac{${y1}+${y2}}{2}\\right)=(${mx},${my})$. Trap: forgetting to halve.`])
  })

// M6 — Slope of a line through two points (integer slope by construction)
for (let dx = 1; dx <= 4; dx++) {
  for (let m = 1; m <= 4; m++) {
    for (const s of [1, -1]) {
      const slope = s * m
      const x1 = 1, y1 = 2, x2 = x1 + dx, y2 = y1 + slope * dx
      add(`mb_m6_${dx}_${m}_${s}`, T.coord, FW.geometry, 'medium',
        [`求通過 $A(${x1},${y1})$ 及 $B(${x2},${y2})$ 的直線的斜率。`,
         `Find the slope of the line through $A(${x1},${y1})$ and $B(${x2},${y2})$.`],
        [n(`$${slope}$`), n(`$${frac(dx, slope * dx)}$`), n(`$${-slope}$`), n(`$${frac(-dx, slope * dx)}$`)],
        [`斜率 $= \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{${y2}-${y1}}{${x2}-${x1}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${slope}$。陷阱：$${frac(dx, slope * dx)}$ 將 $\\Delta x$ 同 $\\Delta y$ 上下倒轉（用了 $\\frac{\\Delta x}{\\Delta y}$）；$${-slope}$ 符號弄錯。`,
         `Slope $= \\frac{y_2-y_1}{x_2-x_1} = ${slope}$. Trap: $${frac(dx, slope * dx)}$ swaps $\\Delta x$ and $\\Delta y$.`])
    }
  }
}

// M7 — Evaluate a logarithm  log_b(bᵏ) = k
// (b,k) pairs already covered by hand-written questions in math.ts are skipped:
// math_log_1 = log₂8, math_log_2 = log₁₀1000, math_log_4 = log₃81. Those carry a
// year tag and a curated explanation, so the generated twin is the one to drop —
// otherwise one session can sample both and show the student the same question
// twice. The stems differ only as `\log_2` vs `\log_{2}`, so an exact-string
// duplicate check does not catch this; compare with the braces normalised away.
const M7_COVERED_BY_MATH_TS = new Set(['2_3', '3_4', '10_3'])
for (const b of [2, 3, 5, 10]) {
  for (let k = 2; k <= 5; k++) {
    if (M7_COVERED_BY_MATH_TS.has(`${b}_${k}`)) continue
    const N = Math.pow(b, k)
    add(`mb_m7_${b}_${k}`, T.logs, FW.algebra, 'medium',
      [`求 $\\log_{${b}} ${N}$ 的值。`, `Evaluate $\\log_{${b}} ${N}$.`],
      [n(`$${k}$`), n(`$${b}$`), n(`$${N / b}$`), n(`$${k * b}$`)],
      [`$${N} = ${b}^{${k}}$，故 $\\log_{${b}} ${N} = ${k}$。陷阱：$${N / b}$ 是 $${b}^{${k - 1}}$；$${b}$ 誤答成底數。`,
       `$${N}=${b}^{${k}}$ ⇒ $\\log_{${b}}${N}=${k}$. Trap: $${b}$ is just the base.`])
  }
}

// M8 — Remainder theorem: f(x)=x²+px+q divided by (x−a) leaves f(a)
for (let a = 1; a <= 4; a++) {
  for (let p = -3; p <= 3; p++) {
    for (const q of [1, 2, 3]) {
      if (p === 0) continue
      const R = a * a + p * a + q
      const psgn = (v: number) => (v < 0 ? ` - ${Math.abs(v) === 1 ? '' : Math.abs(v)}x` : ` + ${v === 1 ? '' : v}x`)
      add(`mb_m8_${a}_${p + 4}_${q}`, T.polynomial, FW.algebra, 'medium',
        [`設 $f(x) = x^2${psgn(p)} + ${q}$。求 $f(x)$ 除以 $(x - ${a})$ 的餘數。`,
         `Let $f(x) = x^2${psgn(p)} + ${q}$. Find the remainder when $f(x)$ is divided by $(x - ${a})$.`],
        [n(`$${R}$`), n(`$${a * a - p * a + q}$`), n(`$${p * a + q}$`), n(`$${a * a + p * a - q}$`)],
        [`餘式定理：餘數 $= f(${a}) = ${a}^2 ${p < 0 ? '-' : '+'} ${Math.abs(p)}(${a}) + ${q} = ${a * a} ${p < 0 ? '-' : '+'} ${Math.abs(p * a)} + ${q} = ${R}$。陷阱：$${a * a - p * a + q}$ 誤代 $x=-${a}$（除式是 $x-${a}$，應代 $+${a}$）。`,
         `Remainder theorem: remainder $= f(${a}) = ${R}$. Trap: $${a * a - p * a + q}$ substitutes $x=-${a}$.`])
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 拔尖 (hard) — multi-step / identity / trap-heavy 5★★
// ═══════════════════════════════════════════════════════════════════════════

// H1 — α²+β² of a monic quadratic (Vieta + identity, must not solve the roots)
for (let b = -7; b <= 7; b++) {
  for (let c = -6; c <= 6; c++) {
    if (b === 0 || c === 0) continue
    if (b * b - 4 * c <= 0) continue
    const s2 = b * b - 2 * c // α²+β² = (α+β)² − 2αβ = b² − 2c
    const sgn = (v: number, x: string) => (v < 0 ? ` - ${Math.abs(v) === 1 && x ? '' : Math.abs(v)}${x}` : ` + ${Math.abs(v) === 1 && x ? '' : v}${x}`)
    const eq = `x^2${sgn(b, 'x')}${sgn(c, '')} = 0`
    add(`mb_h1_${b + 8}_${c + 6}`, T.quadratic, FW.algebra, 'hard',
      [`設 $\\alpha$、$\\beta$ 為 $${eq}$ 的兩根，求 $\\alpha^2 + \\beta^2$。`,
       `Let $\\alpha,\\beta$ be the roots of $${eq}$. Find $\\alpha^2 + \\beta^2$.`],
      [n(`$${s2}$`), n(`$${b * b}$`), n(`$${b * b + 2 * c}$`), n(`$${b * b - c}$`)],
      [`韋達：$\\alpha+\\beta = ${-b}$、$\\alpha\\beta = ${c}$。恆等式 $\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = ${b * b} - 2(${c}) = ${s2}$。陷阱：$${b * b}$ 漏了 $-2\\alpha\\beta$；$${b * b + 2 * c}$ 加錯符號。`,
       `Vieta then identity: $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=${b * b}-2(${c})=${s2}$. Trap: $${b * b}$ drops the $-2\\alpha\\beta$.`])
  }
}

// H2 — α³+β³ of a monic quadratic (the deeper identity)
for (let b = -5; b <= 5; b++) {
  for (const c of [1, 2, 3, -1, -2]) {
    if (b === 0) continue
    if (b * b - 4 * c <= 0) continue
    const sum = -b, prod = c
    const s3 = sum * sum * sum - 3 * prod * sum // α³+β³ = (α+β)³ − 3αβ(α+β)
    const sgn = (v: number, x: string) => (v < 0 ? ` - ${Math.abs(v) === 1 && x ? '' : Math.abs(v)}${x}` : ` + ${Math.abs(v) === 1 && x ? '' : v}${x}`)
    const eq = `x^2${sgn(b, 'x')}${sgn(c, '')} = 0`
    add(`mb_h2_${b + 6}_${c + 3}`, T.quadratic, FW.algebra, 'hard',
      [`設 $\\alpha$、$\\beta$ 為 $${eq}$ 的兩根，求 $\\alpha^3 + \\beta^3$。`,
       `Let $\\alpha,\\beta$ be the roots of $${eq}$. Find $\\alpha^3 + \\beta^3$.`],
      [n(`$${s3}$`), n(`$${sum * sum * sum}$`), n(`$${sum * sum * sum + 3 * prod * sum}$`), n(`$${sum * sum * sum - prod * sum}$`)],
      [`韋達：$\\alpha+\\beta = ${sum}$、$\\alpha\\beta = ${prod}$。$\\alpha^3+\\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta) = ${sum ** 3} - 3(${prod})(${sum}) = ${s3}$。陷阱：$${sum * sum * sum}$ 漏晒第二項；$${sum * sum * sum + 3 * prod * sum}$ 加錯號。`,
       `$\\alpha^3+\\beta^3=(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)=${s3}$. Trap: dropping the $-3\\alpha\\beta(\\alpha+\\beta)$ term.`])
  }
}

// H3 — Sum to infinity of a geometric series, S∞ = a/(1−r), r = 1/m
for (let a = 2; a <= 9; a++) {
  for (const m of [2, 3, 4]) {
    // S∞ = a / (1 − 1/m) = a·m/(m−1)
    const num = a * m, den = m - 1
    const swap = a * m // for r = −1/m: a/(1+1/m) = a·m/(m+1)
    const swapNum = a * m, swapDen = m + 1
    add(`mb_h3_${a}_${m}`, T.geoSeq, FW.algebra, 'hard',
      [`一等比數列首項為 $${a}$，公比為 $\\dfrac{1}{${m}}$，求其無窮項之和。`,
       `A geometric series has first term $${a}$ and common ratio $\\frac{1}{${m}}$. Find its sum to infinity.`],
      [n(`$${frac(num, den)}$`), n(`$${frac(swapNum, swapDen)}$`), n(`$${a * m}$`), n(`$${frac(a, m)}$`)],
      [`$|r| = \\dfrac{1}{${m}} < 1$，$S_\\infty = \\dfrac{a}{1-r} = \\dfrac{${a}}{1 - \\frac{1}{${m}}} = \\dfrac{${a}}{\\frac{${den}}{${m}}} = ${frac(num, den)}$。陷阱：$${frac(swapNum, swapDen)}$ 用了 $1+r$（符號錯）；$${frac(a, m)}$ 只算了第二項。`,
       `$S_\\infty = \\frac{a}{1-r} = ${frac(num, den)}$. Trap: $${frac(swapNum, swapDen)}$ uses $1+r$.`])
    void swap
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 五個最薄課題（2026-08-28）
// 每組母模板的正解與三個干擾項全部由公式計出，干擾項各自模擬一個具名錯誤。
// ═══════════════════════════════════════════════════════════════════════════

// P1 — 多邊形內角和：(n − 2) × 180
for (let nn = 3; nn <= 20; nn++) {
  const sum = (nn - 2) * 180
  add(`mb_p1_${nn}`, T.polygons, FW.geometry, 'easy',
    [`一個 ${nn} 邊形的內角和是多少度？`, `What is the sum of the interior angles of a ${nn}-sided polygon?`],
    [n(`$${sum}^\\circ$`), n(`$${nn * 180}^\\circ$`), n(`$${(nn - 1) * 180}^\\circ$`), n(`$${360}^\\circ$`)],
    [`內角和公式為 $(n-2) \\times 180^\\circ$。代入 $n = ${nn}$：$(${nn}-2) \\times 180 = ${sum}^\\circ$。陷阱：$${nn * 180}^\\circ$ 漏減 2；$${(nn - 1) * 180}^\\circ$ 只減 1；$360^\\circ$ 是外角和，與邊數無關。`,
     `The interior angle sum is $(n-2) \\times 180^\\circ$. With $n = ${nn}$: $(${nn}-2) \\times 180 = ${sum}^\\circ$. Traps: $${nn * 180}^\\circ$ omits the $-2$; $${(nn - 1) * 180}^\\circ$ subtracts only 1; $360^\\circ$ is the exterior angle sum, independent of the number of sides.`])
}

// P2 — 正多邊形每隻內角與外角（只取可整除的 n，避免小數）
for (const nn of [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]) {
  const ext = 360 / nn, int = 180 - ext
  add(`mb_p2a_${nn}`, T.polygons, FW.geometry, 'easy',
    [`一個正 ${nn} 邊形的每隻外角是多少度？`, `What is each exterior angle of a regular ${nn}-sided polygon?`],
    [n(`$${ext}^\\circ$`), n(`$${int}^\\circ$`), n(`$${(nn - 2) * 180 / nn === int ? 360 - ext : 360 - ext}^\\circ$`), n(`$${180 / nn}^\\circ$`)],
    [`正多邊形各外角相等，外角和恆為 $360^\\circ$，故每隻外角 $= 360 \\div ${nn} = ${ext}^\\circ$。陷阱：$${int}^\\circ$ 是每隻內角；$${180 / nn}^\\circ$ 誤用 $180$ 作分子。`,
     `A regular polygon has equal exterior angles summing to $360^\\circ$, so each is $360 \\div ${nn} = ${ext}^\\circ$. Traps: $${int}^\\circ$ is each interior angle; $${180 / nn}^\\circ$ divides $180$ instead.`])
  add(`mb_p2b_${nn}`, T.polygons, FW.geometry, 'medium',
    [`一個正 ${nn} 邊形的每隻內角是多少度？`, `What is each interior angle of a regular ${nn}-sided polygon?`],
    [n(`$${int}^\\circ$`), n(`$${ext}^\\circ$`), n(`$${(nn - 2) * 180}^\\circ$`), n(`$${180 - 360 / (nn + 1)}^\\circ$`)],
    [`每隻內角 $= 180^\\circ -$ 每隻外角 $= 180 - ${ext} = ${int}^\\circ$；亦可用 $(n-2)\\times 180 \\div n = ${(nn - 2) * 180} \\div ${nn} = ${int}^\\circ$，兩條路徑必須一致。陷阱：$${ext}^\\circ$ 是外角；$${(nn - 2) * 180}^\\circ$ 是內角總和而非每隻。`,
     `Each interior angle is $180^\\circ$ minus each exterior angle $= 180 - ${ext} = ${int}^\\circ$; equivalently $(n-2)\\times 180 \\div n = ${(nn - 2) * 180} \\div ${nn} = ${int}^\\circ$, and the two routes must agree. Traps: $${ext}^\\circ$ is the exterior angle; $${(nn - 2) * 180}^\\circ$ is the total, not one angle.`])
}

// S1 — 相似立體：長度比 a : b ⇒ 面積比 a² : b²、體積比 a³ : b³
for (const [a, b] of [[1, 2], [1, 3], [1, 4], [2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7], [4, 7], [5, 6]] as [number, number][]) {
  add(`mb_s1a_${a}_${b}`, T.similarSolids, FW.geometry, 'easy',
    [`兩個相似立體的長度比為 $${a} : ${b}$。其表面積比是多少？`, `Two similar solids have lengths in the ratio $${a} : ${b}$. What is the ratio of their surface areas?`],
    [n(`$${a * a} : ${b * b}$`), n(`$${a} : ${b}$`), n(`$${a * a * a} : ${b * b * b}$`), n(`$${a * 2} : ${b * 2}$`)],
    [`相似立體的面積比等於長度比的平方：$${a}^2 : ${b}^2 = ${a * a} : ${b * b}$。陷阱：$${a} : ${b}$ 直接用長度比；$${a * a * a} : ${b * b * b}$ 用了立方（那是體積比）；$${a * 2} : ${b * 2}$ 誤把「平方」當成乘 2。`,
     `Areas of similar solids are in the square of the length ratio: $${a}^2 : ${b}^2 = ${a * a} : ${b * b}$. Traps: $${a} : ${b}$ uses the length ratio itself; $${a * a * a} : ${b * b * b}$ cubes it (that is the volume ratio); $${a * 2} : ${b * 2}$ doubles instead of squaring.`])
  add(`mb_s1b_${a}_${b}`, T.similarSolids, FW.geometry, 'medium',
    [`兩個相似立體的長度比為 $${a} : ${b}$。其體積比是多少？`, `Two similar solids have lengths in the ratio $${a} : ${b}$. What is the ratio of their volumes?`],
    [n(`$${a * a * a} : ${b * b * b}$`), n(`$${a * a} : ${b * b}$`), n(`$${a} : ${b}$`), n(`$${a * 3} : ${b * 3}$`)],
    [`相似立體的體積比等於長度比的立方：$${a}^3 : ${b}^3 = ${a * a * a} : ${b * b * b}$。陷阱：$${a * a} : ${b * b}$ 是面積比；$${a} : ${b}$ 是長度比本身；$${a * 3} : ${b * 3}$ 誤把「立方」當成乘 3。`,
     `Volumes of similar solids are in the cube of the length ratio: $${a}^3 : ${b}^3 = ${a * a * a} : ${b * b * b}$. Traps: $${a * a} : ${b * b}$ is the area ratio; $${a} : ${b}$ is the length ratio; $${a * 3} : ${b * 3}$ trebles instead of cubing.`])
}

// V1 — 正比變分：y = kx
for (let k = 2; k <= 6; k++) {
  for (let b = 2; b <= 4; b++) {
    for (const c of [b + 2, b + 4]) {
      const yOld = k * b, yNew = k * c
      add(`mb_v1_${k}_${b}_${c}`, T.variation, FW.modelling, 'easy',
        [`已知 $y$ 與 $x$ 成正比。當 $x = ${b}$ 時 $y = ${yOld}$。求當 $x = ${c}$ 時 $y$ 的值。`,
         `$y$ varies directly as $x$. When $x = ${b}$, $y = ${yOld}$. Find $y$ when $x = ${c}$.`],
        [n(`$${yNew}$`), n(`$${yOld + (c - b)}$`), n(`$${yOld * c}$`), n(`$${Math.round(yOld * b / c * 100) / 100}$`)],
        [`正比即 $y = kx$。由 $x = ${b}$、$y = ${yOld}$ 得 $k = ${yOld} \\div ${b} = ${k}$。故 $x = ${c}$ 時 $y = ${k} \\times ${c} = ${yNew}$。陷阱：$${yOld + (c - b)}$ 誤當成加法關係；$${yOld * c}$ 漏了先求 $k$；$${Math.round(yOld * b / c * 100) / 100}$ 用了反比。`,
         `Direct variation means $y = kx$. From $x = ${b}$, $y = ${yOld}$ we get $k = ${yOld} \\div ${b} = ${k}$, so at $x = ${c}$, $y = ${k} \\times ${c} = ${yNew}$. Traps: $${yOld + (c - b)}$ treats the relation as additive; $${yOld * c}$ skips finding $k$; $${Math.round(yOld * b / c * 100) / 100}$ uses inverse variation.`])
    }
  }
}

// V2 — 反比變分：xy = k（只取整除組合）
for (const k of [24, 36, 48, 60]) {
  for (const b of [2, 3, 4]) {
    for (const c of [6, 8, 12]) {
      if (b === c || k % b || k % c) continue
      const yOld = k / b, yNew = k / c
      add(`mb_v2_${k}_${b}_${c}`, T.variation, FW.modelling, 'medium',
        [`已知 $y$ 與 $x$ 成反比。當 $x = ${b}$ 時 $y = ${yOld}$。求當 $x = ${c}$ 時 $y$ 的值。`,
         `$y$ varies inversely as $x$. When $x = ${b}$, $y = ${yOld}$. Find $y$ when $x = ${c}$.`],
        [n(`$${yNew}$`), n(`$${Math.round(yOld * c / b * 100) / 100}$`), n(`$${yOld - (c - b)}$`), n(`$${k}$`)],
        [`反比即 $xy = k$（乘積不變）。由 $x = ${b}$、$y = ${yOld}$ 得 $k = ${b} \\times ${yOld} = ${k}$。故 $x = ${c}$ 時 $y = ${k} \\div ${c} = ${yNew}$。陷阱：$${Math.round(yOld * c / b * 100) / 100}$ 用了正比；$${yOld - (c - b)}$ 誤當成減法關係；$${k}$ 停在常數 $k$ 未除。`,
         `Inverse variation means $xy = k$, a constant product. From $x = ${b}$, $y = ${yOld}$ we get $k = ${b} \\times ${yOld} = ${k}$, so at $x = ${c}$, $y = ${k} \\div ${c} = ${yNew}$. Traps: $${Math.round(yOld * c / b * 100) / 100}$ uses direct variation; $${yOld - (c - b)}$ treats it as subtraction; $${k}$ stops at the constant.`])
    }
  }
}

// A1 — 近似：準確至最接近 d，求上限 / 最大絕對誤差
for (const L of [20, 25, 30, 40, 45, 50, 60, 75]) {
  for (const d of [1, 2, 10]) {
    const half = d / 2
    add(`mb_a1_${L}_${d}`, T.approximation, FW.compute, 'easy',
      [`某長度量得 $${L}$ cm，準確至最接近 $${d}$ cm。該長度的上限是多少？`,
       `A length is measured as $${L}$ cm, correct to the nearest $${d}$ cm. What is its upper limit?`],
      [n(`$${L + half}$ cm`), n(`$${L + d}$ cm`), n(`$${L - half}$ cm`), n(`$${L}$ cm`)],
      [`準確至最接近 $${d}$ cm，表示真值與量得值相差不超過半個單位，即 $${d} \\div 2 = ${half}$ cm。上限 $= ${L} + ${half} = ${L + half}$ cm。陷阱：$${L + d}$ cm 加了整個單位；$${L - half}$ cm 是下限；$${L}$ cm 是量得值本身。`,
       `Correct to the nearest $${d}$ cm means the true value differs by at most half a unit, that is $${d} \\div 2 = ${half}$ cm. The upper limit is $${L} + ${half} = ${L + half}$ cm. Traps: $${L + d}$ cm adds a whole unit; $${L - half}$ cm is the lower limit; $${L}$ cm is the measurement itself.`])
  }
}

// A2 — 百分誤差 = |量得 − 真值| ÷ 真值 × 100%
for (const A of [50, 80, 100, 200, 250]) {
  for (const e of [2, 4, 5, 10]) {
    const M = A * (1 + e / 100)
    if (!Number.isInteger(M)) continue
    add(`mb_a2_${A}_${e}`, T.approximation, FW.compute, 'medium',
      [`某物件的真實質量為 $${A}$ g，量得 $${M}$ g。其百分誤差是多少？`,
       `An object's true mass is $${A}$ g but it is measured as $${M}$ g. What is the percentage error?`],
      [n(`$${e}\\%$`), n(`$${Math.round((M - A) / M * 10000) / 100}\\%$`), n(`$${M - A}\\%$`), n(`$${Math.round(M / A * 100)}\\%$`)],
      [`百分誤差 $=$ 絕對誤差 $\\div$ 真值 $\\times 100\\%$。絕對誤差 $= ${M} - ${A} = ${M - A}$ g，故百分誤差 $= ${M - A} \\div ${A} \\times 100\\% = ${e}\\%$。陷阱：$${Math.round((M - A) / M * 10000) / 100}\\%$ 誤用量得值作分母；$${M - A}\\%$ 把絕對誤差直接當成百分率；$${Math.round(M / A * 100)}\\%$ 是量得值佔真值的比例。`,
       `Percentage error is absolute error ÷ true value × 100%. The absolute error is $${M} - ${A} = ${M - A}$ g, so the percentage error is $${M - A} \\div ${A} \\times 100\\% = ${e}\\%$. Traps: $${Math.round((M - A) / M * 10000) / 100}\\%$ divides by the measurement; $${M - A}\\%$ reads the absolute error as a percentage; $${Math.round(M / A * 100)}\\%$ is the measurement as a proportion of the true value.`])
  }
}

// N1 — 數系：化簡二次根式 √(a²b) = a√b
for (let a = 2; a <= 6; a++) {
  for (const b of [2, 3, 5, 6, 7, 10]) {
    const inside = a * a * b
    add(`mb_n1_${a}_${b}`, T.numberSystems, FW.compute, 'easy',
      [`化簡 $\\sqrt{${inside}}$。`, `Simplify $\\sqrt{${inside}}$.`],
      [n(`$${a}\\sqrt{${b}}$`), n(`$${a * a}\\sqrt{${b}}$`), n(`$${a}\\sqrt{${a * b}}$`), n(`$${b}\\sqrt{${a}}$`)],
      [`把根號內的數分解出完全平方因子：$${inside} = ${a * a} \\times ${b}$，而 $\\sqrt{${a * a}} = ${a}$，故 $\\sqrt{${inside}} = ${a}\\sqrt{${b}}$。陷阱：$${a * a}\\sqrt{${b}}$ 把 $${a * a}$ 整個搬出根號而未開方；$${a}\\sqrt{${a * b}}$ 只抽走一個 $${a}$；$${b}\\sqrt{${a}}$ 把兩個因子的角色調轉。`,
       `Extract the perfect-square factor: $${inside} = ${a * a} \\times ${b}$ and $\\sqrt{${a * a}} = ${a}$, so $\\sqrt{${inside}} = ${a}\\sqrt{${b}}$. Traps: $${a * a}\\sqrt{${b}}$ moves $${a * a}$ out without taking its root; $${a}\\sqrt{${a * b}}$ extracts only one factor of $${a}$; $${b}\\sqrt{${a}}$ swaps the two factors.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強（2026-08-28）—— 只補最薄的課題，已達標者一條不動
// ---------------------------------------------------------------------------
// 實測數學 25 個課題：二次方程 283 條、等差數列 142 條，而函數與建模僅 11 條、
// 數列／軌跡與坐標／因數與倍數各 12 條，不均比 25.7×（全站最差）。
// 每課題目標約 40 條（1,000 ÷ 25）。以下十個母模板全部只服務最薄的課題。
// ═══════════════════════════════════════════════════════════════════════════

const T2 = {
  functions: { id: 'functions', zh: '函數與建模', en: 'Functions & Modelling' },
  sequences: { id: 'sequences', zh: '數列', en: 'Sequences' },
  locus: { id: 'locus', zh: '軌跡與坐標', en: 'Locus & Coordinates' },
  trig: { id: 'trigonometry', zh: '三角函數', en: 'Trigonometry' },
  trig3d: { id: 'trig_3d', zh: '三維三角學', en: '3D Trigonometry' },
  probability: { id: 'probability', zh: '概率', en: 'Probability' },
  statistics: { id: 'statistics', zh: '統計', en: 'Statistics' },
  inequalities: { id: 'inequalities', zh: '不等式', en: 'Inequalities' },
  permComb: { id: 'permutation_combination', zh: '排列與組合', en: 'Permutations & Combinations' },
  circles: { id: 'circles', zh: '圓的幾何特性', en: 'Properties of Circles' },
} satisfies Record<string, TopicMeta>

const co2 = (v: number): string => (v === 1 ? '' : v === -1 ? '-' : String(v))
const fct = (k: number): number => (k <= 1 ? 1 : k * fct(k - 1))
const comb = (k: number, r: number): number => (r < 0 || r > k ? 0 : fct(k) / (fct(r) * fct(k - r)))

// ── 函數與建模 ────────────────────────────────────────────────────────────

// FN1 — 求函數值 f(x) = ax² + bx + c 於 x = k
for (let a = 1; a <= 3; a++) {
  for (let b = 1; b <= 4; b++) {
    for (let k = 2; k <= 4; k++) {
      const c = 5
      const ans = a * k * k + b * k + c
      add(`mb2_fn1_${a}${b}${k}`, T2.functions, FW.algebra, 'easy',
        [`設 $f(x) = ${co2(a)}x^2 + ${co2(b)}x + ${c}$。求 $f(${k})$。`,
         `Let $f(x) = ${co2(a)}x^2 + ${co2(b)}x + ${c}$. Find $f(${k})$.`],
        [n(`$${ans}$`), n(`$${a * k * 2 + b * k + c}$`), n(`$${a * k * k + b + c}$`), n(`$${2 * a * k + b}$`)],
        [`代入 $x = ${k}$：$${a}(${k})^2 + ${b}(${k}) + ${c} = ${a * k * k} + ${b * k} + ${c} = ${ans}$。陷阱：$${a * k * 2 + b * k + c}$ 把 $x^2$ 誤算成 $2x$；$${a * k * k + b + c}$ 在一次項漏了代入 $x$；$${2 * a * k + b}$ 求了導數而非函數值。`,
         `Substituting $x = ${k}$: $${a}(${k})^2 + ${b}(${k}) + ${c} = ${a * k * k} + ${b * k} + ${c} = ${ans}$. Traps: $${a * k * 2 + b * k + c}$ reads $x^2$ as $2x$; $${a * k * k + b + c}$ omits $x$ in the linear term; $${2 * a * k + b}$ differentiates instead of evaluating.`])
    }
  }
}

// FN2 — 複合函數 f(g(x))
for (let a = 2; a <= 4; a++) {
  for (let b = 1; b <= 3; b++) {
    for (let k = 1; k <= 3; k++) {
      const g = a * k + b          // g(k) = ax + b
      const ans = g * g            // f(x) = x²
      add(`mb2_fn2_${a}${b}${k}`, T2.functions, FW.algebra, 'medium',
        [`設 $f(x) = x^2$、$g(x) = ${co2(a)}x + ${b}$。求 $f(g(${k}))$。`,
         `Let $f(x) = x^2$ and $g(x) = ${co2(a)}x + ${b}$. Find $f(g(${k}))$.`],
        [n(`$${ans}$`), n(`$${a * k * k + b}$`), n(`$${g}$`), n(`$${a * a * k * k + b * b}$`)],
        [`複合函數由內而外計算：先求 $g(${k}) = ${a}(${k}) + ${b} = ${g}$，再代入 $f$：$f(${g}) = ${g}^2 = ${ans}$。次序不可倒轉 —— $f(g(x))$ 與 $g(f(x))$ 一般並不相等。陷阱：$${a * k * k + b}$ 算了 $g(f(${k}))$，次序倒轉；$${g}$ 只做了內層而未代入 $f$；$${a * a * k * k + b * b}$ 展開平方時漏了交叉項 $2ab$。`,
         `A composite is evaluated from the inside out: first $g(${k}) = ${a}(${k}) + ${b} = ${g}$, then $f(${g}) = ${g}^2 = ${ans}$. The order matters, since $f(g(x))$ and $g(f(x))$ are generally different. Traps: $${a * k * k + b}$ computes $g(f(${k}))$ with the order reversed; $${g}$ stops at the inner function; $${a * a * k * k + b * b}$ drops the cross term $2ab$ when squaring.`])
    }
  }
}

// ── 數列 ──────────────────────────────────────────────────────────────────

// SQ1 — 由通項公式求指定項
for (let a = 2; a <= 5; a++) {
  for (let b = 1; b <= 4; b++) {
    for (const k of [5, 8, 12]) {
      const ans = a * k + b
      add(`mb2_sq1_${a}${b}_${k}`, T2.sequences, FW.compute, 'easy',
        [`某數列的通項為 $T_n = ${co2(a)}n + ${b}$。求第 ${k} 項。`,
         `A sequence has general term $T_n = ${co2(a)}n + ${b}$. Find the ${k}th term.`],
        [n(`$${ans}$`), n(`$${a * (k - 1) + b}$`), n(`$${a * k}$`), n(`$${a + b * k}$`)],
        [`直接把 $n = ${k}$ 代入通項：$${a}(${k}) + ${b} = ${a * k} + ${b} = ${ans}$。陷阱：$${a * (k - 1) + b}$ 誤用了 $n - 1$（等差數列的首項公式 $a + (n-1)d$ 中的 $n-1$ 屬於公差項，不可套到通項上）；$${a * k}$ 漏了常數項；$${a + b * k}$ 把係數與常數項對調。`,
         `Substitute $n = ${k}$ directly: $${a}(${k}) + ${b} = ${a * k} + ${b} = ${ans}$. Traps: $${a * (k - 1) + b}$ uses $n - 1$, borrowing it from the arithmetic formula $a + (n-1)d$ where it belongs to the common-difference term only; $${a * k}$ drops the constant; $${a + b * k}$ swaps coefficient and constant.`])
    }
  }
}

// SQ2 — 由遞推關係求下一項
for (let a = 2; a <= 4; a++) {
  for (let b = 1; b <= 4; b++) {
    for (const t of [3, 5, 7]) {
      const ans = a * t + b
      add(`mb2_sq2_${a}${b}_${t}`, T2.sequences, FW.compute, 'medium',
        [`某數列滿足 $T_{n+1} = ${co2(a)}T_n + ${b}$，且 $T_1 = ${t}$。求 $T_3$。`,
         `A sequence satisfies $T_{n+1} = ${co2(a)}T_n + ${b}$ with $T_1 = ${t}$. Find $T_3$.`],
        [n(`$${a * ans + b}$`), n(`$${ans}$`), n(`$${a * a * t + b}$`), n(`$${a * t + b * 2}$`)],
        [`遞推關係要逐項推算，不可一步跳到底。$T_2 = ${a}(${t}) + ${b} = ${ans}$；$T_3 = ${a}(${ans}) + ${b} = ${a * ans + b}$。陷阱：$${ans}$ 只算到 $T_2$ 便停手；$${a * a * t + b}$ 把常數項只加了一次（正確應為 $a^2 T_1 + ab + b$）；$${a * t + b * 2}$ 把常數項加倍卻沒有乘上係數。`,
         `A recurrence must be applied term by term rather than jumped. $T_2 = ${a}(${t}) + ${b} = ${ans}$, then $T_3 = ${a}(${ans}) + ${b} = ${a * ans + b}$. Traps: $${ans}$ stops at $T_2$; $${a * a * t + b}$ adds the constant only once, whereas the correct expansion is $a^2 T_1 + ab + b$; $${a * t + b * 2}$ doubles the constant without applying the coefficient.`])
    }
  }
}

// ── 軌跡與坐標 ────────────────────────────────────────────────────────────

// LC1 — 兩點的中點坐標
for (let x1 = 1; x1 <= 4; x1++) {
  for (let y1 = 1; y1 <= 3; y1++) {
    for (const [dx, dy] of [[4, 6], [6, 2], [2, 8]] as [number, number][]) {
      const x2 = x1 + dx, y2 = y1 + dy
      add(`mb2_lc1_${x1}${y1}_${dx}${dy}`, T2.locus, FW.geometry, 'easy',
        [`求連接 $A(${x1},\\ ${y1})$ 與 $B(${x2},\\ ${y2})$ 的線段的中點坐標。`,
         `Find the coordinates of the midpoint of the segment joining $A(${x1},\\ ${y1})$ and $B(${x2},\\ ${y2})$.`],
        [n(`$(${x1 + dx / 2},\\ ${y1 + dy / 2})$`), n(`$(${dx},\\ ${dy})$`),
         n(`$(${x1 + x2},\\ ${y1 + y2})$`), n(`$(${dx / 2},\\ ${dy / 2})$`)],
        [`中點坐標為兩點坐標的平均：$\\left(\\dfrac{${x1} + ${x2}}{2},\\ \\dfrac{${y1} + ${y2}}{2}\\right) = (${x1 + dx / 2},\\ ${y1 + dy / 2})$。陷阱：$(${dx},\\ ${dy})$ 求了兩點的差；$(${x1 + x2},\\ ${y1 + y2})$ 相加後忘記除以 2；$(${dx / 2},\\ ${dy / 2})$ 取了差的一半而未加回 $A$ 的坐標。`,
         `The midpoint is the average of the two points: $\\left(\\frac{${x1} + ${x2}}{2},\\ \\frac{${y1} + ${y2}}{2}\\right) = (${x1 + dx / 2},\\ ${y1 + dy / 2})$. Traps: $(${dx},\\ ${dy})$ gives the difference; $(${x1 + x2},\\ ${y1 + y2})$ adds without halving; $(${dx / 2},\\ ${dy / 2})$ halves the difference without adding back $A$.`])
    }
  }
}

// LC2 — 兩點距離（畢氏三元組，確保整數）
for (const [dx, dy, d] of [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15],
  [12, 16, 20], [7, 24, 25], [10, 24, 26], [20, 21, 29], [15, 20, 25], [18, 24, 30], [16, 30, 34]] as [number, number, number][]) {
  for (const x1 of [1, 2]) {
    add(`mb2_lc2_${dx}${dy}_${x1}`, T2.locus, FW.geometry, 'medium',
      [`求 $P(${x1},\\ 1)$ 與 $Q(${x1 + dx},\\ ${1 + dy})$ 之間的距離。`,
       `Find the distance between $P(${x1},\\ 1)$ and $Q(${x1 + dx},\\ ${1 + dy})$.`],
      [n(`$${d}$`), n(`$${dx + dy}$`), n(`$${d * d}$`), n(`$${dy - dx}$`)],
      [`距離公式 $= \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$。此處 $\\Delta x = ${dx}$、$\\Delta y = ${dy}$，故距離 $= \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${d * d}} = ${d}$。陷阱：$${dx + dy}$ 把兩個差直接相加；$${d * d}$ 停在平方和而未開方；$${dy - dx}$ 把兩個差相減。`,
       `The distance formula is $\\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$. Here $\\Delta x = ${dx}$ and $\\Delta y = ${dy}$, so the distance is $\\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${d * d}} = ${d}$. Traps: $${dx + dy}$ adds the differences; $${d * d}$ stops at the sum of squares; $${dy - dx}$ subtracts them.`])
  }
}

// ── 三角函數 ──────────────────────────────────────────────────────────────

// TG1 — 直角三角形中的三角比（畢氏三元組，確保比值為有理數）
for (const [o, a, h] of [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15],
  [7, 24, 25], [20, 21, 29], [12, 16, 20], [10, 24, 26], [16, 30, 34]] as [number, number, number][]) {
  add(`mb2_tg1s_${o}${a}`, T2.trig, FW.geometry, 'easy',
    [`直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$，對邊 $= ${o}$、鄰邊 $= ${a}$、斜邊 $= ${h}$。求 $\\sin A$。`,
     `In right-angled triangle $ABC$ with $\\angle C = 90^\\circ$, the opposite side is ${o}, the adjacent side ${a} and the hypotenuse ${h}. Find $\\sin A$.`],
    [n(`$${frac(o, h)}$`), n(`$${frac(a, h)}$`), n(`$${frac(o, a)}$`), n(`$${frac(h, o)}$`)],
    [`$\\sin A = \\dfrac{\\text{對邊}}{\\text{斜邊}} = \\dfrac{${o}}{${h}} = ${frac(o, h)}$。三個基本三角比可用「一斜二鄰三對」的口訣分辨：$\\sin$ 用對邊比斜邊、$\\cos$ 用鄰邊比斜邊、$\\tan$ 用對邊比鄰邊。陷阱：$${frac(a, h)}$ 是 $\\cos A$；$${frac(o, a)}$ 是 $\\tan A$；$${frac(h, o)}$ 把分子分母倒轉。`,
     `$\\sin A = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{${o}}{${h}} = ${frac(o, h)}$. The three basic ratios are distinguished by SOH-CAH-TOA: sine uses opposite over hypotenuse, cosine adjacent over hypotenuse, tangent opposite over adjacent. Traps: $${frac(a, h)}$ is $\\cos A$; $${frac(o, a)}$ is $\\tan A$; $${frac(h, o)}$ inverts the fraction.`])
  add(`mb2_tg1t_${o}${a}`, T2.trig, FW.geometry, 'medium',
    [`直角三角形中，$\\angle C = 90^\\circ$，對邊 $= ${o}$、鄰邊 $= ${a}$、斜邊 $= ${h}$。求 $\\tan A$。`,
     `In a right-angled triangle with $\\angle C = 90^\\circ$, the opposite side is ${o}, the adjacent side ${a} and the hypotenuse ${h}. Find $\\tan A$.`],
    [n(`$${frac(o, a)}$`), n(`$${frac(o, h)}$`), n(`$${frac(a, o)}$`), n(`$${frac(a, h)}$`)],
    [`$\\tan A = \\dfrac{\\text{對邊}}{\\text{鄰邊}} = \\dfrac{${o}}{${a}} = ${frac(o, a)}$。留意 $\\tan$ 是唯一不涉及斜邊的基本三角比，因此在只知兩條直角邊時最為方便。陷阱：$${frac(o, h)}$ 是 $\\sin A$；$${frac(a, h)}$ 是 $\\cos A$；$${frac(a, o)}$ 把分子分母倒轉。`,
     `$\\tan A = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${o}}{${a}} = ${frac(o, a)}$. Note that tangent is the only basic ratio not involving the hypotenuse, which makes it the convenient choice when only the two legs are known. Traps: $${frac(o, h)}$ is $\\sin A$; $${frac(a, h)}$ is $\\cos A$; $${frac(a, o)}$ inverts the fraction.`])
}

// TG2 — 特殊角的三角比
;([['\\sin 30^\\circ', '\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}', '\\frac{\\sqrt{2}}{2}', '1'],
   ['\\cos 60^\\circ', '\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}', '\\frac{\\sqrt{2}}{2}', '1'],
   ['\\sin 60^\\circ', '\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '\\sqrt{3}'],
   ['\\cos 30^\\circ', '\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '\\sqrt{3}'],
   ['\\tan 45^\\circ', '1', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '\\sqrt{2}'],
   ['\\sin 45^\\circ', '\\frac{\\sqrt{2}}{2}', '\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}', '1'],
   ['\\cos 45^\\circ', '\\frac{\\sqrt{2}}{2}', '\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}', '1'],
   ['\\tan 30^\\circ', '\\frac{\\sqrt{3}}{3}', '\\sqrt{3}', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}'],
   ['\\tan 60^\\circ', '\\sqrt{3}', '\\frac{\\sqrt{3}}{3}', '\\frac{1}{2}', '1'],
   ['\\sin 90^\\circ', '1', '0', '\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{3}}{2}'],
   ['\\cos 90^\\circ', '0', '1', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}'],
   ['\\sin 0^\\circ', '0', '1', '\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}']] as [string, string, string, string, string][])
  .forEach(([expr, ans, d1, d2, d3], i) => {
    add(`mb2_tg2_${i}`, T2.trig, FW.compute, 'medium',
      [`求 $${expr}$ 的值。`, `Find the value of $${expr}$.`],
      [n(`$${ans}$`), n(`$${d1}$`), n(`$${d2}$`), n(`$${d3}$`)],
      [`特殊角的三角比可由兩個標準三角形直接讀出：邊長 $1 : \\sqrt{3} : 2$ 的 30–60–90 直角三角形，以及邊長 $1 : 1 : \\sqrt{2}$ 的 45–45–90 直角三角形。$${expr} = ${ans}$。三個誘答分別是同一組標準三角形之中【其他角】或【其他比】的值 —— 這正是本課題最常見的失分方式：記住了幾個數值，卻配錯了角與比的組合。`,
       `The ratios for special angles are read straight off two standard triangles: the 30-60-90 triangle with sides $1 : \\sqrt{3} : 2$, and the 45-45-90 triangle with sides $1 : 1 : \\sqrt{2}$. Here $${expr} = ${ans}$. The three distractors are values belonging to OTHER angles or OTHER ratios within the same standard triangles — which is exactly how marks are lost here: the numbers are remembered but paired with the wrong angle or ratio.`])
  })

// ── 概率 ──────────────────────────────────────────────────────────────────

// PB1 — 古典概率：袋中取球
for (const r of [2, 3, 4, 5, 6]) {
  for (const b of [3, 4, 5, 7]) {
    const tot = r + b
    add(`mb2_pb1_${r}${b}`, T2.probability, FW.compute, 'easy',
      [`袋中有 ${r} 個紅球與 ${b} 個藍球。隨機抽出一球，抽得紅球的概率是多少？`,
       `A bag holds ${r} red balls and ${b} blue balls. One ball is drawn at random. What is the probability that it is red?`],
      [n(`$${frac(r, tot)}$`), n(`$${frac(r, b)}$`), n(`$${frac(b, tot)}$`), n(`$${frac(tot, r)}$`)],
      [`古典概率 = 有利結果數 ÷ 所有等可能結果總數。全部球共 ${r} + ${b} = ${tot} 個，紅球 ${r} 個，故概率 $= ${frac(r, tot)}$。分母必須是【總數】而非另一種球的數目，這是本題最常見的失分位。陷阱：$${frac(r, b)}$ 用了紅藍【比例】而非概率；$${frac(b, tot)}$ 是抽得藍球的概率；$${frac(tot, r)}$ 把分子分母倒轉，數值大於 1，本身已不可能是概率。`,
       `Classical probability is favourable outcomes divided by the total number of equally likely outcomes. There are ${r} + ${b} = ${tot} balls in all and ${r} are red, so the probability is $${frac(r, tot)}$. The denominator must be the TOTAL, not the count of the other colour, and that is where marks are most often lost. Traps: $${frac(r, b)}$ gives the red-to-blue RATIO rather than a probability; $${frac(b, tot)}$ is the probability of blue; $${frac(tot, r)}$ inverts the fraction and exceeds 1, which is already impossible for a probability.`])
  }
}

// PB2 — 獨立事件的乘法定律
for (const d1 of [2, 3, 4]) {
  for (const d2 of [3, 5, 6]) {
    if (d1 === d2) continue
    add(`mb2_pb2_${d1}${d2}`, T2.probability, FW.modelling, 'medium',
      [`甲事件發生的概率為 $${frac(1, d1)}$，乙事件發生的概率為 $${frac(1, d2)}$，兩者互相獨立。兩件事同時發生的概率是多少？`,
       `Event A has probability $${frac(1, d1)}$ and event B has probability $${frac(1, d2)}$, and the two are independent. What is the probability that both occur?`],
      [n(`$${frac(1, d1 * d2)}$`), n(`$${frac(d1 + d2, d1 * d2)}$`), n(`$${frac(1, d1 + d2)}$`), n(`$${frac(2, d1 * d2)}$`)],
      [`兩個獨立事件【同時】發生，概率相乘：$${frac(1, d1)} \\times ${frac(1, d2)} = ${frac(1, d1 * d2)}$。留意「同時」用乘法、「其中之一」（互斥時）才用加法 —— 分辨這兩者是概率題的關鍵。陷阱：$${frac(d1 + d2, d1 * d2)}$ 把兩個概率相加，那是互斥事件「其中之一發生」的算法；$${frac(1, d1 + d2)}$ 把分母相加；$${frac(2, d1 * d2)}$ 多乘了 2。`,
       `For two independent events to occur TOGETHER, multiply the probabilities: $${frac(1, d1)} \\times ${frac(1, d2)} = ${frac(1, d1 * d2)}$. Note that "both" calls for multiplication while "either one" — for mutually exclusive events — calls for addition, and telling the two apart is the crux of probability questions. Traps: $${frac(d1 + d2, d1 * d2)}$ adds the probabilities, which is the rule for either of two mutually exclusive events; $${frac(1, d1 + d2)}$ adds the denominators; $${frac(2, d1 * d2)}$ carries a spurious factor of 2.`])
  }
}

// ── 統計 ──────────────────────────────────────────────────────────────────

// ST1 — 一組數據的平均數
for (const base of [4, 6, 8, 10, 12]) {
  for (const step of [2, 3, 5]) {
    const xs = [base, base + step, base + 2 * step, base + 3 * step, base + 4 * step]
    const mean = base + 2 * step
    add(`mb2_st1_${base}_${step}`, T2.statistics, FW.compute, 'easy',
      [`求數據 ${xs.join('、')} 的平均數。`, `Find the mean of the data ${xs.join(', ')}.`],
      [n(`$${mean}$`), n(`$${xs[0] + xs[4]}$`), n(`$${xs.reduce((p, c) => p + c, 0)}$`), n(`$${xs[4] - xs[0]}$`)],
      [`平均數 = 總和 ÷ 數據個數 = $${xs.reduce((p, c) => p + c, 0)} \\div 5 = ${mean}$。此組數據等距排列，故平均數恰好等於中位數 ${mean}，可用作驗算。陷阱：$${xs.reduce((p, c) => p + c, 0)}$ 只算了總和而未除以個數；$${xs[0] + xs[4]}$ 只把首尾相加；$${xs[4] - xs[0]}$ 求的是全距。`,
       `The mean is the sum divided by the number of data: ${xs.reduce((p, c) => p + c, 0)} ÷ 5 = ${mean}. These values are evenly spaced, so the mean coincides with the median ${mean}, which serves as a check. Traps: $${xs.reduce((p, c) => p + c, 0)}$ is the sum without dividing; $${xs[0] + xs[4]}$ adds only the first and last; $${xs[4] - xs[0]}$ is the range.`])
  }
}

// ST2 — 加入新數據後平均數的變化
for (const nOld of [4, 5, 8, 10]) {
  for (const meanOld of [12, 15, 20]) {
    for (const extra of [22, 30]) {
      const newMean = (nOld * meanOld + extra) / (nOld + 1)
      if (!Number.isInteger(newMean)) continue
      add(`mb2_st2_${nOld}_${meanOld}_${extra}`, T2.statistics, FW.modelling, 'hard',
        [`${nOld} 個數據的平均數為 ${meanOld}。加入一個數值 ${extra} 之後，新的平均數是多少？`,
         `The mean of ${nOld} data values is ${meanOld}. After a further value of ${extra} is included, what is the new mean?`],
        [n(`$${newMean}$`), n(`$${(meanOld + extra) / 2}$`), n(`$${meanOld}$`), n(`$${nOld * meanOld + extra}$`)],
        [`先由舊平均數還原總和：$${nOld} \\times ${meanOld} = ${nOld * meanOld}$。加入新數據後總和為 $${nOld * meanOld} + ${extra} = ${nOld * meanOld + extra}$，數據個數變成 ${nOld + 1}，故新平均數 $= ${nOld * meanOld + extra} \\div ${nOld + 1} = ${newMean}$。陷阱：$${(meanOld + extra) / 2}$ 把舊平均數與新數據直接平均，忽略了舊平均數代表 ${nOld} 個數據、權重並不相同；$${meanOld}$ 以為加入一個數不影響平均；$${nOld * meanOld + extra}$ 停在總和而未除以個數。`,
         `First recover the old total from the old mean: $${nOld} \\times ${meanOld} = ${nOld * meanOld}$. Adding the new value gives $${nOld * meanOld} + ${extra} = ${nOld * meanOld + extra}$ over ${nOld + 1} values, so the new mean is $${nOld * meanOld + extra} \\div ${nOld + 1} = ${newMean}$. Traps: $${(meanOld + extra) / 2}$ averages the old mean with the new value, ignoring that the old mean stands for ${nOld} values and the weights differ; $${meanOld}$ assumes one extra value leaves the mean unchanged; $${nOld * meanOld + extra}$ stops at the total without dividing.`])
    }
  }
}

// ── 不等式 ────────────────────────────────────────────────────────────────

// IQ1 — 解一元一次不等式（負係數須變號）
for (let a = 2; a <= 5; a++) {
  for (let b = 1; b <= 4; b++) {
    for (const c of [6, 12, 20]) {
      if ((c - b) % a !== 0) continue
      const k = (c - b) / a
      add(`mb2_iq1_${a}${b}_${c}`, T2.inequalities, FW.algebra, 'medium',
        [`解不等式 $-${a}x + ${b} > ${b - c}$。`, `Solve the inequality $-${a}x + ${b} > ${b - c}$.`],
        [n(`$x < ${k}$`), n(`$x > ${k}$`), n(`$x < ${-k}$`), n(`$x > ${-k}$`)],
        [`移項得 $-${a}x > ${-c}$。兩邊同除以【負數】 $-${a}$ 時，不等號方向必須反轉，故 $x < ${k}$。這一步是整條題的關鍵，亦是最常見的失分位 —— 等式沒有這個規則，不等式才有。陷阱：$x > ${k}$ 忘記變號；另外兩項在變號之外還把數值的正負號一併弄錯。`,
         `Rearranging gives $-${a}x > ${-c}$. Dividing both sides by the NEGATIVE number $-${a}$ reverses the inequality sign, so $x < ${k}$. That step is the crux of the question and the commonest place to lose marks — equations have no such rule, only inequalities do. Traps: $x > ${k}$ forgets to reverse the sign; the other two get both the direction and the sign of the value wrong.`])
    }
  }
}

// ── 排列與組合 ────────────────────────────────────────────────────────────

// PC1 — 組合 C(n, r)
for (const nn of [5, 6, 7, 8, 9, 10]) {
  for (const r of [2, 3]) {
    add(`mb2_pc1_${nn}_${r}`, T2.permComb, FW.compute, 'medium',
      [`從 ${nn} 名學生之中選出 ${r} 名組成小組（不分先後），共有多少種選法？`,
       `In how many ways can ${r} students be chosen from ${nn} to form a group, where order does not matter?`],
      [n(`$${comb(nn, r)}$`), n(`$${comb(nn, r) * fct(r)}$`), n(`$${nn * r}$`), n(`$${comb(nn - 1, r)}$`)],
      [`「不分先後」即用組合：$\\binom{${nn}}{${r}} = \\dfrac{${nn}!}{${r}!\\,(${nn}-${r})!} = ${comb(nn, r)}$。陷阱：$${comb(nn, r) * fct(r)}$ 是排列 $P^{${nn}}_{${r}}$，把次序也算進去了 —— 分辨組合與排列，關鍵在於問題有沒有涉及【次序】或【職位之分】；$${nn * r}$ 把兩數相乘；$${comb(nn - 1, r)}$ 少數了一個人。`,
       `Order does not matter, so this is a combination: $\\binom{${nn}}{${r}} = \\frac{${nn}!}{${r}!\\,(${nn}-${r})!} = ${comb(nn, r)}$. Traps: $${comb(nn, r) * fct(r)}$ is the permutation $P^{${nn}}_{${r}}$ and counts order as well — telling combinations from permutations turns on whether the question involves ORDER or distinct roles; $${nn * r}$ simply multiplies; $${comb(nn - 1, r)}$ counts one person too few.`])
  }
}

// ── 因數與倍數（12 條，全科第二薄）────────────────────────────────────────

// FM1 — 最大公因數
for (const [a, b] of [[12, 18], [24, 36], [16, 40], [45, 60], [28, 42], [30, 75], [48, 72],
  [21, 56], [36, 90], [50, 125], [54, 81], [32, 80], [63, 84], [44, 66]] as [number, number][]) {
  const g = gcd(a, b)
  add(`mb3_fm1_${a}_${b}`, T.factors, FW.compute, 'easy',
    [`求 ${a} 與 ${b} 的最大公因數。`, `Find the highest common factor of ${a} and ${b}.`],
    [n(`$${g}$`), n(`$${(a * b) / g}$`), n(`$${a * b}$`), n(`$${Math.abs(a - b)}$`)],
    [`把兩數作質因數分解，取【共有】質因數的【較低】次方相乘：$${a}$ 與 $${b}$ 的最大公因數為 $${g}$。陷阱：$${(a * b) / g}$ 是最小公倍數 —— 最大公因數與最小公倍數滿足 $\\text{HCF} \\times \\text{LCM} = ${a} \\times ${b}$，兩者容易混淆；$${a * b}$ 直接把兩數相乘；$${Math.abs(a - b)}$ 求了兩數之差。`,
     `Factorise both numbers into primes and multiply the COMMON primes taken to the LOWER power: the highest common factor of $${a}$ and $${b}$ is $${g}$. Traps: $${(a * b) / g}$ is the lowest common multiple — the two are linked by $\\text{HCF} \\times \\text{LCM} = ${a} \\times ${b}$ and are easily confused; $${a * b}$ multiplies the numbers; $${Math.abs(a - b)}$ takes their difference.`])
}

// FM2 — 最小公倍數
for (const [a, b] of [[4, 6], [6, 8], [9, 12], [10, 15], [8, 20], [14, 21], [12, 18], [15, 25],
  [16, 24], [18, 27], [20, 30], [22, 33], [9, 15], [10, 12]] as [number, number][]) {
  const g = gcd(a, b), l = (a * b) / g
  add(`mb3_fm2_${a}_${b}`, T.factors, FW.compute, 'medium',
    [`求 ${a} 與 ${b} 的最小公倍數。`, `Find the lowest common multiple of ${a} and ${b}.`],
    [n(`$${l}$`), n(`$${g}$`), n(`$${a * b}$`), n(`$${a + b}$`)],
    [`最小公倍數取【全部】質因數的【較高】次方相乘，亦可用 $\\dfrac{${a} \\times ${b}}{\\text{HCF}} = \\dfrac{${a * b}}{${g}} = ${l}$。陷阱：$${g}$ 是最大公因數（取共有質因數的較低次方，方向剛好相反）；$${a * b}$ 是兩數之積，只有在兩數互質時才等於最小公倍數；$${a + b}$ 把兩數相加。`,
     `The lowest common multiple multiplies ALL primes taken to the HIGHER power, or equivalently $\\frac{${a} \\times ${b}}{\\text{HCF}} = \\frac{${a * b}}{${g}} = ${l}$. Traps: $${g}$ is the highest common factor, which takes common primes to the lower power and runs the opposite way; $${a * b}$ is the product and equals the LCM only when the numbers are coprime; $${a + b}$ adds them.`])
}

// ── 三維三角學（13 條，全科最薄）──────────────────────────────────────────

// TD1 — 長方體的空間對角線（畢氏三元組推廣，確保整數）
for (const [a, b, c, d] of [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9],
  [3, 4, 12, 13], [2, 10, 11, 15], [6, 6, 7, 11], [1, 12, 12, 17], [3, 12, 4, 13],
  [2, 5, 14, 15], [4, 8, 19, 21], [8, 9, 12, 17], [6, 10, 15, 19]] as [number, number, number, number][]) {
  add(`mb3_td1_${a}_${b}_${c}`, T2.trig3d, FW.geometry, 'medium',
    [`一個長方體的長、闊、高分別為 ${a}、${b}、${c}。求其空間對角線的長度。`,
     `A cuboid measures ${a} by ${b} by ${c}. Find the length of its space diagonal.`],
    [n(`$${d}$`), n(`$${a + b + c}$`), n(`$${d * d}$`), n(`$${Math.round(Math.sqrt(a * a + b * b) * 100) / 100}$`)],
    [`空間對角線須把畢氏定理用兩次：先求底面對角線 $\\sqrt{${a}^2 + ${b}^2}$，再與高組成第二個直角三角形，得 $\\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${d * d}} = ${d}$。陷阱：$${a + b + c}$ 把三邊直接相加；$${d * d}$ 停在平方和而未開方；$${Math.round(Math.sqrt(a * a + b * b) * 100) / 100}$ 只求了【底面】對角線，漏了高這一維 —— 由平面推廣到立體時漏掉一維，是本課題最常見的失分位。`,
     `A space diagonal needs Pythagoras twice: first the base diagonal $\\sqrt{${a}^2 + ${b}^2}$, then that together with the height in a second right-angled triangle, giving $\\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${d * d}} = ${d}$. Traps: $${a + b + c}$ adds the edges; $${d * d}$ stops at the sum of squares; $${Math.round(Math.sqrt(a * a + b * b) * 100) / 100}$ gives only the BASE diagonal and omits the third dimension — losing a dimension when moving from plane to solid is where this topic is most often lost.`])
}

// TD2 — 直線與平面所成的角（正切值）
for (const [base, h] of [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8],
  [7, 24], [24, 7], [9, 12], [12, 9], [20, 21]] as [number, number][]) {
  add(`mb3_td2_${base}_${h}`, T2.trig3d, FW.geometry, 'hard',
    [`一支長 ${h} 的旗桿垂直豎立於水平地面。由桿頂望向地面上距桿腳 ${base} 的一點，該視線與水平面所成角的正切值是多少？`,
     `A flagpole of height ${h} stands vertically on level ground. Looking from the top of the pole to a point on the ground ${base} from its foot, what is the tangent of the angle between the line of sight and the horizontal?`],
    [n(`$${frac(h, base)}$`), n(`$${frac(base, h)}$`), n(`$${frac(h, Math.round(Math.sqrt(base * base + h * h)))}$`), n(`$${frac(base, Math.round(Math.sqrt(base * base + h * h)))}$`)],
    [`直線與平面所成的角，量度的是該直線與它在平面上【投影】之間的夾角。此處投影是地面上由桿腳到該點的線段（長 ${base}），而與角相對的是旗桿本身（長 ${h}），故 $\\tan\\theta = \\dfrac{${h}}{${base}} = ${frac(h, base)}$。陷阱：$${frac(base, h)}$ 把對邊與鄰邊倒轉；另外兩項用了斜邊，那是 $\\sin$ 與 $\\cos$ 而非 $\\tan$。`,
     `The angle between a line and a plane is measured against the line's PROJECTION on that plane. Here the projection is the ground segment of length ${base} from the foot of the pole, and the side opposite the angle is the pole itself, of length ${h}, so $\\tan\\theta = \\frac{${h}}{${base}} = ${frac(h, base)}$. Traps: $${frac(base, h)}$ swaps opposite and adjacent; the other two use the hypotenuse and so give sine or cosine rather than tangent.`])
}

// ── 指數定律 ──────────────────────────────────────────────────────────────

// IX1 — 同底數冪相乘與相除
for (let a = 2; a <= 5; a++) {
  for (let m = 2; m <= 5; m++) {
    for (let k = 1; k <= 3; k++) {
      if (m - k < 1) continue
      add(`mb3_ix1_${a}${m}${k}`, T.indices, FW.compute, 'easy',
        [`化簡 $${a}^{${m}} \\times ${a}^{${k}}$，答案以 $${a}$ 的冪表示。`,
         `Simplify $${a}^{${m}} \\times ${a}^{${k}}$, giving the answer as a power of $${a}$.`],
        [n(`$${a}^{${m + k}}$`), n(`$${a}^{${m * k}}$`), n(`$${a * a}^{${m + k}}$`), n(`$${a}^{${m - k}}$`)],
        [`同底數冪相乘，底數不變而指數【相加】：$${a}^{${m}} \\times ${a}^{${k}} = ${a}^{${m}+${k}} = ${a}^{${m + k}}$。陷阱：$${a}^{${m * k}}$ 把指數相乘（那是冪的乘方 $(a^m)^k$ 的規則）；$${a * a}^{${m + k}}$ 連底數也乘了；$${a}^{${m - k}}$ 用了相除的規則。`,
         `Multiplying powers of the same base keeps the base and ADDS the exponents: $${a}^{${m}} \\times ${a}^{${k}} = ${a}^{${m}+${k}} = ${a}^{${m + k}}$. Traps: $${a}^{${m * k}}$ multiplies the exponents, which is the rule for a power of a power $(a^m)^k$; $${a * a}^{${m + k}}$ multiplies the bases as well; $${a}^{${m - k}}$ applies the division rule.`])
    }
  }
}

// ── 對數 ──────────────────────────────────────────────────────────────────

// LG1 — 對數的和差法則
for (const [p, q] of [[2, 5], [4, 25], [2, 50], [5, 20], [4, 250], [8, 125], [20, 5], [25, 4],
  [50, 2], [200, 5], [500, 2], [40, 25]] as [number, number][]) {
  const v = Math.log10(p * q)
  if (!Number.isInteger(v)) continue
  add(`mb3_lg1_${p}_${q}`, T.logs, FW.compute, 'medium',
    [`求 $\\log ${p} + \\log ${q}$ 的值。`, `Find the value of $\\log ${p} + \\log ${q}$.`],
    [n(`$${v}$`), n(`$${Math.round(Math.log10(p / q) * 1000) / 1000}$`), n(`$${p * q}$`), n(`$${p + q}$`)],
    [`對數的和等於乘積的對數：$\\log ${p} + \\log ${q} = \\log(${p} \\times ${q}) = \\log ${p * q} = ${v}$。此處常用 $\\log 10 = 1$、$\\log 100 = 2$、$\\log 1000 = 3$。陷阱：$${Math.round(Math.log10(p / q) * 1000) / 1000}$ 用了相【減】的法則，那對應的是商的對數；$${p * q}$ 只算了括號內的乘積而未取對數；$${p + q}$ 把兩個真數直接相加 —— 留意 $\\log a + \\log b \\neq \\log(a+b)$。`,
     `The sum of logarithms is the logarithm of the product: $\\log ${p} + \\log ${q} = \\log(${p} \\times ${q}) = \\log ${p * q} = ${v}$, using $\\log 10 = 1$, $\\log 100 = 2$ and $\\log 1000 = 3$. Traps: $${Math.round(Math.log10(p / q) * 1000) / 1000}$ applies the SUBTRACTION rule, which corresponds to a quotient; $${p * q}$ computes the product without taking its logarithm; $${p + q}$ adds the arguments, and note that $\\log a + \\log b \\neq \\log(a+b)$.`])
}

// ── 圓的幾何特性 ──────────────────────────────────────────────────────────

// CR1 — 同弧上的圓心角等於圓周角的兩倍
for (const insc of [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]) {
  add(`mb3_cr1_${insc}`, T2.circles, FW.geometry, 'medium',
    [`圓中，$\\angle ABC$ 為圓周角，其所對的弧為 $AC$。若 $\\angle ABC = ${insc}^\\circ$，求同弧所對的圓心角 $\\angle AOC$。`,
     `In a circle, $\\angle ABC$ is an inscribed angle standing on arc $AC$. If $\\angle ABC = ${insc}^\\circ$, find the central angle $\\angle AOC$ on the same arc.`],
    [n(`$${2 * insc}^\\circ$`), n(`$${insc}^\\circ$`), n(`$${Math.round(insc / 2)}^\\circ$`), n(`$${180 - insc}^\\circ$`)],
    [`同弧所對的圓心角是圓周角的【兩倍】：$\\angle AOC = 2 \\times ${insc}^\\circ = ${2 * insc}^\\circ$。這條定理同時解釋了為何半圓上的圓周角必為直角（圓心角為 $180^\\circ$），以及為何同弧上的圓周角全部相等。陷阱：$${insc}^\\circ$ 以為兩角相等；$${Math.round(insc / 2)}^\\circ$ 把倍數關係倒轉；$${180 - insc}^\\circ$ 誤用了圓內接四邊形對角互補的定理。`,
     `The central angle is TWICE the inscribed angle on the same arc: $\\angle AOC = 2 \\times ${insc}^\\circ = ${2 * insc}^\\circ$. The same theorem explains why an angle in a semicircle is a right angle, the central angle there being $180^\\circ$, and why all inscribed angles on one arc are equal. Traps: $${insc}^\\circ$ assumes the angles are equal; $${Math.round(insc / 2)}^\\circ$ inverts the relationship; $${180 - insc}^\\circ$ misapplies the cyclic-quadrilateral theorem about supplementary opposite angles.`])
}

export const mathBankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const mathBankTopics: Topic[] = topicList([
  { topic: T.indices, fw: FW.compute, count: 0 },
  { topic: T.linear, fw: FW.compute, count: 0 },
  { topic: T.factors, fw: FW.compute, count: 0 },
  { topic: T.arithSeq, fw: FW.algebra, count: 0 },
  { topic: T.geoSeq, fw: FW.algebra, count: 0 },
  { topic: T.polynomial, fw: FW.algebra, count: 0 },
  // 註：polygons / similar_solids / variation / approximation / number_systems
  // 五者【不在此登記】—— 它們已於 math.ts 的 mathTopics 登記，此處重複登記會
  // 令科目頁出現兩個相同入口（已由 topic-registration.test.mts 攔截）。
  // 母模板只負責產生題目，課題註冊沿用既有一處。
])
