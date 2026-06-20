export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MCQuestion {
  id: string
  type: 'mc'
  subject: string
  topic: string
  topicZh: string
  topicEn?: string
  framework: string
  frameworkZh: string
  frameworkEn?: string
  frameworkEmoji: string
  difficulty: Difficulty
  year: number
  content: string
  contentEn?: string
  options: string[]
  optionsEn?: string[]
  correctIndex: number
  explanation: string
  explanationEn?: string
  marks: number
}

export type Question = MCQuestion

export interface Topic {
  id: string
  zh: string
  en?: string // English topic name (falls back to zh when absent)
  framework: string
  frameworkEn?: string // English framework label (falls back to framework when absent)
  emoji: string
  count: number
}
