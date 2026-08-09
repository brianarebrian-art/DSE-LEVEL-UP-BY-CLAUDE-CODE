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
  // 逐步拆解（#54）—— 真正分好步的解題過程，一步一步揭。
  //
  // ⚠️ 刻意設為 optional 且【不得由 explanation 自動切分】：現行 5,201 條題目的
  // explanation 全部是散文（math 914 條之中 0 條含換行、0 條含編號步驟），按句號
  // 斬開再標「第一步／第二步」只會製造假結構 —— 句子邊界不等於解題步驟。
  // 未有此欄位者，StagedExplanation 會退回「先揭首句提示、再揭全部」的誠實呈現，
  // 措辭不會出現「第 N 步」。新出題目可自行提供真步驟以啟用完整逐步模式。
  steps?: string[]
  stepsEn?: string[]
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
  // 解題思路 —— 與 markingScheme 分工：評分準則說明如何給分，解題思路說明何以如此推想。
  // `TextQuestion` 一直設有此欄位，`LongQuestion` 遺漏，令首批長題入庫時 tsc 報錯
  // （promote 產出的物件帶有此欄，型別卻未宣告）。現補上，並於 LongQuestionCard 渲染。
  explanation?: string
  explanationEn?: string
  suggestedMinutes?: number
  marks: number
}

// `Question` 為 MC 的別名，保留給明確只處理客觀題的呼叫點（練習流程、答題卡、
// 卷霸模擬卷、批改與等級預測）。
//
// 2026-07-31 更新：題庫本身已放寬為混合題型 —— `getSubjectQuestions()` 現時回傳
// `AnyQuestion[]`。原註釋所寫「static subject banks stay MC-only」及所提及的
// 「arena」（該功能連同 arenas／arena_participants／arena_answers 三表已刪除）
// 均已過時，故一併更正。需要只取 MC 者，請用 `getSubjectMCQuestions()`。
export type Question = MCQuestion
export type AnyQuestion = MCQuestion | TextQuestion | LongQuestion
export type SelfAssessment = 'correct' | 'wrong' | 'full' | 'partial' | 'none'

// 「書寫題」指沒有客觀對錯、由學生自評的題型。之所以獨立命名，是因為全站有一條
// 硬性規則隨此型別而行：**書寫題永不由機器批改，亦不計入客觀準確率與等級預測**
// （2026-07-31 Brian 拍板決策 ①）。凡出現此型別，即屬「主觀自評」範疇。
export type WrittenQuestion = TextQuestion | LongQuestion

export const isMCQuestion = (q: AnyQuestion): q is MCQuestion => q.type === 'mc'
export const isWrittenQuestion = (q: AnyQuestion): q is WrittenQuestion =>
  q.type === 'text' || q.type === 'long'

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
