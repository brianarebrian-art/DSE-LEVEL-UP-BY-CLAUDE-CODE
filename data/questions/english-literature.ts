import type { Question, Topic } from './types'

// Note: DSE Literature in English is essay-based. These MC cover the
// foundational terms, genres and devices as a study aid.
export const englishLiteratureQuestions: Question[] = [
  {
    id: 'enlit_q1', type: 'mc', subject: 'english-literature', topic: 'devices', topicZh: '文學手法',
    framework: 'device', frameworkZh: '手法辨析', frameworkEmoji: '📖',
    difficulty: 'easy', year: 2023,
    content: 'A comparison using "like" or "as" is called a:',
    options: ['simile', 'metaphor', 'personification', 'hyperbole'], correctIndex: 0,
    explanation: 'A simile compares using "like" or "as" (e.g. "as brave as a lion"); a metaphor compares directly without them. 考核重點：simile 與 metaphor 的分別。', marks: 2,
  },
  {
    id: 'enlit_q2', type: 'mc', subject: 'english-literature', topic: 'devices', topicZh: '文學手法',
    framework: 'device', frameworkZh: '手法辨析', frameworkEmoji: '📖',
    difficulty: 'medium', year: 2022,
    content: '"The wind whispered through the trees" is an example of:',
    options: ['personification', 'simile', 'irony', 'alliteration'], correctIndex: 0,
    explanation: 'Personification gives human qualities (whispering) to non-human things (the wind). 考核重點：擬人法（personification）。', marks: 3,
  },
  {
    id: 'enlit_q3', type: 'mc', subject: 'english-literature', topic: 'genres', topicZh: '文學體裁',
    framework: 'genre', frameworkZh: '體裁知識', frameworkEmoji: '📜',
    difficulty: 'medium', year: 2023,
    content: 'A poem of 14 lines, often about love, is called a:',
    options: ['sonnet', 'haiku', 'epic', 'ode'], correctIndex: 0,
    explanation: 'A sonnet has 14 lines (e.g. Shakespearean sonnets). A haiku has 3 lines; an epic is a long narrative poem. 考核重點：詩體 sonnet = 14 行。', marks: 3,
  },
  {
    id: 'enlit_q4', type: 'mc', subject: 'english-literature', topic: 'genres', topicZh: '文學體裁',
    framework: 'genre', frameworkZh: '體裁知識', frameworkEmoji: '📜',
    difficulty: 'easy', year: 2021,
    content: 'Which playwright wrote "Romeo and Juliet"?',
    options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'], correctIndex: 0,
    explanation: '"Romeo and Juliet" is a tragedy by William Shakespeare. 考核重點：經典作品與作者配對。', marks: 2,
  },
  {
    id: 'enlit_q5', type: 'mc', subject: 'english-literature', topic: 'elements', topicZh: '敘事元素',
    framework: 'narrative', frameworkZh: '敘事分析', frameworkEmoji: '🎭',
    difficulty: 'easy', year: 2022,
    content: 'The main character of a story is known as the:',
    options: ['protagonist', 'antagonist', 'narrator', 'author'], correctIndex: 0,
    explanation: 'The protagonist is the central character; the antagonist opposes them. 考核重點：角色術語（protagonist / antagonist）。', marks: 2,
  },
  {
    id: 'enlit_q6', type: 'mc', subject: 'english-literature', topic: 'elements', topicZh: '敘事元素',
    framework: 'narrative', frameworkZh: '敘事分析', frameworkEmoji: '🎭',
    difficulty: 'medium', year: 2023,
    content: 'The atmosphere or feeling a piece of writing creates is its:',
    options: ['mood', 'plot', 'setting', 'rhyme'], correctIndex: 0,
    explanation: '"Mood" is the emotional atmosphere a text evokes in the reader; "tone" is the writer\'s attitude. 考核重點：mood 指作品營造的氣氛。', marks: 3,
  },
]

export const englishLiteratureTopics: Topic[] = [
  { id: 'devices', zh: '文學手法', framework: '手法辨析', emoji: '📖', count: 2 },
  { id: 'genres', zh: '文學體裁', framework: '體裁知識', emoji: '📜', count: 2 },
  { id: 'elements', zh: '敘事元素', framework: '敘事分析', emoji: '🎭', count: 2 },
]
