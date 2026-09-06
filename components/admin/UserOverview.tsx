'use client'

import { useEffect, useState } from 'react'
import type { UserStats } from '@/app/api/admin/users/stats/route'

// Admin 用戶概覽 —— 平台第一個真實使用量指標。
//
// 中文單語（同 /admin 其餘部分一致，內部工具，唔跟語言切換）。
// 純 SVG 柱狀圖，冇 chart library（憲章 §3：禁 Chart.js / D3 / Recharts）。
//
// ⚠️ 呢一版刻意【列出計唔到嘅指標同原因】。原規格畫咗「每週活躍」同
// 「每月留存」兩張圖，但支撐佢哋嗰張 `question_events` 表已經刪咗，
// 而 `user_progress` 一個用戶一行、只存最後活躍時間，砌唔出時間序列。
// 擺個估算數字上去會比留白更差 —— 呢版嘢嘅全部價值就係佢準。

const fmt = (n: number) => n.toLocaleString('en-US')

export default function UserOverview() {
  const [s, setS] = useState<UserStats | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch('/api/admin/users/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setS)
      .catch(() => setErr(true))
  }, [])

  if (err) return <p className="text-sm text-ink-muted">用戶數據攞唔到。</p> // i18n-exempt: admin 內部工具，中文單語
  if (!s) return <p className="text-sm text-ink-muted">載入中…</p> // i18n-exempt: admin 內部工具，中文單語

  const cards = [
    { label: '已同步進度嘅帳號', value: fmt(s.syncedUsers), note: 'user_progress 去重 user_id' }, // i18n-exempt: admin 內部工具，中文單語
    { label: '7 日內活躍', value: fmt(s.activeLast7d), note: 'last_active_at 距今 ≤ 7 日' }, // i18n-exempt: admin 內部工具，中文單語
    { label: '30 日內活躍', value: fmt(s.activeLast30d), note: 'last_active_at 距今 ≤ 30 日' }, // i18n-exempt: admin 內部工具，中文單語
    { label: '有無障礙設定紀錄', value: fmt(s.settingsUsers), note: 'user_settings 去重 user_id' }, // i18n-exempt: admin 內部工具，中文單語
  ]

  const max = Math.max(1, ...s.lastSeenByWeek.map((w) => w.users))
  const BAR_W = 26
  const GAP = 8
  const H = 110
  const width = Math.max(1, s.lastSeenByWeek.length) * (BAR_W + GAP)

  return (
    <section className="mb-10">
      <h2 className="text-lg font-medium text-ink mb-1">用戶概覽</h2> {/* i18n-exempt: admin 內部工具，中文單語 */}
      <p className="text-xs text-ink-muted mb-4">
        平台第一次量到嘅真實使用量。呢批數只計【登入咗並且同步過進度】嘅帳號 —— // i18n-exempt: admin 內部工具，中文單語
        淨係用 localStorage、冇登入嘅學生喺呢度睇唔到，所以呢個係下限，唔係總數。 // i18n-exempt: admin 內部工具，中文單語
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-surface-raised p-4">
            <div className="text-2xl font-medium text-ink tabular-nums">{c.value}</div>
            <div className="text-sm text-ink-soft mt-0.5">{c.label}</div>
            <div className="text-[11px] text-ink-faint mt-1">{c.note}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6">
        <h3 className="text-sm font-medium text-ink">最後活躍分佈（近 12 週）</h3> {/* i18n-exempt: admin 內部工具，中文單語 */}
        <p className="text-[11px] text-ink-faint mt-0.5 mb-3">
          每個帳號只計一次，落喺佢【最後一次】活躍嗰週。 // i18n-exempt: admin 內部工具，中文單語
          呢個係流失曲線，<strong>唔係</strong>每週活躍人數 —— 一個七月同八月都用過嘅人，只會出現喺八月。 {/* i18n-exempt: admin 內部工具，中文單語 */}
        </p>
        {s.lastSeenByWeek.length === 0 ? (
          <p className="text-sm text-ink-muted">近 12 週冇活躍紀錄。</p> // i18n-exempt: admin 內部工具，中文單語
        ) : (
          <div className="overflow-x-auto">
            <svg width={width} height={H + 34} role="img" aria-label="最後活躍分佈柱狀圖"> {/* i18n-exempt: admin 內部工具，中文單語 */}
              {s.lastSeenByWeek.map((w, i) => {
                const h = Math.round((w.users / max) * H)
                const x = i * (BAR_W + GAP)
                return (
                  <g key={w.week}>
                    <rect x={x} y={H - h} width={BAR_W} height={h} rx={3} className="fill-accent" />
                    <text x={x + BAR_W / 2} y={H - h - 4} textAnchor="middle" className="fill-ink-soft text-[10px]">
                      {w.users}
                    </text>
                    <text x={x + BAR_W / 2} y={H + 14} textAnchor="middle" className="fill-ink-faint text-[9px]">
                      {w.week.slice(5)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface-sunken p-4">
        <h3 className="text-sm font-medium text-ink mb-2">呢四樣計唔到（唔係未做）</h3> {/* i18n-exempt: admin 內部工具，中文單語 */}
        <ul className="space-y-1.5">
          {s.notComputable.map((n) => (
            <li key={n.metric} className="text-xs text-ink-soft">
              <span className="text-ink font-medium">{n.metric}</span> —— {n.reason}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-ink-faint mt-3">
          擺個估算數字上去會比留白更差。要真正量到每日新增同留存， // i18n-exempt: admin 內部工具，中文單語
          就要有一張逐次活動嘅表 —— 嗰個係新增資料收集，要另外開題。 // i18n-exempt: admin 內部工具，中文單語
        </p>
      </div>
    </section>
  )
}
