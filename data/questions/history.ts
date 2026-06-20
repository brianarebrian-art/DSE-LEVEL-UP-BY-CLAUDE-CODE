import type { Question, Topic } from './types'

export const historyQuestions: Question[] = [
  {
    id: 'his_q1', type: 'mc', subject: 'history', topic: 'world_wars', topicZh: '世界大戰',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'easy', year: 2023,
    content: '第一次世界大戰於哪一年爆發？',
    options: ['1914', '1918', '1939', '1945'], correctIndex: 0,
    explanation: '一戰於 1914 年爆發，1918 年結束。考核重點：記熟兩次大戰的起訖年份（一戰 1914–1918）。', marks: 2,
  },
  {
    id: 'his_q2', type: 'mc', subject: 'history', topic: 'world_wars', topicZh: '世界大戰',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'easy', year: 2022,
    content: '第二次世界大戰於哪一年結束？',
    options: ['1939', '1942', '1945', '1950'], correctIndex: 2,
    explanation: '二戰於 1939 年爆發，1945 年結束（德國 5 月投降、日本 8 月投降）。', marks: 2,
  },
  {
    id: 'his_q3', type: 'mc', subject: 'history', topic: 'intl_cooperation', topicZh: '國際合作',
    framework: 'causation', frameworkZh: '因果分析', frameworkEmoji: '🔗',
    difficulty: 'medium', year: 2023,
    content: '第一次世界大戰後成立、旨在維持國際和平的組織是？',
    options: ['國際聯盟', '聯合國', '北約', '歐洲聯盟'], correctIndex: 0,
    explanation: '國際聯盟（League of Nations）於一戰後成立；聯合國則在二戰後（1945）成立。考核重點：分清兩者的成立背景。', marks: 3,
  },
  {
    id: 'his_q4', type: 'mc', subject: 'history', topic: 'intl_cooperation', topicZh: '國際合作',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'easy', year: 2021,
    content: '聯合國（United Nations）於哪一年成立？',
    options: ['1919', '1939', '1945', '1950'], correctIndex: 2,
    explanation: '聯合國於 1945 年二戰結束後成立，總部設於紐約。', marks: 2,
  },
  {
    id: 'his_q5', type: 'mc', subject: 'history', topic: 'cold_war', topicZh: '冷戰',
    framework: 'causation', frameworkZh: '因果分析', frameworkEmoji: '🔗',
    difficulty: 'medium', year: 2022,
    content: '冷戰期間，兩個主要對立的超級大國是？',
    options: ['美國與蘇聯', '英國與法國', '中國與日本', '德國與意大利'], correctIndex: 0,
    explanation: '冷戰（約 1947–1991）是以美國為首的資本主義陣營與蘇聯為首的共產主義陣營的對峙。考核重點：冷戰的兩大陣營。', marks: 3,
  },
  {
    id: 'his_q6', type: 'mc', subject: 'history', topic: 'modern_china', topicZh: '近代中國',
    framework: 'chronology', frameworkZh: '時序脈絡', frameworkEmoji: '⏳',
    difficulty: 'medium', year: 2023,
    content: '五四運動發生於哪一年？',
    options: ['1911', '1919', '1937', '1949'], correctIndex: 1,
    explanation: '五四運動於 1919 年爆發，是一場反帝國主義的愛國及新文化運動。考核重點：記熟近代中國重要事件年份。', marks: 3,
  },
]

export const historyTopics: Topic[] = [
  { id: 'world_wars', zh: '世界大戰', en: 'World Wars', framework: '時序脈絡', frameworkEn: 'Chronological Context', emoji: '⏳', count: 2 },
  { id: 'intl_cooperation', zh: '國際合作', en: 'International Cooperation', framework: '因果分析', frameworkEn: 'Causal Analysis', emoji: '🔗', count: 2 },
  { id: 'cold_war', zh: '冷戰', en: 'The Cold War', framework: '因果分析', frameworkEn: 'Causal Analysis', emoji: '🔗', count: 1 },
  { id: 'modern_china', zh: '近代中國', en: 'Modern China', framework: '時序脈絡', frameworkEn: 'Chronological Context', emoji: '⏳', count: 1 },
]
