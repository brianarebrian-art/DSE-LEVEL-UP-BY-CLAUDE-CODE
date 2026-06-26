import type { Question } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// MATH 拔尖 5★★ KILLER ENGINE (parametric)
// 全部係真・多步、跨概念嘅 DSE 卷二殺手題 —— NO single-step plug-ins。每條母題以
// 種子派生 ~10 條變體，選項（1 正解 + 3 致命干擾項）由公式「計算」得出。pq() 內建
// 去重守衛：任何重複選項即喺 build 時 throw（編譯即驗證）。全部 tag = 'hard' =
// 👁️ HELL OF HELL · 5★★。淺題已移除，只服務想拔尖嘅學生。
// ═══════════════════════════════════════════════════════════════════════════

type Pair = [zh: string, en: string]
interface TopicMeta { id: string; zh: string; en: string }
interface FwMeta { id: string; zh: string; en: string; emoji: string }

const T = {
  circles: { id: 'circles', zh: '圓的幾何特性', en: 'Properties of Circles' },
  trig3d: { id: 'trig_3d', zh: '三維三角學', en: '3D Trigonometry' },
  permcomb: { id: 'permutation_combination', zh: '排列與組合', en: 'Permutations & Combinations' },
  locus: { id: 'locus', zh: '軌跡與坐標', en: 'Locus & Coordinates' },
  quadratic: { id: 'quadratic_equations', zh: '二次方程', en: 'Quadratic Equations' },
  logarithms: { id: 'logarithms', zh: '對數與指數', en: 'Logarithms & Exponents' },
} satisfies Record<string, TopicMeta>

const FW = {
  geometry: { id: 'geometric_intuition', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  transform: { id: 'transformation_thinking', zh: '轉化思維', en: 'Transformative Thinking', emoji: '🔄' },
} satisfies Record<string, FwMeta>

function pq(
  id: string, topic: TopicMeta, fw: FwMeta, year: number,
  content: Pair, opts: Pair[], explanation: Pair, mcHack: Pair,
): Question {
  const zh = opts.map((o) => o[0])
  if (new Set(zh).size !== zh.length) {
    throw new Error(`[math-parametric/${id}] duplicate option text: ${zh.join(' | ')}`)
  }
  return {
    id, type: 'mc', subject: 'math',
    topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
    framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
    difficulty: 'hard', year,
    content: content[0], contentEn: content[1],
    options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
    correctIndex: 0,
    explanation: explanation[0], explanationEn: explanation[1],
    mcHack: mcHack[0], mcHackEn: mcHack[1],
    marks: 2,
  }
}

// ── helpers ─────────────────────────────────────────────────────────────────
const n = (s: string): Pair => [s, s]
const deg = (x: number): Pair => n(`$${x}^\\circ$`)
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1))
const nCr = (k: number, r: number): number => (r < 0 || r > k ? 0 : fact(k) / (fact(r) * fact(k - r)))

