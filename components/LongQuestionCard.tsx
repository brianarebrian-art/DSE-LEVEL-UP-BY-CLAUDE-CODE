'use client'

import { useState } from 'react'
import { ChevronDown, Flag, Clock } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import type { LongQuestion, SelfAssessment } from '@/data/questions/types'

// 長題目 — multi-line structured working with optional live KaTeX preview. Same HONESTY
// rule: no auto-grading. After submit we reveal the model answer + marking scheme
// (collapsible) and the student self-assesses on a 3-level scale. onResult reports it up.
//
// ── 2026-07-31 接線（Brian 拍板）───────────────────────────────────────────────
// 本組件由 2026-07-01 起一直冇被 import 過。今次接線同時全面改用語意 token ——
// 原本寫死深色（bg-slate-900 / text-slate-*），喺 Light 主題下會變成一塊突兀嘅
// 深色島。現時跟主題走，兩個主題都過 WCAG AA。
//
// 三級自評用青／金／灰（accent／gold／line），刻意【唔用紅】：憲章禁大紅交叉，
// 而且呢個係學生自己講嘅評估，唔係機器判佢錯 —— 措辭同色彩都唔應該似判決。
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
  const [showWhy, setShowWhy] = useState(false)

  const pick = (l: Level) => {
    if (level) return
    setLevel(l)
    onResult?.(l)
  }

  const reportHref = `mailto:dselevelup@gmail.com?subject=${encodeURIComponent(`[${en ? 'Question report' : '題目回報'}] ${q.id}`)}`

  const levels: { key: Level; zh: string; en: string; cls: string }[] = [
    { key: 'full', zh: '完全掌握', en: 'Fully got it', cls: 'border-accent/40 bg-accent/10 hover:bg-accent/15 text-accent' },
    { key: 'partial', zh: '部分明白', en: 'Partly', cls: 'border-gold/40 bg-gold/10 hover:bg-gold/15 text-gold' },
    { key: 'none', zh: '仲未掌握', en: 'Not yet', cls: 'border-line-strong bg-surface-sunken hover:bg-line text-ink-soft' },
  ]

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6">
      {/* 題型標籤 + 建議用時 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[11px] font-bold tracking-wide text-gold bg-gold/10 border border-gold/30 rounded-full px-2.5 py-1">
          {en ? 'Long response' : '長題目'}
        </span>
        {q.suggestedMinutes ? (
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Clock size={12} aria-hidden /> {en ? `~${q.suggestedMinutes} min` : `建議用時 ${q.suggestedMinutes} 分鐘`}
          </span>
        ) : null}
      </div>

      <div className="text-sm sm:text-base text-ink leading-relaxed mb-4">
        <MathText>{tr(q.content, q.contentEn)}</MathText>
      </div>

      {!submitted ? (
        <>
          <textarea
            rows={7}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={en ? 'Write your working… (LaTeX in $…$ renders below)' : '寫低你嘅步驟... （用 $…$ 打 LaTeX 會喺下面預覽）'}
            aria-label={en ? 'Your working' : '你嘅步驟'}
            className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink-soft placeholder:text-ink-muted resize-y font-mono"
          />
          {/* Live KaTeX preview */}
          {value.includes('$') && (
            <div className="mt-2 rounded-lg border border-line bg-surface-sunken px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-ink-muted mb-1">{en ? 'Preview' : '預覽'}</div>
              <div className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
                <MathText>{value}</MathText>
              </div>
            </div>
          )}
          <button
            onClick={() => value.trim() && setSubmitted(true)}
            disabled={!value.trim()}
            className="mt-3 w-full min-h-11 bg-accent-strong hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-on-accent font-bold py-3 rounded-xl transition-colors"
          >
            {en ? 'Submit' : '提交'}
          </button>
        </>
      ) : (
        <>
          <div className="text-xs text-ink-muted mb-1">{en ? 'Your working' : '你嘅作答'}</div>
          <div className="text-sm text-ink-soft bg-surface-sunken rounded-lg px-3 py-2 mb-4 whitespace-pre-wrap break-words">
            <MathText>{value}</MathText>
          </div>

          {/* Model answer (collapsible) */}
          <button
            onClick={() => setShowAnswer((s) => !s)}
            className="w-full min-h-11 flex items-center justify-between text-left border border-accent/30 bg-accent/10 rounded-xl px-4 py-2.5 mb-2"
          >
            <span className="text-xs text-accent font-bold">{en ? 'Model answer' : '參考答案'}</span>
            <ChevronDown size={16} aria-hidden className={`text-accent transition-transform ${showAnswer ? 'rotate-180' : ''}`} />
          </button>
          {showAnswer && (
            <div className="text-sm text-ink-soft leading-relaxed px-4 pb-3 mb-2">
              <MathText>{tr(q.referenceAnswer, q.referenceAnswerEn)}</MathText>
            </div>
          )}

          {/* Marking scheme (collapsible) */}
          {q.markingScheme && (
            <>
              <button
                onClick={() => setShowScheme((s) => !s)}
                className="w-full min-h-11 flex items-center justify-between text-left border border-line-strong bg-surface-sunken rounded-xl px-4 py-2.5 mb-2"
              >
                <span className="text-xs text-ink-soft font-bold">{en ? 'Marking scheme / step marks' : '評分準則 / 步驟分'}</span>
                <ChevronDown size={16} aria-hidden className={`text-ink-muted transition-transform ${showScheme ? 'rotate-180' : ''}`} />
              </button>
              {showScheme && (
                <div className="text-sm text-ink-soft leading-relaxed px-4 pb-3 mb-2">
                  <MathText>{tr(q.markingScheme, q.markingSchemeEn)}</MathText>
                </div>
              )}
            </>
          )}

          {/* 解題思路（collapsible）—— 同評分準則分開：準則答「點畀分」，思路答「點解要咁諗」。 */}
          {q.explanation && (
            <>
              <button
                onClick={() => setShowWhy((s) => !s)}
                className="w-full min-h-11 flex items-center justify-between text-left border border-line-strong bg-surface-sunken rounded-xl px-4 py-2.5 mb-2"
              >
                <span className="text-xs text-ink-soft font-bold">{en ? 'How to think about it' : '解題思路'}</span>
                <ChevronDown size={16} aria-hidden className={`text-ink-muted transition-transform ${showWhy ? 'rotate-180' : ''}`} />
              </button>
              {showWhy && (
                <div className="text-sm text-ink-soft leading-relaxed px-4 pb-3 mb-2">
                  <MathText>{tr(q.explanation, q.explanationEn)}</MathText>
                </div>
              )}
            </>
          )}

          {/* 3-level self-assessment */}
          {level === null ? (
            <div className="mt-3">
              <p className="text-sm text-ink-soft mb-2">
                {en ? 'Compare with the model answer — how did you do?' : '對照參考答案，你掌握到幾多？'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => pick(l.key)}
                    className={`min-h-11 text-sm font-semibold py-2.5 rounded-xl border transition-colors ${l.cls}`}
                  >
                    {en ? l.en : l.zh}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink-muted mt-3">
              {en ? '✓ Self-assessment logged.' : '✓ 已記錄你嘅自評。'}
            </div>
          )}

          <a href={reportHref} className="min-h-11 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent mt-4 transition-colors">
            <Flag size={12} aria-hidden /> {en ? 'I disagree / report' : '我唔同意 / 回報'}
          </a>
        </>
      )}
    </div>
  )
}
