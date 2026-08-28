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