function fracTex(num: number, den: number): string {
  if (num === 0) return '0'
  const g = gcd(Math.abs(num), Math.abs(den)) || 1
  let p = num / g, q = den / g
  if (q < 0) { p = -p; q = -q }
  return q === 1 ? `${p}` : p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`
}

// "A \pm c\sqrt{rad}"  (c omitted when 1)
const pmSurd = (A: number, c: number, rad: number): string => `${A} \\pm ${c === 1 ? '' : c}\\sqrt{${rad}}`

const Y = [2024, 2023, 2022, 2021, 2020, 2019]
const yr = (i: number) => Y[i % Y.length]

const out: Question[] = []

// ═══════════════════════════════════════════════════════════════════════════
// K1 — Tangent line to a circle (general form): complete square → d = r → solve
// ═══════════════════════════════════════════════════════════════════════════
;([[2, -1, 3, 2], [1, 2, 2, 1], [-1, 2, 2, 3], [3, 1, 2, 2], [1, -2, 3, 1], [4, 1, 2, 2], [0, 2, 3, 2], [3, -1, 2, 3], [-2, 3, 2, 1], [2, 3, 4, 1]] as const)
  .forEach(([h, k, r, m], i) => {
    const A = k - m * h, rad = m * m + 1
    const D = -2 * h, E = -2 * k, F = h * h + k * k - r * r
    const dTerm = (v: number, s: string) => (v === 0 ? '' : `${v > 0 ? ' + ' : ' - '}${Math.abs(v) === 1 ? '' : Math.abs(v)}${s}`)
    const circle = `x^2 + y^2${dTerm(D, 'x')}${dTerm(E, 'y')}${F === 0 ? '' : `${F > 0 ? ' + ' : ' - '}${Math.abs(F)}`} = 0`
    out.push(pq(`mp_k1_${i}`, T.circles, FW.geometry, yr(i),
      [`直線 $y = ${m === 1 ? '' : m}x + c$ 與圓 $C:\\ ${circle}$ 相切。求 $c$ 的值。`,
       `The line $y = ${m === 1 ? '' : m}x + c$ is tangent to the circle $C:\\ ${circle}$. Find $c$.`],
      [n(`$${pmSurd(A, r, rad)}$`), n(`$${A} \\pm ${r}$`), n(`$${pmSurd(-A, r, rad)}$`), n(`$${pmSurd(A, 1, rad)}$`)],
      [`配方求圓心半徑：$C$ 的圓心 $(${h},${k})$、半徑 $${r}$。切線 ⇔ 圓心到直線 $${m}x - y + c = 0$ 的距離 $=$ 半徑：$\\dfrac{|${m}(${h}) - (${k}) + c|}{\\sqrt{${m}^2+1}} = ${r}$ ⇒ $|c ${A >= 0 ? '+' : '-'} ${Math.abs(A)}|=${r}\\sqrt{${rad}}$ ⇒ $c = ${pmSurd(A, r, rad)}$。陷阱：$${A} \\pm ${r}$ 漏咗 $\\sqrt{${rad}}$；另一個錯了 $(${k}-${m}\\cdot${h})$ 的符號。`,
       `Complete the square: centre $(${h},${k})$, radius $${r}$. Tangent ⇔ distance from centre to $${m}x - y + c = 0$ equals $${r}$: $\\dfrac{|c ${A >= 0 ? '+' : '-'} ${Math.abs(A)}|}{\\sqrt{${rad}}} = ${r}$ ⇒ $c = ${pmSurd(A, r, rad)}$. Trap: $${A} \\pm ${r}$ drops the $\\sqrt{${rad}}$.`],
      [`一般式先配方攞圓心半徑，再用 $d=r$：$\\dfrac{|c+(${-A})|}{\\sqrt{${rad}}}=${r}$（負號小心）⇒ $c=${pmSurd(A, r, rad)}$。`,
       `Complete the square, then $d=r$ ⇒ $c=${pmSurd(A, r, rad)}$.`]))
  })

// ═══════════════════════════════════════════════════════════════════════════
// K2 — Conditional probability with PARITY casework (draw 3, sum is odd)
// ═══════════════════════════════════════════════════════════════════════════
;([[5, 4], [4, 4], [6, 3], [5, 3], [4, 5], [6, 4], [5, 2], [7, 3], [6, 2], [4, 6]] as const)
  .forEach(([O, E], i) => {
    const threeOdd = nCr(O, 3)
    const oddTwoEven = O * nCr(E, 2)
    const den = threeOdd + oddTwoEven
    out.push(pq(`mp_k2_${i}`, T.permcomb, FW.decompose, yr(i),
      [`從 $1$ 至 $${O + E}$ 中（其中 $${O}$ 個奇數、$${E}$ 個偶數）無放回抽 $3$ 個數。已知三數之和為奇數，求三數全為奇數的概率。`,
       `From ${O + E} integers (${O} odd, ${E} even), 3 are drawn without replacement. Given that their sum is odd, find the probability that all three are odd.`],
      [n(`$${fracTex(threeOdd, den)}$`), n(`$${fracTex(oddTwoEven, den)}$`), n(`$${fracTex(threeOdd, nCr(O + E, 3))}$`), n(`$${fracTex(1, 2)}$`)],
      [`三數之和為奇 ⇔ 奇數個數為奇 ⇒ 「3 奇」或「1 奇 2 偶」。3 奇 $=C^{${O}}_3=${threeOdd}$；1 奇 2 偶 $=${O}\\cdot C^{${E}}_2=${oddTwoEven}$。條件概率 $=\\dfrac{${threeOdd}}{${threeOdd}+${oddTwoEven}}=${fracTex(threeOdd, den)}$。陷阱：$${fracTex(threeOdd, nCr(O + E, 3))}$ 用咗無條件總數（漏咗「和為奇」）；$${fracTex(oddTwoEven, den)}$ 係另一個 case。`,
       `Sum odd ⇔ an odd number of odds ⇒ 3-odd or 1-odd-2-even. 3-odd $=${threeOdd}$; 1-odd-2-even $=${oddTwoEven}$. $P=\\dfrac{${threeOdd}}{${den}}=${fracTex(threeOdd, den)}$. Trap: using the unconditional total ${nCr(O + E, 3)} ignores "sum is odd".`],
      [`條件概率「縮樣本空間」：分母只數「和為奇」嗰 $${den}$ 個，分子 $${threeOdd}$ ⇒ $${fracTex(threeOdd, den)}$。`,
       `Condition shrinks the sample space to the ${den} odd-sum cases ⇒ $${fracTex(threeOdd, den)}$.`]))
  })

// ═══════════════════════════════════════════════════════════════════════════
// K3 — Roots of a quadratic: Vieta + identity (find α² + β²)
// ═══════════════════════════════════════════════════════════════════════════
;([[2, -5, 1], [1, -3, 1], [3, -4, 1], [1, -5, 6], [2, -7, 3], [1, -4, 2], [3, -5, 2], [1, -6, 4], [2, -3, 1], [1, -7, 10]] as const)
  .forEach(([a, b, c], i) => {
    const sumSq = b * b - 2 * a * c // α²+β² = (b²−2ac)/a²
    const a2 = a * a
    const eq = `${a === 1 ? '' : a}x^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0`
    out.push(pq(`mp_k3_${i}`, T.quadratic, FW.transform, yr(i),
      [`設 $\\alpha$、$\\beta$ 為方程 $${eq}$ 的兩根。求 $\\alpha^2 + \\beta^2$。`,
       `Let $\\alpha,\\beta$ be the roots of $${eq}$. Find $\\alpha^2 + \\beta^2$.`],
      [n(`$${fracTex(sumSq, a2)}$`), n(`$${fracTex(b * b, a2)}$`), n(`$${fracTex(b * b + 2 * a * c, a2)}$`), n(`$${fracTex(b * b - a * c, a2)}$`)],
      [`韋達定理：$\\alpha+\\beta=${fracTex(-b, a)}$、$\\alpha\\beta=${fracTex(c, a)}$。恆等式 $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=${fracTex(b * b, a2)}-${fracTex(2 * c, a)}=${fracTex(sumSq, a2)}$。陷阱：$${fracTex(b * b, a2)}$ 漏咗 $-2\\alpha\\beta$；$${fracTex(b * b + 2 * a * c, a2)}$ 加錯符號；$${fracTex(b * b - a * c, a2)}$ 用咗 $-\\alpha\\beta$（漏 ×2）。`,
       `Vieta: $\\alpha+\\beta=${fracTex(-b, a)}$, $\\alpha\\beta=${fracTex(c, a)}$. Identity $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=${fracTex(sumSq, a2)}$. Trap: $${fracTex(b * b, a2)}$ forgets $-2\\alpha\\beta$.`],
      [`唔好解根！$(\\alpha+\\beta)^2-2\\alpha\\beta=${fracTex(sumSq, a2)}$，韋達一步秒殺。`,
       `Don't solve the roots — $(\\alpha+\\beta)^2-2\\alpha\\beta=${fracTex(sumSq, a2)}$ via Vieta.`]))
  })

