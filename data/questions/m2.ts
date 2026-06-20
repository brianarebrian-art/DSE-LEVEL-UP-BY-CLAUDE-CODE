import type { Question, Topic } from './types'
import { makeQ, topicList, rnd, type Pair, type TopicMeta, type FwMeta } from './_builder'

// HKDSE Mathematics Extended Module 2 (Algebra & Calculus) — 120 bilingual.
const q = makeQ('m2')

const T = {
  diff: { id: 'differentiation', zh: '微分法', en: 'Differentiation' },
  integ: { id: 'integration', zh: '積分法', en: 'Integration' },
  limits: { id: 'limits', zh: '極限', en: 'Limits' },
  matrices: { id: 'matrices', zh: '矩陣與行列式', en: 'Matrices & Determinants' },
  vectors: { id: 'vectors', zh: '向量', en: 'Vectors' },
  induction: { id: 'mathematical_induction', zh: '數學歸納法', en: 'Mathematical Induction' },
  calcapp: { id: 'calculus_app', zh: '微積分應用', en: 'Applications of Calculus' },
} satisfies Record<string, TopicMeta>

const FW = {
  rate: { id: 'rate_intuition', zh: '變化率直覺', en: 'Rate-of-change Intuition', emoji: '📈' },
  transform: { id: 'transformation', zh: '轉化思維', en: 'Transformative Thinking', emoji: '🔄' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  geometry: { id: 'geometry', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
  model: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
} satisfies Record<string, FwMeta>

const optm = (v: string): Pair => [`$${v}$`, `$${v}$`]
const opt = (zh: string, en: string): Pair => [zh, en]
let uid = 0
const id = (p: string) => `m2_${p}_${++uid}`
// format c·x^e as LaTeX, collapsing trivial coefficient/exponent
const pw = (c: number, e: number): string => {
  if (e === 0) return `${c}`
  const cs = c === 1 ? '' : c === -1 ? '-' : `${c}`
  const xs = e === 1 ? 'x' : `x^{${e}}`
  return `${cs}${xs}`
}

// ── Differentiation (24) ─────────────────────────────────────────────────────
const diff: Question[] = []
;([[2, 3], [3, 2], [5, 2], [4, 3], [2, 4], [6, 2], [3, 4], [2, 5]] as [number, number][]).forEach(([a, n], i) => {
  diff.push(q(id('dpow'), T.diff, FW.rate, i < 3 ? 'easy' : 'medium', 2019 + (i % 5), 2,
    [`求 $\\frac{d}{dx}(${pw(a, n)})$。`, `Find $\\frac{d}{dx}(${pw(a, n)})$.`],
    [optm(pw(a * n, n - 1)), optm(pw(a * n, n)), optm(pw(a, n - 1)), optm(pw(a, n + 1))],
    [`冪法則：$\\frac{d}{dx}(${pw(a, n)}) = ${a}\\cdot${n}\\,${pw(1, n - 1)} = ${pw(a * n, n - 1)}$。`,
      `Power rule: $\\frac{d}{dx}(${pw(a, n)}) = ${a}\\cdot${n}\\,${pw(1, n - 1)} = ${pw(a * n, n - 1)}$.`]))
})
;([[2, 3], [3, 2], [4, 2], [2, 4]] as [number, number][]).forEach(([a, n], i) => {
  // d/dx (ax+1)^n = n·a·(ax+1)^{n-1}
  diff.push(q(id('dchain'), T.diff, FW.rate, 'medium', 2020 + (i % 4), 3,
    [`求 $\\frac{d}{dx}(${a}x+1)^{${n}}$。`, `Find $\\frac{d}{dx}(${a}x+1)^{${n}}$.`],
    [optm(`${n * a}(${a}x+1)^{${n - 1}}`), optm(`${n}(${a}x+1)^{${n - 1}}`),
      optm(`${n * a}(${a}x+1)^{${n}}`), optm(`${a}(${a}x+1)^{${n - 1}}`)],
    [`鏈式法則：外層 $n(\\cdot)^{n-1}$ 乘內層導數 $${a}$，得 $${n * a}(${a}x+1)^{${n - 1}}$。`,
      `Chain rule: outer $n(\\cdot)^{n-1}$ times inner derivative $${a}$ gives $${n * a}(${a}x+1)^{${n - 1}}$.`]))
})
;([[2, 3], [3, 3], [2, 4], [3, 4]] as [number, number][]).forEach(([a, n], i) => {
  // second derivative of a x^n  → a·n·(n-1) x^{n-2}  (n≥3 keeps all 4 options distinct)
  const c2 = a * n * (n - 1)
  diff.push(q(id('d2'), T.diff, FW.rate, 'medium', 2021 + (i % 3), 3,
    [`求 $${pw(a, n)}$ 的二階導數 $f''(x)$。`, `Find the second derivative $f''(x)$ of $${pw(a, n)}$.`],
    [optm(pw(c2, n - 2)), optm(pw(a * n, n - 1)), optm(pw(c2, n - 1)), optm(pw(a * n, n - 2))],
    [`先求 $f'(x)=${pw(a * n, n - 1)}$，再求導 $f''(x)=${pw(c2, n - 2)}$。`,
      `First $f'(x)=${pw(a * n, n - 1)}$, then $f''(x)=${pw(c2, n - 2)}$.`]))
})
diff.push(
  q(id('dtrig'), T.diff, FW.rate, 'easy', 2023, 2,
    ['求 $\\frac{d}{dx}(\\sin x)$。', 'Find $\\frac{d}{dx}(\\sin x)$.'],
    [optm('\\cos x'), optm('-\\sin x'), optm('-\\cos x'), optm('\\sec^2 x')],
    ['$\\frac{d}{dx}\\sin x = \\cos x$。', '$\\frac{d}{dx}\\sin x = \\cos x$.']),
  q(id('dtrig'), T.diff, FW.rate, 'easy', 2022, 2,
    ['求 $\\frac{d}{dx}(\\cos x)$。', 'Find $\\frac{d}{dx}(\\cos x)$.'],
    [optm('-\\sin x'), optm('\\sin x'), optm('\\cos x'), optm('-\\cos x')],
    ['$\\frac{d}{dx}\\cos x = -\\sin x$。', '$\\frac{d}{dx}\\cos x = -\\sin x$.']),
  q(id('dtrig'), T.diff, FW.rate, 'medium', 2021, 3,
    ['求 $\\frac{d}{dx}(\\sin 2x)$。', 'Find $\\frac{d}{dx}(\\sin 2x)$.'],
    [optm('2\\cos 2x'), optm('\\cos 2x'), optm('2\\cos x'), optm('-2\\cos 2x')],
    ['鏈式法則：$\\frac{d}{dx}\\sin 2x = 2\\cos 2x$。', 'Chain rule: $\\frac{d}{dx}\\sin 2x = 2\\cos 2x$.']),
  q(id('dtrig'), T.diff, FW.rate, 'medium', 2020, 3,
    ['求 $\\frac{d}{dx}(\\tan x)$。', 'Find $\\frac{d}{dx}(\\tan x)$.'],
    [optm('\\sec^2 x'), optm('\\csc^2 x'), optm('-\\sec^2 x'), optm('\\sec x\\tan x')],
    ['$\\frac{d}{dx}\\tan x = \\sec^2 x$。', '$\\frac{d}{dx}\\tan x = \\sec^2 x$.']),
  q(id('dprod'), T.diff, FW.decompose, 'hard', 2023, 4,
    ['用乘積法則求 $\\frac{d}{dx}(x e^x)$。', 'Use the product rule to find $\\frac{d}{dx}(x e^x)$.'],
    [optm('e^x(1+x)'), optm('e^x'), optm('x e^x'), optm('1+e^x')],
    ['$\\frac{d}{dx}(xe^x)=e^x + xe^x = e^x(1+x)$。', '$\\frac{d}{dx}(xe^x)=e^x + xe^x = e^x(1+x)$.']),
  q(id('dprod'), T.diff, FW.decompose, 'hard', 2022, 4,
    ['用乘積法則求 $\\frac{d}{dx}(x^2 \\ln x)$。', 'Use the product rule to find $\\frac{d}{dx}(x^2 \\ln x)$.'],
    [optm('x(2\\ln x + 1)'), optm('2x\\ln x'), optm('2x + \\frac{1}{x}'), optm('x^2/x')],
    ['$2x\\ln x + x^2\\cdot\\frac{1}{x} = 2x\\ln x + x = x(2\\ln x + 1)$。',
      '$2x\\ln x + x^2\\cdot\\frac{1}{x} = 2x\\ln x + x = x(2\\ln x + 1)$.']),
  q(id('dquot'), T.diff, FW.decompose, 'hard', 2021, 4,
    ['$\\frac{d}{dx}\\left(\\frac{x}{x+1}\\right)$ 等於？', 'What is $\\frac{d}{dx}\\left(\\frac{x}{x+1}\\right)$?'],
    [optm('\\frac{1}{(x+1)^2}'), optm('\\frac{1}{x+1}'), optm('\\frac{-1}{(x+1)^2}'), optm('1')],
    ['商法則：$\\frac{(x+1)-x}{(x+1)^2} = \\frac{1}{(x+1)^2}$。', 'Quotient rule: $\\frac{(x+1)-x}{(x+1)^2} = \\frac{1}{(x+1)^2}$.']),
  q(id('dexp'), T.diff, FW.rate, 'medium', 2020, 3,
    ['求 $\\frac{d}{dx}(e^{3x})$。', 'Find $\\frac{d}{dx}(e^{3x})$.'],
    [optm('3e^{3x}'), optm('e^{3x}'), optm('3x e^{3x}'), optm('e^3')],
    ['鏈式法則：$\\frac{d}{dx}e^{3x} = 3e^{3x}$。', 'Chain rule: $\\frac{d}{dx}e^{3x} = 3e^{3x}$.']),
)

// ── Integration (22) ─────────────────────────────────────────────────────────
const integ: Question[] = []
;([[2, 3], [2, 6], [3, 4], [1, 2], [3, 8], [4, 5], [2, 9], [1, 6]] as [number, number][]).forEach(([n, a], i) => {
  // ∫ a x^n dx = a/(n+1) x^{n+1} + C   (a chosen divisible by n+1)
  const c = a / (n + 1)
  integ.push(q(id('ipow'), T.integ, FW.transform, i < 3 ? 'easy' : 'medium', 2019 + (i % 5), 3,
    [`求 $\\int ${pw(a, n)}\\,dx$。`, `Find $\\int ${pw(a, n)}\\,dx$.`],
    [optm(`${pw(c, n + 1)} + C`), optm(`${pw(a, n + 1)} + C`), optm(`${pw(c, n)} + C`), optm(`${pw(a * n, n - 1)} + C`)],
    [`冪法則積分：$\\int ${pw(a, n)}\\,dx = \\frac{${a}}{${n + 1}}${pw(1, n + 1)} + C = ${pw(c, n + 1)} + C$。`,
      `Power rule: $\\int ${pw(a, n)}\\,dx = \\frac{${a}}{${n + 1}}${pw(1, n + 1)} + C = ${pw(c, n + 1)} + C$.`]))
})
;([[3, 2], [2, 4], [1, 4], [2, 3], [3, 4], [1, 6]] as [number, number][]).forEach(([a, b], i) => {
  // ∫_0^b a x dx = a b² / 2   (params chosen so a≠b and ans∉{a,b}: all 4 options distinct)
  const ans = a * b * b / 2
  integ.push(q(id('idef'), T.integ, FW.transform, 'medium', 2020 + (i % 4), 3,
    [`求定積分 $\\int_0^{${b}} ${a}x\\,dx$。`, `Evaluate $\\int_0^{${b}} ${a}x\\,dx$.`],
    [optm(`${rnd(ans)}`), optm(`${a * b * b}`), optm(`${ans + a}`), optm(`${ans + b}`)],
    [`$\\int_0^{${b}} ${a}x\\,dx = \\left[\\frac{${a}x^2}{2}\\right]_0^{${b}} = ${rnd(ans)}$。`,
      `$\\int_0^{${b}} ${a}x\\,dx = \\left[\\frac{${a}x^2}{2}\\right]_0^{${b}} = ${rnd(ans)}$.`]))
})
integ.push(
  q(id('isp'), T.integ, FW.transform, 'easy', 2023, 2,
    ['求 $\\int e^x\\,dx$。', 'Find $\\int e^x\\,dx$.'],
    [optm('e^x + C'), optm('x e^x + C'), optm('\\frac{e^x}{x} + C'), optm('e^{x+1} + C')],
    ['$\\int e^x\\,dx = e^x + C$。', '$\\int e^x\\,dx = e^x + C$.']),
  q(id('isp'), T.integ, FW.transform, 'medium', 2022, 3,
    ['求 $\\int \\frac{1}{x}\\,dx$。', 'Find $\\int \\frac{1}{x}\\,dx$.'],
    [optm('\\ln|x| + C'), optm('-\\frac{1}{x^2} + C'), optm('\\frac{x^2}{2} + C'), optm('\\frac{1}{x^2} + C')],
    ['$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$。', '$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.']),
  q(id('isp'), T.integ, FW.transform, 'medium', 2021, 3,
    ['求 $\\int \\cos x\\,dx$。', 'Find $\\int \\cos x\\,dx$.'],
    [optm('\\sin x + C'), optm('-\\sin x + C'), optm('\\cos x + C'), optm('-\\cos x + C')],
    ['$\\int \\cos x\\,dx = \\sin x + C$。', '$\\int \\cos x\\,dx = \\sin x + C$.']),
  q(id('isp'), T.integ, FW.transform, 'medium', 2020, 3,
    ['求 $\\int \\sin x\\,dx$。', 'Find $\\int \\sin x\\,dx$.'],
    [optm('-\\cos x + C'), optm('\\cos x + C'), optm('\\sin x + C'), optm('-\\sin x + C')],
    ['$\\int \\sin x\\,dx = -\\cos x + C$。', '$\\int \\sin x\\,dx = -\\cos x + C$.']),
  q(id('isp'), T.integ, FW.transform, 'medium', 2019, 3,
    ['求 $\\int e^{2x}\\,dx$。', 'Find $\\int e^{2x}\\,dx$.'],
    [optm('\\frac{1}{2}e^{2x} + C'), optm('2e^{2x} + C'), optm('e^{2x} + C'), optm('\\frac{e^{2x}}{2x} + C')],
    ['$\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + C$。', '$\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + C$.']),
  q(id('isp'), T.integ, FW.transform, 'easy', 2023, 2,
    ['求 $\\int 5\\,dx$（對常數積分）。', 'Find $\\int 5\\,dx$ (integral of a constant).'],
    [optm('5x + C'), optm('5 + C'), optm('0 + C'), optm('\\frac{5}{x} + C')],
    ['$\\int k\\,dx = kx + C$，所以 $\\int 5\\,dx = 5x + C$。', '$\\int k\\,dx = kx + C$, so $\\int 5\\,dx = 5x + C$.']),
  q(id('idprop'), T.integ, FW.transform, 'medium', 2022, 3,
    ['$\\int_a^a f(x)\\,dx$ 等於？', 'What is $\\int_a^a f(x)\\,dx$?'],
    [optm('0'), optm('f(a)'), optm('1'), optm('a')],
    ['上下限相同的定積分為 0。', 'A definite integral with equal limits is 0.']),
  q(id('idprop'), T.integ, FW.transform, 'hard', 2021, 3,
    ['若 $\\int_a^b f(x)dx = 5$，則 $\\int_b^a f(x)dx$ 等於？', 'If $\\int_a^b f(x)dx = 5$, what is $\\int_b^a f(x)dx$?'],
    [optm('-5'), optm('5'), optm('0'), optm('10')],
    ['交換上下限會變號：$\\int_b^a = -\\int_a^b = -5$。', 'Swapping limits flips the sign: $\\int_b^a = -\\int_a^b = -5$.']),
)

// ── Limits (14) ──────────────────────────────────────────────────────────────
const limits: Question[] = []
;([3, 4, 5, 6, 7, 8] as number[]).forEach((a, i) => {
  // lim_{x→a} (x²−a²)/(x−a) = 2a   (a≥3 keeps 2a, a, a² all distinct)
  limits.push(q(id('lfac'), T.limits, FW.transform, i < 3 ? 'medium' : 'hard', 2019 + (i % 5), 3,
    [`求 $\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x - ${a}}$。`, `Find $\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x - ${a}}$.`],
    [optm(`${2 * a}`), optm(`${a}`), optm(`${a * a}`), optm('0')],
    [`$\\frac{(x-${a})(x+${a})}{x-${a}} = x + ${a}$，代入得 $${2 * a}$。`,
      `$\\frac{(x-${a})(x+${a})}{x-${a}} = x + ${a}$, substituting gives $${2 * a}$.`]))
})
;([2, 3, 5, 4] as number[]).forEach((k, i) => {
  // lim_{x→0} sin(kx)/x = k
  limits.push(q(id('lsin'), T.limits, FW.transform, 'hard', 2020 + (i % 4), 3,
    [`求 $\\lim_{x \\to 0} \\frac{\\sin ${k}x}{x}$。`, `Find $\\lim_{x \\to 0} \\frac{\\sin ${k}x}{x}$.`],
    [optm(`${k}`), optm('1'), optm('0'), optm(`${k * k}`)],
    [`改寫為 $${k}\\cdot\\frac{\\sin ${k}x}{${k}x}$，極限 $= ${k}\\times 1 = ${k}$。`,
      `Rewrite as $${k}\\cdot\\frac{\\sin ${k}x}{${k}x}$; the limit is $${k}\\times 1 = ${k}$.`]))
})
limits.push(
  q(id('lc'), T.limits, FW.transform, 'easy', 2023, 2,
    ['求 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$。', 'Find $\\lim_{x \\to 0} \\frac{\\sin x}{x}$.'],
    [optm('1'), optm('0'), optm('\\infty'), optm('不存在 / DNE')],
    ['這是標準極限：$\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1$。', 'This is the standard limit $\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1$.']),
  q(id('lc'), T.limits, FW.transform, 'medium', 2022, 3,
    ['求 $\\lim_{x \\to \\infty} \\frac{1}{x}$。', 'Find $\\lim_{x \\to \\infty} \\frac{1}{x}$.'],
    [optm('0'), optm('1'), optm('\\infty'), optm('-1')],
    ['$x$ 越大 $\\frac{1}{x}$ 越接近 0。', 'As $x$ grows, $\\frac{1}{x}$ approaches 0.']),
  q(id('lc'), T.limits, FW.transform, 'medium', 2021, 3,
    ['函數在某點連續的條件之一是？', 'One condition for a function to be continuous at a point is that?'],
    [opt('左右極限相等且等於函數值 / left and right limits are equal and equal the function value',
      '左右極限相等且等於函數值 / left and right limits are equal and equal the function value'),
      opt('函數無定義 / the function is undefined there', '函數無定義 / the function is undefined there'),
      opt('導數不存在 / the derivative does not exist', '導數不存在 / the derivative does not exist'),
      opt('極限為無限大 / the limit is infinite', '極限為無限大 / the limit is infinite')],
    ['連續：極限存在、函數有定義、兩者相等。', 'Continuity: the limit exists, the function is defined, and they are equal.']),
  q(id('lc'), T.limits, FW.transform, 'hard', 2020, 3,
    ['求 $\\lim_{x \\to \\infty} \\frac{3x^2 + 1}{x^2 + x}$。', 'Find $\\lim_{x \\to \\infty} \\frac{3x^2 + 1}{x^2 + x}$.'],
    [optm('3'), optm('1'), optm('\\infty'), optm('0')],
    ['同除以最高次 $x^2$，比值趨近 $\\frac{3}{1}=3$。', 'Divide by the highest power $x^2$; the ratio tends to $\\frac{3}{1}=3$.']),
)

// ── Matrices & determinants (20) ─────────────────────────────────────────────
const matrices: Question[] = []
;([[2, 1, 3, 4], [3, 2, 1, 5], [4, 1, 2, 3], [2, 3, 1, 4], [5, 2, 1, 3], [3, 1, 4, 2], [2, 2, 1, 5], [4, 3, 2, 5]] as [number, number, number, number][]).forEach(([a, b, c, d], i) => {
  const det = a * d - b * c
  matrices.push(q(id('det'), T.matrices, FW.decompose, i < 3 ? 'easy' : 'medium', 2019 + (i % 5), 3,
    [`求 $\\det\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$。`, `Find $\\det\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$.`],
    [optm(`${det}`), optm(`${a * d + b * c}`), optm(`${b * c - a * d}`), optm(`${a * d}`)],
    [`$\\det = ad - bc = (${a})(${d}) - (${b})(${c}) = ${det}$。`,
      `$\\det = ad - bc = (${a})(${d}) - (${b})(${c}) = ${det}$.`]))
})
matrices.push(
  q(id('mc'), T.matrices, FW.decompose, 'easy', 2023, 2,
    ['$2\\times 2$ 單位矩陣 $I$ 的行列式 $\\det(I)$ 是？', 'The determinant $\\det(I)$ of the $2\\times 2$ identity matrix is?'],
    [optm('1'), optm('0'), optm('2'), optm('4')],
    ['$\\det(I) = (1)(1) - (0)(0) = 1$。', '$\\det(I) = (1)(1) - (0)(0) = 1$.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2022, 3,
    ['若 $\\det(A) = 0$，則矩陣 $A$ 是？', 'If $\\det(A) = 0$, then matrix $A$ is?'],
    [opt('奇異（不可逆）/ singular (non-invertible)', '奇異（不可逆）/ singular (non-invertible)'),
      opt('可逆 / invertible', '可逆 / invertible'),
      opt('單位矩陣 / the identity', '單位矩陣 / the identity'),
      opt('對稱 / symmetric', '對稱 / symmetric')],
    ['$\\det(A)=0$ 表示 $A$ 沒有逆矩陣，稱為奇異矩陣。', '$\\det(A)=0$ means $A$ has no inverse — it is singular.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2021, 3,
    ['$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 0 & 1 \\\\ 2 & 1 \\end{pmatrix}$ 等於？', 'What is $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 0 & 1 \\\\ 2 & 1 \\end{pmatrix}$?'],
    [optm('\\begin{pmatrix} 1 & 3 \\\\ 5 & 5 \\end{pmatrix}'), optm('\\begin{pmatrix} 1 & 2 \\\\ 5 & 5 \\end{pmatrix}'),
      optm('\\begin{pmatrix} 0 & 2 \\\\ 6 & 4 \\end{pmatrix}'), optm('\\begin{pmatrix} 1 & 3 \\\\ 5 & 4 \\end{pmatrix}')],
    ['矩陣相加 = 對應元素相加。', 'Matrix addition adds corresponding entries.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2020, 3,
    ['$3\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$ 等於？', 'What is $3\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$?'],
    [optm('\\begin{pmatrix} 3 & 6 \\\\ 0 & 3 \\end{pmatrix}'), optm('\\begin{pmatrix} 3 & 2 \\\\ 0 & 1 \\end{pmatrix}'),
      optm('\\begin{pmatrix} 1 & 6 \\\\ 0 & 3 \\end{pmatrix}'), optm('\\begin{pmatrix} 4 & 5 \\\\ 3 & 4 \\end{pmatrix}')],
    ['純量乘法 = 每個元素乘以 3。', 'Scalar multiplication multiplies every entry by 3.']),
  q(id('mc'), T.matrices, FW.decompose, 'hard', 2023, 4,
    ['對 $2\\times 2$ 矩陣，$\\det(2A)$ 與 $\\det(A)$ 的關係是？', 'For a $2\\times 2$ matrix, how does $\\det(2A)$ relate to $\\det(A)$?'],
    [optm('\\det(2A) = 4\\det(A)'), optm('\\det(2A) = 2\\det(A)'), optm('\\det(2A) = \\det(A)'), optm('\\det(2A) = 8\\det(A)')],
    ['$n\\times n$ 時 $\\det(kA)=k^n\\det(A)$；$n=2$ 故為 $4\\det(A)$。', 'For $n\\times n$, $\\det(kA)=k^n\\det(A)$; with $n=2$ this is $4\\det(A)$.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2022, 3,
    ['矩陣乘法一般而言？', 'Matrix multiplication is, in general?'],
    [opt('不可交換（$AB \\neq BA$）/ not commutative ($AB \\neq BA$)', '不可交換（$AB \\neq BA$）/ not commutative ($AB \\neq BA$)'),
      opt('可交換 / commutative', '可交換 / commutative'),
      opt('永遠等於零 / always zero', '永遠等於零 / always zero'),
      opt('未定義 / undefined', '未定義 / undefined')],
    ['一般 $AB \\neq BA$，矩陣乘法不可交換。', 'In general $AB \\neq BA$ — matrix multiplication is not commutative.']),
  q(id('mc'), T.matrices, FW.decompose, 'hard', 2021, 4,
    ['$2\\times 2$ 矩陣 $A=\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的逆矩陣存在的條件是？', 'The inverse of $A=\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ exists provided?'],
    [optm('ad - bc \\neq 0'), optm('ad - bc = 0'), optm('a = d'), optm('b = c')],
    ['當 $\\det(A)=ad-bc\\neq 0$ 時逆矩陣存在。', 'The inverse exists when $\\det(A)=ad-bc\\neq 0$.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2020, 3,
    ['$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 5 & 2 \\\\ 3 & 7 \\end{pmatrix}$ 等於？', 'What is $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 5 & 2 \\\\ 3 & 7 \\end{pmatrix}$?'],
    [optm('\\begin{pmatrix} 5 & 2 \\\\ 3 & 7 \\end{pmatrix}'), optm('\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}'),
      optm('\\begin{pmatrix} 5 & 0 \\\\ 0 & 7 \\end{pmatrix}'), optm('\\begin{pmatrix} 8 & 9 \\\\ 8 & 9 \\end{pmatrix}')],
    ['單位矩陣乘任何矩陣保持不變：$IA = A$。', 'The identity leaves any matrix unchanged: $IA = A$.']),
  q(id('mc'), T.matrices, FW.decompose, 'hard', 2019, 4,
    ['$\\det(AB)$ 等於？', 'What does $\\det(AB)$ equal?'],
    [optm('\\det(A)\\det(B)'), optm('\\det(A) + \\det(B)'), optm('\\det(A) - \\det(B)'), optm('\\det(A)/\\det(B)')],
    ['行列式可乘性：$\\det(AB) = \\det(A)\\det(B)$。', 'Determinants are multiplicative: $\\det(AB) = \\det(A)\\det(B)$.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2023, 3,
    ['轉置 $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}^T$ 等於？', 'The transpose $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}^T$ equals?'],
    [optm('\\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}'), optm('\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}'),
      optm('\\begin{pmatrix} 4 & 3 \\\\ 2 & 1 \\end{pmatrix}'), optm('\\begin{pmatrix} 4 & 2 \\\\ 3 & 1 \\end{pmatrix}')],
    ['轉置 = 行列互換。', 'Transposing swaps rows and columns.']),
  q(id('mc'), T.matrices, FW.decompose, 'medium', 2022, 3,
    ['$\\det\\begin{pmatrix} a & b \\\\ a & b \\end{pmatrix}$（兩行相同）等於？', 'What is $\\det\\begin{pmatrix} a & b \\\\ a & b \\end{pmatrix}$ (identical rows)?'],
    [optm('0'), optm('ab'), optm('a^2 - b^2'), optm('2ab')],
    ['兩行相同的行列式為 0。', 'A determinant with two identical rows is 0.']),
  q(id('mc'), T.matrices, FW.decompose, 'hard', 2021, 4,
    ['二元一次方程組有唯一解的條件是其係數矩陣？', 'A system of two linear equations has a unique solution when its coefficient matrix?'],
    [opt('行列式不為零 / has a non-zero determinant', '行列式不為零 / has a non-zero determinant'),
      opt('行列式為零 / has a zero determinant', '行列式為零 / has a zero determinant'),
      opt('是零矩陣 / is the zero matrix', '是零矩陣 / is the zero matrix'),
      opt('沒有逆矩陣 / has no inverse', '沒有逆矩陣 / has no inverse')],
    ['係數矩陣 $\\det \\neq 0$（可逆）時方程組有唯一解。', 'A non-zero (invertible) coefficient determinant gives a unique solution.']),
)

// ── Vectors (20) ─────────────────────────────────────────────────────────────
const vectors: Question[] = []
;([[3, 4, 1, 2], [1, 2, 4, 3], [2, 1, 3, 5], [5, 2, 3, 1], [2, 3, 4, 1], [4, 1, 2, 5]] as [number, number, number, number][]).forEach(([ax, ay, bx, by], i) => {
  // params have ax≠ay and bx≠by so the cross-term distractor ≠ the true dot product
  const dot = ax * bx + ay * by
  vectors.push(q(id('dot'), T.vectors, FW.geometry, i < 3 ? 'easy' : 'medium', 2019 + (i % 5), 3,
    [`設 $\\vec{a}=(${ax}, ${ay})$、$\\vec{b}=(${bx}, ${by})$，求 $\\vec{a}\\cdot\\vec{b}$。`, `Given $\\vec{a}=(${ax}, ${ay})$ and $\\vec{b}=(${bx}, ${by})$, find $\\vec{a}\\cdot\\vec{b}$.`],
    [optm(`${dot}`), optm(`${ax * bx}`), optm(`${ax * by + ay * bx}`), optm(`${(ax + ay) * (bx + by)}`)],
    [`點積 $= ${ax}\\cdot${bx} + ${ay}\\cdot${by} = ${dot}$。`, `Dot product $= ${ax}\\cdot${bx} + ${ay}\\cdot${by} = ${dot}$.`]))
})
;([[3, 4], [6, 8], [5, 12], [8, 6], [9, 12], [7, 24]] as [number, number][]).forEach(([x, y], i) => {
  const mag = Math.sqrt(x * x + y * y)
  vectors.push(q(id('mag'), T.vectors, FW.geometry, i < 3 ? 'easy' : 'medium', 2020 + (i % 4), 3,
    [`求向量 $(${x}, ${y})$ 的模長 $|\\vec{v}|$。`, `Find the magnitude $|\\vec{v}|$ of $(${x}, ${y})$.`],
    [optm(`${rnd(mag)}`), optm(`${x + y}`), optm(`${x * x + y * y}`), optm(`${rnd(mag + 1)}`)],
    [`$|\\vec{v}| = \\sqrt{${x}^2 + ${y}^2} = \\sqrt{${x * x + y * y}} = ${rnd(mag)}$。`,
      `$|\\vec{v}| = \\sqrt{${x}^2 + ${y}^2} = \\sqrt{${x * x + y * y}} = ${rnd(mag)}$.`]))
})
vectors.push(
  q(id('vc'), T.vectors, FW.geometry, 'easy', 2023, 2,
    ['$(1, 2) + (3, 4)$ 等於？', 'What is $(1, 2) + (3, 4)$?'],
    [optm('(4, 6)'), optm('(3, 8)'), optm('(4, 8)'), optm('(2, 2)')],
    ['向量加法逐分量相加：$(1+3, 2+4)=(4,6)$。', 'Add componentwise: $(1+3, 2+4)=(4,6)$.']),
  q(id('vc'), T.vectors, FW.geometry, 'easy', 2022, 2,
    ['$3(2, -1)$ 等於？', 'What is $3(2, -1)$?'],
    [optm('(6, -3)'), optm('(5, 2)'), optm('(6, -1)'), optm('(2, -3)')],
    ['純量乘法逐分量相乘：$(3\\cdot 2, 3\\cdot(-1))=(6,-3)$。', 'Scalar multiply each component: $(6,-3)$.']),
  q(id('vc'), T.vectors, FW.geometry, 'medium', 2021, 3,
    ['兩非零向量垂直的條件是其點積？', 'Two non-zero vectors are perpendicular when their dot product is?'],
    [optm('0'), optm('1'), optm('-1'), optm('|\\vec a||\\vec b|')],
    ['垂直 ⟺ $\\vec{a}\\cdot\\vec{b} = 0$。', 'Perpendicular ⟺ $\\vec{a}\\cdot\\vec{b} = 0$.']),
  q(id('vc'), T.vectors, FW.geometry, 'medium', 2020, 3,
    ['$(2, 4)$ 與下列哪個向量垂直？', 'Which vector is perpendicular to $(2, 4)$?'],
    [optm('(2, -1)'), optm('(4, 2)'), optm('(2, 4)'), optm('(1, 2)')],
    ['$(2,4)\\cdot(2,-1) = 4 - 4 = 0$，故垂直。', '$(2,4)\\cdot(2,-1) = 4 - 4 = 0$, so they are perpendicular.']),
  q(id('vc'), T.vectors, FW.geometry, 'hard', 2023, 3,
    ['向量 $\\vec{a}=(3,4)$ 的單位向量是？', 'The unit vector in the direction of $\\vec{a}=(3,4)$ is?'],
    [optm('(\\tfrac{3}{5}, \\tfrac{4}{5})'), optm('(3, 4)'), optm('(\\tfrac{1}{3}, \\tfrac{1}{4})'), optm('(\\tfrac{4}{5}, \\tfrac{3}{5})')],
    ['單位向量 $= \\vec{a}/|\\vec{a}| = (3,4)/5$。', 'Unit vector $= \\vec{a}/|\\vec{a}| = (3,4)/5$.']),
  q(id('vc'), T.vectors, FW.geometry, 'medium', 2022, 3,
    ['平行向量 $\\vec{b}$ 可寫成 $\\vec{b} = k\\vec{a}$，其中 $k$ 是？', 'Parallel vectors satisfy $\\vec{b} = k\\vec{a}$ where $k$ is a?'],
    [opt('純量 / scalar', '純量 / scalar'), opt('向量 / vector', '向量 / vector'),
      opt('矩陣 / matrix', '矩陣 / matrix'), opt('零 / zero only', '零 / zero only')],
    ['平行向量相差一個純量倍數 $k$。', 'Parallel vectors differ by a scalar multiple $k$.']),
  q(id('vc'), T.vectors, FW.geometry, 'easy', 2021, 2,
    ['零向量 $\\vec{0}$ 的模長是？', 'The magnitude of the zero vector $\\vec{0}$ is?'],
    [optm('0'), optm('1'), optm('\\infty'), optm('未定義 / undefined')],
    ['零向量模長為 0。', 'The zero vector has magnitude 0.']),
  q(id('vc'), T.vectors, FW.geometry, 'hard', 2020, 4,
    ['$\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$。若 $\\vec a\\cdot\\vec b > 0$，則夾角 $\\theta$？', 'In $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$, if $\\vec a\\cdot\\vec b > 0$ then angle $\\theta$ is?'],
    [opt('銳角（$<90°$）/ acute ($<90°$)', '銳角（$<90°$）/ acute ($<90°$)'),
      opt('鈍角（$>90°$）/ obtuse ($>90°$)', '鈍角（$>90°$）/ obtuse ($>90°$)'),
      opt('直角 / right angle', '直角 / right angle'),
      opt('平角 / straight angle', '平角 / straight angle')],
    ['點積為正 ⟹ $\\cos\\theta>0$ ⟹ 夾角為銳角。', 'A positive dot product means $\\cos\\theta>0$, so the angle is acute.']),
)

// ── Mathematical induction (8) ───────────────────────────────────────────────
const induction: Question[] = [
  q(id('mi'), T.induction, FW.decompose, 'medium', 2023, 3,
    ['數學歸納法的第一步（基礎步）是？', 'The first step (base case) of mathematical induction is to?'],
    [opt('驗證 $n=1$（或起始值）成立 / verify the statement for $n=1$ (or the starting value)', '驗證 $n=1$（或起始值）成立 / verify the statement for $n=1$ (or the starting value)'),
      opt('假設 $n=k$ 成立 / assume it holds for $n=k$', '假設 $n=k$ 成立 / assume it holds for $n=k$'),
      opt('證明 $n=k+1$ / prove it for $n=k+1$', '證明 $n=k+1$ / prove it for $n=k+1$'),
      opt('對所有 $n$ 求和 / sum over all $n$', '對所有 $n$ 求和 / sum over all $n$')],
    ['基礎步先驗證最小的 $n$（通常 $n=1$）成立。', 'The base case verifies the smallest $n$ (usually $n=1$).']),
  q(id('mi'), T.induction, FW.decompose, 'medium', 2022, 3,
    ['歸納步（inductive step）中我們？', 'In the inductive step we?'],
    [opt('假設 $n=k$ 成立，證明 $n=k+1$ 成立 / assume $n=k$ holds and prove $n=k+1$', '假設 $n=k$ 成立，證明 $n=k+1$ 成立 / assume $n=k$ holds and prove $n=k+1$'),
      opt('只驗證 $n=1$ / only check $n=1$', '只驗證 $n=1$ / only check $n=1$'),
      opt('代入所有數值 / substitute all values', '代入所有數值 / substitute all values'),
      opt('求導數 / differentiate', '求導數 / differentiate')],
    ['歸納步：由 $n=k$ 的假設推出 $n=k+1$ 成立。', 'Inductive step: assuming $n=k$, deduce $n=k+1$.']),
  q(id('mi'), T.induction, FW.decompose, 'hard', 2021, 4,
    ['證明 $1+2+\\cdots+n = \\frac{n(n+1)}{2}$，當 $n=k+1$ 時目標式右邊是？', 'Proving $1+2+\\cdots+n = \\frac{n(n+1)}{2}$, the target right side for $n=k+1$ is?'],
    [optm('\\frac{(k+1)(k+2)}{2}'), optm('\\frac{k(k+1)}{2}+1'), optm('\\frac{(k+1)(k+2)}{2}+k'), optm('\\frac{k(k+2)}{2}')],
    ['將 $n=k+1$ 代入公式得 $\\frac{(k+1)(k+2)}{2}$。', 'Substituting $n=k+1$ gives $\\frac{(k+1)(k+2)}{2}$.']),
  q(id('mi'), T.induction, FW.decompose, 'medium', 2020, 3,
    ['數學歸納法用來證明的命題通常涉及？', 'Mathematical induction typically proves statements involving?'],
    [opt('所有正整數 $n$ / all positive integers $n$', '所有正整數 $n$ / all positive integers $n$'),
      opt('所有實數 / all real numbers', '所有實數 / all real numbers'),
      opt('複數 / complex numbers', '複數 / complex numbers'),
      opt('無理數 / irrational numbers', '無理數 / irrational numbers')],
    ['歸納法適用於關於正整數的命題。', 'Induction proves statements about positive integers.']),
  q(id('mi'), T.induction, FW.decompose, 'hard', 2023, 4,
    ['證明 $1+3+5+\\cdots+(2n-1) = n^2$，基礎步 $n=1$ 左邊與右邊分別是？', 'For $1+3+5+\\cdots+(2n-1) = n^2$, the base case $n=1$ gives LHS and RHS of?'],
    [opt('$1$ 與 $1$ / $1$ and $1$', '$1$ 與 $1$ / $1$ and $1$'),
      opt('$0$ 與 $1$ / $0$ and $1$', '$0$ 與 $1$ / $0$ and $1$'),
      opt('$1$ 與 $0$ / $1$ and $0$', '$1$ 與 $0$ / $1$ and $0$'),
      opt('$3$ 與 $4$ / $3$ and $4$', '$3$ 與 $4$ / $3$ and $4$')],
    ['$n=1$：左邊 $=1$，右邊 $=1^2=1$，兩者相等。', 'At $n=1$: LHS $=1$, RHS $=1^2=1$ — they match.']),
  q(id('mi'), T.induction, FW.decompose, 'medium', 2022, 3,
    ['若只證明歸納步而不驗證基礎步，會怎樣？', 'Proving only the inductive step but not the base case means?'],
    [opt('證明不完整，結論不成立 / the proof is incomplete and invalid', '證明不完整，結論不成立 / the proof is incomplete and invalid'),
      opt('證明仍然完整 / the proof is still complete', '證明仍然完整 / the proof is still complete'),
      opt('不需基礎步 / the base case is unnecessary', '不需基礎步 / the base case is unnecessary'),
      opt('自動對所有 $n$ 成立 / it holds for all $n$ automatically', '自動對所有 $n$ 成立 / it holds for all $n$ automatically')],
    ['缺少基礎步，骨牌沒有起點，證明無效。', 'Without the base case the "dominoes" have no starting point — the proof fails.']),
  q(id('mi'), T.induction, FW.decompose, 'hard', 2021, 4,
    ['歸納假設（inductive hypothesis）是指？', 'The inductive hypothesis is the assumption that?'],
    [opt('命題對 $n=k$ 成立 / the statement holds for $n=k$', '命題對 $n=k$ 成立 / the statement holds for $n=k$'),
      opt('命題對所有 $n$ 成立 / the statement holds for all $n$', '命題對所有 $n$ 成立 / the statement holds for all $n$'),
      opt('命題對 $n=k+1$ 成立 / the statement holds for $n=k+1$', '命題對 $n=k+1$ 成立 / the statement holds for $n=k+1$'),
      opt('命題不成立 / the statement is false', '命題不成立 / the statement is false')],
    ['歸納假設：假設命題對 $n=k$ 成立，用以推 $n=k+1$。', 'The inductive hypothesis assumes the statement for $n=k$, used to prove $n=k+1$.']),
  q(id('mi'), T.induction, FW.decompose, 'medium', 2020, 3,
    ['數學歸納法常被類比為？', 'Mathematical induction is often compared to?'],
    [opt('一列骨牌相繼倒下 / a line of dominoes toppling', '一列骨牌相繼倒下 / a line of dominoes toppling'),
      opt('擲骰子 / rolling dice', '擲骰子 / rolling dice'),
      opt('一次過驗證 / checking all at once', '一次過驗證 / checking all at once'),
      opt('猜測答案 / guessing the answer', '猜測答案 / guessing the answer')],
    ['骨牌類比：第一塊倒（基礎步）+ 每塊倒會推倒下一塊（歸納步）。', 'Domino analogy: the first falls (base) and each fall topples the next (step).']),
]

// ── Applications of calculus (12) ────────────────────────────────────────────
const calcapp: Question[] = []
;([[4, 7], [6, 5], [4, 9], [8, 3], [6, 11], [2, 9]] as [number, number][]).forEach(([b, c], i) => {
  // f(x)=x²−bx+c, min at x=b/2, value c − b²/4. Distractors: c, the x-location b/2, and the sign-error c+b²/4
  const minv = c - (b * b) / 4
  calcapp.push(q(id('camin'), T.calcapp, FW.model, i < 3 ? 'medium' : 'hard', 2019 + (i % 5), 3,
    [`求 $f(x)=x^2 - ${b}x + ${c}$ 的極小值。`, `Find the minimum value of $f(x)=x^2 - ${b}x + ${c}$.`],
    [optm(`${rnd(minv)}`), optm(`${c}`), optm(`${b / 2}`), optm(`${rnd(c + (b * b) / 4)}`)],
    [`$f'(x)=2x-${b}=0 \\Rightarrow x=${b / 2}$，$f(${b / 2})=${rnd(minv)}$。`,
      `$f'(x)=2x-${b}=0 \\Rightarrow x=${b / 2}$, and $f(${b / 2})=${rnd(minv)}$.`]))
})
;([[3, 2], [2, 3], [4, 2]] as [number, number][]).forEach(([n, x0], i) => {
  // slope of y=x^n at x=x0 is n·x0^{n-1}  (x0≥2 and n≠x0 keep slope, x0^n, n distinct)
  const slope = n * Math.pow(x0, n - 1)
  calcapp.push(q(id('catan'), T.calcapp, FW.rate, 'medium', 2020 + (i % 3), 3,
    [`曲線 $y=x^{${n}}$ 在 $x=${x0}$ 處的切線斜率是？`, `The slope of the tangent to $y=x^{${n}}$ at $x=${x0}$ is?`],
    [optm(`${slope}`), optm(`${Math.pow(x0, n)}`), optm(`${n}`), optm(`${slope + n}`)],
    [`$\\frac{dy}{dx}=${n}x^{${n - 1}}$，代入 $x=${x0}$ 得斜率 $${slope}$。`,
      `$\\frac{dy}{dx}=${n}x^{${n - 1}}$; at $x=${x0}$ the slope is $${slope}$.`]))
})
;([2, 4, 5] as number[]).forEach((b, i) => {
  // area under y=x² from 0 to b = b³/3  (avoid b∈{1,3} where b² or b³ would equal the answer)
  const area = (b * b * b) / 3
  calcapp.push(q(id('caarea'), T.calcapp, FW.model, 'hard', 2021 + (i % 3), 4,
    [`求 $y=x^2$、$x$ 軸與 $x=${b}$ 所圍面積。`, `Find the area bounded by $y=x^2$, the $x$-axis and $x=${b}$.`],
    [optm(`\\frac{${b * b * b}}{3}`), optm(`${b * b}`), optm(`${b * b * b}`), optm(`\\frac{${b * b}}{2}`)],
    [`面積 $=\\int_0^{${b}} x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^{${b}} = \\frac{${b * b * b}}{3}$。`,
      `Area $=\\int_0^{${b}} x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^{${b}} = \\frac{${b * b * b}}{3}$.`]))
})

export const m2Questions: Question[] = [
  ...diff, ...integ, ...limits, ...matrices, ...vectors, ...induction, ...calcapp,
]

export const m2Topics: Topic[] = topicList([
  { topic: T.diff, fw: FW.rate, count: diff.length },
  { topic: T.integ, fw: FW.transform, count: integ.length },
  { topic: T.limits, fw: FW.transform, count: limits.length },
  { topic: T.matrices, fw: FW.decompose, count: matrices.length },
  { topic: T.vectors, fw: FW.geometry, count: vectors.length },
  { topic: T.induction, fw: FW.decompose, count: induction.length },
  { topic: T.calcapp, fw: FW.model, count: calcapp.length },
])
