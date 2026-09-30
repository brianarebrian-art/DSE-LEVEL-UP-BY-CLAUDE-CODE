'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { getReverseLog } from '@/lib/reverseLog'

// 練習頁支援小隊（Yuna/Sarah/Emma/Leo）：
// 1. 「易讀字體」—— BDA 風格指引推薦嘅系統無襯線堆疊（零下載）
// 2. F10 字級調節 —— 12–24px，經 <html> font-size 全站生效（rem 基準）
// 3. F09 「今日夠了」—— 零罪疚收工：溫柔提示 + 輕柔和音 + 返 dashboard
// B2（2026-07-22）：舊「唞一唞」呼吸掣已由 PracticeSession 內嘅 RestMode 取代 ——
// 呢度喺 session 外層，停唔到練習計時同反思鎖，所以「休息」變咗鐘照行；
// RestMode 喺 session 內，唞幾耐就順延幾耐，先至係真・休息。唔留兩個入口。
// 2026-09-30：1、2 已併入無障礙面板；3 的入口移到題目頁頂部（見下方 EnoughTodayButton）。
// Light-first（憲章 §3）：白色浮動藥丸 + 白卡；scrim 用淡黑遮罩。

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

// 「今日夠了」入口放在題目頁頂部（計時、休息吓旁邊），由 EnoughTodayButton 廣播這個事件；
// 彈窗、和音及盲點統計仍然只在本組件，兩種練習頁共用一份。
export const ENOUGH_TODAY_EVENT = 'dse-enough-today'

/** 題目頁頂部的「今日夠了」按鈕。只廣播事件，彈窗由 PracticeSupport 負責。 */
export function EnoughTodayButton() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(ENOUGH_TODAY_EVENT))}
      title={en ? 'Done for today — no guilt, see you tomorrow.' : '今日夠了 —— 收工冇罪疚，聽日再戰。'}
      className="inline-flex items-center gap-1 min-h-11 px-2 -my-2 rounded-lg text-ink-muted hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <Moon size={13} aria-hidden /> <span className="text-[11px]">{en ? 'Enough today' : '今日夠了'}</span>
    </button>
  )
}

export default function PracticeSupport() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [doneToday, setDoneToday] = useState(false)
  const [blindSpotsToday, setBlindSpotsToday] = useState(0)

  useEffect(() => {
    const enoughForToday = () => {
      // 今日發現嘅盲點數（逆向錯因日誌，本地）—— 只講收穫，唔講「仲有幾多未做」
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      setBlindSpotsToday(getReverseLog().filter((e) => e.ts >= start.getTime()).length)
      playSoftChime()
      setDoneToday(true)
    }
    window.addEventListener(ENOUGH_TODAY_EVENT, enoughForToday)
    return () => window.removeEventListener(ENOUGH_TODAY_EVENT, enoughForToday)
  }, [])

  // Esc 關閉，與情緒支援彈窗一致。
  useEffect(() => {
    if (!doneToday) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDoneToday(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doneToday])

  return (
    <>
      {/* UX 循環 LOOP 3（2026-09-30）：左下角原本一排三粒浮動藥丸（字級、易讀字體、今日夠了）已移除。
          375×812 實測，這一排（y=714–748）連同下面的無障礙、閱讀尺、情緒支援掣，蓋住題目進度點
          及答錯後的第一行回饋。字級及易讀字體本來已在無障礙面板（components/A11yPanel.tsx），
          「今日夠了」移到題目頁頂部，與「休息吓」並排（EnoughTodayButton）。
          HOTFIX-0823 曾把這排由直排改為橫排以免遮住選項；現在整排不再浮動。 */}
      {/* F09 今日夠了 —— 零罪疚、零「你仲有 X 題未做」 */}
      {doneToday && (
        <div className="fixed inset-0 z-[60] bg-scrim-soft backdrop-blur-sm flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="enough-today-title" className="w-full max-w-sm bg-surface-raised border border-line shadow-xl rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3" aria-hidden>🌙</div>
            <p id="enough-today-title" className="text-ink font-medium mb-2">{en ? 'You did enough today.' : '你已經好叻，聽日再戰。'}</p>
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
              {/* 觸發掣在頁頂，打開後焦點移入彈窗；落在「再做多陣」，Enter 不會誤離開練習。 */}
              <button
                autoFocus
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
