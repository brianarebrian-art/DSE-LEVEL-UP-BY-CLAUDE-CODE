'use client'

import Link from 'next/link'
import { Info } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import CantoneseDseCard, { type CantoneseTopic } from '@/components/CantoneseDseCard'

// /cantonese 嘅呈現層。範圍、卷別同留白嘅理由見 app/cantonese/page.tsx 檔頭。

export default function CantoneseView({ topics }: { topics: CantoneseTopic[] }) {
  const { t, locale } = useLocale()
  const c = t.cantonese
  const en = locale === 'en'

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
          <span>/</span>
          <Link href="/subjects/chinese" className="hover:text-accent">
            {en ? 'Chinese Language' : '中國語文'}
          </Link>
        </div>

        {/* 「業餘班 · 非正規課程」擺喺標題【上面】而唔係腳註 —— 一個學生應該
            喺讀任何內容之前就知道呢個唔係正規課程，唔係碌到底先知。 */}
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{c.kicker}</p>
        <h1 className="mt-1 text-2xl font-medium text-ink">{c.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{c.lead}</p>

        <p className="mt-4 rounded-xl border border-line bg-surface-sunken p-3 text-xs leading-relaxed text-ink-muted">
          {c.disclaimer}
        </p>

        {/* 卷三／卷四 2024 年已取消。明寫出嚟，因為新來港學生好可能係由舊資料
            或者內地補習渠道知道呢兩張卷嘅存在。 */}
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
          {c.papersNote}
        </p>

        {/* 「仲未上線」擺喺卡之前。八張只有欄名嘅卡好易被讀成「內容壞咗」，
            所以要先講清楚下面係範圍唔係成品。 */}
        <div className="mt-8 rounded-xl border border-line bg-surface-sunken p-4">
          <p className="text-sm font-medium text-ink">{c.pendingTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{c.pendingBody}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <CantoneseDseCard key={topic.topicId} topic={topic} en={en} />
          ))}
        </div>
      </div>
    </div>
  )
}
