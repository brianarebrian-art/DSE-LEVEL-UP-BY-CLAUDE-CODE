// Questions withheld from students: whole topics (HIDDEN_TOPICS) and single questions
// withdrawn after publication (withdrawn.json). The questions stay in the repo for
// internal audit; they are not served, counted or listed.
//
// Withdrawal: new questions go live through the machine gate without prior human
// review (charter §12, Yuna 2026-09-26). A founder who finds a problem withdraws the
// question with `npx tsx scripts/qbank/withdraw.mts --subject <id> --id <qid> --reason "..."`.
//
// 2026-09-26, Yuna (COO), under charter §18: the two Ethics and Religious Studies
// topics marked "not found" in docs/topic-syllabus-map-2027.md (the EDB guide has no
// corresponding content) are withheld until each question is matched to the guide.
// Record and restore steps: docs/UNMAPPED-220.md.
//
// Applied in both read paths: getSubjectQuestions / getSubjectTopics (data/questions/
// index.ts) and loadSubjectQuestions (data/questions/load.ts, cloud and static).
// getSubjectQuestionsRaw is deliberately unfiltered, for audit tools.

import withdrawn from './withdrawn.json'

/** `reason` is free text, or one of the codes in WITHDRAW_CODES. */
export interface WithdrawnEntry { date: string; reason: string }

/** subject → question id → entry. Edited by scripts/qbank/withdraw.mts. */
export const WITHDRAWN = withdrawn as Readonly<Record<string, Readonly<Record<string, WithdrawnEntry>>>>

// A code instead of a sentence: this file ships to every student's browser, and the
// same sentence repeated 597 times made it four times larger (2026-09-29).
export const WITHDRAW_CODES: Readonly<Record<string, string>> = {
  POSITIONAL_RATIONALE_REFERENCE:
    '解析以位置指稱選項（「第二項」「最後一項」「第三個選項」等）。選項每次呈現都會洗牌，這類字眼因此會指錯。' +
    '逐題改寫並經真人內容覆核後恢復（docs/rationale-repairs.md）。',
}

export const HIDDEN_TOPICS: Readonly<Record<string, readonly string[]>> = {
  'ethics-religious': ['religion_philosophy', 'religion_society'],
}

export function isHiddenTopic(subjectId: string, topicId: string): boolean {
  return HIDDEN_TOPICS[subjectId]?.includes(topicId) ?? false
}

export function isWithdrawn(subjectId: string, id: string): boolean {
  return !!WITHDRAWN[subjectId]?.[id]
}

/** Drops withheld topics and withdrawn questions. */
export function withoutWithheld<T extends { id: string; topic: string }>(subjectId: string, items: T[]): T[] {
  const hidden = HIDDEN_TOPICS[subjectId] ?? []
  const out = WITHDRAWN[subjectId] ?? {}
  if (!hidden.length && !Object.keys(out).length) return items
  return items.filter((q) => !hidden.includes(q.topic) && !out[q.id])
}
