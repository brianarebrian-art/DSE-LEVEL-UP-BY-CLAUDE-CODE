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
  explanation: string // Path A — formal HKEAA-style marking-scheme reasoning
  explanationEn?: string
  mcHack?: string // Path B — optional "名師速解 / MC Hack" exam shortcut
  mcHackEn?: string
  marks: number
}

// ── Short free-text answer ────────────────────────────────────────────────────
// A few words to one line (a formula, a value, a definition). NEVER auto-graded:
// after submit we reveal the reference answer and the student self-marks. See the
// honesty rule in the three-in-one spec — no "AI marking / 100% accurate" claims.
export interface TextQuestion {
  id: string
  type: 'text'
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
  referenceAnswer: string // revealed after submit; student self-marks against it
  referenceAnswerEn?: string
  explanation: string
  explanationEn?: string
  marks: number
}

// ── Long / structured response ──────────────────────────────────────────────────
// Multi-line working (LQ, structured chemistry/physics). Optional KaTeX in the answer.
// Self-assessed on a 3-level scale (full / partial / none). Never auto-graded.
export interface LongQuestion {
  id: string
  type: 'long'
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
  referenceAnswer: string // model answer (collapsible)
  referenceAnswerEn?: string
  markingScheme?: string // step marks / rubric (collapsible)
  markingSchemeEn?: string
  suggestedMinutes?: number
  marks: number
}

// The static subject banks stay MC-only, so `Question` is unchanged — the existing
// practice engine, loaders and grading keep compiling untouched. Mixed-type surfaces
// (the new answer cards, the arena) opt in to the wider `AnyQuestion` union.
export type Question = MCQuestion
export type AnyQuestion = MCQuestion | TextQuestion | LongQuestion
export type SelfAssessment = 'correct' | 'wrong' | 'full' | 'partial' | 'none'

export interface Topic {
  id: string
  zh: string
  en?: string // English topic name (falls back to zh when absent)
  framework: string
  frameworkEn?: string // English framework label (falls back to framework when absent)
  emoji: string
  count: number
}
