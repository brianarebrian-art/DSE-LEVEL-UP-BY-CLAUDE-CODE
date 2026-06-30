'use client'

import { useEffect, useState } from 'react'
import { LogIn, LogOut, Loader2, CloudOff, Cloud } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useSync } from '@/components/SyncProvider'
import { useAuthSession, authSignInGoogle, authSignOut } from '@/lib/auth/session'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// The dashboard's cross-device-sync control, replacing the old static teaser.
// Three states (防線 4): not signed in → bind-Google CTA; signed in → live sync
// status; sync error → "暫存本地". Sign-out NEVER clears local data.
export default function SyncStatus() {
  const { t, locale } = useLocale()
  const en = locale === 'en'
  const { user, status: authStatus } = useAuthSession()
  const { status: syncStatus, version } = useSync()
  const [mounted, setMounted] = useState(false)
  const [binding, setBinding] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null)

  // Avoid SSR/CSR mismatch — only resolve auth-dependent UI after mount (防線 B).
  useEffect(() => {
    setMounted(true)
  }, [])

  // Re-read the last successful cloud-merge time on every sync version bump / status
  // change. `dse_synced_at` is stamped by applyLocal() in lib/sync. Client-only.
  useEffect(() => {
    const raw = Number(localStorage.getItem('dse_synced_at'))
    setLastSyncedAt(Number.isFinite(raw) && raw > 0 ? raw : null)
  }, [version, syncStatus])

  // Auth disabled, or pre-hydration → keep the original on-device teaser.
  if (!AUTH_ENABLED || !mounted || authStatus === 'loading') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex items-center gap-3 text-sm">
        <Cloud size={18} className="text-slate-500 shrink-0" />
        <span className="text-slate-400">
          {t.dashboard.loginTeaserA}
          <span className="text-slate-300">{t.dashboard.loginTeaserGoogle}</span>
          {t.dashboard.loginTeaserB}
        </span>
      </div>
    )
  }

  // State 1 — not signed in: bind Google (disabled + spinner during redirect).
  if (!user) {
    return (
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-sm text-slate-400">
          {en
            ? 'Progress is saved on this device. Bind a Google account to sync across devices.'
            : '進度暫存喺呢部裝置。綁定 Google 帳戶即可跨裝置同步。'}
        </span>
        <button
          onClick={() => {
            setBinding(true)
            authSignInGoogle()
          }}
          disabled={binding}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded-xl transition-all text-sm shrink-0"
        >
          {binding ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
          {binding ? (en ? 'Redirecting…' : '跳轉中…') : en ? '🔓 Bind Google' : '🔓 綁定 Google 帳戶'}
        </button>
      </div>
    )
  }

  // State 2 — signed in: live sync status + sign-out (keeps local data).
  // BUGFIX: 'idle' was previously grouped with 'syncing', so a settled/idle session
  // showed a stuck "雲端同步中…" spinner forever. Now: only 'syncing' shows the
  // spinner; 'synced' shows green; 'idle' (fleeting pre-first-pull state) is neutral.
  const error = syncStatus === 'error' || syncStatus === 'offline'
  const syncing = syncStatus === 'syncing'
  const synced = syncStatus === 'synced'
  const label = error
    ? en
      ? '🔴 Sync failed — saved locally'
      : '🔴 同步失敗，已暫存本地'
    : syncing
      ? en
        ? 'Syncing to cloud…'
        : '雲端同步中…'
      : synced
        ? en
          ? '🟢 Progress safely synced'
          : '🟢 進度已安全同步'
        : en
          ? 'Bound — awaiting first sync'
          : '已綁定，等待首次同步'

  // Localised "last synced HH:MM" (防線: 顯示最後同步時間要本地化) via Intl.DateTimeFormat.
  const lastSyncedLabel =
    synced && lastSyncedAt
      ? new Intl.DateTimeFormat(en ? 'en-HK' : 'zh-HK', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(lastSyncedAt))
      : null

  return (
    <div
      className={`rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap border ${
        error ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-900 border-slate-800'
      }`}
    >
      <div className="min-w-0">
        <span className="flex items-center gap-2 text-sm">
          {error ? (
            <CloudOff size={18} className="text-red-400 shrink-0" />
          ) : syncing ? (
            <Loader2 size={18} className="text-amber-400 shrink-0 animate-spin" />
          ) : synced ? (
            <Cloud size={18} className="text-green-400 shrink-0" />
          ) : (
            <Cloud size={18} className="text-slate-500 shrink-0" />
          )}
          <span className={error ? 'text-red-300' : 'text-slate-300'}>{label}</span>
        </span>
        {/* Identity — the signed-in account whose progress is being synced. */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-slate-500 break-all">{user.email}</span>
          {lastSyncedLabel && (
            <span className="text-xs text-slate-600">
              · {en ? `Last synced ${lastSyncedLabel}` : `最後同步 ${lastSyncedLabel}`}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => authSignOut()}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors shrink-0"
      >
        <LogOut size={14} /> {en ? '🚪 Sign out' : '🚪 登出'}
      </button>
    </div>
  )
}
