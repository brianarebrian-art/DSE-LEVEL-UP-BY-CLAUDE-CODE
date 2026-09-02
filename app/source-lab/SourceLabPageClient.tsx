'use client'

import Link from 'next/link'
import { Search, ArrowRight, ScrollText } from 'lucide-react'
import { sourceLabEntries } from '@/data/history-sources'
import { useLocale } from '@/lib/i18n'

// 史料判讀室索引頁。內容來自 data/history-sources.ts，範圍限於 DSE 課程之內。
export default function SourceLabPageClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-gold bg-surface-sunken border border-gold/25 px-3 py-1 rounded-full mb-3">
            <Search size={13} /> {en ? 'History Paper 1 · Source Analysis' : '歷史卷一・史料判讀'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-ink mb-2">
            {en ? 'Source Lab' : '史料判讀室'}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">
            {en
              ? 'Paper 1 is a source paper. Each entry below separates what a document states, how each side interprets it, and where each party stood — the three things you are asked to tell apart in the exam.'
              : '卷一是資料題。以下每條史料把「文件說了什麼」、「各方如何詮釋」、「誰持什麼立場」三者分開陳列 —— 正是考試要求你分辨的三樣東西。'}
          </p>
        </div>

        {/* 來源紀律：學生需要知道呢度啲嘢點嚟，先信得過。 */}
        <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <ScrollText size={18} className="text-accent shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-ink text-sm mb-1">
                {en ? 'How sources are handled here' : '呢度點處理來源'}
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {en
                  ? 'Every fact carries a named citation and a reliability grade. Where a precise figure or archive reference could not be verified, it is marked “source pending” rather than filled in — an invented reference copied into a real exam answer costs you marks.'
                  : '每項事實都附具名引用同可靠性等級。查證不到的具體數字或檔案出處，一律標示「來源待查」而非填上 —— 一個砌出嚟嘅出處，抄入真卷會直接失分。'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sourceLabEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/source-lab/${entry.id}`}
              className="group bg-surface-raised hover:bg-surface-sunken border border-line hover:border-accent/40 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all"
            >
              <div className="min-w-0">
                <div className="font-medium text-ink mb-1">{en ? entry.titleEn : entry.titleZh}</div>
                <p className="text-xs text-ink-muted">
                  {en ? entry.dateEn : entry.dateZh} · {en ? entry.placeEn : entry.placeZh}
                </p>
                <p className="text-xs text-ink-muted mt-1.5">
                  {en
                    ? `${entry.facts.length} facts · ${entry.perspectives.length} perspectives · ${entry.positions.length} positions`
                    : `${entry.facts.length} 項事實 · ${entry.perspectives.length} 個詮釋視角 · ${entry.positions.length} 個立場`}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-ink-muted group-hover:text-accent shrink-0 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          ))}
        </div>

        <div className="no-print mt-8">
          <Link href="/subjects/history" className="text-accent hover:text-accent-strong text-sm inline-flex items-center gap-1">
            {en ? '← Back to History' : '← 返回歷史科'}
          </Link>
        </div>
      </div>
    </div>
  )
}
