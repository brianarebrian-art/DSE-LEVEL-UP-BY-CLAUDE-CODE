'use client'

import { useLocale } from '@/lib/i18n'

// 考生雷區卡（Weakness Insight Card）— Fortune 500 EdTech / Light-first。
// /design 協定：零漸變、零 ✨sparkle、無過重陰影／霓虹；高質感中性色 + border-slate-200/60
// + shadow-sm；8px grid；150ms ease-out hover；a11y（article + aria-label）；雙語。
//
// 誠實：HKEAA 逐課題 facility index 非免費公開 —— facilityIndex 可為 null，
// 卡片如實顯示「官方未公開披露」，不呈現虛構百分比（§8）。

export interface WeaknessInsight {
  topicCode: string
  topicZh: string
  topicEn: string
  facilityIndex: number | null // null = 官方未公開披露（誠實）
  riskZh: string
  riskEn: string
  mistake: { zh: string; en: string } // 常犯錯誤（避坑）
  advice: { zh: string; en: string } // 考評局建議（應做）
  sourceNoteZh?: string
  sourceNoteEn?: string
}

export default function WeaknessInsightCard({ data, en: enProp }: { data: WeaknessInsight; en?: boolean }) {
  const { locale } = useLocale()
  const en = enProp ?? locale === 'en'
  const fi = data.facilityIndex

  return (
    <article
      className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-colors duration-150 ease-out hover:border-slate-300 focus-within:border-slate-300"
      aria-label={en ? `Weak-spot insight: ${data.topicEn}` : `考生雷區：${data.topicZh}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{en ? data.topicEn : data.topicZh}</h3>
          <p className="mt-0.5 text-xs text-slate-500 truncate">{data.topicCode}</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
          {en ? 'Weak spot' : '雷區'} · {en ? data.riskEn : data.riskZh}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        {fi == null ? (
          <p className="text-xs text-slate-400">
            {en ? 'Facility index: not publicly disclosed by HKEAA' : '官方得分率：考評局未公開披露'}
          </p>
        ) : (
          <>
            <span className="text-2xl font-semibold tabular-nums text-slate-900">{Math.round(fi)}%</span>
            <span className="text-xs text-slate-500">{en ? 'facility index' : '得分率'}</span>
          </>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-rose-700">{en ? 'Avoid' : '避坑'}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{en ? data.mistake.en : data.mistake.zh}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">{en ? 'Do' : '應做'}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{en ? data.advice.en : data.advice.zh}</p>
        </div>
      </div>

      {(data.sourceNoteZh || data.sourceNoteEn) && (
        <p className="mt-3 text-[11px] text-slate-400">{en ? data.sourceNoteEn : data.sourceNoteZh}</p>
      )}
    </article>
  )
}
