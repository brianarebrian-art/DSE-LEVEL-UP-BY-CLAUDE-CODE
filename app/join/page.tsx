'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthSession, authSignInGoogle } from '@/lib/auth/session'
import { useLocale } from '@/lib/i18n'

// Teacher Radar — Phase 1b student join + consent flow (bilingual via useLocale).
// Consent is the privacy gate: only 'granted' lets the platform log per-question data and
// lets the teacher see it. Declining still lets the student practise, data stays private.

interface Joined {
  classId: string
  className: string
  subject: string | null
}

export default function JoinPage() {
  const { status } = useAuthSession()
  const { locale } = useLocale()
  const en = locale === 'en'
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
      if (res.status === 401) return setError(en ? 'Please sign in with Google before joining a class.' : '請先用 Google 登入才能加入班別。')
      if (res.status === 400) return setError(en ? 'That code is not valid (6 letters or digits).' : '代碼格式不正確（6 位英文字母或數字）。')
      if (res.status === 404) return setError(en ? 'No class found for that code — check with your teacher.' : '找不到這個班別代碼，請與老師核對。')
      if (!res.ok) return setError(en ? 'Could not join right now — please try again.' : '暫時無法加入，請再試一次。')
      const data = await res.json()
      setJoined({ classId: data.classId, className: data.className, subject: data.subject })
    } catch {
      setError(en ? 'Could not join right now — please try again.' : '暫時無法加入，請再試一次。')
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
        <h1 className="text-2xl font-extrabold mb-2 text-center">{en ? 'Join a class' : '加入班別'}</h1>

        {decision ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3" aria-hidden>{decision === 'granted' ? '✅' : '🔒'}</div>
            <p className="text-slate-100 font-bold mb-2">
              {decision === 'granted'
                ? en ? 'Joined, and sharing your data' : '已加入，並同意分享數據'
                : en ? 'Joined (your data stays private)' : '已加入（數據保持私人）'}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {decision === 'granted'
                ? en
                  ? `Your practice data in "${joined?.className}" will be visible to this teacher, for lesson planning and follow-up. You can change this anytime.`
                  : `你在「${joined?.className}」的練習數據會讓這位老師查看，用於備課與跟進。你隨時可以更改。`
                : en
                  ? 'You can still practise normally — the teacher will not see your personal data. You can change this anytime.'
                  : '你仍可正常練習，老師不會看到你的個人數據。你隨時可以更改。'}
            </p>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              {en ? 'Start practising' : '開始練習'}
            </Link>
          </div>
        ) : joined ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-300 mb-1">{en ? 'You are joining' : '你正在加入'}</p>
            <p className="text-lg font-bold mb-4">{joined.className}{joined.subject ? ` · ${joined.subject}` : ''}</p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5 text-sm text-slate-400 leading-relaxed">
              <p className="mb-2 text-slate-300 font-medium">{en ? 'About data sharing (your choice)' : '關於數據分享（由你決定）'}</p>
              {en
                ? 'If you agree, your practice data (whether each question is right or wrong, the topic, and the error cause you pick yourself) becomes visible to this teacher for lesson planning and follow-up. If you decline, you can still practise and the teacher will not see your data — you can change this anytime.'
                : '如果你「同意」，你的練習數據（每題答對或答錯、課題、你自己選的錯因）才會讓這位老師查看，用於備課與跟進。如果你「暫時不同意」，你仍可練習，老師不會看到你的數據，日後隨時可以更改。'}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => decide('granted')}
                disabled={busy}
                className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-40"
              >
                {en ? 'I agree to share' : '我同意分享'}
              </button>
              <button
                onClick={() => decide('declined')}
                disabled={busy}
                className="block w-full border border-slate-700 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-40"
              >
                {en ? 'Not for now' : '暫時不同意'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400 mb-4 text-center">
              {en ? 'Enter the 6-character code your teacher gave you.' : '輸入老師給你的 6 位加入代碼。'}
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === 'Enter') void join() }}
              placeholder={en ? 'e.g. A3XK9P' : '例如 A3XK9P'}
              maxLength={6}
              aria-label={en ? 'Class join code' : '班別加入代碼'}
              className="w-full px-4 py-3 mb-3 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono text-2xl tracking-[0.4em] text-slate-100 placeholder-slate-700 focus:border-amber-500/50 focus:outline-none"
            />
            {error && <p className="text-amber-400/90 text-sm mb-3 text-center">{error}</p>}
            {status === 'unauthenticated' ? (
              <button
                onClick={() => authSignInGoogle('/join')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-xl transition-all"
              >
                {en ? 'Sign in with Google' : '用 Google 登入'}
              </button>
            ) : (
              <button
                onClick={join}
                disabled={code.trim().length !== 6 || busy}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busy ? (en ? 'Joining…' : '加入中…') : en ? 'Join' : '加入'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
