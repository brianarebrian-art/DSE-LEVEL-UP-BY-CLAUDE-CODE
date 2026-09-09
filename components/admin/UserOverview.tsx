'use client'

import { useEffect, useState } from 'react'
import type { UserStats } from '@/app/api/admin/users/stats/route'

// Admin 用戶概覽 —— 平台真實使用量。
//
// 中文單語（同 /admin 其餘部分一致，內部工具，唔跟語言切換）。
// 純 SVG，冇 chart library（憲章 §3：禁 Chart.js / D3 / Recharts）。
//
// ⚠️ 所有文案集中喺下面 T 物件，逐行掛 i18n-exempt。
// 唔可以將 `// i18n-exempt:` 直接寫入 JSX 文字節點 —— 上一版咁做過，
// 個註釋會【當成文字 render 出嚟】畀人睇到。

const T = {
  title: '用戶概覽', // i18n-exempt: admin 內部工具，中文單語
  intro:
    '以下數字由已登入用戶的雲端練習紀錄逐節重算。未登入的學生只用 localStorage，永遠唔會出現喺呢度 —— 所以呢個係下限，唔係全站總數。', // i18n-exempt: admin 內部工具，中文單語
  funnel: '漏斗', // i18n-exempt: admin 內部工具，中文單語
  volume: '使用量', // i18n-exempt: admin 內部工具，中文單語
  dailyTitle: '每日活躍（近 60 日，香港時間）', // i18n-exempt: admin 內部工具，中文單語
  dailyEmpty: '近 60 日冇練習紀錄。', // i18n-exempt: admin 內部工具，中文單語
  subjectTitle: '逐科', // i18n-exempt: admin 內部工具，中文單語
  diffTitle: '逐難度層命中率', // i18n-exempt: admin 內部工具，中文單語
  diffWarn: '樣本只得 %n 節（difficultyResults 係 2026-08-23 之後先加，之前嘅紀錄冇呢欄）。', // i18n-exempt: admin 內部工具，中文單語
  notComputable: '呢啲計唔到', // i18n-exempt: admin 內部工具，中文單語
  loading: '載入中…', // i18n-exempt: admin 內部工具，中文單語
  failed: '用戶數據攞唔到。', // i18n-exempt: admin 內部工具，中文單語
  discarded: '已剔除 %n 筆壞紀錄（分數大過題數）。', // i18n-exempt: admin 內部工具，中文單語
  colSubject: '科目', // i18n-exempt: admin 內部工具，中文單語
  colSessions: '節數', // i18n-exempt: admin 內部工具，中文單語
  colUsers: '人數', // i18n-exempt: admin 內部工具，中文單語
  colQuestions: '題數', // i18n-exempt: admin 內部工具，中文單語
  colAccuracy: '正確率', // i18n-exempt: admin 內部工具，中文單語
  tierEasy: '基礎', // i18n-exempt: admin 內部工具，中文單語
  tierMedium: '中等', // i18n-exempt: admin 內部工具，中文單語
  tierHard: '進階', // i18n-exempt: admin 內部工具，中文單語
  bar: '%d · %u 人 · %s 節 · %q 題', // i18n-exempt: admin 內部工具，中文單語
  liveTitle: '即時', // i18n-exempt: admin 內部工具，中文單語
  liveNote:
    '練習期間每答一題會推一次同步（2.5 秒 debounce），所以呢個數會喺一節之內跳動。只有人頭，冇身份、冇題目內容。', // i18n-exempt: admin 內部工具，中文單語
  live2: '近 2 分鐘', // i18n-exempt: admin 內部工具，中文單語
  live15: '近 15 分鐘', // i18n-exempt: admin 內部工具，中文單語
  live60: '近 1 小時', // i18n-exempt: admin 內部工具，中文單語
  liveNewest: '最近一次同步', // i18n-exempt: admin 內部工具，中文單語
  refreshed: '%t 更新（每 20 秒自動）', // i18n-exempt: admin 內部工具，中文單語
  bucketTitle: '今日 / 本週 / 本月（香港時間）', // i18n-exempt: admin 內部工具，中文單語
  bToday: '今日', // i18n-exempt: admin 內部工具，中文單語
  bWeek: '本週', // i18n-exempt: admin 內部工具，中文單語
  bMonth: '本月', // i18n-exempt: admin 內部工具，中文單語
  colCorrect: '答啱', // i18n-exempt: admin 內部工具，中文單語
  weakTitle: '錯得最多嘅課題', // i18n-exempt: admin 內部工具，中文單語
  weakNote:
    '全站聚合，唔綁任何用戶身份 —— 量度嘅係題庫，唔係學生。至少答過 20 題嘅課題先上榜。', // i18n-exempt: admin 內部工具，中文單語
  colTopic: '課題', // i18n-exempt: admin 內部工具，中文單語
  colWrong: '答錯', // i18n-exempt: admin 內部工具，中文單語
  colWrongPct: '錯誤率', // i18n-exempt: admin 內部工具，中文單語
  weakEmpty: '未有課題答夠 20 題。', // i18n-exempt: admin 內部工具，中文單語
} as const

