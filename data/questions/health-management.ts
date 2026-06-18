import type { Question, Topic } from './types'

export const healthManagementQuestions: Question[] = [
  {
    id: 'hmsc_q1', type: 'mc', subject: 'health-management', topic: 'health_concepts', topicZh: '健康概念',
    framework: 'concept', frameworkZh: '概念理解', frameworkEmoji: '❤️‍🩹',
    difficulty: 'easy', year: 2023,
    content: '世界衛生組織（WHO）對「健康」的定義，包括以下哪幾方面？',
    options: ['身體、心理及社交健康', '只指沒有疾病', '只指身體強壯', '只指心理愉快'], correctIndex: 0,
    explanation: 'WHO 定義健康為身體、心理及社交三方面的完全安康，而不僅是沒有疾病。考核重點：健康是「全人」概念。', marks: 2,
  },
  {
    id: 'hmsc_q2', type: 'mc', subject: 'health-management', topic: 'disease', topicZh: '疾病預防',
    framework: 'prevention', frameworkZh: '預防策略', frameworkEmoji: '🛡️',
    difficulty: 'medium', year: 2022,
    content: '流行性感冒主要透過哪種途徑傳播？',
    options: ['飛沫', '遺傳', '心理壓力', '缺乏運動'], correctIndex: 0,
    explanation: '流感屬飛沫傳播，咳嗽或打噴嚏時的飛沫可傳染他人。考核重點：分清傳染病的傳播途徑。', marks: 3,
  },
  {
    id: 'hmsc_q3', type: 'mc', subject: 'health-management', topic: 'disease', topicZh: '疾病預防',
    framework: 'prevention', frameworkZh: '預防策略', frameworkEmoji: '🛡️',
    difficulty: 'medium', year: 2023,
    content: '接種疫苗屬於哪一級預防？',
    options: ['一級預防（疾病發生前）', '二級預防（早期診斷）', '三級預防（康復）', '不屬於預防'], correctIndex: 0,
    explanation: '一級預防在疾病發生前介入（如疫苗、健康教育）；二級為早期篩查；三級為治療與康復。考核重點：三級預防的分別。', marks: 3,
  },
  {
    id: 'hmsc_q4', type: 'mc', subject: 'health-management', topic: 'lifestyle', topicZh: '生活方式',
    framework: 'concept', frameworkZh: '概念理解', frameworkEmoji: '🥗',
    difficulty: 'easy', year: 2021,
    content: '長期缺乏運動及高糖高脂飲食，較容易引致？',
    options: ['肥胖及相關慢性病', '視力突然變好', '骨骼即時變強', '免疫力無限提升'], correctIndex: 0,
    explanation: '不良生活方式是肥胖、糖尿病、心血管病等慢性非傳染病的主要風險因素。', marks: 2,
  },
  {
    id: 'hmsc_q5', type: 'mc', subject: 'health-management', topic: 'social_care', topicZh: '社會關懷',
    framework: 'care', frameworkZh: '關懷照顧', frameworkEmoji: '🤲',
    difficulty: 'medium', year: 2022,
    content: '為長者提供社會關懷服務的主要目的是？',
    options: ['提升其生活質素與自主能力', '令長者完全依賴他人', '減少與社會接觸', '只提供金錢'], correctIndex: 0,
    explanation: '優質長者照顧著重維持其尊嚴、自主及社交參與，提升整體生活質素。考核重點：以人為本的照顧理念。', marks: 3,
  },
  {
    id: 'hmsc_q6', type: 'mc', subject: 'health-management', topic: 'health_concepts', topicZh: '健康概念',
    framework: 'concept', frameworkZh: '概念理解', frameworkEmoji: '❤️‍🩹',
    difficulty: 'easy', year: 2023,
    content: '下列哪項是良好心理健康的保護因素？',
    options: ['良好的社交支援', '長期孤立', '持續睡眠不足', '濫用藥物'], correctIndex: 0,
    explanation: '家人朋友的社交支援能緩衝壓力，是心理健康的重要保護因素。', marks: 2,
  },
]

export const healthManagementTopics: Topic[] = [
  { id: 'health_concepts', zh: '健康概念', framework: '概念理解', emoji: '❤️‍🩹', count: 2 },
  { id: 'disease', zh: '疾病預防', framework: '預防策略', emoji: '🛡️', count: 2 },
  { id: 'lifestyle', zh: '生活方式', framework: '概念理解', emoji: '🥗', count: 1 },
  { id: 'social_care', zh: '社會關懷', framework: '關懷照顧', emoji: '🤲', count: 1 },
]
