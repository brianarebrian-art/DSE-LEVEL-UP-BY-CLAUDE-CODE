'use client'

import { useState } from 'react'
import { ChevronDown, Flag, Clock } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import type { LongQuestion, SelfAssessment } from '@/data/questions/types'

// 長題目 — multi-line structured working with optional live KaTeX preview. Same HONESTY
// rule: no auto-grading. After submit we reveal the model answer + marking scheme
// (collapsible) and the student self-assesses on a 3-level scale. onResult reports it up.
type Level = Extract<SelfAssessment, 'full' | 'partial' | 'none'>

export default function LongQuestionCard({
  q,
  onResult,
}: {
  q: LongQuestion
  onResult?: (level: Level) => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e?: string) => (en && e ? e : zh)

  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [level, setLevel] = useState<Level | null>(null)
  const [showAnswer, setShowAnswer] = useState(true)
  const [showScheme, setShowScheme] = useState(false)

  const pick = (l: Level) => {
    if (level) return
    setLevel(l)
    onResult?.(l)
  }

  const reportHref = `mailto:dselevelup@gmail.com?subject=${encodeURIComponent(`[題目回報] ${q.id}`)}`

  const levels: { key: Level; zh: string; en: string; cls: string }[] = [
    { key: 'full', zh: '完全掌握', en: 'Fully got it', cls: 'border-green-500/40 bg-green-500/10 text-green-300' },
    { key: 'partial', zh: '部分明白', en: 'Partly', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
    { key: 'none', zh: '完全唔識', en: 'Not yet', cls: 'border-slate-700 bg-slate-800/50 text-slate-300' },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* 題型標籤 + 建議用時 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[11px] font-bold tracking-wide text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-1">
          {en ? 'Long response' : '長題目'}
        </span>
        {q.suggestedMinutes ? (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} /> {en ? `~${q.suggestedMinutes} min` : `建議用時 ${q.suggestedMinutes} 分鐘`}
          </span>
        ) : null}
      </div>

      <div className="text-sm sm:text-base text-slate-100 leading-relaxed mb-4">
        <MathText>{tr(q.content, q.contentEn)}</MathText>
      </div>

      {!submitted ? (
        <>
          <textarea
            rows={7}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={en ? 'Write your working… (LaTeX in $…$ renders below)' : '寫低你嘅步驟... （用 $…$ 打 LaTeX 會喺下面預覽）'}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-slate-100 resize-y font-mono"
          />
          {/* Live KaTeX preview */}
          {value.includes('$') && (
            <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-600 mb-1">{en ? 'Preview' : '預覽'}</div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                <MathText>{value}</MathText>
              </div>
            </div>
          )}
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
          <div className="text-xs text-slate-500 mb-1">{en ? 'Your working' : '你嘅作答'}</div>
          <div className="text-sm text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2 mb-4 whitespace-pre-wrap break-words">
            <MathText>{value}</MathText>
          </div>

          {/* Model answer (collapsible) */}
          <button
            onClick={() => setShowAnswer((s) => !s)}
            className="w-full flex items-center justify-between text-left border border-green-500/30 bg-green-500/10 rounded-xl px-4 py-2.5 mb-2"
          >
            <span className="text-xs text-green-400 font-bold">{en ? 'Model answer' : '參考答案'}</span>
            <ChevronDown size={16} className={`text-green-400 transition-transform ${showAnswer ? 'rotate-180' : ''}`} />
          </button>
          {showAnswer && (
            <div className="text-sm text-slate-200 leading-relaxed px-4 pb-3 mb-2">
              <MathText>{tr(q.referenceAnswer, q.referenceAnswerEn)}</MathText>
            </div>
          )}

          {/* Marking scheme (collapsible) */}
          {q.markingScheme && (
            <>
              <button
                onClick={() => setShowScheme((s) => !s)}
                className="w-full flex items-center justify-between text-left border border-slate-700 bg-slate-800/40 rounded-xl px-4 py-2.5 mb-2"
              >
                <span className="text-xs text-slate-300 font-bold">{en ? 'Marking scheme / step marks' : '評分準則 / 步驟分'}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showScheme ? 'rotate-180' : ''}`} />
              </button>
              {showScheme && (
                <div className="text-sm text-slate-300 leading-relaxed px-4 pb-3 mb-2">
                  <MathText>{tr(q.markingScheme, q.markingSchemeEn)}</MathText>
                </div>
              )}
            </>
          )}

          {/* 3-level self-assessment */}
          {level === null ? (
            <div className="mt-3">
              <p className="text-sm text-slate-300 mb-2">
                {en ? 'Compare with the model answer — how did you do?' : '對照參考答案，你掌握到幾多？'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => pick(l.key)}
                    className={`text-sm font-semibold py-2.5 rounded-xl border transition-colors ${l.cls}`}
                  >
                    {en ? l.en : l.zh}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 mt-3">
              {en ? '✓ Self-assessment logged.' : '✓ 已記錄你嘅自評。'}
            </div>
          )}

          <a href={reportHref} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 mt-4 transition-colors">
            <Flag size={12} /> {en ? 'I disagree / report' : '我唔同意 / 回報'}
          </a>
        </>
      )}
    </div>
  )
}
