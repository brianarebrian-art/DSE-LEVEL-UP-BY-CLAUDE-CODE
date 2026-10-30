'use client'

import { useState } from 'react'
import { LogIn, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { signInWithGoogle } from '@/lib/auth/google-auth'

/**
 * Bilingual Google sign-in via Supabase Auth.
 * `next` must be a same-origin relative path (enforced in signInWithGoogle).
 */
export default function GoogleSignInButton({
  next = '/dashboard?sync=ok',
  className,
}: {
  next?: string
  className?: string
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [busy, setBusy] = useState(false)

  async function onClick() {
    if (busy) return
    setBusy(true)
    const { error } = await signInWithGoogle(next)
    if (error) {
      setBusy(false)
      window.location.href = `/sign-in?error=${encodeURIComponent(error)}`
    }
    // On success the browser navigates to Google / Supabase — leave busy=true.
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={busy}
      className={
        className ??
        'w-full inline-flex items-center justify-center gap-2 bg-accent-strong hover:bg-accent-hover disabled:opacity-60 text-on-accent font-bold px-4 py-2.5 rounded-xl transition-colors'
      }
    >
      {busy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
      {en ? 'Continue with Google' : '用 Google 繼續'}
    </button>
  )
}
