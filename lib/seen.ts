// Tracks which question IDs a user was recently shown, per subject, in
// localStorage. A new practice run prefers questions NOT in this list, so
// re-doing a subject surfaces fresh questions first and only repeats once the
// whole bank has been cycled through. Purely client-side; degrades gracefully.

const KEY_PREFIX = 'dse_seen_'
// How many recent IDs to remember per subject. Big enough to rotate through a
// growing bank before repeating, capped so storage stays small.
const WINDOW = 300

function storageKey(subjectId: string): string {
  return `${KEY_PREFIX}${subjectId}`
}

// Recently-shown question IDs for a subject, most-recent first.
export function getSeen(subjectId: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(subjectId))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

// Record the IDs just shown. They are moved to the front; older entries are kept
// (deduped) up to WINDOW so the rotation order is preserved.
export function recordSeen(subjectId: string, ids: string[]): void {
  if (typeof window === 'undefined' || ids.length === 0) return
  try {
    const prev = getSeen(subjectId)
    const merged = [...ids, ...prev.filter((id) => !ids.includes(id))].slice(0, WINDOW)
    localStorage.setItem(storageKey(subjectId), JSON.stringify(merged))
  } catch {
    // storage unavailable (private mode / quota) — anti-repeat just no-ops
  }
}
