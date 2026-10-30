'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TotpCodeInput from '@/components/founder/mfa/TotpCodeInput'
import MfaQrPanel from '@/components/founder/mfa/MfaQrPanel'

type EnrollStart = {
  factorId: string
  secret: string
  uri: string
  qrSvg: string
  account: string
  issuer: string
}

export default function MfaEnrollForm({ viaRecovery }: { viaRecovery: boolean }) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [pending, setPending] = useState<EnrollStart | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  async function start() {
    if (busy) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/founder/mfa/enroll/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(viaRecovery ? {} : { enrollmentToken: token.trim() }),
      })
      if (res.status === 429) {
        setMessage('操作太頻密，請稍後再試。')
        return
      }
      if (res.status === 403) {
        const data = (await res.json().catch(() => null)) as { code?: string } | null
        if (data?.code === 'FOUNDER_MFA_STEP_UP') {
          setMessage('需要近期 Google 重新登入。')
        } else {
          setMessage('無法開始綁定。請檢查 enrollment token 或復原狀態。')
        }
        return
      }
      if (!res.ok) {
        setMessage('無法開始綁定。')
        return
      }
      const data = (await res.json()) as EnrollStart
      setPending(data)
    } catch {
      setMessage('網絡錯誤。')
    } finally {
      setBusy(false)
    }
  }

  async function confirm() {
    if (busy || !pending || code.length !== 6) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/founder/mfa/enroll/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          factorId: pending.factorId,
          code,
          enrollmentToken: viaRecovery ? undefined : token.trim(),
        }),
      })
      if (!res.ok) {
        setMessage(res.status === 429 ? '請稍後再試。' : '驗證碼不正確或 token 已失效。')
        return
      }
      const data = (await res.json()) as { recoveryCodes?: string[] }
      sessionStorage.setItem('fos_recovery_codes_once', JSON.stringify(data.recoveryCodes ?? []))
      router.replace('/founder/mfa/recovery-codes')
      router.refresh()
    } catch {
      setMessage('網絡錯誤。')
    } finally {
      setBusy(false)
    }
  }

  if (!pending) {
    return (
      <div className="space-y-4">
        {!viaRecovery ? (
          <label className="block space-y-2 text-sm text-slate-300">
            <span>Enrollment token（由部署環境安全取得，唔會出現喺 Git）</span>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={busy}
              className="w-full rounded-lg border border-cyan-500/30 bg-[#07111f] px-3 py-2 font-mono text-sm text-cyan-50"
              placeholder="64 字元 hex"
            />
          </label>
        ) : null}
        <button
          type="button"
          disabled={busy || (!viaRecovery && token.trim().length < 64)}
          onClick={() => void start()}
          className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-500/90 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {busy ? '準備中…' : '產生綁定 QR'}
        </button>
        {message ? <p className="text-sm text-amber-300">{message}</p> : null}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <MfaQrPanel qrSvg={pending.qrSvg} issuer={pending.issuer} account={pending.account} />
      <div className="space-y-2">
        <button
          type="button"
          className="text-xs text-cyan-300 underline"
          onClick={() => setShowSecret((v) => !v)}
        >
          {showSecret ? '隱藏手動密鑰' : '無法掃碼？顯示手動密鑰'}
        </button>
        {showSecret ? (
          <p className="break-all rounded-lg border border-cyan-500/20 bg-[#07111f] p-3 font-mono text-xs text-cyan-100">
            {pending.secret}
          </p>
        ) : null}
      </div>
      <div className="space-y-3">
        <p className="text-sm text-slate-400">掃碼後輸入應用程式顯示嘅 6 位驗證碼以啟用 MFA。</p>
        <TotpCodeInput value={code} onChange={setCode} disabled={busy} autoFocus />
        <button
          type="button"
          disabled={busy || code.length !== 6}
          onClick={() => void confirm()}
          className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-500/90 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {busy ? '啟用中…' : '驗證並啟用'}
        </button>
      </div>
      {message ? <p className="text-sm text-amber-300">{message}</p> : null}
    </div>
  )
}
