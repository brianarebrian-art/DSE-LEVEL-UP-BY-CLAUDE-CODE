'use client'

import { useEffect, useState } from 'react'
import { CloudFog, Type, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import BreathingExercise from '@/components/BreathingExercise'

// 練習頁支援小隊（Yuna/Sarah/Emma）：
// 1. 「唞一唞」恐慌按鈕 —— 隨時打開 4-7-8 呼吸練習 overlay（唔影響 60 秒鎖）
// 2. 「易讀字體」—— 切換為 BDA（英國讀寫障礙協會）風格指引推薦嘅系統無襯線
//    字體堆疊（Verdana/Tahoma 等），零下載、零 CSP 例外；設定存 localStorage。
// 位置：bottom-16 left-4，疊喺閱讀尺開關上方，組成無障礙工具角。

const FONT_KEY = 'dse_easy_font'

export default function PracticeSupport() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [breathing, setBreathing] = useState(false)
  const [easyFont, setEasyFont] = useState(false)

  useEffect(() => {
    try {
      const on = localStorage.getItem(FONT_KEY) === '1'
      setEasyFont(on)
      document.documentElement.classList.toggle('font-easy', on)
    } catch { /* ignore */ }
  }, [])

  const toggleFont = () => {
    setEasyFont((v) => {
      const next = !v
      try { localStorage.setItem(FONT_KEY, next ? '1' : '0') } catch { /* ignore */ }
      document.documentElement.classList.toggle('font-easy', next)
      return next
    })
  }

  return (
    <>
      <div className="fixed bottom-16 left-4 z-50 no-print flex flex-col items-start gap-2">
        <button
          onClick={toggleFont}
          aria-pressed={easyFont}
          title={en ? 'Dyslexia-friendly font (BDA-style system stack)' : '易讀字體（讀寫障礙友善）'}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-all ${
            easyFont
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Type size={13} /> {en ? 'Easy font' : '易讀字體'}
        </button>
        <button
          onClick={() => setBreathing(true)}
          title={en ? 'Feeling overwhelmed? Take a breather.' : '邊題卡住、心跳加速？唞一唞先。'}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border bg-slate-900/80 border-slate-700 text-slate-500 hover:text-sky-300 hover:border-sky-500/40 transition-all"
        >
          <CloudFog size={13} /> {en ? 'Breathe' : '唞一唞'}
        </button>
      </div>

      {breathing && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md relative">
            <button
              onClick={() => setBreathing(false)}
              aria-label={en ? 'Close' : '關閉'}
              className="absolute -top-3 -right-3 z-10 bg-slate-800 border border-slate-600 text-slate-300 hover:text-white rounded-full p-2 transition-all"
            >
              <X size={16} />
            </button>
            <BreathingExercise />
          </div>
        </div>
      )}
    </>
  )
}
