import type { Question, Topic } from './types'

export const designTechQuestions: Question[] = [
  {
    id: 'dat_q1', type: 'mc', subject: 'design-tech', topic: 'design_process', topicZh: '設計流程',
    framework: 'design_thinking', frameworkZh: '設計思維', frameworkEmoji: '🛠️',
    difficulty: 'easy', year: 2023,
    content: '設計流程通常以哪一步開始？',
    options: ['確認問題與需求', '量產製造', '包裝出售', '丟棄舊產品'], correctIndex: 0,
    explanation: '設計流程一般為：確認問題 → 蒐集資料 → 構思方案 → 製作原型 → 測試評估。考核重點：設計由「界定問題」開始。', marks: 2,
  },
  {
    id: 'dat_q2', type: 'mc', subject: 'design-tech', topic: 'design_process', topicZh: '設計流程',
    framework: 'design_thinking', frameworkZh: '設計思維', frameworkEmoji: '🛠️',
    difficulty: 'medium', year: 2022,
    content: '製作「原型」（Prototype）的主要作用是？',
    options: ['測試及改良設計', '直接出售圖利', '取代正式產品', '裝飾用途'], correctIndex: 0,
    explanation: '原型讓設計者在量產前測試功能、發現問題並加以改良，降低風險。', marks: 3,
  },
  {
    id: 'dat_q3', type: 'mc', subject: 'design-tech', topic: 'ergonomics', topicZh: '人體工學',
    framework: 'human_factors', frameworkZh: '人因考量', frameworkEmoji: '🧍',
    difficulty: 'medium', year: 2023,
    content: '「人體工學」（Ergonomics）主要研究？',
    options: ['產品與人體之間的配合與舒適', '產品的價格', '工廠的位置', '廣告策略'], correctIndex: 0,
    explanation: '人體工學讓產品配合人體尺寸與動作，提升使用的舒適與安全（如椅子、滑鼠設計）。', marks: 3,
  },
  {
    id: 'dat_q4', type: 'mc', subject: 'design-tech', topic: 'structures', topicZh: '結構與材料',
    framework: 'structure', frameworkZh: '結構原理', frameworkEmoji: '📐',
    difficulty: 'easy', year: 2021,
    content: '在工程結構中，三角形結構的主要特性是？',
    options: ['穩定、不易變形', '極易摺曲', '無承重能力', '只用於裝飾'], correctIndex: 0,
    explanation: '三角形是穩定的幾何結構，受力時不易變形，廣泛用於橋樑、桁架。考核重點：三角形 = 穩定結構。', marks: 2,
  },
  {
    id: 'dat_q5', type: 'mc', subject: 'design-tech', topic: 'structures', topicZh: '結構與材料',
    framework: 'material', frameworkZh: '材料選擇', frameworkEmoji: '🧱',
    difficulty: 'medium', year: 2022,
    content: '選擇產品材料時，下列哪項最應該考慮？',
    options: ['材料特性、成本與用途', '只考慮顏色', '只考慮重量', '完全隨機選擇'], correctIndex: 0,
    explanation: '選材須綜合考慮強度、耐用、成本、可加工性及用途等多項因素。', marks: 3,
  },
  {
    id: 'dat_q6', type: 'mc', subject: 'design-tech', topic: 'design_process', topicZh: '設計流程',
    framework: 'design_thinking', frameworkZh: '設計思維', frameworkEmoji: '🛠️',
    difficulty: 'easy', year: 2023,
    content: '「CAD」是指？',
    options: ['電腦輔助設計', '客戶意見調查', '材料測試報告', '成本分析表'], correctIndex: 0,
    explanation: 'CAD = Computer-Aided Design（電腦輔助設計），用軟件繪製及修改設計圖。', marks: 2,
  },
]

export const designTechTopics: Topic[] = [
  { id: 'design_process', zh: '設計流程', framework: '設計思維', emoji: '🛠️', count: 3 },
  { id: 'ergonomics', zh: '人體工學', framework: '人因考量', emoji: '🧍', count: 1 },
  { id: 'structures', zh: '結構與材料', framework: '結構原理', emoji: '📐', count: 2 },
]