// ═══════════════════════════════════════════════════════════════════════════
// K4 — Logarithmic equation: log laws → quadratic → REJECT the invalid root
// ═══════════════════════════════════════════════════════════════════════════
;([[2, 3, 4, 2], [2, 4, 8, 2], [2, 5, 8, 4], [3, 3, 9, 3], [2, 6, 16, 4], [2, 5, 16, 2], [10, 2, 20, 5], [10, 2, 25, 4], [12, 2, 16, 9], [2, 7, 16, 8]] as const)
  .forEach(([b, k, p, q], i) => {
    const d = p - q, bk = Math.pow(b, k)
    out.push(pq(`mp_k4_${i}`, T.logarithms, FW.transform, yr(i),
      [`解方程 $\\log_{${b}} x + \\log_{${b}} (x - ${d}) = ${k}$。`,
       `Solve $\\log_{${b}} x + \\log_{${b}} (x - ${d}) = ${k}$.`],
      [n(`$x = ${p}$`), n(`$x = ${q}$`), n(`$x = ${p}$ 或 $x = ${-q}$`), n(`$x = ${bk}$`)],
      [`合併對數：$\\log_{${b}}[x(x-${d})] = ${k}$ ⇒ $x(x-${d}) = ${b}^{${k}} = ${bk}$ ⇒ $x^2 - ${d}x - ${bk} = 0$ ⇒ $(x - ${p})(x + ${q}) = 0$ ⇒ $x = ${p}$ 或 $x = ${-q}$。但 $\\log$ 要求 $x>0$ 且 $x-${d}>0$，故 **$x=${-q}$ 不合，捨去**，只取 $x = ${p}$。致命陷阱：$x=${q}$／$x=${-q}$ 正正係嗰條要捨去嘅根。`,
       `Combine logs: $x(x-${d}) = ${b}^{${k}} = ${bk}$ ⇒ $x^2-${d}x-${bk}=0$ ⇒ $(x-${p})(x+${q})=0$. Domain needs $x>0$ and $x-${d}>0$, so $x=${-q}$ is **rejected**; only $x=${p}$. Trap: the rejected root is the bait.`],
      [`對數合併後 $x(x-${d})=${bk}$，因式分解攞兩根，**用定義域 $x-${d}>0$ 捨負根** ⇒ $x=${p}$。`,
       `After combining, factor $x(x-${d})=${bk}$ and reject the root failing $x-${d}>0$ ⇒ $x=${p}$.`]))
  })

