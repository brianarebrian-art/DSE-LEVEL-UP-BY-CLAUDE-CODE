import type { Question, Topic } from './types'

// ───────────────────────────────────────────────────────────────────────────
// HKDSE Physical Education — Paper 1 (MCQ & short questions, 42% from 2026)
// 考核重點 → 深題題庫。對標 EDB《體育科課程及評估指引》理論部分：
//   Part II 人體（解剖生理）、Part III 動作分析（生物力學）、
//   Part IV 體適能與營養、Part V 運動生理與訓練、Part VI 運動創傷、
//   Part VII 運動心理（動作學習）。
// 計算題（最大心率 / 心輸出量 / BMI / 目標心率）由引擎計算，答案 code-verified。
// 體育為雙語科：每題同時生成中英。
// ───────────────────────────────────────────────────────────────────────────

type Pair = [zh: string, en: string]

const TOPICS = {
  anatomy: { id: 'anatomy', zh: '人體結構', en: 'Anatomy', emoji: '🦴' },
  physiology: { id: 'physiology', zh: '生理系統', en: 'Physiology', emoji: '❤️' },
  biomechanics: { id: 'biomechanics', zh: '動作分析', en: 'Movement Analysis', emoji: '⚙️' },
  fitness_training: { id: 'fitness_training', zh: '體適能與訓練', en: 'Fitness & Training', emoji: '💪' },
  nutrition_health: { id: 'nutrition_health', zh: '營養與健康', en: 'Nutrition & Health', emoji: '🥗' },
  injuries: { id: 'injuries', zh: '運動創傷', en: 'Sports Injuries', emoji: '🩹' },
  psychology: { id: 'psychology', zh: '運動心理', en: 'Sport Psychology', emoji: '🧠' },
} as const

const FW = {
  science: { id: 'science', zh: '運動科學', en: 'Sport Science', emoji: '🔬' },
  biomech: { id: 'biomech', zh: '生物力學', en: 'Biomechanics', emoji: '⚙️' },
  calc: { id: 'calc', zh: '應用計算', en: 'Applied Calculation', emoji: '🧮' },
  training: { id: 'training', zh: '訓練原則', en: 'Training Principles', emoji: '🏋️' },
  concept: { id: 'concept', zh: '概念理解', en: 'Concepts', emoji: '🧠' },
} as const

type TopicMeta = (typeof TOPICS)[keyof typeof TOPICS]
type FwMeta = (typeof FW)[keyof typeof FW]

function q(
  id: string, topic: TopicMeta, fw: FwMeta, difficulty: 'easy' | 'medium' | 'hard',
  year: number, marks: number, content: Pair, opts: Pair[], explanation: Pair,
): Question {
  return {
    id, type: 'mc', subject: 'pe',
    topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
    framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
    difficulty, year,
    content: content[0], contentEn: content[1],
    options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
    correctIndex: 0,
    explanation: explanation[0], explanationEn: explanation[1],
    marks,
  }
}

