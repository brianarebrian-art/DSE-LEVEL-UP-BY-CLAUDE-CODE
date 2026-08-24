'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon, Type } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { applyFontSize, FONT_KEY } from '@/components/GlobalA11y'
import { getReverseLog } from '@/lib/reverseLog'

// 練習頁支援小隊（Yuna/Sarah/Emma/Leo）：
// 1. 「易讀字體」—— BDA 風格指引推薦嘅系統無襯線堆疊（零下載）
// 2. F10 字級調節 —— 12–24px，經 <html> font-size 全站生效（rem 基準）
// 3. F09 「今日夠了」—— 零罪疚收工：溫柔提示 + 輕柔和音 + 返 dashboard
// B2（2026-07-22）：舊「唞一唞」呼吸掣已由 PracticeSession 內嘅 RestMode 取代 ——
// 呢度喺 session 外層，停唔到練習計時同反思鎖，所以「休息」變咗鐘照行；
// RestMode 喺 session 內，唞幾耐就順延幾耐，先至係真・休息。唔留兩個入口。
// 位置：bottom-16 left-4（閱讀尺開關上方），組成無障礙工具角。
// Light-first（憲章 §3）：白色浮動藥丸 + 白卡；scrim 用淡黑遮罩。

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
      {/* FIX: [B8] safe-area — 工具角喺 iPhone 上唔會俾 Home Indicator 遮擋

          HOTFIX-0823：由直排（flex-col）改為橫排（flex-row）。
          點解要改 —— 喺 iPhone SE（375×667）實測，直排三粒藥丸高 118px，
          由下而上壓住答題區，四個選項之中【有三個】被遮住（B 19%、C 24%、
          D 13%）。橫排之後高度由 118px 跌到 34px，選項遮蓋率全部歸零。
          三個功能一個都冇收埋、冇多一下撳、冇減低可發現性 —— 純粹係
          佔用形狀由「一條直柱」變成「一條橫帶」。
          呢種【縱向遮擋】用 `scrollWidth === innerWidth` 係驗唔到嘅：
          闊度一直都啱，出事嘅係高度。 */}
      <div className="fixed floating-bottom-2 left-4 z-50 no-print flex flex-row flex-wrap items-center gap-2 max-w-[calc(100vw-2rem)]">
        {/* relative wrapper：字級滑桿改為浮喺掣上面嘅 popover，唔再參與橫排流，
            否則滑桿會將成條橫帶推到爆出畫面右邊。 */}
        <div className="relative">
          <button
            onClick={() => { setFontPanel((v) => !v) }}
            aria-expanded={fontPanel}
            title={en ? 'Font size' : '字級調節（12–24px，全站生效）'}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border bg-surface-raised/90 border-line-strong text-ink-muted hover:text-ink-soft shadow-sm transition-all"
          >
            <span className="text-[10px]" aria-hidden>A</span><span aria-hidden>A</span> {en ? 'Size' : '字級'}
          </button>
          {fontPanel && (
            <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 bg-surface-raised border border-line-strong shadow-sm rounded-full px-3 py-2">
              <button onClick={() => setSize(fontPx - 2)} disabled={fontPx <= 12} className="min-w-8 min-h-8 text-ink-soft disabled:text-ink-faint text-sm" aria-label={en ? 'Smaller' : '縮細'}>−</button>
              <input
                type="range" min={12} max={24} step={1} value={fontPx}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-24 accent-accent"
                aria-label={en ? 'Font size' : '字級'}
              />
              <button onClick={() => setSize(fontPx + 2)} disabled={fontPx >= 24} className="min-w-8 min-h-8 text-ink-soft disabled:text-ink-faint text-sm" aria-label={en ? 'Larger' : '放大'}>＋</button>
              <span className="text-[10px] text-ink-muted w-9">{fontPx}px</span>
            </div>
          )}
        </div>
        <button
          onClick={toggleFont}
          aria-pressed={easyFont}
          title={en ? 'Dyslexia-friendly font (BDA-style system stack)' : '易讀字體（讀寫障礙友善）'}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border shadow-sm transition-all ${
            easyFont
              ? 'bg-accent/12 border-accent/40 text-accent'
              : 'bg-surface-raised/90 border-line-strong text-ink-muted hover:text-ink-soft'
          }`}
        >
          <Type size={13} /> {en ? 'Easy font' : '易讀字體'}
        </button>
        <button
          onClick={enoughForToday}
          title={en ? 'Done for today — no guilt, see you tomorrow.' : '今日夠了 —— 收工冇罪疚，聽日再戰。'}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border bg-surface-raised/90 border-line-strong text-ink-muted hover:text-gold hover:border-gold/40 shadow-sm transition-all"
        >
          <Moon size={13} /> {en ? 'Enough today' : '今日夠了'}
        </button>
      </div>

      {/* F09 今日夠了 —— 零罪疚、零「你仲有 X 題未做」 */}
      {doneToday && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface-raised border border-line shadow-xl rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3" aria-hidden>🌙</div>
            <p className="text-ink font-medium mb-2">{en ? 'You did enough today.' : '你已經好叻，聽日再戰。'}</p>
            <p className="text-sm text-ink-muted mb-5 leading-relaxed">
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
                className="block min-h-11 rounded-[10px] bg-accent-strong hover:bg-accent-hover text-on-accent text-sm px-4 py-3 transition-colors"
              >
                {en ? 'Back to dashboard' : '返回我的進度'}
              </Link>
              <button
                onClick={() => setDoneToday(false)}
                className="block w-full min-h-11 rounded-[10px] border border-line-strong text-ink-muted text-sm px-4 py-3 hover:text-ink-soft transition-colors"
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
