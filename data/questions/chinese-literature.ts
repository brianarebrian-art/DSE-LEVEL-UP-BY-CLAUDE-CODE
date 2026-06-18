import type { Question, Topic } from './types'

// Note: DSE 中國文學 is assessed by essays/appreciation. These MC cover the
// factual/conceptual foundation (genres, works, techniques) as a study aid.
export const chineseLiteratureQuestions: Question[] = [
  {
    id: 'chlit_q1', type: 'mc', subject: 'chinese-literature', topic: 'works', topicZh: '作家作品',
    framework: 'knowledge', frameworkZh: '文學常識', frameworkEmoji: '📚',
    difficulty: 'easy', year: 2023,
    content: '《詩經》是中國最早的一部？',
    options: ['詩歌總集', '史書', '小說集', '戲曲集'], correctIndex: 0,
    explanation: '《詩經》是中國最早的詩歌總集，收錄西周至春秋的詩歌，分「風、雅、頌」。考核重點：重要典籍的性質。', marks: 2,
  },
  {
    id: 'chlit_q2', type: 'mc', subject: 'chinese-literature', topic: 'works', topicZh: '作家作品',
    framework: 'knowledge', frameworkZh: '文學常識', frameworkEmoji: '📚',
    difficulty: 'medium', year: 2022,
    content: '被譽為「詩仙」的唐代詩人是？',
    options: ['李白', '杜甫', '白居易', '王維'], correctIndex: 0,
    explanation: '李白詩風飄逸豪放，被稱為「詩仙」；杜甫沉鬱頓挫，被稱為「詩聖」。考核重點：詩人別稱。', marks: 3,
  },
  {
    id: 'chlit_q3', type: 'mc', subject: 'chinese-literature', topic: 'works', topicZh: '作家作品',
    framework: 'knowledge', frameworkZh: '文學常識', frameworkEmoji: '📚',
    difficulty: 'medium', year: 2023,
    content: '中國古典四大名著之一《紅樓夢》的作者是？',
    options: ['曹雪芹', '施耐庵', '羅貫中', '吳承恩'], correctIndex: 0,
    explanation: '《紅樓夢》作者為曹雪芹；《水滸傳》施耐庵、《三國演義》羅貫中、《西遊記》吳承恩。', marks: 3,
  },
  {
    id: 'chlit_q4', type: 'mc', subject: 'chinese-literature', topic: 'genres', topicZh: '文體源流',
    framework: 'genre', frameworkZh: '文體辨析', frameworkEmoji: '✒️',
    difficulty: 'medium', year: 2021,
    content: '「唐詩、宋詞、元曲」中的「詞」最興盛於哪個朝代？',
    options: ['宋', '唐', '元', '明'], correctIndex: 0,
    explanation: '詞起於唐、盛於宋，故有「宋詞」之稱；曲則盛於元。考核重點：各文體的興盛朝代。', marks: 3,
  },
  {
    id: 'chlit_q5', type: 'mc', subject: 'chinese-literature', topic: 'genres', topicZh: '文體源流',
    framework: 'genre', frameworkZh: '文體辨析', frameworkEmoji: '✒️',
    difficulty: 'easy', year: 2022,
    content: '散文與韻文（詩、詞）最主要的分別是？',
    options: ['散文不受押韻及固定格律限制', '散文必須押韻', '散文有固定字數', '韻文沒有意境'], correctIndex: 0,
    explanation: '韻文講求押韻、格律；散文則句式自由、不受嚴格格律限制。考核重點：散文與韻文的形式差異。', marks: 2,
  },
  {
    id: 'chlit_q6', type: 'mc', subject: 'chinese-literature', topic: 'techniques', topicZh: '表現手法',
    framework: 'technique', frameworkZh: '手法分析', frameworkEmoji: '🎨',
    difficulty: 'medium', year: 2023,
    content: '「借景抒情」是指作者？',
    options: ['透過描寫景物來抒發情感', '純粹客觀記錄景物', '直接議論說理', '羅列數據'], correctIndex: 0,
    explanation: '借景抒情是把情感寄寓於景物描寫之中，達致情景交融。考核重點：常見抒情手法的辨識。', marks: 3,
  },
]

export const chineseLiteratureTopics: Topic[] = [
  { id: 'works', zh: '作家作品', framework: '文學常識', emoji: '📚', count: 3 },
  { id: 'genres', zh: '文體源流', framework: '文體辨析', emoji: '✒️', count: 2 },
  { id: 'techniques', zh: '表現手法', framework: '手法分析', emoji: '🎨', count: 1 },
]
