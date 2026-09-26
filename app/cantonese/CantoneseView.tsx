'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import CantoneseTopicCard from '@/components/CantoneseTopicCard'
import type { CantoneseTopic } from '@/data/cantonese'

// /cantonese 嘅呈現層。範圍同來源嘅理由見 app/cantonese/page.tsx 檔頭。

export default function CantoneseView({ topics }: { topics: CantoneseTopic[] }) {
  const { t, locale } = useLocale()
  const c = t.cantonese
  const en = locale === 'en'

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-4xl">
        {/* 得一項，所以【唔】包 <nav> —— 一個淨係得返首頁一條連結嘅 landmark，
            對 screen reader 用家嚟講係多咗一個要跳過嘅區域，唔係多咗資訊。 */}
        <div className="mb-2 flex items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
          <span aria-hidden>/</span>
          <Link href="/off-syllabus" className="hover:text-accent">{t.nav.offSyllabus}</Link>
        </div>

        {/* 「業餘班 · 非正規課程」擺喺標題【上面】而唔係腳註 —— 一個學生應該
            喺讀任何內容之前就知道呢個唔係正規課程，唔係碌到底先知。 */}
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{c.kicker}</p>
        <h1 className="mt-1 text-2xl font-medium text-ink">{c.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{c.lead}</p>

        {/* ── 「點樣學」入口 ──
            擺喺場景【之前】。一個識普通話嘅學生睇住 `caap3 sou1` 照讀，
            讀出嚟係普通話腔 —— 因為佢用緊普通話嘅音系去讀一套唔同嘅音。
            所以「點樣讀」應該喺「讀乜」之前遇到，唔係埋尾先補。 */}
        <div className="mt-6 rounded-xl border border-line bg-surface-raised p-5">
          <h2 className="text-base font-medium text-ink">{c.learnHubTitle}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{c.learnHubLead}</p>
          <Link
            href="/cantonese/learn"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {c.learnHubCta}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <CantoneseTopicCard key={topic.id} topic={topic} en={en} />
          ))}
        </div>

        {/* ── 來源同校對 ──
            ⚠️ 呢段【唔可以】寫成「粵拼已驗證」。機器查到嘅只係「每個音節結構
            上合法」，查唔到「個音讀得啱唔啱」—— 兩句唔同意思，而憲章 §16.D
            就係為咗呢種分別而寫。所以段尾明寫「以老師為準」。 */}
        <section className="mt-8 rounded-xl border border-line bg-surface-sunken p-4 sm:p-5">
          <h2 className="text-sm font-medium text-ink">{c.sourceTitle}</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{c.sourceBody}</p>
        </section>

        <p className="mt-4 rounded-xl border border-line bg-surface-sunken p-3 text-xs leading-relaxed text-ink-muted">
          {c.disclaimer}
        </p>
      </div>
    </div>
  )
}
