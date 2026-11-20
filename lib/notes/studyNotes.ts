// 自學筆記 —— 每科每課題一份。正文按科拆喺 data/notes/generated/，
// 由 scripts/gen-study-notes.mts 產生；overrides.ts 人手覆寫優先。

import { SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { loadStudyNotesForSubject, STUDY_NOTE_SUBJECT_IDS } from '@/data/notes/studyNotes.generated'
import { STUDY_NOTE_OVERRIDES } from '@/data/notes/overrides'
import type { StudyNote } from '@/data/notes/types'

export type { StudyNote }
export { STUDY_NOTE_SUBJECT_IDS, loadStudyNotesForSubject }

export async function getStudyNote(subjectId: string, topicId: string): Promise<StudyNote | null> {
  const override = STUDY_NOTE_OVERRIDES[subjectId]?.[topicId]
  if (override) return override
  const notes = await loadStudyNotesForSubject(subjectId)
  return notes[topicId] ?? null
}

/** 該科全部課題筆記（override 合併）。 */
export async function getSubjectStudyNotes(subjectId: string): Promise<Record<string, StudyNote>> {
  const base = await loadStudyNotesForSubject(subjectId)
  const overrides = STUDY_NOTE_OVERRIDES[subjectId] ?? {}
  return { ...base, ...overrides }
}

export async function studyNoteCoverage(
  subjectId: string,
): Promise<{ total: number; covered: number; missing: string[] }> {
  const topics = SUBJECT_TOPICS[subjectId] ?? []
  const notes = await getSubjectStudyNotes(subjectId)
  const missing: string[] = []
  for (const t of topics) {
    if (!notes[t.id]) missing.push(t.id)
  }
  return { total: topics.length, covered: topics.length - missing.length, missing }
}
