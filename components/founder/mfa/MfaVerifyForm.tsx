'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TotpCodeInput from '@/components/founder/mfa/TotpCodeInput'

export default function MfaVerifyForm({ factorId }: { factorId: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function submit() {
    if (busy || code.length !== 6) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/founder/mfa/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, factorId }),
      })
      if (res.status === 429) {
        setMessage('嘗試驗證太多次，請稍後再試。')
        return
      }
      if (!res.ok) {
        setMessage('驗證失敗。請確認時間同步後再試。')
        return
      }
      router.replace('/founder')
      router.refresh()
    } catch {
      setMessage('網絡錯誤，請再試。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void submit()
      }}
    >
      <TotpCodeInput value={code} onChange={setCode} disabled={busy} autoFocus />
      <button
        type="submit"
        disabled={busy || code.length !== 6}
        className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-500/90 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        {busy ? '驗證中…' : '驗證並進入'}
      </button>
      {message ? <p className="text-sm text-amber-300">{message}</p> : null}
    </form>
  )
}
