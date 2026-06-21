// Per-subject practice counter for FREE users, stored in localStorage. This is a
// soft client-side gate (a determined user can clear it) — consistent with the
// site's other localStorage data and its static, no-backend model. Reliable
// enforcement for PAID access is the server-side session entitlement (auth.ts);
// this just nudges free users toward upgrading once they hit the cap.

const KEY = 'dse_free_usage'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

type UsageMap = Record<string, number>

function load(): UsageMap {
  if (!isBrowser()) return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as UsageMap) : {}
  } catch {
    return {}
  }
}

function save(map: UsageMap): void {
  if (!isBrowser()) return
  localStorage.setItem(KEY, JSON.stringify(map))
}

/** Completed free practice runs for a subject. */
export function getAttemptsUsed(subjectId: string): number {
  return load()[subjectId] ?? 0
}

/** Record one completed free run; returns the new count. */
export function incrementAttemptsUsed(subjectId: string): number {
  const map = load()
  map[subjectId] = (map[subjectId] ?? 0) + 1
  save(map)
  return map[subjectId]
}

/** Clear all free-usage counters (e.g. on upgrade, or for testing). */
export function resetFreeUsage(): void {
  if (!isBrowser()) return
  localStorage.removeItem(KEY)
}
