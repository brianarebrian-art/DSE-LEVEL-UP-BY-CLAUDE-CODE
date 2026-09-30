'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Topic } from '@/data/questions'
import { useLocale } from '@/lib/i18n'
import { loadAttempts } from '@/lib/progress'
import { getTopicStats } from '@/lib/topicStats'
import { SESSION_SIZE } from '@/lib/entitlements'
import { LEVEL_LABEL, type TopicEvidence } from '@/lib/topicEvidence'
import { recommendNextPractice, type Recommendation } from '@/lib/recommendNext'
import { getReverseLog } from '@/lib/reverseLog'

// 科目頁頂的「你喺呢科」（UX 循環 LOOP 32；第二份 loop prompt §9、§41）。
// 回答「下一步做咩」：上次練習、建議下一個課題。只讀本機已有紀錄（dse_progress、
// dse_topic_stats），不寫入任何東西。沒有紀錄的學生不會見到這張卡。

export type TopicTally = Record<string, { total: number; wrong: number }>

/** 本科逐課題的本機統計；掛載前為 null。 */
export function useSubjectTopicTally(subjectId: string): TopicTally | null {
  const [tally, setTally] = useState<TopicTally | null>(null)
  useEffect(() => {
    const out: TopicTally = {}
    for (const e of getTopicStats()) if (e.subjectId === subjectId) out[e.topic] = { total: e.total, wrong: e.wrong }
    setTally(out)
  }, [subjectId])
  return tally
}

/** 課題卡上的一行：答對率、評語及題數。題數未夠只講題數。 */
export function evidenceLine(e: TopicEvidence, en: boolean): string {
  if (e.answered === 0) return ''
  const pct = Math.round(e.accuracy * 100)
  if (e.level === 'unknown') {
    return en ? `${e.answered} answered — too few to judge` : `做過 ${e.answered} 題，未夠判斷`
  }
  const label = en ? LEVEL_LABEL[e.level].en : LEVEL_LABEL[e.level].zh
  return en
    ? `${pct}% correct · ${label} · ${e.answered} answered${e.lowConfidence ? ' (little evidence)' : ''}`
    : `答對 ${pct}% · ${label} · ${e.answered} 題${e.lowConfidence ? '（證據少）' : ''}`
}

/** 推薦原因：只講有數據支持的事，不說「最弱」。 */
export function reasonLine(r: Recommendation, en: boolean): string {
  const why = r.reason
  if (why.kind === 'recentErrors') {
    return en
      ? `Recently needs consolidating: ${why.inTopic} of your last ${why.considered} wrong answers in this subject were here.`
      : `最近較需要鞏固：你喺呢科最近 ${why.considered} 次答錯，有 ${why.inTopic} 次喺呢個課題。`
  }
  if (why.kind === 'lowAccuracy') {
    return en
      ? `Recently needs consolidating: ${why.correct} of ${why.answered} correct here.`
      : `最近較需要鞏固：呢個課題做過 ${why.answered} 題，答對 ${why.correct} 題。`
  }
  return en ? 'You have not tried this topic here yet.' : '你喺呢度仲未做過呢個課題。'
}

export default function SubjectProgressPanel({
  subjectId,
  topics,
  tally,
}: {
  subjectId: string
  topics: Topic[]
  tally: TopicTally | null
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [last, setLast] = useState<{ score: number; total: number; timestamp: number } | null>(null)
  const [rec, setRec] = useState<Recommendation | null>(null)
  useEffect(() => {
    const attempts = loadAttempts()
    const mine = attempts.filter((a) => a.subjectId === subjectId)
    setLast(mine.reduce<{ score: number; total: number; timestamp: number } | null>((a, b) => (!a || b.timestamp > a.timestamp ? b : a), null))
    if (!tally) return
    // 改進循環 2（2026-09-30）：最近答錯、答對率、未試過三層，見 lib/recommendNext.ts。
    setRec(recommendNextPractice({
      subject: subjectId,
      questionCounts: topics,
      topicEvidence: tally,
      recentErrors: getReverseLog(),
      recentSessions: attempts,
    }))
  }, [subjectId, topics, tally])

  if (!tally || (!last && Object.keys(tally).length === 0)) return null
  const step = rec
  const topic = step && topics.find((t) => t.id === step.topic)
  const name = topic ? (en ? (topic.en ?? topic.zh) : topic.zh) : ''
  const date = last ? new Date(last.timestamp).toLocaleDateString(en ? 'en-GB' : 'zh-HK', { month: 'short', day: 'numeric' }) : ''

  return (
    <section aria-labelledby="subject-progress-title" className="mb-8 rounded-2xl border border-line bg-surface-raised p-5">
      <h2 id="subject-progress-title" className="text-base font-medium text-ink">{en ? 'You in this subject' : '你喺呢科'}</h2>
      {last && (
        <p className="mt-1 text-sm text-ink-muted">
          {en ? `Last practised ${date}: ${last.score} / ${last.total}.` : `上次練習：${date}，${last.score} / ${last.total}。`}
        </p>
      )}
      {step && topic && (
        <div className="mt-3">
          <p className="text-sm text-ink-soft">
            {en ? `Suggested next: ${name}.` : `建議下一步：「${name}」。`}{' '}
            <span className="text-ink-muted">{reasonLine(step, en)}</span>
          </p>
          <Link
            href={`/practice?subject=${subjectId}&topic=${encodeURIComponent(step.topic)}`}
            className="mt-3 inline-flex min-h-12 items-center rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"
          >
            {en
              ? `${SESSION_SIZE} questions on ${name} · about ${step.estimatedMinutes} min`
              : `做 ${SESSION_SIZE} 題「${name}」· 約 ${step.estimatedMinutes} 分鐘`}
          </Link>
        </div>
      )}
      <p className="mt-3 text-xs text-ink-muted">
        {en
          ? 'Based only on your practice on this device. With few questions answered, treat it as a rough guide.'
          : '只按你喺呢部機嘅練習計。做得少嘅課題，只當參考。'}
      </p>
    </section>
  )
}
