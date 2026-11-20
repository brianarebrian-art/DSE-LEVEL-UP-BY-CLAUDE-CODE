// Guest free-session gate (Fluid Active CPU / charter §5).
//
// Unauthenticated visitors may finish ONE practice set on this device, then must
// sign in with Google before starting another. This is not a paywall: signed-in
// use stays unlimited and free. The flag is a cost control only — it stores no
// answers, scores, or identity.
//
// Persistence: localStorage so a refresh after finishing cannot bypass the gate.
// Clearing site data resets the flag (expected). No database row is written.

import { SESSION_SIZE } from '@/lib/entitlements'

/** localStorage key — boolean flag only, never learning progress. */
export const GUEST_FREE_SESSION_KEY = 'dse_guest_free_session_used'

/** One free set for unsigned visitors; matches a standard MC session length. */
export const GUEST_FREE_SESSION_QUESTIONS = SESSION_SIZE

export function isAuthUiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'
}

/** Prefer globalThis.window so Node tests can shim storage; bare `window` is undefined in Node ESM. */
function localStore(): Storage | null {
  try {
    const w = (globalThis as unknown as { window?: { localStorage?: Storage } }).window
    return w?.localStorage ?? null
  } catch {
    return null
  }
}

/** True when the unsigned visitor has already used their free practice set. */
export function hasUsedGuestFreeSession(): boolean {
  const ls = localStore()
  if (!ls) return false
  try {
    return ls.getItem(GUEST_FREE_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/** Call when an unsigned visitor finishes a practice set (MC or written). */
export function markGuestFreeSessionUsed(): void {
  const ls = localStore()
  if (!ls) return
  try {
    ls.setItem(GUEST_FREE_SESSION_KEY, '1')
  } catch {
    /* private mode — gate may not stick; server still skips costly APIs */
  }
}

/** After Google sign-in the gate must not block; clear on this device. */
export function clearGuestFreeSessionUsed(): void {
  const ls = localStore()
  if (!ls) return
  try {
    ls.removeItem(GUEST_FREE_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Whether an unsigned visitor may start a new practice set.
 * When auth UI is off, never block (there is no sign-in path).
 */
export function mayStartGuestPractice(opts: {
  authStatus: 'loading' | 'authenticated' | 'unauthenticated'
  authUiEnabled?: boolean
}): boolean {
  const authUi = opts.authUiEnabled ?? isAuthUiEnabled()
  if (!authUi) return true
  if (opts.authStatus === 'authenticated') return true
  if (opts.authStatus === 'loading') return true // wait; PracticeGate shows loading
  return !hasUsedGuestFreeSession()
}
