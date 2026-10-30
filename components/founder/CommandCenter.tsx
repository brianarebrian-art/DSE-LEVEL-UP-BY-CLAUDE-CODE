'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { PlatformOverview, MetricValue, SubjectNode } from '@/lib/founder/metrics'

function MetricCard({ m, href }: { m: MetricValue; href?: string }) {
  const body = (
    <>
      <p className="fos-metric-label" title={m.meta.formula}>
        {m.meta.label}
      </p>
      {m.state === 'ok' ? (
        <p className="fos-metric-value">{m.value.toLocaleString('zh-HK')}</p>
      ) : (
        <p className="fos-metric-value text-[length:1.05rem] text-[var(--fos-faint)]">
          {m.state === 'unconnected' ? '未接駁' : '無法計算'}
        </p>
      )}
      <p className="mt-1 text-[10px] leading-snug text-[var(--fos-faint)]">
        {m.state === 'ok'
          ? `${m.meta.timeRange} · ${m.meta.source}`
          : 'reason' in m
            ? m.reason
            : ''}
      </p>
    </>
  )
  const className = 'fos-panel block p-3 transition-colors hover:border-[var(--fos-border)]'
  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    )
  }
  return <div className={className}>{body}</div>
}

function severityClass(s: string) {
  if (s === 'alert') return 'fos-badge-danger'
  if (s === 'warn') return 'fos-badge-warn'
  if (s === 'tip') return 'fos-badge-ok'
  return 'border-[var(--fos-border-soft)] text-[var(--fos-cyan)]'
}

type CoreMode = 'star' | 'decisions' | 'season' | 'table'

