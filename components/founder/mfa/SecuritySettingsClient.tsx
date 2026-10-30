'use client'

import { useState } from 'react'
import TotpCodeInput from '@/components/founder/mfa/TotpCodeInput'

export default function SecuritySettingsClient() {
  const [confirm, setConfirm] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [codes, setCodes] = useState<string[] | null>(null)

  async function regenerate() {
    if (busy || !confirm) return
    setBusy(true)
    setMessage(null)
    setCodes(null)
    try {
      const res = await fetch('/api/founder/mfa/recovery-codes/regenerate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          confirm: true,
          code: code.length === 6 ? code : undefined,
        }),
      })
      if (res.status === 403) {
        const data = (await res.json().catch(() => null)) as { code?: string } | null
        if (data?.code === 'FOUNDER_MFA_STEP_UP') {
          setMessage('需要近期 TOTP。請輸入新嘅 6 位驗證碼後再試。')
        } else {
          setMessage('無權限。')
        }
        return
      }
      if (!res.ok) {
        setMessage(res.status === 429 ? '請稍後再試。' : '無法重新產生。')
        return
      }
      const data = (await res.json()) as { recoveryCodes?: string[] }
      setCodes(data.recoveryCodes ?? [])
      setMessage('新復原碼已產生；舊碼已全部失效。請即離線保存。')
      setCode('')
    } catch {
      setMessage('網絡錯誤。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-3">
      <h3 className="text-cyan-300">重新產生復原碼</h3>
      <p className="text-slate-400">
        會使所有舊復原碼失效。操作需確認，且可能要求新嘅 TOTP（唔接受重放已用 time step）。
      </p>
      <label className="flex items-start gap-2 text-slate-300">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          className="mt-1"
        />
        <span>我確認要作廢全部現有復原碼並產生新一組。</span>
      </label>
      <div className="max-w-xs space-y-2">
        <p className="text-xs text-slate-500">若 step-up 過期，請填新驗證碼：</p>
        <TotpCodeInput value={code} onChange={setCode} disabled={busy} />
      </div>
      <button
        type="button"
        disabled={busy || !confirm}
        onClick={() => void regenerate()}
        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 disabled:opacity-50"
      >
        {busy ? '處理中…' : '重新產生復原碼'}
      </button>
      {message ? <p className="text-sm text-amber-200">{message}</p> : null}
      {codes?.length ? (
        <ul className="grid gap-2 rounded-lg border border-cyan-500/20 bg-[#07111f] p-4 font-mono text-sm text-cyan-100 sm:grid-cols-2">
          {codes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
