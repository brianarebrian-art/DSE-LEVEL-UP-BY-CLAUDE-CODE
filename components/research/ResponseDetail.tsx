'use client'

import Link from 'next/link'
import { formatAnswer } from '@/lib/research/metrics'
import { completionRate, npsScore, satisfactionScore } from '@/lib/research/metrics'
import { formatPercent, formatScore, formatWhen, RESPONSE_STATUS_LABEL, TAG_LABEL } from '@/lib/research/labels'
import { RESPONSE_STATUSES, TAG_IDS, type ResponseStatus, type TagId } from '@/lib/research/types'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { Button, Panel } from '@/components/research/ui'

export function ResponseDetail({ responseId }: { responseId: string }) {
  return (
    <ResearchGate>
      <Detail responseId={responseId} />
    </ResearchGate>
  )
}

function Detail({ responseId }: { responseId: string }) {
  const { store, update } = useResearch()
  const response = store?.responses.find((item) => item.id === responseId)
  const survey = store?.surveys.find((item) => item.id === response?.surveyId)
  if (!response || !survey) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-ink">搵唔到呢份回覆</h1>
        <Link href="/research/admin/responses" className="mt-3 inline-flex min-h-11 items-center text-sm text-accent underline">返回回覆</Link>
      </div>
    )
  }
  function toggleTag(tag: TagId) {
    update((current) => ({
      ...current,
      responses: current.responses.map((item) => {
        if (item.id !== responseId) return item
        const tags = item.tags.includes(tag) ? item.tags.filter((value) => value !== tag) : [...item.tags, tag]
        return { ...item, tags }
      }),
    }))
  }
  return (
    <div className="space-y-4">
      <Link href="/research/admin/responses" className="inline-flex min-h-11 items-center text-sm text-accent underline-offset-4 hover:underline">返回回覆</Link>
      <div>
        <h1 className="text-2xl font-semibold text-ink">{response.respondentCode}</h1>
        <p className="mt-1 text-sm text-ink-muted">{response.id} · {formatWhen(response.submittedAt)} · {survey.name}</p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface-raised p-3"><dt className="text-sm text-ink-muted">完成率</dt><dd className="text-xl font-semibold">{formatPercent(completionRate(survey, response))}</dd></div>
        <div className="rounded-xl border border-line bg-surface-raised p-3"><dt className="text-sm text-ink-muted">滿意度（1–5）</dt><dd className="text-xl font-semibold">{formatScore(satisfactionScore(survey, response))}</dd></div>
        <div className="rounded-xl border border-line bg-surface-raised p-3"><dt className="text-sm text-ink-muted">NPS（0–10）</dt><dd className="text-xl font-semibold">{npsScore(survey, response) ?? '未有'}</dd></div>
      </dl>
      <Panel title="狀態">
        <label className="text-sm text-ink">
          處理狀態
          <select
            className="mt-1 w-full min-h-11 rounded-lg border border-line-strong bg-surface-raised px-3 text-base"
            value={response.status}
            onChange={(event) => {
              const status = event.target.value as ResponseStatus
              update((current) => ({
                ...current,
                responses: current.responses.map((item) => item.id === responseId ? { ...item, status } : item),
              }))
            }}
          >
            {RESPONSE_STATUSES.map((status) => <option key={status} value={status}>{RESPONSE_STATUS_LABEL[status]}</option>)}
          </select>
        </label>
      </Panel>
      <Panel title="標籤">
        <div className="flex flex-wrap gap-2">
          {TAG_IDS.map((tag) => {
            const on = response.tags.includes(tag)
            return (
              <Button key={tag} variant={on ? 'primary' : 'secondary'} aria-pressed={on} onClick={() => toggleTag(tag)}>
                {TAG_LABEL[tag]}
              </Button>
            )
          })}
        </div>
      </Panel>
      <Panel title="答案">
        <ol className="space-y-4">
          {survey.questions.map((question, index) => (
            <li key={question.id}>
              <p className="text-sm font-medium text-ink">{index + 1}. {question.prompt}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink-soft">{formatAnswer(question, response.answers[question.id])}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}
