'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Lightbulb, Target, BookOpen, Printer } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { getSubject } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
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
  const topics = useMemo(() => getSubjectTopics(subjectId), [subjectId])
  const questions = useMemo(() => getSubjectQuestions(subjectId), [subjectId])

  const [selected, setSelected] = useState<string>('')
  const [log, setLog] = useState<ReverseLogEntry[]>([])
  const [stats, setStats] = useState<TopicStatEntry[]>([])

  // localStorage 只可以 mount 之後讀（避免 hydration 唔一致）
  useEffect(() => {
    setLog(getReverseLog())
    setStats(getTopicStats())
  }, [])

  // ?topic= 深連結；冇就揀第一個
  useEffect(() => {
    const t = params.get('topic')
    setSelected(t && topics.some((x) => x.id === t) ? t : (topics[0]?.id ?? ''))
  }, [params, topics])

  const note: TopicNote | null = useMemo(() => {
    const t = topics.find((x) => x.id === selected)
    if (!t) return null
    const stat = stats.find((s) => s.subjectId === subjectId && s.topic === t.id)
    return buildTopicNote(t.id, en ? (t.en ?? t.zh) : t.zh, t.emoji, questions, log, stat)
  }, [topics, selected, stats, subjectId, questions, log, en])

  const acc = note ? accuracy(note) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/notes" className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-[#00726C] hover:underline">
        <ArrowLeft size={15} /> {tr('所有科目', 'All subjects')}
      </Link>

      <header className="mb-5">
        <h1 className="text-2xl font-medium text-[#1A1A1A]">
          {meta?.emoji} {en ? meta?.nameEn : meta?.name}
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          {tr(`${topics.length} 個課題 · ${questions.length} 題`, `${topics.length} topics · ${questions.length} questions`)}
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
                ? 'bg-[#7C3AED]/12 text-[#6D28D9] ring-1 ring-[#7C3AED]/40'
                : 'bg-black/[0.04] text-[#6B6B6B] hover:bg-black/[0.07]'
            }`}
          >
            {t.emoji} {en ? (t.en ?? t.zh) : t.zh}
          </button>
        ))}
      </div>

      {note && (
        <article className="space-y-4">
          {/* 真實數字 */}
          <section className="rounded-2xl border border-black/[0.06] bg-white p-4">
            <h2 className="text-lg font-medium text-[#1A1A1A]">
              {note.emoji} {note.label}
            </h2>
            <p className="mt-1.5 text-sm text-[#6B6B6B]">
              {tr(
                `${note.total} 題 · 補底 ${note.difficulty.easy} / 普通 ${note.difficulty.medium} / 拔尖 ${note.difficulty.hard}`,
                `${note.total} questions · ${note.difficulty.easy} foundation / ${note.difficulty.medium} standard / ${note.difficulty.hard} stretch`,
              )}
            </p>
            <p className="mt-1 text-sm">
              {acc !== null ? (
                <span className="text-[#00635E]">
                  {tr(
                    `你做過 ${note.attempted} 題，命中 ${acc}%`,
                    `You have done ${note.attempted} here — ${acc}% right`,
                  )}
                </span>
              ) : (
                <span className="text-[#9CA3AF]">
                  {tr('呢個課題你仲未做過 —— 下面係出題時標低嘅陷阱，可以先睇。', 'Not practised yet — the pitfalls below were flagged when these questions were written.')}
                </span>
              )}
            </p>
            <Link
              href={`/practice?subject=${subjectId}&topic=${note.topicId}`}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#00726C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005F5A]"
            >
              <Target size={15} /> {tr('練呢個課題', 'Practise this topic')}
            </Link>
          </section>

          {/* 你自己嘅盲點（真錯題原文） */}
          {note.yourMistakes.length > 0 && (
            <section className="rounded-2xl border border-black/[0.06] bg-white p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                <Lightbulb size={15} className="text-[#B8860B]" />
                {tr('你喺呢度跌過嘅位', 'Where you slipped here')}
              </h3>
              <ul className="mt-2.5 space-y-3">
                {note.yourMistakes.map((m) => (
                  <li key={m.questionId} className="border-l-2 border-[#B8860B]/40 pl-3">
                    <p className="text-sm leading-relaxed text-[#2D2D2D]">
                      <MathText>{m.content}</MathText>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#6B6B6B]">
                      <MathText>{m.explanation}</MathText>
                    </p>
                    <p className="mt-1 text-xs text-[#8a6608]">
                      {CAUSE_LABEL[m.cause].emoji} {tr(CAUSE_LABEL[m.cause].zh, CAUSE_LABEL[m.cause].en)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 出題時標註嘅陷阱（原文） */}
          {note.traps.length > 0 && (
            <section className="rounded-2xl border border-black/[0.06] bg-white p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                <BookOpen size={15} className="text-[#7C3AED]" />
                {tr('呢個課題嘅常見陷阱', 'Common pitfalls in this topic')}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {note.traps.map((t) => (
                  <li key={t.questionId} className="border-l-2 border-[#7C3AED]/30 pl-3 text-sm leading-relaxed text-[#4A4A4A]">
                    <MathText>{t.text}</MathText>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-xs text-[#9CA3AF]">
                {tr('以上每句都係出題時逐題標低嘅，冇經任何改寫。', 'Each line was flagged question-by-question at authoring time, quoted unchanged.')}
              </p>
            </section>
          )}

          {note.traps.length === 0 && note.yourMistakes.length === 0 && (
            <section className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-sm text-[#6B6B6B]">
              {tr(
                '呢個課題暫時未有標註陷阱，你亦仲未喺度錯過題。做一份先返嚟睇？',
                'No pitfalls flagged for this topic yet, and you have not missed anything here. Try a set first?',
              )}
            </section>
          )}

          <p className="pt-1 text-center text-sm">
            <Link href={`/paper-warrior`} className="inline-flex min-h-11 items-center gap-1.5 text-[#00726C] hover:underline">
              <Printer size={15} /> {tr('印一份紙筆卷練呢科', 'Print a paper set for this subject')}
            </Link>
          </p>
        </article>
      )}

      {!note && (
        <p className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-sm text-[#6B6B6B]">
          {tr('呢科暫時未有課題資料。', 'No topic data for this subject yet.')}
        </p>
      )}
    </div>
  )
}

export default function NotesSubjectClient({ subjectId }: { subjectId: string }) {
  // useSearchParams 需要 Suspense 邊界
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-sm text-[#6B6B6B]">…</div>}>
      <Inner subjectId={subjectId} />
    </Suspense>
  )
}
