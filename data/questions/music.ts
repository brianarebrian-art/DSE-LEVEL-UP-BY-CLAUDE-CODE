import type { Question, Topic } from './types'

export const musicQuestions: Question[] = [
  {
    id: 'mus_q1', type: 'mc', subject: 'music', topic: 'notation', topicZh: '記譜法',
    framework: 'theory', frameworkZh: '樂理基礎', frameworkEmoji: '🎼',
    difficulty: 'easy', year: 2023,
    content: '在 4/4 拍子中，一個全音符（whole note）佔多少拍？',
    options: ['4 拍', '1 拍', '2 拍', '8 拍'], correctIndex: 0,
    explanation: '在 4/4 拍子中，全音符 = 4 拍、二分音符 = 2 拍、四分音符 = 1 拍。考核重點：音符時值關係。', marks: 2,
  },
  {
    id: 'mus_q2', type: 'mc', subject: 'music', topic: 'notation', topicZh: '記譜法',
    framework: 'theory', frameworkZh: '樂理基礎', frameworkEmoji: '🎼',
    difficulty: 'easy', year: 2022,
    content: '拍號 4/4 表示每一小節有多少拍？',
    options: ['4 拍', '2 拍', '3 拍', '6 拍'], correctIndex: 0,
    explanation: '拍號上面的數字表示每小節的拍數，4/4 即每小節 4 拍，以四分音符為一拍。', marks: 2,
  },
  {
    id: 'mus_q3', type: 'mc', subject: 'music', topic: 'tempo_dynamics', topicZh: '速度與力度',
    framework: 'theory', frameworkZh: '樂理基礎', frameworkEmoji: '🔊',
    difficulty: 'easy', year: 2023,
    content: '力度記號「forte（f）」表示？',
    options: ['強（大聲）', '弱（細聲）', '快', '慢'], correctIndex: 0,
    explanation: 'forte（f）表示強奏；piano（p）表示弱奏。考核重點：分清力度記號 f 與 p。', marks: 2,
  },
  {
    id: 'mus_q4', type: 'mc', subject: 'music', topic: 'tempo_dynamics', topicZh: '速度與力度',
    framework: 'theory', frameworkZh: '樂理基礎', frameworkEmoji: '🔊',
    difficulty: 'medium', year: 2021,
    content: '音樂術語「crescendo」表示？',
    options: ['漸漸大聲（漸強）', '漸漸細聲（漸弱）', '突然停止', '不斷重複'], correctIndex: 0,
    explanation: 'crescendo 表示音量漸強；diminuendo / decrescendo 則為漸弱。', marks: 3,
  },
  {
    id: 'mus_q5', type: 'mc', subject: 'music', topic: 'tempo_dynamics', topicZh: '速度與力度',
    framework: 'theory', frameworkZh: '樂理基礎', frameworkEmoji: '🔊',
    difficulty: 'medium', year: 2022,
    content: '速度術語「Allegro」表示？',
    options: ['快板（快速）', '慢板（緩慢）', '行板（中速）', '極慢'], correctIndex: 0,
    explanation: 'Allegro = 快板；Adagio = 慢板；Andante = 行板。考核重點：常見速度術語。', marks: 3,
  },
  {
    id: 'mus_q6', type: 'mc', subject: 'music', topic: 'instruments', topicZh: '樂器與音程',
    framework: 'knowledge', frameworkZh: '音樂常識', frameworkEmoji: '🎻',
    difficulty: 'medium', year: 2023,
    content: '一個八度（octave）之內共有多少個半音（semitones）？',
    options: ['12 個', '7 個', '8 個', '5 個'], correctIndex: 0,
    explanation: '一個八度包含 12 個半音（如鋼琴上由 C 到下一個 C 之間有 12 個琴鍵）。考核重點：八度 = 12 個半音。', marks: 3,
  },
  {
    id: 'mus_q7', type: 'mc', subject: 'music', topic: 'instruments', topicZh: '樂器與音程',
    framework: 'knowledge', frameworkZh: '音樂常識', frameworkEmoji: '🎻',
    difficulty: 'easy', year: 2022,
    content: '小提琴（Violin）屬於哪一類樂器？',
    options: ['弦樂器', '木管樂器', '銅管樂器', '敲擊樂器'], correctIndex: 0,
    explanation: '小提琴以琴弓摩擦琴弦發聲，屬弦樂器。考核重點：樂器分類（弦／木管／銅管／敲擊）。', marks: 2,
  },
]

export const musicTopics: Topic[] = [
  { id: 'notation', zh: '記譜法', framework: '樂理基礎', emoji: '🎼', count: 2 },
  { id: 'tempo_dynamics', zh: '速度與力度', framework: '樂理基礎', emoji: '🔊', count: 3 },
  { id: 'instruments', zh: '樂器與音程', framework: '音樂常識', emoji: '🎻', count: 2 },
]
