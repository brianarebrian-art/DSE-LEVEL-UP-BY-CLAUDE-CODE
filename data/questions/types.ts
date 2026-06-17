export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MCQuestion {
  id: string
  type: 'mc'
  subject: string
  topic: string
  topicZh: string
  framework: string
  frameworkZh: string
  frameworkEmoji: string
  difficulty: Difficulty
  year: number
  content: string
  options: string[]
  correctIndex: number
  explanation: string
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
