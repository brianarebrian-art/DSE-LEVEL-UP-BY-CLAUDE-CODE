'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { type ReverseCause } from '@/lib/reverseLog'
// 排程邏輯 2026-08-23 抽咗去 lib/reviewSchedule —— 溫柔每日建議都要用同一套間隔，
// 兩邊各寫一次遲早會漂走（見該檔案頂註）。
import { dueReviews, markReviewDone, type DueItem } from '@/lib/reviewSchedule'
import { getSubject } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'

// F-REV: 錯題重溫智能排程 (Max + Ethan) — light-first 版（憲章 §3）
// 艾賓浩斯遺忘曲線：錯誤後第 1／3／7／14／30 日到期重溫。
// 數據 100% 本地（lib/reverseLog 有 questionId + topic + ts）——
// 冇 server 表（question_events 已剷、隱私紅線），完成記錄存 dse_review_done。
// 誠實限制：出題係課題內隨機抽樣，所以「開始重溫」係直入該課題操練，
// 唔係重播一模一樣嗰條題目 —— 卡片文案照直講。
// 大愛紅線：無「你仲錯／又錯」；用「溫故知新／值得再鞏固」。

const CAUSE_TAG: Record<ReverseCause, { zh: string; en: string; cls: string }> = {
  A: { zh: '概念盲區', en: 'Concept', cls: 'bg-rose/[0.10] text-rose border-rose/30' },
  B: { zh: '審題陷阱', en: 'Trap', cls: 'bg-gold/[0.10] text-gold border-gold/30' },
  C: { zh: '運算粗心', en: 'Careless', cls: 'bg-accent/[0.10] text-accent border-accent/30' },
}

export default function ReviewScheduler() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [due, setDue] = useState<DueItem[] | null>(null)

  useEffect(() => {
    setDue(dueReviews())
  }, [])

  // 撳「開始重溫」＝當日完成呢條嘅排程（直入該課題操練）
  const markDone = markReviewDone

  if (!due) return null

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6">
      <h2 className="font-medium mb-1 text-ink">📖 {en ? "Today's review suggestions" : '今日建議重溫'}</h2>
      <p className="text-xs text-ink-muted mb-4">
        {en
          ? 'Spaced repetition (day 1 / 3 / 7 / 14 / 30 after a slip) — revisiting is how knowing becomes mastery.'
          : '溫故知新 —— 按遺忘曲線（錯後第 1／3／7／14／30 日）排程，呢啲概念值得再鞏固。'}
      </p>

      {due.length === 0 ? (
        <p className="text-sm text-ink-muted py-4 text-center">
          {en ? 'No reviews due today — take it easy.' : '今日冇重溫任務，休息吓啦。'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {due.map((d) => {
            const subj = getSubject(d.subjectId)
            const tag = CAUSE_TAG[d.cause]
            return (
              <div key={d.questionId} className="flex flex-wrap items-center gap-3 bg-surface-sunken border border-line rounded-xl px-4 py-3">
                <div className="flex-1 min-w-[10rem]">
                  <div className="text-sm text-ink font-medium">
                    {subj ? (en ? subj.nameEn : subj.name) : d.subjectId} · {d.topic}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] ${tag.cls}`}>{en ? tag.en : tag.zh}</span>
                    {en ? `Slipped here ${d.daysAgo} day${d.daysAgo > 1 ? 's' : ''} ago · due today` : `上次喺呢度跌倒係 ${d.daysAgo} 日前 · 建議今日重溫`}
                  </div>
                </div>
                {/* 舊記錄冇 topicId → fallback 去科目層級（傳 label 會令題池清零） */}
                <Link
                  href={d.topicId
                    ? `/practice?subject=${encodeURIComponent(d.subjectId)}&topic=${encodeURIComponent(d.topicId)}`
                    : `/practice?subject=${encodeURIComponent(d.subjectId)}`}
                  onClick={() => markDone(d.questionId)}
                  className="min-h-11 inline-flex items-center bg-accent/10 text-accent border border-accent/30 hover:bg-accent/15 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                >
                  {en ? 'Review this topic' : '開始重溫'}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
