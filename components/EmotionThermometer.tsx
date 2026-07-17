'use client'

import { useEffect } from 'react'
import { useLocale } from '@/lib/i18n'
import type { EmotionTag } from '@/lib/emotionLog'

// F-EMO: 情緒溫度計 (Emma/UDL + Leo/前端)
// 觸發：拉分難度（difficulty === 'hard'，即 5** 級）答錯後、60 秒反思鎖出現之前。
// 三個狀態選項 + 「略過」——唔強制學生表態；「好慌」直接跳過鎖死去呼吸空間。
// 大愛紅線：無紅色、無催促字眼；ESC = 略過；autoFocus 第一個按鈕（ARIA 要求）。

export default function EmotionThermometer({
  onPick,
}: {
  onPick: (tag: EmotionTag) => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'

  // ESC 等同「略過」（C11 鍵盤要求）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onPick('skipped')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPick])

  const options: { tag: EmotionTag; emoji: string; zh: string; en: string; border: string }[] = [
    { tag: 'happy', emoji: '😊', zh: '我 OK，想繼續', en: "I'm OK — keep going", border: 'border-neon-cyan/40 hover:bg-neon-cyan/10' },
    { tag: 'neutral', emoji: '😐', zh: '有啲失落，但我得嘅', en: 'A bit down, but I can do this', border: 'border-neon-yellow/40 hover:bg-neon-yellow/10' },
    { tag: 'anxious', emoji: '😰', zh: '好慌，想停一停', en: 'Panicking — I need to pause', border: 'border-neon-purple/40 hover:bg-neon-purple/10' },
  ]

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="emotion-title"
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6"
      >
        <h2 id="emotion-title" className="text-lg font-bold text-white mb-1">
          {en ? 'How are you feeling right now?' : '而家感覺點？'}
        </h2>
        <p className="text-sm text-slate-300 mb-5">
          {en ? 'Pick whatever is closest to how you feel — no one is rushing you.' : '揀選最貼近你而家嘅狀態，冇人會催促你。'}
        </p>

        <div className="flex flex-col gap-4">
          {options.map((o, i) => (
            <button
              key={o.tag}
              onClick={() => onPick(o.tag)}
              autoFocus={i === 0}
              className={`w-full min-h-11 flex items-center gap-3 text-left rounded-xl border bg-slate-800/60 px-4 py-3 text-sm text-slate-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan ${o.border}`}
            >
              <span className="text-2xl" aria-hidden>{o.emoji}</span>
              {en ? o.en : o.zh}
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onPick('skipped')}
            className="min-h-11 px-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
          >
            {en ? 'Skip' : '略過'}
          </button>
        </div>
      </div>
    </div>
  )
}