// ═══════════════════════════════════════════════════════════════════════════
// K5 — 3D: angle between a lateral EDGE and the base (find height first), to °
// ═══════════════════════════════════════════════════════════════════════════
;([[6, 9], [8, 12], [6, 10], [10, 13], [8, 10], [12, 13], [6, 8], [10, 12], [8, 15], [6, 12]] as const)
  .forEach(([side, L], i) => {
    const half = side / Math.SQRT2 // half-diagonal of the square base
    const h = Math.sqrt(L * L - half * half)
    const ans = Math.round((Math.acos(half / L) * 180) / Math.PI)
    const dFace = Math.round((Math.atan2(h, side / 2) * 180) / Math.PI) // slant FACE vs base (apothem)
    const dComp = 90 - ans
    const dSide = Math.round((Math.atan2(h, side) * 180) / Math.PI) // used full side
    out.push(pq(`mp_k5_${i}`, T.trig3d, FW.geometry, yr(i),
      [`正四棱錐底為邊長 $${side}$ 的正方形，每條側棱（頂點到底角）長 $${L}$。求側棱與底面所成的角（準至最接近的度）。`,
       `A right pyramid has a square base of side $${side}$; each slant edge (apex to a base corner) is $${L}$. Find the angle between a slant edge and the base (to the nearest degree).`],
      [deg(ans), deg(dFace), deg(dComp), deg(dSide)],
      [`底面對角線一半 $= \\dfrac{${side}\\sqrt2}{2} = ${half.toFixed(2)}$。側棱、半對角線、高成直角三角形，$\\cos\\theta = \\dfrac{${half.toFixed(2)}}{${L}}$ ⇒ $\\theta \\approx ${ans}^\\circ$。陷阱：$${dFace}^\\circ$ 求咗側面與底的二面角（用邊心距）；$${dComp}^\\circ$ 係餘角；$${dSide}^\\circ$ 誤用全底邊。`,
       `Half-diagonal $= \\dfrac{${side}\\sqrt2}{2} \\approx ${half.toFixed(2)}$. With the slant edge $${L}$, $\\cos\\theta = \\dfrac{${half.toFixed(2)}}{${L}}$ ⇒ $\\theta \\approx ${ans}^\\circ$. Traps: $${dFace}^\\circ$ is the face dihedral; $${dComp}^\\circ$ the complement; $${dSide}^\\circ$ uses the full side.`],
      [`側棱配半對角線（唔係邊心距！）：$\\cos\\theta=\\dfrac{\\text{半對角線}}{\\text{側棱}}$ ⇒ $\\theta\\approx${ans}^\\circ$。`,
       `Edge pairs with the half-diagonal (not the apothem): $\\cos\\theta=\\tfrac{\\text{half-diag}}{\\text{edge}} ⇒ ${ans}^\\circ$.`]))
  })

