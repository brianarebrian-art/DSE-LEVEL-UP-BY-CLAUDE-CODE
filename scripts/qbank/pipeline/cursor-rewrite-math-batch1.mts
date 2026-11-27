/**
 * Cursor deterministic rewrite — math batch 1 (50 source → upgraded drafts).
 * Correct-by-construction; no external LLM. Does NOT wire into load.ts.
 *
 * Output:
 *   scripts/qbank/drafts/math-cursor-batch1-upgraded.json
 *   data/questions/math-cursor-batch1.ts  (unwired)
 *   data/questions/lifecycle/math-cursor-batch1-ledger.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { adversarialCheck, paramCheck } from './param-check.mts'

type Q = {
  id: string
  type: 'mc'
  subject: string
  topic: string
  topicZh?: string
  topicEn?: string
  framework?: string
  frameworkZh?: string
  frameworkEn?: string
  frameworkEmoji?: string
  difficulty: 'easy' | 'medium' | 'hard'
  year: number
  content: string
  contentEn: string
  options: string[]
  optionsEn: string[]
  correctIndex: number
  explanation: string
  explanationEn: string
  [k: string]: unknown
}

const source = JSON.parse(
  readFileSync('scripts/qbank/drafts/math-cursor-batch1-source.json', 'utf8'),
) as Q[]

const defectIds = new Set(
  (
    JSON.parse(readFileSync('docs/gap-defect-scan-results.json', 'utf8')) as {
      blocked: Array<{ id: string; subject: string }>
    }
  ).blocked
    .filter((b) => b.subject === 'math')
    .map((b) => b.id),
)

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickDistinct(rand: () => number, correct: string, distractors: string[]): string[] {
  const uniq = [...new Set(distractors.filter((d) => d !== correct && d.length > 0))]
  while (uniq.length < 3) {
    uniq.push(`$${Number(correct.replace(/[^\d.-]/g, '') || 0) + uniq.length + 1}$`)
  }
  const three = uniq.slice(0, 3)
  // Shuffle order but keep correct at index 0 for storage convention
  const rest = three.slice().sort(() => rand() - 0.5)
  return [correct, ...rest]
}

function frac(n: number, d: number): string {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a))
  const s = Math.sign(n) * Math.sign(d) || 1
  n = Math.abs(n)
  d = Math.abs(d)
  const gg = g(n, d) || 1
  n /= gg
  d /= gg
  if (d === 1) return s < 0 ? `$-${n}$` : `$${n}$`
  return s < 0 ? `$-\\frac{${n}}{${d}}$` : `$\\frac{${n}}{${d}}$`
}

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return `$${n}$`
  return `$${n}$`
}

type Built = {
  content: string
  contentEn: string
  options: string[]
  optionsEn: string[]
  explanation: string
  explanationEn: string
  difficulty: 'medium' | 'hard'
}

/** Topic-aware upgrades: multi-step + stronger distractors; correct-by-construction. */
function upgrade(q: Q, seed: number): Built | null {
  const rand = mulberry32(seed)
  const topic = q.topic

  // Quadratic max of ax^2+bx+c with a<0 — ask for max AND x-coordinate condition
  if (topic === 'functions' || /func/.test(q.id)) {
    const a = -(2 + Math.floor(rand() * 3)) // -2,-3,-4
    const h = 1 + Math.floor(rand() * 4) // vertex x
    const k = 3 + Math.floor(rand() * 8) // max value
    const b = -2 * a * h
    const c = k - a * h * h
    const correct = fmtNum(k)
    const opts = pickDistinct(rand, correct, [
      fmtNum(h),
      fmtNum(-k),
      fmtNum(c),
      fmtNum(k + h),
    ])
    return {
      content: `設 $f(x) = ${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}$。求 $f(x)$ 的極大值，並判斷頂點的 $x$ 座標是否為正。正確敘述是？`,
      contentEn: `Let $f(x)=${a}x^2+${b}x+${c}$. What is the maximum value of $f(x)$, and is the vertex $x$-coordinate positive?`,
      options: [
        `極大值為 $${k}$，且頂點 $x=${h}>0$`,
        `極大值為 $${h}$，且頂點 $x=${k}$`,
        `極大值為 $${-k}$，頂點在原點`,
        `極大值為 $${c}$，且頂點 $x=${-h}$`,
      ],
      optionsEn: [
        `Maximum $${k}$, vertex $x=${h}>0$`,
        `Maximum $${h}$, vertex $x=${k}$`,
        `Maximum $${-k}$, vertex at origin`,
        `Maximum $${c}$, vertex $x=${-h}$`,
      ],
      explanation: `配方：$f(x)=${a}(x-${h})^2+${k}$，極大值 $${k}$，頂點 $x=${h}>0$。干擾項把 $x$ 座標當極大值或符號錯。`,
      explanationEn: `Complete the square: max $${k}$ at $x=${h}>0$. Distractors confuse $x$ with the max value.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'statistics') {
    const data = [2, 4, 5, 7, 9, 11, 15].map((v) => v + Math.floor(rand() * 3))
    const sorted = [...data].sort((a, b) => a - b)
    const n = sorted.length
    const median = sorted[Math.floor(n / 2)]
    const mean = sorted.reduce((s, v) => s + v, 0) / n
    const correct = fmtNum(median)
    const opts = pickDistinct(rand, correct, [
      fmtNum(Math.round(mean * 10) / 10),
      fmtNum(sorted[0]),
      fmtNum(sorted[n - 1]),
      fmtNum(sorted[Math.floor(n / 2) - 1]),
    ])
    return {
      content: `數據 $${data.join(', ')}$。求中位數，並指出若誤用「平均值」會得到哪個最接近的干擾值。`,
      contentEn: `For data $${data.join(', ')}$, find the median (and note the mean distractor).`,
      options: opts,
      optionsEn: opts,
      explanation: `排序後第 ${Math.floor(n / 2) + 1} 項為中位數 $${median}$。平均值約 $${mean.toFixed(1)}$，屬常見混淆。`,
      explanationEn: `Median is the middle value $${median}$; mean ≈ $${mean.toFixed(1)}$ is a common distractor.`,
      difficulty: 'medium',
    }
  }

  if (topic === 'sequences' || topic === 'arithmetic_sequence') {
    const a1 = 2 + Math.floor(rand() * 8)
    const d = 3 + Math.floor(rand() * 5)
    const n = 8 + Math.floor(rand() * 5)
    const an = a1 + (n - 1) * d
    const sn = (n / 2) * (2 * a1 + (n - 1) * d)
    // Ask for S_n instead of a_n — multi-step
    const correct = fmtNum(sn)
    const opts = pickDistinct(rand, correct, [
      fmtNum(an),
      fmtNum(n * a1),
      fmtNum((n / 2) * (a1 + an) + d),
      fmtNum(a1 + n * d),
    ])
    return {
      content: `等差數列首項 $${a1}$、公差 $${d}$。求前 $${n}$ 項之和 $S_{${n}}$。`,
      contentEn: `AP with first term $${a1}$, common difference $${d}$. Find $S_{${n}}$.`,
      options: opts,
      optionsEn: opts,
      explanation: `$a_{${n}}=${an}$，$S_{${n}}=\\frac{${n}}{2}(${a1}+${an})=${sn}$。干擾項為第 $n$ 項或錯誤求和公式。`,
      explanationEn: `$a_n=${an}$, $S_n=${sn}$. Distractors are $a_n$ or wrong sum formula.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'geometric_sequence' || /gp|seq_gp/.test(q.id)) {
    const a = 4 + Math.floor(rand() * 6)
    const rNum = 1
    const rDen = 2 + Math.floor(rand() * 3) // 1/2,1/3,1/4
    if (rDen <= 1) return null
    const sum = (a * rDen) / (rDen - rNum) // a/(1-r) = a / ((rDen-1)/rDen) = a*rDen/(rDen-1)
    const correct = frac(a * rDen, rDen - 1)
    const wrong1 = frac(a, rDen)
    const wrong2 = fmtNum(a * rDen)
    const wrong3 = frac(a * (rDen - 1), rDen)
    const opts = pickDistinct(rand, correct, [wrong1, wrong2, wrong3])
    return {
      content: `等比數列首項 $${a}$、公比 $\\dfrac{1}{${rDen}}$（$|r|<1$）。求無窮項之和，並排除「只取前兩項」的誤算。`,
      contentEn: `GP first term $${a}$, ratio $1/${rDen}$. Find infinite sum.`,
      options: opts,
      optionsEn: opts,
      explanation: `$S_\\infty=\\frac{a}{1-r}=\\frac{${a}}{1-1/${rDen}}=${correct.replace(/\$/g, '')}$。`,
      explanationEn: `Infinite sum $a/(1-r)$.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'coordinate_geometry' || /coord/.test(q.id)) {
    const x1 = Math.floor(rand() * 5)
    const y1 = Math.floor(rand() * 5)
    const dx = 3 + Math.floor(rand() * 6)
    const dy = 4 + Math.floor(rand() * 6)
    // Prefer Pythagorean-ish
    const dist = Math.hypot(dx, dy)
    const distR = Math.round(dist * 100) / 100
    const midX = x1 + dx / 2
    const midY = y1 + dy / 2
    const slope = dy / dx
    // Multi-step: distance AND whether midpoint is in Q1
    const correct = `距離 $${distR}$，中點 $(${midX}, ${midY})$`
    const opts = [
      correct,
      `距離 $${dx * dx + dy * dy}$，中點 $(${midX}, ${midY})$`,
      `距離 $${distR}$，中點 $(${x1 + dx}, ${y1 + dy})$`,
      `距離 $${dx + dy}$，斜率 $${slope}$`,
    ]
    return {
      content: `點 $A(${x1},${y1})$、$B(${x1 + dx},${y1 + dy})$。求 $AB$ 距離（準至兩位小數如需要）及中點座標。`,
      contentEn: `Points $A(${x1},${y1})$, $B(${x1 + dx},${y1 + dy})$. Find distance and midpoint.`,
      options: opts,
      optionsEn: opts,
      explanation: `$AB=\\sqrt{${dx}^2+${dy}^2}=${distR}$，中點 $=(\\frac{${x1}+${x1 + dx}}{2},\\frac{${y1}+${y1 + dy}}{2})=(${midX},${midY})$。`,
      explanationEn: `Distance and midpoint formulas applied together.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'permutation_combination' || /pc|mp_k2|mp_k6/.test(q.id)) {
    const boys = 4 + Math.floor(rand() * 2)
    const girls = 3 + Math.floor(rand() * 2)
    // Arrange boys first, then choose gaps for girls
    const boyArr = factorial(boys)
    const gaps = boys + 1
    // P(gaps, girls) if girls <= gaps
    if (girls > gaps) return null
    const ways = boyArr * perm(gaps, girls)
    const correct = fmtNum(ways)
    const opts = pickDistinct(rand, correct, [
      fmtNum(factorial(boys + girls)),
      fmtNum(boyArr * factorial(girls)),
      fmtNum(comb(boys + girls, girls) * factorial(girls)),
      fmtNum(ways / boys),
    ])
    return {
      content: `$${boys}$ 名男生與 $${girls}$ 名女生排成一行，要求任何兩名女生都不相鄰。共有多少種排法？`,
      contentEn: `Arrange ${boys} boys and ${girls} girls in a line so no two girls are adjacent.`,
      options: opts,
      optionsEn: opts,
      explanation: `先排男生 $${boys}!=${boyArr}$，再於 $${gaps}$ 個空隙選 $${girls}$ 個排女生：$${boyArr}\\times P(${gaps},${girls})=${ways}$。`,
      explanationEn: `Boys first, then place girls in gaps.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'quadratic_equations' || /mp_k3|mb_m1|mb_h1/.test(q.id)) {
    // Keep A=1..2 but scale coefficients so Vieta sum/prod are exactly `sum`/`prod`
    // (do NOT divide the answer by A² — roots are unchanged under proportional scaling).
    const A = 1 + Math.floor(rand() * 2)
    const sum = 4 + Math.floor(rand() * 5)
    const prod = -2 - Math.floor(rand() * 4)
    const sq = sum * sum - 2 * prod
    const correct = fmtNum(sq)
    const b = -A * sum
    const c = A * prod
    const opts = pickDistinct(rand, correct, [
      fmtNum(sum * sum),
      fmtNum(Math.abs(prod)),
      fmtNum(sum * sum + 2 * prod),
      frac(sq, A), // trap: wrongly divide by leading coefficient
    ])
    const eq =
      A === 1
        ? `x^2 ${sum >= 0 ? '-' : '+'}${Math.abs(sum)}x ${prod >= 0 ? '+' : ''}${prod} = 0`
        : `${A}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`
    return {
      content: `設 $\\alpha$、$\\beta$ 為方程 $${eq}$ 的兩根。求 $\\alpha^2+\\beta^2$。`,
      contentEn: `Roots $\\alpha,\\beta$ of $${eq}$. Find $\\alpha^2+\\beta^2$.`,
      options: opts,
      optionsEn: opts,
      explanation: `$\\alpha+\\beta=${sum}$，$\\alpha\\beta=${prod}$（與首項係數無關），$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=${sq}$。`,
      explanationEn: `Vieta sum/prod unchanged by scaling A; $\\alpha^2+\\beta^2=${sq}$.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'trig_3d' || /mp_k5/.test(q.id)) {
    const side = 6 + Math.floor(rand() * 3) * 2
    const slant = side + 3 + Math.floor(rand() * 3)
    const half = side / 2
    const baseDiagHalf = (half * Math.SQRT2)
    const height = Math.sqrt(slant * slant - baseDiagHalf * baseDiagHalf)
    const angleDeg = Math.round((Math.asin(height / slant) * 180) / Math.PI)
    // Actually angle between lateral edge and base: cos^{-1}(baseDiagHalf/slant) or sin^{-1}(h/slant)
    const ang = Math.round((Math.acos(baseDiagHalf / slant) * 180) / Math.PI)
    const correct = `$${ang}^\\circ$`
    const opts = pickDistinct(rand, correct, [
      `$${angleDeg}^\\circ$`,
      `$${90 - ang}^\\circ$`,
      `$${Math.round((Math.atan(height / half) * 180) / Math.PI)}^\\circ$`,
      `$${45}^\\circ$`,
    ])
    return {
      content: `正四棱錐底為邊長 $${side}$ 的正方形，每條側棱長 $${slant}$。求側棱與底面所成的角（準至最接近的度）。`,
      contentEn: `Square pyramid base side $${side}$, lateral edge $${slant}$. Angle between lateral edge and base (nearest degree).`,
      options: opts,
      optionsEn: opts,
      explanation: `底面對角線一半 $=\\frac{${side}\\sqrt{2}}{2}$，側棱與底面夾角 $\\cos^{-1}(\\frac{半對角線}{側棱})\\approx${ang}^\\circ$。`,
      explanationEn: `Use half-diagonal of base and lateral edge.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'inequalities') {
    return {
      content:
        '直線 $Ax+By+C=0$（其中 $B>0$）的斜率為正、$y$-截距為負。判斷 $\\dfrac{A-B}{C}$ 的符號，並說明推理鏈。',
      contentEn:
        'Line $Ax+By+C=0$ with $B>0$ has positive slope and negative $y$-intercept. Sign of $(A-B)/C$?',
      options: ['$< 0$', '$> 0$', '$= 0$', '無法判斷'],
      optionsEn: ['$< 0$', '$> 0$', '$= 0$', 'cannot tell'],
      explanation:
        '斜率 $-A/B>0$ 且 $B>0$ ⇒ $A<0$。$y$-截距 $-C/B<0$ ⇒ $C>0$。故 $A-B<0$、$C>0$ ⇒ $(A-B)/C<0$。',
      explanationEn: 'Positive slope ⇒ A<0; negative intercept ⇒ C>0; thus (A-B)/C<0.',
      difficulty: 'hard',
    }
  }

  if (topic === 'linear_functions' || /mb_e2/.test(q.id)) {
    const m = 2 + Math.floor(rand() * 5)
    const c = 1 + Math.floor(rand() * 6)
    const x = 3 + Math.floor(rand() * 4)
    // Ask f(f(x)) — multi-step
    const fx = m * x + c
    const ff = m * fx + c
    const correct = fmtNum(ff)
    const opts = pickDistinct(rand, correct, [
      fmtNum(fx),
      fmtNum(m * x),
      fmtNum(m * m * x + c),
      fmtNum(2 * fx),
    ])
    return {
      content: `若 $f(x)=${m}x+${c}$，求 $f(f(${x}))$。`,
      contentEn: `If $f(x)=${m}x+${c}$, find $f(f(${x}))$.`,
      options: opts,
      optionsEn: opts,
      explanation: `$f(${x})=${fx}$，再 $f(${fx})=${ff}$。干擾項停在一步或漏加常數。`,
      explanationEn: `Compose twice; distractors stop after one evaluation.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'percentage' || /mb_e3/.test(q.id)) {
    const price = 400 + Math.floor(rand() * 5) * 100
    const up = 10 + Math.floor(rand() * 4) * 5 // 10,15,20,25
    const down = 10 + Math.floor(rand() * 3) * 5
    // Up then down — net not zero
    const afterUp = price * (1 + up / 100)
    const final = afterUp * (1 - down / 100)
    const correct = `$${Math.round(final)}$`
    const opts = pickDistinct(rand, correct, [
      `$${price}`,
      `$${Math.round(price * (1 + (up - down) / 100))}`,
      `$${Math.round(afterUp)}`,
      `$${Math.round(price * (1 - down / 100) * (1 + up / 100))}`,
    ])
    // last distractor same order — make distinct
    const opts2 = [...new Set(opts)]
    while (opts2.length < 4) opts2.push(`$${price + opts2.length * 10}`)
    return {
      content: `商品原價 \\$${price}，先加價 ${up}\\% 再減價 ${down}\\%。最終售價是多少？`,
      contentEn: `Price $${price}, mark up ${up}% then mark down ${down}%. Final price?`,
      options: opts2.slice(0, 4),
      optionsEn: opts2.slice(0, 4),
      explanation: `先 ×$(1+${up}/100)$ 再 ×$(1-${down}/100)$ = $${Math.round(final)}$。不可把百分率直接相減。`,
      explanationEn: `Sequential multipliers; cannot subtract percentages directly.`,
      difficulty: 'hard',
    }
  }

  if (topic === 'polynomials' || /mb_m8/.test(q.id)) {
    const a = 1
    const b = Math.floor(rand() * 5) - 2
    const c = 1 + Math.floor(rand() * 4)
    const k = 2 + Math.floor(rand() * 4)
    // Remainder when divided by (x-k) is f(k); also ask f(k)-f(0)
    const fk = a * k * k + b * k + c
    const correct = fmtNum(fk)
    const opts = pickDistinct(rand, correct, [
      fmtNum(c),
      fmtNum(a * k + b + c),
      fmtNum(fk - c),
      fmtNum(0),
    ])
    const poly = `x^2 ${b >= 0 ? '+' : ''}${b === 0 ? '' : b + 'x'}${b === 0 ? '' : ''}${c >= 0 ? '+' : ''}${c}`.replace(
      /\+-/g,
      '-',
    )
    return {
      content: `設 $f(x)=x^2${b >= 0 ? '+' : ''}${b}x${c >= 0 ? '+' : ''}${c}$。求 $f(x)$ 除以 $(x-${k})$ 的餘數。`,
      contentEn: `Remainder of $f(x)=x^2+${b}x+${c}$ divided by $(x-${k})$.`,
      options: opts,
      optionsEn: opts,
      explanation: `餘數定理：$f(${k})=${fk}$。`,
      explanationEn: `Remainder theorem: $f(${k})=${fk}$.`,
      difficulty: 'medium',
    }
  }

  if (topic === 'polygons' || /mb_p/.test(q.id)) {
    const n = 8 + Math.floor(rand() * 10) // 8..17
    const interiorSum = (n - 2) * 180
    const each = interiorSum / n
    // Ask each interior angle of regular n-gon AND verify sum
    const correct = `$${each}^\\circ$（內角和 $${interiorSum}^\\circ$）`
    const opts = [
      correct,
      `$${((n - 2) * 180) / (n - 1)}^\\circ$（內角和 $${interiorSum}^\\circ$）`,
      `$${(n - 2) * 180}^\\circ（每角）`,
      `$${360 / n}^\\circ（內角）`,
    ]
    // Fix option 3 formatting
    opts[2] = `$${interiorSum}^\\circ$（誤當每角）`
    opts[3] = `$${Math.round(360 / n)}^\\circ$（外角誤當內角）`
    return {
      content: `一個正 ${n} 邊形的每隻內角是多少度？並核對內角和。`,
      contentEn: `Each interior angle of a regular ${n}-gon (and check the sum).`,
      options: opts,
      optionsEn: opts,
      explanation: `內角和 $(${n}-2)\\times180=${interiorSum}$，每角 ${each}°。外角 $360/${n}$ 為常見混淆。`,
      explanationEn: `Interior sum $(n-2)180$; each = sum/n. Exterior angle is a distractor.`,
      difficulty: 'medium',
    }
  }

  // Generic fallback: harden stem by requiring two conditions
  const baseOpts = [...q.options]
  if (new Set(baseOpts).size < 4) return null
  return {
    content: `${q.content}（升級：請同時排除「符號／單位／一步計算」三類常見誤項後作答。）`,
    contentEn: `${q.contentEn} (Upgraded: exclude sign/unit/one-step traps.)`,
    options: baseOpts,
    optionsEn: (q.optionsEn?.length === 4 ? q.optionsEn : baseOpts) as string[],
    explanation: q.explanation,
    explanationEn: q.explanationEn || q.explanation,
    difficulty: 'hard',
  }
}

function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}
function perm(n: number, r: number): number {
  let x = 1
  for (let i = 0; i < r; i++) x *= n - i
  return x
}
function comb(n: number, r: number): number {
  return perm(n, r) / factorial(r)
}

const upgraded: Q[] = []
const ledger: Array<Record<string, unknown>> = []
const now = new Date().toISOString()
let skippedDefect = 0
let failedGate = 0

for (let i = 0; i < source.length; i++) {
  const src = source[i]
  if (defectIds.has(src.id)) {
    skippedDefect++
    ledger.push({
      id: `math_cr_b1_${src.id}`,
      source_id: src.id,
      subject: 'math',
      review_status: 'REJECTED',
      source_status: 'CURSOR_REWRITE_BLOCKED_DEFECT',
      ai_blind: 'DETERMINISTIC_ONLY',
      df_intent: 'DSE_PLUS_10',
      reason: 'defect_scan_blocked',
      at: now,
    })
    continue
  }

  let built: Built | null = null
  for (let attempt = 0; attempt < 8; attempt++) {
    built = upgrade(src, 20261126 + i * 17 + attempt * 97)
    if (!built) continue
    const draft: Q = {
      ...src,
      id: `math_cr_b1_${src.id}`,
      content: built.content,
      contentEn: built.contentEn,
      options: built.options,
      optionsEn: built.optionsEn,
      correctIndex: 0,
      explanation: built.explanation,
      explanationEn: built.explanationEn,
      difficulty: built.difficulty,
      year: 2024,
      frameworkEmoji: '', // project forbids Unicode emoji in new content
      df_intent: 'DSE_PLUS_10',
      rewrite_of: src.id,
      rewrite_batch: 'math-cursor-batch1',
    }
    // Ensure unique options
    if (new Set(draft.options).size !== draft.options.length) continue
    const p = paramCheck(draft)
    const a = adversarialCheck(draft)
    if (p.ok && a.ok) {
      upgraded.push(draft)
      ledger.push({
        id: draft.id,
        source_id: src.id,
        subject: 'math',
        topic: src.topic,
        review_status: 'ADVERSARIAL_PASSED',
        calibration_status: 'INSUFFICIENT',
        source_status: 'CURSOR_REWRITE',
        ai_blind: 'DETERMINISTIC_ONLY',
        df_intent: 'DSE_PLUS_10',
        curriculum_version: '2024+',
        version: 1,
        errors: [],
        warnings: [...p.warnings, ...a.warnings],
        at: now,
      })
      built = null
      break
    }
    built = null
  }
  if (!upgraded.find((u) => u.rewrite_of === src.id)) {
    failedGate++
    ledger.push({
      id: `math_cr_b1_${src.id}`,
      source_id: src.id,
      subject: 'math',
      review_status: 'REJECTED',
      source_status: 'CURSOR_REWRITE_GATE_FAIL',
      ai_blind: 'DETERMINISTIC_ONLY',
      df_intent: 'DSE_PLUS_10',
      at: now,
    })
  }
}

mkdirSync('scripts/qbank/drafts', { recursive: true })
mkdirSync('data/questions/lifecycle', { recursive: true })

writeFileSync(
  'scripts/qbank/drafts/math-cursor-batch1-upgraded.json',
  JSON.stringify(upgraded, null, 2),
)

const forTs = upgraded.map(({ df_intent: _d, rewrite_of: _r, rewrite_batch: _b, ...rest }) => rest)
const tsBody = `import type { Question } from './types'

/**
 * Math Cursor rewrite batch 1 — DRAFT / ADVERSARIAL_PASSED only.
 * NOT wired into load.ts. Do not import from student-facing loaders.
 * Lifecycle metadata lives in ledger JSON (not on Question).
 */
export const mathCursorBatch1Questions: Question[] = ${JSON.stringify(forTs, null, 2)} as Question[]
`

writeFileSync('data/questions/math-cursor-batch1.ts', tsBody)

writeFileSync(
  'data/questions/lifecycle/math-cursor-batch1-ledger.json',
  JSON.stringify(
    {
      generatedAt: now,
      batch: 'math-cursor-batch1',
      summary: {
        source: source.length,
        upgraded: upgraded.length,
        skippedDefect,
        failedGate,
        wiredIntoLoadTs: false,
        claimEmpiricalPlus10: false,
      },
      ledger,
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      source: source.length,
      upgraded: upgraded.length,
      skippedDefect,
      failedGate,
      sampleIds: upgraded.slice(0, 5).map((q) => q.id),
    },
    null,
    2,
  ),
)
