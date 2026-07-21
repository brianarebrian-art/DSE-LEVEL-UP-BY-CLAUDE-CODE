'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AlignJustify, Clock, Minus, MoveHorizontal, Plus, Type, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import OfflineBadge from '@/components/OfflineBadge'
import {
  applyFontSize,
  applyTextSpacing,
  FONT_KEY,
  LINE_HEIGHT_KEY,
  LETTER_SPACING_KEY,
  DEFAULT_LINE_HEIGHT,
  type LetterSpacing,
} from '@/components/GlobalA11y'

const LETTER_SPACING_PREVIEW: Record<LetterSpacing, string> = {
  normal: 'normal',
  wide: '0.05em',
  'extra-wide': '0.1em',
}

// 全站無障礙控制面板（Leo/前端 + Emma/UDL — SEN 支援）。
// 補回一直缺失嘅「可見開關」：GlobalA11y 只喺開機時套用已存嘅字級／易讀字體，
// 但除咗練習頁外，全站根本冇 UI 畀學生自己調校。呢個常駐掣令每一頁都可以：
//   • 放大／縮細字級（12–24px，即時生效，重用 GlobalA11y 匯出嘅 applyFontSize，存 dse_font_size）
//   • 一撳切換易讀字體（BDA 友善無襯線堆疊，存 dse_easy_font，即時切換 html.font-easy）
// 純前端、零成本、零新依賴。防跳行閱讀尺喺左下另一顆 📏 掣（ReadingRuler，全站掛載）。

const EASY_KEY = 'dse_easy_font'
const HIDE_TIMER_KEY = 'dse_hide_timer'
const RULER_KEY = 'dse_reading_ruler' // 同 ReadingRuler.tsx 共用
const MIN = 12
const MAX = 24
const STEP = 2

