// Latest finished session, used only to quiet celebration when accuracy is low.
// The threshold is half: a 2/10 session must not sit next to "you already did well" or EXP.

import { loadAttempts, type AttemptRecord } from '@/lib/progress'

export const LOW_ACCURACY = 0.5

export function latestAccuracy(attempts: readonly AttemptRecord[]): number | null {
  let latest: AttemptRecord | null = null
  for (const a of attempts) {
    if (!Number.isFinite(a.score) || !Number.isFinite(a.total) || a.total <= 0) continue
    if (!latest || a.timestamp >= latest.timestamp) latest = a
  }
  if (!latest) return null
  return latest.score / latest.total
}

export function latestSessionIsLow(attempts: readonly AttemptRecord[] = loadAttempts()): boolean {
  const ratio = latestAccuracy(attempts)
  return ratio !== null && ratio < LOW_ACCURACY
}
