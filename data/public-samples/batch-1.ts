/**
 * Public-explanation overlay for the first 12 indexed sample pages.
 *
 * Rendered only by app/subject/[subject]/[topic]/[id]/page.tsx.
 * This module is not part of the practice bank. Do not import it from
 * data/questions, data/questions/load.ts, or scripts/qbank/sync-questions.mts.
 * Copying these items into the 26,419-question bank requires a separate
 * founder decision after subject review. This file does not do that.
 */

export const PUBLIC_SAMPLE_IDS = [
  'math_quad_1',
  'math_quad_2',
  'm2_dpow_1',
  'm2_dpow_2',
  'm1_ncr_1',
  'm1_ncr_2',
  'phy_fma_1',
  'phy_fma_2',
  'chem_nmM_1',
  'chem_nmM_2',
  'ict_b2d_1',
  'ict_b2d_2',
] as const

export type PublicSampleId = (typeof PUBLIC_SAMPLE_IDS)[number]

export interface HorizontalForceDiagram {
  id: string
  ariaLabel: string
  caption: string
  bodyLabel: string
  surfaceLabel: string
  leftLabel: string
  leftLength: number
  rightLabel: string
  rightLength: number
  /** Given acceleration. Omit when the acceleration is the unknown being asked. */
  accelLabel?: string
  accelDirection?: 'left' | 'right'
}

