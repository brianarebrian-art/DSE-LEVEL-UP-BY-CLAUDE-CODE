'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthSession, authSignInGoogle } from '@/lib/auth/session'

// Teacher Radar — Phase 1b student join + consent flow. A student enters the code their
// teacher gave them, then makes an explicit, plain-language consent decision. Consent is
// the privacy gate: only 'granted' lets the platform log their per-question data and lets
// the teacher see it. Declining still lets them practise — their data just stays private.

interface Joined {
  classId: string
  className: string
  subject: string | null
}

export default function JoinPage() {
  const { status } = useAuthSession()
  const [code, setCode] = useState('')
  const [joined, setJoined] = useState<Joined | null>(null)
  const [decision, setDecision] = useState<'granted' | 'declined' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const join = async () => {
    setError(null)
    setBusy(true)
    try {
      const res = await fetch('/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode: code.trim().toUpperCase() }),
      })
      if (res.status === 401) return setError('請先用 Google 登入先可以加入班別。')
      if (res.status === 400) return setError('代碼格式唔啱（6 位英文字母或數字）。')
      if (res.status === 404) return setError('搵唔到呢個班別代碼，同老師核對下。')
      if (!res.ok) return setError('暫時加入唔到，請再試。')
      const data = await res.json()
      setJoined({ classId: data.classId, className: data.className, subject: data.subject })
    } catch {
      setError('暫時加入唔到，請再試。')
    } finally {
      setBusy(false)
    }
  }

  const decide = async (consent: 'granted' | 'declined') => {
    if (!joined || busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/enrollment/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: joined.classId, consent }),
      })
      if (res.ok) setDecision(consent)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-extrabold mb-2 text-center">加入班別</h1>

        {/* Step 3: done */}
        {decision ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3" aria-hidden>{decision === 'granted' ? '✅' : '🔒'}</div>
            <p className="text-slate-100 font-bold mb-2">
              {decision === 'granted' ? '已加入，並同意分享數據' : '已加入（數據保持私人）'}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {decision === 'granted'
                ? `你喺「${joined?.className}」嘅練習數據會俾呢班老師睇到，用嚟備課同跟進。你隨時可以改返。`
                : `你照樣可以正常練習，老師唔會見到你嘅個人數據。你之後想分享隨時可以改返。`}
            </p>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              開始練習
            </Link>
          </div>
        ) : joined ? (
          /* Step 2: consent */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-300 mb-1">你正加入</p>
            <p className="text-lg font-bold mb-4">{joined.className}{joined.subject ? ` · ${joined.subject}` : ''}</p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5 text-sm text-slate-400 leading-relaxed">
              <p className="mb-2 text-slate-300 font-medium">關於數據分享（請你自己決定）</p>
              如果你「同意」，你嘅練習數據（每題答啱定答錯、課題、你自己揀嘅錯因）先會俾呢班老師睇到，
              用嚟備課同跟進。如果你「暫時唔同意」，你照樣可以練習，老師唔會見到你嘅數據 —— 之後隨時可以改。
            </div>
            <div className="space-y-2">
              <button
                onClick={() => decide('granted')}
                disabled={busy}
                className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-40"
              >
                我同意分享
              </button>
              <button
                onClick={() => decide('declined')}
                disabled={busy}
                className="block w-full border border-slate-700 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-40"
              >
                暫時唔同意
              </button>
            </div>
          </div>
        ) : (
          /* Step 1: enter code */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400 mb-4 text-center">輸入老師俾你嘅 6 位加入代碼。</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === 'Enter') void join() }}
              placeholder="例如 A3XK9P"
              maxLength={6}
              aria-label="班別加入代碼"
              className="w-full px-4 py-3 mb-3 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono text-2xl tracking-[0.4em] text-slate-100 placeholder-slate-700 focus:border-amber-500/50 focus:outline-none"
            />
            {error && <p className="text-amber-400/90 text-sm mb-3 text-center">{error}</p>}
            {status === 'unauthenticated' ? (
              <button
                onClick={() => authSignInGoogle('/join')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-xl transition-all"
              >
                用 Google 登入
              </button>
            ) : (
              <button
                onClick={join}
                disabled={code.trim().length !== 6 || busy}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busy ? '加入中…' : '加入'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
