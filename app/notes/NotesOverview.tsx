'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Gem, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { subjects } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
import { getTopicStats, type TopicStatEntry } from '@/lib/topicStats'

// 知識凝結總覽 —— 每個有題目嘅科目一張卡。全部數字由真題庫／你嘅 localStorage 計，
// 冇做過就顯示「仲未做過」，唔會當 0% 咁寫。

interface Row {
  id: string
  name: string
  nameEn: string
  emoji: string
  topics: number
  questions: number
  attempted: number
  wrong: number
}

export default function NotesOverview() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)
  const [stats, setStats] = useState<TopicStatEntry[]>([])

  // localStorage 只可以喺 mount 之後讀（避免 hydration 唔一致）
  useEffect(() => {
    setStats(getTopicStats())
  }, [])

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    for (const s of subjects) {
      if (!s.isActive) continue
      const qs = getSubjectQuestions(s.id)
      if (qs.length === 0) continue
      const mine = stats.filter((e) => e.subjectId === s.id)
      out.push({
        id: s.id,
        name: s.name,
        nameEn: s.nameEn,
        emoji: s.emoji,
        topics: getSubjectTopics(s.id).length,
        questions: qs.length,
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
        <h1 className="flex items-center gap-2 text-2xl font-medium text-ink">
          <Gem size={22} className="text-violet" />
          {tr('知識凝結', 'Condensed Notes')}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {tr(
            '做題沉澱出嚟嘅筆記，唔係要你額外背多份嘢。',
            'Notes that settle out of the practice you have already done — not one more thing to memorise.',
          )}
        </p>
      </header>

      {/* 誠實說明：呢度冇 AI 摘要 */}
      <p className="mb-5 rounded-xl border border-line bg-surface-raised p-3 text-xs leading-relaxed text-ink-muted">
        {tr(
          '每篇筆記都係由真實題庫同你自己嘅練習紀錄整理出嚟 —— 解析係原文，陷阱係出題時標註低嘅，冇任何機器改寫。',
          'Every note is assembled from the real question bank and your own practice record — explanations are quoted as written and pitfalls are the ones flagged at authoring time. Nothing is machine-rewritten.',
        )}
      </p>

      {totalAttempted === 0 && (
        <p className="mb-5 rounded-xl border border-gold/25 bg-gold/[0.06] p-3 text-sm text-gold-strong">
          {tr(
            '你仲未做過練習，所以暫時淨係見到每個課題有幾多題。做多幾份，呢度就會開始顯示你自己嘅盲點。',
            'You have not practised yet, so for now these only show how many questions each topic holds. Do a few sets and your own blind spots will start appearing here.',
          )}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <Link
            key={r.id}
            href={`/notes/${r.id}`}
            className="group rounded-2xl border border-line bg-surface-raised p-4 transition-colors hover:border-violet/40"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-ink">
                {r.emoji} {en ? r.nameEn : r.name}
              </span>
              <ArrowRight size={16} className="mt-0.5 shrink-0 text-ink-muted transition-colors group-hover:text-violet" />
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">
              {tr(`${r.topics} 個課題 · ${r.questions} 題`, `${r.topics} topics · ${r.questions} questions`)}
            </p>
            <p className="mt-1 text-xs">
              {r.attempted > 0 ? (
                <span className="text-accent-strong">
                  {tr(
                    `你做過 ${r.attempted} 題，錯咗 ${r.wrong} 題`,
                    `You have done ${r.attempted}, missed ${r.wrong}`,
                  )}
                </span>
              ) : (
                <span className="text-ink-muted">{tr('仲未做過', 'Not practised yet')}</span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
