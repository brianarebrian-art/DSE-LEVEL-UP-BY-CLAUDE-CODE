'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isNotTonight } from '@/lib/notTonight'
import { useLocale } from '@/lib/i18n'

// NTM 溫柔二次確認（Emma/UDL 決策 2026-07-16：❌ 真・鎖，✅ 增加摩擦）。
// 開咗「今晚唔溫得」仍然入 /practice → 彈一次溫馨確認，零強制零封鎖：
// 「我知，繼續溫」直接放行（尊重考生自主權），「唞一唞」去呼吸空間。
// 確認前唔 render 題目（session 計時器唔會喺對話框背後偷偷行）。

export default function NotTonightGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { locale } = useLocale()
  const en = locale === 'en'
  // null = 未讀取（SSR 安全）；true = 要問；false = 放行
  const [asking, setAsking] = useState<boolean | null>(null)

  useEffect(() => {
    setAsking(isNotTonight())
  }, [])

  if (asking === null) return <div className="min-h-[40vh]" /> // client-only 讀取前唔閃題目

  if (asking) {
    const hhmm = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ntm-gate-title"
          className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-3" aria-hidden>🌙</div>
          <h1 id="ntm-gate-title" className="text-lg font-bold text-slate-100 mb-2">
            {en ? 'Not-tonight mode is on' : '你開咗「今晚唔溫得」'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            {en
              ? `It's ${hhmm} — your body needs rest. Sure you want to keep going?`
              : `而家係 ${hhmm}，身體需要休息。確定要繼續？`}
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => router.push('/relax')}
              autoFocus
              className="w-full min-h-11 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
            >
              {en ? 'Take a break — see you tomorrow' : '唞一唞，聽日再戰'}
            </button>
            <button
              onClick={() => setAsking(false)}
              className="w-full min-h-11 border border-slate-700 text-slate-300 hover:text-slate-100 rounded-xl px-4 py-3 text-sm transition-all"
            >
              {en ? 'I know — keep going' : '我知，繼續溫'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