const CARDS_FUNNEL = {
  accounts: '有雲端進度嘅帳號', // i18n-exempt: admin 內部工具，中文單語
  everPractised: '做過至少一節', // i18n-exempt: admin 內部工具，中文單語
  sessions2Plus: '做過 2 節以上', // i18n-exempt: admin 內部工具，中文單語
  returnedAnotherDay: '第二日再返嚟過', // i18n-exempt: admin 內部工具，中文單語
} as const

const CARDS_VOLUME = {
  questions: '累計答題數', // i18n-exempt: admin 內部工具，中文單語
  accuracy: '整體正確率', // i18n-exempt: admin 內部工具，中文單語
  medianSession: '一節中位時長', // i18n-exempt: admin 內部工具，中文單語
  partial: '冇做完嘅節', // i18n-exempt: admin 內部工具，中文單語
} as const

const NOTE = {
  accounts: 'user_progress 列數', // i18n-exempt: admin 內部工具，中文單語
  everPractised: 'dse_progress 至少一筆', // i18n-exempt: admin 內部工具，中文單語
  sessions2Plus: '同一帳號 ≥2 筆', // i18n-exempt: admin 內部工具，中文單語
  returnedAnotherDay: '跨兩個日曆日 —— 呢個先係留存', // i18n-exempt: admin 內部工具，中文單語
  questions: '逐節 total 相加', // i18n-exempt: admin 內部工具，中文單語
  accuracy: 'score ÷ total', // i18n-exempt: admin 內部工具，中文單語
  medianSession: 'elapsed 中位數', // i18n-exempt: admin 內部工具，中文單語
  partial: '冇做夠一整節（1 / 10 / 20 題以外）', // i18n-exempt: admin 內部工具，中文單語
  active: '7 日／30 日內做過練習', // i18n-exempt: admin 內部工具，中文單語
} as const