// ═══════════════════════════════════════════════════════════════════════════
// K6 — 4-digit number COUNT with multiple constraints (range + even), brute
// ═══════════════════════════════════════════════════════════════════════════
function countNumbers(digits: number[], pred: (num: number, ds: number[]) => boolean): number {
  let count = 0
  const used = new Array(digits.length).fill(false)
  const rec = (pos: number, cur: number[]) => {
    if (pos === 4) { if (pred(cur[0] * 1000 + cur[1] * 100 + cur[2] * 10 + cur[3], cur)) count++; return }
    for (let j = 0; j < digits.length; j++) if (!used[j]) { used[j] = true; rec(pos + 1, [...cur, digits[j]]); used[j] = false }
  }
  rec(0, [])
  return count
}
;([[6, 2000, 4000], [6, 1000, 5000], [5, 2000, 5000], [7, 2000, 6000], [6, 1000, 3000], [5, 1000, 5000], [7, 3000, 7000], [6, 2000, 6000], [5, 2000, 6000], [7, 1000, 5000]] as const)
  .forEach(([m, lo, hi], i) => {
    const digits = Array.from({ length: m }, (_, j) => j + 1)
    const inRange = (num: number) => num > lo && num < hi
    const ans = countNumbers(digits, (num, ds) => inRange(num) && ds[3] % 2 === 0)
    const ignoreEven = countNumbers(digits, (num) => inRange(num))
    const ignoreRange = countNumbers(digits, (num, ds) => ds[3] % 2 === 0)
    const total = m * (m - 1) * (m - 2) * (m - 3)
    out.push(pq(`mp_k6_${i}`, T.permcomb, FW.decompose, yr(i),
      [`用數字 $1$ 至 $${m}$（每個數字最多用一次）組成介乎 $${lo}$ 與 $${hi}$ 之間的**偶數**四位數，共有多少個？`,
       `Using the digits $1$ to $${m}$ at most once each, how many even four-digit numbers strictly between $${lo}$ and $${hi}$ can be formed?`],
      [n(`$${ans}$`), n(`$${ignoreEven}$`), n(`$${ignoreRange}$`), n(`$${total}$`)],
      [`兩個限制同時滿足，須分類討論：個位為偶數（${digits.filter((x) => x % 2 === 0).join(',')}），千位令數值落喺 $(${lo},${hi})$，再乘中間兩位的排列，且不重複。準確計數 $= ${ans}$。陷阱：$${ignoreEven}$ 漏咗「偶數」；$${ignoreRange}$ 漏咗範圍限制；$${total}$ 係完全無限制的 $P(${m},4)$。`,
       `Both constraints bite, so use casework: units digit even (${digits.filter((x) => x % 2 === 0).join(',')}), thousands digit forcing the value into $(${lo},${hi})$, then the middle two without repetition. Exact count $= ${ans}$. Traps: $${ignoreEven}$ drops "even"; $${ignoreRange}$ drops the range; $${total}$ is unrestricted $P(${m},4)$.`],
      [`分兩限制落手：先鎖個位（偶）＋千位（範圍），中間兩位自由排。切勿一次過用乘法原理而忽略重疊限制。`,
       `Pin the units (even) and thousands (range) first, then arrange the middle two — don't blanket-multiply and miss the overlap.`]))
  })

