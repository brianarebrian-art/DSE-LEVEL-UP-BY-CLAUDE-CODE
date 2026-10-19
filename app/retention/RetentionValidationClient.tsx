'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle, Clock3, ShieldCheck, Target } from 'lucide-react'
import { trackRetentionEvent } from '@/lib/retentionEvents'

const milestones = [
  { days: 'Day 0–1', title: '短練與回報工具', body: '一鍵開始 10 題短練；每題都有錯題回報與處理狀態入口。', metric: '48 小時 ≥ 200 次短練啟動；24 小時二次啟動 ≥ 20%', events: 'short_practice_started · question_report_submitted' },
  { days: 'Day 2–7', title: '首屏 CTA A/B', body: 'A：三大承諾 + 一鍵短練；B：再加教師審核信任訊息。', metric: '勝出版本短練啟動率提升 ≥ 10%，並以次日留存作第二判準', events: 'homepage_viewed · short_practice_started' },
  { days: 'Day 8–14', title: '信任標示試點', body: '在少量題目顯示教師審核／自動檢查狀態，觀察啟動與註冊。', metric: '標示題啟動率高 ≥ 15%；至少 5 位教職註冊', events: 'teacher_badge_seen · short_practice_started' },
]

const eventRows = [
  ['short_practice_started', '短練啟動', '匿名/登入、科目、版本'],
  ['short_practice_completed', '短練完成', '題數、科目、耗時'],
  ['question_report_submitted', '錯題回報', '題號、類別、語言；不含描述'],
  ['privacy_choice_selected', '隱私選擇', '免登入試用/雲端同步'],
  ['teacher_badge_seen', '信任標示曝光', '題目狀態、角色'],
]

export default function RetentionValidationClient() {
  const [started, setStarted] = useState(false)
  useEffect(() => { trackRetentionEvent('homepage_viewed', { variant: 'trust' }) }, [])
  const start = () => {
    setStarted(true)
    trackRetentionEvent('short_practice_started', { subject: 'validation', variant: 'trust' })
  }
  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-ink-soft sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-line pb-6">
          <Link href="/" className="text-sm text-accent underline underline-offset-4">返回首頁</Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">14-day validation</p>
              <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">把模擬假設，換成真實證據。</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">這個頁面是團隊用的驗證控制台。報告來自 synthetic n=10，以下指標只會在真實事件累積後才作決策。</p>
            </div>
            <Target className="hidden size-8 shrink-0 text-gold sm:block" aria-hidden />
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="驗證原則">
          {[['信任', '題目狀態透明，回報不沉底', ShieldCheck], ['短練', '10 題、短回饋、容易再來', CheckCircle2], ['留存', 'D1 / D7 / D28 分群觀察', Clock3]].map(([title, body, Icon]) => {
            const Component = Icon as typeof ShieldCheck
            return <div key={title as string} className="rounded-2xl border border-line bg-surface-raised p-4"><Component className="mb-3 size-5 text-accent" aria-hidden /><h2 className="text-sm font-medium text-ink">{title as string}</h2><p className="mt-1 text-xs leading-relaxed text-ink-muted">{body as string}</p></div>
          })}
        </section>

        <section className="rounded-2xl border border-accent/30 bg-surface-raised p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-medium text-accent">P0 / P1 驗證入口</p><h2 className="mt-1 font-serif text-xl text-ink">用一次短練驗證事件管道</h2><p className="mt-1 text-sm text-ink-muted">按下後記錄匿名 short_practice_started，不記帳戶、IP 或裝置。</p></div>
            <button type="button" onClick={start} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-strong px-5 text-sm font-medium text-on-accent hover:bg-accent-hover">{started ? '已記錄' : '記錄一次啟動'} <ArrowRight data-icon="inline-end" /></button>
          </div>
        </section>

        <section className="flex flex-col gap-3"><h2 className="font-serif text-xl text-ink">14 日節奏</h2>{milestones.map((item, index) => <article key={item.days} className="rounded-2xl border border-line bg-surface-raised p-5"><div className="flex gap-3"><div className="pt-0.5 text-accent">{index === 0 ? <CheckCircle2 aria-hidden /> : <Circle aria-hidden />}</div><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-gold">{item.days}</p><h3 className="mt-1 text-base font-medium text-ink">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p><p className="mt-3 rounded-lg bg-surface-sunken px-3 py-2 text-xs leading-relaxed text-ink-soft"><strong>成功判準：</strong>{item.metric}</p><p className="mt-2 font-mono text-[11px] text-ink-faint">{item.events}</p></div></div></article>)}</section>

        <section className="rounded-2xl border border-line bg-surface-raised p-5"><h2 className="font-serif text-xl text-ink">事件字典</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="border-b border-line text-ink-muted"><tr><th className="pb-2 pr-4 font-medium">event_name</th><th className="pb-2 pr-4 font-medium">用途</th><th className="pb-2 font-medium">必要分群</th></tr></thead><tbody>{eventRows.map(([name, label, fields]) => <tr key={name} className="border-b border-line last:border-0"><td className="py-3 pr-4 font-mono text-accent">{name}</td><td className="py-3 pr-4 text-ink-soft">{label}</td><td className="py-3 text-ink-muted">{fields}</td></tr>)}</tbody></table></div></section>

        <footer className="border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">判斷順序：先看短練啟動，再看完成與二次啟動，最後看 D1/D7 留存。任何教育效果、留存提升或信任恢復主張，都必須以真實用戶事件驗證。</footer>
      </div>
    </main>
  )
}
