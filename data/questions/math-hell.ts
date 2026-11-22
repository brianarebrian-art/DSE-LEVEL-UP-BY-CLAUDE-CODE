import type { Question, Topic } from './types'
import { makeQ, type Pair, type TopicMeta, type FwMeta } from './_builder'

// Math multi-step hard set —— 掛入【現有】課題 id，令 3:5:2 抽樣池內 hard 更硬。
// 不另設 hell 課題。每條答案均經人手計算。

const q = makeQ('math')
const opt = (v: string): Pair => [`$${v}$`, `$${v}$`]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  quad: { id: 'quadratic_equations', zh: '二次方程', en: 'Quadratic Equations' },
  trig: { id: 'trigonometry', zh: '三角函數', en: 'Trigonometry' },
  prob: { id: 'probability', zh: '概率', en: 'Probability' },
  coord: { id: 'coordinate_geometry', zh: '坐標幾何', en: 'Coordinate Geometry' },
  ineq: { id: 'inequalities', zh: '不等式', en: 'Inequalities' },
  log: { id: 'logarithms', zh: '對數與指數', en: 'Logarithms & Exponents' },
  pc: { id: 'permutation_combination', zh: '排列與組合', en: 'Permutations & Combinations' },
  seq: { id: 'sequences', zh: '數列', en: 'Sequences' },
} satisfies Record<string, TopicMeta>

