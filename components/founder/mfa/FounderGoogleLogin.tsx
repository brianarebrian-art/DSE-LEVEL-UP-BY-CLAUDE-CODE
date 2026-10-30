'use client'

import { useState } from 'react'
import { signInWithGoogle } from '@/lib/auth/google-auth'

export default function FounderGoogleLogin({ next = '/founder' }: { next?: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onClick() {
    if (busy) return
    setBusy(true)
    setErr(null)
    const { error } = await signInWithGoogle(next)
    if (error) {
      setBusy(false)
      setErr('無法開始 Google 登入。請稍後再試。')
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={busy}
        className="inline-flex w-full items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
      >
        {busy ? '導向 Google…' : '使用 Google 繼續'}
      </button>
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
    </div>
  )
}
