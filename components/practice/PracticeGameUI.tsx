'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

export default function PracticeGameUI() {
  const { locale } = useLocale()
  const en = locale === 'en'

  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong'
    text: string
  } | null>(null)

  useEffect(() => {
    const handleCorrect = () => {
      setFeedback({
        type: 'correct',
        text: en ? 'Spot on! Judgment verified.' : '判斷準確！核心概念掌握。',
      })
      setTimeout(() => setFeedback(null), 2500)
    }

    const handleWrong = () => {
      setFeedback({
        type: 'wrong',
        text: en ? 'Common trap caught! Check the breakdown below.' : '踩中考評陷阱！睇睇下面步進解析。',
      })
      setTimeout(() => setFeedback(null), 3000)
    }

    window.addEventListener('dse-practice-correct', handleCorrect)
    window.addEventListener('dse-practice-wrong', handleWrong)

    return () => {
      window.removeEventListener('dse-practice-correct', handleCorrect)
      window.removeEventListener('dse-practice-wrong', handleWrong)
    }
  }, [en])

  if (!feedback) return null

  const isCorrect = feedback.type === 'correct'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 ease-out bg-slate-900 rounded-full"
    >
      <div
        className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 shadow-lg backdrop-blur-md ${
          isCorrect
            ? 'border border-emerald-500/30 bg-slate-900 text-emerald-100'
            : 'border border-line bg-slate-900 text-ink-inv'
        }`}
      >
        {isCorrect ? (
          <CheckCircle2 size={18} className="text-emerald-400" aria-hidden />
        ) : (
          <span className="font-bold text-accent" aria-hidden>!</span>
        )}
        <span className="text-sm font-semibold tracking-wide">
          {feedback.text}
        </span>
        {isCorrect && <Sparkles size={16} className="text-emerald-400" aria-hidden />}
      </div>
    </div>
  )
}
