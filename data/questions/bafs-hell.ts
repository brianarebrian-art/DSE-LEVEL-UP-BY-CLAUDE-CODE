import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// BAFS — multi-step "hell" set (genuine 5★★), strictly within the DSE BAFS
// syllabus (ratios, costing, depreciation, pricing, payback). Every figure is
// hand-computed in the working; distractors are the classic traps: gross-MARGIN
// vs MARK-UP, contribution vs price in break-even, straight-line vs reducing-
// balance depreciation, margin-vs-markup pricing. All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('bafs')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  ratios: { id: 'bafs_ratio_analysis', zh: '比率分析殺著', en: 'Ratio analysis' },
  cost:   { id: 'bafs_costing_pricing', zh: '成本・定價・回本', en: 'Costing, pricing & payback' },
  dep:    { id: 'bafs_depreciation',    zh: '折舊計算',     en: 'Depreciation' },
} satisfies Record<string, TopicMeta>

const FW = {
  calc:  { id: 'calc',  zh: '計算分析', en: 'Quantitative Analysis', emoji: '🧮' },
  apply: { id: 'apply', zh: '應用判斷', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `bafsh_${p}_${++uid}`

// ── Ratio analysis ───────────────────────────────────────────────────────────
const ratios: Question[] = [
  q(id('ra'), T.ratios, FW.calc, 'hard', 2024, 3,
    C('某公司流動資產 \\$600,000，流動負債 \\$240,000。其流動比率（current ratio）是？',
      'A firm has current assets \\$600,000 and current liabilities \\$240,000. Its current ratio is?'),
    [opt('2.5 : 1', '2.5 : 1'),
      opt('0.4 : 1', '0.4 : 1'),
      opt('360,000', '360,000'),
      opt('40%', '40%')],
    C('流動比率 = 流動資產 ÷ 流動負債 = 600,000 ÷ 240,000 = 2.5，即 2.5 : 1。\n\n【陷阱】0.4 : 1 把分子分母倒轉；360,000 是「營運資金」（流動資產 − 流動負債）非比率；40% 是把比率誤當百分比。',
      'Current ratio = current assets ÷ current liabilities = 600,000 ÷ 240,000 = 2.5, i.e. 2.5 : 1.\n\n【Trap】 0.4 : 1 inverts it; 360,000 is working capital (CA − CL), not a ratio; 40% mis-reads the ratio as a percentage.')),

  q(id('ra'), T.ratios, FW.calc, 'hard', 2023, 3,
    C('某商號銷貨 \\$800,000，銷貨成本 \\$600,000。其毛利率（gross profit margin，以銷貨為基礎）是？',
      'A business has sales \\$800,000 and cost of goods sold \\$600,000. Its gross profit MARGIN (on sales) is?'),
    [opt('25%', '25%'),
      opt('33.3%', '33.3%'),
      opt('75%', '75%'),
      opt('20%', '20%')],
    C('毛利 = 800,000 − 600,000 = 200,000。毛利率（以銷貨為分母）= 200,000 ÷ 800,000 = 25%。\n\n【陷阱】33.3% 是「以成本為分母」的加成率（mark-up = 200,000 ÷ 600,000），正是 margin 與 mark-up 最常被混淆的陷阱；75% 是銷貨成本率；20% 把毛利除以一個不對的基數。',
      'Gross profit = 800,000 − 600,000 = 200,000. Margin (on sales) = 200,000 ÷ 800,000 = 25%.\n\n【Trap】 33.3% is the MARK-UP (on cost: 200,000 ÷ 600,000) — the classic margin-vs-markup confusion; 75% is the cost-to-sales ratio; 20% divides by the wrong base.')),

  q(id('ra'), T.ratios, FW.calc, 'hard', 2024, 3,
    C('沿用上題：流動資產 \\$600,000、流動負債 \\$240,000。其「營運資金」(working capital) 是？',
      'Continuing: current assets \\$600,000 and current liabilities \\$240,000. The working capital is?'),
    [opt('\\$360,000', '\\$360,000'),
      opt('\\$840,000', '\\$840,000'),
      opt('2.5 : 1', '2.5 : 1'),
      opt('\\$240,000', '\\$240,000')],
    C('營運資金 = 流動資產 − 流動負債 = 600,000 − 240,000 = \\$360,000。\n\n【陷阱】840,000 是相加；2.5:1 是流動比率（不是金額）；240,000 只抄了流動負債。',
      'Working capital = current assets − current liabilities = 600,000 − 240,000 = \\$360,000.\n\n【Trap】 840,000 adds them; 2.5:1 is the current ratio (not an amount); 240,000 just copies current liabilities.')),
]

// ── Costing, pricing & payback ───────────────────────────────────────────────
const cost: Question[] = [
  q(id('co'), T.cost, FW.calc, 'hard', 2024, 3,
    C('某產品售價每件 \\$20，單位變動成本 \\$12，固定成本 \\$60,000。要達到收支平衡（break-even），須售出多少件？',
      'A product sells at \\$20 each, with unit variable cost \\$12 and fixed costs \\$60,000. How many units must be sold to break even?'),
    [opt('7,500 件', '7,500 units'),
      opt('3,000 件', '3,000 units'),
      opt('5,000 件', '5,000 units'),
      opt('12,000 件', '12,000 units')],
    C('單位貢獻 = 售價 − 單位變動成本 = 20 − 12 = \\$8。收支平衡銷量 = 固定成本 ÷ 單位貢獻 = 60,000 ÷ 8 = 7,500 件。\n\n【陷阱】3,000 = 60,000 ÷ 20（用咗售價而非貢獻）；5,000 = 60,000 ÷ 12（用咗變動成本）；12,000 用咗錯誤基數。貢獻＝售價減「變動」成本，這是 break-even 的核心。',
      'Unit contribution = price − unit variable cost = 20 − 12 = \\$8. Break-even units = fixed costs ÷ contribution = 60,000 ÷ 8 = 7,500.\n\n【Trap】 3,000 = 60,000 ÷ 20 (uses price, not contribution); 5,000 = 60,000 ÷ 12 (uses variable cost); 12,000 uses a wrong base. Contribution = price − VARIABLE cost is the heart of break-even.')),

  q(id('co'), T.cost, FW.calc, 'hard', 2023, 3,
    C('某項投資成本 \\$100,000，預計每年帶來淨現金流入 \\$25,000（每年相同）。其回本期（payback period）是？',
      'An investment costs \\$100,000 and is expected to generate a net cash inflow of \\$25,000 each year (constant). Its payback period is?'),
    [opt('4 年', '4 years'),
      opt('2.5 年', '2.5 years'),
      opt('5 年', '5 years'),
      opt('0.25 年', '0.25 years')],
    C('回本期 = 投資額 ÷ 每年淨現金流入 = 100,000 ÷ 25,000 = 4 年。\n\n【陷阱】2.5 年、5 年皆用錯數字；0.25 年把分子分母倒轉。注意回本期只看「現金流入」而非利潤。',
      'Payback = investment ÷ annual net cash inflow = 100,000 ÷ 25,000 = 4 years.\n\n【Trap】 2.5 and 5 years use wrong figures; 0.25 inverts the division. Payback uses cash INFLOWS, not profit.')),

  q(id('co'), T.cost, FW.apply, 'hard', 2024, 3,
    C('某貨品成本 \\$80。若以「成本加成 25%」(mark-up 25% on cost) 定價，售價應為？',
      'An item costs \\$80. If priced at a 25% MARK-UP on cost, the selling price should be?'),
    [opt('\\$100', '\\$100'),
      opt('\\$106.67', '\\$106.67'),
      opt('\\$64', '\\$64'),
      opt('\\$105', '\\$105')],
    C('成本加成 25%：售價 = 成本 × (1 + 25%) = 80 × 1.25 = \\$100。\n\n【陷阱】\\$106.67 = 80 ÷ (1 − 25%)，那是「以售價為基礎的 25% 毛利率（margin）」的算法——margin 與 mark-up 基數不同，是此題核心；\\$64 = 80 × 0.8（減價）；\\$105 計錯。',
      '25% mark-up on cost: price = cost × (1 + 25%) = 80 × 1.25 = \\$100.\n\n【Trap】 \\$106.67 = 80 ÷ (1 − 25%), which is a 25% MARGIN on sales — margin and mark-up use different bases, the crux here; \\$64 = 80 × 0.8 (a discount); \\$105 mis-computes.')),
]

// ── Depreciation ─────────────────────────────────────────────────────────────
const dep: Question[] = [
  q(id('de'), T.dep, FW.calc, 'hard', 2024, 3,
    C('某機器成本 \\$100,000，預計可用 5 年，殘值 \\$10,000。用「直線法」(straight-line) 計算，每年折舊額是？',
      'A machine costs \\$100,000, has a useful life of 5 years and a residual value of \\$10,000. Using the straight-line method, the annual depreciation is?'),
    [opt('\\$18,000', '\\$18,000'),
      opt('\\$20,000', '\\$20,000'),
      opt('\\$22,000', '\\$22,000'),
      opt('\\$16,000', '\\$16,000')],
    C('直線法每年折舊 = (成本 − 殘值) ÷ 可用年期 = (100,000 − 10,000) ÷ 5 = 90,000 ÷ 5 = \\$18,000。\n\n【陷阱】\\$20,000 = 100,000 ÷ 5，忘記扣殘值（最常見錯誤）；\\$22,000、\\$16,000 皆計錯。',
      'Straight-line depreciation = (cost − residual) ÷ life = (100,000 − 10,000) ÷ 5 = \\$18,000 per year.\n\n【Trap】 \\$20,000 = 100,000 ÷ 5 forgets the residual (the most common error); \\$22,000 and \\$16,000 mis-compute.')),

  q(id('de'), T.dep, FW.calc, 'hard', 2023, 3,
    C('某資產成本 \\$100,000，用「遞減餘額法」(reducing-balance) 每年折舊率 20%。「第二年」的折舊額是？',
      'An asset costs \\$100,000 and is depreciated by the reducing-balance method at 20% per year. The depreciation in the SECOND year is?'),
    [opt('\\$16,000', '\\$16,000'),
      opt('\\$20,000', '\\$20,000'),
      opt('\\$12,800', '\\$12,800'),
      opt('\\$40,000', '\\$40,000')],
    C('第一年折舊 = 100,000 × 20% = 20,000，年末帳面淨值 = 80,000。第二年折舊 = 80,000 × 20% = \\$16,000（折舊率乘的是「餘額」而非原值）。\n\n【陷阱】\\$20,000 是直線法／第一年的數；\\$12,800 是第三年的折舊（64,000×20%）；\\$40,000 = 兩年相加。',
      'Year 1 depreciation = 100,000 × 20% = 20,000, leaving a net book value of 80,000. Year 2 = 80,000 × 20% = \\$16,000 (the rate applies to the REDUCING balance, not the original cost).\n\n【Trap】 \\$20,000 is straight-line / year 1; \\$12,800 is year 3 (64,000×20%); \\$40,000 sums two years.')),
]

export const bafsHellQuestions: Question[] = [...ratios, ...cost, ...dep]

export const bafsHellTopics: Topic[] = topicList([
  { topic: T.ratios, fw: FW.calc,  count: ratios.length },
  { topic: T.cost,   fw: FW.calc,  count: cost.length },
  { topic: T.dep,    fw: FW.calc,  count: dep.length },
])
