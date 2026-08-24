'use client'

// 知識概念網 —— 中國語文指定文言範文十二篇（第 2 週 · 引擎三）
//
// 規格書 §4.4：「概念網係知識地圖而唔係收集圖鑑，強調『連接』而唔係『擁有』。」
// 所以呢一頁刻意冇：完成度百分比、解鎖動畫、成就彈窗、稀有度標籤。
// 撳節點出嘅係【該篇嘅題目同解析】—— 係學習材料，唔係分數。

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Network, Sparkles } from 'lucide-react'
import ConceptNet from '@/components/ConceptNet'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import { textsInQuestion, type ConceptNode } from '@/lib/conceptNet'
import { getSubjectQuestions } from '@/data/questions'
import type { AnyQuestion, MCQuestion } from '@/data/questions'

/** 每篇最多列幾多條 —— 一次過鋪成一版係資訊過載，本身就係壓力源。 */
const PREVIEW_LIMIT = 4

export default function ConceptNetView() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [selected, setSelected] = useState<ConceptNode | null>(null)
  const [bank, setBank] = useState<AnyQuestion[]>([])

  // 題庫喺客戶端攞：呢一頁 noindex，唔需要 SSR 出題目內容。
  useEffect(() => {
    setBank(getSubjectQuestions('chinese'))
  }, [])

  const related = useMemo(() => {
    if (!selected) return []
    return bank
      .filter((q): q is MCQuestion => q.type === 'mc') // 書寫題冇即時解析，呢個預覽只列 MC
      .filter((q) => textsInQuestion(q.content, q.topicZh).includes(selected.id))
      .slice(0, PREVIEW_LIMIT)
  }, [selected, bank])

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink-soft mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> {en ? 'Back to progress' : '返回我的進度'}
      </Link>

      <h1 className="flex items-center gap-2.5 text-2xl font-medium text-ink mb-1">
        <Network size={22} aria-hidden className="text-accent shrink-0" />
        {en ? 'Concept map' : '知識概念網'}
      </h1>
      <p className="text-sm text-ink-muted mb-1">
        {en
          ? 'The twelve prescribed classical texts, Chinese Language.'
          : '中國語文・指定文言經典學習材料十二篇。'}
      </p>
      <p className="text-xs text-ink-muted mb-8 leading-relaxed">
        {en
          ? 'A text lights up once you have answered a question on it correctly. This is a map of what you already hold — not a collection to complete.'
          : '答啱一條該篇嘅題目，佢就會著。呢度畫嘅係你已經揸得穩嘅版圖，唔係一套要儲齊嘅嘢。'}
      </p>

      <div className="bg-surface-raised border border-line rounded-2xl p-5 sm:p-7 mb-8">
        <ConceptNet onSelect={setSelected} selectedId={selected?.id ?? null} />
      </div>

      {selected ? (
        <div className="bg-surface-raised border border-line rounded-2xl p-6">
          <h2 className="text-lg font-medium text-ink mb-0.5">
            {en ? selected.en : selected.zh}
          </h2>
          <p className="text-xs text-ink-muted mb-4">
            {selected.author}
            {' · '}
            {selected.explored
              ? en
                ? `${selected.hits} answered correctly so far`
                : `至今答啱咗 ${selected.hits} 條`
              : en
                ? 'waiting to be discovered'
                : '等待發現'}
          </p>

          {related.length === 0 ? (
            <p className="text-sm text-ink-muted">
              {en
                ? 'No questions on this text are live yet.'
                : '呢篇暫時未有題目上線。'}
            </p>
          ) : (
            <div className="space-y-4">
              {related.map((q) => (
                <div key={q.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm text-ink-soft leading-relaxed mb-2">
                    <MathText>{(en ? q.contentEn || q.content : q.content) as string}</MathText>
                  </p>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    <span className="text-gold">💡 </span>
                    <MathText>{(en ? q.explanationEn || q.explanation : q.explanation) as string}</MathText>
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/practice?subject=chinese&topic=fanwen_content"
            className="mt-5 inline-flex items-center gap-2 text-sm bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Sparkles size={15} /> {en ? 'Practise the set texts' : '練指定範文'}
          </Link>
        </div>
      ) : (
        <p className="text-sm text-ink-muted text-center">
          {en ? 'Tap a node to read its questions and explanations.' : '撳一個節點，睇返嗰篇嘅題目同解析。'}
        </p>
      )}
    </main>
  )
}
