import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Economics — multi-step "hell" set (genuine 5★★). Every numeric answer is
// hand-computed and shown in the explanation; distractors are the standard DSE
// error answers (wrong elasticity sign, wrong shut-down rule P<AC vs P<AVC,
// absolute vs comparative advantage, multiplier mis-applied, etc.). All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('economics')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  micro: { id: 'econ_micro_calc', zh: '微觀計算殺著', en: 'Microeconomics — calculation' },
  macro: { id: 'econ_macro_calc', zh: '宏觀計算殺著', en: 'Macroeconomics — calculation' },
  trade: { id: 'econ_trade_failure', zh: '貿易與市場失靈', en: 'Trade & market failure' },
} satisfies Record<string, TopicMeta>

const FW = {
  market: { id: 'market_mechanism', zh: '市場機制', en: 'Market Mechanism', emoji: '📈' },
  macro:  { id: 'macro', zh: '宏觀分析', en: 'Macro analysis', emoji: '🏦' },
  intl:   { id: 'international', zh: '國際經濟', en: 'International Economics', emoji: '🌐' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `econh_${p}_${++uid}`

// ── Microeconomics — calculation ─────────────────────────────────────────────
const micro: Question[] = [
  q(id('mi'), T.micro, FW.market, 'hard', 2024, 3,
    C('某商品的需求價格彈性為 0.4。若廠商把價格提高 10%，下列哪項最準確？',
      'A good has a price elasticity of demand of 0.4. If the firm raises price by 10%, which is most accurate?'),
    [opt('需求量下跌約 4%，總收益上升（因需求缺乏彈性）',
        'quantity falls by about 4% and total revenue RISES (demand is inelastic)'),
      opt('需求量下跌約 4%，總收益下跌',
        'quantity falls about 4% and total revenue falls'),
      opt('需求量下跌 10%，總收益不變',
        'quantity falls 10% and total revenue is unchanged'),
      opt('需求量上升 4%，總收益上升',
        'quantity rises 4% and total revenue rises')],
    C('PED = %ΔQ ÷ %ΔP ⇒ %ΔQ = 0.4 × (−10%) = −4%。總收益變動 ≈ %ΔP + %ΔQ = +10% − 4% = +6% > 0。需求缺乏彈性（<1）時，加價令總收益上升——這正是「彈性決定加價得失」的核心。\n\n【陷阱】「總收益下跌」誤用了富彈性的結論；「跌 10%」把彈性當 1；「需求量上升」搞錯了需求定律方向。',
      'PED = %ΔQ ÷ %ΔP ⇒ %ΔQ = 0.4 × (−10%) = −4%. %ΔTR ≈ %ΔP + %ΔQ = +10% − 4% = +6% > 0. When demand is inelastic (<1), a price rise raises total revenue.\n\n【Trap】 “TR falls” applies the elastic-case result; “falls 10%” treats PED as 1; “quantity rises” reverses the law of demand.')),

  q(id('mi'), T.micro, FW.market, 'hard', 2023, 3,
    C('某完全競爭廠商：市價 P = \\$8，現產量下平均變動成本 AVC = \\$9，平均成本 AC = \\$12。短期內應如何決策？',
      'A perfectly-competitive firm: price P = \\$8, average variable cost AVC = \\$9 and average cost AC = \\$12 at the current output. The correct short-run decision is to?'),
    [opt('立即停產 —— 因為 P(\\$8) < AVC(\\$9)，連變動成本都收不回',
        'shut down immediately — P(\\$8) < AVC(\\$9), so it cannot even cover variable costs'),
      opt('繼續生產，因為 P < AC',
        'keep producing because P < AC'),
      opt('繼續生產以攤分固定成本',
        'keep producing to spread the fixed cost'),
      opt('正在賺取正常利潤，無須改變',
        'it is earning normal profit, so do nothing')],
    C('短期停產法則：當 P < AVC，繼續生產的虧損比停產（只蝕固定成本）更大，故應停產。此處 P=\\$8 < AVC=\\$9 ⇒ 停產。\n\n【陷阱】用「P < AC」判停產係最常見錯誤——P<AC 只代表蝕本，只要 P≥AVC 仍應繼續以減少損失；「攤分固定成本」在 P<AVC 時反而蝕更多；P<AC 不可能是正常利潤。',
      'Short-run shut-down rule: shut down when P < AVC, because the loss from producing then exceeds the fixed-cost-only loss from stopping. Here P=\\$8 < AVC=\\$9 ⇒ shut down.\n\n【Trap】 Using “P < AC” to decide shut-down is the classic error — P<AC only means a loss; as long as P≥AVC the firm should keep going to reduce losses; “spreading fixed cost” loses more when P<AVC.')),

  q(id('mi'), T.micro, FW.market, 'hard', 2023, 3,
    C('某商品價格由 \\$50 升至 \\$60，需求量由 100 件跌至 85 件。用百分比法（以原值為基數）計算需求價格彈性，並判斷其彈性。',
      'A good’s price rises from \\$50 to \\$60 and quantity demanded falls from 100 to 85. Using the percentage method (original value as base), find the price elasticity of demand and classify it.'),
    [opt('|PED| = 0.75，需求缺乏彈性', '|PED| = 0.75, demand is inelastic'),
      opt('|PED| = 1.33，需求富彈性', '|PED| = 1.33, demand is elastic'),
      opt('|PED| = 1.5，需求富彈性', '|PED| = 1.5, demand is elastic'),
      opt('|PED| = 1，單位彈性', '|PED| = 1, unit-elastic')],
    C('%ΔP = (60 − 50) ÷ 50 = +20%；%ΔQ = (85 − 100) ÷ 100 = −15%。|PED| = |−15% ÷ 20%| = 0.75 < 1 ⇒ 需求缺乏彈性。\n\n【陷阱】1.33 把分子分母倒轉（20÷15）；1.5 用了絕對變化 |−15 ÷ 10| 而非百分比；1 誤以為升跌幅相同。',
      '%ΔP = (60 − 50) ÷ 50 = +20%; %ΔQ = (85 − 100) ÷ 100 = −15%. |PED| = |−15% ÷ 20%| = 0.75 < 1 ⇒ inelastic.\n\n【Trap】 1.33 inverts the ratio (20÷15); 1.5 uses raw changes |−15 ÷ 10| instead of percentages; 1 assumes equal % changes.')),

  q(id('mi'), T.micro, FW.market, 'hard', 2023, 3,
    C('某商品市場均衡價為 \\$50。政府設一個 \\$30 的價格上限。在 \\$30 時，需求量 = 120 單位、供應量 = 80 單位。結果是？',
      'A market’s equilibrium price is \\$50. The government sets a price ceiling of \\$30. At \\$30, quantity demanded = 120 units and quantity supplied = 80 units. The result is?'),
    [opt('出現 40 單位的短缺（求過於供）',
        'a shortage of 40 units (quantity demanded exceeds quantity supplied)'),
      opt('出現 40 單位的過剩',
        'a surplus of 40 units'),
      opt('市場沒有任何變化',
        'no change in the market'),
      opt('價格會升至 \\$50',
        'the price rises to \\$50')],
    C('上限 \\$30 低於均衡 \\$50，屬有約束力的價格上限。短缺 = Qd − Qs = 120 − 80 = 40 單位。價格被法定壓低，不能升回均衡，故必然出現短缺與排隊／配給。\n\n【陷阱】「過剩」是價格下限（高於均衡）的結果；「無變化」忽略了上限有約束力；「升至 \\$50」違反了上限的法律約束。',
      'The \\$30 ceiling is below the \\$50 equilibrium, so it binds. Shortage = Qd − Qs = 120 − 80 = 40 units. The legal price cannot rise back to equilibrium, so a shortage (and queuing/rationing) must arise.\n\n【Trap】 A “surplus” comes from a price floor above equilibrium; “no change” ignores that the ceiling binds; “rises to \\$50” violates the legal cap.')),
]

// ── Macroeconomics — calculation ─────────────────────────────────────────────
const macro: Question[] = [
  q(id('ma'), T.macro, FW.macro, 'hard', 2024, 3,
    C('在一個簡單封閉經濟中，邊際消費傾向 MPC = 0.8。政府開支增加 \\$50 百萬。均衡國民收入的變動是？',
      'In a simple closed economy, the marginal propensity to consume MPC = 0.8. Government spending rises by \\$50 million. The change in equilibrium national income is?'),
    [opt('\\$250 百萬', '\\$250 million'),
      opt('\\$50 百萬', '\\$50 million'),
      opt('\\$40 百萬', '\\$40 million'),
      opt('\\$62.5 百萬', '\\$62.5 million')],
    C('簡單支出乘數 = 1 ÷ (1 − MPC) = 1 ÷ (1 − 0.8) = 1 ÷ 0.2 = 5。ΔY = 乘數 × ΔG = 5 × \\$50M = \\$250M。\n\n【陷阱】\\$50M 忘了乘數；\\$40M = 50×0.8（只算首輪消費）；\\$62.5M = 50 ÷ 0.8（把 MPC 當乘數倒數用錯）。',
      'Simple multiplier = 1 ÷ (1 − MPC) = 1 ÷ 0.2 = 5. ΔY = multiplier × ΔG = 5 × \\$50M = \\$250M.\n\n【Trap】 \\$50M ignores the multiplier; \\$40M = 50×0.8 (only the first round of spending); \\$62.5M = 50 ÷ 0.8 (mis-uses MPC).')),

  q(id('ma'), T.macro, FW.macro, 'hard', 2023, 3,
    C('某經濟體名義 GDP 為 \\$660 百萬，GDP 平減物價指數為 110（基年 = 100）。實質 GDP 是？',
      'An economy’s nominal GDP is \\$660 million and the GDP deflator is 110 (base year = 100). Real GDP is?'),
    [opt('\\$600 百萬', '\\$600 million'),
      opt('\\$726 百萬', '\\$726 million'),
      opt('\\$550 百萬', '\\$550 million'),
      opt('\\$660 百萬', '\\$660 million')],
    C('實質 GDP = 名義 GDP ÷ 平減指數 × 100 = 660 ÷ 110 × 100 = \\$600M。物價較基年上升，實質產出應低於名義值。\n\n【陷阱】\\$726M = 660×1.1（方向反了，乘咗物價）；\\$550M = 660 − 110 算法錯誤；\\$660M 忽略了物價變動。',
      'Real GDP = nominal ÷ deflator × 100 = 660 ÷ 110 × 100 = \\$600M. With prices above the base year, real output is below nominal.\n\n【Trap】 \\$726M = 660×1.1 (wrong direction); \\$550M mis-subtracts; \\$660M ignores the price change.')),

  q(id('ma'), T.macro, FW.macro, 'hard', 2022, 3,
    C('某工人的名義工資一年內上升 5%，同期整體物價水平上升 8%。其實質工資大約？',
      'A worker’s nominal wage rises 5% over a year while the overall price level rises 8%. The worker’s real wage approximately?'),
    [opt('下跌約 3%', 'falls by about 3%'),
      opt('上升約 3%', 'rises by about 3%'),
      opt('上升約 13%', 'rises by about 13%'),
      opt('維持不變', 'is unchanged')],
    C('實質工資變動 ≈ 名義工資變動 − 物價變動 = 5% − 8% = −3%，即購買力下降約 3%。\n\n【陷阱】「上升 3%」搞錯了相減方向；「升 13%」誤把兩者相加；「不變」忽略了物價升幅高於工資。',
      'Change in real wage ≈ nominal-wage change − inflation = 5% − 8% = −3%, i.e. purchasing power falls about 3%.\n\n【Trap】 “Rises 3%” reverses the subtraction; “rises 13%” adds them; “unchanged” ignores that inflation exceeds the wage rise.')),
]

// ── Trade & market failure ───────────────────────────────────────────────────
const trade: Question[] = [
  q(id('tr'), T.trade, FW.intl, 'hard', 2024, 3,
    C('【產量表】一名工人一日的產出：甲國 = 6 匹布 或 12 桶酒；乙國 = 1 匹布 或 4 桶酒。\n問：根據比較優勢，下列哪項正確？',
      '【Output per worker per day】Country A = 6 cloth OR 12 wine; Country B = 1 cloth OR 4 wine.\nQ: By comparative advantage, which is correct?'),
    [opt('甲國在布有比較優勢（造 1 匹布的機會成本 2 桶酒 < 乙國 4 桶酒），故甲專業生產布、乙專業生產酒',
        'A has the comparative advantage in cloth (opp. cost of 1 cloth = 2 wine < B’s 4 wine), so A specialises in cloth and B in wine'),
      opt('甲國各方面都較高產，故應自己同時生產布與酒，不必貿易',
        'A is more productive in everything, so it should produce both and not trade'),
      opt('乙國在布有比較優勢',
        'B has the comparative advantage in cloth'),
      opt('兩國均不能從貿易中得益',
        'neither country can gain from trade')],
    C('機會成本：造 1 匹布——甲 = 12/6 = 2 桶酒，乙 = 4/1 = 4 桶酒 ⇒ 甲布的機會成本較低，甲有比較優勢；造 1 桶酒——甲 = 6/12 = 0.5 匹布，乙 = 1/4 = 0.25 匹布 ⇒ 乙酒的機會成本較低。故甲產布、乙產酒，再貿易雙贏。\n\n【陷阱】「甲樣樣較高產就唔使貿易」混淆了絕對優勢與比較優勢——即使甲絕對優勢樣樣勝，按機會成本分工仍對雙方有利；其餘兩項與機會成本計算相反。',
      'Opportunity cost of 1 cloth: A = 12/6 = 2 wine; B = 4/1 = 4 wine ⇒ A’s cloth is cheaper, so A has the comparative advantage. Opportunity cost of 1 wine: A = 0.5 cloth; B = 0.25 cloth ⇒ B has it in wine. So A makes cloth, B makes wine, and both gain from trade.\n\n【Trap】 “A is best at everything so needn’t trade” confuses absolute with comparative advantage — specialising by opportunity cost still benefits both; the other two reverse the computation.')),

  q(id('tr'), T.trade, FW.market, 'hard', 2023, 3,
    C('政府向某商品徵收每單位定額稅。已知該商品的需求遠較供應「缺乏彈性」。稅項的負擔主要由誰承擔？',
      'The government imposes a per-unit tax on a good whose demand is far MORE inelastic than its supply. Who bears the larger share of the tax?'),
    [opt('消費者承擔較大份額（彈性較低的一方承擔較重）',
        'consumers bear the larger share (the more inelastic side bears more)'),
      opt('生產者承擔較大份額',
        'producers bear the larger share'),
      opt('買賣雙方必定各承擔一半',
        'buyers and sellers always split it 50/50'),
      opt('稅項全部由政府承擔',
        'the government bears the whole tax')],
    C('稅項歸宿取決於相對彈性：彈性愈低（愈難轉移行為）的一方承擔愈重。需求遠較供應缺乏彈性 ⇒ 消費者較難因加價而減少購買，故承擔較大份額。\n\n【陷阱】「生產者承擔較大」方向相反；「必定各半」忽略相對彈性；「政府承擔」誤解了徵稅對象。',
      'Tax incidence depends on relative elasticity: the more inelastic side (less able to change behaviour) bears more. Demand far more inelastic than supply ⇒ consumers cannot cut buying much when price rises, so they bear the larger share.\n\n【Trap】 “Producers bear more” is the reverse; “always 50/50” ignores relative elasticity; “government bears it” mistakes who is taxed.')),

  q(id('tr'), T.trade, FW.market, 'hard', 2024, 3,
    C('某工廠在生產過程中向外界排放污染，造成第三者承受的外部成本。在沒有任何政府干預下，自由市場的產量與社會最適產量相比，會？',
      'A factory’s production emits pollution, imposing an external cost on third parties. With no government intervention, the free-market output compared with the socially optimal output will be?'),
    [opt('高於社會最適產量（生產過多），因私人成本低於社會成本',
        'higher than the socially optimal output (over-production), because private cost is below social cost'),
      opt('低於社會最適產量（生產過少）',
        'lower than the socially optimal output (under-production)'),
      opt('剛好等於社會最適產量',
        'exactly equal to the socially optimal output'),
      opt('外部成本不會影響產量',
        'the external cost does not affect output')],
    C('負外部性下，邊際社會成本 MSC > 邊際私人成本 MPC。廠商只按 MPC 決定產量，忽略外部成本，故市場產量高於 MSC=MSB 的社會最適水平——典型「生產過多」的市場失靈。一個等於邊際外部成本的庇古稅可把外部性內部化。\n\n【陷阱】「生產過少」是正外部性的結果；「剛好相等」「不受影響」均否定了外部性對效率的扭曲。',
      'With a negative externality, marginal social cost MSC > marginal private cost MPC. The firm produces where MPC dictates, ignoring the external cost, so market output exceeds the socially optimal level (MSC=MSB) — classic over-production market failure. A Pigouvian tax equal to the marginal external cost internalises it.\n\n【Trap】 “Under-production” fits a positive externality; “exactly equal” and “no effect” deny the efficiency distortion.')),
]

export const economicsHellQuestions: Question[] = [...micro, ...macro, ...trade]

export const economicsHellTopics: Topic[] = topicList([
  { topic: T.micro, fw: FW.market, count: micro.length },
  { topic: T.macro, fw: FW.macro,  count: macro.length },
  { topic: T.trade, fw: FW.intl,   count: trade.length },
])
