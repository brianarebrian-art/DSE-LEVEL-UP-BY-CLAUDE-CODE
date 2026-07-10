import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// M1 (Calculus & Statistics) "hell" set (5★★). STRICTLY in-syllabus: binomial,
// Poisson, normal distribution, mean/variance — NOT Lagrange multipliers (that is
// university-level, outside DSE M1). Every value hand-computed; distractors are the
// standard errors (wrong complement, p vs 1−p, forgetting to square, etc.). All hard.
const q = makeQ('m1')
const optm = (v: string): Pair => [`$${v}$`, `$${v}$`]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  dist: { id: 'm1_distributions', zh: '概率分佈（高階）', en: 'Probability distributions' },
  normal: { id: 'm1_normal_calc', zh: '常態分佈計算', en: 'Normal distribution — calculation' },
} satisfies Record<string, TopicMeta>
const FW = {
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  model: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `m1h_${p}_${++uid}`

const dist: Question[] = [
  q(id('di'), T.dist, FW.decompose, 'hard', 2024, 2,
    C('設隨機變量 $X \\sim B(5, 0.2)$（二項分佈，$n=5$，$p=0.2$）。求 $P(X=2)$。',
      'Let $X \\sim B(5, 0.2)$ (binomial, $n=5$, $p=0.2$). Find $P(X=2)$.'),
    [optm('0.2048'), optm('0.0512'), optm('0.4'), optm('0.04')],
    C('$P(X=2)=\\binom{5}{2}(0.2)^2(0.8)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048$。\n\n【陷阱】0.0512 漏了組合數 $\\binom{5}{2}=10$；0.4 用了 $np$ 而非概率；0.04 只計了 $(0.2)^2$。',
      '$P(X=2)=\\binom{5}{2}(0.2)^2(0.8)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048$.\n\n【Trap】 0.0512 drops the coefficient $\\binom{5}{2}=10$; 0.4 uses $np$ instead of a probability; 0.04 is only $(0.2)^2$.')),

  q(id('di'), T.dist, FW.model, 'hard', 2023, 2,
    C('某服務台平均每分鐘有 2 名顧客到達，到達數服從泊松分佈（$\\lambda=2$）。求「某一分鐘內無人到達」的概率 $P(X=0)$。',
      'Customers arrive at a desk at an average of 2 per minute, following a Poisson distribution ($\\lambda=2$). Find the probability that NO one arrives in a given minute, $P(X=0)$.'),
    [optm('e^{-2} \\approx 0.135'), optm('e^{-2}\\cdot 2 \\approx 0.271'), optm('0.5'), optm('1 - e^{-2} \\approx 0.865')],
    C('泊松：$P(X=k)=\\dfrac{e^{-\\lambda}\\lambda^k}{k!}$。$P(X=0)=\\dfrac{e^{-2}\\cdot 2^0}{0!}=e^{-2}\\approx 0.135$。\n\n【陷阱】0.271 是 $P(X=1)$；0.5 無依據；0.865 是 $P(X\\ge 1)$（互補事件）。',
      'Poisson: $P(X=k)=\\dfrac{e^{-\\lambda}\\lambda^k}{k!}$. $P(X=0)=\\dfrac{e^{-2}\\cdot 2^0}{0!}=e^{-2}\\approx 0.135$.\n\n【Trap】 0.271 is $P(X=1)$; 0.5 has no basis; 0.865 is $P(X\\ge 1)$ (the complement).')),

  q(id('di'), T.dist, FW.decompose, 'hard', 2024, 2,
    C('設 $X \\sim B(20, 0.3)$。其平均數與方差分別是？',
      'Let $X \\sim B(20, 0.3)$. Its mean and variance are?'),
    [optm('\\text{mean}=6,\\ \\text{var}=4.2'), optm('\\text{mean}=6,\\ \\text{var}=6'),
     optm('\\text{mean}=0.3,\\ \\text{var}=0.21'), optm('\\text{mean}=4.2,\\ \\text{var}=6')],
    C('二項分佈：平均數 $=np=20\\times 0.3=6$；方差 $=np(1-p)=20\\times 0.3\\times 0.7=4.2$。\n\n【陷阱】var=6 把方差當平均數（漏乘 $1-p$）；其餘把 $n$、$p$ 混淆。',
      'Binomial: mean $=np=20\\times 0.3=6$; variance $=np(1-p)=20\\times 0.3\\times 0.7=4.2$.\n\n【Trap】 var=6 sets variance equal to the mean (drops $1-p$); the others confuse $n$ and $p$.')),
]

const normal: Question[] = [
  q(id('no'), T.normal, FW.model, 'hard', 2024, 2,
    C('設 $X \\sim N(50, 10^2)$（常態分佈，平均 50，標準差 10）。已知 $P(Z>1.5)=0.0668$，求 $P(X>65)$。',
      'Let $X \\sim N(50, 10^2)$ (normal, mean 50, s.d. 10). Given $P(Z>1.5)=0.0668$, find $P(X>65)$.'),
    [optm('0.0668'), optm('0.9332'), optm('0.5'), optm('0.1587')],
    C('標準化：$Z=\\dfrac{65-50}{10}=1.5$，故 $P(X>65)=P(Z>1.5)=0.0668$。\n\n【陷阱】0.9332 是 $P(Z<1.5)$（互補）；0.5 忽略了標準化；0.1587 對應 $Z=1$（標準差用錯）。',
      'Standardise: $Z=\\dfrac{65-50}{10}=1.5$, so $P(X>65)=P(Z>1.5)=0.0668$.\n\n【Trap】 0.9332 is $P(Z<1.5)$ (the complement); 0.5 ignores standardising; 0.1587 corresponds to $Z=1$ (wrong s.d.).')),
]

export const m1HellQuestions: Question[] = [...dist, ...normal]
export const m1HellTopics: Topic[] = topicList([
  { topic: T.dist,   fw: FW.decompose, count: dist.length },
  { topic: T.normal, fw: FW.model,     count: normal.length },
])
