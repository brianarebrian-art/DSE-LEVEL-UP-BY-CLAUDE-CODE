'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Gem, ArrowRight } from 'lucide-react'
import SubjectMark from '@/components/marks/SubjectMark'
import { subjects, getSubject } from '@/data/subjects'
// 只要題數同課題數，唔要題目內容 —— 讀 summary.generated，唔好 import barrel。
import { SUBJECT_SUMMARY } from '@/data/questions/summary.generated'
import { getTopicStats, type TopicStatEntry } from '@/lib/topicStats'

// 知識凝結總覽 —— 每個有題目嘅科目一張卡。全部數字由真題庫／你嘅 localStorage 計，
// 冇做過就顯示「仲未做過」，唔會當 0% 咁寫。

interface Row {
  id: string
  name: string
  nameEn: string
  topics: number
  questions: number
  attempted: number
  wrong: number
}

export default function NotesOverview() {
  const [stats, setStats] = useState<TopicStatEntry[]>([])

  // localStorage 只可以喺 mount 之後讀（避免 hydration 唔一致）
  useEffect(() => {
    setStats(getTopicStats())
  }, [])

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    for (const s of subjects) {
      if (!s.isActive) continue
      const sum = SUBJECT_SUMMARY[s.id]
      if (!sum || sum.total === 0) continue
      const mine = stats.filter((e) => e.subjectId === s.id)
      out.push({
        id: s.id,
        name: s.name,
        nameEn: s.nameEn,
        topics: sum.topics,
        questions: sum.total,
        attempted: mine.reduce((n, e) => n + e.total, 0),
        wrong: mine.reduce((n, e) => n + e.wrong, 0),
      })
    }
    // 做得最多嘅排前（你最落力嗰科最想溫）
    return out.sort((a, b) => b.attempted - a.attempted || b.questions - a.questions)
  }, [stats])

  const totalAttempted = rows.reduce((n, r) => n + r.attempted, 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-medium text-ink">
          <Gem size={22} className="text-violet" />
          選擇科目
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          每個科目課題均設有自學筆記，可列印或另存為 PDF；紙本二維碼會連結至該課題的練習設定頁。
        </p>
      </header>

      {/* AI 參與範圍 —— 2026-08-21 重寫。
          原文寫「冇任何機器改寫」／「Nothing is machine-rewritten」，而首頁同透明度頁
          寫住「DSE 舊生 + AI 協作」。兩句都係真嘅（AI 參與嘅係出題階段，唔係你打開
          筆記嗰刻），但擺埋一齊讀落好似互相矛盾。含糊嘅澄清等於冇澄清，所以呢度直接
          講明 AI 參與到邊一步、唔參與到邊一步。 */}
      <p className="mb-5 rounded-xl border border-line bg-surface-raised p-3 text-xs leading-relaxed text-ink-muted">
        每篇筆記均根據真實題庫及你的練習紀錄整理。AI 曾參與題目初稿與分類；此處展示的是經覆核的既有解析，不會在你開啟頁面時即時改寫。
      </p>

      {totalAttempted === 0 && (
        <p className="mb-5 rounded-xl border border-gold/25 bg-surface-sunken p-3 text-sm text-gold-strong">
          你尚未完成練習，目前只會顯示各課題的題目數量；完成更多練習後，這裡便會顯示你的個人盲點。
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => {
          const sub = getSubject(r.id)
          return (
          <Link
            key={r.id}
            href={`/notes/${r.id}`}
            className="group rounded-2xl border border-line bg-surface-raised p-4 transition-colors hover:border-violet/40"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                {sub ? <SubjectMark subject={sub} size="sm" /> : null}
                {r.name}
              </span>
              <ArrowRight size={16} className="mt-0.5 shrink-0 text-ink-muted transition-colors group-hover:text-violet" />
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">
              {r.topics} 個課題 · {r.questions} 題
            </p>
            <p className="mt-1 text-xs">
              {r.attempted > 0 ? (
                <span className="text-accent-strong">
                  做過 {r.attempted} 題，答錯 {r.wrong} 題
                </span>
              ) : (
                <span className="text-ink-muted">尚未練習</span>
              )}
            </p>
          </Link>
          )
        })}
      </div>
    </div>
  )
}
