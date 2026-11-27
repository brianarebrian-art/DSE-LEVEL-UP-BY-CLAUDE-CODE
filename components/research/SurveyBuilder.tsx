'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { QUESTION_TYPES, SURVEY_STATUSES, type Question, type QuestionType, type Survey, type SurveyStatus } from '@/lib/research/types'
import { QUESTION_TYPE_LABEL, SURVEY_STATUS_LABEL } from '@/lib/research/labels'
import { blankQuestion, createId, moveItem } from '@/lib/research/surveys'
import { RespondentForm } from '@/components/research/RespondentForm'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { Button, FieldLabel, Panel, TextArea, TextInput } from '@/components/research/ui'

const ACTIONS: Record<SurveyStatus, { label: string; status: SurveyStatus }[]> = {
  draft: [{ label: '發佈', status: 'published' }],
  published: [{ label: '暫停', status: 'paused' }, { label: '封存', status: 'archived' }],
  paused: [{ label: '發佈', status: 'published' }, { label: '封存', status: 'archived' }],
  archived: [{ label: '還原為草稿', status: 'draft' }],
}

export function SurveyBuilder({ surveyId }: { surveyId: string }) {
  return (
    <ResearchGate>
      <Builder surveyId={surveyId} />
    </ResearchGate>
  )
}

