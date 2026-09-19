'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import CantoneseTopicCard from '@/components/CantoneseTopicCard'
import type { CantoneseTopic } from '@/data/cantonese'

// /cantonese 嘅呈現層。範圍同留白嘅理由見 app/cantonese/page.tsx 檔頭。

export default function CantoneseView({
  topics,
  signed,
}: {
  topics: CantoneseTopic[]
  /** data/cantonese.ts 嘅 REVIEW.reviewer 有冇真人簽名。冇就唔出啲句。 */
  signed: boolean
}) {
  const { t, locale } = useLocale()
  const c = t.cantonese
  const en = locale === 'en'

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-4xl">
        {/* 麵包屑只去首頁。⚠️ 呢度一路寫住「首頁 / 中國語文」，係最初掛喺中文科
            底下嗰陣留低嘅；而家係獨立課程，指返中文科會令人以為呢版係中文科教材。 */}
        {/* 得一項，所以【唔】包 <nav> —— 一個淨係得返首頁一條連結嘅 landmark，
            對 screen reader 用家嚟講係多咗一個要跳過嘅區域，唔係多咗資訊。 */}
        <div className="mb-2 flex items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
        </div>

        {/* 「業餘班 · 非正規課程」擺喺標題【上面】而唔係腳註 —— 一個學生應該
            喺讀任何內容之前就知道呢個唔係正規課程，唔係碌到底先知。 */}
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{c.kicker}</p>
        <h1 className="mt-1 text-2xl font-medium text-ink">{c.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{c.lead}</p>

        <p className="mt-4 rounded-xl border border-line bg-surface-sunken p-3 text-xs leading-relaxed text-ink-muted">
          {c.disclaimer}
        </p>

        {/* ⚠️ 未簽名狀態嘅提示。呢兩個字典 key（pendingTitle／pendingBody）
            中英文一直都寫齊咗，但由頭到尾【冇任何地方 render 過】——
            即係話未簽名嗰陣，學生見到嘅係一版標題加一堆淨係列欄名嘅卡，
            冇任何嘢話畀佢知啲內容校對緊。2026-09-19 補返。

            擺喺卡【之前】：一個學生碌到第三張卡先知道呢度未有內容，
            前面兩張卡嘅時間就係白費。 */}
        {!signed && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-line bg-surface-raised p-4 sm:p-5"
          >
            <p className="text-sm font-medium text-ink">{c.pendingTitle}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{c.pendingBody}</p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <CantoneseTopicCard key={topic.id} topic={topic} en={en} signed={signed} />
          ))}
        </div>
      </div>
    </div>
  )
}
