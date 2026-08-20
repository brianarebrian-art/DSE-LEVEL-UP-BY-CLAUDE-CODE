'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react'
import type { SourceLabEntry, SourceRef } from '@/data/history-sources'
import { RELIABILITY_LABEL } from '@/data/history-sources'
import { useLocale } from '@/lib/i18n'

type Tab = 'facts' | 'perspectives' | 'positions'

// 詮釋卡片【全部同一個中性邊框】，唔逐張換色。
//
// 原規格要求每個視角用不同顏色邊框以便區分。放棄此做法有兩個理由：
//   ① 顏色無語義 —— 紫色並不代表「修正主義」，換色只是裝飾；
//   ② 飽和色邊框的視覺重量明顯大於中性灰邊框，等於為某些視角加了強調。本頁
//      的核心主張正是各視角無主次，若實作上有輕重之別，說法即不成立。
// 區分靠視角名稱（每張卡的 <h2>），既不依賴顏色，亦符合 WCAG 1.4.1。
const CARD_BORDER = 'border-line-strong'

function SourceLine({ src, en }: { src: SourceRef; en: boolean }) {
  const label = RELIABILITY_LABEL[src.reliability]
  const cite = en ? src.citeEn : src.cite

  if (src.pending) {
    return (
      <div className="mt-2 flex items-start gap-1.5 text-[11px] text-ink-muted">
        <AlertTriangle size={12} className="shrink-0 mt-0.5 text-gold" />
        <span>
          <span className="font-medium text-ink-soft">{en ? 'Source pending' : '來源待查'}</span>
          {' — '}
          {cite}
          {en ? '. ' : '。'}
          <span className="italic">
            {en ? 'Do not cite this in an exam answer.' : '不可用作答題依據。'}
          </span>
        </span>
      </div>
    )
  }

  return (
    <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] text-ink-muted">
      <span className="font-medium text-ink-soft border border-line rounded-full px-2 py-0.5">
        {en ? label.en : label.zh}
      </span>
      {src.url ? (
        <a
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent hover:text-accent-strong underline underline-offset-2"
        >
          {cite}
          <ExternalLink size={10} aria-hidden="true" />
        </a>
      ) : (
        <span className="italic">{cite}</span>
      )}
    </div>
  )
}

