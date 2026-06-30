'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { AUTH_BACKEND } from '@/lib/auth/client'
import { authSignInGoogle, authSignInEmail } from '@/lib/auth/session'

// Sign-in page (Better Auth). Google works in either backend; the email/password form
// is shown only when Better Auth is the active backend (otherwise its endpoints are not
// served, so we keep the page to Google-only — matching the pre-cutover behaviour).
export default function SignInPage() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const router = useRouter()
  const emailEnabled = AUTH_BACKEND === 'better-auth'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await authSignInEmail(email, password)
    if (res.error) {
      setError(res.error.message ?? (en ? 'Sign-in failed.' : '登入失敗。'))
      setBusy(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-100 mb-1">
          {en ? 'Sign in' : '登入'}
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          {en
            ? 'Sign in to sync your progress across devices. The platform is 100% free.'
            : '登入以跨裝置同步你嘅進度。平台 100% 免費。'}
        </p>

        <button
          onClick={() => authSignInGoogle()}
          className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <LogIn size={16} /> {en ? 'Continue with Google' : '用 Google 繼續'}
        </button>

        {emailEnabled && (
          <>
            <div className="flex items-center gap-3 my-5">
              <span className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-500">{en ? 'or' : '或'}</span>
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={en ? 'Email' : '電郵'}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100"
              />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={en ? 'Password' : '密碼'}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 disabled:opacity-60 text-slate-100 px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                {busy && <Loader2 size={15} className="animate-spin" />}
                {en ? 'Sign in with email' : '用電郵登入'}
              </button>
            </form>

            <p className="text-sm text-slate-400 mt-4 text-center">
              {en ? 'No account? ' : '未有帳戶？'}
              <Link href="/sign-up" className="text-amber-400 hover:underline">
                {en ? 'Sign up' : '註冊'}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
