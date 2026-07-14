'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Minus, Plus, Type, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { applyFontSize, FONT_KEY } from '@/components/GlobalA11y'

// 全站無障礙控制面板（Leo/前端 + Emma/UDL — SEN 支援）。
// 補回一直缺失嘅「可見開關」：GlobalA11y 只喺開機時套用已存嘅字級／易讀字體，
// 但除咗練習頁外，全站根本冇 UI 畀學生自己調校。呢個常駐掣令每一頁都可以：
//   • 放大／縮細字級（12–24px，即時生效，重用 GlobalA11y 匯出嘅 applyFontSize，存 dse_font_size）
//   • 一撳切換易讀字體（BDA 友善無襯線堆疊，存 dse_easy_font，即時切換 html.font-easy）
// 純前端、零成本、零新依賴。防跳行閱讀尺喺左下另一顆 📏 掣（ReadingRuler，全站掛載）。

const EASY_KEY = 'dse_easy_font'
const HIDE_TIMER_KEY = 'dse_hide_timer'
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

  // 讀返裝置上已存嘅設定（client-only，避免 hydration mismatch）
  useEffect(() => {
    try {
      const s = Number(localStorage.getItem(FONT_KEY))
      if (s >= MIN && s <= MAX) setSize(s)
      setEasy(localStorage.getItem(EASY_KEY) === '1')
      setHideTimer(localStorage.getItem(HIDE_TIMER_KEY) === '1')
    } catch {
      /* ignore */
    }
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

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title={en ? 'Accessibility · text size & easy-read font' : '無障礙 · 字級同易讀字體'}
        className="no-print fixed bottom-4 left-4 z-50 min-h-12 min-w-12 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
      >
        {/* 通用無障礙圖標（/public/icons，向量重繪自用戶提供嘅參考圖 —— 原檔係實色底
            OG 圖，SVG 重繪先有真透明背景）。alt 係呢個掣嘅無障礙名稱（button 冇另設
            aria-label，避免螢幕閱讀器重複讀兩次）。unoptimized：SVG 不經 next 優化器。 */}
        <Image src="/icons/accessibility.svg" alt={en ? 'Accessibility settings' : '無障礙設定'} width={26} height={26} className="object-contain" unoptimized />
      </button>

      {open && (
        <div
          className="no-print fixed bottom-[4.5rem] left-4 z-50 w-72 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl"
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
              ? 'Reading ruler is the 📏 button next to this one. Settings are saved on this device.'
              : '防跳行閱讀尺喺隔籬顆 📏 掣。設定會記喺呢部裝置。'}
          </p>
        </div>
      )}
    </>
  )
}