export default function SourceLabClient({ entry }: { entry: SourceLabEntry }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [tab, setTab] = useState<Tab>('facts')

  const tabs: { key: Tab; zh: string; enLabel: string; count: number }[] = [
    { key: 'facts', zh: '事實', enLabel: 'Facts', count: entry.facts.length },
    { key: 'perspectives', zh: '多方詮釋', enLabel: 'Interpretations', count: entry.perspectives.length },
    { key: 'positions', zh: '各方立場', enLabel: 'Positions', count: entry.positions.length },
  ]

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-3xl mx-auto">
        {/* 標題區 */}
        <div className="mb-7">
          <Link href="/source-lab" className="text-xs text-ink-muted hover:text-accent inline-block mb-3">
            {en ? '← Source Lab' : '← 史料判讀室'}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-medium text-ink mb-2">
            {en ? entry.titleEn : entry.titleZh}
          </h1>
          <p className="text-sm text-ink-muted">
            {en ? entry.dateEn : entry.dateZh} · {en ? entry.placeEn : entry.placeZh}
          </p>
        </div>

        {/* 頁籤 */}
        <div role="tablist" aria-label={en ? 'Source layers' : '史料層次'} className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={active}
                aria-controls={`panel-${t.key}`}
                onClick={() => setTab(t.key)}
                className={`min-h-11 px-4 rounded-xl border text-sm transition-all ${
                  active
                    ? 'border-accent bg-accent/[0.10] text-ink font-medium'
                    : 'border-line bg-surface-raised text-ink-muted hover:bg-surface-sunken'
                }`}
              >
                {en ? t.enLabel : t.zh}
                <span className="ml-1.5 text-[11px] text-ink-muted">{t.count}</span>
              </button>
            )
          })}
        </div>

        {/* 事實層 */}
        {tab === 'facts' && (
          <div role="tabpanel" id="panel-facts" aria-labelledby="tab-facts" className="space-y-3">
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              {en
                ? 'What the record states. Nothing here interprets motive — that belongs in the next tab.'
                : '文獻所載之內容。此層不涉及動機詮釋，詮釋屬於下一頁籤。'}
            </p>
            {entry.facts.map((f, i) => (
              <div key={i} className="bg-surface-raised border border-line rounded-xl p-4 sm:p-5">
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-md bg-surface-sunken flex items-center justify-center text-xs font-medium text-ink-muted">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] leading-relaxed text-ink-soft">{en ? f.en : f.zh}</p>
                    <SourceLine src={f.source} en={en} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 詮釋層 —— 等寬並列，無主次 */}
        {tab === 'perspectives' && (
          <div role="tabpanel" id="panel-perspectives" aria-labelledby="tab-perspectives">
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              {en
                ? 'How each side explains the same facts. These cards are deliberately identical in size — none of them is the “right” one, and deciding between them is your job in the exam.'
                : '各方如何解釋同一批事實。以下卡片刻意完全同一規格 —— 沒有哪一個是「標準答案」，權衡取捨正是考試要你做的事。'}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {entry.perspectives.map((p, i) => (
                <div
                  key={i}
                  className={`bg-surface-raised border ${CARD_BORDER} rounded-xl p-4 sm:p-5 flex flex-col`}
                >
                  <h2 className="font-medium text-ink text-[15px] mb-2">{en ? p.nameEn : p.nameZh}</h2>
                  {/* 15px：詮釋段落同事實層一樣係實質閱讀內容，唔可以當輔助文字用 14px。 */}
                  <p className="text-[15px] leading-relaxed text-ink-soft flex-1">{en ? p.bodyEn : p.bodyZh}</p>
                  <SourceLine src={p.source} en={en} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 立場層 */}
        {tab === 'positions' && (
          <div role="tabpanel" id="panel-positions" aria-labelledby="tab-positions" className="space-y-3">
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              {en
                ? 'Who said what. A position is a record of a stance taken — not a claim that the stance was correct.'
                : '誰持何種立場。此層記錄的是「曾表明的立場」，不含該立場是否正確的判斷。'}
            </p>
            {entry.positions.map((p, i) => (
              <div key={i} className="bg-surface-raised border border-line rounded-xl p-4 sm:p-5">
                <div className="font-medium text-ink text-[15px] mb-1">{en ? p.entityEn : p.entityZh}</div>
                <p className="text-[15px] leading-relaxed text-ink-soft">{en ? p.stanceEn : p.stanceZh}</p>
                <SourceLine src={p.source} en={en} />
              </div>
            ))}
          </div>
        )}

        {/* 卷一陷阱 —— 呢個係本功能同一般百科嘅分野，故常駐於頁籤之外。 */}
        <section className="mt-8 bg-gold/[0.08] border border-gold/25 rounded-2xl p-5">
          <h2 className="font-medium text-ink text-sm mb-2">
            {en ? 'Paper 1 · where marks are lost here' : '卷一・呢條史料最易失分嘅位'}
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">{en ? entry.trapEn : entry.trapZh}</p>
        </section>

        {/* 接返落練習 */}
        <Link
          href={`/practice?subject=${entry.subject}&topic=${entry.topic}`}
          className="group mt-6 bg-surface-raised hover:bg-surface-sunken border border-line hover:border-accent/40 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all"
        >
          <div>
            <div className="font-medium text-ink text-sm">
              {en ? 'Practise this topic' : '入去練返呢個課題'}
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              {en ? 'Multiple-choice questions on the same topic.' : '同一課題的多項選擇題。'}
            </p>
          </div>
          <ArrowRight size={16} className="text-ink-muted group-hover:text-accent shrink-0 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <p className="mt-8 text-[11px] text-ink-muted leading-relaxed">
          {en
            ? 'Interpretations and positions are presented as recorded, and do not represent the platform’s own view. Verify every citation before using it in an assessed answer.'
            : '詮釋與立場均按文獻所載陳列，不代表本平台立場。任何引用在用於評核答卷之前，請自行核實。'}
        </p>
      </div>
    </div>
  )
}
