'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { LogIn, LogOut } from 'lucide-react'
import { useT } from '@/lib/i18n'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// Inner component calls useSession — only mounted when auth is enabled (so the
// SessionProvider is guaranteed to wrap it).
function AuthButtonInner({ onAction }: { onAction?: () => void }) {
  const { data: session, status } = useSession()
  const t = useT()

  if (status === 'loading') {
    return <div className="w-7 h-7 rounded-full bg-slate-800 animate-pulse" />
  }

  if (session?.user) {
    const label = session.user.name ?? session.user.email ?? t.auth.user
    const initial = label.charAt(0).toUpperCase()
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-amber-500 text-black grid place-items-center text-xs font-bold"
          title={session.user.email ?? label}
        >
          {initial}
        </div>
        {session.user.isPremium ? (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
            {t.premium.badgePremium}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            {t.premium.badgeFree}
          </span>
        )}
        <button
          onClick={() => {
            onAction?.()
            signOut()
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
        signIn('google')
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
