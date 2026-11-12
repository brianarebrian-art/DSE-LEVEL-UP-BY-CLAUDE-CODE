'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useAuthSession } from '@/lib/auth/session'
import { signInWithGoogle } from '@/lib/auth/google-auth'

const DISMISS_KEY = 'dse_sync_invite_off'

/**
 * Inline optional Google sync, shown once after the first explanation.
 * Not a modal: it sits in the feedback flow and never covers 下一題.
 */
export default function PracticeSyncInvite({
  open,
  returnPath,
  onBeforeLeave,
  questionCount,
}: {
  open: boolean
  returnPath: string
  onBeforeLeave: () => void
  questionCount: number
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const { user, status } = useAuthSession()
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  if (!open || hidden || status === 'authenticated' || user) return null

  const copy =
    questionCount === 10
      ? en
        ? 'Want to continue on another device? You can sync this progress with Google (optional). Skipping is fine — these 10 questions will not be interrupted.'
        : '想喺第二部裝置繼續？可用 Google 同步呢份進度（可選）。唔同步都得，而家呢 10 題唔會中斷。'
      : en
        ? `Want to continue on another device? You can sync this progress with Google (optional). Skipping is fine — these ${questionCount} questions will not be interrupted.`
        : `想喺第二部裝置繼續？可用 Google 同步呢份進度（可選）。唔同步都得，而家呢 ${questionCount} 題唔會中斷。`

  const dismiss = () => {
    setHidden(true)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* private mode */
    }
  }

  return (
    <div className="relative mt-3 rounded-[var(--radius-control)] border border-dashed border-line-strong bg-surface-raised px-3.5 py-3 pr-10 text-sm leading-relaxed text-ink-muted">
      <button
        type="button"
        onClick={dismiss}
        aria-label={en ? 'Dismiss sync note' : '關閉'}
        className="absolute right-1 top-1 inline-flex h-12 w-12 items-center justify-center rounded-lg text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <X size={18} aria-hidden />
      </button>
      <p>{copy}</p>
      <button
        type="button"
        onClick={() => {
          onBeforeLeave()
          void signInWithGoogle(returnPath)
        }}
        className="mt-1.5 inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {en ? 'Sync with Google' : '用 Google 同步'}
        <span aria-hidden>{' →'}</span>
      </button>
    </div>
  )
}
