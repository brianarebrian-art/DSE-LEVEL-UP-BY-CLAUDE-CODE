'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Flag } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import type { TextQuestion } from '@/data/questions/types'

// 文字題 — a short free-text answer. HONESTY RULE: we never claim to auto-grade. After
// the student submits, we reveal the reference answer and they self-mark (啱 / 錯). The
// result is passed up via onResult so the host can log it (reverseLog / arena).
export default function TextQuestionCard({
  q,
  onResult,
}: {
  q: TextQuestion
  onResult?: (a: 'correct' | 'wrong') => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e?: string) => (en && e ? e : zh)

  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [marked, setMarked] = useState<'correct' | 'wrong' | null>(null)

  const mark = (a: 'correct' | 'wrong') => {
    if (marked) return
    setMarked(a)
    onResult?.(a)
  }

  const reportHref = `mailto:dselevelup@gmail.com?subject=${encodeURIComponent(
    `[題目回報] ${q.id}`,
  )}&body=${encodeURIComponent(en ? 'I disagree with the reference answer because:\n' : '我唔同意呢題嘅參考答案，因為：\n')}`

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* 題型標籤 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold tracking-wide text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-1">
          {en ? 'Text answer' : '文字題'}
        </span>
        <span className="text-xs text-slate-500">{q.frameworkEmoji} {tr(q.frameworkZh, q.frameworkEn)}</span>
      </div>

      <div className="text-sm sm:text-base text-slate-100 leading-relaxed mb-4">
        <MathText>{tr(q.content, q.contentEn)}</MathText>
      </div>

      {!submitted ? (
        <>
          <textarea
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={en ? 'Type your answer…' : '輸入你嘅答案...'}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100 resize-none"
          />
          <button
            onClick={() => value.trim() && setSubmitted(true)}
            disabled={!value.trim()}
            className="mt-3 w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-colors"
          >
            {en ? 'Submit' : '提交'}
          </button>
        </>
      ) : (
        <>
          {/* Student's answer echo */}
          <div className="text-xs text-slate-500 mb-1">{en ? 'Your answer' : '你嘅答案'}</div>
          <div className="text-sm text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2 mb-4 whitespace-pre-wrap break-words">
            {value}
          </div>

          {/* Reference answer (green) */}
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 mb-3">
            <div className="text-xs text-green-400 font-bold mb-1">{en ? 'Reference answer' : '參考答案'}</div>
            <div className="text-sm text-slate-200 leading-relaxed">
              <MathText>{tr(q.referenceAnswer, q.referenceAnswerEn)}</MathText>
            </div>
          </div>

          {q.explanation && (
            <div className="text-sm text-slate-400 leading-relaxed mb-4">
              <MathText>{tr(q.explanation, q.explanationEn)}</MathText>
            </div>
          )}

          {/* Self-assessment (NOT auto-graded) */}
          {marked === null ? (
            <div>
              <p className="text-sm text-slate-300 mb-2">
                {en ? 'Compare with the reference — did you get it right?' : '對照參考答案，你答啱咗嗎？'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => mark('correct')}
                  className="inline-flex items-center justify-center gap-2 border border-green-500/40 bg-green-500/10 hover:bg-green-500/20 text-green-300 font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <CheckCircle2 size={16} /> {en ? 'I got it right' : '我啱咗'}
                </button>
                <button
                  onClick={() => mark('wrong')}
                  className="inline-flex items-center justify-center gap-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <XCircle size={16} /> {en ? 'I got it wrong' : '我錯咗'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {marked === 'correct'
                ? en ? '✓ Logged as correct.' : '✓ 已記錄：答啱'
                : en ? '✗ Logged as wrong — saved to your review.' : '✗ 已記錄：答錯（已寫入你嘅溫習）'}
            </div>
          )}

          <a
            href={reportHref}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 mt-4 transition-colors"
          >
            <Flag size={12} /> {en ? 'I disagree / report' : '我唔同意 / 回報'}
          </a>
        </>
      )}
    </div>
  )
}