// ═══════════════════════════════════════════════════════════════════════════
// K7 — Apollonius locus: PA = 2·PB gives a CIRCLE (multi-step algebra)
// ═══════════════════════════════════════════════════════════════════════════
;([[0, 0, 6, 0], [0, 0, 0, 6], [-3, 0, 3, 0], [0, 3, 0, -3], [1, 1, 7, 1], [0, 0, 9, 0], [2, 0, 8, 0], [0, 0, 0, 9], [-1, 2, 5, 2], [0, -2, 0, 4]] as const)
  .forEach(([ax, ay, bx, by], i) => {
    // PA = 2 PB ⇒ PA² = 4 PB² ⇒ −3x²−3y² + … = 0; divide by −3 to get
    //   x² + y² + Dx + Ey + F = 0  (the Apollonius circle).
    const D = (2 * ax - 8 * bx) / 3
    const E = (2 * ay - 8 * by) / 3
    const F = (4 * (bx * bx + by * by) - ax * ax - ay * ay) / 3
    // "swapped ratio" trap: PB = 2 PA (a ↔ b) — a genuine circle, but wrong.
    const D1 = (2 * bx - 8 * ax) / 3
    const E1 = (2 * by - 8 * ay) / 3
    const F1 = (4 * (ax * ax + ay * ay) - bx * bx - by * by) / 3
    const t = (v: number, s: string) => (v === 0 ? '' : `${v > 0 ? ' + ' : ' - '}${Math.abs(v) === 1 ? '' : Math.abs(v)}${s}`)
    const eqn = (d: number, e: number, f: number) => `x^2 + y^2${t(d, 'x')}${t(e, 'y')}${f === 0 ? '' : `${f > 0 ? ' + ' : ' - '}${Math.abs(f)}`} = 0`
    out.push(pq(`mp_k7_${i}`, T.locus, FW.geometry, yr(i),
      [`動點 $P$ 與兩定點 $A(${ax},${ay})$、$B(${bx},${by})$ 滿足 $PA = 2\\,PB$。求 $P$ 的軌跡方程。`,
       `A moving point $P$ satisfies $PA = 2\\,PB$, where $A(${ax},${ay})$ and $B(${bx},${by})$. Find the equation of its locus.`],
      [n(`$${eqn(D, E, F)}$`), n(`$${eqn(D1, E1, F1)}$`), n(`$${eqn(-D, -E, -F)}$`), n(`$${eqn(D, E, F + 1)}$`)],
      [`$PA=2PB ⇒ PA^2=4PB^2$：$(x-${ax})^2+(y-${ay})^2 = 4[(x-${bx})^2+(y-${by})^2]$。展開、移項，係數的 $x^2,y^2$ 變成 $-3x^2-3y^2$，整理（除以 $-3$）得 $${eqn(D, E, F)}$ —— 一個圓（阿波羅尼斯圓）。陷阱：用 $PA=PB$（公比 $1$）會得到垂直平分線（一條直線），完全唔同。`,
       `$PA=2PB ⇒ PA^2=4PB^2$. Expanding $(x-${ax})^2+(y-${ay})^2=4[(x-${bx})^2+(y-${by})^2]$ and simplifying gives $${eqn(D, E, F)}$ — a circle (Apollonius). Trap: using $PA=PB$ gives the perpendicular bisector (a straight line), which is wrong.`],
      [`比例距離（$k\\ne1$）軌跡係圓：開 $PA^2=4PB^2$，平方項唔抵消（係數變 $3$），整理即得 $${eqn(D, E, F)}$。`,
       `A ratio distance ($k\\ne1$) gives a circle: $PA^2=4PB^2$, the squares don't cancel ⇒ $${eqn(D, E, F)}$.`]))
  })

export const mathParametricQuestions: Question[] = out