// ── Calc engines (answers computed, not hand-typed) ──────────────────────────
function maxHrQ(age: number, year: number): Question {
  const a = 220 - age
  return q(`pe_hrmax_${age}`, TOPICS.physiology, FW.calc, 'medium', year, 3,
    [`以「220 − 年齡」估算，一名 ${age} 歲學生的最大心率（HRmax）約為？`,
      `Using the "220 − age" formula, the estimated maximum heart rate (HRmax) of a ${age}-year-old is about?`],
    [[`${a} 次/分鐘`, `${a} bpm`], [`${220 + age} 次/分鐘`, `${220 + age} bpm`], ['200 次/分鐘', '200 bpm'], [`${210 - age} 次/分鐘`, `${210 - age} bpm`]],
    [`最大心率的常用估算公式為 220 − 年齡 = 220 − ${age} = ${a} 次/分鐘。此公式只屬粗略估算，個體差異可達 ±10–12 次。`,
      `Estimated HRmax = 220 − age = 220 − ${age} = ${a} bpm. This is only a rough estimate; individual variation can be ±10–12 bpm.`])
}
function targetHrQ(age: number, pct: number, year: number): Question {
  const max = 220 - age, t = Math.round(max * pct / 100)
  return q(`pe_thr_${age}_${pct}`, TOPICS.physiology, FW.calc, 'hard', year, 4,
    [`一名 ${age} 歲學生以「220 − 年齡」估算最大心率，若要在最大心率的 ${pct}% 強度下訓練，目標心率約為？`,
      `A ${age}-year-old uses "220 − age" for HRmax. To train at ${pct}% of HRmax, the target heart rate is about?`],
    [[`${t} 次/分鐘`, `${t} bpm`], [`${Math.round(220 * pct / 100)} 次/分鐘`, `${Math.round(220 * pct / 100)} bpm`], [`${max} 次/分鐘`, `${max} bpm`], [`${Math.round(max * (pct - 10) / 100)} 次/分鐘`, `${Math.round(max * (pct - 10) / 100)} bpm`]],
    [`先求最大心率 220 − ${age} = ${max}，再取 ${pct}%：${max} × ${pct}% = ${t} 次/分鐘。常見錯誤是直接用 220 × ${pct}%（漏減年齡）。`,
      `First HRmax = 220 − ${age} = ${max}, then take ${pct}%: ${max} × ${pct}% = ${t} bpm. A common error is using 220 × ${pct}% (forgetting to subtract age).`])
}
function cardiacOutputQ(hr: number, sv: number, year: number): Question {
  const ml = hr * sv, L = (ml / 1000).toFixed(1)
  return q(`pe_co_${hr}_${sv}`, TOPICS.physiology, FW.calc, 'hard', year, 4,
    [`若心率為 ${hr} 次/分鐘、每搏輸出量（stroke volume）為 ${sv} 毫升，心輸出量（Q = 心率 × 每搏輸出量）為？`,
      `If heart rate is ${hr} bpm and stroke volume is ${sv} mL, the cardiac output (Q = HR × SV) is?`],
    [[`${L} 升/分鐘（${ml} 毫升）`, `${L} L/min (${ml} mL)`], [`${hr + sv} 毫升/分鐘`, `${hr + sv} mL/min`], [`${(ml / 2000).toFixed(1)} 升/分鐘`, `${(ml / 2000).toFixed(1)} L/min`], [`${ml} 升/分鐘`, `${ml} L/min`]],
    [`心輸出量 Q = 心率 × 每搏輸出量 = ${hr} × ${sv} = ${ml} 毫升/分鐘 = ${L} 升/分鐘。注意單位：毫升 ÷ 1000 = 升；把兩數相加（${hr + sv}）是常見錯誤。`,
      `Cardiac output Q = HR × SV = ${hr} × ${sv} = ${ml} mL/min = ${L} L/min. Watch the units (mL ÷ 1000 = L); adding the two numbers (${hr + sv}) is a common error.`])
}
function bmiQ(kg: number, m: number, year: number): Question {
  const bmi = (kg / (m * m)).toFixed(1)
  return q(`pe_bmi_${kg}_${String(m).replace('.', '')}`, TOPICS.nutrition_health, FW.calc, 'medium', year, 3,
    [`一名學生體重 ${kg} 公斤、身高 ${m} 米。其身體質量指數（BMI = 體重 ÷ 身高²）為？`,
      `A student weighs ${kg} kg and is ${m} m tall. Their Body Mass Index (BMI = weight ÷ height²) is?`],
    [[`${bmi}`, `${bmi}`], [`${(kg / m).toFixed(1)}`, `${(kg / m).toFixed(1)}`], [`${(kg / (m * m) * 1.1).toFixed(1)}`, `${(kg / (m * m) * 1.1).toFixed(1)}`], [`${(kg / (m * m) * 0.9).toFixed(1)}`, `${(kg / (m * m) * 0.9).toFixed(1)}`]],
    [`BMI = 體重 ÷ 身高² = ${kg} ÷ ${m}² = ${kg} ÷ ${(m * m).toFixed(2)} = ${bmi}。常見錯誤是只除身高一次（${(kg / m).toFixed(1)}）而非身高的平方。`,
      `BMI = weight ÷ height² = ${kg} ÷ ${m}² = ${kg} ÷ ${(m * m).toFixed(2)} = ${bmi}. A common error is dividing by height once (${(kg / m).toFixed(1)}) instead of height squared.`])
}

