'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuthSession } from '@/lib/auth/session'
import { A11Y_EVENT, applyCloudSettings, pullSettings, pushSettings } from '@/lib/settingsSync'

// v8.0 CLOUD-FIRST · SEN 設定同步接線。
//
// 只做設定；進度／做緊嘅卷仍然行 SyncProvider（`/api/progress` snapshot）——
// 同一份數據唔可以有兩條同步通道，否則兩邊時間戳唔同就會變成邊條後行邊條贏。
//
// 匿名用戶：authStatus !== 'authenticated' 時呢個組件由頭到尾唔會 fetch 任何嘢。

export type SettingsSyncState = 'idle' | 'syncing' | 'synced' | 'pending' | 'anonymous'

const Ctx = createContext<SettingsSyncState>('idle')

/** 供 OfflineBadge 讀 —— 純顯示用，唔會反過來影響同步邏輯。 */
export function useSettingsSyncState(): SettingsSyncState {
  return useContext(Ctx)
}

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'
const DEBOUNCE_MS = 1500 // 拖滑桿會連環派事件，收成一次上傳

export default function SettingsSync({ children }: { children: React.ReactNode }) {
  const { status: authStatus } = useAuthSession()
  const [state, setState] = useState<SettingsSyncState>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 拉落嚟嗰下會寫 storage + 派 dse-a11y，唔閂住就會即刻反彈一次上傳
  const applyingRef = useRef(false)

  const authed = AUTH_ENABLED && authStatus === 'authenticated'

  const push = useCallback(async () => {
    setState('syncing')
    const ok = await pushSettings()
    // 失敗＝靜靜記住有嘢未同步，唔彈紅色警告（違反情緒安全網）
    setState(ok ? 'synced' : 'pending')
  }, [])

  // 登入時拉一次雲端設定（LWW：雲端有記錄就以雲端為準）。
  useEffect(() => {
    if (!AUTH_ENABLED) return
    if (authStatus === 'unauthenticated') {
      setState('anonymous')
      return
    }
    if (authStatus !== 'authenticated') return

    let cancelled = false
    void (async () => {
      setState('syncing')
      const cloud = await pullSettings()
      if (cancelled) return
      if (cloud) {
        applyingRef.current = true
        applyCloudSettings(cloud)
        // 等本輪 dse-a11y 派完先解鎖，唔係就會即刻回彈一次 push
        setTimeout(() => {
          applyingRef.current = false
        }, 0)
        setState('synced')
      } else {
        // 雲端未有記錄 → 將本機現狀種上去，令第二部機有嘢可拉
        await push()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authStatus, push])

  // 本機設定一改就 debounce 上雲（登入用戶 only）。
  useEffect(() => {
    if (!authed) return
    const onChange = () => {
      if (applyingRef.current) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => void push(), DEBOUNCE_MS)
    }
    window.addEventListener(A11Y_EVENT, onChange)
    return () => window.removeEventListener(A11Y_EVENT, onChange)
  }, [authed, push])

  // 返返網就補送一次（唔彈嘢、唔打斷）
  useEffect(() => {
    if (!authed) return
    const onOnline = () => void push()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [authed, push])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>
}
