// ============================================================================
// lib/sensei/intent.ts —— 意圖識別（純規則，零機器學習、零套件、零向量搜索）
// ----------------------------------------------------------------------------
// 學生打一句嘢，我哋純字串比對搵出最相關嘅知識卡。
// 冇模型落載、冇網絡來回，所以舊 Android 一樣即時。
//
// ⚠️ 呢度【唔會生成任何內容】。搵唔到卡就老實講搵唔到 —— 唔准砌一個答案出嚟。
// 「只允許基於知識片段生成，唔允許自由發揮」（Ghost）—— 跟足呢句就唔需要模型。
// ============================================================================
import type { KnowledgeCard } from '@/data/sensei/types'

/** 剝走標點同空白，令「共用品，係咩？」同「共用品係咩」一樣。 */
function normalise(s: string): string {
  return s.toLowerCase().replace(/[\s，。、；：！？,.;:!?"'「」『』（）()]/g, '')
}

export interface Match {
  card: KnowledgeCard
  score: number
  hits: string[]
}

/**
 * 將輸入同卡片嘅 keywords／topic 比對評分。
 *
 * 計分刻意簡單，因為簡單先解釋得到 ——
 * 學生問「點解我搵到呢張卡」，我哋答得出係邊幾個詞命中。
 */
export function rankCards(input: string, cards: readonly KnowledgeCard[], limit = 3): Match[] {
  const q = normalise(input)
  if (!q) return []

  const out: Match[] = []
  for (const card of cards) {
    const hits: string[] = []
    let score = 0
    // 課題名命中最重 —— 直接問課題名嗰陣應該排第一。
    const topic = normalise(card.topic)
    if (topic && q.includes(topic)) { score += 5; hits.push(card.topic) }
    if (card.subTopic && q.includes(normalise(card.subTopic))) { score += 3; hits.push(card.subTopic) }
    for (const kw of card.keywords) {
      const k = normalise(kw)
      if (k && q.includes(k)) { score += 2; hits.push(kw) }
    }
    if (score > 0) out.push({ card, score, hits })
  }

  return out
    // 分數相同就用 id 排，令結果穩定可重現（測試同學生兩邊都靠得住）。
    .sort((a, b) => b.score - a.score || a.card.id.localeCompare(b.card.id))
    .slice(0, limit)
}