// ── Bank ─────────────────────────────────────────────────────────────────────
export const peQuestions: Question[] = [
  // ▸ 人體結構
  q('pe_joint_knee', TOPICS.anatomy, FW.science, 'medium', 2023, 3,
    ['膝關節（knee）容許小腿主要在一個平面上屈伸，屬於哪一類關節？',
      'The knee allows the lower leg to bend and straighten mainly in one plane. It is which type of joint?'],
    [['屈戌關節 / 鉸鏈關節（hinge joint）', 'Hinge joint'], ['球窩關節（ball-and-socket）', 'Ball-and-socket joint'], ['樞軸關節（pivot joint）', 'Pivot joint'], ['滑動關節（gliding joint）', 'Gliding joint']],
    ['膝關節屬鉸鏈關節，主要容許單一平面的屈曲與伸展（如蹲與站）。球窩關節（肩、髖）可作多方向轉動；樞軸關節容許旋轉（如頸部寰樞關節）；滑動關節作小幅平移（如腕骨間）。',
      'The knee is a hinge joint, allowing flexion/extension in one plane (squat and stand). Ball-and-socket joints (shoulder, hip) move in all directions, pivot joints allow rotation (e.g. the neck), and gliding joints allow small sliding (e.g. between carpals).']),
  q('pe_joint_shoulder', TOPICS.anatomy, FW.science, 'medium', 2021, 3,
    ['肩關節與髖關節容許手臂或大腿向各個方向大幅度轉動，屬於哪一類關節？',
      'The shoulder and hip allow the limb to move in all directions through a wide range. They are which type of joint?'],
    [['球窩關節（ball-and-socket）', 'Ball-and-socket joint'], ['屈戌 / 鉸鏈關節（hinge）', 'Hinge joint'], ['樞軸關節（pivot）', 'Pivot joint'], ['不動關節（fixed / immovable）', 'Fixed (immovable) joint']],
    ['球窩關節（肩、髖）的球狀骨頭嵌入窩內，可作屈伸、外展內收與旋轉等多軸運動，活動範圍最大。鉸鏈只一個平面；樞軸只旋轉；不動關節（如顱骨縫）不能活動。',
      'A ball-and-socket joint (shoulder, hip) seats a rounded head in a socket, allowing multi-axis movement (flexion, abduction, rotation) with the greatest range. A hinge moves in one plane, a pivot only rotates, and fixed joints (e.g. skull sutures) do not move.']),
  q('pe_antagonist_elbow', TOPICS.anatomy, FW.science, 'hard', 2022, 4,
    ['做「二頭肌彎舉」屈曲手肘時，肱二頭肌為主動肌（agonist）。此時放鬆、起相反作用的拮抗肌（antagonist）是？',
      'During a biceps curl (elbow flexion), the biceps brachii is the agonist. Which muscle is the relaxing antagonist?'],
    [['肱三頭肌（triceps brachii）', 'Triceps brachii'], ['肱二頭肌本身（biceps brachii）', 'The biceps brachii itself'], ['股四頭肌（quadriceps）', 'Quadriceps'], ['三角肌（deltoid）', 'Deltoid']],
    ['屈肘時肱二頭肌收縮（主動肌），其拮抗肌肱三頭肌則放鬆伸長——兩者位於上臂前後、作用相反。股四頭肌在大腿、三角肌在肩，均不參與此屈肘動作的拮抗。',
      'In elbow flexion the biceps contracts (agonist) while its antagonist, the triceps, relaxes and lengthens — the two lie front and back of the upper arm with opposite actions. The quadriceps (thigh) and deltoid (shoulder) are not the antagonist here.']),
  q('pe_bone_femur', TOPICS.anatomy, FW.science, 'easy', 2020, 2,
    ['人體最長、最強壯的骨——大腿骨——的名稱是？', 'The longest and strongest bone in the body — the thigh bone — is the?'],
    [['股骨（femur）', 'Femur'], ['脛骨（tibia）', 'Tibia'], ['肱骨（humerus）', 'Humerus'], ['橈骨（radius）', 'Radius']],
    ['股骨（femur）位於大腿，是人體最長最強的骨，承托大部分體重。脛骨在小腿、肱骨在上臂、橈骨在前臂。',
      'The femur is the thigh bone — the longest and strongest bone, bearing much of the body’s weight. The tibia is in the lower leg, the humerus in the upper arm, and the radius in the forearm.']),

  // ▸ 生理系統（含計算引擎）
  maxHrQ(16, 2023),
  cardiacOutputQ(70, 80, 2022),
  targetHrQ(20, 70, 2024),
  q('pe_energy_atp_pc', TOPICS.physiology, FW.science, 'hard', 2023, 4,
    ['進行一次約 6 秒的全力短跑時，肌肉最即時、不需氧氣、依靠肌酸磷酸（creatine phosphate）供能的系統是？',
      'For an all-out 6-second sprint, the most immediate, oxygen-free system using creatine phosphate to supply ATP is the?'],
    [['磷酸原系統（ATP-PC / 磷酸系統）', 'ATP-PC (phosphagen) system'], ['有氧系統（aerobic system）', 'Aerobic system'], ['乳酸系統（無氧糖酵解）', 'Lactic acid (anaerobic glycolysis) system'], ['消化系統（digestive system）', 'Digestive system']],
    ['ATP-PC（磷酸原）系統利用肌酸磷酸極速再生 ATP，供能最快但只維持約 6–10 秒，適用於爆發性動作。乳酸系統供能約 10 秒至 2 分鐘並產生乳酸；有氧系統供應長時間運動；消化系統與即時供能無關。',
      'The ATP-PC (phosphagen) system regenerates ATP rapidly from creatine phosphate — fastest but lasting only ~6–10 s, for explosive efforts. The lactic acid system fuels ~10 s–2 min and produces lactate; the aerobic system fuels prolonged exercise; the digestive system is unrelated to immediate ATP supply.']),
  q('pe_energy_aerobic', TOPICS.physiology, FW.science, 'medium', 2021, 3,
    ['進行馬拉松等長時間、中低強度運動時，身體主要依靠哪一個能量系統？',
      'During long-duration, low-to-moderate intensity exercise such as a marathon, the body mainly relies on which energy system?'],
    [['有氧系統（aerobic system）', 'Aerobic system'], ['磷酸原系統（ATP-PC）', 'ATP-PC (phosphagen) system'], ['乳酸系統（anaerobic glycolysis）', 'Lactic acid (anaerobic) system'], ['神經系統（nervous system）', 'Nervous system']],
    ['長時間耐力運動以有氧系統為主，利用氧氣分解碳水化合物與脂肪，持久而供能效率高。ATP-PC 只供短促爆發；乳酸系統供中短高強度並積累乳酸；神經系統負責傳訊而非供能。',
      'Endurance exercise is fuelled mainly by the aerobic system, using oxygen to break down carbohydrates and fats for sustained energy. ATP-PC fuels only brief bursts, the lactic acid system fuels short-to-moderate high-intensity work (accumulating lactate), and the nervous system signals rather than supplies energy.']),
  q('pe_energy_lactic', TOPICS.physiology, FW.science, 'hard', 2022, 4,
    ['進行約 40 秒至 1 分鐘的高強度運動（如 400 米跑），在氧氣不足下分解葡萄糖並積累乳酸的系統是？',
      'For ~40 s–1 min of high-intensity exercise (e.g. a 400 m run), the system that breaks down glucose without enough oxygen and accumulates lactate is the?'],
    [['乳酸系統（無氧糖酵解）', 'Lactic acid system (anaerobic glycolysis)'], ['有氧系統（aerobic）', 'Aerobic system'], ['磷酸原系統（ATP-PC）', 'ATP-PC system'], ['循環系統（circulatory）', 'Circulatory system']],
    ['乳酸系統（無氧糖酵解）在氧氣不足時分解葡萄糖快速供能，副產物乳酸積累會導致肌肉疲勞，主導約 10 秒至 2 分鐘的高強度運動。ATP-PC 只供約 6–10 秒；有氧系統需充足氧氣；循環系統負責運輸而非供能。',
      'The lactic acid system (anaerobic glycolysis) breaks down glucose for fast energy when oxygen is short; the by-product lactate builds up and causes fatigue, dominating ~10 s–2 min of high-intensity work. ATP-PC lasts only ~6–10 s, the aerobic system needs ample oxygen, and the circulatory system transports rather than supplies energy.']),
  q('pe_atp_direct', TOPICS.physiology, FW.science, 'medium', 2019, 3,
    ['肌肉收縮所需能量的「直接」來源（身體的「能量貨幣」）是？',
      'The “direct” energy source for muscle contraction — the body’s “energy currency” — is?'],
    [['ATP（三磷酸腺苷）', 'ATP (adenosine triphosphate)'], ['乳酸（lactic acid）', 'Lactic acid'], ['葡萄糖（glucose）', 'Glucose'], ['水（water）', 'Water']],
    ['一切肌肉收縮都直接分解 ATP 釋放能量，故 ATP 被稱為「能量貨幣」。葡萄糖等養分須先轉化為 ATP 才能供肌肉使用；乳酸是無氧代謝的副產物，並非能量來源。',
      'All muscle contraction directly splits ATP to release energy, so ATP is the “energy currency”. Fuels like glucose must first be converted into ATP before muscles can use them; lactate is a by-product of anaerobic metabolism, not an energy source.']),

  // ▸ 動作分析（生物力學）
  q('pe_lever_third', TOPICS.biomechanics, FW.biomech, 'hard', 2023, 4,
    ['做二頭肌彎舉時，手肘為支點、重量在手、肌肉拉力位於兩者之間。這屬於哪一類槓桿？',
      'In a biceps curl, the elbow is the fulcrum, the load is in the hand, and the muscle force acts between them. This is which class of lever?'],
    [['第三類槓桿（effort 在中間）', 'Third-class lever (effort in the middle)'], ['第一類槓桿（fulcrum 在中間）', 'First-class lever (fulcrum in the middle)'], ['第二類槓桿（load 在中間）', 'Second-class lever (load in the middle)'], ['不屬於任何槓桿', 'Not a lever at all']],
    ['施力點（肌肉拉力）位於支點與負荷之間者為第三類槓桿，是人體最常見的槓桿（利於速度與活動幅度）。第一類支點在中（如頸部點頭）；第二類負荷在中（如踮腳）。',
      'When the effort (muscle force) lies between the fulcrum and the load, it is a third-class lever — the most common in the body (favouring speed and range). A first-class lever has the fulcrum in the middle (e.g. nodding the head); a second-class lever has the load in the middle (e.g. rising on tiptoe).']),
  q('pe_lever_second', TOPICS.biomechanics, FW.biomech, 'hard', 2024, 4,
    ['踮腳尖（plantar flexion）時，腳掌前端為支點、體重落在足中、小腿肌經跟腱在後拉起。這屬於哪一類槓桿？',
      'Rising on tiptoe (plantar flexion): the ball of the foot is the fulcrum, body weight is in the middle, and the calf pulls up behind. This is which class of lever?'],
    [['第二類槓桿（load 在中間）', 'Second-class lever (load in the middle)'], ['第三類槓桿（effort 在中間）', 'Third-class lever (effort in the middle)'], ['第一類槓桿（fulcrum 在中間）', 'First-class lever (fulcrum in the middle)'], ['滑輪（pulley）', 'A pulley']],
    ['負荷（體重）位於支點與施力點之間者為第二類槓桿，省力但活動幅度較小，踮腳是典型例子。第三類施力在中（如彎舉）；第一類支點在中。',
      'When the load (body weight) lies between the fulcrum and the effort, it is a second-class lever — force-efficient but with smaller range; rising on tiptoe is the classic example. A third-class lever has the effort in the middle (e.g. a curl); a first-class lever has the fulcrum in the middle.']),
  q('pe_newton_third', TOPICS.biomechanics, FW.biomech, 'medium', 2022, 3,
    ['短跑起步時，運動員用力向後蹬起跑器，身體因而被向前推進。這最能說明牛頓哪一條運動定律？',
      'At a sprint start, the athlete pushes back hard on the blocks and is propelled forward. This best illustrates which of Newton’s laws of motion?'],
    [['第三定律（作用與反作用）', 'Third law (action–reaction)'], ['第一定律（慣性）', 'First law (inertia)'], ['第二定律（F = ma）', 'Second law (F = ma)'], ['萬有引力定律', 'The law of universal gravitation']],
    ['向後蹬地（作用力）使地面給予大小相等、方向相反的反作用力把人推前，正是第三定律。第一定律講物體維持原狀的慣性；第二定律 F = ma 講力與加速度關係；萬有引力是另一回事。',
      'Pushing back on the ground (action) produces an equal and opposite reaction force from the ground that drives the runner forward — Newton’s third law. The first law concerns inertia, the second (F = ma) relates force and acceleration, and universal gravitation is a separate law.']),
  q('pe_newton_first', TOPICS.biomechanics, FW.biomech, 'medium', 2020, 3,
    ['一個靜止的冰壺若無外力作用便會保持靜止，一旦推出後在低摩擦冰面上會近乎等速滑行。這體現牛頓哪一條定律？',
      'A stationary curling stone stays still unless a force acts on it, and once pushed it glides at near-constant velocity on low-friction ice. This shows which of Newton’s laws?'],
    [['第一定律（慣性定律）', 'First law (law of inertia)'], ['第三定律（作用與反作用）', 'Third law (action–reaction)'], ['第二定律（F = ma）', 'Second law (F = ma)'], ['能量守恆定律', 'The law of conservation of energy']],
    ['物體在不受（淨）外力時會保持靜止或等速直線運動，這就是慣性（第一定律）；冰面摩擦極小，故冰壺近乎等速滑行。第三定律講作用反作用；第二定律講力造成加速度；能量守恆屬另一範疇。',
      'An object with no net force stays at rest or moves at constant velocity — inertia (first law); the near-frictionless ice lets the stone glide at almost constant speed. The third law is action–reaction, the second (F = ma) links force to acceleration, and conservation of energy is a different principle.']),

  // ▸ 體適能與訓練
  q('pe_component_cardio', TOPICS.fitness_training, FW.science, 'medium', 2023, 3,
    ['「心肺耐力（cardiovascular endurance）」最準確的定義是？',
      'Which is the most accurate definition of “cardiovascular endurance”?'],
    [['心肺循環系統在持續運動中為工作肌肉供應氧氣的能力', 'The ability of the heart, lungs and circulation to supply oxygen to working muscles during sustained exercise'], ['肌肉一次能舉起的最大重量', 'The maximum weight a muscle can lift in one effort'], ['關節可活動的最大範圍', 'The maximum range of motion of a joint'], ['對外來刺激作出反應的快慢', 'How quickly one reacts to a stimulus']],
    ['心肺耐力指心、肺與循環系統在長時間運動中持續供氧予肌肉的能力，是健康相關體適能的核心。一次最大負重屬肌力；關節活動範圍屬柔軟度；反應快慢屬技能相關的反應時間。',
      'Cardiovascular endurance is the capacity of the heart, lungs and circulation to keep supplying oxygen to muscles during prolonged exercise — a core health-related component. Maximum lift is strength, range of motion is flexibility, and reaction speed is the skill-related component reaction time.']),
  q('pe_skill_component', TOPICS.fitness_training, FW.concept, 'medium', 2021, 3,
    ['下列哪一項屬於「技能相關」（skill-related）而非「健康相關」的體適能要素？',
      'Which of the following is a “skill-related” (rather than health-related) component of fitness?'],
    [['敏捷（agility）', 'Agility'], ['心肺耐力（cardiovascular endurance）', 'Cardiovascular endurance'], ['肌力（muscular strength）', 'Muscular strength'], ['柔軟度（flexibility）', 'Flexibility']],
    ['技能相關體適能包括敏捷、平衡、協調、反應時間、速度與爆發力；健康相關則包括心肺耐力、肌力、肌耐力、柔軟度與體成分。敏捷屬技能相關，其餘三項皆屬健康相關。',
      'Skill-related fitness includes agility, balance, coordination, reaction time, speed and power; health-related fitness includes cardiovascular endurance, strength, muscular endurance, flexibility and body composition. Agility is skill-related, while the other three are health-related.']),
  q('pe_fitt', TOPICS.fitness_training, FW.training, 'medium', 2022, 3,
    ['制訂運動處方常用的「FITT」原則，依次代表？', 'The “FITT” principle used to design an exercise programme stands for?'],
    [['頻率、強度、時間、類型（Frequency, Intensity, Time, Type）', 'Frequency, Intensity, Time, Type'], ['力量、強度、技術、團隊（Force, Intensity, Technique, Team）', 'Force, Intensity, Technique, Team'], ['柔軟度、強度、時間、訓練（Flexibility, Intensity, Time, Training）', 'Flexibility, Intensity, Time, Training'], ['頻率、興趣、時間、目標（Frequency, Interest, Time, Target）', 'Frequency, Interest, Time, Target']],
    ['FITT = Frequency（頻率，每週次數）、Intensity（強度）、Time（時間，每次時長）、Type（類型，運動種類），是調控運動量的框架。其餘組合並非標準定義。',
      'FITT = Frequency (sessions per week), Intensity, Time (duration), and Type (kind of activity) — the framework for regulating an exercise dose. The other combinations are not the standard definition.']),
  q('pe_overload', TOPICS.fitness_training, FW.training, 'hard', 2023, 4,
    ['為使體能持續進步，必須逐步增加訓練負荷（如重量、次數或時間），令身體承受高於日常的刺激。這一訓練原則稱為？',
      'To keep improving, training load (weight, reps or time) must be raised gradually so the body is stressed beyond its normal demands. This principle is called?'],
    [['漸進超負荷（progressive overload）', 'Progressive overload'], ['可逆性（reversibility）', 'Reversibility'], ['專項性（specificity）', 'Specificity'], ['個別差異（individuality）', 'Individuality']],
    ['漸進超負荷指逐步提高訓練負荷、令身體不斷適應而進步，是體能訓練的核心。可逆性指停練則退步；專項性指訓練須切合運動需要；個別差異指因人而異。',
      'Progressive overload means gradually increasing the training load so the body keeps adapting and improving — the core of fitness training. Reversibility means gains are lost if training stops, specificity means training must match the activity’s demands, and individuality means responses differ between people.']),
  q('pe_specificity', TOPICS.fitness_training, FW.training, 'medium', 2020, 3,
    ['一名游泳運動員的體能訓練應以游泳動作及相關肌群為主，而非單純跑步。這體現哪一條訓練原則？',
      'A swimmer’s conditioning should focus on swimming actions and the relevant muscles rather than just running. Which training principle does this reflect?'],
    [['專項性（specificity）', 'Specificity'], ['漸進超負荷（progressive overload）', 'Progressive overload'], ['可逆性（reversibility）', 'Reversibility'], ['熱身（warm-up）', 'Warming up']],
    ['專項性指訓練內容須切合該運動的動作模式、能量系統與肌群，效果才能轉移到比賽。漸進超負荷講逐步加量；可逆性講停練退步；熱身是運動前的準備而非訓練原則。',
      'Specificity means training must match the sport’s movement patterns, energy systems and muscle groups for the gains to transfer to competition. Progressive overload is about gradually adding load, reversibility is about losing gains when stopping, and warming up is pre-exercise preparation, not a training principle.']),
  q('pe_reversibility', TOPICS.fitness_training, FW.training, 'medium', 2019, 3,
    ['「用進廢退」——若停止訓練一段時間，先前獲得的體能會逐漸流失。這一訓練原則稱為？',
      '“Use it or lose it” — if training stops for a period, previously gained fitness is gradually lost. This principle is called?'],
    [['可逆性（reversibility）', 'Reversibility'], ['專項性（specificity）', 'Specificity'], ['漸進超負荷（progressive overload）', 'Progressive overload'], ['超量恢復（recovery）', 'Recovery / supercompensation']],
    ['可逆性指訓練適應並非永久，停練後體能會逆轉流失，故須持之以恆。專項性講訓練切合運動需要；漸進超負荷講逐步加量；超量恢復講訓練後適度休息令表現回升。',
      'Reversibility means training adaptations are not permanent — fitness reverses and is lost when training stops, so consistency matters. Specificity is matching training to the activity, progressive overload is gradually adding load, and supercompensation is the rebound in performance after adequate recovery.']),

  // ▸ 營養與健康（含 BMI 計算）
  q('pe_carbohydrate', TOPICS.nutrition_health, FW.concept, 'medium', 2022, 3,
    ['進行高強度運動時，身體最主要、最快被動用的「能量養分」是？',
      'During high-intensity exercise, which macronutrient is the body’s main and most readily used energy fuel?'],
    [['碳水化合物（carbohydrates）', 'Carbohydrates'], ['蛋白質（protein）', 'Protein'], ['維他命（vitamins）', 'Vitamins'], ['水（water）', 'Water']],
    ['碳水化合物分解為葡萄糖／肝醣，是高強度運動最快、最主要的能量來源。蛋白質主要用於修補組織、非首選能源；維他命調節代謝但本身不供能；水並非養分能源。',
      'Carbohydrates break down to glucose/glycogen, the fastest and main fuel for high-intensity exercise. Protein is mainly for tissue repair (not the first-choice fuel), vitamins regulate metabolism but provide no energy themselves, and water is not an energy nutrient.']),
  q('pe_protein', TOPICS.nutrition_health, FW.concept, 'medium', 2021, 3,
    ['運動後，對「肌肉的修補與生長」最為關鍵的營養素是？',
      'After exercise, which nutrient is most important for muscle repair and growth?'],
    [['蛋白質（protein）', 'Protein'], ['碳水化合物（carbohydrates）', 'Carbohydrates'], ['脂肪（fat）', 'Fat'], ['膳食纖維（dietary fibre）', 'Dietary fibre']],
    ['蛋白質提供胺基酸，是修補運動造成的肌肉微損傷及促進肌肉生長的關鍵。碳水化合物主要補充能量／肝醣；脂肪是長時間低強度的能源；纖維助消化但不直接修補肌肉。',
      'Protein supplies amino acids, the key building blocks for repairing exercise-induced muscle damage and for growth. Carbohydrates mainly restore energy/glycogen, fat fuels prolonged low-intensity work, and fibre aids digestion but does not repair muscle.']),
  bmiQ(64, 1.6, 2023),

  // ▸ 運動創傷
  q('pe_rice', TOPICS.injuries, FW.concept, 'medium', 2022, 3,
    ['處理急性軟組織損傷（如拗柴 / 扭傷）常用的「RICE」原則，依次代表？',
      'The “RICE” principle for managing an acute soft-tissue injury (e.g. a sprain) stands for?'],
    [['休息、冰敷、加壓、抬高（Rest, Ice, Compression, Elevation）', 'Rest, Ice, Compression, Elevation'], ['跑步、強度、控制、耐力（Run, Intensity, Control, Endurance）', 'Run, Intensity, Control, Endurance'], ['休息、熱敷、按摩、運動（Rest, Heat, Massage, Exercise）', 'Rest, Heat, Massage, Exercise'], ['補水、冰敷、加壓、伸展（Rehydrate, Ice, Compress, Extend）', 'Rehydrate, Ice, Compress, Extend']],
    ['RICE = Rest（休息）、Ice（冰敷）、Compression（加壓）、Elevation（抬高），目的是減少急性期的腫脹、出血與疼痛。急性期應冰敷而非熱敷，熱敷反而加劇腫脹。',
      'RICE = Rest, Ice, Compression, Elevation, aimed at limiting swelling, bleeding and pain in the acute phase. Ice (not heat) is used early — heat would worsen the swelling.']),
  q('pe_acute_injury', TOPICS.injuries, FW.concept, 'medium', 2021, 3,
    ['打波時突然扭傷腳踝、即時腫痛。這類「突發性、單次外力造成」的損傷屬於？',
      'Suddenly spraining an ankle while playing ball, with immediate pain and swelling, is which type of injury?'],
    [['急性損傷（acute injury）', 'Acute injury'], ['慢性 / 勞損性損傷（chronic / overuse injury）', 'Chronic (overuse) injury'], ['先天性疾病（congenital condition）', 'A congenital condition'], ['過度訓練症候群（overtraining syndrome）', 'Overtraining syndrome']],
    ['急性損傷由單次、突發的外力造成，症狀即時出現（如扭傷、骨折）。慢性／勞損性損傷由長期重複動作累積而成（如肌腱炎）；先天性疾病非運動所致；過度訓練症候群是長期訓練過量的整體反應。',
      'An acute injury results from a single, sudden force with immediate symptoms (e.g. sprain, fracture). A chronic/overuse injury builds up from repeated stress over time (e.g. tendinitis); a congenital condition is not caused by sport; and overtraining syndrome is a systemic response to prolonged excessive training.']),
  q('pe_ice_effect', TOPICS.injuries, FW.concept, 'hard', 2023, 4,
    ['對急性扭傷立即冰敷，主要的生理作用是？',
      'Applying ice immediately to an acute sprain works mainly by?'],
    [['使血管收縮，減少出血、腫脹與疼痛', 'Constricting blood vessels to reduce bleeding, swelling and pain'], ['使血管擴張，增加患處血流', 'Dilating blood vessels to increase blood flow to the area'], ['立即修復撕裂的韌帶', 'Instantly repairing the torn ligament'], ['增強患處肌肉力量', 'Strengthening the muscles at the injury'],],
    ['冰敷令局部血管收縮，減少出血與組織液滲出，從而抑制腫脹，並有麻痺止痛之效。它不會令血管擴張（那是熱敷的作用），亦不能即時修復韌帶或增強肌力。',
      'Ice causes local vasoconstriction, reducing bleeding and fluid leakage to limit swelling, and numbs pain. It does not dilate vessels (that is what heat does), nor can it instantly repair a ligament or build muscle strength.']),

  // ▸ 運動心理
  q('pe_motor_learning', TOPICS.psychology, FW.concept, 'hard', 2024, 4,
    ['按 Fitts 與 Posner 的動作學習理論，學習者由「認知期」、「聯結期」進展，最後達到動作近乎自動化的階段稱為？',
      'In Fitts and Posner’s stages of motor learning, after the cognitive and associative stages, the final stage where movement becomes almost automatic is the?'],
    [['自動化期（autonomous stage）', 'Autonomous stage'], ['認知期（cognitive stage）', 'Cognitive stage'], ['聯結期（associative stage）', 'Associative stage'], ['退化期（regression stage）', 'Regression stage']],
    ['動作學習三階段為認知期（理解動作、錯誤多）、聯結期（練習精煉、錯誤減少）、自動化期（動作熟練近乎自動、可分心兼顧戰術）。「退化期」並非此理論的階段。',
      'The three stages are cognitive (understanding the skill, many errors), associative (refining through practice, fewer errors) and autonomous (skilled and almost automatic, freeing attention for tactics). A “regression stage” is not part of this theory.']),
  q('pe_inverted_u', TOPICS.psychology, FW.concept, 'hard', 2022, 4,
    ['根據「倒 U 假說」（inverted-U hypothesis），運動表現在何種喚醒 / 緊張水平下最佳？',
      'According to the inverted-U hypothesis, sport performance is best at what level of arousal?'],
    [['中等（適度）喚醒水平', 'A moderate (optimal) level of arousal'], ['喚醒水平越高越好', 'The higher the arousal, the better'], ['喚醒水平越低越好', 'The lower the arousal, the better'], ['喚醒水平與表現完全無關', 'Arousal has no relationship to performance']],
    ['倒 U 假說指喚醒由低增至中等時表現上升，超過最佳點後過度緊張反令表現下降，故適度喚醒表現最佳。喚醒過低（鬆懈）或過高（過度焦慮）皆不利表現。',
      'The inverted-U hypothesis states that as arousal rises from low to moderate, performance improves, but beyond the optimal point excessive arousal causes performance to fall — so a moderate level is best. Too little (under-aroused) or too much (over-anxious) both impair performance.']),
  q('pe_intrinsic_feedback', TOPICS.psychology, FW.concept, 'medium', 2021, 3,
    ['運動員憑自身肌肉與關節的「本體感覺」去感知動作是否正確，這種由內在產生的回饋稱為？',
      'When an athlete senses whether a movement was correct through their own muscles and joints (kinaesthesis), this internally generated feedback is called?'],
    [['內在回饋（intrinsic feedback）', 'Intrinsic feedback'], ['外在回饋（extrinsic / augmented feedback）', 'Extrinsic (augmented) feedback'], ['負回饋（negative feedback）', 'Negative feedback'], ['延遲回饋（delayed feedback）', 'Delayed feedback']],
    ['內在回饋來自運動者自身的感覺（本體感覺、視覺、聽覺等），即時感知動作。外在回饋來自外界（如教練講評、計時器）；負回饋、延遲回饋是按性質或時間分類，並非「來源在內」之意。',
      'Intrinsic feedback comes from the performer’s own senses (proprioception, vision, hearing), felt during the movement. Extrinsic (augmented) feedback comes from outside (e.g. a coach’s comments, a timer); negative and delayed feedback classify by nature or timing, not by an internal source.']),
  q('pe_smart_goal', TOPICS.psychology, FW.concept, 'medium', 2020, 3,
    ['設定運動目標常用「SMART」原則，其中「M」代表目標應該？',
      'When setting sport goals using the “SMART” principle, the “M” means a goal should be?'],
    [['可量度（Measurable）', 'Measurable'], ['有趣（Merry / fun）', 'Merry (fun)'], ['困難（Maximal）', 'Maximal (very hard)'], ['神秘（Mysterious）', 'Mysterious']],
    ['SMART = Specific（具體）、Measurable（可量度）、Achievable（可達成）、Relevant（相關）、Time-bound（有時限）。「M」指目標須可量度，以便客觀檢視進度。其餘選項並非 SMART 的定義。',
      'SMART = Specific, Measurable, Achievable, Relevant, Time-bound. The “M” means the goal must be measurable so progress can be checked objectively. The other options are not part of the SMART definition.']),
]

