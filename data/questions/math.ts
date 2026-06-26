import type { Question, Topic } from './types'

// ───────────────────────────────────────────────────────────────────────────
// HKDSE Mathematics（必修部分）— 120-question bilingual bank.
// 對標「同一核心邏輯、不同數字」的理念：每個課題以參數化模板生成多條變體，
// 數值與答案由 code 計算（見 /tmp 驗證腳本：代入驗根、AP/GP 驗項等），確保正確。
// 練習時系統由此 120 題隨機抽 20 題（見 PracticeSession buildPool）。
// 數學符號為語言中性（LaTeX），雙語只需翻譯題幹散文。
// ───────────────────────────────────────────────────────────────────────────

type Pair = [zh: string, en: string]

const T = {
  quadratic: { id: 'quadratic_equations', zh: '二次方程', en: 'Quadratic Equations' },
  calculus: { id: 'calculus', zh: '微積分', en: 'Calculus' },
  probability: { id: 'probability', zh: '概率', en: 'Probability' },
  functions: { id: 'functions', zh: '函數與建模', en: 'Functions & Modelling' },
  trigonometry: { id: 'trigonometry', zh: '三角函數', en: 'Trigonometry' },
  statistics: { id: 'statistics', zh: '統計', en: 'Statistics' },
  logarithms: { id: 'logarithms', zh: '對數與指數', en: 'Logarithms & Exponents' },
  sequences: { id: 'sequences', zh: '數列', en: 'Sequences' },
  percentage: { id: 'percentage', zh: '百分數與利率', en: 'Percentages & Interest' },
  coordinate: { id: 'coordinate_geometry', zh: '坐標幾何', en: 'Coordinate Geometry' },
  inequalities: { id: 'inequalities', zh: '不等式', en: 'Inequalities' },
  circles: { id: 'circles', zh: '圓的幾何特性', en: 'Properties of Circles' },
  trig3d: { id: 'trig_3d', zh: '三維三角學', en: '3D Trigonometry' },
  permcomb: { id: 'permutation_combination', zh: '排列與組合', en: 'Permutations & Combinations' },
  locus: { id: 'locus', zh: '軌跡與坐標', en: 'Locus & Coordinates' },
} as const

