'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AlignJustify, Clock, Minus, MoveHorizontal, Plus, Type, Volume2, Wind, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import OfflineBadge from '@/components/OfflineBadge'
// 第 1 週 · 引擎一：答對輕柔提示音開關（預設關閉）
import { ANSWER_SOUND_KEY, isAnswerSoundOn, playCorrectChime } from '@/lib/answerChime'
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
//
// 2026-07-30 對比度修正：本面板永遠深底（兩個主題一樣），所以【唔可以】靠 body
// 繼承主題 text-ink —— 淺色主題下 −／＋ 掣嘅「A」會變 #1A1A1A 落 slate-800，
// 只有 1.19:1。同時 text-slate-600 註腳落 slate-900 只有 2.35:1，text-slate-500
// 亦只有 3.74:1，全部升至 slate-400／slate-100。SEN 面板本身睇唔到字係最唔應該。

const EASY_KEY = 'dse_easy_font'
const HIDE_TIMER_KEY = 'dse_hide_timer'
// 手動「減少動態」。全站本來只跟系統 prefers-reduced-motion —— 用學校電腦、
// 或者唔識改作業系統設定嘅學生，之前完全冇得揀。
const NO_MOTION_KEY = 'dse_no_motion'
const RULER_KEY = 'dse_reading_ruler' // 同 ReadingRuler.tsx 共用
const MIN = 12
const MAX = 24
const STEP = 2

