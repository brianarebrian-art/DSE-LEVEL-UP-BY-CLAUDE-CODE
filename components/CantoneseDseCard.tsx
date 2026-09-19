'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/lib/i18n'

// 中文科新來港支援嘅單一題目卡（/cantonese）。
//
// 一張卡 = 一個【真實存在嘅中文科課題】，唔係一個自己發明嘅分類。
// `topicId` 直接指向 data/questions 嗰邊嘅課題，所以「做呢個課題」個掣
// 落到嘅係真練習，唔係一條死連結。課題唔存在嘅話 /cantonese 個頁會喺
// build 時嗌 —— 見該頁嘅 TOPIC 對照表註釋。
//
// 四欄對照（廣東話／粵拼／普通話／English）而家【刻意留空】：逐詞內容要經
// 中文科負責人逐條審（憲章 §12），機器唔會自動入庫。留空唔係擺爛 ——
// 係唔想一個未審嘅詞表混入一個學生會照住溫嘅頁。

export interface CantoneseTopic {
  /** 對應 data/questions 嘅真課題 id */
  topicId: string
  zh: string
  en: string
  /** 考卷。中文科自 2024 年起只有卷一、卷二 —— 呢度只准 1 或 2。 */
  paper: 1 | 2
  /** 點解呢個課題對新來港學生特別難。 */
  whyZh: string
  whyEn: string
}

export default function CantoneseDseCard({
  topic,
  en,
}: {
  topic: CantoneseTopic
  en: boolean
}) {
  const t = useT()
  const c = t.cantonese
  const cols = [c.colCanto, c.colJyut, c.colPutong, c.colEn]

  return (
    <div className="rounded-xl border border-line bg-surface-raised p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-base font-medium text-ink">{en ? topic.en : topic.zh}</h3>
        <span className="shrink-0 rounded-lg border border-line px-2 py-0.5 text-xs text-ink-muted">
          {en ? `Paper ${topic.paper}` : `卷${topic.paper === 1 ? '一' : '二'}`}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{en ? topic.whyEn : topic.whyZh}</p>

      {/* 四欄對照【而家只列欄名】，唔用 <table>。
          第一版寫咗個 `min-w-[26rem]` 嘅空表：卡實際闊 286px，於是每張卡都多
          咗一條 15px 橫向捲動條，而第四欄（English）直情被切走 —— 即係為咗
          一啲根本未存在嘅內容，砌咗個會捲動嘅容器。內容落實之後先換返真表，
          到時要一齊處理窄機嘅呈現。 */}
      <ul className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
        {cols.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <Link
        href={`/practice?subject=chinese&topic=${topic.topicId}`}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {c.practiceCta}
        <ArrowRight size={15} className="text-ink-muted" aria-hidden />
      </Link>
    </div>
  )
}
