import { getActiveSubjects, type SubjectMeta } from '@/data/subjects'
import { practiceHref } from '@/lib/sessionResume'

// Homepage quick start (UX loop 2, 2026-09-30).
//
// A first-time visitor used to reach a question through four screens: 開始練習 →
// the list of 25 subjects → a subject page → 立即開始. The homepage now links
// straight to a practice session instead.
//
// Only the core subjects are offered: every DSE candidate takes all four, so they
// are the one choice that fits before we know anything about the student. Everyone
// else still has 揀其他科目 on the same screen.
//
// The list must never include a subject with electives: its first session opens
// the elective dialog rather than a question. That is checked in
// lib/__tests__/home-quick-start.test.mts rather than here, because lib/electives
// pulls a 30 KB per-question scope table into whichever bundle imports it.
export function quickStartSubjects(): SubjectMeta[] {
  return getActiveSubjects().filter((s) => s.category === 'core')
}

/** The same URL the practice page and the resume card use for a plain session. */
export function quickStartHref(subjectId: string): string {
  return practiceHref(subjectId, null, 'normal')
}