function Builder({ surveyId }: { surveyId: string }) {
  const { store, update } = useResearch()
  const survey = store?.surveys.find((item) => item.id === surveyId)
  const [preview, setPreview] = useState(false)
  const [nameError, setNameError] = useState('')
  const [copied, setCopied] = useState('')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')
  const [nextType, setNextType] = useState<QuestionType>('single')
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])
  if (!survey) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-ink">搵唔到呢份問卷</h1>
        <Link href="/research/admin/surveys" className="mt-3 inline-flex min-h-11 items-center text-sm text-accent underline">返回問卷</Link>
      </div>
    )
  }

  function save(recipe: (current: Survey) => Survey, stripQuestionId?: string) {
    update((current) => ({
      ...current,
      surveys: current.surveys.map((item) => item.id === surveyId ? { ...recipe(item), updatedAt: new Date().toISOString() } : item),
      responses: stripQuestionId
        ? current.responses.map((response) => {
            if (response.surveyId !== surveyId || !(stripQuestionId in response.answers)) return response
            const answers = { ...response.answers }
            delete answers[stripQuestionId]
            return { ...response, answers }
          })
        : current.responses,
    }))
  }

  function setStatus(status: SurveyStatus) {
    if (status === 'published' && !survey?.name.trim()) {
      setNameError('請填問卷名稱。')
      return
    }
    setNameError('')
    save(() => ({ ...survey!, status }))
  }

  const path = `/research/s/${survey.id}${survey.status === 'published' ? '' : '?preview=1'}`
  const url = `${origin}${path}`

  if (preview) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setPreview(false)}>返回編輯</Button>
        <RespondentForm surveyId={survey.id} commit={false} allowUnpublished />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-warning">{SURVEY_STATUS_LABEL[survey.status]}</p>
          <h1 className="text-2xl font-semibold text-ink">編輯問卷</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACTIONS[survey.status].map((action) => (
            <Button key={action.label} variant={action.status === 'published' ? 'primary' : 'secondary'} onClick={() => setStatus(action.status)}>
              {action.label}
            </Button>
          ))}
          <Button onClick={() => setPreview(true)}>預覽填寫</Button>
        </div>
      </div>
      <Panel title="基本資料">
        <div className="grid gap-3">
          <div>
            <FieldLabel htmlFor="survey-name">名稱</FieldLabel>
            <TextInput id="survey-name" value={survey.name} autoComplete="off" aria-invalid={nameError ? true : undefined} aria-describedby={nameError ? 'survey-name-error' : undefined} onChange={(event) => { setNameError(''); save(() => ({ ...survey, name: event.target.value })) }} />
            {nameError ? <p id="survey-name-error" className="mt-1 text-sm font-medium text-error">{nameError}</p> : null}
          </div>
          <div>
            <FieldLabel htmlFor="survey-description">說明</FieldLabel>
            <TextArea id="survey-description" value={survey.description} onChange={(event) => save(() => ({ ...survey, description: event.target.value }))} />
          </div>
          <div>
            <FieldLabel htmlFor="survey-purpose">測試目的</FieldLabel>
            <TextArea id="survey-purpose" value={survey.purpose} onChange={(event) => save(() => ({ ...survey, purpose: event.target.value }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="survey-start">開始日期</FieldLabel>
              <TextInput id="survey-start" type="date" value={survey.startsOn} onChange={(event) => save(() => ({ ...survey, startsOn: event.target.value }))} />
            </div>
            <div>
              <FieldLabel htmlFor="survey-end">結束日期</FieldLabel>
              <TextInput id="survey-end" type="date" value={survey.endsOn} onChange={(event) => save(() => ({ ...survey, endsOn: event.target.value }))} />
            </div>
          </div>
          <p className="text-sm text-ink-muted">日期欄跟瀏覽器本身嘅日期格式。</p>
        </div>
      </Panel>
      <Panel title="問卷連結">
        <p className="text-sm leading-6 text-ink-soft">
          {survey.status === 'published' ? '公開列表會顯示呢條連結。' : '未發佈。下面條連結帶預覽參數，方便內部試填，唔會出現喺公開列表。'}
        </p>
        <TextInput className="mt-3" readOnly value={url} aria-label="問卷連結" onFocus={(event) => event.currentTarget.select()} />
        <div className="mt-3 flex flex-wrap items-start gap-4">
          <div role="img" aria-label="二維碼預留位置，未產生可掃描嘅碼" className="w-28 rounded-lg border border-dashed border-warning p-2 text-center">
            <svg aria-hidden="true" focusable="false" width="96" height="96" viewBox="0 0 96 96" className="mx-auto text-ink">
              <rect x="4" y="4" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="64" y="4" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="4" y="64" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="40" y="40" width="12" height="12" fill="currentColor" />
              <rect x="60" y="60" width="8" height="8" fill="currentColor" />
            </svg>
            <p className="mt-1 text-xs font-medium text-warning">二維碼預留位置</p>
          </div>
          <div>
            <p className="text-sm text-ink-soft">而家未產生可掃描嘅碼。請複製連結。</p>
            <Button
              className="mt-2"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url)
                  setCopied('已複製連結')
                } catch {
                  setCopied('請手動複製上面條連結')
                }
              }}
            >
              複製連結
            </Button>
            {copied ? <p role="status" className="mt-2 text-sm text-ink">{copied}</p> : null}
          </div>
        </div>
      </Panel>
      <Panel title="題目">
        <ol className="space-y-4">
          {survey.questions.map((question, index) => (
            <li key={question.id} className="rounded-xl border border-line p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                <label className="text-sm text-ink">
                  題型
                  <select
                    className="ml-2 min-h-11 rounded-lg border border-line-strong bg-surface-raised px-2 text-base"
                    value={question.type}
                    onChange={(event) => {
                      const type = event.target.value as QuestionType
                      const next = blankQuestion(type, question.id)
                      next.prompt = question.prompt
                      next.helpText = question.helpText
                      next.required = question.required
                      save((current) => ({
                        ...current,
                        questions: current.questions.map((item) => item.id === question.id ? next : item),
                      }), question.id)
                    }}
                  >
                    {QUESTION_TYPES.map((type) => <option key={type} value={type}>{QUESTION_TYPE_LABEL[type]}</option>)}
                  </select>
                </label>
                <Button onClick={() => save((current) => ({ ...current, questions: moveItem(current.questions, index, -1) }))} disabled={index === 0}>上移</Button>
                <Button onClick={() => save((current) => ({ ...current, questions: moveItem(current.questions, index, 1) }))} disabled={index === survey.questions.length - 1}>下移</Button>
                {pendingDelete === question.id ? (
                  <Button variant="warning" onClick={() => {
                    save((current) => ({ ...current, questions: current.questions.filter((item) => item.id !== question.id) }), question.id)
                    setPendingDelete(null)
                  }}>確認刪除</Button>
                ) : (
                  <Button onClick={() => setPendingDelete(question.id)}>刪除</Button>
                )}
              </div>
              <FieldLabel htmlFor={`${question.id}-prompt`}>題目</FieldLabel>
              <TextArea id={`${question.id}-prompt`} value={question.prompt} onChange={(event) => patchQuestion(question, { prompt: event.target.value })} />
              <div className="mt-3">
                <FieldLabel htmlFor={`${question.id}-help`}>說明文字</FieldLabel>
                <TextInput id={`${question.id}-help`} value={question.helpText} autoComplete="off" onChange={(event) => patchQuestion(question, { helpText: event.target.value })} />
              </div>
              <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={question.required} onChange={(event) => patchQuestion(question, { required: event.target.checked })} />
                必填
              </label>
              {question.type === 'single' || question.type === 'multiple' ? (
                <OptionEditor question={question} onChange={(options) => patchQuestion(question, { options })} />
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label className="text-sm text-ink">
            新題型
            <select className="ml-2 min-h-11 rounded-lg border border-line-strong bg-surface-raised px-2 text-base" value={nextType} onChange={(event) => setNextType(event.target.value as QuestionType)}>
              {QUESTION_TYPES.map((type) => <option key={type} value={type}>{QUESTION_TYPE_LABEL[type]}</option>)}
            </select>
          </label>
          <Button variant="primary" onClick={() => save((current) => ({ ...current, questions: [...current.questions, blankQuestion(nextType, createId('q'))] }))}>
            加入題目
          </Button>
        </div>
      </Panel>
      <p className="text-sm text-ink-muted">可用狀態：{SURVEY_STATUSES.map((status) => SURVEY_STATUS_LABEL[status]).join('、')}</p>
    </div>
  )

  function patchQuestion(question: Question, patch: Partial<Question>) {
    save((current) => ({
      ...current,
      questions: current.questions.map((item) => item.id === question.id ? { ...item, ...patch } : item),
    }))
  }
}

function OptionEditor({
  question,
  onChange,
}: {
  question: Question
  onChange: (options: Question['options']) => void
}) {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm font-medium text-ink">選項</p>
      {question.options.map((option, index) => (
        <div key={option.id} className="flex flex-wrap gap-2">
          <TextInput
            aria-label={`選項 ${index + 1}`}
            value={option.label}
            autoComplete="off"
            onChange={(event) => onChange(question.options.map((item) => item.id === option.id ? { ...item, label: event.target.value } : item))}
          />
          <Button onClick={() => onChange(moveItem(question.options, index, -1))} disabled={index === 0}>上移</Button>
          <Button onClick={() => onChange(moveItem(question.options, index, 1))} disabled={index === question.options.length - 1}>下移</Button>
          <Button onClick={() => onChange(question.options.filter((item) => item.id !== option.id))} disabled={question.options.length <= 1}>移除</Button>
        </div>
      ))}
      <Button onClick={() => onChange([...question.options, { id: createId('opt'), label: '新選項' }])}>加選項</Button>
    </div>
  )
}
