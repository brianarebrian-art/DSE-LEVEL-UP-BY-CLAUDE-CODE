import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Biology — multi-step "hell" set (genuine 5★★). Genetics answers are Punnett-
// verified; physiology items test the CAUSAL CHAIN (not a label); distractors are
// the standard DSE traps (AB×O giving AB/O, sex-linkage counted over all children
// instead of sons, water moving to higher Ψ, "denatured = just slower", counting
// the wrong number of 10% transfers, wrong hormone). All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('biology')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  genetics: { id: 'bio_genetics_logic', zh: '遺傳推理', en: 'Genetics — reasoning' },
  physio:   { id: 'bio_physio_chain',   zh: '生理機制・因果鏈', en: 'Physiology — causal chains' },
  data:     { id: 'bio_data_ecology',   zh: '數據與生態',   en: 'Data & ecology' },
} satisfies Record<string, TopicMeta>

const FW = {
  genetic:    { id: 'genetic_logic', zh: '遺傳邏輯', en: 'Genetic Logic', emoji: '🧬' },
  regulation: { id: 'regulation',    zh: '系統調節', en: 'System Regulation', emoji: '❤️' },
  energy:     { id: 'energy_flow',   zh: '能量流動', en: 'Energy Flow', emoji: '🌿' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `bioh_${p}_${++uid}`

// ── Genetics — reasoning ─────────────────────────────────────────────────────
const genetics: Question[] = [
  q(id('ge'), T.genetics, FW.genetic, 'hard', 2024, 2,
    C('一位血型 AB 的母親與一位血型 O 的父親生育子女。子女可能的血型是？',
      'A blood-group AB mother and a blood-group O father have children. The children’s possible blood groups are?'),
    [opt('只可能是 A 或 B 型（各約一半），不可能是 AB 或 O 型',
        'only A or B (about 1:1) — never AB and never O'),
      opt('可能是 A、B、AB 或 O 型',
        'A, B, AB or O'),
      opt('只可能是 AB 型',
        'AB only'),
      opt('只可能是 O 型',
        'O only')],
    C('母親 Iᴬ Iᴮ × 父親 ii。配子：母給 Iᴬ 或 Iᴮ，父只給 i。子女基因型 Iᴬ i（A 型）或 Iᴮ i（B 型），各 50%。父親無 Iᴬ/Iᴮ 故無 AB；母親無 i 提供成對隱性，故無 O。\n\n【陷阱】「A/B/AB/O 都可能」忽略了父親只提供 i；「全 AB」「全 O」更與配子組合相違。',
      'Mother Iᴬ Iᴮ × father ii. Gametes: mother gives Iᴬ or Iᴮ; father gives only i. Offspring Iᴬ i (group A) or Iᴮ i (group B), ~50% each. No Iᴬ/Iᴮ from father ⇒ no AB; mother gives no i ⇒ no O.\n\n【Trap】 “A/B/AB/O” ignores that the father supplies only i; “all AB”/“all O” contradict the gamete combinations.')),

  q(id('ge'), T.genetics, FW.genetic, 'hard', 2023, 2,
    C('紅綠色盲是 X 連鎖隱性。一位「攜帶者」母親（XᶜXᶜ′，其中 c′ 為色盲等位）與一位視覺正常的父親（XᶜY）生育。一個「兒子」是色盲的機率是？',
      'Red-green colour-blindness is X-linked recessive. A carrier mother (Xᴬ Xᵃ, a = colour-blind allele) and a colour-vision-normal father (Xᴬ Y) have children. The probability that a SON is colour-blind is?'),
    [opt('1/2', '1/2'),
      opt('1/4', '1/4'),
      opt('0', '0'),
      opt('1', '1')],
    C('兒子的 X 必來自母親。母親 Xᴬ Xᵃ 給 Xᴬ 或 Xᵃ 各半；兒子拿到 Xᵃ 即色盲。故「兒子當中」一半色盲 = 1/2。\n\n【陷阱】1/4 是把分母當成「全部子女」（兒子+女兒）算的常見錯誤——題目問的是「兒子當中」的機率，分母只計兒子；0 與 1 都與配子比例不符。',
      'A son’s X comes from the mother. She (Xᴬ Xᵃ) gives Xᴬ or Xᵃ with equal chance; a son getting Xᵃ is colour-blind. So among sons, 1/2 are colour-blind.\n\n【Trap】 1/4 wrongly uses ALL children as the denominator — the question asks the probability among SONS, so only sons count; 0 and 1 do not match the gamete ratio.')),

  q(id('ge'), T.genetics, FW.genetic, 'hard', 2024, 2,
    C('兩株高莖豌豆雜交，後代出現高莖與矮莖，比例約 3 : 1。關於這兩株親本，最穩妥的推論是？',
      'Two tall pea plants are crossed; the offspring are tall and dwarf in a ratio of about 3 : 1. The most reliable conclusion about the two parents is that?'),
    [opt('兩株親本都是雜合子（Tt × Tt），高莖為顯性',
        'both parents are heterozygous (Tt × Tt) and tall is dominant'),
      opt('兩株親本都是純合顯性（TT × TT）',
        'both parents are homozygous dominant (TT × TT)'),
      opt('一株純合顯性、一株純合隱性（TT × tt）',
        'one is homozygous dominant and one homozygous recessive (TT × tt)'),
      opt('矮莖是顯性',
        'dwarf is dominant')],
    C('高莖×高莖卻分離出 1/4 矮莖（隱性），表示雙親都帶隱性等位卻不表現，即雜合 Tt × Tt → 3 顯 : 1 隱，正是孟德爾單因子分離比。\n\n【陷阱】TT×TT 不會出現矮莖；TT×tt 後代全為 Tt 高莖、無矮莖；高莖為顯性方能解釋雜合親本仍為高莖，故「矮莖顯性」錯。',
      'Tall × tall yielding 1/4 dwarf (recessive) means both parents carry a hidden recessive allele, i.e. Tt × Tt → 3 dominant : 1 recessive — Mendel’s monohybrid ratio.\n\n【Trap】 TT×TT yields no dwarfs; TT×tt gives all-Tt tall offspring with no dwarfs; tall must be dominant for heterozygous parents to be tall, so “dwarf dominant” is wrong.')),
]

// ── Physiology — causal chains ───────────────────────────────────────────────
const physio: Question[] = [
  q(id('ph'), T.physio, FW.regulation, 'hard', 2024, 2,
    C('一個植物細胞的細胞液水勢為 −800 kPa，把它放入水勢為 −400 kPa 的溶液中。水的淨移動方向是？',
      'A plant cell with cell-sap water potential −800 kPa is placed in a solution of water potential −400 kPa. The net movement of water is?'),
    [opt('由溶液進入細胞（水由高水勢 −400 流向低水勢 −800）',
        'from the solution INTO the cell (water moves from the higher Ψ −400 to the lower Ψ −800)'),
      opt('由細胞流出至溶液',
        'out of the cell into the solution'),
      opt('沒有任何淨移動',
        'no net movement'),
      opt('水由低水勢流向高水勢',
        'water moves from lower to higher water potential')],
    C('水經滲透由「較高（較不負）」水勢流向「較低（較負）」水勢。溶液 −400 kPa 較高，細胞 −800 kPa 較低，故水淨入細胞，細胞趨向膨脹。\n\n【陷阱】「流出」弄反方向；「無移動」只在兩者水勢相等時成立；「低→高」違反滲透定義（注意 −400 > −800）。',
      'Osmosis moves water from higher (less negative) to lower (more negative) Ψ. The solution at −400 kPa is higher than the cell at −800 kPa, so water moves into the cell, which tends to become turgid.\n\n【Trap】 “Out of the cell” reverses it; “no movement” needs equal Ψ; “low→high” violates osmosis (note −400 > −800).')),

  q(id('ph'), T.physio, FW.regulation, 'hard', 2023, 2,
    C('當溫度升高到超過某酶的最適溫度後，反應速率不升反「急降」。最準確的解釋是？',
      'When temperature rises ABOVE an enzyme’s optimum, the reaction rate does not keep rising but FALLS sharply. The most accurate explanation is that?'),
    [opt('高溫使酶變性，活性部位形狀改變，不能再與受質結合（多為不可逆）',
        'high temperature denatures the enzyme — the active site changes shape and can no longer bind substrate (usually irreversible)'),
      opt('分子運動加快，所以速率持續上升',
        'molecules move faster, so the rate keeps rising'),
      opt('受質被完全用盡',
        'all the substrate has been used up'),
      opt('酶被受質競爭性抑制',
        'the enzyme is competitively inhibited by substrate')],
    C('超過最適溫度，熱能破壞維持酶三維結構的鍵，活性部位形狀改變（變性），與受質的契合喪失，速率急降。注意「變性」不是「變慢」，且通常不可逆。\n\n【陷阱】「分子加快故持續上升」只解釋最適溫度之前；「受質用盡」與溫度無關；「競爭性抑制」是抑制劑機制，並非高溫所致。',
      'Above the optimum, heat disrupts the bonds holding the enzyme’s 3-D shape; the active site changes shape (denaturation) and loses its fit for substrate, so the rate plunges. Denaturation is not mere slowing, and is usually irreversible.\n\n【Trap】 “Faster molecules” only explains the pre-optimum region; “substrate used up” is unrelated to temperature; “competitive inhibition” is an inhibitor mechanism, not a heat effect.')),

  q(id('ph'), T.physio, FW.regulation, 'hard', 2024, 2,
    C('進食一餐高糖食物後，健康人體調節血糖的正確因果鏈是？',
      'After a high-sugar meal, the correct causal chain by which a healthy body regulates blood glucose is?'),
    [opt('血糖上升 → 胰島素分泌 → 肝臟把葡萄糖轉化為糖原並促進細胞攝取 → 血糖回落',
        'blood glucose rises → insulin secreted → liver converts glucose to glycogen and cells take up glucose → blood glucose falls'),
      opt('血糖上升 → 升糖素分泌 → 糖原分解 → 血糖進一步上升',
        'glucose rises → glucagon secreted → glycogen broken down → glucose rises further'),
      opt('血糖上升 → 胰島素分泌 → 糖原分解 → 血糖上升',
        'glucose rises → insulin secreted → glycogen broken down → glucose rises'),
      opt('血糖下降 → 胰島素分泌 → 血糖回升',
        'glucose falls → insulin secreted → glucose rises')],
    C('餐後血糖升 → 胰島 β 細胞分泌「胰島素」→ 促進肝把葡萄糖儲為糖原、並促進組織攝取葡萄糖 → 血糖回落，是負反饋。\n\n【陷阱】升糖素方向相反（升血糖）；「胰島素 → 糖原分解」把胰島素作用弄反（應為合成糖原）；末項把胰島素的觸發條件弄錯（胰島素應對「升」非「降」）。',
      'After a meal, glucose rises → pancreatic β-cells secrete INSULIN → liver stores glucose as glycogen and tissues take up glucose → glucose falls — negative feedback.\n\n【Trap】 Glucagon does the opposite (raises glucose); “insulin → glycogen breakdown” reverses insulin’s action (it promotes synthesis); the last option mistakes insulin’s trigger (it responds to a RISE, not a fall).')),
]

// ── Data & ecology ───────────────────────────────────────────────────────────
const data: Question[] = [
  q(id('da'), T.data, FW.energy, 'hard', 2024, 2,
    C('某食物鏈：生產者 → 初級消費者 → 次級消費者。若生產者固定的能量為 10 000 kJ，假設各營養級之間的能量傳遞效率為 10%，則次級消費者所獲得的能量約為？',
      'A food chain: producer → primary consumer → secondary consumer. If producers fix 10 000 kJ and energy transfer between trophic levels is 10%, the energy reaching the secondary consumer is about?'),
    [opt('100 kJ', '100 kJ'),
      opt('1 000 kJ', '1 000 kJ'),
      opt('10 kJ', '10 kJ'),
      opt('5 000 kJ', '5 000 kJ')],
    C('由生產者到次級消費者要經「兩次」10% 傳遞：10 000 × 0.1 × 0.1 = 100 kJ。\n\n【陷阱】1 000 kJ 只算了一次傳遞（停在初級消費者）；10 kJ 算了三次；5 000 kJ 誤用 50%。能量逐級遞減，正是食物鏈通常少於 4–5 級的原因。',
      'From producer to secondary consumer is TWO 10% transfers: 10 000 × 0.1 × 0.1 = 100 kJ.\n\n【Trap】 1 000 kJ counts only one transfer (stops at the primary consumer); 10 kJ counts three; 5 000 kJ uses 50%. Energy falls at each level — why food chains rarely exceed 4–5 links.')),

  q(id('da'), T.data, FW.energy, 'hard', 2023, 2,
    C('在「光照強度對光合作用速率」的實驗中，當光照強度由低增至中等，速率隨之上升；但再增強光照，速率不再上升而保持水平。對「保持水平」這一段，最合理的詮釋是？',
      'In an experiment on light intensity vs photosynthetic rate, the rate rises as light increases from low to moderate, but at high light the rate plateaus. The best interpretation of the PLATEAU is that?'),
    [opt('光照已不再是限制因素，速率改由其他因素（如 CO₂ 濃度或溫度）所限制',
        'light is no longer the limiting factor; another factor (e.g. CO₂ concentration or temperature) now limits the rate'),
      opt('光照仍然是限制因素',
        'light is still the limiting factor'),
      opt('植物已停止進行光合作用',
        'the plant has stopped photosynthesising'),
      opt('增強光照會降低速率',
        'more light lowers the rate')],
    C('上升段表示光是限制因素；到平台期，再加光也不升，代表光已充足，瓶頸轉為另一因素（CO₂ 或溫度）。這是「限制因素」概念的核心判讀。\n\n【陷阱】「仍是限制因素」與平台不再上升矛盾；「停止光合」與仍維持高速率矛盾；「加光降速」在未達光抑制前並不成立。',
      'The rising part shows light limiting; at the plateau, more light gives no increase, so light is now sufficient and the bottleneck shifts to another factor (CO₂ or temperature). This is the core of the limiting-factor concept.\n\n【Trap】 “Still limiting” contradicts the plateau; “stopped photosynthesising” contradicts the sustained high rate; “more light lowers rate” doesn’t hold before photo-inhibition.')),
]

export const biologyHellQuestions: Question[] = [...genetics, ...physio, ...data]

export const biologyHellTopics: Topic[] = topicList([
  { topic: T.genetics, fw: FW.genetic,    count: genetics.length },
  { topic: T.physio,   fw: FW.regulation, count: physio.length },
  { topic: T.data,     fw: FW.energy,     count: data.length },
])