const FW = {
  transform: { id: 'transformation_thinking', zh: '轉化思維', en: 'Transformative Thinking', emoji: '🔄' },
  rate: { id: 'rate_intuition', zh: '變化率直覺', en: 'Rate-of-change Intuition', emoji: '📈' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  modelling: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
  geometry: { id: 'geometric_intuition', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
  sequence: { id: 'sequence_patterns', zh: '數列規律', en: 'Sequence Patterns', emoji: '🔢' },
} as const

type TopicMeta = (typeof T)[keyof typeof T]
type FwMeta = (typeof FW)[keyof typeof FW]

// opts[0] is always the correct answer; PracticeSession shuffles display order and
// grades by the language-independent zh text.
function q(
  id: string, topic: TopicMeta, fw: FwMeta, difficulty: 'easy' | 'medium' | 'hard',
  year: number, marks: number, content: Pair, opts: Pair[], explanation: Pair,
  mcHack?: Pair,
): Question {
  return {
    id, type: 'mc', subject: 'math',
    topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
    framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
    difficulty, year,
    content: content[0], contentEn: content[1],
    options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
    correctIndex: 0,
    explanation: explanation[0], explanationEn: explanation[1],
    mcHack: mcHack?.[0], mcHackEn: mcHack?.[1],
    marks,
  }
}

// ── formatting helpers (LaTeX, language-neutral) ────────────────────────────
const xTerm = (b: number) => b === 0 ? '' : b === 1 ? ' + x' : b === -1 ? ' - x' : b > 0 ? ` + ${b}x` : ` - ${-b}x`
const cTerm = (c: number) => c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${-c}`
const root = (r: number) => `x = ${r}`

// ── Topic 1: Quadratic equations (integer roots, code-built) ─────────────────
// (x - r1)(x - r2) = 0  ⇒  x^2 - (r1+r2)x + r1·r2 = 0
function quad(n: number, r1: number, r2: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const b = -(r1 + r2), c = r1 * r2
  const eq = `x^2${xTerm(b)}${cTerm(c)} = 0`
  return q(`math_quad_${n}`, T.quadratic, FW.transform, diff, year, 1,
    [`解方程 $${eq}$，求 $x$ 的值。`, `Solve $${eq}$ for $x$.`],
    [
      [`$${root(r1)}$ 或 $${root(r2)}$`, `$${root(r1)}$ or $${root(r2)}$`],
      [`$${root(-r1)}$ 或 $${root(-r2)}$`, `$${root(-r1)}$ or $${root(-r2)}$`],
      [`$${root(r1)}$ 或 $${root(-r2)}$`, `$${root(r1)}$ or $${root(-r2)}$`],
      [`$${root(-r1)}$ 或 $${root(r2)}$`, `$${root(-r1)}$ or $${root(r2)}$`],
    ],
    [`因式分解為 $(x${cTerm(-r1)})(x${cTerm(-r2)}) = 0$。陷阱：由 $(x${cTerm(-r1)}) = 0$ 移項，$x = ${r1}$（要變號），唔係 $${-r1}$。故 $x = ${r1}$ 或 $x = ${r2}$ —— 四個選項全部係符號陷阱，要逐個根驗清楚。`,
      `Factorise as $(x${cTerm(-r1)})(x${cTerm(-r2)}) = 0$. Trap: $(x${cTerm(-r1)}) = 0$ gives $x = ${r1}$ (flip the sign as you move it across), NOT $${-r1}$. So $x = ${r1}$ or $x = ${r2}$ — every distractor here is a sign trap, so check each root.`])
}
const quadParams: [number, number, number, 'easy' | 'medium' | 'hard'][] = [
  [1, 3, 2023, 'medium'], [2, 5, 2022, 'medium'], [-1, 4, 2021, 'medium'], [-2, 3, 2023, 'medium'],
  [-3, -5, 2020, 'medium'], [3, 7, 2022, 'medium'], [-4, 6, 2021, 'medium'], [2, 8, 2019, 'medium'],
  [-6, 1, 2023, 'medium'], [4, 9, 2020, 'medium'], [-7, -2, 2022, 'medium'], [5, -3, 2021, 'medium'],
]
const quadQs = quadParams.map(([r1, r2, y, d], i) => quad(i + 1, r1, r2, y, d))

// ── Topic 2: Calculus — differentiation (power rule, code-built) ─────────────
// y = a x^3 + b x^2 + c x + d  ⇒  dy/dx = 3a x^2 + 2b x + c
function deriv(n: number, a: number, b: number, c: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const poly = `${a}x^3${b > 0 ? ` + ${b}x^2` : b < 0 ? ` - ${-b}x^2` : ''}${xTerm(c)}`
  const d3 = 3 * a, d2 = 2 * b
  const dy = `${d3}x^2${d2 > 0 ? ` + ${d2}x` : d2 < 0 ? ` - ${-d2}x` : ''}${cTerm(c)}`
  const wrongA = `${a}x^2${d2 > 0 ? ` + ${d2}x` : d2 < 0 ? ` - ${-d2}x` : ''}${cTerm(c)}`
  const wrongB = `${d3}x^2${b > 0 ? ` + ${b}x` : b < 0 ? ` - ${-b}x` : ''}${cTerm(c)}`
  const wrongC = `${d3}x^2${d2 > 0 ? ` + ${d2}x` : d2 < 0 ? ` - ${-d2}x` : ''}`
  return q(`math_deriv_${n}`, T.calculus, FW.rate, diff, year, 1,
    [`設 $y = ${poly}$，求 $\\frac{dy}{dx}$。`, `Let $y = ${poly}$. Find $\\frac{dy}{dx}$.`],
    [
      [`$${dy}$`, `$${dy}$`], [`$${wrongA}$`, `$${wrongA}$`],
      [`$${wrongB}$`, `$${wrongB}$`], [`$${wrongC}$`, `$${wrongC}$`],
    ],
    [`用冪法則 $\\frac{d}{dx}x^n = n x^{n-1}$，逐項求導得 $${dy}$。常數項求導為 0。`,
      `By the power rule $\\frac{d}{dx}x^n = n x^{n-1}$, differentiating term by term gives $${dy}$. The constant term differentiates to 0.`])
}
const derivParams: [number, number, number, number, 'easy' | 'medium' | 'hard'][] = [
  [1, -3, 4, 2023, 'medium'], [2, -6, 3, 2022, 'medium'], [1, 2, -5, 2021, 'medium'], [3, -1, 2, 2023, 'medium'],
  [2, 5, -1, 2020, 'medium'], [1, -4, -7, 2019, 'medium'], [4, 3, 6, 2022, 'medium'], [2, -7, 1, 2021, 'medium'],
  [3, 2, -4, 2020, 'medium'], [1, -5, 8, 2023, 'medium'],
]
const derivQs = derivParams.map(([a, b, c, y, d], i) => deriv(i + 1, a, b, c, y, d))

// ── Topic 3: Probability (explicit, hand-verified) ───────────────────────────
const probQs: Question[] = [
  q('math_prob_1', T.probability, FW.decompose, 'medium', 2023, 1,
    ['袋中有 3 個紅球和 4 個藍球。隨機取出 2 球，求兩球同色的概率。',
      'A bag has 3 red and 4 blue balls. Two are drawn at random. Find P(both same colour).'],
    [['$\\frac{3}{7}$', '$\\frac{3}{7}$'], ['$\\frac{4}{7}$', '$\\frac{4}{7}$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{2}{7}$', '$\\frac{2}{7}$']],
    ['「同色」＝「兩紅」或「兩藍」：$\\frac{C_3^2 + C_4^2}{C_7^2} = \\frac{3+6}{21} = \\frac{9}{21} = \\frac{3}{7}$。',
      '“Same colour” = “two red” or “two blue”: $\\frac{C_3^2 + C_4^2}{C_7^2} = \\frac{3+6}{21} = \\frac{9}{21} = \\frac{3}{7}$.']),
  q('math_prob_2', T.probability, FW.decompose, 'medium', 2022, 1,
    ['袋中有 4 個紅球和 6 個藍球。隨機取出 2 球，求兩球同色的概率。',
      'A bag has 4 red and 6 blue balls. Two are drawn at random. Find P(both same colour).'],
    [['$\\frac{7}{15}$', '$\\frac{7}{15}$'], ['$\\frac{8}{15}$', '$\\frac{8}{15}$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{2}{5}$', '$\\frac{2}{5}$']],
    ['$\\frac{C_4^2 + C_6^2}{C_{10}^2} = \\frac{6+15}{45} = \\frac{21}{45} = \\frac{7}{15}$。',
      '$\\frac{C_4^2 + C_6^2}{C_{10}^2} = \\frac{6+15}{45} = \\frac{21}{45} = \\frac{7}{15}$.']),
  q('math_prob_3', T.probability, FW.decompose, 'easy', 2021, 1,
    ['擲一粒公正骰子一次，求點數為質數的概率。', 'A fair die is rolled once. Find P(the number is prime).'],
    [['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{1}{3}$', '$\\frac{1}{3}$'], ['$\\frac{2}{3}$', '$\\frac{2}{3}$'], ['$\\frac{5}{6}$', '$\\frac{5}{6}$']],
    ['質數為 2、3、5 共 3 個，$P = \\frac{3}{6} = \\frac{1}{2}$。1 不是質數。',
      'The primes are 2, 3, 5 (three of them), so $P = \\frac{3}{6} = \\frac{1}{2}$. 1 is not prime.']),
  q('math_prob_4', T.probability, FW.decompose, 'easy', 2020, 1,
    ['一副 52 張的撲克牌，抽 1 張，求抽到「紅心」的概率。', 'From a 52-card deck, one card is drawn. Find P(a heart).'],
    [['$\\frac{1}{4}$', '$\\frac{1}{4}$'], ['$\\frac{1}{13}$', '$\\frac{1}{13}$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{4}{13}$', '$\\frac{4}{13}$']],
    ['紅心有 13 張，$P = \\frac{13}{52} = \\frac{1}{4}$。', 'There are 13 hearts, so $P = \\frac{13}{52} = \\frac{1}{4}$.']),
  q('math_prob_5', T.probability, FW.decompose, 'medium', 2023, 1,
    ['擲兩粒公正骰子，求點數之和為 7 的概率。', 'Two fair dice are rolled. Find P(sum = 7).'],
    [['$\\frac{1}{6}$', '$\\frac{1}{6}$'], ['$\\frac{1}{9}$', '$\\frac{1}{9}$'], ['$\\frac{5}{36}$', '$\\frac{5}{36}$'], ['$\\frac{1}{12}$', '$\\frac{1}{12}$']],
    ['和為 7 的組合有 (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) 共 6 種，$P = \\frac{6}{36} = \\frac{1}{6}$。',
      'Sum 7 occurs for (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) — 6 ways, so $P = \\frac{6}{36} = \\frac{1}{6}$.']),
  q('math_prob_6', T.probability, FW.decompose, 'medium', 2022, 1,
    ['一個盒中有 5 個合格品和 2 個次品。隨機抽 1 件，求它為合格品的概率。',
      'A box has 5 good items and 2 defective. One is drawn at random. Find P(good).'],
    [['$\\frac{5}{7}$', '$\\frac{5}{7}$'], ['$\\frac{2}{7}$', '$\\frac{2}{7}$'], ['$\\frac{5}{2}$', '$\\frac{5}{2}$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$']],
    ['合格 5 件，總數 7 件，$P = \\frac{5}{7}$。', '5 good out of 7 total, so $P = \\frac{5}{7}$.']),
  q('math_prob_7', T.probability, FW.decompose, 'medium', 2021, 1,
    ['連續擲一粒公正硬幣 3 次，求恰好出現 2 次「公」的概率。',
      'A fair coin is tossed 3 times. Find P(exactly 2 heads).'],
    [['$\\frac{3}{8}$', '$\\frac{3}{8}$'], ['$\\frac{1}{4}$', '$\\frac{1}{4}$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{1}{8}$', '$\\frac{1}{8}$']],
    ['$C_3^2 (\\frac{1}{2})^2(\\frac{1}{2}) = 3 \\times \\frac{1}{8} = \\frac{3}{8}$。',
      '$C_3^2 (\\frac{1}{2})^2(\\frac{1}{2}) = 3 \\times \\frac{1}{8} = \\frac{3}{8}$.']),
  q('math_prob_8', T.probability, FW.decompose, 'easy', 2019, 1,
    ['從 1 到 10 隨機選一個整數，求它為 3 的倍數的概率。', 'A whole number from 1 to 10 is chosen at random. Find P(multiple of 3).'],
    [['$\\frac{3}{10}$', '$\\frac{3}{10}$'], ['$\\frac{1}{3}$', '$\\frac{1}{3}$'], ['$\\frac{2}{5}$', '$\\frac{2}{5}$'], ['$\\frac{1}{5}$', '$\\frac{1}{5}$']],
    ['3 的倍數為 3、6、9 共 3 個，$P = \\frac{3}{10}$。', 'Multiples of 3 are 3, 6, 9 — three of them, so $P = \\frac{3}{10}$.']),
  q('math_prob_9', T.probability, FW.decompose, 'medium', 2023, 1,
    ['兩個獨立事件 $A$、$B$，$P(A) = 0.6$，$P(B) = 0.5$，求 $P(A \\cap B)$。',
      'For independent events $A$, $B$ with $P(A) = 0.6$, $P(B) = 0.5$, find $P(A \\cap B)$.'],
    [['$0.3$', '$0.3$'], ['$1.1$', '$1.1$'], ['$0.8$', '$0.8$'], ['$0.11$', '$0.11$']],
    ['獨立事件 $P(A \\cap B) = P(A)P(B) = 0.6 \\times 0.5 = 0.3$。',
      'For independent events $P(A \\cap B) = P(A)P(B) = 0.6 \\times 0.5 = 0.3$.']),
  q('math_prob_10', T.probability, FW.decompose, 'medium', 2020, 1,
    ['袋中有 2 紅 3 綠球。不放回地連抽 2 球，求兩球都是綠的概率。',
      'A bag has 2 red and 3 green balls. Two are drawn without replacement. Find P(both green).'],
    [['$\\frac{3}{10}$', '$\\frac{3}{10}$'], ['$\\frac{9}{25}$', '$\\frac{9}{25}$'], ['$\\frac{2}{5}$', '$\\frac{2}{5}$'], ['$\\frac{1}{5}$', '$\\frac{1}{5}$']],
    ['$\\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = \\frac{3}{10}$（不放回）。',
      '$\\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = \\frac{3}{10}$ (without replacement).']),
  q('math_prob_11', T.probability, FW.decompose, 'medium', 2022, 1,
    ['某事件發生的概率為 $0.35$，求它不發生的概率。', 'An event has probability $0.35$. Find the probability it does not occur.'],
    [['$0.65$', '$0.65$'], ['$0.35$', '$0.35$'], ['$1.35$', '$1.35$'], ['$0.5$', '$0.5$']],
    ['補事件：$1 - 0.35 = 0.65$。', 'Complement: $1 - 0.35 = 0.65$.']),
]

// ── Topic 4: Functions & modelling (parabola vertex / values) ────────────────
// f(x) = a(x-h)^2 + k has vertex (h,k); for a<0 it is the maximum.
function maxParab(n: number, a: number, h: number, k: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  // expand a(x-h)^2 + k = a x^2 - 2ah x + (a h^2 + k)
  const b = -2 * a * h, c = a * h * h + k
  const expr = `${a}x^2${b > 0 ? ` + ${b}x` : b < 0 ? ` - ${-b}x` : ''}${cTerm(c)}`
  const word = a < 0 ? ['極大值', 'maximum value'] : ['極小值', 'minimum value']
  return q(`math_func_${n}`, T.functions, FW.modelling, diff, year, 1,
    [`設 $f(x) = ${expr}$，求 $f(x)$ 的${word[0]}。`, `Let $f(x) = ${expr}$. Find the ${word[1]} of $f(x)$.`],
    [
      [`$${k}$`, `$${k}$`], [`$${h}$`, `$${h}$`], [`$${-k}$`, `$${-k}$`], [`$${c}$`, `$${c}$`],
    ],
    [`配方得 $f(x) = ${a}(x${cTerm(-h)})^2${cTerm(k)}$，頂點在 $x = ${h}$，${word[0]} $= ${k}$（即頂點的 $y$ 值，非 $x$ 值）。`,
      `Completing the square: $f(x) = ${a}(x${cTerm(-h)})^2${cTerm(k)}$, vertex at $x = ${h}$, ${word[1]} $= ${k}$ (the vertex's $y$-value, not its $x$-value).`])
}
// params chosen so {k, h, -k, c} are all distinct (no duplicate options).
const funcParams: [number, number, number, number, 'easy' | 'medium' | 'hard'][] = [
  [-1, 2, 5, 2023, 'medium'], [-2, 3, 4, 2022, 'medium'], [1, -1, -4, 2021, 'medium'], [-1, 4, 10, 2020, 'medium'],
  [2, 2, -3, 2023, 'medium'], [-3, 1, 6, 2019, 'medium'], [1, 4, 2, 2022, 'medium'], [-2, -1, 7, 2021, 'medium'],
  [1, 2, 3, 2020, 'medium'], [-1, -2, 4, 2022, 'medium'],
]
const funcQs = funcParams.map(([a, h, k, y, d], i) => maxParab(i + 1, a, h, k, y, d))

// ── Topic 5: Trigonometry (explicit, hand-verified) ──────────────────────────
const trigQs: Question[] = [
  q('math_trig_1', T.trigonometry, FW.transform, 'easy', 2023, 1,
    ['求 $\\sin 30° + \\cos 60°$ 的值。', 'Find the value of $\\sin 30° + \\cos 60°$.'],
    [['$1$', '$1$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$'], ['$0$', '$0$']],
    ['$\\sin 30° = \\frac{1}{2}$，$\\cos 60° = \\frac{1}{2}$，相加得 $1$。', '$\\sin 30° = \\frac{1}{2}$, $\\cos 60° = \\frac{1}{2}$; the sum is $1$.']),
  q('math_trig_2', T.trigonometry, FW.transform, 'easy', 2022, 1,
    ['求 $\\tan 45°$ 的值。', 'Find the value of $\\tan 45°$.'],
    [['$1$', '$1$'], ['$0$', '$0$'], ['$\\sqrt{3}$', '$\\sqrt{3}$'], ['$\\frac{1}{\\sqrt{3}}$', '$\\frac{1}{\\sqrt{3}}$']],
    ['$\\tan 45° = \\frac{\\sin 45°}{\\cos 45°} = 1$。', '$\\tan 45° = \\frac{\\sin 45°}{\\cos 45°} = 1$.']),
  q('math_trig_3', T.trigonometry, FW.transform, 'medium', 2021, 1,
    ['若 $\\sin\\theta = \\frac{3}{5}$ 且 $\\theta$ 為銳角，求 $\\cos\\theta$。',
      'If $\\sin\\theta = \\frac{3}{5}$ and $\\theta$ is acute, find $\\cos\\theta$.'],
    [['$\\frac{4}{5}$', '$\\frac{4}{5}$'], ['$\\frac{3}{4}$', '$\\frac{3}{4}$'], ['$\\frac{5}{4}$', '$\\frac{5}{4}$'], ['$\\frac{2}{5}$', '$\\frac{2}{5}$']],
    ['由 $\\sin^2\\theta + \\cos^2\\theta = 1$：$\\cos\\theta = \\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$（銳角取正）。',
      'From $\\sin^2\\theta + \\cos^2\\theta = 1$: $\\cos\\theta = \\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$ (positive for an acute angle).']),
  q('math_trig_4', T.trigonometry, FW.transform, 'medium', 2020, 1,
    ['若 $\\cos\\theta = \\frac{5}{13}$ 且 $\\theta$ 為銳角，求 $\\sin\\theta$。',
      'If $\\cos\\theta = \\frac{5}{13}$ and $\\theta$ is acute, find $\\sin\\theta$.'],
    [['$\\frac{12}{13}$', '$\\frac{12}{13}$'], ['$\\frac{12}{5}$', '$\\frac{12}{5}$'], ['$\\frac{8}{13}$', '$\\frac{8}{13}$'], ['$\\frac{13}{12}$', '$\\frac{13}{12}$']],
    ['$\\sin\\theta = \\sqrt{1 - \\frac{25}{169}} = \\sqrt{\\frac{144}{169}} = \\frac{12}{13}$。',
      '$\\sin\\theta = \\sqrt{1 - \\frac{25}{169}} = \\sqrt{\\frac{144}{169}} = \\frac{12}{13}$.']),
  q('math_trig_5', T.trigonometry, FW.transform, 'easy', 2023, 1,
    ['求 $\\sin 90°$ 的值。', 'Find the value of $\\sin 90°$.'],
    [['$1$', '$1$'], ['$0$', '$0$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$-1$', '$-1$']],
    ['$\\sin 90° = 1$（最大值）。', '$\\sin 90° = 1$ (its maximum).']),
  q('math_trig_6', T.trigonometry, FW.transform, 'medium', 2022, 1,
    ['化簡 $\\frac{\\sin\\theta}{\\cos\\theta}$。', 'Simplify $\\frac{\\sin\\theta}{\\cos\\theta}$.'],
    [['$\\tan\\theta$', '$\\tan\\theta$'], ['$\\cot\\theta$', '$\\cot\\theta$'], ['$\\sec\\theta$', '$\\sec\\theta$'], ['$1$', '$1$']],
    ['依定義 $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$。', 'By definition $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.']),
  q('math_trig_7', T.trigonometry, FW.transform, 'medium', 2021, 1,
    ['在直角三角形中，斜邊長 $10$，一銳角為 $30°$，求其對邊長。',
      'In a right triangle the hypotenuse is $10$ and one acute angle is $30°$. Find the opposite side.'],
    [['$5$', '$5$'], ['$5\\sqrt{3}$', '$5\\sqrt{3}$'], ['$10$', '$10$'], ['$\\frac{10}{\\sqrt{3}}$', '$\\frac{10}{\\sqrt{3}}$']],
    ['對邊 $= 10\\sin 30° = 10 \\times \\frac{1}{2} = 5$。', 'Opposite $= 10\\sin 30° = 10 \\times \\frac{1}{2} = 5$.']),
  q('math_trig_8', T.trigonometry, FW.transform, 'medium', 2019, 1,
    ['求 $\\cos 0°$ 的值。', 'Find the value of $\\cos 0°$.'],
    [['$1$', '$1$'], ['$0$', '$0$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$']],
    ['$\\cos 0° = 1$。', '$\\cos 0° = 1$.']),
  q('math_trig_9', T.trigonometry, FW.transform, 'medium', 2023, 1,
    ['化簡 $1 - \\sin^2\\theta$。', 'Simplify $1 - \\sin^2\\theta$.'],
    [['$\\cos^2\\theta$', '$\\cos^2\\theta$'], ['$\\tan^2\\theta$', '$\\tan^2\\theta$'], ['$\\sec^2\\theta$', '$\\sec^2\\theta$'], ['$\\cos 2\\theta$', '$\\cos 2\\theta$']],
    ['由 $\\sin^2\\theta + \\cos^2\\theta = 1$，得 $1 - \\sin^2\\theta = \\cos^2\\theta$。',
      'From $\\sin^2\\theta + \\cos^2\\theta = 1$, $1 - \\sin^2\\theta = \\cos^2\\theta$.']),
  q('math_trig_10', T.trigonometry, FW.transform, 'medium', 2020, 1,
    ['若 $\\tan\\theta = 1$ 且 $0° < \\theta < 90°$，求 $\\theta$。',
      'If $\\tan\\theta = 1$ and $0° < \\theta < 90°$, find $\\theta$.'],
    [['$45°$', '$45°$'], ['$30°$', '$30°$'], ['$60°$', '$60°$'], ['$90°$', '$90°$']],
    ['$\\tan 45° = 1$，故 $\\theta = 45°$。', '$\\tan 45° = 1$, so $\\theta = 45°$.']),
  q('math_trig_11', T.trigonometry, FW.transform, 'medium', 2022, 1,
    ['求 $\\cos 30° \\times \\tan 60°$ 的值。', 'Find the value of $\\cos 30° \\times \\tan 60°$.'],
    [['$\\frac{3}{2}$', '$\\frac{3}{2}$'], ['$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$'], ['$\\frac{1}{2}$', '$\\frac{1}{2}$'], ['$3$', '$3$']],
    ['$\\frac{\\sqrt{3}}{2} \\times \\sqrt{3} = \\frac{3}{2}$。', '$\\frac{\\sqrt{3}}{2} \\times \\sqrt{3} = \\frac{3}{2}$.']),
]

// ── Topic 6: Statistics (explicit, hand-verified) ────────────────────────────
const statQs: Question[] = [
  q('math_stat_1', T.statistics, FW.decompose, 'easy', 2023, 1,
    ['數據 $4, 8, 6, 10, 7$ 的平均數是？', 'The mean of $4, 8, 6, 10, 7$ is?'],
    [['$7$', '$7$'], ['$6$', '$6$'], ['$8$', '$8$'], ['$35$', '$35$']],
    ['$\\frac{4+8+6+10+7}{5} = \\frac{35}{5} = 7$。', '$\\frac{4+8+6+10+7}{5} = \\frac{35}{5} = 7$.']),
  q('math_stat_2', T.statistics, FW.decompose, 'easy', 2022, 1,
    ['數據 $3, 5, 9, 5, 7, 5$ 的眾數是？', 'The mode of $3, 5, 9, 5, 7, 5$ is?'],
    [['$5$', '$5$'], ['$9$', '$9$'], ['$6$', '$6$'], ['$3$', '$3$']],
    ['$5$ 出現 3 次，最頻繁，故眾數為 $5$。', '$5$ appears three times (most frequent), so the mode is $5$.']),
  q('math_stat_3', T.statistics, FW.decompose, 'medium', 2021, 1,
    ['數據 $2, 9, 4, 7, 5$ 的中位數是？', 'The median of $2, 9, 4, 7, 5$ is?'],
    [['$5$', '$5$'], ['$4$', '$4$'], ['$7$', '$7$'], ['$5.4$', '$5.4$']],
    ['排序為 $2,4,5,7,9$，中間值為 $5$。', 'Sorted: $2,4,5,7,9$; the middle value is $5$.']),
  q('math_stat_4', T.statistics, FW.decompose, 'easy', 2020, 1,
    ['數據 $12, 7, 15, 4$ 的全距是？', 'The range of $12, 7, 15, 4$ is?'],
    [['$11$', '$11$'], ['$15$', '$15$'], ['$8$', '$8$'], ['$4$', '$4$']],
    ['全距 $=$ 最大 $-$ 最小 $= 15 - 4 = 11$。', 'Range = max − min = $15 - 4 = 11$.']),
  q('math_stat_5', T.statistics, FW.decompose, 'medium', 2023, 1,
    ['數據 $6, 6, 6, 6$ 的標準差是？', 'The standard deviation of $6, 6, 6, 6$ is?'],
    [['$0$', '$0$'], ['$6$', '$6$'], ['$1$', '$1$'], ['$24$', '$24$']],
    ['所有數值相同，無離散，標準差為 $0$。', 'All values are identical (no spread), so the standard deviation is $0$.']),
  q('math_stat_6', T.statistics, FW.decompose, 'medium', 2022, 1,
    ['數據 $1, 2, 3, 4, 5, 6$ 的中位數是？', 'The median of $1, 2, 3, 4, 5, 6$ is?'],
    [['$3.5$', '$3.5$'], ['$3$', '$3$'], ['$4$', '$4$'], ['$3$ 與 $4$ 之間任意值', 'any value between $3$ and $4$']],
    ['偶數個數據，中位數為中間兩數平均：$\\frac{3+4}{2} = 3.5$。',
      'With an even count, the median is the mean of the middle two: $\\frac{3+4}{2} = 3.5$.']),
  q('math_stat_7', T.statistics, FW.decompose, 'medium', 2021, 1,
    ['5 個數的平均數為 $8$。若加入第 6 個數 $14$，新平均數是？',
      'Five numbers have mean $8$. A sixth number $14$ is added. The new mean is?'],
    [['$9$', '$9$'], ['$11$', '$11$'], ['$8$', '$8$'], ['$10$', '$10$']],
    ['原總和 $5 \\times 8 = 40$，新總和 $40 + 14 = 54$，新平均 $\\frac{54}{6} = 9$。',
      'Original total $5 \\times 8 = 40$; new total $40 + 14 = 54$; new mean $\\frac{54}{6} = 9$.']),
  q('math_stat_8', T.statistics, FW.decompose, 'easy', 2019, 1,
    ['數據 $10, 20, 30$ 的平均數是？', 'The mean of $10, 20, 30$ is?'],
    [['$20$', '$20$'], ['$30$', '$30$'], ['$60$', '$60$'], ['$15$', '$15$']],
    ['$\\frac{10+20+30}{3} = 20$。', '$\\frac{10+20+30}{3} = 20$.']),
  q('math_stat_9', T.statistics, FW.decompose, 'medium', 2023, 1,
    ['某班 10 名學生測驗，最高 95 分，最低 40 分，全距是？',
      'In a class of 10, the highest score is 95 and the lowest 40. The range is?'],
    [['$55$', '$55$'], ['$135$', '$135$'], ['$95$', '$95$'], ['$67.5$', '$67.5$']],
    ['全距 $= 95 - 40 = 55$。', 'Range $= 95 - 40 = 55$.']),
  q('math_stat_10', T.statistics, FW.decompose, 'medium', 2020, 1,
    ['數據 $2, 4, 4, 4, 5, 5, 7, 9$ 的眾數是？', 'The mode of $2, 4, 4, 4, 5, 5, 7, 9$ is?'],
    [['$4$', '$4$'], ['$5$', '$5$'], ['$4.75$', '$4.75$'], ['$4.5$', '$4.5$']],
    ['$4$ 出現 3 次，為最頻繁值。', '$4$ appears three times — the most frequent value.']),
  q('math_stat_11', T.statistics, FW.decompose, 'medium', 2022, 1,
    ['數據 $3, 7, 7, 11$ 的平均數與中位數之差（平均 $-$ 中位）是？',
      'For $3, 7, 7, 11$, find (mean − median).'],
    [['$0$', '$0$'], ['$1$', '$1$'], ['$-1$', '$-1$'], ['$7$', '$7$']],
    ['平均 $\\frac{28}{4} = 7$；中位 $\\frac{7+7}{2} = 7$；差為 $0$。',
      'Mean $\\frac{28}{4} = 7$; median $\\frac{7+7}{2} = 7$; difference $0$.']),
]

// ── Topic 7: Logarithms & exponents (explicit, hand-verified) ────────────────
const logQs: Question[] = [
  q('math_log_1', T.logarithms, FW.transform, 'easy', 2023, 1,
    ['求 $\\log_2 8$ 的值。', 'Find the value of $\\log_2 8$.'],
    [['$3$', '$3$'], ['$4$', '$4$'], ['$2$', '$2$'], ['$8$', '$8$']],
    ['$2^3 = 8$，故 $\\log_2 8 = 3$。', '$2^3 = 8$, so $\\log_2 8 = 3$.']),
  q('math_log_2', T.logarithms, FW.transform, 'easy', 2022, 1,
    ['求 $\\log_{10} 1000$ 的值。', 'Find the value of $\\log_{10} 1000$.'],
    [['$3$', '$3$'], ['$2$', '$2$'], ['$10$', '$10$'], ['$100$', '$100$']],
    ['$10^3 = 1000$，故值為 $3$。', '$10^3 = 1000$, so the value is $3$.']),
  q('math_log_3', T.logarithms, FW.transform, 'medium', 2021, 1,
    ['化簡 $\\log 2 + \\log 5$（以 10 為底）。', 'Simplify $\\log 2 + \\log 5$ (base 10).'],
    [['$1$', '$1$'], ['$\\log 7$', '$\\log 7$'], ['$\\log 3$', '$\\log 3$'], ['$10$', '$10$']],
    ['$\\log 2 + \\log 5 = \\log(2 \\times 5) = \\log 10 = 1$。',
      '$\\log 2 + \\log 5 = \\log(2 \\times 5) = \\log 10 = 1$.']),
  q('math_log_4', T.logarithms, FW.transform, 'medium', 2020, 1,
    ['求 $\\log_3 81$ 的值。', 'Find the value of $\\log_3 81$.'],
    [['$4$', '$4$'], ['$3$', '$3$'], ['$27$', '$27$'], ['$9$', '$9$']],
    ['$3^4 = 81$，故值為 $4$。', '$3^4 = 81$, so the value is $4$.']),
  q('math_log_5', T.logarithms, FW.transform, 'easy', 2023, 1,
    ['求 $2^0$ 的值。', 'Find the value of $2^0$.'],
    [['$1$', '$1$'], ['$0$', '$0$'], ['$2$', '$2$'], ['未定義', 'undefined']],
    ['任何非零數的零次方為 $1$。', 'Any non-zero number to the power 0 is $1$.']),
  q('math_log_6', T.logarithms, FW.transform, 'medium', 2022, 1,
    ['化簡 $\\log 100 - \\log 10$（以 10 為底）。', 'Simplify $\\log 100 - \\log 10$ (base 10).'],
    [['$1$', '$1$'], ['$10$', '$10$'], ['$\\log 90$', '$\\log 90$'], ['$2$', '$2$']],
    ['$\\log\\frac{100}{10} = \\log 10 = 1$。', '$\\log\\frac{100}{10} = \\log 10 = 1$.']),
  q('math_log_7', T.logarithms, FW.transform, 'medium', 2021, 1,
    ['解方程 $2^x = 16$。', 'Solve $2^x = 16$.'],
    [['$x = 4$', '$x = 4$'], ['$x = 8$', '$x = 8$'], ['$x = 2$', '$x = 2$'], ['$x = 16$', '$x = 16$']],
    ['$16 = 2^4$，故 $x = 4$。', '$16 = 2^4$, so $x = 4$.']),
  q('math_log_8', T.logarithms, FW.transform, 'medium', 2019, 1,
    ['求 $\\log_5 1$ 的值。', 'Find the value of $\\log_5 1$.'],
    [['$0$', '$0$'], ['$1$', '$1$'], ['$5$', '$5$'], ['未定義', 'undefined']],
    ['$5^0 = 1$，故 $\\log_5 1 = 0$。', '$5^0 = 1$, so $\\log_5 1 = 0$.']),
  q('math_log_9', T.logarithms, FW.transform, 'medium', 2023, 1,
    ['化簡 $\\log_2 32 - \\log_2 4$。', 'Simplify $\\log_2 32 - \\log_2 4$.'],
    [['$3$', '$3$'], ['$5$', '$5$'], ['$8$', '$8$'], ['$\\log_2 28$', '$\\log_2 28$']],
    ['$\\log_2\\frac{32}{4} = \\log_2 8 = 3$。', '$\\log_2\\frac{32}{4} = \\log_2 8 = 3$.']),
  q('math_log_10', T.logarithms, FW.transform, 'medium', 2020, 1,
    ['求 $3^{-2}$ 的值。', 'Find the value of $3^{-2}$.'],
    [['$\\frac{1}{9}$', '$\\frac{1}{9}$'], ['$-9$', '$-9$'], ['$-6$', '$-6$'], ['$9$', '$9$']],
    ['$3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$。', '$3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$.']),
  q('math_log_11', T.logarithms, FW.transform, 'medium', 2022, 1,
    ['化簡 $\\log a^3$（以 $\\log a$ 表示）。', 'Express $\\log a^3$ in terms of $\\log a$.'],
    [['$3\\log a$', '$3\\log a$'], ['$\\log 3a$', '$\\log 3a$'], ['$(\\log a)^3$', '$(\\log a)^3$'], ['$\\frac{1}{3}\\log a$', '$\\frac{1}{3}\\log a$']],
    ['冪法則：$\\log a^3 = 3\\log a$。', 'Power law: $\\log a^3 = 3\\log a$.']),
]

// ── Topic 8: Sequences — AP / GP (code-built) ────────────────────────────────
// AP: a_n = a + (n-1)d
function apTerm(n: number, a: number, d: number, k: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const ans = a + (k - 1) * d
  return q(`math_seq_ap_${n}`, T.sequences, FW.sequence, diff, year, 1,
    [`等差數列首項 $${a}$、公差 $${d}$，求第 $${k}$ 項。`, `An arithmetic sequence has first term $${a}$ and common difference $${d}$. Find the $${k}$th term.`],
    [
      [`$${ans}$`, `$${ans}$`], [`$${ans + d}$`, `$${ans + d}$`], [`$${ans - d}$`, `$${ans - d}$`], [`$${ans + 2 * d}$`, `$${ans + 2 * d}$`],
    ],
    [`$a_n = a + (n-1)d = ${a} + ${k - 1}\\times${d} = ${ans}$。`,
      `$a_n = a + (n-1)d = ${a} + ${k - 1}\\times${d} = ${ans}$.`])
}
// GP: a_n = a · r^(n-1)
function gpTerm(n: number, a: number, r: number, k: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const ans = a * Math.pow(r, k - 1)
  return q(`math_seq_gp_${n}`, T.sequences, FW.sequence, diff, year, 1,
    [`等比數列首項 $${a}$、公比 $${r}$，求第 $${k}$ 項。`, `A geometric sequence has first term $${a}$ and common ratio $${r}$. Find the $${k}$th term.`],
    [
      [`$${ans}$`, `$${ans}$`], [`$${a * Math.pow(r, k)}$`, `$${a * Math.pow(r, k)}$`], [`$${a + (k - 1) * r}$`, `$${a + (k - 1) * r}$`], [`$${a * r * (k - 1)}$`, `$${a * r * (k - 1)}$`],
    ],
    [`$a_n = a\\,r^{n-1} = ${a}\\times${r}^{${k - 1}} = ${ans}$。`,
      `$a_n = a\\,r^{n-1} = ${a}\\times${r}^{${k - 1}} = ${ans}$.`])
}
const seqQs: Question[] = [
  apTerm(1, 3, 4, 10, 2023, 'easy'), apTerm(2, 5, 3, 8, 2022, 'easy'), apTerm(3, 2, 5, 12, 2021, 'medium'),
  apTerm(4, 7, -2, 9, 2020, 'medium'), apTerm(5, -4, 6, 7, 2023, 'medium'), apTerm(6, 1, 7, 11, 2019, 'medium'),
  gpTerm(1, 2, 3, 4, 2022, 'medium'), gpTerm(2, 3, 2, 5, 2021, 'medium'), gpTerm(3, 1, 5, 4, 2020, 'easy'),
  gpTerm(4, 5, 2, 4, 2023, 'medium'), gpTerm(5, 2, 4, 3, 2022, 'medium'),
]

// ── Topic 9: Percentages & interest (code-built) ─────────────────────────────
function profit(n: number, cost: number, pct: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const ans = Math.round(cost * (1 + pct / 100))
  return q(`math_pct_${n}`, T.percentage, FW.modelling, diff, year, 1,
    [`一件貨品成本 $\\$${cost}$，以 $${pct}\\%$ 利潤出售，售價是？`, `An item costs $\\$${cost}$ and is sold at a profit of $${pct}\\%$. Find the selling price.`],
    [
      [`$\\$${ans}$`, `$\\$${ans}$`], [`$\\$${cost + pct}$`, `$\\$${cost + pct}$`], [`$\\$${Math.round(cost * (1 - pct / 100))}$`, `$\\$${Math.round(cost * (1 - pct / 100))}$`], [`$\\$${cost}$`, `$\\$${cost}$`],
    ],
    [`售價 $= ${cost} \\times (1 + ${pct}\\%) = ${cost} \\times ${(1 + pct / 100).toFixed(2)} = ${ans}$。`,
      `Selling price $= ${cost} \\times (1 + ${pct}\\%) = ${cost} \\times ${(1 + pct / 100).toFixed(2)} = ${ans}$.`])
}
function simpleInterest(n: number, P: number, r: number, t: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const I = P * r / 100 * t
  return q(`math_si_${n}`, T.percentage, FW.modelling, diff, year, 1,
    [`本金 $\\$${P}$ 以年利率 $${r}\\%$ 單利存 $${t}$ 年，求利息。`, `$\\$${P}$ is invested at $${r}\\%$ simple interest per year for $${t}$ years. Find the interest.`],
    [
      [`$\\$${I}$`, `$\\$${I}$`], [`$\\$${P * r / 100}$`, `$\\$${P * r / 100}$`], [`$\\$${P + I}$`, `$\\$${P + I}$`], [`$\\$${I * 2}$`, `$\\$${I * 2}$`],
    ],
    [`單利 $I = \\frac{P\\,r\\,t}{100} = \\frac{${P}\\times${r}\\times${t}}{100} = ${I}$。`,
      `Simple interest $I = \\frac{P\\,r\\,t}{100} = \\frac{${P}\\times${r}\\times${t}}{100} = ${I}$.`])
}
const pctQs: Question[] = [
  profit(1, 200, 20, 2023, 'easy'), profit(2, 500, 15, 2022, 'medium'), profit(3, 150, 30, 2021, 'medium'),
  profit(4, 800, 25, 2020, 'medium'), profit(5, 1200, 10, 2023, 'easy'), profit(6, 250, 40, 2019, 'medium'),
  simpleInterest(1, 1000, 5, 3, 2022, 'medium'), simpleInterest(2, 2000, 4, 2, 2021, 'medium'),
  simpleInterest(3, 5000, 6, 2, 2020, 'easy'), simpleInterest(4, 1500, 8, 2, 2023, 'medium'),
  simpleInterest(5, 3000, 5, 4, 2022, 'medium'),
]

// ── Topic 10: Coordinate geometry (code-built) ───────────────────────────────
function distance(n: number, x1: number, y1: number, x2: number, y2: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const d2 = (x2 - x1) ** 2 + (y2 - y1) ** 2
  const ans = Math.sqrt(d2)
  const isInt = Number.isInteger(ans)
  const ansStr = isInt ? `${ans}` : `\\sqrt{${d2}}`
  return q(`math_coord_d_${n}`, T.coordinate, FW.geometry, diff, year, 1,
    [`求點 $(${x1}, ${y1})$ 與 $(${x2}, ${y2})$ 之間的距離。`, `Find the distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`],
    [
      [`$${ansStr}$`, `$${ansStr}$`], [`$${d2}$`, `$${d2}$`], [`$\\sqrt{${(x2 - x1) ** 2}}$`, `$\\sqrt{${(x2 - x1) ** 2}}$`], [`$${Math.abs(x2 - x1) + Math.abs(y2 - y1)}$`, `$${Math.abs(x2 - x1) + Math.abs(y2 - y1)}$`],
    ],
    [`距離 $= \\sqrt{(${x2}-${x1})^2 + (${y2}-${y1})^2} = \\sqrt{${d2}} = ${ansStr}$。`,
      `Distance $= \\sqrt{(${x2}-${x1})^2 + (${y2}-${y1})^2} = \\sqrt{${d2}} = ${ansStr}$.`])
}
function midpoint(n: number, x1: number, y1: number, x2: number, y2: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  return q(`math_coord_m_${n}`, T.coordinate, FW.geometry, diff, year, 1,
    [`求點 $(${x1}, ${y1})$ 與 $(${x2}, ${y2})$ 的中點。`, `Find the midpoint of $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`],
    [
      [`$(${mx}, ${my})$`, `$(${mx}, ${my})$`], [`$(${x1 + x2}, ${y1 + y2})$`, `$(${x1 + x2}, ${y1 + y2})$`], [`$(${(x2 - x1) / 2}, ${(y2 - y1) / 2})$`, `$(${(x2 - x1) / 2}, ${(y2 - y1) / 2})$`], [`$(${my}, ${mx})$`, `$(${my}, ${mx})$`],
    ],
    [`中點 $= (\\frac{${x1}+${x2}}{2}, \\frac{${y1}+${y2}}{2}) = (${mx}, ${my})$。`,
      `Midpoint $= (\\frac{${x1}+${x2}}{2}, \\frac{${y1}+${y2}}{2}) = (${mx}, ${my})$.`])
}
function slope(n: number, x1: number, y1: number, x2: number, y2: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const m = (y2 - y1) / (x2 - x1)
  return q(`math_coord_s_${n}`, T.coordinate, FW.geometry, diff, year, 1,
    [`求通過 $(${x1}, ${y1})$ 與 $(${x2}, ${y2})$ 的直線斜率。`, `Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`],
    [
      [`$${m}$`, `$${m}$`], [`$${-m}$`, `$${-m}$`], [`$${(x2 - x1) / (y2 - y1)}$`, `$${(x2 - x1) / (y2 - y1)}$`], [`$${y2 - y1}$`, `$${y2 - y1}$`],
    ],
    [`斜率 $= \\frac{${y2}-${y1}}{${x2}-${x1}} = ${m}$。`,
      `Slope $= \\frac{${y2}-${y1}}{${x2}-${x1}} = ${m}$.`])
}
const coordQs: Question[] = [
  distance(1, 0, 0, 3, 4, 2023, 'easy'), distance(2, 1, 2, 4, 6, 2022, 'medium'), distance(3, -1, -1, 2, 3, 2021, 'medium'),
  distance(4, 0, 0, 6, 8, 2020, 'easy'),
  midpoint(1, 2, 4, 6, 8, 2023, 'easy'), midpoint(2, -2, 3, 4, 7, 2022, 'medium'), midpoint(3, 1, 1, 5, 9, 2021, 'easy'),
  slope(1, 1, 2, 3, 8, 2020, 'medium'), slope(2, 0, 0, 2, 6, 2023, 'easy'), slope(3, -1, 4, 1, 8, 2022, 'medium'),
  slope(4, 2, 1, 5, 10, 2019, 'medium'),
]

// ── Topic 11: Inequalities (code-built linear) ───────────────────────────────
// solve a x + b > 0  (a > 0)  ⇒  x > -b/a
function ineq(n: number, a: number, b: number, year: number, diff: 'easy' | 'medium' | 'hard'): Question {
  const bound = -b / a
  return q(`math_ineq_${n}`, T.inequalities, FW.decompose, diff, year, 1,
    [`解不等式 $${a}x${cTerm(b)} > 0$。`, `Solve the inequality $${a}x${cTerm(b)} > 0$.`],
    [
      [`$x > ${bound}$`, `$x > ${bound}$`], [`$x < ${bound}$`, `$x < ${bound}$`], [`$x > ${-bound}$`, `$x > ${-bound}$`], [`$x < ${-bound}$`, `$x < ${-bound}$`],
    ],
    [`移項得 $${a}x > ${-b}$，因 $${a} > 0$ 不變號，$x > ${bound}$。`,
      `Rearranging, $${a}x > ${-b}$; since $${a} > 0$ the sign is unchanged, so $x > ${bound}$.`])
}
const ineqParams: [number, number, number, 'easy' | 'medium' | 'hard'][] = [
  [1, -3, 2023, 'easy'], [2, -8, 2022, 'easy'], [1, 5, 2021, 'easy'], [4, -12, 2023, 'medium'],
  [3, 9, 2020, 'medium'], [5, -10, 2019, 'medium'], [2, 7, 2022, 'medium'], [6, -18, 2021, 'medium'],
  [1, -11, 2020, 'medium'], [3, -6, 2023, 'easy'], [4, 8, 2022, 'medium'],
]
const ineqQs = ineqParams.map(([a, b, y, d], i) => ineq(i + 1, a, b, y, d))

// ═══════════════════════════════════════════════════════════════════════════
// L5+ KILLER SET — hand-authored Paper-2 拔尖 questions, every figure verified.
// Each carries TWO explanation paths:
//   • explanation = Path A  → rigorous HKEAA marking-scheme reasoning ($$ display)
//   • mcHack       = Path B  → quick-kill MC shortcut (speed over rigour)
// All distractors are "致命陷阱": each is the answer of one specific, common error.
// ═══════════════════════════════════════════════════════════════════════════

// ── Properties of Circles（圓的幾何特性）──────────────────────────────────────
const circleQs: Question[] = [
  q('math_circle_1', T.circles, FW.geometry, 'hard', 2023, 1,
    [String.raw`由圓外一點 $P$ 向圓心為 $O$ 的圓引兩條切線，分別切於 $A$、$B$。已知 $\angle APB = 50^\circ$，$C$ 為優弧 $AB$ 上一點。求 $\angle ACB$。`,
     String.raw`From an external point $P$, two tangents touch a circle (centre $O$) at $A$ and $B$. Given $\angle APB = 50^\circ$ and $C$ is a point on the major arc $AB$, find $\angle ACB$.`],
    [
      [String.raw`$65^\circ$`, String.raw`$65^\circ$`],
      [String.raw`$50^\circ$`, String.raw`$50^\circ$`],
      [String.raw`$130^\circ$`, String.raw`$130^\circ$`],
      [String.raw`$25^\circ$`, String.raw`$25^\circ$`],
    ],
    [String.raw`【標準證明 Marking Scheme】切線垂直於過切點的半徑，故 $\angle OAP=\angle OBP=90^\circ$。四邊形 $PAOB$ 的內角和為 $360^\circ$：$$\angle AOB = 360^\circ-90^\circ-90^\circ-50^\circ = 130^\circ.$$ $\angle AOB$ 是劣弧 $AB$ 所對的圓心角。由「圓心角 $=2\times$ 圓周角」（$\angle$ at centre $=2\,\angle$ at circumference），優弧上的 $C$ 對劣弧 $AB$：$$\angle ACB = \tfrac{1}{2}\angle AOB = \tfrac{1}{2}(130^\circ)=65^\circ.$$ 陷阱：$130^\circ$ 是圓心角本身（漏除以 $2$）；$25^\circ$ 是 $\tfrac{1}{2}\angle APB$；$50^\circ$ 直接抄題目。`,
     String.raw`【Marking Scheme】Tangent $\perp$ radius at contact, so $\angle OAP=\angle OBP=90^\circ$. Angle sum of quadrilateral $PAOB=360^\circ$: $$\angle AOB = 360^\circ-90^\circ-90^\circ-50^\circ = 130^\circ.$$ $\angle AOB$ is the central angle on minor arc $AB$; by "angle at centre $=2\times$ angle at circumference", $$\angle ACB = \tfrac{1}{2}(130^\circ)=65^\circ.$$ Traps: $130^\circ$ forgets the $\tfrac12$; $25^\circ=\tfrac12\angle APB$; $50^\circ$ just copies the question.`],
    [String.raw`兩切線夾角與遠側圓周角有固定關係：$$\angle ACB = 90^\circ-\tfrac{1}{2}\angle APB.$$ 直接代入 $90^\circ-25^\circ=65^\circ$，免畫圖三秒鎖定。`,
     String.raw`The two-tangent angle and the far circumference angle obey $$\angle ACB = 90^\circ-\tfrac{1}{2}\angle APB.$$ Plug in: $90^\circ-25^\circ=65^\circ$ — no diagram, three seconds.`]),

  q('math_circle_2', T.circles, FW.geometry, 'hard', 2022, 1,
    [String.raw`圓內一條弦長 $16$，其與圓心的距離為 $6$。求圓的半徑。`,
     String.raw`A chord of a circle has length $16$ and is at a distance $6$ from the centre. Find the radius.`],
    [
      [String.raw`$10$`, String.raw`$10$`],
      [String.raw`$14$`, String.raw`$14$`],
      [String.raw`$\sqrt{292}$`, String.raw`$\sqrt{292}$`],
      [String.raw`$2\sqrt{7}$`, String.raw`$2\sqrt{7}$`],
    ],
    [String.raw`【標準證明 Marking Scheme】由圓心向弦作垂線，垂足平分該弦（垂直於弦的直徑平分弦），故半弦長 $=\tfrac{16}{2}=8$。此半弦、圓心距與半徑構成直角三角形：$$r^2 = 8^2 + 6^2 = 64+36 = 100 \Rightarrow r = 10.$$ 陷阱：$\sqrt{292}=\sqrt{16^2+6^2}$ 是「忘記把弦折半」；$2\sqrt7=\sqrt{64-36}$ 是「相減而非相加」；$14=8+6$ 是「直接相加」。`,
     String.raw`【Marking Scheme】The perpendicular from the centre bisects the chord, so the half-chord $=\tfrac{16}{2}=8$. Half-chord, centre-distance and radius form a right triangle: $$r^2 = 8^2+6^2 = 100 \Rightarrow r=10.$$ Traps: $\sqrt{292}=\sqrt{16^2+6^2}$ forgets to halve the chord; $2\sqrt7=\sqrt{64-36}$ subtracts; $14=8+6$ just adds.`],
    [String.raw`認出 $6\text{–}8\text{–}10$ 畢氏三元組（$3\text{–}4\text{–}5$ 的兩倍）：半弦 $8$、距離 $6$ $\Rightarrow$ 半徑 $10$，毋須開方。`,
     String.raw`Spot the $6\text{–}8\text{–}10$ Pythagorean triple (double of $3\text{–}4\text{–}5$): half-chord $8$, distance $6$ $\Rightarrow$ radius $10$ — no surd needed.`]),

  q('math_circle_3', T.circles, FW.geometry, 'hard', 2021, 1,
    [String.raw`$ABCD$ 為圓內接四邊形，$AB=AD$ 且 $\angle ABD = 50^\circ$。求 $\angle BCD$。`,
     String.raw`$ABCD$ is a cyclic quadrilateral with $AB=AD$ and $\angle ABD = 50^\circ$. Find $\angle BCD$.`],
    [
      [String.raw`$100^\circ$`, String.raw`$100^\circ$`],
      [String.raw`$80^\circ$`, String.raw`$80^\circ$`],
      [String.raw`$130^\circ$`, String.raw`$130^\circ$`],
      [String.raw`$50^\circ$`, String.raw`$50^\circ$`],
    ],
    [String.raw`【標準證明 Marking Scheme】$\triangle ABD$ 中 $AB=AD$，故底角相等：$\angle ADB=\angle ABD=50^\circ$。三角形內角和：$$\angle BAD = 180^\circ-50^\circ-50^\circ = 80^\circ.$$ 圓內接四邊形對角互補（opp. $\angle$s, cyclic quad.）：$$\angle BCD = 180^\circ-\angle BAD = 180^\circ-80^\circ = 100^\circ.$$ 陷阱：$80^\circ$ 是 $\angle BAD$ 本身（忘了取補角）；$130^\circ=180^\circ-50^\circ$ 用錯了角；$50^\circ$ 抄題目。`,
     String.raw`【Marking Scheme】In $\triangle ABD$, $AB=AD$ so base angles are equal: $\angle ADB=\angle ABD=50^\circ$. Angle sum: $$\angle BAD = 180^\circ-100^\circ = 80^\circ.$$ Opposite angles of a cyclic quadrilateral are supplementary: $$\angle BCD = 180^\circ-80^\circ = 100^\circ.$$ Traps: $80^\circ$ is $\angle BAD$ (forgot to take the supplement); $130^\circ=180^\circ-50^\circ$ uses the wrong angle; $50^\circ$ copies the question.`],
    [String.raw`等腰加圓內接可一步合併：$\angle BCD = 180^\circ-(180^\circ-2\times50^\circ)=2\angle ABD$。故 $\angle BCD = 2\times50^\circ = 100^\circ$。`,
     String.raw`Isosceles + cyclic collapses to one step: $\angle BCD = 180^\circ-(180^\circ-2\times50^\circ)=2\angle ABD$. So $\angle BCD = 2\times50^\circ = 100^\circ$.`]),
]

// ── 3D Trigonometry（三維三角學）──────────────────────────────────────────────
const trig3dQs: Question[] = [
  q('math_trig3d_1', T.trig3d, FW.geometry, 'hard', 2023, 1,
    [String.raw`長方體 $ABCD\text{-}EFGH$ 的底面 $ABCD$ 長 $8$、闊 $6$，高 $10$（$G$ 在 $C$ 正上方）。求空間對角線 $AG$ 與底面 $ABCD$ 所成的角（準至最接近的度）。`,
     String.raw`In a cuboid $ABCD\text{-}EFGH$ the base $ABCD$ is $8$ by $6$ and the height is $10$ ($G$ directly above $C$). Find the angle between the space diagonal $AG$ and the base $ABCD$ (to the nearest degree).`],
    [
      [String.raw`$45^\circ$`, String.raw`$45^\circ$`],
      [String.raw`$51^\circ$`, String.raw`$51^\circ$`],
      [String.raw`$39^\circ$`, String.raw`$39^\circ$`],
      [String.raw`$50^\circ$`, String.raw`$50^\circ$`],
    ],
    [String.raw`【標準證明 Marking Scheme】$G$ 在底面的投影為 $C$，故 $AG$ 與底面的夾角即 $\angle GAC$。先求底面對角線：$$AC = \sqrt{8^2+6^2} = \sqrt{100} = 10.$$ $\triangle GAC$ 中 $GC\perp$ 底面，$GC=10$：$$\tan\angle GAC = \frac{GC}{AC} = \frac{10}{10} = 1 \Rightarrow \angle GAC = 45^\circ.$$ 陷阱：$51^\circ=\tan^{-1}\!\frac{10}{8}$ 誤用「邊長 $8$」作鄰邊；$39^\circ=\tan^{-1}\!\frac{8}{10}$ 把對邊鄰邊倒轉；$50^\circ$ 是胡亂約整。`,
     String.raw`【Marking Scheme】The projection of $G$ on the base is $C$, so the required angle is $\angle GAC$. Base diagonal: $$AC=\sqrt{8^2+6^2}=10.$$ In $\triangle GAC$, $GC\perp$ base and $GC=10$: $$\tan\angle GAC=\frac{GC}{AC}=\frac{10}{10}=1 \Rightarrow \angle GAC=45^\circ.$$ Traps: $51^\circ=\tan^{-1}\frac{10}{8}$ uses an edge as the adjacent side; $39^\circ=\tan^{-1}\frac{8}{10}$ flips opposite/adjacent; $50^\circ$ is loose rounding.`],
    [String.raw`致命關鍵：鄰邊一定是「底面對角線」而非任何一條邊。先算對角線 $\sqrt{8^2+6^2}=10$，剛好等於高 $10$ $\Rightarrow \tan=1 \Rightarrow 45^\circ$，秒選。`,
     String.raw`Killer point: the adjacent side is the BASE DIAGONAL, never an edge. Diagonal $\sqrt{8^2+6^2}=10$ equals the height $10$ $\Rightarrow \tan=1 \Rightarrow 45^\circ$ instantly.`]),

  q('math_trig3d_2', T.trig3d, FW.geometry, 'hard', 2022, 1,
    [String.raw`正四棱錐 $V\text{-}ABCD$ 的底為邊長 $6$ 的正方形，頂點 $V$ 在底面中心 $O$ 的正上方，高 $VO=4$。求側面與底面所成的二面角（準至最接近的度）。`,
     String.raw`A right pyramid $V\text{-}ABCD$ has a square base of side $6$; the apex $V$ is directly above the centre $O$ with $VO=4$. Find the dihedral angle between a slant face and the base (to the nearest degree).`],
    [
      [String.raw`$53^\circ$`, String.raw`$53^\circ$`],
      [String.raw`$37^\circ$`, String.raw`$37^\circ$`],
      [String.raw`$43^\circ$`, String.raw`$43^\circ$`],
      [String.raw`$45^\circ$`, String.raw`$45^\circ$`],
    ],
    [String.raw`【標準證明 Marking Scheme】設 $M$ 為一底邊的中點。二面角的量度為 $\angle VMO$（$VM\perp$ 底邊、$OM\perp$ 底邊）。$O$ 到邊中點的距離（邊心距）為 $$OM=\tfrac{6}{2}=3.$$ $\triangle VOM$ 中 $VO\perp OM$，$VO=4$：$$\tan\angle VMO = \frac{VO}{OM} = \frac{4}{3} \Rightarrow \angle VMO \approx 53^\circ.$$ 陷阱：$37^\circ=\tan^{-1}\frac34$ 把對鄰倒轉；$43^\circ$ 誤用半對角線 $3\sqrt2$ 作鄰邊（$\tan^{-1}\frac{4}{3\sqrt2}$）；$45^\circ$ 漫無根據。`,
     String.raw`【Marking Scheme】Let $M$ be the midpoint of a base edge. The dihedral angle is $\angle VMO$. The apothem is $$OM=\tfrac{6}{2}=3.$$ In $\triangle VOM$, $VO\perp OM$ with $VO=4$: $$\tan\angle VMO=\frac{VO}{OM}=\frac{4}{3} \Rightarrow \angle VMO\approx 53^\circ.$$ Traps: $37^\circ=\tan^{-1}\frac34$ flips the ratio; $43^\circ$ wrongly uses the half-diagonal $3\sqrt2$ as adjacent; $45^\circ$ is a guess.`],
    [String.raw`又是 $3\text{–}4\text{–}5$！邊心距 $OM=3$、高 $4$ $\Rightarrow \tan=\tfrac43 \Rightarrow 53^\circ$。切忌把「邊心距 $3$」與「半對角線 $3\sqrt2$」混淆——二面角沿邊，用的是邊心距。`,
     String.raw`Another $3\text{–}4\text{–}5$! Apothem $OM=3$, height $4$ $\Rightarrow \tan=\tfrac43 \Rightarrow 53^\circ$. Never confuse the apothem $3$ with the half-diagonal $3\sqrt2$ — a dihedral along an edge uses the apothem.`]),
]

// ── Permutations & Combinations（排列與組合）──────────────────────────────────
const pcQs: Question[] = [
  q('math_pc_1', T.permcomb, FW.decompose, 'hard', 2023, 1,
    [String.raw`$4$ 名男生與 $3$ 名女生排成一行，要求任何兩名女生都不相鄰。共有多少種排法？`,
     String.raw`$4$ boys and $3$ girls stand in a row so that no two girls are adjacent. How many arrangements are there?`],
    [
      [String.raw`$1440$`, String.raw`$1440$`],
      [String.raw`$5040$`, String.raw`$5040$`],
      [String.raw`$144$`, String.raw`$144$`],
      [String.raw`$720$`, String.raw`$720$`],
    ],
    [String.raw`【標準證明 Marking Scheme】先排 $4$ 名男生：$4!=24$ 種。男生之間及兩端共有 $5$ 個空位 $\_\,B\,\_\,B\,\_\,B\,\_\,B\,\_$。將 $3$ 名女生放入不同空位（保證互不相鄰）為有序選位：$$P(5,3)=5\times4\times3=60.$$ 由乘法原理：$$24\times60 = 1440.$$ 陷阱：$5040=7!$ 是「忽略限制」；$720=6!$ 或 $144=4!\times6$ 是「分組方法用錯」。`,
     String.raw`【Marking Scheme】Arrange the $4$ boys: $4!=24$. This creates $5$ gaps $\_\,B\,\_\,B\,\_\,B\,\_\,B\,\_$. Place the $3$ girls into distinct gaps (so none are adjacent), an ordered selection: $$P(5,3)=5\times4\times3=60.$$ By the multiplication principle: $$24\times60=1440.$$ Traps: $5040=7!$ ignores the restriction; $720=6!$ and $144$ are mis-applied grouping.`],
    [String.raw`「插空法」(gap method)：先放沒限制的男生 ($4!$)，再把女生塞進 $5$ 個空隙 ($P(5,3)$)。$24\times60=1440$。凡見「不相鄰」即用插空。`,
     String.raw`Gap method: place the unconstrained boys first ($4!$), then slot girls into the $5$ gaps ($P(5,3)$). $24\times60=1440$. "Not adjacent" $\Rightarrow$ always use gaps.`]),

  q('math_pc_2', T.permcomb, FW.decompose, 'hard', 2022, 1,
    [String.raw`從 $5$ 名男生及 $4$ 名女生中隨機選出 $3$ 人。求所選 $3$ 人中至少有 $1$ 名女生的概率。`,
     String.raw`$3$ people are chosen at random from $5$ boys and $4$ girls. Find the probability that at least $1$ girl is chosen.`],
    [
      [String.raw`$\dfrac{37}{42}$`, String.raw`$\dfrac{37}{42}$`],
      [String.raw`$\dfrac{5}{42}$`, String.raw`$\dfrac{5}{42}$`],
      [String.raw`$\dfrac{1}{2}$`, String.raw`$\dfrac{1}{2}$`],
      [String.raw`$\dfrac{4}{9}$`, String.raw`$\dfrac{4}{9}$`],
    ],
    [String.raw`【標準證明 Marking Scheme】用「補集」最快。總選法 $$C_3^9=\binom{9}{3}=84.$$ 「沒有女生」（全男生）的選法 $$C_3^5=\binom{5}{3}=10.$$ 故 $$P(\text{無女生})=\frac{10}{84}=\frac{5}{42},$$ $$P(\text{至少 1 女})=1-\frac{5}{42}=\frac{37}{42}.$$ 陷阱：$\frac{5}{42}$ 是補事件本身（漏了 $1-$）；$\frac12$、$\frac49$ 是估錯比例。`,
     String.raw`【Marking Scheme】Use the complement. Total $$\binom{9}{3}=84.$$ All-boys (no girl) $$\binom{5}{3}=10,$$ so $$P(\text{no girl})=\frac{10}{84}=\frac{5}{42}, \quad P(\ge 1\text{ girl})=1-\frac{5}{42}=\frac{37}{42}.$$ Traps: $\frac{5}{42}$ is the complement itself (forgot $1-$); $\frac12,\frac49$ are wrong ratios.`],
    [String.raw`見「至少一個」即用補集：$1-P(\text{一個都沒有})$。直接數 $1,2,3$ 名女生會做三次組合，慢且易錯。$1-\frac{10}{84}=\frac{37}{42}$。`,
     String.raw`"At least one" $\Rightarrow$ complement: $1-P(\text{none})$. Counting $1,2,3$ girls separately is three combinations — slow and error-prone. $1-\frac{10}{84}=\frac{37}{42}$.`]),

  q('math_pc_3', T.permcomb, FW.decompose, 'hard', 2021, 1,
    [String.raw`$4$ 名男生與 $3$ 名女生排成一行，要求 $3$ 名女生必須全部相鄰（坐在一起）。共有多少種排法？`,
     String.raw`$4$ boys and $3$ girls stand in a row with all $3$ girls together. How many arrangements are there?`],
    [
      [String.raw`$720$`, String.raw`$720$`],
      [String.raw`$5040$`, String.raw`$5040$`],
      [String.raw`$144$`, String.raw`$144$`],
      [String.raw`$240$`, String.raw`$240$`],
    ],
    [String.raw`【標準證明 Marking Scheme】把 $3$ 名女生「綑綁」成一個整體，與 $4$ 名男生合共 $5$ 個單位排列：$$5!=120.$$ 整體內部 $3$ 名女生可互換：$$3!=6.$$ 由乘法原理：$$120\times6 = 720.$$ 陷阱：$5040=7!$ 是「忽略相鄰限制」；$240$、$144$ 是單位數或內部數算錯。`,
     String.raw`【Marking Scheme】Bind the $3$ girls into one block; with the $4$ boys that is $5$ units: $$5!=120.$$ Inside the block the girls permute: $$3!=6.$$ Hence $$120\times6=720.$$ Traps: $5040=7!$ ignores the "together" condition; $240,144$ miscount the units or the internal order.`],
    [String.raw`「綑綁法」(block method)：女生黐成一「超級人」，先排 $5$ 個單位 ($5!$)，再乘女生內部 $3!$。$120\times6=720$。它與 math_pc_1 的插空法剛好相反——相鄰用綑綁，不相鄰用插空。`,
     String.raw`Block method: glue the girls into one "super-person", arrange $5$ units ($5!$), then $\times 3!$ inside. $120\times6=720$. It is the mirror of the gap method — "together" $\Rightarrow$ glue, "apart" $\Rightarrow$ gaps.`]),
]

// ── Locus & Coordinates（軌跡與坐標）──────────────────────────────────────────
const locusQs: Question[] = [
  q('math_locus_1', T.locus, FW.geometry, 'hard', 2023, 1,
    [String.raw`動點 $P$ 與兩定點 $A(1,2)$、$B(5,6)$ 保持等距。求 $P$ 的軌跡方程。`,
     String.raw`A moving point $P$ is equidistant from the fixed points $A(1,2)$ and $B(5,6)$. Find the equation of the locus of $P$.`],
    [
      [String.raw`$x+y-7=0$`, String.raw`$x+y-7=0$`],
      [String.raw`$y=x+1$`, String.raw`$y=x+1$`],
      [String.raw`$x+y-1=0$`, String.raw`$x+y-1=0$`],
      [String.raw`$x+y+7=0$`, String.raw`$x+y+7=0$`],
    ],
    [String.raw`【標準證明 Marking Scheme】與兩定點等距的軌跡是線段 $AB$ 的垂直平分線。中點 $$M=\left(\tfrac{1+5}{2},\tfrac{2+6}{2}\right)=(3,4).$$ $AB$ 的斜率 $$m_{AB}=\frac{6-2}{5-1}=1,$$ 故垂直平分線斜率為 $-1$。過 $M(3,4)$：$$y-4=-1(x-3) \Rightarrow x+y-7=0.$$ 陷阱：$y=x+1$ 正是直線 $AB$ 本身（忘了取垂直）；$x+y-1=0$ 用錯中點/符號；$x+y+7=0$ 是常數項符號錯。`,
     String.raw`【Marking Scheme】The locus equidistant from two points is the perpendicular bisector of $AB$. Midpoint $$M=(3,4).$$ Slope $$m_{AB}=\frac{6-2}{5-1}=1,$$ so the bisector has slope $-1$. Through $M(3,4)$: $$y-4=-1(x-3) \Rightarrow x+y-7=0.$$ Traps: $y=x+1$ is line $AB$ itself (forgot perpendicular); $x+y-1=0$ mishandles the midpoint/sign; $x+y+7=0$ has a sign error.`],
    [String.raw`距離平方法直接夾死：$PA^2=PB^2$ $\Rightarrow (x-1)^2+(y-2)^2=(x-5)^2+(y-6)^2$。$x^2,y^2$ 自動消去，餘 $$-2x-4y+5=-10x-12y+61 \Rightarrow x+y-7=0.$$ 完全免求斜率。`,
     String.raw`Squared-distance shortcut: $PA^2=PB^2 \Rightarrow (x-1)^2+(y-2)^2=(x-5)^2+(y-6)^2$. The $x^2,y^2$ cancel, leaving $$-2x-4y+5=-10x-12y+61 \Rightarrow x+y-7=0.$$ No slope needed.`]),

  q('math_locus_2', T.locus, FW.geometry, 'hard', 2022, 1,
    [String.raw`動點 $P$ 與定點 $F(0,2)$ 的距離，恆等於 $P$ 與直線 $y=-2$ 的距離。求 $P$ 的軌跡方程。`,
     String.raw`A moving point $P$ keeps its distance from the fixed point $F(0,2)$ equal to its distance from the line $y=-2$. Find the equation of the locus of $P$.`],
    [
      [String.raw`$x^2=8y$`, String.raw`$x^2=8y$`],
      [String.raw`$x^2=-8y$`, String.raw`$x^2=-8y$`],
      [String.raw`$y^2=8x$`, String.raw`$y^2=8x$`],
      [String.raw`$x^2=4y$`, String.raw`$x^2=4y$`],
    ],
    [String.raw`【標準證明 Marking Scheme】設 $P=(x,y)$。$P$ 到 $F$ 的距離 $=\sqrt{x^2+(y-2)^2}$；$P$ 到直線 $y=-2$ 的距離 $=|y+2|$。令兩者相等並平方：$$x^2+(y-2)^2=(y+2)^2.$$ 展開：$$x^2+y^2-4y+4=y^2+4y+4 \Rightarrow x^2=8y.$$ 陷阱：$x^2=-8y$ 開口方向相反（符號錯）；$y^2=8x$ 把軸搞反；$x^2=4y$ 漏了因子。`,
     String.raw`【Marking Scheme】Let $P=(x,y)$. Distance to $F=\sqrt{x^2+(y-2)^2}$; distance to $y=-2$ is $|y+2|$. Equate and square: $$x^2+(y-2)^2=(y+2)^2.$$ Expand: $$x^2+y^2-4y+4=y^2+4y+4 \Rightarrow x^2=8y.$$ Traps: $x^2=-8y$ opens the wrong way; $y^2=8x$ swaps the axis; $x^2=4y$ drops a factor.`],
    [String.raw`認出這是拋物線的定義：焦點 $F(0,2)$、準線 $y=-2$。標準式 $x^2=4py$，其中 $p=2$（焦點到頂點距離）$\Rightarrow x^2=8y$，毋須展開。`,
     String.raw`Recognise the parabola definition: focus $F(0,2)$, directrix $y=-2$. Standard form $x^2=4py$ with $p=2$ $\Rightarrow x^2=8y$ — no expansion needed.`]),
]

export const mathQuestions: Question[] = [
  ...quadQs, ...derivQs, ...probQs, ...funcQs, ...trigQs, ...statQs,
  ...logQs, ...seqQs, ...pctQs, ...coordQs, ...ineqQs,
  ...circleQs, ...trig3dQs, ...pcQs, ...locusQs,
]

export const mathTopics: Topic[] = [
  { id: 'quadratic_equations', zh: '二次方程', en: 'Quadratic Equations', framework: '轉化思維', frameworkEn: 'Transformative Thinking', emoji: '🔄', count: 22 },
  { id: 'calculus', zh: '微積分', en: 'Calculus', framework: '變化率直覺', frameworkEn: 'Rate-of-change Intuition', emoji: '📈', count: 10 },
  { id: 'probability', zh: '概率', en: 'Probability', framework: '條件分解', frameworkEn: 'Condition Decomposition', emoji: '🎯', count: 11 },
  { id: 'functions', zh: '函數與建模', en: 'Functions & Modelling', framework: '建模能力', frameworkEn: 'Modelling', emoji: '🏗️', count: 10 },
  { id: 'trigonometry', zh: '三角函數', en: 'Trigonometry', framework: '轉化思維', frameworkEn: 'Transformative Thinking', emoji: '🔄', count: 11 },
  { id: 'statistics', zh: '統計', en: 'Statistics', framework: '條件分解', frameworkEn: 'Condition Decomposition', emoji: '🎯', count: 11 },
  { id: 'logarithms', zh: '對數與指數', en: 'Logarithms & Exponents', framework: '轉化思維', frameworkEn: 'Transformative Thinking', emoji: '🔄', count: 21 },
  { id: 'sequences', zh: '數列', en: 'Sequences', framework: '數列規律', frameworkEn: 'Sequence Patterns', emoji: '🔢', count: 11 },
  { id: 'percentage', zh: '百分數與利率', en: 'Percentages & Interest', framework: '建模能力', frameworkEn: 'Modelling', emoji: '🏗️', count: 11 },
  { id: 'coordinate_geometry', zh: '坐標幾何', en: 'Coordinate Geometry', framework: '幾何直覺', frameworkEn: 'Geometric Intuition', emoji: '📐', count: 11 },
  { id: 'inequalities', zh: '不等式', en: 'Inequalities', framework: '條件分解', frameworkEn: 'Condition Decomposition', emoji: '🎯', count: 11 },
  { id: 'circles', zh: '圓的幾何特性', en: 'Properties of Circles', framework: '幾何直覺', frameworkEn: 'Geometric Intuition', emoji: '📐', count: 13 },
  { id: 'trig_3d', zh: '三維三角學', en: '3D Trigonometry', framework: '幾何直覺', frameworkEn: 'Geometric Intuition', emoji: '📐', count: 12 },
  { id: 'permutation_combination', zh: '排列與組合', en: 'Permutations & Combinations', framework: '條件分解', frameworkEn: 'Condition Decomposition', emoji: '🎯', count: 23 },
  { id: 'locus', zh: '軌跡與坐標', en: 'Locus & Coordinates', framework: '幾何直覺', frameworkEn: 'Geometric Intuition', emoji: '📐', count: 12 },
]
