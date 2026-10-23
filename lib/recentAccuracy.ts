import { loadAttempts } from '@/lib/progress'

/** Below this, celebratory rank and "you did well" copy stays quiet. */
export const LOW_ACCURACY = 0.5

/** Latest finished session is a real attempt and under half correct. */
export function latestAccuracyLow(minTotal = 5): boolean {
  const attempts = loadAttempts()
  let last: { score: number; total: number; timestamp: number } | null = null
  for (const a of attempts) {
    if (!last || a.timestamp > last.timestamp) last = a
  }
  if (!last || last.total < minTotal) return false
  return last.score / last.total < LOW_ACCURACY
}