export default function A11yPanel() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(16)
  const [easy, setEasy] = useState(false)
  const [hideTimer, setHideTimer] = useState(false)
  const [ruler, setRuler] = useState(false)
  // B1（2026-07-22）：行距／字間距，同字級一樣即時生效 + 存 localStorage
  const [lineH, setLineH] = useState(DEFAULT_LINE_HEIGHT)
  const [letterSp, setLetterSp] = useState<LetterSpacing>('normal')

  // 讀返裝置上已存嘅設定（client-only，避免 hydration mismatch）
  useEffect(() => {
    try {
      const s = Number(localStorage.getItem(FONT_KEY))
      if (s >= MIN && s <= MAX) setSize(s)
      setEasy(localStorage.getItem(EASY_KEY) === '1')
      setHideTimer(localStorage.getItem(HIDE_TIMER_KEY) === '1')
      const r = JSON.parse(localStorage.getItem(RULER_KEY) ?? 'null')
      setRuler(!!r?.on)
      const lh = Number(localStorage.getItem(LINE_HEIGHT_KEY))
      if (lh >= 1.2 && lh <= 2) setLineH(lh)
      const ls = localStorage.getItem(LETTER_SPACING_KEY)
      if (ls === 'normal' || ls === 'wide' || ls === 'extra-wide') setLetterSp(ls)
    } catch {
      /* ignore */
    }
  }, [])

  // 閱讀尺自己顆 📏 掣改狀態時會廣播 dse-a11y；收到就重讀 storage，
  // 令「一鍵舒適模式」嘅開／關顯示永遠反映真實狀態
  useEffect(() => {
    const sync = () => {
      try {
        setEasy(localStorage.getItem(EASY_KEY) === '1')
        setHideTimer(localStorage.getItem(HIDE_TIMER_KEY) === '1')
        const r = JSON.parse(localStorage.getItem(RULER_KEY) ?? 'null')
        setRuler(!!r?.on)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('dse-a11y', sync)
    return () => window.removeEventListener('dse-a11y', sync)
  }, [])

  // Esc 一鍵關閉（SEN／鍵盤使用者）
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const setFont = useCallback((next: number) => {
    const v = applyFontSize(next) // clamps 12–24、設 <html> font-size、寫入 localStorage
    setSize(v)
  }, [])

  const toggleEasy = useCallback(() => {
    setEasy((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('font-easy', next)
      try {
        localStorage.setItem(EASY_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const toggleTimer = useCallback(() => {
    setHideTimer((prev) => {
      const next = !prev
      try {
        localStorage.setItem(HIDE_TIMER_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      // 通知已開住嘅練習頁即時套用（PracticeSession 監聽 dse-a11y）
      window.dispatchEvent(new Event('dse-a11y'))
      return next
    })
  }, [])

  // 一鍵舒適模式：三項支援（易讀字體＋閱讀尺＋隱藏計時器）一掣齊開／齊關。
  // 無痕設計（Emma/UDL）：UI 只描述功能，唔出任何診斷標籤字眼。
  // 狀態由三個子開關推導 —— 學生逐個微調後，總掣自動反映真實組合。
  const comfortOn = easy && hideTimer && ruler
  const toggleComfort = useCallback(() => {
    const next = !(easy && hideTimer && ruler)
    document.documentElement.classList.toggle('font-easy', next)
    try {
      localStorage.setItem(EASY_KEY, next ? '1' : '0')
      localStorage.setItem(HIDE_TIMER_KEY, next ? '1' : '0')
      const saved = JSON.parse(localStorage.getItem(RULER_KEY) ?? 'null')
      // 保留學生揀開嘅尺帶高度，只改 on/off
      localStorage.setItem(RULER_KEY, JSON.stringify({ on: next, hIdx: Number(saved?.hIdx) || 0 }))
    } catch {
      /* ignore */
    }
    setEasy(next)
    setHideTimer(next)
    setRuler(next)
    // ReadingRuler 同 PracticeSession 都聽 dse-a11y，即時生效
    window.dispatchEvent(new Event('dse-a11y'))
  }, [easy, hideTimer, ruler])

  return (
    <>
      {/* FIX: [C12] button 明確 aria-label（img alt 改為裝飾性，避免重複朗讀）
          FIX: [B8] bottom-4 → safe-area max()，iPhone Home Indicator 唔遮擋 */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={en ? 'Open accessibility menu' : '開啟無障礙功能選單'}
        title={en ? 'Accessibility · text size & easy-read font' : '無障礙 · 字級同易讀字體'}
        className="no-print fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 min-h-12 min-w-12 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
      >
        {/* 通用無障礙圖標（/public/icons，向量重繪自用戶提供嘅參考圖 —— 原檔係實色底
            OG 圖，SVG 重繪先有真透明背景）。無障礙名稱由 button aria-label 提供。
            unoptimized：SVG 不經 next 優化器。 */}
        <Image src="/icons/accessibility.svg" alt="" aria-hidden width={26} height={26} className="object-contain" unoptimized />
      </button>

      {open && (
        <div
          className="no-print fixed bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.5rem))] left-4 z-50 w-72 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl"
          role="dialog"
          aria-label={en ? 'Accessibility options' : '無障礙設定'}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
              <Image src="/icons/accessibility.svg" alt="" aria-hidden width={20} height={20} className="object-contain" unoptimized />
              {en ? 'Accessibility' : '無障礙設定'}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={en ? 'Close' : '關閉'}
              className="min-h-11 min-w-11 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors -mr-2 -mt-2"
            >
              <X size={16} />
            </button>
          </div>

          {/* 一鍵舒適模式（總掣）：易讀字體＋閱讀尺＋隱藏計時器一次過開 */}
          <button
            onClick={toggleComfort}
            aria-pressed={comfortOn}
            className={`w-full min-h-11 mb-4 flex items-center justify-between rounded-xl border px-4 py-2.5 transition-colors ${
              comfortOn
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="text-left">
              <span className="block text-sm font-bold">✨ {en ? 'Comfort mode (one tap)' : '一鍵舒適模式'}</span>
              <span className="block text-[11px] text-slate-500">
                {en ? 'Easy font + reading ruler + timer off' : '易讀字體＋閱讀尺＋隱藏計時器'}
              </span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                comfortOn ? 'bg-cyan-400 text-black' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {comfortOn ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          {/* 字級 A− / A+ */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Type size={13} /> {en ? 'Text size' : '字級大細'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFont(size - STEP)}
                disabled={size <= MIN}
                aria-label={en ? 'Smaller text' : '縮細字'}
                className="min-h-11 flex-1 flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={15} />
                <span className="text-sm ml-1">A</span>
              </button>
              <span className="tabular-nums text-sm text-slate-300 w-14 text-center shrink-0">{size}px</span>
              <button
                onClick={() => setFont(size + STEP)}
                disabled={size >= MAX}
                aria-label={en ? 'Larger text' : '放大字'}
                className="min-h-11 flex-1 flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={15} />
                <span className="text-base ml-1">A</span>
              </button>
            </div>
          </div>

          {/* B1 行距（1.2–2.0，每 0.1 一級） */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <AlignJustify size={13} /> {en ? 'Line spacing' : '行距'}
              </span>
              <span className="tabular-nums text-slate-300">{lineH.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={1.2}
              max={2}
              step={0.1}
              value={lineH}
              onChange={(e) => {
                const v = Number(e.target.value)
                setLineH(v)
                applyTextSpacing(v, letterSp)
              }}
              aria-label={en ? 'Line spacing' : '行距'}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* B1 字間距（三檔） */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <MoveHorizontal size={13} /> {en ? 'Letter spacing' : '字間距'}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['normal', 'wide', 'extra-wide'] as LetterSpacing[]).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setLetterSp(v)
                    applyTextSpacing(lineH, v)
                  }}
                  aria-pressed={letterSp === v}
                  className={`min-h-11 rounded-xl border text-xs transition-colors ${
                    letterSp === v
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {v === 'normal'
                    ? en ? 'Normal' : '正常'
                    : v === 'wide'
                      ? en ? 'Wide' : '闊'
                      : en ? 'Extra' : '最闊'}
                </button>
              ))}
            </div>
          </div>

          {/* B1 即時預覽：拖動滑桿時即刻見到疏密度，唔使閂 panel 去試 */}
          <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800/60 p-3">
            <div className="text-[11px] text-slate-500 mb-1">{en ? 'Preview' : '即時預覽'}</div>
            <p
              className="text-sm text-slate-200"
              style={{ lineHeight: lineH, letterSpacing: LETTER_SPACING_PREVIEW[letterSp] }}
            >
              {en
                ? 'When price rises, the quantity supplied rises too. Read these two lines and see whether the spacing feels comfortable to you.'
                : '價格上升，供應量亦隨之上升。讀一讀呢兩行字，睇下而家嘅疏密度你自己舒唔舒服。'}
            </p>
          </div>

          {/* 易讀字體開關 */}
          <button
            onClick={toggleEasy}
            aria-pressed={easy}
            className={`w-full min-h-11 flex items-center justify-between rounded-xl border px-4 py-2 transition-colors ${
              easy
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="text-left">
              <span className="block text-sm">{en ? 'Easy-read font' : '易讀字體'}</span>
              <span className="block text-[11px] text-slate-500">{en ? 'Dyslexia-friendly' : '讀寫障礙友善'}</span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                easy ? 'bg-amber-400 text-black' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {easy ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          {/* 隱藏練習計時器（焦慮友善 — SEN） */}
          <button
            onClick={toggleTimer}
            aria-pressed={hideTimer}
            className={`w-full min-h-11 mt-2.5 flex items-center justify-between rounded-xl border px-4 py-2 transition-colors ${
              hideTimer
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="text-left flex items-center gap-2">
              <Clock size={14} className="shrink-0" />
              <span>
                <span className="block text-sm">{en ? 'Hide practice timer' : '隱藏練習計時器'}</span>
                <span className="block text-[11px] text-slate-500">{en ? 'Less time pressure' : '減低時間壓力'}</span>
              </span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                hideTimer ? 'bg-amber-400 text-black' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {hideTimer ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
            {en
              ? 'Reading ruler is the 📏 button next to this one.'
              : '防跳行閱讀尺喺隔籬顆 📏 掣。'}
          </p>
          {/* v8 UI1：溫和同步狀態。放喺設定區底部，唔會喺做題途中彈出打斷心流。 */}
          <div className="mt-2">
            <OfflineBadge />
          </div>
        </div>
      )}
    </>
  )
}
