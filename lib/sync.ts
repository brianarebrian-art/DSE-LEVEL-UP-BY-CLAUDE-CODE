// Cross-device progress sync helpers (client-side, SSR-safe, no React).
//
// Reuses the EXISTING localStorage keys verbatim (防線 A) — the synced blob is just
// a snapshot of `dse_progress`, `dse_free_attempts_total` and `dse_topic_stats`.
// Two extra bookkeeping markers drive the smart-merge:
//   dse_updated_at — wall-clock ms of the last LOCAL change (any device)
//   dse_synced_at  — set once this device has merged with the cloud at least once
// All access is guarded by `typeof window` so it never runs during SSR (防線 B).

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
  dse_topic_stats: Record<string, unknown>
  updatedAt: number | null // last local change (device wall-clock ms)
  syncedAt: number | null // last cloud merge on THIS device
}

export interface CloudData {
  progress: Snapshot | null
  updated_at: string | null // server timestamptz of the cloud row
}

/** Snapshot the current local progress for upload / comparison. */
export function snapshotLocal(): Snapshot {
  return {
    dse_progress: readJSON<unknown[]>(KEYS.progress, []),
    dse_free_attempts_total: readNum(KEYS.counter) ?? 0,
    dse_topic_stats: readJSON<Record<string, unknown>>(KEYS.topicStats, {}),
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
    localStorage.setItem(KEYS.topicStats, JSON.stringify(s.dse_topic_stats ?? {}))
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
