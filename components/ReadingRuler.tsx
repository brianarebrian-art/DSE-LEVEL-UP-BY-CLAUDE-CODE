'use client'

import { useCallback, useEffect, useState } from 'react'
import { Ruler } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 防跳行閱讀尺（Leo/前端 + Emma/UDL — SEN 支援）。開啟後，一條半透明清晰帶
// 跟隨滑鼠/觸控移動，帶外上下輕微調暗，幫助讀寫障礙／專注力弱嘅同學逐行閱讀。
// 高度三段可調；設定存 localStorage。純 overlay（pointer-events-none），不影響作答。

const HEIGHTS = [56, 88, 128]
const KEY = 'dse_reading_ruler'

export default function ReadingRuler() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [on, setOn] = useState(false)
  const [hIdx, setHIdx] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
      if (saved) {
        setOn(!!saved.on)
        setHIdx(Number(saved.hIdx) % HEIGHTS.length || 0)
      }
    } catch { /* ignore */ }
  }, [])

  const persist = useCallback((nextOn: boolean, nextH: number) => {
    try { localStorage.setItem(KEY, JSON.stringify({ on: nextOn, hIdx: nextH })) } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!on) return
    let raf = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setY(e.clientY))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [on])

  const h = HEIGHTS[hIdx]
  const top = Math.max(0, y - h / 2)

  return (
    <>
      {on && (
        <div className="fixed inset-0 z-40 pointer-events-none" aria-hidden>
          {/* 帶外上下輕微調暗，中間清晰帶以幼邊框標示 */}
          <div className="absolute left-0 right-0 top-0 bg-slate-950/35" style={{ height: top }} />
          <div
            className="absolute left-0 right-0 border-y border-amber-400/40"
            style={{ top, height: h }}
          />
          <div className="absolute left-0 right-0 bottom-0 bg-slate-950/35" style={{ top: top + h }} />
        </div>
      )}

      <div className="fixed bottom-4 left-20 z-50 no-print flex items-center gap-2">
        <button
          onClick={() => { setOn(!on); persist(!on, hIdx) }}
          aria-pressed={on}
          title={en ? 'Reading ruler (focus aid)' : '閱讀尺（防跳行輔助）'}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-all ${
            on
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Ruler size={13} /> {en ? 'Ruler' : '閱讀尺'}
        </button>
        {on && (
          <button
            onClick={() => { const n = (hIdx + 1) % HEIGHTS.length; setHIdx(n); persist(on, n) }}
            className="text-xs px-2.5 py-2 rounded-full border bg-slate-900/80 border-slate-700 text-slate-500 hover:text-slate-300 transition-all"
            title={en ? 'Band height' : '調整高度'}
          >
            {['S', 'M', 'L'][hIdx]}
          </button>
        )}
      </div>
    </>
  )
}
