'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { AUTH_BACKEND } from '@/lib/auth/client'
import { authRequestMagicLink } from '@/lib/auth/session'

export default function MagicLinkClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (AUTH_BACKEND !== 'better-auth') {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
          <h1 className="text-xl font-bold text-ink mb-2">{en ? 'Email sign-in link' : '電郵登入連結'}</h1>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            {en
              ? 'Magic links unlock after the Better Auth cutover. For now, use Google on the sign-in page.'
              : 'Magic link 會喺 Better Auth 開通後可用。而家請用登入頁嘅 Google。'}
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
    await authRequestMagicLink(email.trim())
    setDone(true)
    setBusy(false)
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-1">{en ? 'Email me a sign-in link' : '用電郵收登入連結'}</h1>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          {en
            ? 'No password to remember. We only need an email — not your school, class, or real name.'
            : '唔使記密碼。只需要電郵 —— 唔使學校、班別或真實姓名。'}
        </p>
        {done ? (
          <p className="text-sm text-ink" role="status">
            {en
              ? 'If that address can receive mail, a sign-in link is on its way. It expires soon — open it on this device if you can.'
              : '如果呢個電郵收得到信，登入連結應該已寄出。連結好快過期 —— 盡量喺呢部機打開。'}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-ink-soft" htmlFor="magic-email">
              {en ? 'Email' : '電郵'}
            </label>
            <input
              id="magic-email"
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
              className="w-full inline-flex items-center justify-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60"
            >
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden />}
              {en ? 'Send link' : '寄出連結'}
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
