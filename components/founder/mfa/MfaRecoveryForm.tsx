'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MfaRecoveryForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function submit() {
    if (busy || code.trim().length < 8) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/founder/mfa/recovery', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.status === 429) {
        setMessage('嘗試太多次，請稍後再試。')
        return
      }
      if (!res.ok) {
        setMessage('復原碼無效或已使用。')
        return
      }
      router.replace('/founder/mfa/enroll')
      router.refresh()
    } catch {
      setMessage('網絡錯誤。')
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
      <label className="block space-y-2 text-sm text-slate-300">
        <span>復原碼</span>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={busy}
          className="w-full rounded-lg border border-cyan-500/30 bg-[#07111f] px-3 py-3 font-mono text-sm tracking-wider text-cyan-50"
          placeholder="XXXXX-XXXXX"
        />
      </label>
      <button
        type="submit"
        disabled={busy || code.trim().length < 8}
        className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-500/90 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        {busy ? '驗證中…' : '使用復原碼'}
      </button>
      {message ? <p className="text-sm text-amber-300">{message}</p> : null}
    </form>
  )
}
