import type { KnowledgeCard } from '../types'

// economics 科 SENSEI 知識卡片。
//
// ⚠️ 此陣列【只可以】由已簽署的 reviewed/ 檔案填充。憲章 §12 生產紀律：
//    drafts → review-sensei-cards.mjs → 真人逐張審批 → promote-sensei-cards.mjs
//    → reviewed/economics-cards.ts → 【人手】在此處 import
//
// 機器永不自動入庫。promote 產出檔案後，須由人親手在此加入 import，
// 這是最後一道人手關卡，不應自動化。
//
// 現時：0 張（等待真人審批首批草稿）。
export const economicsSenseiCards: KnowledgeCard[] = []
