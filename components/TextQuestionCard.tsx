'use client'

import { useState } from 'react'
import { CheckCircle2, Lightbulb, Flag } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import type { TextQuestion } from '@/data/questions/types'

// 文字題 — a short free-text answer. HONESTY RULE: we never claim to auto-grade. After
// the student submits, we reveal the reference answer and they self-mark. The result is
// passed up via onResult so the host can log it (reverseLog / topicStats).
//
// ── 2026-07-31 接線（Brian 拍板）───────────────────────────────────────────────
// 本組件由 2026-07-01 起一直冇被 import 過。今次接線同時做兩件事：
//
// 1. 全面改用語意 token。原本寫死深色（bg-slate-900 / text-slate-*），喺 Light
//    主題下會變成一塊突兀嘅深色島。現時跟主題走，兩個主題都過 WCAG AA。
//
// 2. 「答錯」按憲章大愛紅線改寫。原本係 ✗ XCircle + 「我錯咗」+「已記錄：答錯」——
//    憲章明文禁大紅交叉同打擊自信字眼，要求改為「再諗下💡／你發現咗一個新盲點」。
//    改用 💡 Lightbulb + 「未掌握到」，同 PracticeSession 既有語氣一致。
//    注意：呢個係【學生自己講】嘅，唔係機器判佢錯 —— 措辭更加唔應該似判決。
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
    `[${en ? 'Question report' : '題目回報'}] ${q.id}`,
  )}&body=${encodeURIComponent(en ? 'I disagree with the reference answer because:\n' : '我對這題參考答案有不同看法，因為：\n')}`

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6">
      {/* 題型標籤 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold tracking-wide text-gold bg-gold/10 border border-gold/30 rounded-full px-2.5 py-1">
          {en ? 'Text answer' : '文字題'}
        </span>
        <span className="text-xs text-ink-muted">{q.frameworkEmoji} {tr(q.frameworkZh, q.frameworkEn)}</span>
      </div>

      <div className="text-sm sm:text-base text-ink leading-relaxed mb-4">
        <MathText>{tr(q.content, q.contentEn)}</MathText>
      </div>

      {!submitted ? (
        <>
          <textarea
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={en ? 'Type your answer…' : '輸入你嘅答案...'}
            aria-label={en ? 'Your answer' : '你嘅答案'}
            className="w-full bg-surface-sunken border border-line-strong focus:border-accent outline-none rounded-xl px-3 py-2.5 text-sm text-ink-soft placeholder:text-ink-muted resize-none"
          />
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
          {/* Student's answer echo */}
          <div className="text-xs text-ink-muted mb-1">{en ? 'Your answer' : '你嘅答案'}</div>
          <div className="text-sm text-ink-soft bg-surface-sunken rounded-lg px-3 py-2 mb-4 whitespace-pre-wrap break-words">
            {value}
          </div>

          {/* 參考答案 —— 用青（accent）而唔用綠：全站冇綠 token，青本身係正向主色 */}
          <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 mb-3">
            <div className="text-xs text-accent font-bold mb-1">{en ? 'Reference answer' : '參考答案'}</div>
            <div className="text-sm text-ink-soft leading-relaxed">
              <MathText>{tr(q.referenceAnswer, q.referenceAnswerEn)}</MathText>
            </div>
          </div>

          {q.explanation && (
            <div className="text-sm text-ink-muted leading-relaxed mb-4">
              <MathText>{tr(q.explanation, q.explanationEn)}</MathText>
            </div>
          )}

          {/* 自評 —— 機器【永不】批改，由學生對照參考答案自己判斷 */}
          {marked === null ? (
            <div>
              <p className="text-sm text-ink-soft mb-2">
                {en ? 'Compare with the reference — how did you do?' : '對照參考答案，你掌握到未？'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => mark('correct')}
                  className="min-h-11 inline-flex items-center justify-center gap-2 border border-accent/40 bg-accent/10 hover:bg-accent/15 text-accent font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <CheckCircle2 size={16} aria-hidden /> {en ? 'I got it' : '我掌握到'}
                </button>
                <button
                  onClick={() => mark('wrong')}
                  className="min-h-11 inline-flex items-center justify-center gap-2 border border-gold/40 bg-gold/10 hover:bg-gold/15 text-gold font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Lightbulb size={16} aria-hidden /> {en ? 'Not yet' : '未掌握到'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink-muted">
              {marked === 'correct'
                ? en ? '✓ Logged — you got it.' : '✓ 已記錄：你掌握到'
                : en ? '💡 A new blind spot found — saved to your review.' : '💡 你發現咗一個新盲點，已寫入你嘅溫習'}
            </div>
          )}

          <a
            href={reportHref}
            className="min-h-11 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent mt-4 transition-colors"
          >
            <Flag size={12} aria-hidden /> {en ? 'I disagree / report' : '我唔同意 / 回報'}
          </a>
        </>
      )}
    </div>
  )
}
