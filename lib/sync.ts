// Cross-device progress sync helpers (client-side, SSR-safe, no React).
//
// Reuses the EXISTING localStorage keys verbatim (防線 A) — the synced blob is just
// a snapshot of `dse_progress`, `dse_free_attempts_total` and `dse_topic_stats`.
// Two extra bookkeeping markers drive the smart-merge:
//   dse_updated_at — wall-clock ms of the last LOCAL change (any device)
//   dse_synced_at  — set once this device has merged with the cloud at least once
// All access is guarded by `typeof window` so it never runs during SSR (防線 B).

import { ACTIVE_SESSION_KEY, type ActiveSession } from '@/lib/sessionResume'

const KEYS = {
  progress: 'dse_progress',
  counter: 'dse_free_attempts_total',
  topicStats: 'dse_topic_stats',
} as const
const UPDATED_AT = 'dse_updated_at'
const SYNCED_AT = 'dse_synced_at'
const SYNC_OWNER = 'dse_sync_owner' // which user id the local data last synced as

/** Window event fired after a LOCAL progress change (drives debounced push + UI). */
export const PROGRESS_EVENT = 'dse:progress-changed'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}
function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function readNum(key: string): number | null {
  if (!isBrowser()) return null
  try {
    const v = localStorage.getItem(key)
    if (v == null) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export interface Snapshot {
  dse_progress: unknown[]
  dse_free_attempts_total: number
  /**
   * 逐課題累計（做過／錯咗）。
   *
   * 【2026-08-26 起唔再上傳】—— 見下方 snapshotLocal 嘅說明。
   * 保留喺型別入面係為咗讀得返舊雲端列（舊列仲有呢個欄位）。
   */
  dse_topic_stats?: Record<string, unknown>
  /**
   * 未完成嗰節練習。
   *
   * 【2026-08-26 起唔再上傳】—— 見下方 snapshotLocal 嘅說明。
   */
  dse_active_session?: ActiveSession | null
  updatedAt: number | null // last local change (device wall-clock ms)
  syncedAt: number | null // last cloud merge on THIS device
}

export interface CloudData {
  progress: Snapshot | null
  updated_at: string | null // server timestamptz of the cloud row
}

/**
 * Snapshot the current local progress for upload / comparison.
 *
 * ══ 2026-08-26 資料邊界修正（P0，Brian／Yuna 批准）══
 *
 * 【剔走 dse_active_session】——「答案原文」唔可以離開部機。
 * 該物件嘅 `answers[].selectedZh` 係學生揀嗰個選項嘅【文字內容】，之前會連同
 * user_id 一齊 upsert 入 Supabase `user_progress.progress_data`。三份安全文件
 * 都明文禁止（「作答內容」「答案原文」「人工閱讀個人作答」）。
 *
 * 點解係整個剔走，而唔係淨係剝走 `selectedZh`：
 *   · `answers[]` 入面【冇】questionId 欄位（題目 id 喺平行陣列 `questionIds`），
 *     所以「只保留 questionId」呢個做法喺呢個結構度做唔到。
 *   · `isCorrect` 剝唔得 —— PracticeSession.tsx:552 靠佢計分
 *     （`newAnswers.filter(a => a?.isCorrect).length`）。剝咗，跨機續做嘅學生
 *     會見到一個【靜靜計錯咗】嘅分數，比私隱問題更差。
 *   · `selectedZh` 亦剝唔得 —— PracticeSession.tsx:592 喺節末要用佢砌
 *     `/api/result/verify` 嘅覆核 payload；剝咗，之前答過嗰啲題會被當成冇作答。
 *   → 所以唯一唔會整錯分數、又完全止血嘅做法，就係唔上傳。
 *
 * 犧牲咗嘅：喺【另一部機】接住做未完成嗰節。同一部機續做完全冇影響
 * （localStorage 一個字都冇郁），做完嘅結果亦照樣經 `dse_progress` 同步。
 *
 * 【剔走 dse_topic_stats】—— 個人逐課題正確率屬「平台可讀」層（L2），
 * 按 2026-08-25 裁決禁止上雲。佢本來就係 localStorage-first
 * （見 lib/topicStats.ts），所以呢度唔上傳就已經完全喺本機。
 * 犧牲咗嘅：換部機之後雷達圖要重新累積。
 *
 * 舊雲端列仍然帶住呢兩個欄位（按批准嘅選項 A，唔主動刪學生資料），
 * 但 applyLocal 已經唔會再攞佢哋覆蓋本機。
 */
export function snapshotLocal(): Snapshot {
  return {
    dse_progress: readJSON<unknown[]>(KEYS.progress, []),
    dse_free_attempts_total: readNum(KEYS.counter) ?? 0,
    updatedAt: readNum(UPDATED_AT),
    syncedAt: readNum(SYNCED_AT),
  }
}

// "Completeness" score — bigger means more effort to preserve (防線 E 情境 B,
// "數值較大者 / 較完整者"). Attempts dominate; topic volume and the counter break ties.
function score(s: Snapshot): number {
  const attempts = Array.isArray(s.dse_progress) ? s.dse_progress.length : 0
  let topicTotal = 0
  for (const v of Object.values(s.dse_topic_stats || {})) {
    const t = (v as { total?: number } | null)?.total
    if (typeof t === 'number') topicTotal += t
  }
  const counter = Number(s.dse_free_attempts_total) || 0
  return attempts * 1000 + topicTotal + counter
}

/**
 * Smart merge (防線 E). Returns the winning snapshot — never blindly wipes effort:
 *  - A: no cloud row yet → keep local (it gets pushed up).
 *  - B: this device has never synced (no `syncedAt`) → the more COMPLETE side wins.
 *  - C: this device has synced before → the NEWER change wins (by wall-clock).
 */
export function mergeSnapshots(local: Snapshot, cloud: CloudData): Snapshot {
  const cloudSnap = cloud.progress
  if (!cloudSnap) return local // A

  if (local.syncedAt == null) {
    // B — avoid clobbering: take whichever side has more data.
    return score(local) >= score(cloudSnap) ? local : cloudSnap
  }

  // C — both ends are established; newest local change wins.
  const localT = local.updatedAt ?? 0
  const cloudT =
    cloudSnap.updatedAt ?? (cloud.updated_at ? Date.parse(cloud.updated_at) : 0)
  return localT >= cloudT ? local : cloudSnap
}

/** Write a winning snapshot back to local storage + stamp the sync markers. */
export function applyLocal(s: Snapshot): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(KEYS.progress, JSON.stringify(s.dse_progress ?? []))
    localStorage.setItem(KEYS.counter, String(Number(s.dse_free_attempts_total) || 0))
    // ⚠️ 唔可以寫成 `s.dse_topic_stats ?? {}` —— 而家 snapshotLocal 唔再帶呢個欄位，
    // 一律 `?? {}` 會將本機累積咗嘅課題統計【洗成空白】。同 active session 一樣：
    // 有值先覆蓋，`{}`（換用戶嘅乾淨石板）先清走，`undefined` 就唔郁。
    if (s.dse_topic_stats) {
      localStorage.setItem(KEYS.topicStats, JSON.stringify(s.dse_topic_stats))
    }
    // In-progress run: adopt the winner's. An explicit null means the run was finished
    // (or abandoned) on the winning device, so clear it here too. `undefined` means the
    // snapshot predates this field — leave whatever this device has untouched.
    if (s.dse_active_session) {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(s.dse_active_session))
    } else if (s.dse_active_session === null) {
      localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
    const now = Date.now()
    localStorage.setItem(UPDATED_AT, String(now))
    localStorage.setItem(SYNCED_AT, String(now))
  } catch {
    /* quota / private mode — soft sync, ignore */
  }
}

/** An empty snapshot — used to give a different user a clean local slate. */
export function emptySnapshot(): Snapshot {
  return {
    dse_progress: [],
    dse_free_attempts_total: 0,
    dse_topic_stats: {},
    dse_active_session: null,
    updatedAt: null,
    syncedAt: null,
  }
}

/** The user id this device's local data last synced as (null if never). */
export function getSyncOwner(): string | null {
  if (!isBrowser()) return null
  try {
    return localStorage.getItem(SYNC_OWNER)
  } catch {
    return null
  }
}
export function setSyncOwner(id: string): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(SYNC_OWNER, id)
  } catch {
    /* ignore */
  }
}

/**
 * Call after any LOCAL progress write (quiz finished, counter incremented, etc.).
 * Stamps the local change time and pings the sync layer (debounced push + reactive
 * re-render). SSR-safe no-op on the server.
 */
export function notifyProgressChanged(): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(UPDATED_AT, String(Date.now()))
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  } catch {
    /* ignore */
  }
}
