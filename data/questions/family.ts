import type { Difficulty } from './types'

// ============================================================================
// Question families
// ----------------------------------------------------------------------------
// A family is a set of MC questions in the same subject and topic whose stems
// differ only in their digits: the same template with different numbers or a
// different group number (「第 1 組」 / 「第 2 組」).
//
// Several parametric banks assign difficulty by loop position, diff(i) with
// i % 10, to hit the 3:5:2 quota. The same stem therefore carried easy,
// medium and hard at once (563 families, 4,969 questions on 2026-09-26).
// Yuna decided on 2026-09-26 that every family takes one label, effective
// immediately (docs/difficulty-family-unification-2026-09-26.md).
//
// The family key is also the unit proposed for anonymous answer statistics
// (docs/charter-amendment-2026-09-26-family-stats-DRAFT.md), so it must stay
// stable: changing it re-groups every family.
// ============================================================================

const TIERS: Difficulty[] = ['easy', 'medium', 'hard']

/** Stem with every run of digits replaced by '#', whitespace collapsed. */
export function stemSkeleton(stem: string): string {
  return String(stem ?? '').replace(/[0-9０-９]+(\.[0-9]+)?/g, '#').replace(/\s+/g, ' ').trim()
}

export function familyKey(subjectId: string, q: { topic: string; content: string }): string {
  return `${subjectId}|${q.topic}|${stemSkeleton(q.content)}`
}

/**
 * The one label a family takes: the most frequent label; a tie goes to the
 * tied label nearest medium, and an easy/hard tie goes to medium.
 */
export function familyLabel(labels: readonly Difficulty[]): Difficulty {
  const count = (t: Difficulty) => labels.filter((l) => l === t).length
  const top = Math.max(...TIERS.map(count))
  const tied = TIERS.filter((t) => count(t) === top)
  if (tied.length === 1) return tied[0]
  return tied.includes('medium') || (tied.includes('easy') && tied.includes('hard')) ? 'medium' : tied[0]
}

/** Returns the questions with any override applied. Questions without one are returned unchanged. */
export function applyDifficultyOverrides<T extends { id: string; difficulty: Difficulty }>(
  qs: T[],
  overrides: Readonly<Record<string, Difficulty>> | undefined,
): T[] {
  if (!overrides) return qs
  return qs.map((q) => {
    const d = overrides[q.id]
    return d && d !== q.difficulty ? { ...q, difficulty: d } : q
  })
}
