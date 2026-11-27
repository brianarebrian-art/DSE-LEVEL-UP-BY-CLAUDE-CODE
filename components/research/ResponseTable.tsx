'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { downloadCsv, responsesToCsv } from '@/lib/research/csv'
import { aggregate, completionRate, filterResponses, npsScore, satisfactionScore } from '@/lib/research/metrics'
import {
  formatPercent,
  formatScore,
  formatWhen,
  RESPONSE_STATUS_LABEL,
  TAG_LABEL,
} from '@/lib/research/labels'
import { RESPONSE_STATUSES, TAG_IDS, type ResponseFilters, type Survey, type SurveyResponse } from '@/lib/research/types'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { Button, TextInput } from '@/components/research/ui'

const EMPTY_FILTERS: ResponseFilters = { query: '', surveyId: '', status: '', tag: '', from: '', to: '' }

export function ResponseTable() {
  return (
    <ResearchGate>
      <TableBody />
    </ResearchGate>
  )
}

function TableBody() {
  const { store } = useResearch()
  const [filters, setFilters] = useState<ResponseFilters>(EMPTY_FILTERS)
  const rows = useMemo(() => {
    if (!store) return []
    return filterResponses(store.surveys, store.responses, filters)
      .slice()
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  }, [filters, store])
  if (!store) return null
  const active = Object.values(filters).some((value) => value !== '')
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">回覆</h1>
          <p className="mt-1 text-sm text-ink-soft">NPS 欄係呢個人嘅 0–10 分。分析頁先計推薦指數。滿意度由 1–5 量表計出。</p>
        </div>
        <Button
          variant="primary"
          onClick={() => downloadCsv('dse-level-up-research-responses.csv', responsesToCsv(store.surveys, rows))}
          disabled={rows.length === 0}
        >
          匯出 CSV
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm text-ink">
          搜尋
          <TextInput className="mt-1" value={filters.query} autoComplete="off" aria-label="搜尋回覆" placeholder="編號、ID 或問卷名稱" onChange={(event) => setFilters({ ...filters, query: event.target.value })} />
        </label>
        <label className="text-sm text-ink">
          問卷
          <select className="mt-1 w-full min-h-11 rounded-lg border border-line-strong bg-surface-raised px-3 text-base" value={filters.surveyId} onChange={(event) => setFilters({ ...filters, surveyId: event.target.value })}>
            <option value="">全部問卷</option>
            {store.surveys.map((survey) => <option key={survey.id} value={survey.id}>{survey.name}</option>)}
          </select>
        </label>
        <label className="text-sm text-ink">
          狀態
          <select className="mt-1 w-full min-h-11 rounded-lg border border-line-strong bg-surface-raised px-3 text-base" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as ResponseFilters['status'] })}>
            <option value="">全部狀態</option>
            {RESPONSE_STATUSES.map((status) => <option key={status} value={status}>{RESPONSE_STATUS_LABEL[status]}</option>)}
          </select>
        </label>
        <label className="text-sm text-ink">
          標籤
          <select className="mt-1 w-full min-h-11 rounded-lg border border-line-strong bg-surface-raised px-3 text-base" value={filters.tag} onChange={(event) => setFilters({ ...filters, tag: event.target.value as ResponseFilters['tag'] })}>
            <option value="">全部標籤</option>
            {TAG_IDS.map((tag) => <option key={tag} value={tag}>{TAG_LABEL[tag]}</option>)}
          </select>
        </label>
        <label className="text-sm text-ink">
          由
          <TextInput className="mt-1" type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} />
        </label>
        <label className="text-sm text-ink">
          至
          <TextInput className="mt-1" type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} />
        </label>
      </div>
      {active ? <Button onClick={() => setFilters(EMPTY_FILTERS)}>清除篩選</Button> : null}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-raised p-6">
          <h2 className="text-lg font-semibold text-ink">{active ? '冇符合篩選嘅回覆' : '未有回覆'}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {active ? '試下清走篩選，或者換一個問卷。示範數據仍然留喺呢部瀏覽器。' : '公開問卷收到嘅回覆會出現喺呢度。'}
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {rows.map((response) => {
              const survey = store.surveys.find((item) => item.id === response.surveyId)
              return (
                <li key={response.id} className="rounded-2xl border border-line bg-surface-raised p-4">
                  <Link href={`/research/admin/responses/${response.id}`} className="text-base font-semibold text-ink underline-offset-4 hover:underline">{response.respondentCode}</Link>
                  <p className="mt-1 text-sm text-ink-muted">{response.id} · {formatWhen(response.submittedAt)}</p>
                  <p className="mt-2 text-sm text-ink">{survey?.name}</p>
                  <Meta response={response} survey={survey} />
                </li>
              )
            })}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">研究回覆</caption>
              <thead>
                <tr className="border-b border-line text-ink-muted">
                  {['ID', '受訪編號', '時間', '完成率', '滿意度', 'NPS', '標籤', '狀態'].map((heading) => (
                    <th key={heading} scope="col" className="px-2 py-2 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((response) => {
                  const survey = store.surveys.find((item) => item.id === response.surveyId)
                  return (
                    <tr key={response.id} className="border-b border-line align-top">
                      <td className="px-2 py-3">
                        <Link href={`/research/admin/responses/${response.id}`} className="text-ink underline-offset-4 hover:underline">{response.id}</Link>
                      </td>
                      <td className="px-2 py-3">{response.respondentCode}</td>
                      <td className="px-2 py-3">{formatWhen(response.submittedAt)}</td>
                      <td className="px-2 py-3">{survey ? formatPercent(completionRate(survey, response)) : '未有'}</td>
                      <td className="px-2 py-3">{survey ? formatScore(satisfactionScore(survey, response)) : '未有'}</td>
                      <td className="px-2 py-3">{survey && npsScore(survey, response) != null ? npsScore(survey, response) : '未有'}</td>
                      <td className="px-2 py-3">{response.tags.map((tag) => TAG_LABEL[tag]).join('、') || '無'}</td>
                      <td className="px-2 py-3">{RESPONSE_STATUS_LABEL[response.status]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="text-sm text-ink-muted">而家顯示 {rows.length} 份。全部回覆 {store.responses.length} 份。</p>
      <p className="sr-only">篩選後回覆 {aggregate(store.surveys, rows).responseCount} 份。</p>
    </div>
  )
}

function Meta({ response, survey }: { response: SurveyResponse; survey: Survey | undefined }) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
      <div><dt className="text-ink-muted">完成率</dt><dd>{survey ? formatPercent(completionRate(survey, response)) : '未有'}</dd></div>
      <div><dt className="text-ink-muted">滿意度</dt><dd>{survey ? formatScore(satisfactionScore(survey, response)) : '未有'}</dd></div>
      <div><dt className="text-ink-muted">NPS</dt><dd>{survey && npsScore(survey, response) != null ? npsScore(survey, response) : '未有'}</dd></div>
      <div><dt className="text-ink-muted">狀態</dt><dd>{RESPONSE_STATUS_LABEL[response.status]}</dd></div>
      <div className="col-span-2"><dt className="text-ink-muted">標籤</dt><dd>{response.tags.map((tag) => TAG_LABEL[tag]).join('、') || '無'}</dd></div>
    </dl>
  )
}
