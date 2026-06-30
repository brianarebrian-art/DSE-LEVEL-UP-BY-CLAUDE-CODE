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

// Drives cross-device sync for the whole app. Mounted inside SessionProvider so
// useSession() is available. Reads the Auth.js login state; when authenticated it
// pulls + smart-merges the cloud row, then debounce-pushes local changes up.
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user, status: authStatus } = useAuthSession()
  const userId = user?.id ?? null
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [version, setVersion] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (authStatus === 'authenticated') void pullMerge()
    else if (authStatus === 'unauthenticated') setStatus('idle')
  }, [authStatus, pullMerge])

  // Local changes → reactive bump + (when logged in) debounced push.
  useEffect(() => {
    if (!AUTH_ENABLED) return
    const onChange = () => {
      bump()
      if (authStatus === 'authenticated') schedulePush()
    }
    window.addEventListener(PROGRESS_EVENT, onChange)
    return () => window.removeEventListener(PROGRESS_EVENT, onChange)
  }, [authStatus, schedulePush, bump])

  // Auto-recover when the network returns (防線 F): re-run a full pull+merge so we
  // BOTH catch up on any cloud changes we missed while offline AND flush local
  // changes that failed to push. (Fixes the earlier gap where reconnect only pushed.)
  useEffect(() => {
    if (!AUTH_ENABLED) return
    const onOnline = () => {
      if (authStatus === 'authenticated') void pullMerge()
    }
    const onOffline = () => setStatus('offline')
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [authStatus, pullMerge])

  // Clear any pending debounced push on unmount (no dangling setTimeout → no
  // setState-after-unmount). debounceRef is also cleared on every reschedule.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return <SyncContext.Provider value={{ status, version }}>{children}</SyncContext.Provider>
}
