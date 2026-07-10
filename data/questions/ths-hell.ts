import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// Tourism & Hospitality Studies "hell" set (5★★). Hotel metrics hand-computed
// (occupancy %, ADR); concept distractors are the standard confusions. All hard.
const q = makeQ('ths')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  calc:    { id: 'ths_hotel_metrics', zh: '酒店營運計算', en: 'Hotel operations — metrics' },
  concept: { id: 'ths_concept_analysis', zh: '概念分析・服務與可持續', en: 'Concepts — service & sustainability' },
} satisfies Record<string, TopicMeta>
const FW = {
  concept:  { id: 'concept',  zh: '概念理解', en: 'Concepts', emoji: '📘' },
  analysis: { id: 'analysis', zh: '分析評鑑', en: 'Analysis', emoji: '🔗' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `thsh_${p}_${++uid}`

const calc: Question[] = [
  q(id('ca'), T.calc, FW.analysis, 'hard', 2024, 2,
    C('某酒店有 120 間客房，某晚售出 84 間，房間總收入為 \\$84,000。其「入住率」(occupancy rate) 與「平均房價」(ADR) 分別是？',
      'A hotel has 120 rooms; one night it sells 84 rooms for total room revenue of \\$84,000. Its occupancy rate and average daily rate (ADR) are?'),
    [opt('入住率 70%，ADR = \\$1,000', 'occupancy 70%, ADR = \\$1,000'),
     opt('入住率 84%，ADR = \\$700', 'occupancy 84%, ADR = \\$700'),
     opt('入住率 70%，ADR = \\$700', 'occupancy 70%, ADR = \\$700'),
     opt('入住率 120%，ADR = \\$1,000', 'occupancy 120%, ADR = \\$1,000')],
    C('入住率 = 售出 ÷ 可售房 = 84 ÷ 120 = 70%。ADR = 房間收入 ÷ 售出房數 = 84,000 ÷ 84 = \\$1,000。\n\n【陷阱】84% 把售出數當百分比；ADR \\$700 用了總房數作分母（應用「售出」房數）；120% 把分子分母倒轉。',
      'Occupancy = rooms sold ÷ rooms available = 84 ÷ 120 = 70%. ADR = room revenue ÷ rooms SOLD = 84,000 ÷ 84 = \\$1,000.\n\n【Trap】 84% treats rooms sold as the percentage; ADR \\$700 uses total rooms as the denominator (it should be rooms SOLD); 120% inverts the ratio.')),
]

const concept: Question[] = [
  q(id('co'), T.concept, FW.analysis, 'hard', 2024, 2,
    C('某熱門海島景點遊客量持續超出環境與設施可承受的上限，導致珊瑚受損、垃圾與污水問題嚴重。這最直接說明了哪一個可持續旅遊概念？',
      'A popular island attraction keeps receiving more visitors than its environment and facilities can bear, damaging coral and causing waste and sewage problems. This most directly illustrates which sustainable-tourism concept?'),
    [opt('超出了「承載力」(carrying capacity) —— 一地在不造成不可接受的環境與社會損害下所能承受的最大遊客量',
        'exceeding the carrying capacity — the maximum visitor numbers an area can sustain without unacceptable environmental and social damage'),
      opt('提升了「顧客忠誠度」', 'improving customer loyalty'),
      opt('擴大了「市場區隔」', 'expanding market segmentation'),
      opt('增加了「乘數效應」帶來的純粹得益', 'a purely positive multiplier effect')],
    C('遊客量超出環境與設施所能承受的限度而造成損害，正是「承載力」被突破的典型；可持續旅遊強調把訪客量控制在承載力之內。\n\n【陷阱】顧客忠誠度、市場區隔屬市場營銷概念；「乘數效應純得益」忽略了過度旅遊的環境社會成本。',
      'Visitor numbers exceeding what the environment and facilities can bear, causing damage, is exactly a breach of carrying capacity; sustainable tourism keeps visitor numbers within it.\n\n【Trap】 Customer loyalty and market segmentation are marketing concepts; “purely positive multiplier” ignores the environmental and social costs of over-tourism.')),

  q(id('co'), T.concept, FW.concept, 'hard', 2023, 2,
    C('一位酒店員工把顧客的投訴視為「關鍵時刻」(moment of truth)，即時妥善處理並補救。從優質顧客服務角度，這樣做的最大價值在於？',
      'A hotel employee treats a guest complaint as a “moment of truth”, handling and recovering it promptly. In quality customer service, the greatest value of doing so is that?'),
    [opt('有效的服務補救能把不滿的顧客重新挽回，甚至提升其忠誠度與口碑 —— 投訴是改善與留客的機會',
        'effective service recovery can win back a dissatisfied guest and even raise loyalty and word-of-mouth — a complaint is an opportunity to improve and retain'),
      opt('可以即時把投訴的顧客列入黑名單',
        'it lets the hotel immediately blacklist the complaining guest'),
      opt('投訴一定會嚇走所有其他顧客',
        'a complaint will certainly scare away every other guest'),
      opt('服務補救與顧客忠誠度毫無關係',
        'service recovery has no relation to customer loyalty')],
    C('「關鍵時刻」是顧客與服務接觸、形成印象的時刻；妥善的服務補救能扭轉不滿、重建信任，往往比從未出錯更能提升忠誠（服務補救悖論），亦改善口碑。\n\n【陷阱】「列入黑名單」「嚇走所有顧客」「與忠誠無關」皆與優質服務的補救理念相違。',
      'A moment of truth is a service contact that shapes the guest’s impression; good service recovery can reverse dissatisfaction and rebuild trust, often raising loyalty more than if nothing had gone wrong (the service-recovery paradox), and improving word-of-mouth.\n\n【Trap】 “Blacklist”, “scare away every guest” and “no relation to loyalty” all contradict the recovery principle of quality service.')),
]

export const thsHellQuestions: Question[] = [...calc, ...concept]
export const thsHellTopics: Topic[] = topicList([
  { topic: T.calc,    fw: FW.analysis, count: calc.length },
  { topic: T.concept, fw: FW.concept,  count: concept.length },
])
