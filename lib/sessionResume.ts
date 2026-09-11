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
    // ⚠️ 寫 'null'，唔係 removeItem —— 呢兩樣喺跨裝置同步度【意思完全唔同】。
    //
    //   'null'  ＝「嗰節喺呢部機做完咗」→ 上傳之後叫其他機一齊清走
    //   冇個 key ＝「呢部機未有過資料」  → 上傳之後唔准郁雲端
    //
    // lib/sync.ts 嘅 snapshotLocal 同 applyLocal 兩邊都特登實現咗呢個分別，
    // 但本函數一直 removeItem，即係【永遠出唔到第一個訊號】——
    // 條路寫好咗，但冇嘢行得入去。
    //
    // 實際後果：學生喺 iPad 交咗卷，攞返部電話，電話仍然 offer「繼續上次嗰節」，
    // 一撳落去就重做一次已經交咗嘅題目。
    // PracticeSession.tsx:587 嗰句註釋寫住「here or on any device」——
    // 「on any device」嗰半由今日開始先至係真。
    //
    // loadActiveSession 對 'null' 係安全嘅：JSON.parse('null') → null，
    // isActiveSession(null) → false → 回 null，同以前一模一樣。
    localStorage.setItem(ACTIVE_SESSION_KEY, 'null')
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
