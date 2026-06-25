'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { LogIn, LogOut, Loader2, CloudOff, Cloud, BadgeCheck } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useSync } from '@/components/SyncProvider'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// The dashboard's cross-device-sync control, replacing the old static teaser.
// Three states (防線 4): not signed in → bind-Google CTA; signed in → live sync
// status; sync error → "暫存本地". Sign-out NEVER clears local data.
export default function SyncStatus() {
  const { t, locale } = useLocale()
  const en = locale === 'en'
  const { data: session, status: authStatus } = useSession()
  const { status: syncStatus } = useSync()
  const [mounted, setMounted] = useState(false)
  const [binding, setBinding] = useState(false)

  // Avoid SSR/CSR mismatch — only resolve auth-dependent UI after mount (防線 B).
  useEffect(() => {
    setMounted(true)
  }, [])

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
  if (!session?.user) {
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
            signIn('google')
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
  const error = syncStatus === 'error' || syncStatus === 'offline'
  const syncing = syncStatus === 'syncing' || syncStatus === 'idle'
  const label = error
    ? en
      ? '🔴 Sync failed — saved locally'
      : '🔴 同步失敗，已暫存本地'
    : syncing
      ? en
        ? 'Syncing to cloud…'
        : '雲端同步中…'
      : en
        ? '🟢 Progress safely synced'
        : '🟢 進度已安全同步'

  const isPremium = Boolean(session.user.isPremium)

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
          ) : (
            <Cloud size={18} className="text-green-400 shrink-0" />
          )}
          <span className={error ? 'text-red-300' : 'text-slate-300'}>{label}</span>
        </span>
        {/* Identity + plan tier. Doubles as the support line: if a tester reports
            Premium isn't working, this shows the EXACT email Google reported and
            whether the server resolved them to Premium or Free — instantly telling
            apart an email mismatch, a stale token, or an env/redeploy miss. */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-slate-500 break-all">{session.user.email}</span>
          {isPremium ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
              <BadgeCheck size={11} /> Premium
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-700/40 border border-slate-600/40 px-2 py-0.5 rounded-full">
              {en ? 'Free plan' : '免費版'}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors shrink-0"
      >
        <LogOut size={14} /> {en ? '🚪 Sign out' : '🚪 登出'}
      </button>
    </div>
  )
}
