'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'

// B2「一鍵休息模式」（Emma/UDL + Sarah 2026-07-22）：做題途中隨時可以停低唞一唞。
// 設計取態：
//   • 休息唔會偷走你嘅時間 —— 關閉時回報實際暫停毫秒數，練習計時同反思鎖死線
//     一齊順延，所以「唞」永遠唔會令你嘅成績變差。
//   • 時間到唔會自動彈返做題頁。最後 10 秒只係溫柔提示，返唔返由你撳。
//   • 零新依賴、零 localStorage、零上傳：純 component state。
// 刻意唔做浮動圓掣 —— 右下角已有情緒支援掣、左下角有無障礙面板，
// 再加一個會撞埋一齊；入口改為做題頁計時器隔籬，就手而唔阻手。

type Phase = 'in' | 'hold' | 'out'
const PHASE_MS: Record<Phase, number> = { in: 4000, hold: 7000, out: 8000 }
const NEXT: Record<Phase, Phase> = { in: 'hold', hold: 'out', out: 'in' }

const DURATIONS = [60, 300] as const

function mmss(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export default function RestMode({ open, onClose }: { open: boolean; onClose: (pausedMs: number) => void }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const openedAt = useRef(0)
  // null = 未揀時長（自由休息，唔倒數）
  const [picked, setPicked] = useState<number | null>(null)
  const [left, setLeft] = useState(0)
  const [phase, setPhase] = useState<Phase>('in')
  const deadline = useRef<number | null>(null)

  // 每次打開都重設，令上一次嘅倒數唔會殘留
  useEffect(() => {
    if (!open) return
    openedAt.current = Date.now()
    setPicked(null)
    setLeft(0)
    setPhase('in')
    deadline.current = null
  }, [open])

  const close = useCallback(() => {
    onClose(openedAt.current ? Date.now() - openedAt.current : 0)
  }, [onClose])

  // 呼吸循環（4-7-8）—— 只喺休息中行
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => setPhase(NEXT[phase]), PHASE_MS[phase])
    return () => clearTimeout(id)
  }, [open, phase])

  // 倒數（由死線倒推，避免逐秒鏈累積漂移）
  useEffect(() => {
    if (!open || picked === null) return
    const id = setInterval(() => {
      const dl = deadline.current
      setLeft(dl === null ? 0 : Math.max(0, Math.ceil((dl - Date.now()) / 1000)))
    }, 250)
    return () => clearInterval(id)
  }, [open, picked])

  // Esc 隨時離開（SEN：任何全屏遮罩都要一鍵走得甩）
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const start = useCallback((secs: number) => {
    deadline.current = Date.now() + secs * 1000
    setLeft(secs)
    setPicked(secs)
  }, [])

  if (!open) return null

  const phaseLabel =
    phase === 'in' ? (en ? 'Breathe in… 4' : '吸氣⋯⋯ 4')
      : phase === 'hold' ? (en ? 'Hold… 7' : '屏息⋯⋯ 7')
        : (en ? 'Breathe out… 8' : '呼氣⋯⋯ 8')

  const done = picked !== null && left === 0
  const soon = picked !== null && left > 0 && left <= 10

  return (
    /* z-[70]：要蓋過練習頁左下角工具角（z-50）同佢自己嘅彈窗（z-[60]）——
       休息中唔應該仲見到一堆浮動掣。 */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-title"
      className="fixed inset-0 z-[70] bg-[#FAFAF8]/97 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm text-center">
        <p id="rest-title" className="text-xl text-[#1A1A1A] font-medium mb-1">
          {en ? 'You are doing well. Take a rest.' : '你做得好，休息吓。'}
        </p>
        <p className="text-sm text-[#6B6B6B] mb-8">
          {en ? 'The timer is paused. Nothing is being lost.' : '計時已經停低咗，你冇蝕到任何嘢。'}
        </p>

        {/* 呼吸圓 —— 進出以 CSS transition 驅動，reduced-motion 下唔縮放 */}
        <div className="flex items-center justify-center h-56 mb-6" aria-hidden="true">
          <div
            className="rounded-full bg-[#008B84]/10 border border-[#008B84]/30 flex items-center justify-center motion-reduce:!scale-100 motion-reduce:!transition-none"
            style={{
              width: 168,
              height: 168,
              transform: `scale(${phase === 'out' ? 1 : 1.28})`,
              transition: `transform ${PHASE_MS[phase]}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            <span className="text-[#00726C] text-sm">{phaseLabel}</span>
          </div>
        </div>

        {picked === null ? (
          <div className="space-y-2.5">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => start(d)}
                className="w-full min-h-11 rounded-xl border border-black/[0.10] bg-white text-[#2D2D2D] text-sm px-4 py-3 hover:border-[#008B84]/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008B84]"
              >
                {en ? `Rest for ${d / 60} minute${d > 60 ? 's' : ''}` : `休息 ${d / 60} 分鐘`}
              </button>
            ))}
            <button
              onClick={close}
              className="w-full min-h-11 rounded-xl bg-[#00726C] text-white text-sm px-4 py-3 hover:bg-[#005F5A] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008B84]"
            >
              {en ? 'I am ready to carry on' : '我準備好繼續'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-2xl text-[#2D2D2D] tabular-nums" aria-live="off">{mmss(left)}</p>
            <p className="text-sm text-[#6B6B6B] min-h-5">
              {done
                ? (en ? 'Rest is over — come back whenever you are ready. No rush.' : '休息完喇 —— 準備好先返嚟，唔急。')
                : soon
                  ? (en ? 'About 10 seconds left. Still your call when to return.' : '仲有 10 秒左右。幾時返，一樣係你話事。')
                  : (en ? 'Just follow the circle. Nothing else to do.' : '跟住個圓呼吸就得，冇其他嘢要做。')}
            </p>
            <button
              onClick={close}
              className={`w-full min-h-11 rounded-xl text-sm px-4 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008B84] ${
                done
                  ? 'bg-[#00726C] text-white hover:bg-[#005F5A]'
                  : 'border border-black/[0.10] bg-white text-[#2D2D2D] hover:border-[#008B84]/40'
              }`}
            >
              {en ? 'I am ready to carry on' : '我準備好繼續'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
