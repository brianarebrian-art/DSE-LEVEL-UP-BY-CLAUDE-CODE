'use client'

import Link from 'next/link'
import { aggregate, prioritySuggestions } from '@/lib/research/metrics'
import { formatNps, formatPercent, formatScore, formatWhen, RESPONSE_STATUS_LABEL } from '@/lib/research/labels'
import type { ResearchAggregate } from '@/lib/research/metrics'
import { useResearch, ResearchGate } from '@/components/research/ResearchProvider'
import { Panel } from '@/components/research/ui'

export function MetricGrid({ summary }: { summary: ResearchAggregate }) {
  const items = [
    ['回覆', String(summary.responseCount)],
    ['完成率', formatPercent(summary.completion)],
    ['滿意度（1–5）', summary.satisfaction == null ? '未有' : formatScore(summary.satisfaction)],
    ['NPS', formatNps(summary.nps)],
    ['任務完成', formatPercent(summary.taskSuccess)],
    ['SUS', summary.sus == null ? '未有' : formatScore(summary.sus)],
  ]
  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-line bg-surface p-3">
          <dt className="text-sm text-ink-muted">{label}</dt>
          <dd className="mt-1 text-2xl font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Overview() {
  return (
    <ResearchGate>
      <OverviewBody />
    </ResearchGate>
  )
}

function OverviewBody() {
  const { store } = useResearch()
  if (!store) return null
  const summary = aggregate(store.surveys, store.responses)
  const suggestions = prioritySuggestions(store.surveys, store.responses)
  const recent = store.responses.slice().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5)
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">總覽</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
          數字由呢部瀏覽器入面嘅示範回覆計出，描述練習流程、題庫、可列印練習卷、難度標籤同登入返回。唔係考評局數據。
        </p>
      </div>
      <MetricGrid summary={summary} />
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
      <Panel title="最近回覆" action={<Link href="/research/admin/responses" className="text-sm text-accent underline-offset-4 hover:underline">全部回覆</Link>}>
        {recent.length === 0 ? <p className="text-sm text-ink-soft">未有回覆。</p> : (
          <ul className="divide-y divide-line">
            {recent.map((response) => {
              const survey = store.surveys.find((item) => item.id === response.surveyId)
              return (
                <li key={response.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/research/admin/responses/${response.id}`} className="font-medium text-ink underline-offset-4 hover:underline">
                      {response.respondentCode}
                    </Link>
                    <p className="text-sm text-ink-muted">{survey?.name} · {formatWhen(response.submittedAt)}</p>
                  </div>
                  <span className="rounded-full border border-line-strong px-2 py-1 text-xs text-ink">{RESPONSE_STATUS_LABEL[response.status]}</span>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
    </div>
  )
}