// 2026-09-02（莫蘭迪 v4.0-B 決定二）：本面板一直冇跟 2026-07-22 嘅 light-first
// 遷移走 —— 成個組件寫死 slate 深色階，內部自洽（對比 5.7–13.4，冇無障礙問題），
// 但佢係全站常駐嘅浮動面板，喺淺色／莫蘭迪頁面上會浮出一塊深灰島，
// 就係「零視覺斷層」要剷走嗰種斷層。
//
// 全部改為語意 token，深度層級保留：slate-900／700 → surface-sunken（凹陷、控件），
// slate-800 → surface-raised（面板身）。開啟態實心掣由 `bg-amber-400 text-black`
// 改為 `bg-gold-strong text-on-accent` —— text-black 喺 Cyber 主題（淺金底）
// 會變成深字落淺底啱，但 Light（深金底）就係深字落深底；on-accent 兩邊都啱。
// 四種主題組合實測：開啟態 5.64–13.5，關閉態 7.13–13.95，全部過 AA。
//
// ⚠️ 呢個組件由三個測試守住（sen-accessibility、answer-feedback、route-states），
// 但佢哋 assert 嘅全部係邏輯（comfortOn 推導、localStorage keys），冇一條綁色 class。
// 換色唔會令佢哋失效，亦即係話【換色本身冇測試網】—— 改完要實跑睇。
export default function A11yPanel() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(16)
  const [easy, setEasy] = useState(false)
  const [hideTimer, setHideTimer] = useState(false)
  const [sound, setSound] = useState(false)
  const [noMotion, setNoMotion] = useState(false)
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
      setSound(isAnswerSoundOn())
      setNoMotion(localStorage.getItem(NO_MOTION_KEY) === '1')
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
        setSound(isAnswerSoundOn())
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

  // 手動減少動態。即時 toggle <html> class，唔使 reload。
  const toggleNoMotion = useCallback(() => {
    setNoMotion((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('no-motion', next)
      try {
        localStorage.setItem(NO_MOTION_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event('dse-a11y'))
      return next
    })
  }, [])

  // 第 1 週 · 引擎一：答對輕柔提示音。預設關閉，需學生主動開啟。
  // 開啟時即時試播一次 —— 學生要聽得到自己開咗乜，先算真正做到「可選」。
  const toggleSound = useCallback(() => {
    setSound((prev) => {
      const next = !prev
      try {
        localStorage.setItem(ANSWER_SOUND_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      if (next) playCorrectChime()
      return next
    })
  }, [])

  // 一鍵舒適模式：三項支援（易讀字體＋閱讀尺＋隱藏計時器）一掣齊開／齊關。
  // 無痕設計（Emma/UDL）：UI 只描述功能，唔出任何診斷標籤字眼。
  // 狀態由三個子開關推導 —— 學生逐個微調後，總掣自動反映真實組合。
  //
  // 第 1 週新增：答題提示音一併納入。憲章第 7 條約束 4 明訂一鍵舒適模式之下，
  // 裝飾回饋層要【整層關掉，唔係調慢】—— 聲音屬裝飾回饋層，故開舒適模式即靜音。
  // 學生之後仍可單獨開返聲音；此時總掣會顯示「關」，如實反映佢已經自行微調。
  const comfortOn = easy && hideTimer && ruler && noMotion && !sound
  const toggleComfort = useCallback(() => {
    const next = !(easy && hideTimer && ruler && noMotion && !sound)
    document.documentElement.classList.toggle('font-easy', next)
    document.documentElement.classList.toggle('no-motion', next)
    try {
      localStorage.setItem(EASY_KEY, next ? '1' : '0')
      localStorage.setItem(HIDE_TIMER_KEY, next ? '1' : '0')
      localStorage.setItem(NO_MOTION_KEY, next ? '1' : '0')
      // 開舒適模式 = 靜音；關舒適模式【唔會】自動開聲（聲音一律要主動開啟）
      if (next) localStorage.setItem(ANSWER_SOUND_KEY, '0')
      const saved = JSON.parse(localStorage.getItem(RULER_KEY) ?? 'null')
      // 保留學生揀開嘅尺帶高度，只改 on/off
      localStorage.setItem(RULER_KEY, JSON.stringify({ on: next, hIdx: Number(saved?.hIdx) || 0 }))
    } catch {
      /* ignore */
    }
    setEasy(next)
    setHideTimer(next)
    setRuler(next)
    setNoMotion(next)
    if (next) setSound(false)
    // ReadingRuler 同 PracticeSession 都聽 dse-a11y，即時生效
    window.dispatchEvent(new Event('dse-a11y'))
  }, [easy, hideTimer, ruler, noMotion, sound])

  return (
    <>
      {/* FIX: [C12] button 明確 aria-label（img alt 改為裝飾性，避免重複朗讀）
          FIX: [B8] bottom-4 → safe-area max()，iPhone Home Indicator 唔遮擋 */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={en ? 'Open accessibility menu' : '開啟無障礙功能選單'}
        title={en ? 'Accessibility · text size & easy-read font' : '無障礙 · 字級同易讀字體'}
        className="no-print fixed floating-bottom left-4 z-50 min-h-12 min-w-12 w-12 h-12 rounded-full bg-surface-raised border border-line-strong flex items-center justify-center hover:bg-surface-sunken transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        {/* 通用無障礙圖標（/public/icons，向量重繪自用戶提供嘅參考圖 —— 原檔係實色底
            OG 圖，SVG 重繪先有真透明背景）。無障礙名稱由 button aria-label 提供。
            unoptimized：SVG 不經 next 優化器。 */}
        <Image src="/icons/accessibility.svg" alt="" aria-hidden width={26} height={26} className="object-contain" unoptimized />
      </button>

      {open && (
        <div
          className="no-print fixed floating-bottom-3 left-4 z-50 w-72 max-w-[calc(100vw-2rem)] bg-surface-sunken border border-line-strong rounded-2xl p-4 shadow-xl"
          role="dialog"
          aria-label={en ? 'Accessibility options' : '無障礙設定'}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-ink font-bold text-sm">
              <Image src="/icons/accessibility.svg" alt="" aria-hidden width={20} height={20} className="object-contain" unoptimized />
              {en ? 'Accessibility' : '無障礙設定'}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={en ? 'Close' : '關閉'}
              className="min-h-11 min-w-11 flex items-center justify-center text-ink-muted hover:text-ink transition-colors -mr-2 -mt-2"
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
                ? 'bg-accent/15 border-accent/50 text-accent'
                : 'bg-surface-raised border-line-strong text-ink hover:bg-surface-sunken'
            }`}
          >
            <span className="text-left">
              <span className="block text-sm font-bold">✨ {en ? 'Comfort mode (one tap)' : '一鍵舒適模式'}</span>
              <span className="block text-[11px] text-ink-muted">
                {en ? 'Easy font + ruler + timer off + muted' : '易讀字體＋閱讀尺＋隱藏計時器＋靜音'}
              </span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                comfortOn ? 'bg-accent-strong text-on-accent' : 'bg-surface-sunken text-ink-soft'
              }`}
            >
              {comfortOn ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          {/* 字級 A− / A+ */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-2">
              <Type size={13} /> {en ? 'Text size' : '字級大細'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFont(size - STEP)}
                disabled={size <= MIN}
                aria-label={en ? 'Smaller text' : '縮細字'}
                className="min-h-11 flex-1 flex items-center justify-center rounded-xl border border-line-strong bg-surface-raised text-ink hover:bg-surface-sunken disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={15} />
                <span className="text-sm ml-1">A</span>
              </button>
              <span className="tabular-nums text-sm text-ink-soft w-14 text-center shrink-0">{size}px</span>
              <button
                onClick={() => setFont(size + STEP)}
                disabled={size >= MAX}
                aria-label={en ? 'Larger text' : '放大字'}
                className="min-h-11 flex-1 flex items-center justify-center rounded-xl border border-line-strong bg-surface-raised text-ink hover:bg-surface-sunken disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={15} />
                <span className="text-base ml-1">A</span>
              </button>
            </div>
          </div>

          {/* B1 行距（1.2–2.0，每 0.1 一級） */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
              <span className="flex items-center gap-1.5">
                <AlignJustify size={13} /> {en ? 'Line spacing' : '行距'}
              </span>
              <span className="tabular-nums text-ink-soft">{lineH.toFixed(1)}</span>
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
            <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-2">
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
                      ? 'bg-gold/15 border-gold/40 text-gold'
                      : 'bg-surface-raised border-line-strong text-ink-soft hover:bg-surface-sunken'
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
          <div className="mb-4 rounded-xl border border-line-strong bg-surface-raised/60 p-3">
            <div className="text-[11px] text-ink-muted mb-1">{en ? 'Preview' : '即時預覽'}</div>
            <p
              className="text-sm text-ink"
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
                ? 'bg-gold/15 border-gold/40 text-gold'
                : 'bg-surface-raised border-line-strong text-ink-soft hover:bg-surface-sunken'
            }`}
          >
            <span className="text-left">
              <span className="block text-sm">{en ? 'Easy-read font' : '易讀字體'}</span>
              <span className="block text-[11px] text-ink-muted">{en ? 'Dyslexia-friendly' : '讀寫障礙友善'}</span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                easy ? 'bg-gold-strong text-on-accent' : 'bg-surface-sunken text-ink-soft'
              }`}
            >
              {easy ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          {/* 隱藏練習計時器（焦慮友善 — SEN） */}
          <button
            onClick={toggleNoMotion}
            aria-pressed={noMotion}
            className={`w-full min-h-11 mt-2.5 flex items-center justify-between rounded-xl border px-4 py-2 transition-colors ${
              noMotion
                ? 'bg-gold/15 border-gold/40 text-gold'
                : 'bg-surface-raised border-line-strong text-ink-soft hover:bg-surface-sunken'
            }`}
          >
            <span className="text-left flex items-center gap-2">
              <Wind size={14} className="shrink-0" />
              <span>
                <span className="block text-sm">{en ? 'Reduce motion' : '減少動態效果'}</span>
                <span className="block text-[11px] text-ink-muted">
                  {en ? 'Stops animations without changing device settings' : '唔使改機身設定都停到動畫'}
                </span>
              </span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                noMotion ? 'bg-gold-strong text-on-accent' : 'bg-surface-sunken text-ink-soft'
              }`}
            >
              {noMotion ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          <button
            onClick={toggleTimer}
            aria-pressed={hideTimer}
            className={`w-full min-h-11 mt-2.5 flex items-center justify-between rounded-xl border px-4 py-2 transition-colors ${
              hideTimer
                ? 'bg-gold/15 border-gold/40 text-gold'
                : 'bg-surface-raised border-line-strong text-ink-soft hover:bg-surface-sunken'
            }`}
          >
            <span className="text-left flex items-center gap-2">
              <Clock size={14} className="shrink-0" />
              <span>
                <span className="block text-sm">{en ? 'Hide practice timer' : '隱藏練習計時器'}</span>
                <span className="block text-[11px] text-ink-muted">{en ? 'Less time pressure' : '減低時間壓力'}</span>
              </span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                hideTimer ? 'bg-gold-strong text-on-accent' : 'bg-surface-sunken text-ink-soft'
              }`}
            >
              {hideTimer ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          {/* 答對輕柔提示音（第 1 週 · 引擎一）—— 預設關閉，答錯永遠無聲 */}
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            className={`w-full min-h-11 mt-2.5 flex items-center justify-between rounded-xl border px-4 py-2 transition-colors ${
              sound
                ? 'bg-gold/15 border-gold/40 text-gold'
                : 'bg-surface-raised border-line-strong text-ink-soft hover:bg-surface-sunken'
            }`}
          >
            <span className="text-left flex items-center gap-2">
              <Volume2 size={14} className="shrink-0" />
              <span>
                <span className="block text-sm">{en ? 'Gentle chime on correct' : '答對輕柔提示音'}</span>
                <span className="block text-[11px] text-ink-muted">
                  {en ? 'Off by default · never on wrong answers' : '預設關閉 · 答錯永遠無聲'}
                </span>
              </span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                sound ? 'bg-gold-strong text-on-accent' : 'bg-surface-sunken text-ink-soft'
              }`}
            >
              {sound ? (en ? 'ON' : '開') : en ? 'OFF' : '關'}
            </span>
          </button>

          <p className="text-[11px] text-ink-muted mt-3 leading-relaxed">
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
