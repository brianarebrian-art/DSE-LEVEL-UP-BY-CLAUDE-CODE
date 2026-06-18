import type { Question, Topic } from './types'

// Note: DSE Visual Arts is assessed by appreciation essays + portfolio. These MC
// cover the conceptual foundation (elements, principles, art history) as a study aid.
export const visualArtsQuestions: Question[] = [
  {
    id: 'va_q1', type: 'mc', subject: 'visual-arts', topic: 'elements', topicZh: '藝術元素',
    framework: 'elements', frameworkZh: '藝術元素', frameworkEmoji: '🎨',
    difficulty: 'easy', year: 2023,
    content: '下列哪一項是「藝術元素」（elements of art）？',
    options: ['線條', '平衡', '節奏', '比例'], correctIndex: 0,
    explanation: '藝術元素包括線條、形狀、色彩、質感、空間等；平衡、節奏、比例屬「構成原理」（principles）。考核重點：分清元素與原理。', marks: 2,
  },
  {
    id: 'va_q2', type: 'mc', subject: 'visual-arts', topic: 'colour', topicZh: '色彩學',
    framework: 'colour', frameworkZh: '色彩理論', frameworkEmoji: '🌈',
    difficulty: 'easy', year: 2022,
    content: '繪畫中的三原色（primary colours）是？',
    options: ['紅、黃、藍', '紅、綠、藍', '橙、綠、紫', '黑、白、灰'], correctIndex: 0,
    explanation: '傳統顏料三原色為紅、黃、藍，混合可調出其他顏色。考核重點：原色不能由其他顏色混合而成。', marks: 2,
  },
  {
    id: 'va_q3', type: 'mc', subject: 'visual-arts', topic: 'colour', topicZh: '色彩學',
    framework: 'colour', frameworkZh: '色彩理論', frameworkEmoji: '🌈',
    difficulty: 'medium', year: 2023,
    content: '在色環上位置相對、對比強烈的顏色稱為？',
    options: ['互補色', '類似色', '原色', '中性色'], correctIndex: 0,
    explanation: '互補色（complementary colours，如紅與綠）在色環上相對，並列時對比強烈。考核重點：互補色的概念。', marks: 3,
  },
  {
    id: 'va_q4', type: 'mc', subject: 'visual-arts', topic: 'principles', topicZh: '構成原理',
    framework: 'principles', frameworkZh: '構成原理', frameworkEmoji: '⚖️',
    difficulty: 'medium', year: 2021,
    content: '構圖中的「對稱」（symmetry）通常營造怎樣的感覺？',
    options: ['平衡、穩定', '混亂、不安', '快速、動感', '空洞、無物'], correctIndex: 0,
    explanation: '對稱構圖左右（或上下）均衡，給人穩定、莊重的感覺。考核重點：構成原理與視覺感受的關係。', marks: 3,
  },
  {
    id: 'va_q5', type: 'mc', subject: 'visual-arts', topic: 'art_history', topicZh: '藝術史',
    framework: 'history', frameworkZh: '藝術史知識', frameworkEmoji: '🖼️',
    difficulty: 'medium', year: 2022,
    content: '《蒙娜麗莎》（Mona Lisa）的作者，文藝復興時期藝術家是？',
    options: ['達文西', '畢加索', '梵高', '莫奈'], correctIndex: 0,
    explanation: '《蒙娜麗莎》由文藝復興大師達文西（Leonardo da Vinci）所繪。畢加索、梵高、莫奈屬較後期。考核重點：作品與藝術家配對。', marks: 3,
  },
  {
    id: 'va_q6', type: 'mc', subject: 'visual-arts', topic: 'media', topicZh: '媒介與形式',
    framework: 'media', frameworkZh: '媒介認識', frameworkEmoji: '🗿',
    difficulty: 'easy', year: 2023,
    content: '雕塑（sculpture）屬於哪一類藝術形式？',
    options: ['三維（立體）藝術', '二維（平面）藝術', '純文字藝術', '聲音藝術'], correctIndex: 0,
    explanation: '雕塑具長、闊、高三個維度，屬三維（立體）藝術；繪畫則屬二維。考核重點：藝術形式的維度分類。', marks: 2,
  },
]

export const visualArtsTopics: Topic[] = [
  { id: 'elements', zh: '藝術元素', framework: '藝術元素', emoji: '🎨', count: 1 },
  { id: 'colour', zh: '色彩學', framework: '色彩理論', emoji: '🌈', count: 2 },
  { id: 'principles', zh: '構成原理', framework: '構成原理', emoji: '⚖️', count: 1 },
  { id: 'art_history', zh: '藝術史', framework: '藝術史知識', emoji: '🖼️', count: 1 },
  { id: 'media', zh: '媒介與形式', framework: '媒介認識', emoji: '🗿', count: 1 },
]
