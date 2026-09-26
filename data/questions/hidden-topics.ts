// Topics withheld from students. The questions stay in the repo for internal audit;
// they are not served, counted or listed.
//
// 2026-09-26, Yuna (COO), under charter §18: the two Ethics and Religious Studies
// topics marked "not found" in docs/topic-syllabus-map-2027.md (the EDB guide has no
// corresponding content) are withheld until each question is matched to the guide.
// Record and restore steps: docs/UNMAPPED-220.md.
//
// Applied in both read paths: getSubjectQuestions / getSubjectTopics (data/questions/
// index.ts) and loadSubjectQuestions (data/questions/load.ts, cloud and static).
// getSubjectQuestionsRaw is deliberately unfiltered, for audit tools.

export const HIDDEN_TOPICS: Readonly<Record<string, readonly string[]>> = {
  'ethics-religious': ['religion_philosophy', 'religion_society'],
}

export function isHiddenTopic(subjectId: string, topicId: string): boolean {
  return HIDDEN_TOPICS[subjectId]?.includes(topicId) ?? false
}

export function withoutHiddenTopics<T extends { topic: string }>(subjectId: string, items: T[]): T[] {
  const hidden = HIDDEN_TOPICS[subjectId]
  return hidden?.length ? items.filter((q) => !hidden.includes(q.topic)) : items
}
