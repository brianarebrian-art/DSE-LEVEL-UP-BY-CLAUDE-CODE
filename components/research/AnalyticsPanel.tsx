'use client'

import { useMemo, useState } from 'react'
import { aggregate, filterResponses, prioritySuggestions, taskAnswers } from '@/lib/research/metrics'
import { formatPercent, TAG_LABEL, TASK_LABEL } from '@/lib/research/labels'
import type { TaskValue } from '@/lib/research/types'
import { MetricGrid } from '@/components/research/Overview'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { Button, Panel, TextInput } from '@/components/research/ui'

export function AnalyticsPanel() {
  return (
    <ResearchGate>
      <AnalyticsBody />
    </ResearchGate>
  )
}

function AnalyticsBody() {
  const { store } = useResearch()
  const [surveyId, setSurveyId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const filtered = useMemo(() => {
    if (!store) return []
    return filterResponses(store.surveys, store.responses, { query: '', surveyId, status: '', tag: '', from, to })
  }, [from, store, surveyId, to])
  if (!store) return null
  const active = Boolean(surveyId || from || to)
  const summary = aggregate(store.surveys, filtered)
  const suggestions = prioritySuggestions(store.surveys, filtered)
  const maxTag = Math.max(1, ...summary.tagCounts.map((row) => row.count))
  const npsCounts = Array.from({ length: 11 }, () => 0)
  const taskCounts: Record<TaskValue, number> = { done: 0, partial: 0, unable: 0 }
  for (const response of filtered) {
    const survey = store.surveys.find((item) => item.id === response.surveyId)
    if (!survey) continue
    for (const question of survey.questions) {
      const answer = response.answers[question.id]
      if (question.type === 'nps' && answer?.type === 'nps' && answer.score >= 0 && answer.score <= 10) npsCounts[answer.score] += 1
    }
    for (const value of taskAnswers(survey, response)) taskCounts[value] += 1
  }
  const npsMax = Math.max(1, ...npsCounts)
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">分析</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
          以下數字由篩選後嘅示範回覆計出，描述 DSE Level Up 嘅練習、題庫、可列印練習卷、難度標籤同登入返回。唔係考評局數據。
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm text-ink">
          問卷
          <select className="mt-1 w-full min-h-11 rounded-lg border border-line-strong bg-surface-raised px-3 text-base" value={surveyId} onChange={(event) => setSurveyId(event.target.value)}>
            <option value="">全部問卷</option>
            {store.surveys.map((survey) => <option key={survey.id} value={survey.id}>{survey.name}</option>)}
          </select>
        </label>
        <label className="text-sm text-ink">由<TextInput className="mt-1" type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
        <label className="text-sm text-ink">至<TextInput className="mt-1" type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
      </div>
      {active ? <Button onClick={() => { setSurveyId(''); setFrom(''); setTo('') }}>清除篩選</Button> : null}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-raised p-6">
          <h2 className="text-lg font-semibold text-ink">{active ? '冇符合篩選嘅回覆' : '未有回覆'}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">試下清走日期或換成全部問卷。</p>
        </div>
      ) : (
        <>
          <MetricGrid summary={summary} />
          <Panel title="標籤排名">
            <ul className="space-y-3">
              {summary.tagCounts.map((row) => (
                <li key={row.tag}>
                  <div className="flex justify-between gap-3 text-sm text-ink">
                    <span>{TAG_LABEL[row.tag]}</span>
                    <span>{row.count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-sunken" aria-hidden="true">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${(row.count / maxTag) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="NPS 分佈">
            <p className="mb-3 text-sm text-ink-soft">直柱由左至右係 0 到 10。9–10 係推薦，7–8 係中性，0–6 係唔推薦。</p>
            <svg viewBox="0 0 330 120" width="320" height="120" role="img" aria-label="NPS 由 0 至 10 的回覆數量" className="h-auto w-full max-w-full">
              {npsCounts.map((count, score) => {
                const height = (count / npsMax) * 88
                const fill = score >= 9 ? 'var(--color-success)' : score >= 7 ? 'var(--color-info)' : 'var(--color-warning)'
                return (
                  <g key={score}>
                    <rect x={8 + score * 29} y={96 - height} width="18" height={height} fill={fill} />
                    <text x={17 + score * 29} y="112" textAnchor="middle" fontSize="10" fill="var(--color-ink)">{score}</text>
                  </g>
                )
              })}
            </svg>
            <table className="mt-3 w-full text-left text-sm">
              <caption className="sr-only">NPS 分數數量</caption>
              <thead><tr>{npsCounts.map((_, score) => <th key={score} className="px-1 font-medium text-ink-muted">{score}</th>)}</tr></thead>
              <tbody><tr>{npsCounts.map((count, score) => <td key={score} className="px-1 text-ink">{count}</td>)}</tr></tbody>
            </table>
          </Panel>
          <Panel title="任務完成">
            <ul className="space-y-2 text-sm text-ink">
              {(Object.keys(TASK_LABEL) as TaskValue[]).map((value) => (
                <li key={value} className="flex justify-between gap-3">
                  <span>{TASK_LABEL[value]}</span>
                  <span>{taskCounts[value]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-soft">任務完成率 {formatPercent(summary.taskSuccess)}。只有「完成」計入成功率，部分完成另列。</p>
          </Panel>
          <Panel title="優先改善建議">
            <ul className="space-y-3">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </div>
  )
}
