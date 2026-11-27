'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { questionError } from '@/lib/research/metrics'
import { formatDay } from '@/lib/research/labels'
import { createId, nextRespondentCode } from '@/lib/research/surveys'
import { clearDraft, readDraft, writeDraft } from '@/lib/research/storage'
import type { AnswerValue, Survey } from '@/lib/research/types'
import { QuestionField } from '@/components/research/QuestionField'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { PublicFrame } from '@/components/research/AdminShell'
import { Button } from '@/components/research/ui'

export function RespondentPage({ surveyId, allowUnpublished }: { surveyId: string; allowUnpublished: boolean }) {
  return (
    <PublicFrame>
      <ResearchGate>
        <RespondentForm surveyId={surveyId} commit allowUnpublished={allowUnpublished} />
      </ResearchGate>
    </PublicFrame>
  )
}

export function RespondentForm({
  surveyId,
  commit,
  allowUnpublished,
}: {
  surveyId: string
  commit: boolean
  allowUnpublished: boolean
}) {
  const { store, update } = useResearch()
  const router = useRouter()
  const survey = store?.surveys.find((item) => item.id === surveyId)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hydrated, setHydrated] = useState(false)
  const [restored, setRestored] = useState(false)
  const [previewDone, setPreviewDone] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    if (!commit) {
      setHydrated(true)
      return
    }
    const draft = readDraft(surveyId)
    if (draft) {
      setAnswers(draft.answers)
      setStep(draft.step)
      setRestored(true)
    }
    setHydrated(true)
  }, [commit, surveyId])

  useEffect(() => {
    if (!commit || !hydrated) return
    if (Object.keys(answers).length === 0 && step === 0) {
      clearDraft(surveyId)
      return
    }
    writeDraft(surveyId, { step, answers, savedAt: new Date().toISOString() })
  }, [answers, commit, hydrated, step, surveyId])

  if (!survey) {
    return (
      <div className="rounded-2xl border border-line bg-surface-raised p-6">
        <h1 className="text-xl font-semibold text-ink">搵唔到呢份問卷</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">可能未儲存在呢部瀏覽器。</p>
        <Link href="/research" className="mt-4 inline-flex min-h-11 items-center text-sm text-accent underline">返回問卷一覽</Link>
      </div>
    )
  }
  if (commit && survey.status !== 'published' && !allowUnpublished) {
    return (
      <div className="rounded-2xl border border-line bg-surface-raised p-6">
        <h1 className="text-xl font-semibold text-ink">呢份問卷而家未開放填寫</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">研究同事暫停、封存或未發佈嘅問卷，唔會喺公開連結接受新回覆。</p>
        <Link href="/research" className="mt-4 inline-flex min-h-11 items-center text-sm text-accent underline">返回問卷一覽</Link>
      </div>
    )
  }
  if (previewDone) {
    return (
      <div className="rounded-2xl border border-line bg-surface-raised p-6" role="status">
        <h2 className="text-xl font-semibold text-ink">預覽送出成功</h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">呢次冇寫入回覆，亦冇清走已儲存嘅示範數據。</p>
        <Button className="mt-4" onClick={() => { setPreviewDone(false); setStep(0); setAnswers({}); setErrors({}) }}>再睇一次</Button>
      </div>
    )
  }
  if (survey.questions.length === 0) {
    return <p className="text-sm text-ink-soft">呢份問卷未有題目。</p>
  }

  const index = Math.min(Math.max(step, 0), survey.questions.length - 1)
  const question = survey.questions[index]
  const note = dateNote(survey)

  function goNext() {
    const message = questionError(question, answers[question.id])
    if (message) {
      setErrors((current) => ({ ...current, [question.id]: message }))
      return
    }
    setStep(index + 1)
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!survey) return
    const nextErrors: Record<string, string> = {}
    for (const item of survey.questions) {
      const message = questionError(item, answers[item.id])
      if (message) nextErrors[item.id] = message
    }
    setErrors(nextErrors)
    const first = survey.questions.findIndex((item) => nextErrors[item.id])
    if (first >= 0) {
      setStep(first)
      return
    }
    if (!commit) {
      setPreviewDone(true)
      return
    }
    const code = nextRespondentCode((store?.responses ?? []).map((item) => item.respondentCode))
    const saved = update((current) => ({
      ...current,
      responses: [
        {
          id: createId('rp'),
          surveyId,
          respondentCode: code,
          submittedAt: new Date().toISOString(),
          answers,
          tags: [],
          status: 'pending',
        },
        ...current.responses,
      ],
    }))
    if (!saved) {
      setSaveError(true)
      return
    }
    clearDraft(surveyId)
    router.push(`/research/s/${surveyId}/thanks?code=${encodeURIComponent(code)}`)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-sm text-ink-muted">{survey.name}</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">{commit ? '填寫問卷' : '預覽填寫'}</h1>
        {survey.purpose ? <p className="mt-2 text-sm leading-6 text-ink-soft">{survey.purpose}</p> : null}
        {note ? <p className="mt-2 text-sm text-warning">{note}</p> : null}
        {restored ? <p className="mt-2 text-sm text-ink-soft">已載入未送出嘅草稿。</p> : null}
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={survey.questions.length}
        aria-valuenow={index + 1}
        aria-valuetext={`第 ${index + 1} 題，共 ${survey.questions.length} 題`}
        className="h-2 rounded-full bg-surface-sunken"
      >
        <div className="h-2 rounded-full bg-accent" style={{ width: `${((index + 1) / survey.questions.length) * 100}%` }} />
      </div>
      <p className="text-sm text-ink-muted">第 {index + 1} 題，共 {survey.questions.length} 題</p>
      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="text-sm font-medium text-error">仲有必填題未完成。</p>
      ) : null}
      <div className="rounded-2xl border border-line bg-surface-raised p-4 sm:p-5">
        <QuestionField
          question={question}
          value={answers[question.id]}
          error={errors[question.id]}
          onChange={(next) => {
            setAnswers((current) => {
              const copy = { ...current }
              if (next) copy[question.id] = next
              else delete copy[question.id]
              return copy
            })
            setErrors((current) => {
              const copy = { ...current }
              delete copy[question.id]
              return copy
            })
          }}
        />
      </div>
      {saveError ? <p role="alert" className="text-sm font-medium text-error">儲存失敗，回覆未送出。</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setStep(index - 1)} disabled={index === 0}>上一題</Button>
        {index < survey.questions.length - 1 ? (
          <Button variant="primary" onClick={goNext}>下一題</Button>
        ) : (
          <Button variant="primary" type="submit">送出</Button>
        )}
      </div>
    </form>
  )
}

function dateNote(survey: Survey): string | null {
  const today = new Date()
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  if (survey.startsOn && day < survey.startsOn) return `問卷日期由 ${formatDay(survey.startsOn)} 開始。而家仍然可以填，方便內部試用。`
  if (survey.endsOn && day > survey.endsOn) return `問卷日期到 ${formatDay(survey.endsOn)}。而家仍然可以填，方便內部試用。`
  return null
}
