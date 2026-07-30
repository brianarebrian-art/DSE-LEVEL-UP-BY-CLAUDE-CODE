'use client'

import { LogIn, LogOut } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { useAuthSession, authSignInGoogle, authSignOut } from '@/lib/auth/session'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// Inner component calls useSession — only mounted when auth is enabled (so the
// SessionProvider is guaranteed to wrap it).
function AuthButtonInner({ onAction }: { onAction?: () => void }) {
  const { user, status } = useAuthSession()
  const t = useT()

  if (status === 'loading') {
    return <div className="w-7 h-7 rounded-full bg-black/10 animate-pulse" />
  }

  if (user) {
    const label = user.name ?? user.email ?? t.auth.user
    const initial = label.charAt(0).toUpperCase()
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-accent-strong text-on-accent grid place-items-center text-xs font-medium"
          title={user.email ?? label}
        >
          {initial}
        </div>
        <button
          onClick={() => {
            onAction?.()
            authSignOut()
          }}
          className="min-h-11 text-sm text-ink-muted hover:text-accent flex items-center gap-1 px-1"
        >
          <LogOut size={14} /> {t.auth.signOut}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        onAction?.()
        authSignInGoogle()
      }}
      // whitespace-nowrap：橫向導航條擠迫時「Google 登入」會斷成兩行，令掣高度
      // 不一致。同 2026-07-28 導航條修正一致，一律唔准喺條 bar 入面斷行。
      className="min-h-11 flex items-center gap-2 text-sm whitespace-nowrap border border-line-strong hover:border-accent text-ink-soft hover:text-accent rounded-lg px-3 py-1.5 transition-colors"
    >
      <LogIn size={14} /> {t.auth.signIn}
    </button>
  )
}

export default function AuthButton({ onAction }: { onAction?: () => void }) {
  if (!AUTH_ENABLED) return null
  return <AuthButtonInner onAction={onAction} />
}
