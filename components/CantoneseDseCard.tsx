'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/lib/i18n'
import type { CampusTopic } from '@/data/cantonese'

// 校園廣東話融入嘅單一題目卡（/cantonese）。
//
// 一張卡 = 一個校園語境 ＋ 一個【真實存在嘅中文科課題】。`topicId` 直接指向
// data/questions 嗰邊，所以「做呢個課題」個掣落到係真練習；課題唔存在嘅話
// /cantonese 個頁會 404 —— 見該頁嘅對照檢查。
//
// `signed` 決定四欄對照出唔出。冇簽名就淨係出欄名 —— 粵拼未經人審之前唔出街，
// 理由見 data/cantonese.ts 檔頭（錯一個聲調數字＝教學生讀錯音，而冇任何閘捉到）。

export default function CantoneseDseCard({
  topic,
  en,
  signed,
}: {
  topic: CampusTopic
  en: boolean
  signed: boolean
}) {
  const t = useT()
  const c = t.cantonese
  const cols = [c.colCanto, c.colJyut, c.colPutong, c.colEn]

  return (
    <div className="rounded-xl border border-line bg-surface-raised p-5">
      <h3 className="mb-2 text-base font-medium text-ink">{en ? topic.en : topic.zh}</h3>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{en ? topic.whyEn : topic.whyZh}</p>

      {signed ? (
        // 每句一組，唔用 <table>。第一版用咗 `min-w-[26rem]` 嘅表：卡實際闊
        // 286px，於是每張卡都多咗一條 15px 橫向捲動條，而第四欄直情被切走。
        // 分組排版喺窄機自然斷行，零橫向溢出。
        <ul className="mb-4 space-y-3">
          {topic.phrases.map((p) => (
            <li key={p.canto} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
              {/* gap-x-3 唔係隨手揀：本來用 gap-x-2（8px），實物睇落「老師lou5 si1」
                  黐成一嚿 —— 粗體 CJK 後面緊貼一串細嘅拉丁字母，8px 分唔開兩種字。
                  粵拼係要逐個音節讀嘅嘢，睇錯邊個字對邊個音就冇意思。 */}
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-base font-medium text-ink">{p.canto}</span>
                <span className="font-mono text-xs tracking-tight text-accent">{p.jyut}</span>
              </div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-ink-muted">
                <span>{p.putong}</span>
                <span>{p.en}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
          {cols.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}

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
