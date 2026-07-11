'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthSession, authSignInGoogle } from '@/lib/auth/session'
import { useLocale } from '@/lib/i18n'
import { isLHYMSSStudent } from '@/lib/lhymss-verification'

// Teacher Radar — Phase 1b teacher surface (slate theme, NOT the vetoed neon). Bilingual
// via the existing client-side i18n (useLocale), same pattern as the rest of the app.
// Lists the signed-in teacher's own classes and creates new ones. Data states require the
// migration + an admin to have elevated this account to 'teacher'.

interface ClassRow {
  id: string
  name: string
  subject: string | null
  join_code: string
  archived?: boolean
  created_at?: string
}

type View = 'loading' | 'signin' | 'forbidden' | 'student' | 'ready' | 'error'

export default function TeacherPage() {
  const { status, user } = useAuthSession()
  const { locale } = useLocale()
  const en = locale === 'en'
  const [view, setView] = useState<View>('loading')
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/classes')
      if (res.status === 403) return setView(isLHYMSSStudent(user?.email ?? '') ? 'student' : 'forbidden')
      if (!res.ok) return setView('error')
      const data = await res.json()
      setClasses(data.classes ?? [])
      setView('ready')
    } catch {
      setView('error')
    }
  }, [user?.email])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') return setView('signin')
    void load()
  }, [status, load])

  const create = async () => {
    if (!name.trim() || creating) return
    setCreating(true)
    try {
      const res = await fetch('/api/teacher/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), subject: subject.trim() || undefined }),
      })
      if (res.ok) {
        setName('')
        setSubject('')
        await load()
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold">{en ? 'Teacher Analytics · Teacher Radar' : '老師大數據平台 · Teacher Radar'}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {en ? 'Create classes and share join codes with your students.' : '建立班別，把加入代碼分享給學生。'}
          </p>
        </header>

        {view === 'loading' && <p className="text-slate-500 text-sm">{en ? 'Loading…' : '載入中…'}</p>}

        {view === 'signin' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <p className="text-slate-300 mb-4">{en ? 'Please sign in with Google first.' : '請先用 Google 登入。'}</p>
            <button
              onClick={() => authSignInGoogle('/teacher')}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              {en ? 'Sign in with Google' : '用 Google 登入'}
            </button>
          </div>
        )}

        {view === 'forbidden' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-300 font-medium mb-1">{en ? 'This account is not a teacher' : '此帳戶未有老師權限'}</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              {en
                ? 'Teacher access is granted by an administrator (there is no self-upgrade). If you are a teacher, please contact your administrator and give the Google account you sign in with.'
                : '老師權限只可由管理員開通（不設自助升級）。如果你是老師，請聯絡管理員，並提供你登入所用的 Google 帳戶。'}
            </p>
          </div>
        )}

        {view === 'student' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3" aria-hidden>📚</div>
            <p className="text-slate-100 font-bold mb-2">{en ? 'This is the teacher area' : '這裡是老師專區'}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {en
                ? 'Your account is a student account. The teacher area is for teachers to view class data — head to the practice area to drill questions and track your own progress.'
                : '你的帳戶是學生身分。老師專區是給老師查看班級數據的，你可以到練習區操練、查看自己的進度。'}
            </p>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              {en ? 'Go to practice' : '前往練習區'}
            </Link>
          </div>
        )}

        {view === 'error' && (
          <p className="text-amber-400/90 text-sm">{en ? 'Could not load right now — please refresh.' : '暫時無法載入，請重新整理。'}</p>
        )}

        {view === 'ready' && (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
              <h2 className="text-sm font-bold text-slate-300 mb-3">{en ? 'Create a new class' : '建立新班別'}</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={en ? 'Class name (e.g. 5A Economics)' : '班別名稱（例如 5A 經濟）'}
                  maxLength={80}
                  className="flex-1 min-w-0 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500/50 focus:outline-none"
                />
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={en ? 'Subject (optional, e.g. econ)' : '科目（可選，例如 econ）'}
                  maxLength={40}
                  className="sm:w-40 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500/50 focus:outline-none"
                />
                <button
                  onClick={create}
                  disabled={!name.trim() || creating}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {creating ? (en ? 'Creating…' : '建立中…') : en ? 'Create' : '建立'}
                </button>
              </div>
            </div>

            {classes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">
                {en
                  ? 'No classes yet. Create one above, then share its join code with your students.'
                  : '還沒有班別。在上面建立一個，然後把加入代碼分享給學生。'}
              </p>
            ) : (
              <div className="space-y-3">
                {classes.map((c) => (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.subject ? c.subject : en ? 'No subject set' : '未指定科目'}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">{en ? 'Join code' : '加入代碼'}</div>
                      <div className="font-mono text-lg font-bold text-amber-400 tracking-widest">{c.join_code}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
