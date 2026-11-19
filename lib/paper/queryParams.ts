import { subjects } from '../../data/subjects.ts'
import { SUBJECT_TOPICS } from '../../data/questions/summary.generated.ts'

const activeSubjects = subjects.filter((s) => s.isActive)
const activeSubjectIds = new Set(activeSubjects.map((s) => s.id))

/** Resolve `?subject=` for paper-warrior; invalid → first active subject. */
export function resolvePaperSubject(raw: string | undefined): string {
  const id = (raw ?? '').trim()
  if (id && activeSubjectIds.has(id)) return id
  return activeSubjects[0]?.id ?? 'math'
}

/** Resolve `?topic=` for a subject; invalid / unknown → empty (all topics). */
export function resolvePaperTopic(subjectId: string, raw: string | undefined): string {
  const topicId = (raw ?? '').trim()
  if (!topicId) return ''
  try {
    const topics = SUBJECT_TOPICS[subjectId] ?? []
    return topics.some((t) => t.id === topicId) ? topicId : ''
  } catch {
    return ''
  }
}
