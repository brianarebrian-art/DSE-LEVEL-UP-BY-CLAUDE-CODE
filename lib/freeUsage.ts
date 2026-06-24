// Platform-wide practice counter for FREE users, stored in localStorage. This is a
// soft client-side gate (a determined user can clear it) — consistent with the
// site's other localStorage data and its static, no-backend model. Reliable
// enforcement for PAID access is the server-side session entitlement (auth.ts);
// this just nudges free users toward upgrading once they hit the global cap.
//
// The cap is now GLOBAL (total runs across every subject), not per subject — see
// FREE_ATTEMPTS_TOTAL in lib/entitlements.ts.

import { notifyProgressChanged } from '@/lib/sync'

const TOTAL_KEY = 'dse_free_attempts_total'
const LEGACY_MAP_KEY = 'dse_free_usage' // pre-global, per-subject map (migrated once)

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

// One-time migration: fold any legacy per-subject counts into the global total so
// existing free users don't silently get a fresh 10 runs after the change.
function migrateLegacy(current: number): number {
  if (!isBrowser()) return current
  try {
    const raw = localStorage.getItem(LEGACY_MAP_KEY)
    if (!raw) return current
    const map = JSON.parse(raw)
    let sum = 0
    if (map && typeof map === 'object') {
      for (const v of Object.values(map)) sum += typeof v === 'number' ? v : 0
    }
    localStorage.removeItem(LEGACY_MAP_KEY)
    const merged = current + sum
    localStorage.setItem(TOTAL_KEY, String(merged))
    return merged
  } catch {
    return current
  }
}

/** Total completed free practice runs across the whole platform. */
export function getGlobalAttemptsUsed(): number {
  if (!isBrowser()) return 0
  let n = 0
  try {
    n = Number(localStorage.getItem(TOTAL_KEY)) || 0
  } catch {
    n = 0
  }
  return migrateLegacy(n)
}

/** Record one completed free run (any subject); returns the new global total. */
export function incrementGlobalAttemptsUsed(): number {
  if (!isBrowser()) return 0
  const next = getGlobalAttemptsUsed() + 1
  try {
    localStorage.setItem(TOTAL_KEY, String(next))
  } catch {
    /* storage full / blocked — soft gate, ignore */
  }
  notifyProgressChanged() // queue a debounced cloud sync (if signed in)
  return next
}

/** Clear the free-usage counter (e.g. on upgrade, or for testing). */
export function resetFreeUsage(): void {
  if (!isBrowser()) return
  localStorage.removeItem(TOTAL_KEY)
  localStorage.removeItem(LEGACY_MAP_KEY)
}
