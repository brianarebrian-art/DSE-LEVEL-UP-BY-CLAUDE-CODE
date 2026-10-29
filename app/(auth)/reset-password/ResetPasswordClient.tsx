'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { AUTH_BACKEND, authClient } from '@/lib/auth/client'

export default function ResetPasswordClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (AUTH_BACKEND !== 'better-auth') {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <p className="text-sm text-ink-muted">
          {en ? 'Password reset is not enabled on this deployment.' : '呢個部署未開放重設密碼。'}{' '}
          <Link href="/sign-in" className="text-accent hover:underline">
            {en ? 'Sign in' : '登入'}
          </Link>
        </p>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) {
      setError(en ? 'Missing reset token. Open the link from your email again.' : '缺少重設代碼。請重新打開電郵入面嘅連結。')
      return
    }
    if (password.length < 8) {
      setError(en ? 'Use at least 8 characters.' : '請用最少 8 個字元。')
      return
    }
    setBusy(true)
    setError(null)
    const res = await authClient.resetPassword({ newPassword: password, token })
    if (res.error) {
      setError(res.error.message ?? (en ? 'Reset failed.' : '重設失敗。'))
      setBusy(false)
      return
    }
    setDone(true)
    setBusy(false)
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-2">{en ? 'Choose a new password' : '設定新密碼'}</h1>
        {done ? (
          <p className="text-sm text-ink">
            {en ? 'Password updated. You can sign in now.' : '密碼已更新，而家可以登入。'}{' '}
            <Link href="/sign-in" className="text-accent hover:underline">
              {en ? 'Sign in' : '登入'}
            </Link>
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-ink-soft" htmlFor="new-password">
              {en ? 'New password' : '新密碼'}
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink"
            />
            {error && (
              <p className="text-sm text-rose" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent-strong text-on-accent font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60"
            >
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden />}
              {en ? 'Save password' : '儲存密碼'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
