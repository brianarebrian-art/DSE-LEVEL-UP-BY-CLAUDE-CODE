import type { Question, Topic } from './types'

export const thsQuestions: Question[] = [
  {
    id: 'ths_q1', type: 'mc', subject: 'ths', topic: 'tourism_types', topicZh: '旅遊類型',
    framework: 'concept', frameworkZh: '概念理解', frameworkEmoji: '✈️',
    difficulty: 'easy', year: 2023,
    content: '「生態旅遊」（Ecotourism）最強調的是？',
    options: ['保護自然環境與可持續發展', '盡量增加遊客人數', '興建大型主題公園', '購物消費'], correctIndex: 0,
    explanation: '生態旅遊以欣賞及保護自然環境為核心，並惠及當地社區。考核重點：將旅遊類型與其核心理念配對。', marks: 2,
  },
  {
    id: 'ths_q2', type: 'mc', subject: 'ths', topic: 'tourism_types', topicZh: '旅遊類型',
    framework: 'concept', frameworkZh: '概念理解', frameworkEmoji: '✈️',
    difficulty: 'medium', year: 2022,
    content: '「MICE」旅遊是指哪一類旅遊？',
    options: ['會議、獎勵、研討會及展覽', '醫療旅遊', '背包旅遊', '郵輪旅遊'], correctIndex: 0,
    explanation: 'MICE = Meetings、Incentives、Conferences、Exhibitions，屬高消費的商務旅遊類別。', marks: 3,
  },
  {
    id: 'ths_q3', type: 'mc', subject: 'ths', topic: 'hospitality', topicZh: '款待業',
    framework: 'operations', frameworkZh: '營運知識', frameworkEmoji: '🏨',
    difficulty: 'easy', year: 2023,
    content: '酒店「前堂部」（Front Office）的主要職責是？',
    options: ['接待賓客及辦理入住退房', '烹調食物', '清潔客房', '維修設施'], correctIndex: 0,
    explanation: '前堂部負責接待、登記入住（check-in）、退房及客戶查詢，是酒店與賓客的第一接觸點。', marks: 2,
  },
  {
    id: 'ths_q4', type: 'mc', subject: 'ths', topic: 'hospitality', topicZh: '款待業',
    framework: 'operations', frameworkZh: '營運知識', frameworkEmoji: '🏨',
    difficulty: 'medium', year: 2021,
    content: '「包價旅遊」（Package Tour）通常包括以下哪些項目？',
    options: ['交通、住宿及行程安排', '只有機票', '只有酒店', '只有保險'], correctIndex: 0,
    explanation: '包價旅遊由旅行社預先組合交通、住宿、景點行程等，以套票形式出售。', marks: 3,
  },
  {
    id: 'ths_q5', type: 'mc', subject: 'ths', topic: 'service', topicZh: '顧客服務',
    framework: 'service', frameworkZh: '服務質素', frameworkEmoji: '🤝',
    difficulty: 'easy', year: 2022,
    content: '優質顧客服務最重要的是？',
    options: ['了解並滿足顧客需要', '盡快趕走顧客', '提高價格', '減少員工'], correctIndex: 0,
    explanation: '優質服務以顧客為本，準確理解並回應其需要，從而提升滿意度與忠誠度。', marks: 2,
  },
  {
    id: 'ths_q6', type: 'mc', subject: 'ths', topic: 'sustainability', topicZh: '可持續旅遊',
    framework: 'concept', frameworkZh: '概念理解', frameworkEmoji: '🌱',
    difficulty: 'medium', year: 2023,
    content: '可持續旅遊（Sustainable Tourism）的目標是？',
    options: ['平衡旅遊發展與環境、社會保護', '無限擴張旅遊設施', '只追求短期利潤', '忽略當地居民'], correctIndex: 0,
    explanation: '可持續旅遊兼顧經濟、環境與社會三方面，確保旅遊資源能長遠保存予後代。', marks: 3,
  },
]

export const thsTopics: Topic[] = [
  { id: 'tourism_types', zh: '旅遊類型', framework: '概念理解', emoji: '✈️', count: 2 },
  { id: 'hospitality', zh: '款待業', framework: '營運知識', emoji: '🏨', count: 2 },
  { id: 'service', zh: '顧客服務', framework: '服務質素', emoji: '🤝', count: 1 },
  { id: 'sustainability', zh: '可持續旅遊', framework: '概念理解', emoji: '🌱', count: 1 },
]
