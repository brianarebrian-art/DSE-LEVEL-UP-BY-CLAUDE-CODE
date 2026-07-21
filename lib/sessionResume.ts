// Mid-session resume — the stack-compatible half of v3.0 F1「多裝置即時同步」.
//
// Persists the IN-PROGRESS practice run so it survives a refresh, a closed tab, or a
// hop to another device. Deliberately NOT a new API surface: this blob is folded into
// the existing sync Snapshot (lib/sync.ts), so it rides the Auth.js-gated, server-only
// /api/progress route that already exists.
//
// Rejected from the v3.0 spec (founder call 2026-07-21):
//   ✗ client-side Supabase Realtime — needs an anon key in the browser + RLS, but
//     Auth.js v5 has no Supabase session so `auth.uid()` never matches (and it breaks
//     the charter's own「client 不可直接調用 Supabase」).
//   ✗ AES-256-GCM client-side encryption — the spec's own schema kept the plaintext
//     fields beside the blob, and a lost key would mean permanently unrecoverable
//     progress. Transport is already TLS + the row is only reachable server-side.
//
// Why restoring only needs the question ID order: grading is anchored to option TEXT
// (`correctZh`), never an index, and the drill is forward-only — so re-shuffling the
// options of not-yet-seen questions is harmless.

export const ACTIVE_SESSION_KEY = 'dse_active_session'

/** How long an unfinished run stays offerable before we stop nagging about it. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export interface SavedAnswer {
  selectedZh: string
  isCorrect: boolean
}

export interface ActiveSession {
  v: 1
  subjectId: string
  topicFilter: string | null
  mode: 'normal' | 'weakness'
  questionIds: string[]
  answers: (SavedAnswer | null)[]
  current: number
  elapsed: number // seconds already spent in this run
  updatedAt: number
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/** Shape-guard — localStorage is user-writable, so never trust what comes back. */
function isActiveSession(v: unknown): v is ActiveSession {
  if (!v || typeof v !== 'object') return false
  const s = v as Partial<ActiveSession>
  return (
    s.v === 1 &&
    typeof s.subjectId === 'string' &&
    Array.isArray(s.questionIds) &&
    s.questionIds.every((id) => typeof id === 'string') &&
    Array.isArray(s.answers) &&
    typeof s.current === 'number' &&
    typeof s.elapsed === 'number' &&
    typeof s.updatedAt === 'number'
  )
}

export function saveActiveSession(s: ActiveSession): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(s))
  } catch {
    /* quota / private mode — the run still works, it just won't resume */
  }
}

export function loadActiveSession(): ActiveSession | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isActiveSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearActiveSession(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Is this saved run worth offering on the current practice screen? It must be the same
 * subject/topic/mode, still have unanswered questions, and not be ancient.
 */
export function isResumable(
  s: ActiveSession | null,
  subjectId: string,
  topicFilter: string | null,
  mode: 'normal' | 'weakness',
): s is ActiveSession {
  if (!s) return false
  if (s.subjectId !== subjectId) return false
  if ((s.topicFilter ?? null) !== (topicFilter ?? null)) return false
  if (s.mode !== mode) return false
  if (s.current <= 0) return false // nothing done yet — a fresh pool is just as good
  if (s.current >= s.questionIds.length) return false // already finished
  if (Date.now() - s.updatedAt > MAX_AGE_MS) return false
  return true
}
