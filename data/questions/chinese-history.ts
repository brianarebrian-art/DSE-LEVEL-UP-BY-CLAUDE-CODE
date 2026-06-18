import type { Question, Topic } from './types'

export const chineseHistoryQuestions: Question[] = [
  {
    id: 'chis_q1', type: 'mc', subject: 'chinese-history', topic: 'unification', topicZh: '統一王朝',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'easy', year: 2023,
    content: '中國歷史上第一個統一的中央集權王朝是？',
    options: ['秦朝', '漢朝', '唐朝', '周朝'], correctIndex: 0,
    explanation: '秦於公元前 221 年統一六國，建立第一個統一的中央集權王朝。考核重點：秦始皇「車同軌、書同文」。', marks: 2,
  },
  {
    id: 'chis_q2', type: 'mc', subject: 'chinese-history', topic: 'unification', topicZh: '統一王朝',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'medium', year: 2022,
    content: '秦朝統一中國是在哪一年？',
    options: ['公元前 221 年', '公元前 206 年', '公元前 770 年', '公元 220 年'], correctIndex: 0,
    explanation: '秦王嬴政於公元前 221 年滅六國，統一天下，自稱「始皇帝」。', marks: 3,
  },
  {
    id: 'chis_q3', type: 'mc', subject: 'chinese-history', topic: 'golden_ages', topicZh: '盛世治世',
    framework: 'causation', frameworkZh: '因果分析', frameworkEmoji: '🔗',
    difficulty: 'medium', year: 2023,
    content: '「貞觀之治」是哪位皇帝在位時的治世？',
    options: ['唐太宗', '漢武帝', '宋太祖', '清康熙'], correctIndex: 0,
    explanation: '「貞觀之治」是唐太宗李世民在位（627–649）時政治清明、國力強盛的盛世。考核重點：將治世與對應君主配對。', marks: 3,
  },
  {
    id: 'chis_q4', type: 'mc', subject: 'chinese-history', topic: 'institutions', topicZh: '制度演變',
    framework: 'institution', frameworkZh: '制度演變', frameworkEmoji: '🏛️',
    difficulty: 'medium', year: 2021,
    content: '隋唐時期確立、用以選拔官員的制度是？',
    options: ['科舉制度', '世襲制度', '察舉制度', '九品中正制'], correctIndex: 0,
    explanation: '科舉制度以考試選拔官員，打破門第限制，自隋唐確立，沿用至清末。考核重點：科舉制是「以才取士」的里程碑。', marks: 3,
  },
  {
    id: 'chis_q5', type: 'mc', subject: 'chinese-history', topic: 'modern', topicZh: '近代變局',
    framework: 'causation', frameworkZh: '因果分析', frameworkEmoji: '🔗',
    difficulty: 'easy', year: 2023,
    content: '1911 年的辛亥革命推翻了哪一個王朝？',
    options: ['清朝', '明朝', '元朝', '宋朝'], correctIndex: 0,
    explanation: '辛亥革命（1911）推翻清朝，結束了中國兩千多年的帝制，翌年建立中華民國。', marks: 2,
  },
  {
    id: 'chis_q6', type: 'mc', subject: 'chinese-history', topic: 'modern', topicZh: '近代變局',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'medium', year: 2022,
    content: '第一次鴉片戰爭（1840–1842）中，與清朝交戰的國家是？',
    options: ['英國', '法國', '日本', '俄國'], correctIndex: 0,
    explanation: '第一次鴉片戰爭中清朝戰敗於英國，被迫簽訂《南京條約》，割讓香港島。考核重點：鴉片戰爭是中國近代史的開端。', marks: 3,
  },
]

export const chineseHistoryTopics: Topic[] = [
  { id: 'unification', zh: '統一王朝', framework: '時序脈絡', emoji: '⏳', count: 2 },
  { id: 'golden_ages', zh: '盛世治世', framework: '因果分析', emoji: '🔗', count: 1 },
  { id: 'institutions', zh: '制度演變', framework: '制度演變', emoji: '🏛️', count: 1 },
  { id: 'modern', zh: '近代變局', framework: '因果分析', emoji: '🔗', count: 2 },
]
