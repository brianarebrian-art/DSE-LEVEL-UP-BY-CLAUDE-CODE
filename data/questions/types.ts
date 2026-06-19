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
  framework: string
  emoji: string
  count: number
}
