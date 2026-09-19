'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/lib/i18n'
import CantonesePhrase from '@/components/CantonesePhrase'
import type { CantoneseTopic } from '@/data/cantonese'

// 一個日常生活場景嘅列表卡（/cantonese），撳落去入 /cantonese/{id}。
//
// ══ 列表同詳情頁嘅分別必須係真嘅 ══
// 一個撳入去見到同一樣嘢嘅「深入了解」係講大話。所以列表出【六句四欄】，
// 而逐句用法提示、詞語表同學習提示【只喺詳情頁出】——
// 十六張卡 × 每句一段提示，一屏根本睇唔晒，塞晒入嚟就變一幅冇人讀得完嘅字牆。
//
// ══ 點解用 stretched link 而唔係成張卡包落 <Link> ══
// 卡入面有 <ul>／<li>，而且日後若果 topicId 綁返課題，就會多一個練習連結 ——
// <a> 入面再有 <a> 係無效 HTML，瀏覽器會靜靜哋拆開，鍵盤同 screen reader
// 嘅行為由嗰刻起就唔可預測。所以只有一個 <a>，用 after:absolute inset-0
// 覆蓋成張卡：全張可揿，但 tab 停一次，讀屏讀到一個有名嘅連結。
//
// ⚠️ 2026-09-19：真人簽名閘剷除，內容無條件出街（Yuna 裁決）。
//    本檔原本有一個 `signed` prop 分兩個分支 —— 而家冇咗，所以亦冇咗
//    「未簽名嗰半會唔會漏內容」呢條問題。取而代之守緊嘅係粵拼結構檢查，
//    見 lib/jyutping.ts 同 data/cantonese.ts 嘅 jyutpingProblems()。

export default function CantoneseTopicCard({
  topic,
  en,
}: {
  topic: CantoneseTopic
  en: boolean
}) {
  const t = useT()
  const c = t.cantonese

  return (
    <div className="relative rounded-xl border border-line bg-surface-raised p-5 transition-colors focus-within:border-accent hover:border-accent">
      {/* h2 而唔係 h3：呢版得一個 h1（頁標題），十六張卡就係佢下面第一層。
          舊版用 h3，大綱變成 H1 → H3，中間跳咗一級 —— 靠標題跳轉嘅
          screen reader 用家會以為漏咗一段。 */}
      <h2 className="mb-2 text-base font-medium text-ink">{en ? topic.en : topic.zh}</h2>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{en ? topic.whyEn : topic.whyZh}</p>

      {/* 每句一組，唔用 <table>。第一版用咗 `min-w-[26rem]` 嘅表：卡實際闊
          286px，於是每張卡都多咗一條 15px 橫向捲動條，而第四欄直情被切走。
          分組排版喺窄機自然斷行，零橫向溢出。 */}
      <ul className="space-y-4">
        {topic.phrases.map((p) => (
          <li key={p.canto} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <CantonesePhrase p={p} en={en} showNote={false} />
          </li>
        ))}
      </ul>

      {/* 唯一嘅 <a>。`after:absolute after:inset-0` 令成張卡可揿，而 DOM 入面
          仍然得一個連結 —— tab 停一次，讀屏讀到「深入了解，打招呼及寒暄」。
          aria-label 帶埋場景名，否則十六個連結全部讀成「深入了解」。
          英文用半形冒號，中文用全形 —— 同 PageNav 嘅 label() 一致。 */}
      <Link
        href={`/cantonese/${topic.id}`}
        aria-label={en ? `${c.detailCta}: ${topic.en}` : `${c.detailCta}：${topic.zh}`}
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors after:absolute after:inset-0 after:content-[''] hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {c.detailCta}
        <ArrowRight size={15} className="text-ink-muted" aria-hidden />
      </Link>
    </div>
  )
}
