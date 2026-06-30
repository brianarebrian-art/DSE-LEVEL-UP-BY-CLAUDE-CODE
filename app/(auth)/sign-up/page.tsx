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
export default function SignUpPage() {
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
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-100 mb-1">
          {en ? 'Create account' : '建立帳戶'}
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          {en
            ? 'Create a free account to sync your progress across devices.'
            : '建立免費帳戶，跨裝置同步你嘅進度。'}
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
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={en ? 'Name' : '名稱'}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100"
              />
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={en ? 'Password (min 8 chars)' : '密碼（最少 8 字元）'}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 disabled:opacity-60 text-slate-100 px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                {busy && <Loader2 size={15} className="animate-spin" />}
                {en ? 'Create account' : '建立帳戶'}
              </button>
            </form>

            <p className="text-sm text-slate-400 mt-4 text-center">
              {en ? 'Already have an account? ' : '已有帳戶？'}
              <Link href="/sign-in" className="text-amber-400 hover:underline">
                {en ? 'Sign in' : '登入'}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