export const peTopics: Topic[] = [
  { id: 'anatomy', zh: '人體結構', en: 'Anatomy', framework: '運動科學', frameworkEn: 'Sports Science', emoji: '🦴', count: 4 },
  { id: 'physiology', zh: '生理系統', en: 'Physiological Systems', framework: '運動科學', frameworkEn: 'Sports Science', emoji: '❤️', count: 7 },
  { id: 'biomechanics', zh: '動作分析', en: 'Movement Analysis', framework: '生物力學', frameworkEn: 'Biomechanics', emoji: '⚙️', count: 4 },
  { id: 'fitness_training', zh: '體適能與訓練', en: 'Fitness & Training', framework: '訓練原則', frameworkEn: 'Training Principles', emoji: '💪', count: 6 },
  { id: 'nutrition_health', zh: '營養與健康', en: 'Nutrition & Health', framework: '概念理解', frameworkEn: 'Concepts', emoji: '🥗', count: 3 },
  { id: 'injuries', zh: '運動創傷', en: 'Sports Injuries', framework: '概念理解', frameworkEn: 'Concepts', emoji: '🩹', count: 3 },
  { id: 'psychology', zh: '運動心理', en: 'Sports Psychology', framework: '概念理解', frameworkEn: 'Concepts', emoji: '🧠', count: 4 },
]
