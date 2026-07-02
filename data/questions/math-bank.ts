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
} satisfies Record<string, TopicMeta>

const FW = {
  compute: { id: 'foundation_computation', zh: '基礎運算', en: 'Foundation Computation', emoji: '🧮' },
  algebra: { id: 'algebraic_thinking', zh: '代數思維', en: 'Algebraic Thinking', emoji: '🔢' },
  geometry: { id: 'geometric_intuition', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
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
      [`加價 $${r}\\%$：新價 $= ${P} \\times (1 + ${r}\\%) = ${P} \\times ${(100 + r) / 100} = ${up}$。陷阱：$\\$${down}$ 做咗減價；$\\$${P + r}$ 直接加咗 $${r}$ 而唔係 $${r}\\%$。`,
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
      [`$${A} = ${h} \\times ${A / h}$、$${B} = ${h} \\times ${B / h}$，公有最大因數為 $${h}$。陷阱：$${l}$ 係最小公倍數 (L.C.M.)，唔好撈亂。`,
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
      [`韋達定理：首項係數為 $1$，$\\alpha + \\beta = -\\dfrac{b}{a} = -(${b}) = ${-b}$。陷阱：$${b}$ 漏咗負號；$${c}$ 係兩根之積 $\\alpha\\beta$。`,
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
        [`$T_n = a + (n-1)d = ${a} + (${nn}-1)\\times${d} = ${a} + ${(nn - 1) * d} = ${Tn}$。陷阱：$${a + nn * d}$ 用咗 $n$ 而唔係 $n-1$（off-by-one）。`,
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
        [`$T_n = a r^{\\,n-1} = ${a}\\times ${r}^{${nn - 1}} = ${a}\\times ${Math.pow(r, nn - 1)} = ${Tn}$。陷阱：$${a * Math.pow(r, nn)}$ 用咗 $r^{n}$（漏減一）。`,
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
      [`$AB = \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${dx * dx + dy * dy}} = ${dist}$。陷阱：$${dx * dx + dy * dy}$ 漏咗開方；$${dx + dy}$ 直接加咗坐標差。`,
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
      [`中點 $= \\left(\\dfrac{${x1}+${x2}}{2}, \\dfrac{${y1}+${y2}}{2}\\right) = (${mx}, ${my})$。陷阱：$(${x1 + x2}, ${y1 + y2})$ 漏咗除以 $2$。`,
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
        [`斜率 $= \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{${y2}-${y1}}{${x2}-${x1}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${slope}$。陷阱：$${frac(dx, slope * dx)}$ 將 $\\Delta x$ 同 $\\Delta y$ 上下倒轉（用咗 $\\frac{\\Delta x}{\\Delta y}$）；$${-slope}$ 符號搞錯。`,
         `Slope $= \\frac{y_2-y_1}{x_2-x_1} = ${slope}$. Trap: $${frac(dx, slope * dx)}$ swaps $\\Delta x$ and $\\Delta y$.`])
    }
  }
}

// M7 — Evaluate a logarithm  log_b(bᵏ) = k
for (const b of [2, 3, 5, 10]) {
  for (let k = 2; k <= 5; k++) {
    const N = Math.pow(b, k)
    add(`mb_m7_${b}_${k}`, T.logs, FW.algebra, 'medium',
      [`求 $\\log_{${b}} ${N}$ 的值。`, `Evaluate $\\log_{${b}} ${N}$.`],
      [n(`$${k}$`), n(`$${b}$`), n(`$${N / b}$`), n(`$${k * b}$`)],
      [`$${N} = ${b}^{${k}}$，故 $\\log_{${b}} ${N} = ${k}$。陷阱：$${N / b}$ 係 $${b}^{${k - 1}}$；$${b}$ 誤答成底數。`,
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
        [`餘式定理：餘數 $= f(${a}) = ${a}^2 ${p < 0 ? '-' : '+'} ${Math.abs(p)}(${a}) + ${q} = ${a * a} ${p < 0 ? '-' : '+'} ${Math.abs(p * a)} + ${q} = ${R}$。陷阱：$${a * a - p * a + q}$ 代咗 $x=-${a}$（除式是 $x-${a}$，應代 $+${a}$）。`,
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
      [`韋達：$\\alpha+\\beta = ${-b}$、$\\alpha\\beta = ${c}$。恆等式 $\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = ${b * b} - 2(${c}) = ${s2}$。陷阱：$${b * b}$ 漏咗 $-2\\alpha\\beta$；$${b * b + 2 * c}$ 加錯符號。`,
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
      [`$|r| = \\dfrac{1}{${m}} < 1$，$S_\\infty = \\dfrac{a}{1-r} = \\dfrac{${a}}{1 - \\frac{1}{${m}}} = \\dfrac{${a}}{\\frac{${den}}{${m}}} = ${frac(num, den)}$。陷阱：$${frac(swapNum, swapDen)}$ 用咗 $1+r$（符號錯）；$${frac(a, m)}$ 只算咗第二項。`,
       `$S_\\infty = \\frac{a}{1-r} = ${frac(num, den)}$. Trap: $${frac(swapNum, swapDen)}$ uses $1+r$.`])
    void swap
  }
}

export const mathBankQuestions: Question[] = bank
