'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import CantonesePhrase from '@/components/CantonesePhrase'
import type { CantoneseTopic } from '@/data/cantonese'

// 一個場景嘅呈現層。範圍同來源嘅理由見 app/cantonese/[sceneId]/page.tsx 檔頭。
//
// 呢版比列表卡多三樣嘢，缺一「深入了解」就變咗講大話：
//   ① 逐句用法／文化提示（走X＝唔要X、小巴冇落車鐘要開聲嗌）
//   ② 詞語表 —— 句係一次過用嘅，詞係拆得開再砌嘅
//   ③ 學習提示 —— 點記，同識普通話嘅人最易踩嗰個陷阱

export default function SceneView({ topic }: { topic: CantoneseTopic }) {
  const { t, locale } = useLocale()
  const c = t.cantonese
  const en = locale === 'en'
  const safety = en ? topic.safetyEn : topic.safetyZh
  const tips = en ? topic.learnEn : topic.learnZh

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-2xl">
        {/* 三層麵包屑，所以【包 <nav>】—— 同列表頁唔同，嗰邊得一項，
            包一個 landmark 只會多咗一個要跳過嘅區域。 */}
        <nav
          aria-label={c.courseShort}
          className="mb-3 flex flex-wrap items-center gap-1 text-sm text-ink-muted"
        >
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

        <ul className="mt-6 space-y-5">
          {topic.phrases.map((p) => (
            <li key={p.canto} className="rounded-xl border border-line bg-surface-raised p-4 sm:p-5">
              <CantonesePhrase p={p} en={en} showNote />
            </li>
          ))}
        </ul>

        {/* ── 詞語表 ──
            句教到「呢個情況講呢句」，詞先至教到「換個情況點砌」。
            用 <dl> 而唔係 <table>：三欄表喺 320px 一定要橫向捲，
            而呢度每一格都要讀得完先有用。 */}
        <section className="mt-8">
          <h2 className="text-base font-medium text-ink">{c.wordsTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{c.wordsLead}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {topic.words.map((w) => (
              <li key={w.zh} className="rounded-xl border border-line bg-surface-raised p-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="text-base font-medium text-ink">{w.zh}</span>
                  <span className="font-mono text-xs tracking-tight text-accent">{w.jyut}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {w.putong}
                  <span aria-hidden> · </span>
                  {w.en}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 學習提示 ──
            唔寫「多聽多講」呢種講咗等於冇講嘅嘢。每條都要係一個
            記得住嘅規律，或者一個識普通話嘅人會實撞嘅陷阱。 */}
        <section className="mt-8 rounded-xl border border-line bg-surface-sunken p-4 sm:p-5">
          <h2 className="text-base font-medium text-ink">{c.learnTitle}</h2>
          <ul className="mt-3 space-y-2.5">
            {tips.map((tip) => (
              <li key={tip} className="border-l-2 border-line pl-3 text-sm leading-relaxed text-ink-soft">
                {tip}
              </li>
            ))}
          </ul>
          <Link
            href="/cantonese/learn"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {c.learnHubTitle}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </section>

        {/* 十六個場景全部冇 topicId —— 中文科十九個課題冇一個載得起佢哋，
            所以而家一個練習掣都唔出。夾硬指去一個唔相干嘅課題，學生撳完去到
            一版同佢啱先睇緊嘅嘢完全無關嘅練習，下次就唔會再信呢個掣。

            ⚠️ 呢段【刻意留喺詳情頁】而唔係連埋列表卡一齊剷。掣本身應該喺
               「深入了解」呢一層；留住佢，日後若果真係加返綁得到課題嘅場景，
               個掣即刻返嚟，唔使有人記得返嚟補。 */}
        {topic.topicId && (
          <Link
            href={`/practice?subject=chinese&topic=${topic.topicId}`}
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {c.practiceCta}
          </Link>
        )}

        <p className="mt-8 text-xs leading-relaxed text-ink-muted">{c.disclaimer}</p>

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