const FW = {
  transform: { id: 'transform', zh: '轉化思維', en: 'Transformative Thinking', emoji: '🔄' },
  condition: { id: 'condition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  geometry: { id: 'geometry', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
  modelling: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `mathh_${p}_${++uid}`

export const mathHellQuestions: Question[] = [
  q(id('qd'), T.quad, FW.transform, 'hard', 2024, 3,
    C('若方程 $x^2 - (k+1)x + (k-1) = 0$ 有兩個相異正實根，求 $k$ 的取值範圍。',
      'If $x^2 - (k+1)x + (k-1) = 0$ has two distinct positive real roots, find the range of $k$.'),
    [
      C('$k > 1$', '$k > 1$'),
      C('$k \\ge 1$', '$k \\ge 1$'),
      C('$0 < k < 1$', '$0 < k < 1$'),
      C('$k > 0$', '$k > 0$'),
    ],
    C('相異實根：$\\Delta = (k+1)^2 - 4(k-1) = (k-1)^2 + 4 > 0$ 恆成立。兩正根：和 $k+1 > 0$、積 $k-1 > 0 \\Rightarrow k > 1$。\n\n陷阱：以為 $\\Delta$ 仍要另加條件；遺漏「相異」或「正」。',
      'Distinct real roots always hold. Both positive $\\Rightarrow k>1$.\n\n【Trap】 Extra $\\Delta$ constraint; dropping “distinct” or “positive”.')),

  q(id('qd'), T.quad, FW.transform, 'hard', 2023, 3,
    C('已知 $\\alpha$、$\\beta$ 是 $2x^2 - 5x + 1 = 0$ 的根。求 $\\dfrac{1}{\\alpha^2} + \\dfrac{1}{\\beta^2}$。',
      'Let $\\alpha,\\beta$ be roots of $2x^2 - 5x + 1 = 0$. Find $\\dfrac{1}{\\alpha^2} + \\dfrac{1}{\\beta^2}$.'),
    [opt('21'), opt('\\dfrac{21}{4}'), opt('25'), opt('\\dfrac{25}{4}')],
    C('$\\alpha+\\beta=5/2$，$\\alpha\\beta=1/2$。式子 $= \\dfrac{(\\alpha+\\beta)^2-2\\alpha\\beta}{(\\alpha\\beta)^2} = \\dfrac{25/4-1}{1/4}=21$。\n\n陷阱：$21/4$ 漏除積的平方；$25/4$ 只算平方和。',
      'Equals 21 via sum/product identities.\n\n【Trap】 $21/4$ misses $(\\alpha\\beta)^2$; $25/4$ is only $\\alpha^2+\\beta^2$.')),

  q(id('tr'), T.trig, FW.geometry, 'hard', 2024, 3,
    C('在 $\\triangle ABC$ 中，$a = 5$、$b = 7$、$\\angle C = 60^\\circ$。求 $c$。',
      'In $\\triangle ABC$, $a=5$, $b=7$, $\\angle C=60^\\circ$. Find $c$.'),
    [opt('\\sqrt{39}'), opt('\\sqrt{74}'), opt('6'), opt('\\sqrt{24}')],
    C('餘弦定律：$c^2 = 25+49-2\\cdot5\\cdot7\\cdot\\tfrac12 = 39 \\Rightarrow c=\\sqrt{39}$。\n\n陷阱：$\\sqrt{74}$ 漏減餘弦項；把 $60^\\circ$ 當直角。',
      'Cosine rule gives $c=\\sqrt{39}$.\n\n【Trap】 Omitting the cosine term; treating as right-angled.')),

  q(id('pb'), T.prob, FW.condition, 'hard', 2024, 2,
    C('袋中有 4 紅 6 藍球。連抽兩球（不放回）。已知至少一紅，求兩球皆紅的條件概率。',
      'A bag has 4 red and 6 blue balls. Two are drawn without replacement. Given at least one red, find P(both red).'),
    [
      C('$\\dfrac{1}{5}$', '$\\dfrac{1}{5}$'),
      C('$\\dfrac{2}{15}$', '$\\dfrac{2}{15}$'),
      C('$\\dfrac{6}{15}$', '$\\dfrac{6}{15}$'),
      C('$\\dfrac{1}{3}$', '$\\dfrac{1}{3}$'),
    ],
    C('總抽法 $C(10,2)=45$；兩藍 15；至少一紅 30；兩紅 6。條件概率 $6/30=1/5$。\n\n陷阱：$2/15$ 用 45 做分母；$6/15$ 誤讀條件；$1/3$ 當獨立。',
      'Conditional probability $=6/30=1/5$.\n\n【Trap】 Wrong denominator; misreading the condition; assuming independence.')),

  q(id('cg'), T.coord, FW.geometry, 'hard', 2023, 3,
    C('直線 $3x - 4y + 5 = 0$ 上距離原點最近的點的坐標是？',
      'The point on $3x-4y+5=0$ closest to the origin is?'),
    [
      C('$\\left(-\\dfrac{3}{5}, \\dfrac{4}{5}\\right)$', '$\\left(-\\dfrac{3}{5}, \\dfrac{4}{5}\\right)$'),
      C('$\\left(\\dfrac{3}{5}, -\\dfrac{4}{5}\\right)$', '$\\left(\\dfrac{3}{5}, -\\dfrac{4}{5}\\right)$'),
      C('$\\left(0, \\dfrac{5}{4}\\right)$', '$\\left(0, \\dfrac{5}{4}\\right)$'),
      C('$\\left(-\\dfrac{5}{3}, 0\\right)$', '$\\left(-\\dfrac{5}{3}, 0\\right)$'),
    ],
    C('原點到線距離 $|5|/5=1$，單位法向 $(3/5,-4/5)$。因常數項為正，最近點在原點相反方向：$(-3/5,4/5)$。\n\n陷阱：符號反轉；取軸截距。',
      'Foot of perpendicular is $(-3/5,4/5)$.\n\n【Trap】 Sign flip; using an intercept.')),

  q(id('iq'), T.ineq, FW.condition, 'hard', 2024, 2,
    C('解不等式 $\\dfrac{x-1}{x+2} \\ge 3$。',
      'Solve $\\dfrac{x-1}{x+2} \\ge 3$.'),
    [
      C('$-\\dfrac{7}{2} \\le x < -2$', '$-\\dfrac{7}{2} \\le x < -2$'),
      C('$x \\le -\\dfrac{7}{2}$ 或 $x > -2$', '$x \\le -\\dfrac{7}{2}$ or $x > -2$'),
      C('$x \\ge -\\dfrac{7}{2}$', '$x \\ge -\\dfrac{7}{2}$'),
      C('$-2 < x \\le -\\dfrac{7}{2}$', '$-2 < x \\le -\\dfrac{7}{2}$'),
    ],
    C('移項得 $\\dfrac{2x+7}{x+2}\\le 0$，臨界點 $-7/2$、$-2$，解為 $-7/2 \\le x < -2$。\n\n陷阱：包含 $x=-2$；區間方向反。',
      'Equivalent to $\\dfrac{2x+7}{x+2}\\le 0$: $-7/2 \\le x < -2$.\n\n【Trap】 Including $x=-2$; reversed interval.')),

  q(id('lg'), T.log, FW.transform, 'hard', 2024, 2,
    C('若 $\\log_2 (x-1) + \\log_2 (x+1) = 3$，求 $x$。',
      'If $\\log_2(x-1)+\\log_2(x+1)=3$, find $x$.'),
    [opt('3'), opt('\\sqrt{8}'), opt('2'), opt('4')],
    C('定義域 $x>1$。合併 $\\log_2(x^2-1)=3 \\Rightarrow x^2=9 \\Rightarrow x=3$。\n\n陷阱：保留 $x=-3$；忽略真數條件。',
      'Domain $x>1$ yields $x=3$.\n\n【Trap】 Keeping $x=-3$; ignoring domain.')),

  q(id('pc'), T.pc, FW.condition, 'hard', 2023, 2,
    C('由數字 $1,2,3,4,5$ 組成三位數（不重複）。求個位是偶數的數目。',
      'How many 3-digit numbers with distinct digits from $\\{1,2,3,4,5\\}$ end with an even digit?'),
    [opt('24'), opt('36'), opt('48'), opt('18')],
    C('個位：2 或 4（2 個）。其餘 $P(4,2)=12$。總數 $24$。\n\n陷阱：把 1 當偶數；$48$ 允許重複。',
      'Units: 2 choices; then $P(4,2)=12$; total 24.\n\n【Trap】 Counting 1 as even; allowing repeats.')),

  q(id('sq'), T.seq, FW.modelling, 'hard', 2024, 2,
    C('等差數列第 3 項為 8、第 7 項為 20。求第 10 項。',
      'An AP has 3rd term 8 and 7th term 20. Find the 10th term.'),
    [opt('29'), opt('26'), opt('32'), opt('23')],
    C('$a+2d=8$，$a+6d=20 \\Rightarrow d=3$，$a=2$。第 10 項 $a+9d=29$。\n\n陷阱：項差數錯；$d=4$。',
      '$d=3$, $a=2$, 10th term $=29$.\n\n【Trap】 Wrong index gap; wrong $d$.')),
]

/** 全部歸入現有課題，不新增 Topic chips。 */
export const mathHellTopics: Topic[] = []