export interface PublicExplanation {
  id: PublicSampleId
  subject: string
  topic: string
  topicZh: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  options: readonly [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  diagram?: HorizontalForceDiagram
}

const ITEMS: readonly PublicExplanation[] = [
  {
    id: 'math_quad_1',
    subject: 'math',
    topic: 'quadratic_equations',
    topicZh: '二次方程',
    difficulty: 'medium',
    content: '某正整數 $n$ 的平方，比該數的 $5$ 倍多 $6$。求 $n$。',
    options: ['$2$ 或 $3$', '$6$ 或 $-1$', '$6$', '$-1$'],
    correctIndex: 2,
    explanation:
      '依題意列式 $n^2 = 5n + 6$，移項得 $n^2 - 5n - 6 = 0$。因式分解為 $(n - 6)(n + 1) = 0$，所以 $n = 6$ 或 $n = -1$。題目限制 $n$ 為正整數，只取 $n = 6$。代回核對：$6^2 = 36$，而 $5 \\times 6 + 6 = 36$。'
      + '\n'
      + '$6$ 或 $-1$ 保留了不合題意的負根。$-1$ 只取了應剔除的根。$2$ 或 $3$ 來自把方程誤寫成 $n^2 - 5n + 6 = 0$。',
  },
  {
    id: 'math_quad_2',
    subject: 'math',
    topic: 'quadratic_equations',
    topicZh: '二次方程',
    difficulty: 'medium',
    content: '方程 $2x^2 - 7x + 3 = 0$ 的兩根為 $\\alpha$ 與 $\\beta$。求 $\\alpha^2 + \\beta^2$。',
    options: ['$\\frac{61}{4}$', '$\\frac{37}{4}$', '$\\frac{49}{4}$', '$\\frac{25}{4}$'],
    correctIndex: 1,
    explanation:
      '由根與係數的關係，$\\alpha + \\beta = \\frac{7}{2}$，$\\alpha\\beta = \\frac{3}{2}$。於是 $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = \\left(\\frac{7}{2}\\right)^2 - 2 \\times \\frac{3}{2} = \\frac{49}{4} - 3 = \\frac{37}{4}$。'
      + '\n'
      + '$\\frac{49}{4}$ 只算了 $(\\alpha + \\beta)^2$，未減去 $2\\alpha\\beta$。$\\frac{61}{4}$ 把該式的減號寫成加號。$\\frac{25}{4}$ 把兩根之積誤取為 $3$，而不是 $\\frac{3}{2}$。',
  },
  {
    id: 'm2_dpow_1',
    subject: 'm2',
    topic: 'differentiation',
    topicZh: '微分法',
    difficulty: 'medium',
    content: '曲線 $y = x^3 - 4x^2 + 5x - 1$ 在 $x = 3$ 處的切線斜率是多少？',
    options: ['$5$', '$20$', '$3$', '$8$'],
    correctIndex: 3,
    explanation:
      '切線斜率是導數在該點的值。逐項使用冪法則，$\\frac{dy}{dx} = 3x^2 - 8x + 5$。代入 $x = 3$：$3(3)^2 - 8(3) + 5 = 27 - 24 + 5 = 8$。'
      + '\n'
      + '$5$ 是把 $x = 3$ 代入 $y$ 所得的函數值，不是斜率。$20$ 把 $-4x^2$ 的導數誤算成 $-4x$，得到 $3(3)^2 - 4(3) + 5 = 20$。$3$ 漏去導數中的常數項 $5$，得到 $27 - 24 = 3$。',
  },
  {
    id: 'm2_dpow_2',
    subject: 'm2',
    topic: 'differentiation',
    topicZh: '微分法',
    difficulty: 'medium',
    content: '設 $f(x) = 3x^2 + \\frac{4}{x}$。求 $f\'(2)$。',
    options: ['$12$', '$13$', '$11$', '$14$'],
    correctIndex: 2,
    explanation:
      '先把分式寫成冪：$\\frac{4}{x} = 4x^{-1}$。冪法則給出 $f\'(x) = 6x - 4x^{-2} = 6x - \\frac{4}{x^2}$。代入 $x = 2$：$6(2) - \\frac{4}{2^2} = 12 - 1 = 11$。'
      + '\n'
      + '$12$ 漏去 $\\frac{4}{x}$ 的導數。$13$ 把 $x^{-1}$ 的導數符號弄反，變成 $12 + 1$。$14$ 是 $f(2) = 3(2)^2 + \\frac{4}{2}$，即函數值而不是導數值。',
  },
  {
    id: 'm1_ncr_1',
    subject: 'm1',
    topic: 'permutation_combination',
    topicZh: '排列與組合',
    difficulty: 'medium',
    content: '科學學會有 $5$ 名中五學生及 $4$ 名中六學生。現要選出 $2$ 名中五及 $2$ 名中六組成 $4$ 人小組，不計職位次序。共有多少種選法？',
    options: ['$126$', '$60$', '$120$', '$16$'],
    correctIndex: 1,
    explanation:
      '兩個年級要分別選取，而且小組不計次序，所以是 $C^{5}_{2} \\times C^{4}_{2} = 10 \\times 6 = 60$。'
      + '\n'
      + '$126$ 是 $C^{9}_{4}$，即從 $9$ 人中直接選 $4$ 人，沒有理會年級要求。$120$ 是 $P^{5}_{2} \\times C^{4}_{2} = 20 \\times 6$，把選 $2$ 名中五誤當成排列。$16$ 是 $C^{5}_{2} + C^{4}_{2} = 10 + 6$，把兩次組合相加而不是相乘。',
  },
  {
    id: 'm1_ncr_2',
    subject: 'm1',
    topic: 'permutation_combination',
    topicZh: '排列與組合',
    difficulty: 'medium',
    content: '從 $7$ 名學生中選出 $3$ 人參加問答比賽。其中學生甲與學生乙不可同時入選。共有多少種選法？',
    options: ['$35$', '$10$', '$30$', '$5$'],
    correctIndex: 2,
    explanation:
      '若不加限制，選法有 $C^{7}_{3} = 35$ 種。甲與乙同時入選時，其餘 $1$ 人要從剩下的 $5$ 人中選出，有 $C^{5}_{1} = 5$ 種，這些必須剔除，故 $35 - 5 = 30$。'
      + '\n'
      + '可再分情況核對：只選甲不選乙有 $C^{5}_{2} = 10$ 種，只選乙不選甲有 $10$ 種，兩人都不選有 $C^{5}_{3} = 10$ 種，合計仍是 $30$。'
      + '\n'
      + '$35$ 沒有剔除兩人同時入選的情況。$10$ 只計算了兩人都不入選。$5$ 只是被禁止的情況，不是可接受的選法。',
  },
  {
    id: 'phy_fma_1',
    subject: 'physics',
    topic: 'mechanics',
    topicZh: '力學',
    difficulty: 'medium',
    content: '質量為 $3\\,\\text{kg}$ 的木塊放在光滑水平面上。木塊同時受水平向右 $15\\,\\text{N}$ 的力，以及水平向左 $6\\,\\text{N}$ 的力。木塊的加速度是？',
    options: [
      '$7\\,\\text{m/s}^2$，向右',
      '$5\\,\\text{m/s}^2$，向右',
      '$3\\,\\text{m/s}^2$，向左',
      '$3\\,\\text{m/s}^2$，向右',
    ],
    correctIndex: 3,
    diagram: {
      id: 'phy_fma_1',
      ariaLabel: '受力圖：質量 3 公斤的木塊放在光滑水平面上，受水平向右 15 牛頓和水平向左 6 牛頓的力。圖中沒有畫出加速度。',
      caption: '實線箭嘴表示兩個水平力。箭嘴只顯示方向，以及向右的力較大；計算要用箭嘴上的數值，不要量度箭嘴長度。加速度須由合力判斷，因此圖中不畫加速度。',
      bodyLabel: '3 kg',
      surfaceLabel: '光滑水平面',
      leftLabel: '6 N',
      leftLength: 64,
      rightLabel: '15 N',
      rightLength: 120,
    },
    explanation:
      '光滑水平面沒有摩擦力。取水平向右為正，合力為 $15 - 6 = 9\\,\\text{N}$，方向向右。由 $F = ma$，$a = \\frac{9}{3} = 3\\,\\text{m/s}^2$，方向與合力相同，即向右。'
      + '\n'
      + '$7\\,\\text{m/s}^2$，向右把兩個力相加：$(15 + 6) / 3 = 7$。$5\\,\\text{m/s}^2$，向右只計算 $15\\,\\text{N}$：$15 / 3 = 5$。$3\\,\\text{m/s}^2$，向左的大小正確，但把合力方向取反。',
  },
  {
    id: 'phy_fma_2',
    subject: 'physics',
    topic: 'mechanics',
    topicZh: '力學',
    difficulty: 'medium',
    content: '質量為 $2.0\\,\\text{kg}$ 的物體放在光滑水平面上，加速度為 $4.0\\,\\text{m/s}^2$，方向向右。物體受水平向右的拉力 $F$，以及水平向左 $3.0\\,\\text{N}$ 的力。求 $F$。',
    options: ['$8.0\\,\\text{N}$', '$11.0\\,\\text{N}$', '$5.0\\,\\text{N}$', '$0.50\\,\\text{N}$'],
    correctIndex: 1,
    diagram: {
      id: 'phy_fma_2',
      ariaLabel: '受力圖：質量 2.0 公斤的物體在光滑水平面上，向右的拉力標為 F，向左 3.0 牛頓，加速度 4.0 米每平方秒向右。圖中沒有標出 F 的數值。',
      caption: '向右的實線是未知拉力 F，向左的實線是 3.0 N。虛線是題目給出的加速度，不是第三個力。箭嘴長短不能代替計算，F 的數值亦沒有畫在圖上。',
      bodyLabel: '2.0 kg',
      surfaceLabel: '光滑水平面',
      leftLabel: '3.0 N',
      leftLength: 64,
      rightLabel: 'F',
      rightLength: 112,
      accelLabel: '4.0 m/s²',
      accelDirection: 'right',
    },
    explanation:
      '加速度向右，所以合力向右，大小為 $ma = 2.0 \\times 4.0 = 8.0\\,\\text{N}$。向右的 $F$ 減去向左的 $3.0\\,\\text{N}$ 等於合力：$F - 3.0 = 8.0$，因此 $F = 11.0\\,\\text{N}$。'
      + '\n'
      + '$8.0\\,\\text{N}$ 只是合力，未把向左的 $3.0\\,\\text{N}$ 加回。$5.0\\,\\text{N}$ 把合力再減去 $3.0\\,\\text{N}$。$0.50\\,\\text{N}$ 把 $F = ma$ 倒轉成 $m / a = 2.0 / 4.0$。',
  },
  {
    id: 'chem_nmM_1',
    subject: 'chemistry',
    topic: 'mole',
    topicZh: '摩爾概念',
    difficulty: 'easy',
    content: '某樣本含 $4\\,\\text{mol}$ 碳酸鈣。碳酸鈣的摩爾質量是 $100\\,\\text{g/mol}$。該樣本的質量是多少？',
    options: ['$0.04\\,\\text{g}$', '$25\\,\\text{g}$', '$400\\,\\text{g}$', '$160\\,\\text{g}$'],
    correctIndex: 2,
    explanation:
      '已知摩爾數和摩爾質量，求質量要用 $m = nM$，而不是 $n = m / M$。$m = 4 \\times 100 = 400\\,\\text{g}$。'
      + '\n'
      + '$0.04\\,\\text{g}$ 是 $n / M = 4 / 100$。$25\\,\\text{g}$ 是 $M / n = 100 / 4$。$160\\,\\text{g}$ 只乘了鈣的相對原子質量 $40$，即 $4 \\times 40$，沒有用碳酸鈣的摩爾質量。',
  },
  {
    id: 'chem_nmM_2',
    subject: 'chemistry',
    topic: 'mole',
    topicZh: '摩爾概念',
    difficulty: 'easy',
    content: '$0.30\\,\\text{mol}$ 氮氣（$\\text{N}_2$）中含有多少摩爾氮原子？',
    options: ['$0.60\\,\\text{mol}$', '$0.30\\,\\text{mol}$', '$0.15\\,\\text{mol}$', '$8.4\\,\\text{mol}$'],
    correctIndex: 0,
    explanation:
      '每個氮氣分子含有 $2$ 個氮原子，所以氮原子的物質的量是分子的 $2$ 倍：$0.30 \\times 2 = 0.60\\,\\text{mol}$。'
      + '\n'
      + '$0.30\\,\\text{mol}$ 把分子的物質的量直接當成原子的物質的量。$0.15\\,\\text{mol}$ 誤把 $2$ 用來做除法。$8.4\\,\\text{mol}$ 把氮氣的摩爾質量 $28\\,\\text{g/mol}$ 乘進摩爾數（$0.30 \\times 28 = 8.4$），單位亦不應仍是 mol。',
  },
  {
    id: 'ict_b2d_1',
    subject: 'ict',
    topic: 'data_representation',
    topicZh: '資料表示與處理',
    difficulty: 'easy',
    content: '把 $8$ 位二進位數 ${01011001}_{2}$ 轉成十進位。',
    options: ['$59$', '$89$', '$88$', '$4$'],
    correctIndex: 1,
    explanation:
      '由左至右的位權是 $128$、$64$、$32$、$16$、$8$、$4$、$2$、$1$。${01011001}_{2}$ 中為 $1$ 的位是 $64 + 16 + 8 + 1 = 89$。'
      + '\n'
      + '$59$ 把每 $4$ 位當成二進碼十進數：$0101_2 = 5$，$1001_2 = 9$。$88$ 漏加最右一位的 $2^0 = 1$。$4$ 只數了有幾個 $1$，沒有乘位權。',
  },
  {
    id: 'ict_b2d_2',
    subject: 'ict',
    topic: 'data_representation',
    topicZh: '資料表示與處理',
    difficulty: 'easy',
    content: '下列哪個二進位數的值等於十進位 $13$？',
    options: ['${1011}_{2}$', '${1110}_{2}$', '${1101}_{2}$', '${0111}_{2}$'],
    correctIndex: 2,
    explanation:
      '$13 = 8 + 4 + 1 = 2^3 + 2^2 + 2^0$，所以二進位寫法是 ${1101}_{2}$。'
      + '\n'
      + '${1011}_{2} = 8 + 2 + 1 = 11$。${1110}_{2} = 8 + 4 + 2 = 14$。${0111}_{2} = 4 + 2 + 1 = 7$。',
  },
]

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]))

