import type { Question, Topic } from './types'

export const peQuestions: Question[] = [
  {
    id: 'pe_q1', type: 'mc', subject: 'pe', topic: 'anatomy', topicZh: '人體結構',
    framework: 'sports_science', frameworkZh: '運動科學', frameworkEmoji: '🫀',
    difficulty: 'easy', year: 2023,
    content: '心臟在循環系統中的主要功能是？',
    options: ['泵送血液輸送至全身', '消化食物', '過濾尿液', '交換氣體'], correctIndex: 0,
    explanation: '心臟是循環系統的泵，推動血液把氧氣和養分送到全身。考核重點：器官與系統功能配對。', marks: 2,
  },
  {
    id: 'pe_q2', type: 'mc', subject: 'pe', topic: 'anatomy', topicZh: '人體結構',
    framework: 'sports_science', frameworkZh: '運動科學', frameworkEmoji: '🫀',
    difficulty: 'medium', year: 2022,
    content: '負責伸直膝關節的大腿前方肌肉是？',
    options: ['股四頭肌', '二頭肌', '三角肌', '腹直肌'], correctIndex: 0,
    explanation: '股四頭肌（quadriceps）位於大腿前方，主要負責伸直膝關節（如踢腿、起立）。', marks: 3,
  },
  {
    id: 'pe_q3', type: 'mc', subject: 'pe', topic: 'fitness', topicZh: '體適能',
    framework: 'fitness', frameworkZh: '體適能概念', frameworkEmoji: '💪',
    difficulty: 'medium', year: 2023,
    content: '下列哪一項屬於「與健康相關」的體適能要素？',
    options: ['心肺耐力', '反應時間', '協調', '敏捷'], correctIndex: 0,
    explanation: '健康相關體適能包括心肺耐力、肌力、肌耐力、柔軟度及體成分；反應、協調、敏捷屬技能相關。考核重點：分清兩類體適能。', marks: 3,
  },
  {
    id: 'pe_q4', type: 'mc', subject: 'pe', topic: 'fitness', topicZh: '體適能',
    framework: 'sports_science', frameworkZh: '運動科學', frameworkEmoji: '💪',
    difficulty: 'medium', year: 2021,
    content: '下列哪項屬於典型的「有氧運動」（aerobic exercise）？',
    options: ['慢跑', '100 米全速衝刺', '單次最大力量舉重', '擲鉛球'], correctIndex: 0,
    explanation: '有氧運動為長時間、中等強度、有氧供能的運動（如慢跑、游水）；短時爆發運動屬無氧。', marks: 3,
  },
  {
    id: 'pe_q5', type: 'mc', subject: 'pe', topic: 'training', topicZh: '訓練原則',
    framework: 'training', frameworkZh: '訓練原則', frameworkEmoji: '🏋️',
    difficulty: 'medium', year: 2022,
    content: '「FITT」原則中的「F」代表？',
    options: ['Frequency（頻率）', 'Force（力量）', 'Food（食物）', 'Flexibility（柔軟度）'], correctIndex: 0,
    explanation: 'FITT = Frequency（頻率）、Intensity（強度）、Time（時間）、Type（類型），是制訂運動處方的框架。', marks: 3,
  },
  {
    id: 'pe_q6', type: 'mc', subject: 'pe', topic: 'training', topicZh: '訓練原則',
    framework: 'training', frameworkZh: '訓練原則', frameworkEmoji: '🏋️',
    difficulty: 'easy', year: 2023,
    content: '運動前進行「熱身」的主要目的是？',
    options: ['預防受傷並提升表現', '消耗全部體力', '令肌肉立即變大', '降低體溫'], correctIndex: 0,
    explanation: '熱身提高體溫、心率及肌肉血流，增加關節活動度，從而減低受傷風險並提升表現。', marks: 2,
  },
  {
    id: 'pe_q7', type: 'mc', subject: 'pe', topic: 'sports_science', topicZh: '運動科學',
    framework: 'sports_science', frameworkZh: '運動科學', frameworkEmoji: '🔬',
    difficulty: 'hard', year: 2022,
    content: '肌肉收縮所需的直接能量來源是？',
    options: ['ATP（三磷酸腺苷）', 'DNA', '乳酸', '純水'], correctIndex: 0,
    explanation: '肌肉收縮直接消耗 ATP；乳酸是無氧代謝的副產物，並非能量來源。考核重點：ATP 是身體的「能量貨幣」。', marks: 4,
  },
]

export const peTopics: Topic[] = [
  { id: 'anatomy', zh: '人體結構', framework: '運動科學', emoji: '🫀', count: 2 },
  { id: 'fitness', zh: '體適能', framework: '體適能概念', emoji: '💪', count: 2 },
  { id: 'training', zh: '訓練原則', framework: '訓練原則', emoji: '🏋️', count: 2 },
  { id: 'sports_science', zh: '運動科學', framework: '運動科學', emoji: '🔬', count: 1 },
]
