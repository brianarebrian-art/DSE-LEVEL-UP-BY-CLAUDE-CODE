// ============================================================================
// data/sensei/types.ts —— SENSEI 知識卡片型別
// ----------------------------------------------------------------------------
// 零模型版 SENSEI 的內容單位。學生提問時，系統【檢索】一張已由真人簽署的卡片，
// 【不生成】任何新內容，因此幻覺在結構上不可能發生。
//
// 四段式框架（Ghost 提出、指揮部核准）：
//   【概念】→【例子】→【考試技巧】→【常見陷阱】
//
// ⚠️ 本介面【刻意不設任何分數欄位】。
// 憲章 §16.A：機器只為 `mc` 判定對錯；`text` 與 `long` 平台一分不出。
// 卡片可以【講解】評分準則（例如「考評局會看考生有否比較兩者」），
// 但不可以【輸出】分數、等級，或對學生所寫內容作任何評定。
// 沒有欄位可以承載分數，即使日後有人欲加入，亦必須先修改型別、先經覆核。
// ============================================================================

export type CardDifficulty = 'basic' | 'intermediate' | 'hard'

/** 卡片來源，決定該卡的覆核方式。 */
export type CardSource =
  | 'syllabus' // 直接對應課程及評估指引的概念
  | 'original' // 原創改寫（Archetype Masking），零版權風險
  | 'concept'  // 概念網絡衍生（跨課題串連）

export interface KnowledgeCard {
  id: string
  subject: string
  topic: string
  subTopic?: string
  difficulty: CardDifficulty
  source: CardSource

  // ── 四段式內容（標準書面語／英文，term-guard 把關）────────────────────
  concept: string       // 【概念】是什麼
  example: string       // 【例子】如何應用
  examTechnique: string // 【考試技巧】在 DSE 中如何作答
  commonTrap: string    // 【常見陷阱】考生通常在何處失誤

  conceptEn?: string
  exampleEn?: string
  examTechniqueEn?: string
  commonTrapEn?: string

  // ── 檢索用 ────────────────────────────────────────────────────────────
  /** 意圖識別關鍵詞。純字串比對，零機器學習、零向量搜索。 */
  keywords: string[]
  relatedTopics?: string[]

  // ── 問責 ──────────────────────────────────────────────────────────────
  /** 逐張審批的真人姓名或代號。由 promote-sensei-cards.mjs 填入，不可手寫。 */
  reviewer: string
  reviewedAt: string
}

/** 草稿：未經人手覆核，因此沒有 reviewer 與 reviewedAt。 */
export type CardDraft = Omit<KnowledgeCard, 'reviewer' | 'reviewedAt'>

export const CARD_SECTIONS = ['concept', 'example', 'examTechnique', 'commonTrap'] as const
export const CARD_DIFFICULTIES: readonly CardDifficulty[] = ['basic', 'intermediate', 'hard']
export const CARD_SOURCES: readonly CardSource[] = ['syllabus', 'original', 'concept']

/** P0 首批四科。新增科目時須同時修改此處與 load.ts，兩處不一致會被測試攔截。 */
export const SENSEI_SUBJECTS = ['chinese', 'english', 'math', 'economics'] as const
export type SenseiSubject = (typeof SENSEI_SUBJECTS)[number]
