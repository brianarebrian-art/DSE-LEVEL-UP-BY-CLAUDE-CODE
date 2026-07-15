'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LifeBuoy, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 全站無障礙 + 情緒安全層（root layout 掛載）：
// 1. 開機套用：將 localStorage `dse_font_size`（12–24px）套落 <html> font-size，
//    並套用易讀字體 class `font-easy` —— Tailwind 文字全部 rem 基準，一改全站生效。
//    （可見開關喺 A11yPanel，全站常駐左下角；閱讀尺喺隔籬 ReadingRuler。）
// 2.「我唔開心」SOS 掣：全站常駐（/relax 內除外，嗰度已有熱線橫幅），
//    modal = 呼吸 + 呼吸空間 + 熱線。溫和脈動，respect prefers-reduced-motion。

export const FONT_KEY = 'dse_font_size'

export function applyFontSize(px: number) {
  const v = Math.min(24, Math.max(12, px))
  document.documentElement.style.fontSize = `${v}px`
  try { localStorage.setItem(FONT_KEY, String(v)) } catch { /* ignore */ }
  return v
}

export default function GlobalA11y() {
  const pathname = usePathname()
  const { locale } = useLocale()
  const en = locale === 'en'
  const [sosOpen, setSosOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(FONT_KEY))
      if (saved >= 12 && saved <= 24 && saved !== 16) document.documentElement.style.fontSize = `${saved}px`
      if (localStorage.getItem('dse_easy_font') === '1') document.documentElement.classList.add('font-easy')
    } catch { /* ignore */ }
  }, [])

  // Esc 一鍵關閉（SEN）
  useEffect(() => {
    if (!sosOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSosOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sosOpen])

  if (pathname?.startsWith('/relax')) return null // 呼吸空間內已有常駐熱線

  return (
    <>
      <button
        onClick={() => setSosOpen(true)}
        title={en ? 'Feeling down? We are here.' : '我唔開心 —— 你唔係一個人，我哋喺度。'}
        // FIX: [B8] safe-area — iPhone Home Indicator 唔會遮擋（root layout 已設 viewport-fit=cover）
        className="no-print fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 w-12 h-12 rounded-full bg-slate-900/90 border border-sky-500/40 text-sky-300 flex items-center justify-center hover:bg-sky-500/15 transition-colors animate-pulse motion-reduce:animate-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
        style={{ animationDuration: '3s' }}
        aria-label={en ? 'Emotional support' : '情緒支援'}
      >
        <LifeBuoy size={20} />
      </button>

      {sosOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSosOpen(false)}>
          {/* FIX: [C11] dialog ARIA + 打開時自動聚焦第一個按鈕（autoFocus） */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-title"
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSosOpen(false)}
              aria-label={en ? 'Close' : '關閉'}
              className="absolute top-3 right-3 min-h-11 min-w-11 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>

            <p id="sos-title" className="text-slate-100 font-bold mb-1">{en ? 'You are not alone. We are here.' : '你唔係一個人。我哋喺度。'}</p>
            {/* FIX: [A1][B5] 副標文案統一 + text-slate-500（3.6:1 ✗）→ text-slate-300（≥4.5:1 ✓） */}
            <p className="text-xs text-slate-300 mb-5">{en ? 'Pick whatever suits you right now — skip anything, no one will blame you.' : '揀選適合你現狀嘅選項，唔想做就唔做，冇人會怪你。'}</p>

            <div className="space-y-2.5 mb-5">
              <Link
                href="/relax/breathing"
                onClick={() => setSosOpen(false)}
                autoFocus
                className="block min-h-11 rounded-[10px] border border-sky-500/30 text-sky-300 text-sm px-4 py-3 hover:bg-sky-500/10 transition-colors"
              >
                🫁 {en ? 'Do a 4-7-8 breath (1 minute)' : '做個 4-7-8 呼吸（1 分鐘）'}
              </Link>
              {/* FIX: [A1][A2] 「入化城避風港唞一唞」→「去呼吸空間休息一下」 */}
              <Link
                href="/relax"
                onClick={() => setSosOpen(false)}
                className="block min-h-11 rounded-[10px] border border-slate-700 text-slate-300 text-sm px-4 py-3 hover:border-slate-500 transition-colors"
              >
                🌬️ {en ? 'Go to the Breathing Space for a rest' : '去呼吸空間休息一下'}
              </Link>
            </div>

            <div className="rounded-[10px] border border-red-500/10 bg-red-500/5 px-4 py-3 text-center">
              <p className="text-xs text-slate-300 leading-relaxed">
                {en ? 'Need to talk to someone now?' : '想搵真人傾？'}
                <br />
                {en ? 'The Samaritans 24hr:' : '撒瑪利亞會 24 小時：'}
                <a href="tel:28960000" className="text-sky-300 underline underline-offset-2 px-1">2896 0000</a>
                {' · '}{en ? 'Suicide Prevention:' : '生命熱線：'}
                <a href="tel:23820000" className="text-sky-300 underline underline-offset-2 px-1">2382 0000</a>
              </p>
              {/* FIX: [C14] 醫療免責聲明 + [B5] text-slate-600 → text-slate-400 */}
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                {en
                  ? 'This platform is not a professional medical service; the information above is for reference only. In an emergency, call 999 immediately.'
                  : '本平台非專業醫療機構，以上資訊僅供參考。緊急情況請即致電 999。'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
