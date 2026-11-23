'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Lightbulb, Target, BookOpen, Printer, Download } from 'lucide-react'
import SubjectMark from '@/components/marks/SubjectMark'
import CauseMark from '@/components/marks/CauseMark'
import QRCode from '@/components/QRCode'
import MathText from '@/components/MathText'
import StudyQuestionExample from './StudyQuestionExample'
import { getSubject } from '@/data/subjects'
import { SUBJECT_SUMMARY, SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { AnyQuestion, MCQuestion } from '@/data/questions'
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
  const locale = 'zh' as const
  const en = false
  const tr = (zh: string, english: string) => en ? english : zh
  const params = useSearchParams()
  const pathname = usePathname()
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
    // 優先 path `/notes/{subject}/{topic}`，其次 ?topic=，最後 initialTopic／首個課題。
    // 唔好淨靠 initialTopic：click 後 router.replace 期間舊 prop 會令選項彈返。
    const pathTopic = pathname?.match(new RegExp(`^/notes/${subjectId}/([^/]+)`))?.[1] ?? ''
    const fromQuery = params.get('topic')
    const candidate = pathTopic || fromQuery || initialTopic || ''
    const next = candidate && topics.some((x) => x.id === candidate) ? candidate : (topics[0]?.id ?? '')
    setSelected((prev) => (prev === next ? prev : next))
  }, [params, topics, initialTopic, pathname, subjectId])

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
  const setupQuery = new URLSearchParams(practicePath.split('?')[1] ?? '')
  if (selected) setupQuery.set('setup', '1')
  const practiceSetupPath = selected ? `/practice?${setupQuery.toString()}` : practicePath
  const practiceSetupUrl = selected && practiceUrl
    ? new URL(practiceSetupPath, practiceUrl).toString()
    : practiceUrl
  const topicQuestions = useMemo(
    () => questions.filter((question): question is MCQuestion => question.type === 'mc' && question.topic === selected),
    [questions, selected],
  )
  const difficultyLinks = note
    ? ([
        { id: 'easy' as const, label: '基礎', count: topicQuestions.filter((question) => question.difficulty === 'easy').length, description: '鞏固核心概念' },
        { id: 'medium' as const, label: '中階', count: topicQuestions.filter((question) => question.difficulty === 'medium').length, description: '應用概念與多步推理' },
        { id: 'hard' as const, label: '挑戰', count: topicQuestions.filter((question) => question.difficulty === 'hard').length, description: '綜合應用與高階思考' },
      ].filter((level) => level.count > 0))
    : []
  const workedExample = topicQuestions.find((question) => question.steps?.length) ?? topicQuestions[0] ?? null
  const challengeQuestion = topicQuestions.find((question) => question.difficulty === 'hard' && question.id !== workedExample?.id) ?? null
  const explainer = selected
    ? topicExplainerSrc(subjectId, selected, study?.explainerSrc)
    : null

  const handlePrint = () => {
    const previousTitle = document.title
    document.title = `${meta?.name ?? subjectId}-${study?.titleZh ?? selected}-自學筆記`
    window.addEventListener('afterprint', () => { document.title = previousTitle }, { once: true })
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
                aria-describedby="pdf-help"
                className="inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
              >
                <Printer size={15} aria-hidden="true" />
              {tr('列印／儲存 PDF', 'Print / Save PDF')}
            </button>
            <p id="pdf-help" className="sr-only">
              {tr('開啟瀏覽器列印選項後，可選擇儲存為 PDF。', 'In the browser print dialog, choose Save as PDF.')}
            </p>
            <Link

              href={practiceSetupPath}
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

          {note && difficultyLinks.length > 0 && (
            <section id="practice-levels" aria-labelledby="practice-level-heading" className="no-print rounded-2xl border border-line bg-surface-raised p-4 sm:p-5">
              <h2 id="practice-level-heading" className="text-base font-semibold text-ink">選擇練習難度</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">按目前題庫可用題目選擇級別；每個級別只會抽取本課題對應難度的題目。</p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {difficultyLinks.map((level) => (
                  <li key={level.id}>
                    <Link
                      href={`${practiceSetupPath}&difficulty=${level.id}`}
                      aria-label={`以${level.label}難度開始練習，現有 ${level.count} 題`}
                      className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line-strong bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
                    >
                      <span>
                        <span className="block font-medium text-ink">{level.label}</span>
                        <span className="block text-xs text-ink-muted">{level.description}</span>
                      </span>
                      <span className="shrink-0 text-sm text-ink-muted">{level.count} 題</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 自學筆記正文 */}
          {study && (
            <section className="rounded-2xl border border-line bg-surface-raised p-4 sm:p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {tr('自學筆記', 'Self-study notes')}
              </p>
              <h2 className="mt-1 text-xl font-medium text-ink sm:text-2xl">
                {en ? study.titleEn : study.titleZh}
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                {tr(`DSE Level Up 教學團隊 · 更新日期：2026 年 11 月 23 日 · ${meta?.name ?? ''}`, `DSE Level Up · Updated 23 November 2026 · ${meta?.nameEn ?? ''}`)}
              </p>

              {explainer ? (
                <div className="mt-4 flex justify-center overflow-hidden rounded-xl bg-surface-sunken p-3">
                  <Image
                    src={explainer}
                    alt={tr(`${study.titleZh}圖解`, `${study.titleEn} diagram`)}
                    width={640}
                    height={360}
                    className="h-auto max-h-64 w-full max-w-lg object-contain"
                  />
                </div>
              ) : null}

              <h3 className="mt-4 text-sm font-medium text-ink">{tr('核心概念', 'Core concept')}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                <MathText>{en ? study.conceptEn : study.conceptZh}</MathText>
              </p>

              <div className="mt-5 rounded-xl bg-surface-sunken p-4">
                <h3 className="text-sm font-semibold text-ink">{tr('學習目標', 'Learning goal')}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {tr(`完成本節後，你應能解釋「${study.titleZh}」的核心概念，並把以下要點運用於本課題題目。`, `After this note, you should be able to explain ${study.titleEn} and apply the key points below.`)}
                </p>
              </div>

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

              {workedExample ? (
                <StudyQuestionExample
                  question={workedExample}
                  locale={locale}
                  title={tr('例題自我檢查', 'Worked-example self-check')}
                  description={tr('先自行完成這條本課題真題，再展開答案與解析。', 'Try this real question from the topic before revealing its answer and explanation.')}
                />
              ) : (
                <section className="mt-5 rounded-xl bg-surface-sunken p-4" aria-label={tr('例題自我檢查', 'Worked-example self-check')}>
                  <h3 className="text-sm font-semibold text-ink">{tr('例題自我檢查', 'Worked-example self-check')}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{tr('此課題暫未有可公開示範的選擇題；請先完成上方核心概念與必記要點。', 'No public sample question is available for this topic yet. Review the concept and key points above.')}</p>
                </section>
              )}
              {challengeQuestion ? (
                <StudyQuestionExample
                  question={challengeQuestion}
                  locale={locale}
                  title={tr('延伸挑戰', 'Extension challenge')}
                  description={tr('試用本課題的概念處理較高難度題目。', 'Apply this topic’s concepts to a higher-difficulty question.')}
                />
              ) : null}

              <div className="mt-5 rounded-xl border border-line p-4">
                <h3 className="text-sm font-semibold text-ink">常見問題</h3>
                <details className="group border-b border-line py-3" open>
                  <summary className="cursor-pointer text-sm font-medium text-ink">
                    {tr(`「${study.titleZh}」要記住甚麼？`, `What should I remember about ${study.titleEn}?`)}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    <MathText>{en ? study.mustKnowEn.join('；') : study.mustKnowZh.join('；')}</MathText>
                  </p>
                </details>
                <details className="py-3" open>
                  <summary className="cursor-pointer text-sm font-medium text-ink">
                    {tr(`「${study.titleZh}」常見陷阱是甚麼？`, `What are common traps in ${study.titleEn}?`)}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    <MathText>{en ? study.commonTrapEn : study.commonTrapZh}</MathText>
                  </p>
                </details>
              </div>
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
          <footer className="print-keep print-qr-break mt-6 rounded-2xl border border-line bg-white p-5 text-black">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <QRCode value={practiceSetupUrl} size={128} className="shrink-0" ariaLabel={`${study?.titleZh ?? selected} 練習二維碼`} />
              <div className="text-center sm:text-left">
                <p className="text-base font-semibold">
                  {tr('立即做練習', 'Practise now')}
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  {en ? study?.titleEn : study?.titleZh}
                  {' · '}
                  {en ? meta?.nameEn : meta?.name}
                </p>
                <p className="mt-2 break-all text-xs text-neutral-600">{practiceSetupUrl}</p>
                {/* This print/QR card stays white in both themes; keep its ink dark too. */}
                <p className="mt-3 text-xs text-neutral-700">
                  {tr(
                    '掃描二維碼，立即開始本課題練習。你亦可使用瀏覽器的「列印」或「儲存為 PDF」功能。',
                    'Scan the QR code to start this topic’s practice, or use your browser’s print or Save as PDF option.',
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
              href={practiceSetupPath}
              className="inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-1.5 rounded-lg bg-accent-strong text-sm font-medium text-on-accent"
            >
              <Target size={15} aria-hidden="true" />
              {difficultyLinks.length > 0 ? tr('選擇難度', 'Choose a level') : tr('練習', 'Practise')}
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
