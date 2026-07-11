'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthSession, authSignInGoogle } from '@/lib/auth/session'

// Account settings — currently the PDPO one-click erasure. Deletes the user's server-side
// data (cloud progress + any Teacher Radar rows) and clears local data. Standard written
// Chinese, larger text for readability.
export default function AccountPage() {
  const { status } = useAuthSession()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const del = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      })
      if (!res.ok) {
        setError('刪除時發生問題，請稍後再試。')
        return
      }
      try { localStorage.clear() } catch { /* ignore */ }
      setDone(true)
    } catch {
      setError('刪除時發生問題，請稍後再試。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold mb-6">帳戶設定</h1>

        {done ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3" aria-hidden>🧹</div>
            <p className="text-slate-100 font-bold mb-2">已刪除你的資料</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              你的雲端進度、班級與相關記錄已經清除，本機資料亦已清空。
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all">
              返回首頁
            </Link>
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <p className="text-slate-300 mb-4">請先登入，才能管理你的帳戶資料。</p>
            <button
              onClick={() => authSignInGoogle('/account')}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              用 Google 登入
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-100 mb-2">刪除我的資料</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              此操作會永久刪除你儲存在雲端的學習進度，以及（如有）你的班級、加入記錄和練習數據。
              本機瀏覽器的資料亦會一併清除。此操作無法復原。
            </p>
            {error && <p className="text-amber-400/90 text-sm mb-3">{error}</p>}
            {confirming ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-300">確定要永久刪除嗎？</span>
                <button
                  onClick={del}
                  disabled={busy}
                  className="bg-red-500/90 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {busy ? '刪除中…' : '確定刪除'}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  className="text-slate-400 hover:text-slate-200 text-sm"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="border border-red-500/40 text-red-300 hover:bg-red-500/10 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                刪除我的資料
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
