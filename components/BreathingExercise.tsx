'use client'

import { useEffect, useRef, useState } from 'react'
import { Wind, Square } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 4-7-8 呼吸法（Sarah/駐校社工 — 情緒急救）。吸氣 4 秒 → 屏息 7 秒 → 呼氣 8 秒。
// 純 CSS transition 驅動（無新依賴）；溫和色系，配合平台 gentle 品牌。
// 明確定位：簡單放鬆練習，並非醫療或心理治療服務。

type Phase = 'idle' | 'in' | 'hold' | 'out'

const PHASE_MS: Record<Exclude<Phase, 'idle'>, number> = { in: 4000, hold: 7000, out: 8000 }
const NEXT: Record<Exclude<Phase, 'idle'>, Exclude<Phase, 'idle'>> = { in: 'hold', hold: 'out', out: 'in' }

export default function BreathingExercise() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [phase, setPhase] = useState<Phase>('idle')
  const [rounds, setRounds] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (phase === 'idle') return
    timer.current = setTimeout(() => {
      if (phase === 'out') setRounds((r) => r + 1)
      setPhase(NEXT[phase])
    }, PHASE_MS[phase])
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [phase])

  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    setPhase('idle')
    setRounds(0)
  }

  const label =
    phase === 'in'
      ? en ? 'Breathe in… (4s)' : '吸氣⋯⋯（4 秒）'
      : phase === 'hold'
        ? en ? 'Hold… (7s)' : '屏息⋯⋯（7 秒）'
        : phase === 'out'
          ? en ? 'Breathe out… (8s)' : '呼氣⋯⋯（8 秒）'
          : en ? 'Take a break — no questions now.' : '而家唔使做題，我哋一齊唞一唞。'

  const scale = phase === 'in' || phase === 'hold' ? 1.45 : 1
  const duration = phase === 'idle' ? 300 : PHASE_MS[phase]

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-[#2D2D2D] font-medium mb-4">
        <Wind size={18} className="text-[#008B84]" />
        {en ? '4-7-8 breathing' : '4-7-8 呼吸練習'}
      </div>

      <div className="flex items-center justify-center h-40 mb-4">
        <div
          className="w-24 h-24 rounded-full bg-[#008B84]/15 border border-[#008B84]/40 flex items-center justify-center"
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${duration}ms ${phase === 'hold' ? 'step-end' : 'ease-in-out'}`,
          }}
        >
          <div className="w-10 h-10 rounded-full bg-[#008B84]/25" />
        </div>
      </div>

      <p className="text-[#2D2D2D] mb-1 min-h-6">{label}</p>
      {rounds > 0 && (
        <p className="text-xs text-[#9CA3AF] mb-3">
          {en ? `Completed ${rounds} round${rounds > 1 ? 's' : ''}` : `已完成 ${rounds} 個循環`}
        </p>
      )}

      {phase === 'idle' ? (
        <button
          onClick={() => setPhase('in')}
          className="bg-[#008B84]/10 hover:bg-[#008B84]/20 text-[#008B84] border border-[#008B84]/30 font-medium px-6 py-2.5 rounded-xl transition-all"
        >
          {en ? 'Start' : '開始'}
        </button>
      ) : (
        <button
          onClick={stop}
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#2D2D2D] border border-black/[0.12] px-6 py-2.5 rounded-xl transition-all"
        >
          <Square size={14} /> {en ? 'Stop' : '停止'}
        </button>
      )}

      <p className="text-[11px] text-[#9CA3AF] mt-4 leading-relaxed">
        {en
          ? 'This is a simple relaxation exercise, not a medical or counselling service. If distress persists, talk to your school social worker, or call The Samaritans 24-hour hotline: 2896 0000.'
          : '本功能只係簡單放鬆練習，並非醫療或心理輔導服務。如情緒持續困擾，請搵學校社工傾傾，或致電撒瑪利亞會 24 小時熱線 2896 0000。'}
      </p>
    </div>
  )
}
