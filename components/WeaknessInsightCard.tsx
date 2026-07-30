'use client'

import { useLocale } from '@/lib/i18n'

// 考生雷區卡（Weakness Insight Card）— Fortune 500 EdTech / Light-first。
// /design 協定：零漸變、零 ✨sparkle、無過重陰影／霓虹；8px grid；150ms ease-out
// hover；a11y（article + aria-label）；雙語。
//
// ── 2026-07-30 改設計（Brian 拍板：留住並改設計，剷走得分率欄）──────────────
// 原本有 `facilityIndex`（HKEAA 逐課題官方得分率）。剷走原因唔係美觀，係【數據
// 根本唔存在】：考評局並無免費公開逐課題得分率。留住一個永遠填唔到嘅百分比欄位，
// 等於留一個「隨手填個數落去」嘅位 —— 一填即踩憲章禁虛構統計。冇來源嘅指標，
// 正確做法係唔設呢個欄位，而唔係設完之後靠註釋提醒自己唔好亂填。
//
// 剩落嘅兩欄（常犯錯誤／建議）係真人 authored 內容，有來源可考，故保留，
// 並以 `sourceNote` 明示出處（例如考評局試題報告年份）。
//
// 同時全面改用語意 token。原本卡底用 `bg-surface-raised`（跟主題）而文字寫死
// `text-slate-900`，Cyber 下係 1.05:1 —— 深字落深卡，完全睇唔到。
// 現時實測（括號＝Light／Cyber）：
//   標題 ink 落卡底（17.40／14.38）· 課題代碼 ink-muted（6.48／6.71）
//   雷區徽章 gold 落 gold/10（5.29／7.66）
//   避坑 rose 落 rose/8（5.16／6.69）· 內文 ink-soft（12.11／10.65）
//   應做 accent 落 accent/8（5.67／10.27）· 內文 ink-soft（12.23／10.24）
// 「應做」用青（accent）而唔用綠：全站冇綠色 token，而青本身就係正向主色；
// 「避坑」用玫紅（rose）而唔用正紅 —— 憲章禁大紅。

export interface WeaknessInsight {
  topicCode: string
  topicZh: string
  topicEn: string
  riskZh: string
  riskEn: string
  mistake: { zh: string; en: string } // 常犯錯誤（避坑）
  advice: { zh: string; en: string } // 考評局建議（應做）
  /** 內容出處（例如考評局試題報告年份）。有幾多就寫幾多，唔准留空當「唔使講」。 */
  sourceNoteZh?: string
  sourceNoteEn?: string
}

export default function WeaknessInsightCard({ data, en: enProp }: { data: WeaknessInsight; en?: boolean }) {
  const { locale } = useLocale()
  const en = enProp ?? locale === 'en'

  return (
    <article
      className="rounded-xl border border-line bg-surface-raised p-5 shadow-sm transition-colors duration-150 ease-out hover:border-line-strong focus-within:border-line-strong"
      aria-label={en ? `Weak-spot insight: ${data.topicEn}` : `考生雷區：${data.topicZh}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink leading-snug">{en ? data.topicEn : data.topicZh}</h3>
          <p className="mt-0.5 text-xs text-ink-muted truncate">{data.topicCode}</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-md border border-gold/30 bg-gold/10 px-2 py-1 text-[11px] font-medium text-gold">
          {en ? 'Weak spot' : '雷區'} · {en ? data.riskEn : data.riskZh}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-rose/25 bg-rose/[0.08] p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-rose">{en ? 'Avoid' : '避坑'}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{en ? data.mistake.en : data.mistake.zh}</p>
        </div>
        <div className="rounded-lg border border-accent/25 bg-accent/[0.08] p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-accent">{en ? 'Do' : '應做'}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{en ? data.advice.en : data.advice.zh}</p>
        </div>
      </div>

      {(data.sourceNoteZh || data.sourceNoteEn) && (
        <p className="mt-3 text-[11px] text-ink-muted">{en ? data.sourceNoteEn : data.sourceNoteZh}</p>
      )}
    </article>
  )
}
