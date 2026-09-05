'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Lightbulb, Target, BookOpen, Printer } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { getSubject } from '@/data/subjects'
// 課題清單同題數 → summary.generated（靜態，唔會拉入題目）。
// 題目內容（buildTopicNote 要）→ load.ts 逐科 lazy loader。
// 兩者都刻意唔行 barrel：barrel 靜態 import 齊 25 科，喺 client 檔會將
// 2.2MB 題目 build 入瀏覽器（2026-09-05 生產站實測）。
import { SUBJECT_SUMMARY, SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { AnyQuestion } from '@/data/questions'
import { getReverseLog, type ReverseLogEntry } from '@/lib/reverseLog'
import { getTopicStats, type TopicStatEntry } from '@/lib/topicStats'
import { buildTopicNote, accuracy, type TopicNote } from '@/lib/notes/notes'

// 一科嘅知識凝結。左邊課題清單、右邊該課題筆記。
// 全部內容都係原文／真數據（見 lib/notes/notes.ts 檔頭嘅誠實說明）。

const CAUSE_LABEL: Record<'A' | 'B' | 'C', { zh: string; en: string; emoji: string }> = {
  A: { zh: '概念盲區', en: 'Conceptual blindspot', emoji: '🧠' },
  B: { zh: '審題陷阱', en: 'Reading trap', emoji: '🎯' },
  C: { zh: '運算粗心', en: 'Execution slip', emoji: '🧮' },
}

function Inner({ subjectId }: { subjectId: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)
  const params = useSearchParams()

  const meta = getSubject(subjectId)
  const topics = useMemo(() => SUBJECT_TOPICS[subjectId] ?? [], [subjectId])
  // 標題嗰個題數即刻出（靜態），唔使等題目載入。
  const questionCount = SUBJECT_SUMMARY[subjectId]?.total ?? 0
  const [questions, setQuestions] = useState<AnyQuestion[]>([])

  const [selected, setSelected] = useState<string>('')
  const [log, setLog] = useState<ReverseLogEntry[]>([])
  const [stats, setStats] = useState<TopicStatEntry[]>([])

  // localStorage 只可以 mount 之後讀（避免 hydration 唔一致）
  useEffect(() => {
    setLog(getReverseLog())
    setStats(getTopicStats())
  }, [])

  // 題目內容改為按需載入 —— 只落呢一科嘅 chunk。
  useEffect(() => {
    let alive = true
    loadSubjectQuestions(subjectId).then((qs) => { if (alive) setQuestions(qs) })
    return () => { alive = false }
  }, [subjectId])

  // ?topic= 深連結；冇就揀第一個
  useEffect(() => {
    const t = params.get('topic')
    setSelected(t && topics.some((x) => x.id === t) ? t : (topics[0]?.id ?? ''))
  }, [params, topics])

  const note: TopicNote | null = useMemo(() => {
    const t = topics.find((x) => x.id === selected)
    if (!t) return null
    // 題目未載完就唔好砌 —— 用空陣列砌出嚟係一份「0 題、0 個陷阱」嘅筆記，
    // 睇落唔似載入中，似呢個課題真係冇嘢。
    if (questions.length === 0) return null
    const stat = stats.find((s) => s.subjectId === subjectId && s.topic === t.id)
    return buildTopicNote(t.id, en ? (t.en ?? t.zh) : t.zh, t.emoji, questions, log, stat)
  }, [topics, selected, stats, subjectId, questions, log, en])

  const acc = note ? accuracy(note) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/notes" className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-accent-strong hover:underline">
        <ArrowLeft size={15} /> {tr('所有科目', 'All subjects')}
      </Link>

      <header className="mb-5">
        <h1 className="text-2xl font-medium text-ink">
          {meta?.emoji} {en ? meta?.nameEn : meta?.name}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {tr(`${topics.length} 個課題 · ${questionCount} 題`, `${topics.length} topics · ${questionCount} questions`)}
        </p>
      </header>

      {/* 課題選擇 */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`min-h-9 rounded-full px-3 py-1 text-xs transition-colors ${
              selected === t.id
                ? 'bg-surface-sunken text-violet-strong ring-1 ring-violet/40'
                : 'bg-line text-ink-muted hover:bg-line'
            }`}
          >
            {t.emoji} {en ? (t.en ?? t.zh) : t.zh}
          </button>
        ))}
      </div>

      {note && (
        <article className="space-y-4">
          {/* 真實數字 */}
          <section className="rounded-2xl border border-line bg-surface-raised p-4">
            <h2 className="text-lg font-medium text-ink">
              {note.emoji} {note.label}
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              {tr(
                `${note.total} 題 · 補底 ${note.difficulty.easy} / 普通 ${note.difficulty.medium} / 拔尖 ${note.difficulty.hard}`,
                `${note.total} questions · ${note.difficulty.easy} foundation / ${note.difficulty.medium} standard / ${note.difficulty.hard} stretch`,
              )}
            </p>
            <p className="mt-1 text-sm">
              {acc !== null ? (
                <span className="text-accent-strong">
                  {tr(
                    `你做過 ${note.attempted} 題，命中 ${acc}%`,
                    `You have done ${note.attempted} here — ${acc}% right`,
                  )}
                </span>
              ) : (
                <span className="text-ink-muted">
                  {tr('呢個課題你仲未做過 —— 下面係出題時標低嘅陷阱，可以先睇。', 'Not practised yet — the pitfalls below were flagged when these questions were written.')}
                </span>
              )}
            </p>
            <Link
              href={`/practice?subject=${subjectId}&topic=${note.topicId}`}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              <Target size={15} /> {tr('練呢個課題', 'Practise this topic')}
            </Link>
          </section>

          {/* 你自己嘅盲點（真錯題原文） */}
          {note.yourMistakes.length > 0 && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <Lightbulb size={15} className="text-gold" />
                {tr('你喺呢度跌過嘅位', 'Where you slipped here')}
              </h3>
              <ul className="mt-2.5 space-y-3">
                {note.yourMistakes.map((m) => (
                  <li key={m.questionId} className="border-l-2 border-gold/40 pl-3">
                    <p className="text-sm leading-relaxed text-ink-soft">
                      <MathText>{m.content}</MathText>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      <MathText>{m.explanation}</MathText>
                    </p>
                    <p className="mt-1 text-xs text-gold-strong">
                      {CAUSE_LABEL[m.cause].emoji} {tr(CAUSE_LABEL[m.cause].zh, CAUSE_LABEL[m.cause].en)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 出題時標註嘅陷阱（原文） */}
          {note.traps.length > 0 && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <BookOpen size={15} className="text-violet" />
                {tr('呢個課題嘅常見陷阱', 'Common pitfalls in this topic')}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {note.traps.map((t) => (
                  <li key={t.questionId} className="border-l-2 border-violet/30 pl-3 text-sm leading-relaxed text-ink-soft">
                    <MathText>{t.text}</MathText>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-xs text-ink-muted">
                {tr('以上每句都係出題時逐題標低嘅，冇經任何改寫。', 'Each line was flagged question-by-question at authoring time, quoted unchanged.')}
              </p>
            </section>
          )}

          {note.traps.length === 0 && note.yourMistakes.length === 0 && (
            <section className="rounded-2xl border border-line bg-surface-raised p-8 text-center text-sm text-ink-muted">
              {tr(
                '呢個課題暫時未有標註陷阱，你亦仲未喺度錯過題。做一份先返嚟睇？',
                'No pitfalls flagged for this topic yet, and you have not missed anything here. Try a set first?',
              )}
            </section>
          )}

          <p className="pt-1 text-center text-sm">
            <Link href={`/paper-warrior`} className="inline-flex min-h-11 items-center gap-1.5 text-accent-strong hover:underline">
              <Printer size={15} /> {tr('印一份紙筆卷練呢科', 'Print a paper set for this subject')}
            </Link>
          </p>
        </article>
      )}

      {!note && (
        <p className="rounded-2xl border border-line bg-surface-raised p-8 text-center text-sm text-ink-muted">
          {tr('呢科暫時未有課題資料。', 'No topic data for this subject yet.')}
        </p>
      )}
    </div>
  )
}

export default function NotesSubjectClient({ subjectId }: { subjectId: string }) {
  // useSearchParams 需要 Suspense 邊界
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-sm text-ink-muted">…</div>}>
      <Inner subjectId={subjectId} />
    </Suspense>
  )
}
