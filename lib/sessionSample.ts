// 3:5:2 session draw. Preference order is the caller's (unseen first).
// Within a tier, a second question from the same family (same stem with the
// numbers swapped) is skipped until every other family in that tier is used.
// If the tier cannot fill without a repeat, repeats are allowed so the
// session does not shrink.

import { familyKey } from '@/data/questions/family'
import type { Difficulty } from '@/data/questions/types'

export interface SampleableQuestion {
  id: string
  difficulty: Difficulty
  topic: string
  content: string
}

const DIFF_RATIO: Record<Difficulty, number> = { easy: 0.3, medium: 0.5, hard: 0.2 }

export function pickByDifficulty<T extends SampleableQuestion>(
  ordered: readonly T[],
  size: number,
  subjectId: string,
): T[] {
  if (ordered.length <= size) return [...ordered]

  const target: Record<Difficulty, number> = {
    easy: Math.round(size * DIFF_RATIO.easy),
    hard: Math.round(size * DIFF_RATIO.hard),
    medium: 0,
  }
  target.medium = size - target.easy - target.hard

  const buckets: Record<Difficulty, T[]> = { easy: [], medium: [], hard: [] }
  for (const q of ordered) buckets[q.difficulty]?.push(q)

  const chosen: T[] = []
  const taken = new Set<string>()
  const families = new Set<string>()

  const take = (d: Difficulty, n: number, allowRepeatFamily: boolean): number => {
    for (const q of buckets[d]) {
      if (chosen.length >= size || n <= 0) break
      if (taken.has(q.id)) continue
      const fam = familyKey(subjectId, q)
      if (!allowRepeatFamily && families.has(fam)) continue
      chosen.push(q)
      taken.add(q.id)
      families.add(fam)
      n--
    }
    return n
  }

  const order: Difficulty[] = ['easy', 'medium', 'hard']
  const short: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 }
  for (const d of order) short[d] = take(d, target[d], false)
  for (const d of order) if (short[d] > 0) take(d, short[d], true)

  if (chosen.length < size) {
    for (const q of ordered) {
      if (chosen.length >= size) break
      if (taken.has(q.id)) continue
      const fam = familyKey(subjectId, q)
      if (families.has(fam)) continue
      chosen.push(q)
      taken.add(q.id)
      families.add(fam)
    }
  }
  if (chosen.length < size) {
    for (const q of ordered) {
      if (chosen.length >= size) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
    }
  }
  return chosen
}
