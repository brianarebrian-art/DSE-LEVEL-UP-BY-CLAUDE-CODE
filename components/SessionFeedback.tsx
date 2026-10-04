'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import type { FeedbackAnswer, FeedbackQuestion } from '@/lib/sessionFeedback'

// Two optional questions under the score on /result (audit #8, founders' reply 5a; wording
// approved as drafted, "5 ok", 2026-10-04). Nothing blocks the page: a student can skip both.
// Each tap sends one answer (lib/sessionFeedback.ts). "Thank you" is shown only after the
// server answers { ok: true }; a failed send says so and the buttons stay usable.

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const OPTIONS: Record<FeedbackQuestion, { answer: FeedbackAnswer; zh: string; en: string }[]> = {
  had_error: [
    { answer: 'no', zh: '冇', en: 'No' },
    { answer: 'yes', zh: '有', en: 'Yes' },
    { answer: 'unsure', zh: '唔肯定', en: 'Not sure' },
  ],
  will_return: [
    { answer: 'yes', zh: '會', en: 'Yes' },
    { answer: 'no', zh: '唔會', en: 'No' },
    { answer: 'unsure', zh: '未知', en: 'Not sure' },
  ],
}

export default function SessionFeedback({ subjectId, total }: { subjectId: string; total: number }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [picked, setPicked] = useState<Partial<Record<FeedbackQuestion, FeedbackAnswer>>>({})
  const [status, setStatus] = useState<Record<FeedbackQuestion, Status>>({ had_error: 'idle', will_return: 'idle' })

  const send = async (question: FeedbackQuestion, answer: FeedbackAnswer) => {
    if (status[question] === 'sending' || status[question] === 'sent') return
    setPicked((p) => ({ ...p, [question]: answer }))
    setStatus((s) => ({ ...s, [question]: 'sending' }))
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject: subjectId, question, answer, locale: en ? 'en' : 'zh' }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null
      setStatus((s) => ({ ...s, [question]: res.ok && data?.ok === true ? 'sent' : 'failed' }))
    } catch {
      setStatus((s) => ({ ...s, [question]: 'failed' }))
    }
  }

  const questions: { key: FeedbackQuestion; zh: string; en: string }[] = [
    { key: 'had_error', zh: `呢 ${total} 題入面，你覺得有冇題目出錯？`, en: `Did any of these ${total} questions look wrong to you?` },
    { key: 'will_return', zh: '下次溫書，你會唔會再用呢度？', en: 'Will you use this site again next time you revise?' },
  ]
  const bothSent = status.had_error === 'sent' && status.will_return === 'sent'

  return (
    <section aria-label={en ? 'Two quick questions' : '兩條問題'} className="no-print space-y-4 rounded-2xl border border-line bg-surface-raised p-4">
      {questions.map((q) => (
        <fieldset key={q.key}>
          <legend className="mb-2 text-sm text-ink">{en ? q.en : q.zh}</legend>
          <div className="flex flex-wrap gap-2">
            {OPTIONS[q.key].map((o) => {
              const on = picked[q.key] === o.answer
              return (
                <button
                  key={o.answer}
                  type="button"
                  aria-pressed={on}
                  disabled={status[q.key] === 'sending' || status[q.key] === 'sent'}
                  onClick={() => send(q.key, o.answer)}
                  className={`inline-flex min-h-11 min-w-16 items-center justify-center rounded-xl border px-4 text-sm transition-colors disabled:cursor-default ${
                    on ? 'border-accent bg-accent/10 text-ink' : 'border-line-strong text-ink-soft hover:border-accent hover:text-accent'
                  }`}
                >
                  {en ? o.en : o.zh}
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="mt-2 text-xs leading-relaxed text-ink-muted">
            {status[q.key] === 'failed'
              ? en
                ? 'That did not go through. You can press it again.'
                : '傳送唔到，可以再撳一次。'
              : q.key === 'had_error' && status.had_error === 'sent' && picked.had_error === 'yes'
                ? en
                  ? 'Thanks! Next time you see a question with a problem, press “Something wrong with this question?” under it, so we know which one.'
                  : '多謝！下次見到有問題嘅題目，可以喺嗰條題下面撳「呢條題有問題？話我哋知」，我哋就知道係邊條。'
                : ''}
          </p>
        </fieldset>
      ))}
      {bothSent && (
        <p role="status" className="text-sm text-ink">
          {en ? 'Thanks for telling us!' : '多謝你話我哋知！'}
        </p>
      )}
    </section>
  )
}
