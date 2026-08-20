'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { AUTH_BACKEND } from '@/lib/auth/client'
import { authSignInGoogle, authSignUpEmail } from '@/lib/auth/session'

// Sign-up page (Better Auth email/password). Google works in either backend; the
// email/password form is shown only when Better Auth is active.
export default function SignUpPageClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const router = useRouter()
  const emailEnabled = AUTH_BACKEND === 'better-auth'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError(en ? 'Password must be at least 8 characters.' : '密碼最少 8 個字元。')
      return
    }
    setBusy(true)
    setError(null)
    const res = await authSignUpEmail(name, email, password)
    if (res.error) {
      setError(res.error.message ?? (en ? 'Sign-up failed.' : '註冊失敗。'))
      setBusy(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-1">
          {en ? 'Create account' : '建立帳戶'}
        </h1>
        <p className="text-sm text-ink-muted mb-5">
          {en
            ? 'Create a free account to sync your progress across devices.'
            : '建立免費帳戶，跨裝置同步你嘅進度。'}
        </p>

        <button
          onClick={() => authSignInGoogle()}
          className="w-full inline-flex items-center justify-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <LogIn size={16} /> {en ? 'Continue with Google' : '用 Google 繼續'}
        </button>

        {emailEnabled && (
          <>
            <div className="flex items-center gap-3 my-5">
              <span className="h-px flex-1 bg-line-strong" />
              <span className="text-xs text-ink-muted">{en ? 'or' : '或'}</span>
              <span className="h-px flex-1 bg-line-strong" />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={en ? 'Name' : '名稱'}
                className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink"
              />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={en ? 'Email' : '電郵'}
                className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink"
              />
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={en ? 'Password (min 8 chars)' : '密碼（最少 8 字元）'}
                className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink"
              />
              {error && <p className="text-sm text-rose">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 border border-line-strong hover:border-accent disabled:opacity-60 text-ink px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                {busy && <Loader2 size={15} className="animate-spin" />}
                {en ? 'Create account' : '建立帳戶'}
              </button>
            </form>

            <p className="text-sm text-ink-muted mt-4 text-center">
              {en ? 'Already have an account? ' : '已有帳戶？'}
              <Link href="/sign-in" className="text-accent hover:underline">
                {en ? 'Sign in' : '登入'}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
