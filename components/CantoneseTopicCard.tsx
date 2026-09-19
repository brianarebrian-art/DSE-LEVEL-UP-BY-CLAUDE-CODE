'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/lib/i18n'
import type { CantoneseTopic } from '@/data/cantonese'

// 一個日常生活場景嘅卡（/cantonese）。
//
// ⚠️ 本檔原名 CantoneseDseCard —— 個名係最初掛喺中文科底下嗰陣留低嘅。
//    2026-09-19 呢個變咗獨立課程，「Dse」兩個字喺呢度已經係講緊一件唔存在
//    嘅關係，所以連檔名一齊改。
//
// `signed` 決定啲句出唔出。冇簽名就淨係出【結構】—— 欄名同呢張卡涵蓋嘅
// 溝通目的，一個粵拼字元都唔會入 DOM。理由見 data/cantonese.ts 檔頭
// （錯一個聲調數字＝教學生讀錯音，而冇任何閘捉到）。
//
// 點解未簽名都要出溝通目的：一張淨係寫住「廣東話／粵拼／普通話／English」
// 嘅卡，答唔到「呢張卡教到我乜」。出埋目的，學生至少知道呢個場景會教佢
// 點發問、點禮貌拒絕 —— 而呢啲係結構，唔係未經覆核嘅事實資料。

export default function CantoneseTopicCard({
  topic,
  en,
  signed,
}: {
  topic: CantoneseTopic
  en: boolean
  signed: boolean
}) {
  const t = useT()
  const c = t.cantonese
  const cols = [c.colCanto, c.colJyut, c.colPutong, c.colEn]

  // 未簽名嗰陣出呢張卡涵蓋嘅溝通目的。用 Set 去重並保持原順序 ——
  // 六句可能有兩句同一個目的，出兩次就變咗噪音。
  const purposes = [...new Set(topic.phrases.map((p) => p.purpose))]

  const safety = en ? topic.safetyEn : topic.safetyZh

  return (
    <div className="rounded-xl border border-line bg-surface-raised p-5">
      {/* h2 而唔係 h3：呢版得一個 h1（頁標題），十二張卡就係佢下面第一層。
          舊版用 h3，大綱變成 H1 → H3，中間跳咗一級 —— 靠標題跳轉嘅
          screen reader 用家會以為漏咗一段。實測 2026-09-19：h1 × 1、h3 × 12、
          h2 × 0。 */}
      <h2 className="mb-2 text-base font-medium text-ink">{en ? topic.en : topic.zh}</h2>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{en ? topic.whyEn : topic.whyZh}</p>

      {/* 安全提示擺喺啲句【上面】—— 一個唔舒服嘅學生應該喺讀任何一句之前
          就知道呢度唔代替醫生同老師，唔係碌到底先知。 */}
      {safety && (
        <p className="mb-4 rounded-lg border border-line bg-surface-sunken p-3 text-xs leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">{c.safetyLabel}</span>
          <span aria-hidden> · </span>
          {safety}
        </p>
      )}

      {signed ? (
        // 每句一組，唔用 <table>。第一版用咗 `min-w-[26rem]` 嘅表：卡實際闊
        // 286px，於是每張卡都多咗一條 15px 橫向捲動條，而第四欄直情被切走。
        // 分組排版喺窄機自然斷行，零橫向溢出。
        <ul className="space-y-4">
          {topic.phrases.map((p) => (
            <li key={p.canto} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
              <p className="mb-1 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-muted">
                {c.purposes[p.purpose]}
              </p>
              {/* 粵拼【另起一行】，唔同廣東話並排。舊版兩者同一行 gap-x-3：短詞
                  （「打包」）睇落冇事，而家啲句長到十幾個音節，並排就會喺窄機
                  斷行斷到粵拼插入咗廣東話中間，逐個音節對唔返邊個字。 */}
              <p className="text-base font-medium leading-relaxed text-ink">{p.canto}</p>
              <p className="mt-0.5 font-mono text-xs leading-relaxed tracking-tight text-accent">
                {p.jyut}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.putong}</p>
              <p className="text-sm leading-relaxed text-ink-muted">{p.en}</p>
              {/* 註解用 text-ink-muted 而唔係 text-ink-faint —— faint 喺兩個
                  主題嘅對比係 2.36–2.91，遠低過 AA 4.5。呢啲係學生真係要讀
                  嘅文化提示，唔係裝飾字。token-contrast 測試 ⑤ 捉返。 */}
              {(en ? p.noteEn : p.noteZh) && (
                <p className="mt-1.5 border-l-2 border-line pl-2.5 text-xs leading-relaxed text-ink-muted">
                  {en ? p.noteEn : p.noteZh}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-muted">
              {c.purposeLabel}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {purposes.map((p) => (
                <li
                  key={p}
                  className="rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink-soft"
                >
                  {c.purposes[p]}
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
            {cols.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 十二個主題全部冇 topicId —— 中文科十九個課題冇一個載得起佢哋，所以
          唔出練習掣。夾硬指去一個唔相干嘅課題，學生撳完去到一版同佢啱先睇緊
          嘅嘢完全無關嘅練習 —— 下次就唔會再信呢個掣。
          呢段留住，係因為日後若果加返綁得到課題嘅主題，個掣即刻返嚟。 */}
      {topic.topicId && (
        <Link
          href={`/practice?subject=chinese&topic=${topic.topicId}`}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {c.practiceCta}
          <ArrowRight size={15} className="text-ink-muted" aria-hidden />
        </Link>
      )}
    </div>
  )
}
