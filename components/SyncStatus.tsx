'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogIn, LogOut, Loader2, CloudOff, Cloud, RefreshCw } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useSync } from '@/components/SyncProvider'
import { useAuthSession, authSignOut } from '@/lib/auth/session'
import SignInNote from '@/components/SignInNote'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// The dashboard's cross-device-sync control, replacing the old static teaser.
// Three states (防線 4): not signed in → bind-Google CTA; signed in → live sync
// status; sync error → "暫存本地" + retry. Sign-out NEVER clears local data.
// Light-first 版（憲章 §3）：白底 + 青／金／玫狀態色（避開鮮紅錯誤主色）。
export default function SyncStatus() {
  const { t, locale } = useLocale()
  const en = locale === 'en'
  const { user, status: authStatus } = useAuthSession()
  const { status: syncStatus, version, retry } = useSync()
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
      <div className="bg-surface-raised border border-line rounded-2xl p-4 mb-8 flex items-center gap-3 text-sm">
        <Cloud size={18} className="text-ink-muted shrink-0" />
        <span className="text-ink-muted">
          {t.dashboard.loginTeaserA}
          <span className="text-ink-soft">{t.dashboard.loginTeaserGoogle}</span>
          {t.dashboard.loginTeaserB}
        </span>
      </div>
    )
  }

  // State 1 — not signed in: bind Google (disabled + spinner during redirect).
  if (!user) {
    return (
      <div className="bg-surface-raised border border-gold/30 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-sm text-ink-muted">
          {en
            ? 'Progress is saved on this device. Sign in to sync across devices (Google or email when enabled).'
            : '進度暫存喺呢部裝置。登入即可跨裝置同步（Google；啟用後亦可用電郵）。'}
        </span>
        <Link
          href="/sign-in"
          onClick={() => setBinding(true)}
          className="inline-flex min-h-11 items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-4 py-2 rounded-xl transition-all text-sm shrink-0"
        >
          {binding ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
          {binding ? (en ? 'Redirecting…' : '跳轉中…') : en ? 'Sign in to sync' : '登入以同步'}
        </Link>
        <SignInNote className="basis-full" />
      </div>
    )
  }

  // State 2 — signed in: live sync status + sign-out (keeps local data).
  // BUGFIX: 'idle' was previously grouped with 'syncing', so a settled/idle session
  // showed a stuck "雲端同步中…" spinner forever. Now: only 'syncing' shows the
  // spinner; 'synced' shows green; 'idle' (fleeting pre-first-pull state) is neutral.
  const offline = syncStatus === 'offline'
  const error = syncStatus === 'error' || offline
  const syncing = syncStatus === 'syncing'
  const synced = syncStatus === 'synced'
  // Nielsen H2／H9：淺白語言＋具體下一步；唔用 emoji 當狀態（H8）。
  const label = offline
    ? en
      ? 'Offline — progress stays on this device'
      : '而家離線 — 進度已暫存喺呢部裝置'
    : syncStatus === 'error'
      ? en
        ? 'Couldn’t reach the cloud — progress is safe locally'
        : '暫時連唔上雲端 — 進度已暫存喺呢部裝置'
      : syncing
        ? en
          ? 'Syncing to cloud…'
          : '雲端同步中…'
        : synced
          ? en
            ? 'Progress synced'
            : '進度已同步'
          : en
            ? 'Signed in — awaiting first sync'
            : '已登入，等待首次同步'

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
        error ? 'bg-rose/[0.06] border-rose/30' : 'bg-surface-raised border-line'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0">
        <span className="flex items-center gap-2 text-sm">
          {error ? (
            <CloudOff size={18} className="text-rose shrink-0" aria-hidden />
          ) : syncing ? (
            <Loader2 size={18} className="text-gold shrink-0 animate-spin" aria-hidden />
          ) : synced ? (
            <Cloud size={18} className="text-accent shrink-0" aria-hidden />
          ) : (
            <Cloud size={18} className="text-ink-muted shrink-0" aria-hidden />
          )}
          <span className={error ? 'text-rose' : 'text-ink-soft'}>{label}</span>
        </span>
        {/* Identity — the signed-in account whose progress is being synced. */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-ink-muted break-all">{user.email}</span>
          {lastSyncedLabel && (
            <span className="text-xs text-ink-muted">
              · {en ? `Last synced ${lastSyncedLabel}` : `最後同步 ${lastSyncedLabel}`}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-ink-muted">
            {en
              ? 'You can keep practising. Tap Retry when you’re back online.'
              : '可以繼續練習。網絡恢復後撳「再試」即可。'}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {error && (
          <button
            type="button"
            onClick={() => retry()}
            disabled={syncing}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-ink border border-line-strong hover:border-accent hover:text-accent rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} aria-hidden /> {en ? 'Retry sync' : '再試同步'}
          </button>
        )}
        <button
          type="button"
          onClick={() => authSignOut()}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-muted hover:text-accent border border-line-strong hover:border-accent rounded-lg px-3 py-1.5 transition-colors"
        >
          <LogOut size={14} aria-hidden /> {en ? 'Sign out' : '登出'}
        </button>
      </div>
    </div>
  )
}
