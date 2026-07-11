'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CloudFog, Moon, Type, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import BreathingExercise from '@/components/BreathingExercise'
import { applyFontSize, FONT_KEY } from '@/components/GlobalA11y'
import { getReverseLog } from '@/lib/reverseLog'

// 練習頁支援小隊（Yuna/Sarah/Emma/Leo）：
// 1. 「唞一唞」—— 隨時打開 4-7-8 呼吸 overlay（唔影響 60 秒鎖）
// 2. 「易讀字體」—— BDA 風格指引推薦嘅系統無襯線堆疊（零下載）
// 3. F10 字級調節 —— 12–24px，經 <html> font-size 全站生效（rem 基準）
// 4. F09 「今日夠了」—— 零罪疚收工：溫柔提示 + 輕柔和音 + 返 dashboard
// 位置：bottom-16 left-4（閱讀尺開關上方），組成無障礙工具角。

const EASY_FONT_KEY = 'dse_easy_font'

// F09 輕柔和音：C5 正弦 0.5 秒淡入再自然衰減（程序生成，無檔案，無突發聲）
function playSoftChime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 523.25
    const t = ctx.currentTime
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.06, t + 0.5)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(t + 2)
    setTimeout(() => void ctx.close(), 2200)
  } catch { /* 冇聲都唔阻收工 */ }
}

export default function PracticeSupport() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [breathing, setBreathing] = useState(false)
  const [easyFont, setEasyFont] = useState(false)
  const [fontPx, setFontPx] = useState(16)
  const [fontPanel, setFontPanel] = useState(false)
  const [doneToday, setDoneToday] = useState(false)
  const [blindSpotsToday, setBlindSpotsToday] = useState(0)

  useEffect(() => {
    try {
      setEasyFont(localStorage.getItem(EASY_FONT_KEY) === '1')
      const saved = Number(localStorage.getItem(FONT_KEY))
      if (saved >= 12 && saved <= 24) setFontPx(saved)
    } catch { /* ignore */ }
  }, [])

  const toggleFont = () => {
    setEasyFont((v) => {
      const next = !v
      try { localStorage.setItem(EASY_FONT_KEY, next ? '1' : '0') } catch { /* ignore */ }
      document.documentElement.classList.toggle('font-easy', next)
      return next
    })
  }

  const setSize = (px: number) => setFontPx(applyFontSize(px))

  const enoughForToday = () => {
    // 今日發現嘅盲點數（逆向錯因日誌，本地）—— 只講收穫，唔講「仲有幾多未做」
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    setBlindSpotsToday(getReverseLog().filter((e) => e.ts >= start.getTime()).length)
    playSoftChime()
    setDoneToday(true)
  }

  return (
    <>
      <div className="fixed bottom-16 left-4 z-50 no-print flex flex-col items-start gap-2">
        <button
          onClick={() => { setFontPanel((v) => !v) }}
          aria-expanded={fontPanel}
          title={en ? 'Font size' : '字級調節（12–24px，全站生效）'}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border bg-slate-900/80 border-slate-700 text-slate-500 hover:text-slate-300 transition-all"
        >
          <span className="text-[10px]" aria-hidden>A</span><span aria-hidden>A</span> {en ? 'Size' : '字級'}
        </button>
        {fontPanel && (
          <div className="flex items-center gap-2 bg-slate-900/95 border border-slate-700 rounded-full px-3 py-2">
            <button onClick={() => setSize(fontPx - 2)} disabled={fontPx <= 12} className="min-w-8 min-h-8 text-slate-300 disabled:text-slate-700 text-sm" aria-label={en ? 'Smaller' : '縮細'}>−</button>
            <input
              type="range" min={12} max={24} step={1} value={fontPx}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-24 accent-sky-400"
              aria-label={en ? 'Font size' : '字級'}
            />
            <button onClick={() => setSize(fontPx + 2)} disabled={fontPx >= 24} className="min-w-8 min-h-8 text-slate-300 disabled:text-slate-700 text-sm" aria-label={en ? 'Larger' : '放大'}>＋</button>
            <span className="text-[10px] text-slate-500 w-9">{fontPx}px</span>
          </div>
        )}
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
        <button
          onClick={enoughForToday}
          title={en ? 'Done for today — no guilt, see you tomorrow.' : '今日夠了 —— 收工冇罪疚，聽日再戰。'}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border bg-slate-900/80 border-slate-700 text-slate-500 hover:text-amber-300 hover:border-amber-500/40 transition-all"
        >
          <Moon size={13} /> {en ? 'Enough today' : '今日夠了'}
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

      {/* F09 今日夠了 —— 零罪疚、零「你仲有 X 題未做」 */}
      {doneToday && (
        <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3" aria-hidden>🌙</div>
            <p className="text-slate-100 font-bold mb-2">{en ? 'You did enough today.' : '你已經好叻，聽日再戰。'}</p>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              {blindSpotsToday > 0
                ? en
                  ? `You uncovered ${blindSpotsToday} blind spot${blindSpotsToday > 1 ? 's' : ''} today — each one is a mark saved in the exam.`
                  : `今日發現咗 ${blindSpotsToday} 個盲點 —— 每一個都係考場慳返嘅分。`
                : en
                  ? 'Rest is part of the plan. See you tomorrow.'
                  : '休息一下係為咗行更遠嘅路。聽日見。'}
            </p>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block min-h-11 rounded-[10px] bg-amber-500/15 border border-amber-500/40 text-amber-300 text-sm px-4 py-3 hover:bg-amber-500/25 transition-colors"
              >
                {en ? 'Back to dashboard' : '返回我的進度'}
              </Link>
              <button
                onClick={() => setDoneToday(false)}
                className="block w-full min-h-11 rounded-[10px] border border-slate-700 text-slate-400 text-sm px-4 py-3 hover:text-slate-200 transition-colors"
              >
                {en ? 'Actually, one more' : '諗返轉頭，再做多陣'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
