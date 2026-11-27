import type { MCQuestion } from '@/data/questions/types'
import { textsInQuestion } from '@/lib/conceptNet'

/** How many set-text questions the concept map shows after a student opens one text. */
export const CONCEPT_PREVIEW_LIMIT = 4

export type ConceptPreviewItem = {
  id: string
  content: string
  contentEn?: string
  explanation: string
  explanationEn?: string
}

/**
 * Short study preview for one prescribed text. Not the practice key:
 * no options, no correctIndex, and at most CONCEPT_PREVIEW_LIMIT items.
 * Returned only after the student opens that text.
 */
export function conceptPreview(bank: readonly MCQuestion[], textId: string): ConceptPreviewItem[] {
  const out: ConceptPreviewItem[] = []
  for (const q of bank) {
    if (!textsInQuestion(q.content, q.topicZh).includes(textId)) continue
    out.push({
      id: q.id,
      content: q.content,
      contentEn: q.contentEn,
      explanation: q.explanation,
      explanationEn: q.explanationEn,
    })
    if (out.length >= CONCEPT_PREVIEW_LIMIT) break
  }
  return out
}
