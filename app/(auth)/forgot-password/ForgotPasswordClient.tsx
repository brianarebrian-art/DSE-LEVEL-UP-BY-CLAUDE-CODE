'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { AUTH_BACKEND } from '@/lib/auth/client'
import { authRequestPasswordReset } from '@/lib/auth/session'

export default function ForgotPasswordClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (AUTH_BACKEND !== 'better-auth') {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
          <h1 className="text-xl font-bold text-ink mb-2">{en ? 'Forgot password' : '忘記密碼'}</h1>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            {en
              ? 'Password sign-in is not enabled on this deployment yet. Use Google sign-in, or ask a founder after the Better Auth cutover.'
              : '呢個部署暫時未開電郵密碼登入。請用 Google 登入；開通 Better Auth 之後先有重設密碼。'}
          </p>
          <Link href="/sign-in" className="text-accent text-sm hover:underline">
            {en ? 'Back to sign in' : '返回登入'}
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    // Always show success — avoids account enumeration.
    await authRequestPasswordReset(email.trim())
    setDone(true)
    setBusy(false)
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-1">{en ? 'Reset password' : '重設密碼'}</h1>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          {en
            ? 'If an account exists for that email, we will send a reset link. We never ask for your school name or ID card.'
            : '如果呢個電郵有帳戶，我哋會寄重設連結。我哋唔會問你學校或身份證。'}
        </p>
        {done ? (
          <p className="text-sm text-ink" role="status">
            {en
              ? 'If that email is registered, a reset link is on its way. Check your inbox and spam folder.'
              : '如果呢個電郵已註冊，重設連結應該已寄出。請檢查收件箱同垃圾郵件。'}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-ink-soft" htmlFor="reset-email">
              {en ? 'Email' : '電郵'}
            </label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 border border-line-strong hover:border-accent disabled:opacity-60 text-ink px-4 py-2.5 rounded-xl text-sm"
            >
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden />}
              {en ? 'Send reset link' : '寄出重設連結'}
            </button>
          </form>
        )}
        <p className="text-sm text-ink-muted mt-4">
          <Link href="/sign-in" className="text-accent hover:underline">
            {en ? 'Back to sign in' : '返回登入'}
          </Link>
        </p>
      </div>
    </div>
  )
}