export default function CommandCenter({ data }: { data: PlatformOverview }) {
  const [core, setCore] = useState<CoreMode>('star')
  const updatedHkt = useMemo(
    () =>
      new Date(data.updatedAt).toLocaleString('zh-HK', {
        timeZone: 'Asia/Hong_Kong',
        hour12: false,
      }),
    [data.updatedAt],
  )

  const activeNodes = data.subjectNodes.filter((n) => n.isActive)
  const maxSessions = Math.max(1, ...activeNodes.map((n) => n.sessions30d ?? 0))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-[var(--fos-ink)] md:text-xl">指揮中心</h1>
          <p className="text-xs text-[var(--fos-muted)]">資料最後更新（香港時間）：{updatedHkt}</p>
        </div>
        <p className="text-[10px] text-[var(--fos-faint)]">金額預設顯示 HKD；原始幣別保留於財務模組。</p>
      </div>

      {/* A. 平台概況 */}
      <section aria-labelledby="fos-overview">
        <h2 id="fos-overview" className="fos-panel-title mb-2">
          平台概況
        </h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard m={data.metrics.activeStudents7d} href="/founder/students" />
          <MetricCard m={data.metrics.newPractisers7d} href="/founder/students" />
          <MetricCard m={data.metrics.practiceSessions30d} href="/founder/students" />
          <MetricCard m={data.metrics.questionBankTotal} href="/founder/questions" />
          <MetricCard m={data.metrics.pendingQualityReviews} href="/founder/quality" />
          <MetricCard m={data.metrics.openReports} href="/founder/quality/reports" />
        </div>
      </section>

      <div className="grid gap-3 xl:grid-cols-12">
        {/* B. 中央核心 */}
        <section className="fos-panel p-4 xl:col-span-5" aria-labelledby="fos-core">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="fos-core" className="fos-panel-title">
              學習情報核心
            </h2>
            <div className="flex flex-wrap gap-1" role="tablist" aria-label="核心模式">
              {(
                [
                  ['star', '科目星圖'],
                  ['table', '表格'],
                  ['decisions', '今日決策'],
                  ['season', '考季作戰'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={core === id}
                  className={`rounded px-2 py-1 text-xs ${
                    core === id ? 'text-[var(--fos-cyan)]' : 'text-[var(--fos-muted)]'
                  }`}
                  onClick={() => setCore(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {core === 'star' && (
            <div className="relative mx-auto max-w-md py-4">
              <div className="fos-orb" aria-hidden />
              <p className="mt-3 text-center text-xs text-[var(--fos-muted)]">DSE LEVEL UP CORE</p>
              <ul className="mt-4 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto text-xs sm:grid-cols-3">
                {activeNodes.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/founder/subjects?subject=${encodeURIComponent(n.id)}`}
                      className="block rounded border border-[var(--fos-border-soft)] px-2 py-1.5 hover:border-[var(--fos-cyan)]"
                      style={{
                        opacity: 0.55 + 0.45 * ((n.sessions30d ?? 0) / maxSessions),
                      }}
                    >
                      <span className="block truncate text-[var(--fos-ink)]">{n.name}</span>
                      <span className="text-[var(--fos-faint)]">
                        {n.questionCount} 題
                        {n.sessions30d != null ? ` · ${n.sessions30d} 節/30日` : ' · 節數未接駁'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {core === 'table' && <SubjectTable nodes={activeNodes} />}

          {core === 'decisions' && (
            <ul className="space-y-2 text-sm">
              {data.intel.length === 0 ? (
                <li className="text-[var(--fos-muted)]">今日暫無待決策情報（唔用假事件充版）。</li>
              ) : (
                data.intel.slice(0, 5).map((item) => (
                  <li key={item.id} className="rounded border border-[var(--fos-border-soft)] p-2">
                    <p className="font-medium">{item.title}</p>
                    <Link href={item.href} className="text-xs text-[var(--fos-cyan)]">
                      進入個案 →
                    </Link>
                  </li>
                ))
              )}
              <li>
                <Link href="/founder/decisions" className="text-xs text-[var(--fos-cyan)]">
                  全部待決策
                </Link>
              </li>
            </ul>
          )}

          {core === 'season' && (
            <div className="space-y-2 text-sm text-[var(--fos-muted)]">
              <p>考季作戰板以題庫覆蓋同覆核隊列為主；唔顯示冇依據嘅「勝率」或健康分。</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>
                  活躍科目：{activeNodes.length}／{data.subjectNodes.length}
                </li>
                <li>
                  題庫題數：
                  {data.metrics.questionBankTotal.state === 'ok'
                    ? data.metrics.questionBankTotal.value.toLocaleString('zh-HK')
                    : '—'}
                </li>
                <li>
                  待覆核：
                  {data.metrics.pendingQualityReviews.state === 'ok'
                    ? data.metrics.pendingQualityReviews.value
                    : data.metrics.pendingQualityReviews.state === 'unconnected'
                      ? '未接駁'
                      : '—'}
                </li>
              </ul>
              <Link href="/founder/subjects/coverage" className="text-[var(--fos-cyan)]">
                查看覆蓋缺口 →
              </Link>
            </div>
          )}
        </section>

        {/* C. 即時情報 */}
        <section className="fos-panel p-4 xl:col-span-4" aria-labelledby="fos-intel">
          <h2 id="fos-intel" className="fos-panel-title mb-3">
            即時情報
          </h2>
          {data.intel.length === 0 ? (
            <p className="text-sm text-[var(--fos-muted)]">目前冇未結案情報。重複事件已按 fingerprint 合併。</p>
          ) : (
            <ul className="max-h-[28rem] space-y-2 overflow-y-auto">
              {data.intel.map((item) => (
                <li key={item.id} className="rounded-lg border border-[var(--fos-border-soft)] p-2.5 text-sm">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase ${severityClass(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className="text-[10px] text-[var(--fos-faint)]">{item.status}</span>
                  </div>
                  <p className="font-medium text-[var(--fos-ink)]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--fos-muted)]">影響：{item.impact}</p>
                  <p className="text-[10px] text-[var(--fos-faint)]">
                    負責人：{item.owner} · 更新{' '}
                    {new Date(item.updatedAt).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong', hour12: false })}
                  </p>
                  <Link href={item.href} className="mt-1 inline-block text-xs text-[var(--fos-cyan)]">
                    進入個案
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* D + F */}
        <div className="flex flex-col gap-3 xl:col-span-3">
          <section className="fos-panel p-4" aria-labelledby="fos-ai">
            <h2 id="fos-ai" className="fos-panel-title mb-2">
              AI 工作任務
            </h2>
            {data.aiJobs.source === 'unconnected' ? (
              <p className="text-sm text-[var(--fos-muted)]">{data.aiJobs.reason}</p>
            ) : (
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {(
                  [
                    ['排隊', data.aiJobs.queued],
                    ['執行中', data.aiJobs.running],
                    ['待人工', data.aiJobs.needsHuman],
                    ['失敗', data.aiJobs.failed],
                    ['完成', data.aiJobs.completed],
                  ] as const
                ).map(([label, v]) => (
                  <div key={label}>
                    <dt className="text-[10px] text-[var(--fos-faint)]">{label}</dt>
                    <dd className="font-semibold tabular-nums">{v ?? '—'}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link href="/founder/ai" className="mt-2 inline-block text-xs text-[var(--fos-cyan)]">
              任務詳情 →
            </Link>
          </section>

          <section className="fos-panel p-4" aria-labelledby="fos-sys">
            <h2 id="fos-sys" className="fos-panel-title mb-2">
              系統及成本
            </h2>
            <ul className="space-y-2 text-sm">
              {(
                [
                  data.system.apiLatency,
                  data.system.errorRate,
                  data.system.backgroundJobs,
                  data.system.aiProvider,
                  data.system.budget,
                ] as MetricValue[]
              ).map((m) => (
                <li key={m.meta.id} className="flex items-start justify-between gap-2">
                  <span className="text-[var(--fos-muted)]">{m.meta.label}</span>
                  <span className="text-right text-[var(--fos-ink)]">
                    {m.state === 'ok' ? (m.meta.id === 'budget_usage' ? `${m.value}%` : m.value) : '未接駁'}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/founder/engineering" className="mt-2 inline-block text-xs text-[var(--fos-cyan)]">
              工程與安全 →
            </Link>
          </section>
        </div>
      </div>

      {/* E. 營運時間線 */}
      <section className="fos-panel p-4" aria-labelledby="fos-ops">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="fos-ops" className="fos-panel-title">
            營運時間線
          </h2>
          <Link href="/founder/ops" className="text-xs text-[var(--fos-cyan)]">
            全部任務
          </Link>
        </div>
        {data.opsTasks.source === 'unconnected' ? (
          <p className="text-sm text-[var(--fos-muted)]">{data.opsTasks.reason}</p>
        ) : (
          <p className="text-sm text-[var(--fos-ink)]">
            進行中營運任務：<strong className="tabular-nums">{data.opsTasks.open}</strong>
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link href="/founder/questions/batches" className="rounded border border-[var(--fos-border-soft)] px-2 py-1">
            待發佈批次
          </Link>
          <Link href="/founder/quality" className="rounded border border-[var(--fos-border-soft)] px-2 py-1">
            題目覆核
          </Link>
          <Link href="/founder/ops/incidents" className="rounded border border-[var(--fos-border-soft)] px-2 py-1">
            事故處理
          </Link>
          <Link href="/founder/ops" className="rounded border border-[var(--fos-border-soft)] px-2 py-1">
            自訂任務
          </Link>
        </div>
      </section>

      {data.notComputable.length > 0 && (
        <details className="text-xs text-[var(--fos-faint)]">
          <summary className="cursor-pointer text-[var(--fos-muted)]">無法計算／刻意排除嘅指標</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {data.notComputable.map((n) => (
              <li key={n.metric}>
                <strong className="text-[var(--fos-muted)]">{n.metric}</strong> — {n.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

function SubjectTable({ nodes }: { nodes: SubjectNode[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <caption className="sr-only">科目星圖表格替代視圖</caption>
        <thead className="text-xs text-[var(--fos-muted)]">
          <tr>
            <th scope="col" className="py-1 pr-2">
              科目
            </th>
            <th scope="col" className="py-1 pr-2">
              題數
            </th>
            <th scope="col" className="py-1">
              30 日練習節
            </th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <tr key={n.id} className="border-t border-[var(--fos-border-soft)]">
              <td className="py-1.5 pr-2">
                <Link href={`/founder/subjects?subject=${encodeURIComponent(n.id)}`} className="text-[var(--fos-cyan)]">
                  {n.name}
                </Link>
              </td>
              <td className="py-1.5 pr-2 tabular-nums">{n.questionCount}</td>
              <td className="py-1.5 tabular-nums text-[var(--fos-muted)]">
                {n.sessions30d != null ? n.sessions30d : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