const fmt = (n: number) => n.toLocaleString('en-US')
const pctText = (v: number | null) => (v === null ? '—' : `${v}%`)
const mmss = (s: number | null) => {
  if (s === null) return '—'
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m${String(Math.round(s % 60)).padStart(2, '0')}s` : `${Math.round(s)}s`
}
const ago = (sec: number | null) => {
  if (sec === null) return '—'
  if (sec < 90) return `${sec}s`
  const m = Math.round(sec / 60)
  return m < 90 ? `${m}m` : `${Math.round(m / 60)}h`
}

const barLabel = (d: { day: string; users: number; sessions: number; questions: number }) =>
  T.bar
    .replace('%d', d.day)
    .replace('%u', String(d.users))
    .replace('%s', String(d.sessions))
    .replace('%q', String(d.questions))

const tierLabel = (t: string) =>
  t === 'easy' ? T.tierEasy : t === 'medium' ? T.tierMedium : T.tierHard

function Cards({ items }: { items: { label: string; value: string; note: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {items.map((c) => (
        <div key={c.label} className="rounded-xl border border-line bg-surface-raised p-4">
          <div className="text-2xl font-medium text-ink tabular-nums">{c.value}</div>
          <div className="text-sm text-ink-soft mt-0.5">{c.label}</div>
          <div className="text-[11px] text-ink-faint mt-1">{c.note}</div>
        </div>
      ))}
    </div>
  )
}

export default function UserOverview() {
  const [s, setS] = useState<UserStats | null>(null)
  const [err, setErr] = useState(false)

  const [at, setAt] = useState<string>('')

  useEffect(() => {
    let alive = true
    const load = () => {
      // 分頁收埋咗就唔好嘥 Edge Request（憲章 §5 成本死鎖）。
      if (document.visibilityState === 'hidden') return
      fetch('/api/admin/users/stats')
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((j) => {
          if (!alive) return
          setS(j)
          setAt(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Hong_Kong' }))
        })
        .catch(() => alive && setErr(true))
    }
    load()
    const id = setInterval(load, 20_000)
    document.addEventListener('visibilitychange', load)
    return () => {
      alive = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', load)
    }
  }, [])

  if (err) return <p className="text-sm text-ink-muted">{T.failed}</p>
  if (!s) return <p className="text-sm text-ink-muted">{T.loading}</p>

  const funnel = [
    { label: CARDS_FUNNEL.accounts, value: fmt(s.accounts), note: NOTE.accounts },
    { label: CARDS_FUNNEL.everPractised, value: fmt(s.everPractised), note: NOTE.everPractised },
    { label: CARDS_FUNNEL.sessions2Plus, value: fmt(s.sessions2Plus), note: NOTE.sessions2Plus },
    {
      label: CARDS_FUNNEL.returnedAnotherDay,
      value: fmt(s.returnedAnotherDay),
      note: NOTE.returnedAnotherDay,
    },
  ]

  const volume = [
    { label: CARDS_VOLUME.questions, value: fmt(s.totalQuestions), note: NOTE.questions },
    { label: CARDS_VOLUME.accuracy, value: pctText(s.accuracyPct), note: NOTE.accuracy },
    {
      label: CARDS_VOLUME.medianSession,
      value: mmss(s.medianSessionSeconds),
      note: NOTE.medianSession,
    },
    {
      label: CARDS_VOLUME.partial,
      value: `${fmt(s.partialSessions)} / ${fmt(s.totalSessions)}`,
      note: NOTE.partial,
    },
  ]

  const max = Math.max(1, ...s.daily.map((d) => d.users))
  const BAR = 9
  const GAP = 3
  const H = 96
  const width = Math.max(1, s.daily.length) * (BAR + GAP)

  return (
    <section className="mb-10">
      <h2 className="text-lg font-medium text-ink mb-1">{T.title}</h2>
      <p className="text-xs text-ink-muted mb-4 max-w-3xl leading-relaxed">{T.intro}</p>

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-sm font-medium text-ink-soft">{T.liveTitle}</h3>
          <span className="text-[11px] text-ink-faint tabular-nums">
            {at ? T.refreshed.replace('%t', at) : ''}
          </span>
        </div>
        <p className="text-[11px] text-ink-faint mb-3 max-w-2xl leading-relaxed">{T.liveNote}</p>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { l: T.live2, v: fmt(s.live.min2) },
            { l: T.live15, v: fmt(s.live.min15) },
            { l: T.live60, v: fmt(s.live.min60) },
            { l: T.liveNewest, v: ago(s.live.newestSyncAgoSec) },
          ].map((x) => (
            <div key={x.l} className="rounded-lg border border-line p-3">
              <div className="text-2xl font-medium text-ink tabular-nums">{x.v}</div>
              <div className="text-sm text-ink-soft mt-0.5">{x.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6 overflow-x-auto">
        <h3 className="text-sm font-medium text-ink-soft mb-3">{T.bucketTitle}</h3>
        <table className="w-full text-sm min-w-[26rem]">
          <thead>
            <tr className="text-left text-[11px] text-ink-faint">
              <th className="pb-2 font-normal" />
              <th className="pb-2 font-normal text-right">{T.colUsers}</th>
              <th className="pb-2 font-normal text-right">{T.colSessions}</th>
              <th className="pb-2 font-normal text-right">{T.colQuestions}</th>
              <th className="pb-2 font-normal text-right">{T.colCorrect}</th>
              <th className="pb-2 font-normal text-right">{T.colAccuracy}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {s.buckets.map((b) => (
              <tr key={b.key} className="border-t border-line">
                <td className="py-1.5 text-ink-soft">
                  {b.key === 'today' ? T.bToday : b.key === 'week' ? T.bWeek : T.bMonth}
                </td>
                <td className="py-1.5 text-right text-ink">{fmt(b.users)}</td>
                <td className="py-1.5 text-right text-ink">{fmt(b.sessions)}</td>
                <td className="py-1.5 text-right text-ink font-medium">{fmt(b.questions)}</td>
                <td className="py-1.5 text-right text-ink">{fmt(b.correct)}</td>
                <td className="py-1.5 text-right text-ink">{pctText(b.accuracyPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-medium text-ink-soft mb-2">{T.funnel}</h3>
      <Cards items={funnel} />

      <h3 className="text-sm font-medium text-ink-soft mb-2">{T.volume}</h3>
      <Cards items={volume} />

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-medium text-ink-soft">{T.dailyTitle}</h3>
          <span className="text-[11px] text-ink-faint tabular-nums">
            7d {s.practised7d} · 30d {s.practised30d}
          </span>
        </div>
        {s.daily.length === 0 ? (
          <p className="text-xs text-ink-faint">{T.dailyEmpty}</p>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${H + 16}`}
            className="w-full"
            style={{ height: H + 16 }}
            role="img"
            aria-label={T.dailyTitle}
          >
            {s.daily.map((d, i) => {
              const h = Math.max(2, Math.round((d.users / max) * H))
              return (
                <rect
                  key={d.day}
                  x={i * (BAR + GAP)}
                  y={H - h}
                  width={BAR}
                  height={h}
                  rx={2}
                  className="fill-accent"
                >
                  <title>{barLabel(d)}</title>
                </rect>
              )
            })}
          </svg>
        )}
        <div className="mt-2 flex justify-between text-[11px] text-ink-faint tabular-nums">
          <span>{s.daily[0]?.day ?? ''}</span>
          <span>{s.daily[s.daily.length - 1]?.day ?? ''}</span>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6">
        <h3 className="text-sm font-medium text-ink-soft mb-1">{T.diffTitle}</h3>
        <p className="text-[11px] text-ink-faint mb-3">
          {T.diffWarn.replace('%n', String(s.difficultySample))}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {s.byDifficulty.map((d) => (
            <div key={d.tier} className="rounded-lg border border-line p-3">
              <div className="text-xl font-medium text-ink tabular-nums">{pctText(d.accuracyPct)}</div>
              <div className="text-sm text-ink-soft mt-0.5">{tierLabel(d.tier)}</div>
              <div className="text-[11px] text-ink-faint mt-1 tabular-nums">
                {fmt(d.correct)} / {fmt(d.answered)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6 overflow-x-auto">
        <h3 className="text-sm font-medium text-ink-soft mb-3">{T.subjectTitle}</h3>
        <table className="w-full text-sm min-w-[30rem]">
          <thead>
            <tr className="text-left text-[11px] text-ink-faint">
              <th className="pb-2 font-normal">{T.colSubject}</th>
              <th className="pb-2 font-normal text-right">{T.colSessions}</th>
              <th className="pb-2 font-normal text-right">{T.colUsers}</th>
              <th className="pb-2 font-normal text-right">{T.colQuestions}</th>
              <th className="pb-2 font-normal text-right">{T.colAccuracy}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {s.bySubject.map((r) => (
              <tr key={r.subject} className="border-t border-line">
                <td className="py-1.5 text-ink-soft">{r.subject}</td>
                <td className="py-1.5 text-right text-ink">{fmt(r.sessions)}</td>
                <td className="py-1.5 text-right text-ink">{fmt(r.users)}</td>
                <td className="py-1.5 text-right text-ink">{fmt(r.questions)}</td>
                <td className="py-1.5 text-right text-ink">{pctText(r.accuracyPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-line bg-surface-raised p-4 mb-6 overflow-x-auto">
        <h3 className="text-sm font-medium text-ink-soft mb-1">{T.weakTitle}</h3>
        <p className="text-[11px] text-ink-faint mb-3 max-w-2xl leading-relaxed">{T.weakNote}</p>
        {s.weakTopics.length === 0 ? (
          <p className="text-xs text-ink-faint">{T.weakEmpty}</p>
        ) : (
          <table className="w-full text-sm min-w-[30rem]">
            <thead>
              <tr className="text-left text-[11px] text-ink-faint">
                <th className="pb-2 font-normal">{T.colSubject}</th>
                <th className="pb-2 font-normal">{T.colTopic}</th>
                <th className="pb-2 font-normal text-right">{T.colQuestions}</th>
                <th className="pb-2 font-normal text-right">{T.colWrong}</th>
                <th className="pb-2 font-normal text-right">{T.colWrongPct}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {s.weakTopics.map((t) => (
                <tr key={`${t.subject}::${t.topic}`} className="border-t border-line">
                  <td className="py-1.5 text-ink-faint">{t.subject}</td>
                  <td className="py-1.5 text-ink-soft">{t.topic}</td>
                  <td className="py-1.5 text-right text-ink">{fmt(t.answered)}</td>
                  <td className="py-1.5 text-right text-ink">{fmt(t.wrong)}</td>
                  <td className="py-1.5 text-right text-ink font-medium">{t.wrongPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-line p-4">
        <h3 className="text-sm font-medium text-ink-soft mb-2">{T.notComputable}</h3>
        <ul className="space-y-2">
          {s.notComputable.map((n) => (
            <li key={n.metric} className="text-xs">
              <span className="text-ink-soft">{n.metric}</span>
              <span className="text-ink-faint"> — {n.reason}</span>
            </li>
          ))}
        </ul>
        {s.discardedRecords > 0 && (
          <p className="text-[11px] text-ink-faint mt-3">
            {T.discarded.replace('%n', String(s.discardedRecords))}
          </p>
        )}
      </div>
    </section>
  )
}
