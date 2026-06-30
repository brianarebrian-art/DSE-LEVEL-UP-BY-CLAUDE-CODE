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
    return <div className="w-7 h-7 rounded-full bg-slate-800 animate-pulse" />
  }

  if (user) {
    const label = user.name ?? user.email ?? t.auth.user
    const initial = label.charAt(0).toUpperCase()
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-amber-500 text-black grid place-items-center text-xs font-bold"
          title={user.email ?? label}
        >
          {initial}
        </div>
        <button
          onClick={() => {
            onAction?.()
            authSignOut()
          }}
          className="text-sm text-slate-400 hover:text-slate-100 flex items-center gap-1"
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
      className="flex items-center gap-2 text-sm border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg px-3 py-1.5 transition-colors"
    >
      <LogIn size={14} /> {t.auth.signIn}
    </button>
  )
}

export default function AuthButton({ onAction }: { onAction?: () => void }) {
  if (!AUTH_ENABLED) return null
  return <AuthButtonInner onAction={onAction} />
}
