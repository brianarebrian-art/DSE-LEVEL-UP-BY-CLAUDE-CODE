'use client'

import Link from 'next/link'
import { formatDay, SURVEY_STATUS_LABEL } from '@/lib/research/labels'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { PublicFrame } from '@/components/research/AdminShell'

export function PublicHome() {
  return (
    <PublicFrame>
      <ResearchGate>
        <HomeList />
      </ResearchGate>
    </PublicFrame>
  )
}

function HomeList() {
  const { store } = useResearch()
  const published = (store?.surveys ?? []).filter((survey) => survey.status === 'published')
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">公開問卷</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          呢度收集對 DSE Level Up 練習流程、題庫、可列印練習卷、難度標籤同登入返回嘅意見。回覆只留喺呢部瀏覽器，唔會上傳，亦唔會記低姓名。
        </p>
      </div>
      {published.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-raised p-6">
          <h2 className="text-lg font-semibold text-ink">未有公開問卷</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">研究同事發佈之後，連結先會出現喺呢度。</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {published.map((survey) => (
            <li key={survey.id} className="rounded-2xl border border-line bg-surface-raised p-4">
              <p className="text-xs font-medium text-ink-muted">{SURVEY_STATUS_LABEL[survey.status]}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{survey.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{survey.description}</p>
              <p className="mt-2 text-sm text-ink-muted">
                {formatDay(survey.startsOn)} 至 {formatDay(survey.endsOn)}
              </p>
              <Link
                href={`/research/s/${survey.id}`}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-on-accent"
              >
                開始填寫
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
