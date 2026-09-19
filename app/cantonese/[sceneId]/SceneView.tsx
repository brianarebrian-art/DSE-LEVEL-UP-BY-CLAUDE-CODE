'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import CantonesePhrase from '@/components/CantonesePhrase'
import type { CantoneseTopic, UnsureItem } from '@/data/cantonese'

// 一個場景嘅呈現層。閘同範圍嘅理由見 app/cantonese/[sceneId]/page.tsx 檔頭。

export default function SceneView({
  topic,
  unsure,
  signed,
}: {
  topic: CantoneseTopic
  /** 該場景相關嘅未定粵拼。空 array 唔等於已驗證 —— 下面有明文寫低。 */
  unsure: UnsureItem[]
  signed: boolean
}) {
  const { t, locale } = useLocale()
  const c = t.cantonese
  const en = locale === 'en'
  const safety = en ? topic.safetyEn : topic.safetyZh

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-2xl">
        {/* 三層麵包屑，所以【包 <nav>】—— 同列表頁唔同，嗰邊得一項，
            包一個 landmark 只會多咗一個要跳過嘅區域。 */}
        <nav aria-label={c.courseShort} className="mb-3 flex flex-wrap items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
          <span aria-hidden>/</span>
          <Link href="/cantonese" className="hover:text-accent">{c.courseShort}</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-soft">{en ? topic.en : topic.zh}</span>
        </nav>

        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{c.kicker}</p>
        <h1 className="mt-1 text-2xl font-medium text-ink">{en ? topic.en : topic.zh}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {en ? topic.whyEn : topic.whyZh}
        </p>

        {/* 安全提示擺喺啲句【上面】—— 一個唔舒服嘅學生應該喺讀任何一句之前
            就知道呢度唔代替醫生同老師，唔係碌到底先知。 */}
        {safety && (
          <p className="mt-4 rounded-xl border border-line bg-surface-sunken p-4 text-sm leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">{c.safetyLabel}</span>
            <span aria-hidden> · </span>
            {safety}
          </p>
        )}

        {signed ? (
          <ul className="mt-6 space-y-5">
            {topic.phrases.map((p) => (
              <li
                key={p.canto}
                className="rounded-xl border border-line bg-surface-raised p-4 sm:p-5"
              >
                <CantonesePhrase p={p} en={en} showNote />
              </li>
            ))}
          </ul>
        ) : (
          <div role="status" className="mt-6 rounded-xl border border-line bg-surface-raised p-4 sm:p-5">
            <p className="text-sm font-medium text-ink">{c.pendingTitle}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{c.pendingBody}</p>
          </div>
        )}

        {/* ── 未定粵拼 ──
            覆核人由呢度入手最有效率。⚠️ 空清單一定要出 `unsureCaveat`：
            一個場景零命中好易被讀成「呢六句已驗過」，但 UNSURE 只列
            「我知道自己唔肯定」嗰批，真正危險嘅係寫嗰陣冇為意嗰啲。 */}
        <section className="mt-8 rounded-xl border border-line bg-surface-sunken p-4 sm:p-5">
          <h2 className="text-sm font-medium text-ink">
            {unsure.length ? c.unsureTitle : c.unsureNone}
          </h2>
          {unsure.length > 0 && (
            <>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{c.unsureBody}</p>
              <ul className="mt-3 space-y-2">
                {unsure.map((u) => (
                  <li key={u.term} className="text-xs leading-relaxed text-ink-soft">
                    <span className="font-medium text-ink">{u.term}</span>
                    <span aria-hidden> — </span>
                    <span className="text-ink-muted">{u.note}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">{c.unsureCaveat}</p>
        </section>

        {/* 十二個場景全部冇 topicId —— 中文科十九個課題冇一個載得起佢哋，
            所以而家一個練習掣都唔出。夾硬指去一個唔相干嘅課題，學生撳完去到
            一版同佢啱先睇緊嘅嘢完全無關嘅練習，下次就唔會再信呢個掣。

            ⚠️ 呢段【刻意留喺詳情頁】而唔係連埋列表卡一齊剷。掣本身應該喺
               「深入了解」呢一層，唔係喺一張概覽卡上面；而留住佢，日後若果
               真係加返綁得到課題嘅場景，個掣即刻返嚟，唔使有人記得返嚟補。 */}
        {topic.topicId && (
          <Link
            href={`/practice?subject=chinese&topic=${topic.topicId}`}
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {c.practiceCta}
          </Link>
        )}

        <p className="mt-6 text-xs leading-relaxed text-ink-muted">{c.disclaimer}</p>

        <Link
          href="/cantonese"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ArrowLeft size={15} className="text-ink-muted" aria-hidden />
          {c.back}
        </Link>
      </div>
    </div>
  )
}
