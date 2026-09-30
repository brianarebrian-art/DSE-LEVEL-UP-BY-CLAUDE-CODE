'use client'

import { useState } from 'react'
import { ChevronDown, Flag, Clock } from 'lucide-react'
import MathText from '@/components/MathText'
// 第 3 週 · 引擎五之三：分步提示（只俾方向，唔收學生嘅字，結構上做唔到自動評分）
import StepHints from '@/components/StepHints'
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

/** 自我檢查的四項（LOOP 33）。只供對照，不計分。 */
export const RUBRIC = [
  { key: 'content', zh: '內容完整：題目要求嘅部分都有答', en: 'Complete: every part of the question is answered' },
  { key: 'concept', zh: '概念正確：用詞同解釋冇錯', en: 'Correct concepts: terms and explanations are right' },
  { key: 'evidence', zh: '論點有證據：每個論點都有例子或數據支持', en: 'Supported: each point has an example or evidence' },
  { key: 'structure', zh: '結構清晰：分段、次序令人易明', en: 'Clear structure: paragraphs and order are easy to follow' },
] as const

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
  // 自我檢查清單（LOOP 33）：只幫學生對照，不儲存、不計分、不影響下面的自評。
  const [checks, setChecks] = useState<Record<string, boolean>>({})

  const pick = (l: Level) => {
    if (level) return
    setLevel(l)
    onResult?.(l)
  }

  const reportHref = `mailto:dselevelup@gmail.com?subject=${encodeURIComponent(`[${en ? 'Question report' : '題目回報'}] ${q.id}`)}`

  const levels: { key: Level; zh: string; en: string; cls: string }[] = [
    // 2026-09-30（LOOP 33）：原文「完全掌握／仲未掌握」。自評比對的是參考答案，不是掌握程度。
    { key: 'full', zh: '大致對到', en: 'Mostly matches', cls: 'border-accent/40 bg-surface-sunken hover:bg-surface-sunken text-accent' },
    { key: 'partial', zh: '對到部分', en: 'Partly', cls: 'border-gold/40 bg-surface-sunken hover:bg-surface-sunken text-gold' },
    { key: 'none', zh: '未對到', en: 'Not yet', cls: 'border-line-strong bg-surface-sunken hover:bg-line text-ink-soft' },
  ]

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6">
      {/* 題型標籤 + 建議用時 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[11px] font-bold tracking-wide text-gold bg-surface-sunken border border-gold/30 rounded-full px-2.5 py-1">
          {en ? 'Long response' : '長題目'}
        </span>
        {q.suggestedMinutes ? (
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Clock size={12} aria-hidden /> {en ? `~${q.suggestedMinutes} min` : `建議用時 ${q.suggestedMinutes} 分鐘`}
          </span>
        ) : null}
      </div>

      <div className="text-sm sm:text-base text-ink leading-relaxed mb-4 whitespace-pre-line">
        <MathText>{tr(q.content, q.contentEn)}</MathText>
      </div>

      {!submitted ? (
        <>
          {/* 分步提示擺喺輸入框【之上】：學生卡住嗰陣係落筆之前，唔係寫完之後。
              預設收埋成一行細字，唔會搶走空白紙嘅位置。 */}
          <div className="mb-3">
            <StepHints subjectId={q.subject} />
          </div>
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
            <div className="text-sm text-ink-soft leading-relaxed px-4 pb-3 mb-2 whitespace-pre-line">
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
                <div className="text-sm text-ink-soft leading-relaxed px-4 pb-3 mb-2 whitespace-pre-line">
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
                <div className="text-sm text-ink-soft leading-relaxed px-4 pb-3 mb-2 whitespace-pre-line">
                  <MathText>{tr(q.explanation, q.explanationEn)}</MathText>
                </div>
              )}
            </>
          )}

          {/* 自我檢查清單（第二份 loop prompt §26，LOOP 33）。憲章 §16.A：本站不批改書寫題。 */}
          <fieldset className="mt-4 rounded-xl border border-line p-4">
            <legend className="px-1 text-sm font-medium text-ink">
              {en ? 'Check your answer yourself' : '自己對一對'}
            </legend>
            <p className="mb-2 text-xs text-ink-muted">
              {en
                ? 'This site does not mark written answers. Tick what your answer does, comparing it with the model answer and marking scheme. Nothing here is saved.'
                : '本站唔會幫你評分。對住參考答案同評分準則，剔低你嘅答案做到嘅項目。呢度唔會儲存。'}
            </p>
            {RUBRIC.map((r) => (
              <label key={r.key} className="flex min-h-11 items-center gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  className="h-5 w-5 shrink-0 accent-[var(--color-accent-strong)]"
                  checked={!!checks[r.key]}
                  onChange={(e) => setChecks((c) => ({ ...c, [r.key]: e.target.checked }))}
                />
                {en ? r.en : r.zh}
              </label>
            ))}
          </fieldset>

          {/* 3-level self-assessment */}
          {level === null ? (
            <div className="mt-3">
              <p className="text-sm text-ink-soft mb-2">
                {en ? 'Overall, how close is your answer to the model answer?' : '整體嚟講，你嘅答案同參考答案有幾接近？'}
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