export function publicExplanationFor(id: string): PublicExplanation | undefined {
  return BY_ID.get(id as PublicSampleId)
}

export interface ExplanationDisplay {
  content: string
  options: readonly unknown[] | undefined
  correctIndex: number | undefined
  explanation: string
  difficulty: string | undefined
  topicZh: string
  diagram?: HorizontalForceDiagram
  source: 'public-sample' | 'bank'
}

/** Use the overlay only when it is the same bank item. Otherwise keep the bank text. */
export function explanationDisplay(
  id: string,
  bank: {
    subject?: string
    topic?: string
    topicZh?: string
    content: string
    options?: readonly unknown[]
    correctIndex?: number
    explanation?: string
    difficulty?: string
  },
): ExplanationDisplay {
  const overlay = publicExplanationFor(id)
  const bankView: ExplanationDisplay = {
    content: bank.content,
    options: bank.options,
    correctIndex: bank.correctIndex,
    explanation: bank.explanation ?? '',
    difficulty: bank.difficulty,
    topicZh: bank.topicZh ?? '',
    source: 'bank',
  }
  if (!overlay) return bankView
  if (bank.subject && overlay.subject !== bank.subject) return bankView
  if (bank.topic && overlay.topic !== bank.topic) return bankView
  return {
    content: overlay.content,
    options: overlay.options,
    correctIndex: overlay.correctIndex,
    explanation: overlay.explanation,
    difficulty: overlay.difficulty,
    topicZh: overlay.topicZh,
    diagram: overlay.diagram,
    source: 'public-sample',
  }
}
