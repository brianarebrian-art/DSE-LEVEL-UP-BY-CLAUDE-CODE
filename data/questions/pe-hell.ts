import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// Physical Education "hell" set (5★★). Physiology/biomechanics answers hand-computed
// (max HR = 220 − age; BMI = mass/height²; cardiac output = HR × stroke volume).
// Distractors are the standard errors. All hard.
const q = makeQ('pe')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  physio: { id: 'pe_physiology_calc', zh: '運動生理計算', en: 'Exercise physiology — calculation' },
  biomech: { id: 'pe_biomech_systems', zh: '生物力學與能量系統', en: 'Biomechanics & energy systems' },
} satisfies Record<string, TopicMeta>
const FW = {
  calc:  { id: 'calc',  zh: '計算分析', en: 'Quantitative', emoji: '🧮' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `peh_${p}_${++uid}`

const physio: Question[] = [
  q(id('ph'), T.physio, FW.calc, 'hard', 2024, 2,
    C('一名 16 歲學生，用「220 − 年齡」估算最大心率，並以其 60%–80% 作為帶氧訓練的目標心率區間。其目標心率區間約為？',
      'A 16-year-old estimates maximum heart rate as “220 − age” and trains aerobically at 60%–80% of it. The target heart-rate zone is about?'),
    [opt('約 122–163 bpm（最大心率 204）',
        'about 122–163 bpm (max HR 204)'),
      opt('約 132–176 bpm（最大心率 220）',
        'about 132–176 bpm (max HR 220)'),
      opt('約 102–122 bpm',
        'about 102–122 bpm'),
      opt('約 204 bpm 固定不變',
        'a fixed 204 bpm')],
    C('最大心率 = 220 − 16 = 204 bpm。目標區間 = 204 × 60% 至 204 × 80% = 122.4 至 163.2，約 122–163 bpm。\n\n【陷阱】132–176 漏減年齡（用 220）；102–122 用錯百分比；「固定 204」把上限當成訓練心率。',
      'Max HR = 220 − 16 = 204 bpm. Zone = 204 × 60% to 204 × 80% = 122.4 to 163.2, i.e. about 122–163 bpm.\n\n【Trap】 132–176 forgets to subtract age (uses 220); 102–122 uses wrong percentages; “fixed 204” treats the ceiling as the training HR.')),

  q(id('ph'), T.physio, FW.calc, 'hard', 2023, 2,
    C('一名運動員體重 60 kg，身高 1.6 m。其身體質量指數 (BMI) 約為？（BMI = 體重 ÷ 身高²）',
      'An athlete weighs 60 kg and is 1.6 m tall. Their body mass index (BMI) is about? (BMI = mass ÷ height²)'),
    [opt('約 23.4', 'about 23.4'),
     opt('約 37.5', 'about 37.5'),
     opt('約 96', 'about 96'),
     opt('約 3.75', 'about 3.75')],
    C('BMI = 60 ÷ (1.6)² = 60 ÷ 2.56 ≈ 23.4 kg/m²。\n\n【陷阱】37.5 = 60 ÷ 1.6（忘記身高要平方）；96 = 60 × 1.6；3.75 把分子分母倒轉相關。',
      'BMI = 60 ÷ (1.6)² = 60 ÷ 2.56 ≈ 23.4 kg/m².\n\n【Trap】 37.5 = 60 ÷ 1.6 (forgets to square the height); 96 = 60 × 1.6; 3.75 inverts the relationship.')),

  q(id('ph'), T.physio, FW.calc, 'hard', 2024, 2,
    C('某人心率為 70 bpm，每搏輸出量（stroke volume）為 70 mL。其心輸出量（cardiac output）約為？',
      'A person’s heart rate is 70 bpm and stroke volume is 70 mL. Their cardiac output is about?'),
    [opt('約 4.9 L/min', 'about 4.9 L/min'),
     opt('約 140 L/min', 'about 140 L/min'),
     opt('約 1.0 L/min', 'about 1.0 L/min'),
     opt('約 490 L/min', 'about 490 L/min')],
    C('心輸出量 = 心率 × 每搏輸出量 = 70 × 70 = 4900 mL/min = 4.9 L/min。\n\n【陷阱】140 把兩者相加；1.0 把兩者相除；490 漏了單位換算（少 10 倍或多 1 位）。',
      'Cardiac output = heart rate × stroke volume = 70 × 70 = 4900 mL/min = 4.9 L/min.\n\n【Trap】 140 adds them; 1.0 divides them; 490 mishandles the unit conversion.')),
]

const biomech: Question[] = [
  q(id('bi'), T.biomech, FW.apply, 'hard', 2023, 2,
    C('一名運動員進行 100 米全力短跑（約 10–12 秒）。在這段時間內，主要供能的能量系統是？',
      'An athlete runs an all-out 100 m sprint (about 10–12 s). The energy system mainly supplying energy during this effort is?'),
    [opt('ATP-PC（磷酸肌酸）系統 —— 提供極短時間、高強度的即時能量，無需氧氣亦不產生乳酸',
        'the ATP-PC (phosphocreatine) system — instant energy for very short, high-intensity work, without oxygen and without lactic acid'),
      opt('有氧系統（aerobic system）',
        'the aerobic system'),
      opt('乳酸（無氧糖解）系統為唯一供能',
        'the lactic-acid (anaerobic glycolysis) system alone'),
      opt('消化系統', 'the digestive system')],
    C('約 10 秒內的最大強度爆發，主要由 ATP-PC 系統即時供能（肌肉內貯存的 ATP 與磷酸肌酸），快速但容量有限。有氧系統供能慢、適合長時間運動；乳酸系統在較長（約 10 秒至 2 分鐘）高強度時才成主導。\n\n【陷阱】有氧系統供能太慢，不主導短跑；乳酸系統在 100 米初段非主要；消化系統並非能量系統。',
      'A ~10 s maximal burst is powered mainly by the ATP-PC system (stored ATP and phosphocreatine in muscle) — fast but limited. The aerobic system is slow and suits long efforts; the lactic system dominates longer high-intensity work (~10 s to 2 min).\n\n【Trap】 The aerobic system is too slow for a sprint; the lactic system is not primary in the first seconds of a 100 m; the digestive system is not an energy system.')),

  q(id('bi'), T.biomech, FW.apply, 'hard', 2024, 2,
    C('手臂的肘關節屈曲（如做二頭肌彎舉）時，由肱二頭肌發力。從槓桿分類看，肘關節主要屬於哪一類槓桿？',
      'When the elbow flexes (e.g. a biceps curl) powered by the biceps, the elbow joint acts mainly as which class of lever?'),
    [opt('第三類槓桿 —— 施力點（肌肉附著）位於支點（肘）與負載（手中重物）之間',
        'a third-class lever — the effort (muscle attachment) lies between the fulcrum (elbow) and the load (weight in the hand)'),
      opt('第一類槓桿 —— 支點在施力與負載之間',
        'a first-class lever — the fulcrum is between effort and load'),
      opt('第二類槓桿 —— 負載在支點與施力之間',
        'a second-class lever — the load is between fulcrum and effort'),
      opt('不屬於任何槓桿', 'not a lever at all')],
    C('肘屈曲時：支點 = 肘關節，負載 = 手中重物，施力 = 肱二頭肌的附著點，且施力點介於支點與負載之間，屬第三類槓桿（人體大多數關節皆是，利於速度與活動幅度，犧牲省力）。\n\n【陷阱】第一類（如頸部點頭）支點居中；第二類（如提踵）負載居中；「不屬槓桿」否定了關節的力學模型。',
      'In elbow flexion the fulcrum is the elbow, the load is the weight in the hand, and the effort is the biceps attachment, which lies between fulcrum and load — a third-class lever (most body joints are, favouring speed and range over force).\n\n【Trap】 First class (e.g. nodding) has the fulcrum in the middle; second class (e.g. calf raise) has the load in the middle; “not a lever” denies the joint’s mechanics.')),
]

export const peHellQuestions: Question[] = [...physio, ...biomech]
export const peHellTopics: Topic[] = topicList([
  { topic: T.physio,  fw: FW.calc,  count: physio.length },
  { topic: T.biomech, fw: FW.apply, count: biomech.length },
])
