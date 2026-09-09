'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAuthSession } from '@/lib/auth/session'
import {
  snapshotLocal,
  applyLocal,
  mergeSnapshots,
  emptySnapshot,
  getSyncOwner,
  setSyncOwner,
  PROGRESS_EVENT,
  type CloudData,
} from '@/lib/sync'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'

interface SyncContextValue {
  status: SyncStatus
  /** Bumps on every local change AND after a cloud pull → consumers re-read. */
  version: number
}

const SyncContext = createContext<SyncContextValue>({ status: 'idle', version: 0 })

export function useSync(): SyncContextValue {
  return useContext(SyncContext)
}

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'
const DEBOUNCE_MS = 2500 // 防線 D: cap cloud writes to ~one per burst of activity
const FOREGROUND_PULL_MS = 10_000 // v3.0 F1: min gap between foreground refresh pulls

// Drives cross-device sync for the whole app. Mounted inside SessionProvider so
// useSession() is available. Reads the Auth.js login state; when authenticated it
// pulls + smart-merges the cloud row, then debounce-pushes local changes up.
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user, status: authStatus } = useAuthSession()
  const userId = user?.id ?? null
  const [status, setStatus] = useState<SyncStatus>('idle')

  // ── 私隱同意閘（2026-09-09，Phase 2 選項 B）────────────────────────────
  //
  // 同步【只喺用戶同意咗現行政策版本】先至行。唔同意 → 呢個 provider 咩都唔做，
  // 而 localStorage 一個字都冇郁：練習、雷達圖、錯因自診、SEN 設定全部照用。
  // 呢個就係「唔同意唔等於用唔到網站」喺代碼上面嘅落點。
  //
  // 預設 `false` 而唔係 `true` —— 查唔到、網絡差、route 死咗，一律當【未同意】。
  // fail-open 嘅話，一次故障就會令全部人喺冇同意之下上雲，而且冇聲。
  const [consentOk, setConsentOk] = useState(false)

  useEffect(() => {
    if (!AUTH_ENABLED) return
    if (authStatus !== 'authenticated') {
      setConsentOk(false)
      return
    }
    let alive = true
    const check = () => {
      fetch('/api/privacy/consent')
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((j: { consented?: boolean }) => alive && setConsentOk(Boolean(j.consented)))
        .catch(() => alive && setConsentOk(false))
    }
    check()
    // 用戶喺 modal 撳完「同意」即刻開始同步，唔使等下次 reload。
    window.addEventListener('dse:consent-changed', check)
    return () => {
      alive = false
      window.removeEventListener('dse:consent-changed', check)
    }
  }, [authStatus])

  /** 同步嘅唯一前置條件：登入咗 ＋ 同意咗。 */
  const maySync = authStatus === 'authenticated' && consentOk
  const [version, setVersion] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPullRef = useRef(0) // throttles the foreground refresh below

  const bump = useCallback(() => setVersion((v) => v + 1), [])

  // Upload the current local snapshot (防線 D/F).
  const push = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setStatus('offline')
      return
    }
    setStatus('syncing')
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: snapshotLocal() }),
      })
      if (!res.ok) throw new Error(`push ${res.status}`)
      setStatus('synced')
    } catch {
      // 防線 F: keep working on local; retry fires on the next 'online' event.
      setStatus('error')
    }
  }, [])

  // Pull cloud → smart-merge → write winner local + push it back (防線 E).
  const pullMerge = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setStatus('offline')
      return
    }
    setStatus('syncing')
    try {
      const res = await fetch('/api/progress')
      if (!res.ok) throw new Error(`pull ${res.status}`)
      const cloud = (await res.json()) as CloudData

      // Anti-contamination (防線: 多用戶切換): if this device's local data belongs
      // to a DIFFERENT user, the new user's cloud is the only truth — never let the
      // previous user's leftover local data win the merge or push up to this account.
      const owner = getSyncOwner()
      const foreignLocal = Boolean(owner && userId && owner !== userId)
      const winner = foreignLocal
        ? (cloud.progress ?? emptySnapshot())
        : mergeSnapshots(snapshotLocal(), cloud)

      applyLocal(winner) // write the merged result to localStorage
      if (userId) setSyncOwner(userId) // this device now belongs to the current user
      bump() // 防線 A.2: UI re-renders from the merged data, no manual refresh
      // Converge: push the winner up so both ends match.
      await push()
    } catch {
      setStatus('error')
    }
  }, [bump, push, userId])

  // Debounced push scheduler.
  const schedulePush = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void push()
    }, DEBOUNCE_MS)
  }, [push])

  // On login: initial pull + merge. On logout: back to idle (local data untouched).
  useEffect(() => {
    if (!AUTH_ENABLED) return
    if (maySync) void pullMerge()
    else if (authStatus === 'unauthenticated') setStatus('idle')
  }, [maySync, authStatus, pullMerge])

  // Local changes → reactive bump + (when logged in) debounced push.
  useEffect(() => {
    if (!AUTH_ENABLED) return
    const onChange = () => {
      bump()
      if (maySync) schedulePush()
    }
    window.addEventListener(PROGRESS_EVENT, onChange)
    return () => window.removeEventListener(PROGRESS_EVENT, onChange)
  }, [maySync, schedulePush, bump])

  // Auto-recover when the network returns (防線 F): re-run a full pull+merge so we
  // BOTH catch up on any cloud changes we missed while offline AND flush local
  // changes that failed to push. (Fixes the earlier gap where reconnect only pushed.)
  useEffect(() => {
    if (!AUTH_ENABLED) return
    const onOnline = () => {
      if (maySync) void pullMerge()
    }
    const onOffline = () => setStatus('offline')
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [maySync, pullMerge])

  // v3.0 F1「多裝置」: refresh when this tab comes back to the foreground, so picking up
  // another device shows its in-progress run without a manual reload. Throttled so a
  // user flicking between tabs can't hammer the route. This replaces the spec's
  // client-side Supabase Realtime, which would need an anon key in the browser + RLS —
  // impossible on Auth.js v5 (no `auth.uid()`) and against the charter's server-only rule.
  useEffect(() => {
    if (!AUTH_ENABLED) return
    const onForeground = () => {
      if (!maySync) return
      if (document.visibilityState !== 'visible') return
      const now = Date.now()
      if (now - lastPullRef.current < FOREGROUND_PULL_MS) return
      lastPullRef.current = now
      void pullMerge()
    }
    document.addEventListener('visibilitychange', onForeground)
    window.addEventListener('focus', onForeground)
    return () => {
      document.removeEventListener('visibilitychange', onForeground)
      window.removeEventListener('focus', onForeground)
    }
  }, [maySync, pullMerge])

  // Clear any pending debounced push on unmount (no dangling setTimeout → no
  // setState-after-unmount). debounceRef is also cleared on every reschedule.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return <SyncContext.Provider value={{ status, version }}>{children}</SyncContext.Provider>
}
