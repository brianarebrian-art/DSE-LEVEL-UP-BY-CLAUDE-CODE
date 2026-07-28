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
  /**
   * 該課題的真實題數。
   *
   * ⚠️ 此數值由 `getSubjectTopics()` 於讀取時【按真實題庫即時計算】；curated
   * `*Topics` 陣列中所寫的值一律被覆蓋、不具效力，毋須人手維護。
   *
   * 理由：此數字為【用戶可見】內容（/subjects/[subject] 及 /paper-warrior 均有
   * 顯示），而人手維護的數值早已與題庫脫節 —— 2026-07-28 稽核發現 13 項不符，
   * 其中 math quadratic_equations 宣告 22 而實際為 278。向學生顯示失實數字
   * 有違「不虛構數據」原則，故改為衍生，恆常準確，新增試題亦無須另行修改。
   * （執行 `node scripts/qbank/topic-coverage.mjs` 可查看實況。）
   */
  count: number
}
