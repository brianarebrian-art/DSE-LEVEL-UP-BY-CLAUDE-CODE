'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Lightbulb, Target, BookOpen, Printer, Download } from 'lucide-react'
import SubjectMark from '@/components/marks/SubjectMark'
import CauseMark from '@/components/marks/CauseMark'
import QRCode from '@/components/QRCode'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { getSubject } from '@/data/subjects'
import { SUBJECT_SUMMARY, SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { AnyQuestion } from '@/data/questions'
import { getReverseLog, type ReverseLogEntry } from '@/lib/reverseLog'
import { getTopicStats, type TopicStatEntry } from '@/lib/topicStats'
import { buildTopicNote, accuracy, type TopicNote } from '@/lib/notes/notes'
import { getSubjectStudyNotes, type StudyNote } from '@/lib/notes/studyNotes'
import { practiceTopicPath, practiceTopicUrl } from '@/lib/notes/practiceLink'
import { topicExplainerSrc } from '@/data/notes/explainers'

const CAUSE_LABEL: Record<'A' | 'B' | 'C', { zh: string; en: string }> = {
  A: { zh: '概念盲區', en: 'Conceptual blindspot' },
  B: { zh: '審題陷阱', en: 'Reading trap' },
  C: { zh: '運算粗心', en: 'Execution slip' },
}

function Inner({ subjectId, initialTopic }: { subjectId: string; initialTopic?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)
  const params = useSearchParams()
  const router = useRouter()

  const meta = getSubject(subjectId)
  const topics = useMemo(() => SUBJECT_TOPICS[subjectId] ?? [], [subjectId])
  const questionCount = SUBJECT_SUMMARY[subjectId]?.total ?? 0
  const [questions, setQuestions] = useState<AnyQuestion[]>([])

  const [selected, setSelected] = useState<string>('')
  const [log, setLog] = useState<ReverseLogEntry[]>([])
  const [stats, setStats] = useState<TopicStatEntry[]>([])
  const [studyByTopic, setStudyByTopic] = useState<Record<string, StudyNote>>({})

  useEffect(() => {
    setLog(getReverseLog())
    setStats(getTopicStats())
  }, [])

  useEffect(() => {
    let alive = true
    loadSubjectQuestions(subjectId).then((qs) => { if (alive) setQuestions(qs) })
    return () => { alive = false }
  }, [subjectId])

  useEffect(() => {
    let alive = true
    getSubjectStudyNotes(subjectId).then((notes) => { if (alive) setStudyByTopic(notes) })
    return () => { alive = false }
  }, [subjectId])

  useEffect(() => {
    const fromQuery = params.get('topic')
    const candidate = fromQuery || initialTopic || ''
    setSelected(candidate && topics.some((x) => x.id === candidate) ? candidate : (topics[0]?.id ?? ''))
  }, [params, topics, initialTopic])

  const note: TopicNote | null = useMemo(() => {
    const t = topics.find((x) => x.id === selected)
    if (!t) return null
    if (questions.length === 0) return null
    const stat = stats.find((s) => s.subjectId === subjectId && s.topic === t.id)
    return buildTopicNote(t.id, en ? (t.en ?? t.zh) : t.zh, t.emoji, questions, log, stat)
  }, [topics, selected, stats, subjectId, questions, log, en])

  const study = selected ? (studyByTopic[selected] ?? null) : null

  const acc = note ? accuracy(note) : null
  const practicePath = selected ? practiceTopicPath(subjectId, selected) : ''
  const practiceUrl = selected ? practiceTopicUrl(subjectId, selected) : ''
  const explainer = selected
    ? topicExplainerSrc(subjectId, selected, study?.explainerSrc)
    : null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-28 sm:pb-8">
      <Link
        href="/notes"
        className="no-print mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-accent-strong hover:underline"
      >
        <ArrowLeft size={15} aria-hidden="true" /> {tr('所有科目', 'All subjects')}
      </Link>

      <header className="mb-5">
        <h2 className="flex items-center gap-2 text-2xl font-medium text-ink">
          {meta ? <SubjectMark subject={meta} size="md" /> : null}
          {en ? meta?.nameEn : meta?.name}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {tr(
            `${topics.length} 個課題 · ${questionCount} 題 · 每課題一份可列印自學筆記`,
            `${topics.length} topics · ${questionCount} questions · printable notes per topic`,
          )}
        </p>
      </header>

      {/* 課題選擇：手機橫向滑動，唔逼爆一行 */}
      <div className="no-print mb-5 -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSelected(t.id)
              router.replace(`/notes/${subjectId}/${t.id}`, { scroll: false })
            }}
            className={`min-h-11 shrink-0 touch-manipulation rounded-full px-3 py-2 text-xs transition-colors ${
              selected === t.id
                ? 'bg-surface-sunken text-violet-strong ring-1 ring-violet/40'
                : 'bg-line text-ink-muted'
            }`}
          >
            {en ? (t.en ?? t.zh) : t.zh}
          </button>
        ))}
      </div>

      {(study || note) && (
        <article className="print-keep space-y-4" id="study-note-print-root">
          {/* 螢幕工具列 */}
          <div className="no-print flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
            >
              <Printer size={15} aria-hidden="true" />
              {tr('列印／儲存 PDF', 'Print / Save PDF')}
            </button>
            <Link
              href={practicePath}
              className="inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-lg border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-ink hover:bg-line"
            >
              <Target size={15} aria-hidden="true" />
              {tr('即刻練呢個課題', 'Practise this topic')}
            </Link>
            <Link
              href={`/paper-warrior?subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(selected)}`}
              className="inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-lg border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-ink hover:bg-line"
            >
              <Download size={15} aria-hidden="true" />
              {tr('印紙筆卷', 'Print paper set')}
            </Link>
          </div>

          {/* 自學筆記正文 */}
          {study && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4 sm:p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {tr('自學筆記', 'Self-study notes')}
              </p>
              <h2 className="mt-1 text-xl font-medium text-ink sm:text-2xl">
                {en ? study.titleEn : study.titleZh}
              </h2>

              {explainer ? (
                <div className="mt-4 flex justify-center overflow-hidden rounded-xl bg-surface-sunken p-3">
                  <Image
                    src={explainer}
                    alt={tr(`${study.titleZh}圖解`, `${study.titleEn} diagram`)}
                    width={640}
                    height={360}
                    className="h-auto max-h-64 w-full max-w-lg object-contain"
                    unoptimized
                  />
                </div>
              ) : null}

              <h3 className="mt-4 text-sm font-medium text-ink">{tr('核心概念', 'Core concept')}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                <MathText>{en ? study.conceptEn : study.conceptZh}</MathText>
              </p>

              <h3 className="mt-4 text-sm font-medium text-ink">{tr('必記要點', 'Must-know')}</h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft">
                {(en ? study.mustKnowEn : study.mustKnowZh).map((line) => (
                  <li key={line}>
                    <MathText>{line}</MathText>
                  </li>
                ))}
              </ul>

              <h3 className="mt-4 text-sm font-medium text-ink">{tr('考試技巧', 'Exam tip')}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                <MathText>{en ? study.examTipEn : study.examTipZh}</MathText>
              </p>

              <h3 className="mt-4 text-sm font-medium text-ink">{tr('常見陷阱', 'Common trap')}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                <MathText>{en ? study.commonTrapEn : study.commonTrapZh}</MathText>
              </p>
            </section>
          )}

          {/* 個人化數字（有題庫數據時） */}
          {note && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4">
              <h3 className="text-sm font-medium text-ink">
                {tr('題庫與你的進度', 'Bank & your progress')}
              </h3>
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
                    {tr('呢個課題你仲未做過。', 'Not practised yet.')}
                  </span>
                )}
              </p>
            </section>
          )}

          {note && note.yourMistakes.length > 0 && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <Lightbulb size={15} className="text-gold" aria-hidden="true" />
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
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gold-strong">
                      <CauseMark cause={m.cause} size="sm" />
                      {tr(CAUSE_LABEL[m.cause].zh, CAUSE_LABEL[m.cause].en)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {note && note.traps.length > 0 && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <BookOpen size={15} className="text-violet" aria-hidden="true" />
                {tr('題庫標註陷阱', 'Bank-flagged pitfalls')}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {note.traps.map((t) => (
                  <li key={t.questionId} className="border-l-2 border-violet/30 pl-3 text-sm leading-relaxed text-ink-soft">
                    <MathText>{t.text}</MathText>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 列印末頁：QR → 練習 */}
          <footer className="print-keep mt-6 break-before-page rounded-2xl border border-line bg-white p-5 text-black sm:break-before-auto">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <QRCode value={practiceUrl} size={128} className="shrink-0" />
              <div className="text-center sm:text-left">
                <p className="text-base font-medium">
                  {tr('掃碼即開本課題練習', 'Scan to open this topic’s practice')}
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  {en ? study?.titleEn : study?.titleZh}
                  {' · '}
                  {en ? meta?.nameEn : meta?.name}
                </p>
                <p className="mt-2 break-all text-xs text-neutral-600">{practiceUrl}</p>
                <p className="mt-3 text-xs text-neutral-500">
                  {tr(
                    '用瀏覽器「列印」→「儲存為 PDF」即可下載。DSE Level Up 免費 · 非考評局。',
                    'Use the browser Print → Save as PDF to download. DSE Level Up is free · not HKEAA.',
                  )}
                </p>
              </div>
            </div>
          </footer>
        </article>
      )}

      {!study && !note && (
        <p className="rounded-2xl border border-line bg-surface-raised p-8 text-center text-sm text-ink-muted">
          {questions.length === 0
            ? tr('載入筆記中…', 'Loading notes…')
            : tr('呢科暫時未有課題資料。', 'No topic data for this subject yet.')}
        </p>
      )}

      {/* 手機固定操作列 */}
      {selected ? (
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
          <div className="mx-auto flex max-w-4xl gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-1.5 rounded-lg border border-line bg-surface-raised text-sm font-medium text-ink"
            >
              <Printer size={15} aria-hidden="true" />
              {tr('列印', 'Print')}
            </button>
            <Link
              href={practicePath}
              className="inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-1.5 rounded-lg bg-accent-strong text-sm font-medium text-on-accent"
            >
              <Target size={15} aria-hidden="true" />
              {tr('練習', 'Practise')}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function NotesSubjectClient({
  subjectId,
  initialTopic,
}: {
  subjectId: string
  initialTopic?: string
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-sm text-ink-muted">…</div>}>
      <Inner subjectId={subjectId} initialTopic={initialTopic} />
    </Suspense>
  )
}
