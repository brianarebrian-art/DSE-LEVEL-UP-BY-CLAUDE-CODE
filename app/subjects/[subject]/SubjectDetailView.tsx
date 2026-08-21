'use client'

import Link from 'next/link'
import { ArrowRight, PenLine, BookOpenCheck, FileText, Search } from 'lucide-react'
import { getActiveSubjects, type SubjectMeta } from '@/data/subjects'
import type { Topic } from '@/data/questions'
import { useLocale } from '@/lib/i18n'

export default function SubjectDetailView({
  meta,
  questionsCount,
  writtenCount,
  topics,
}: {
  meta: SubjectMeta
  questionsCount: number
  /** 書寫題（text／long）條數。0 亦照樣顯示入口 —— 見下方長題目卡的註釋。 */
  writtenCount: number
  topics: Topic[]
}) {
  const { t, locale } = useLocale()
  const sd = t.subjectDetail
  const en = locale === 'en'
  const name = en ? meta.nameEn : meta.name
  const short = en ? meta.shortEn : meta.short
  const description = en ? meta.descriptionEn : meta.description

  // Subject exists but has no live content yet → coming soon view.
  if (!meta.isActive || questionsCount === 0) {
    return (
      <div className="min-h-screen px-4 py-20 bg-surface text-ink-soft">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-6xl mb-6">{meta.emoji}</div>
          <h1 className="text-3xl font-medium mb-3 text-ink">{name}</h1>
          <p className="text-ink-muted mb-2">{description}</p>
          <div className="inline-flex items-center gap-2 text-sm text-gold bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mt-4">
            {sd.launchPrefix}{meta.launchDate ?? sd.launchTBA}
          </div>
          <div className="mt-8">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-surface-raised hover:bg-surface-sunken border border-line-strong text-ink-soft px-5 py-3 rounded-xl transition-all text-sm"
            >
              ← {sd.backToSubjects}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalMarks = questionsCount
  const activeShortNames = getActiveSubjects()
    .map((s) => (en ? s.shortEn : s.short))
    .join(en ? ', ' : '、')

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-ink-muted text-sm mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
          <span>/</span>
          <Link href="/subjects" className="hover:text-accent">{t.common.subjects}</Link>
          <span>/</span>
          <span>{short}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-medium mb-3 flex items-center gap-3 flex-wrap text-ink">
            <span>{meta.emoji}</span>
            {name}
          </h1>
          <p className="text-ink-muted text-lg">{description}</p>
        </div>

        {/* Quick start banner */}
        <div className="bg-accent/[0.05] border border-accent/20 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-medium text-lg mb-1 text-ink">{sd.quickStartTitle}</div>
            <p className="text-ink-muted text-sm">
              {questionsCount}{sd.quickDescA}{topics.length}{sd.quickDescB}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-ink-muted flex-wrap">
              <span>{sd.minutesAbout}{Math.max(5, Math.round(questionsCount * 1.5))}{sd.minutesUnit}</span>
              <span>·</span>
              <span>{sd.gradePredict}</span>
              <span>·</span>
              <span>{sd.fullMarksA}{totalMarks}{sd.fullMarksB}</span>
            </div>
          </div>
          {(
            <Link
              href={`/practice?subject=${meta.id}`}
              className="shrink-0 inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-6 py-3 rounded-xl transition-all"
            >
              {sd.startNow} <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* 長題目入口 —— 每一科都有，唔止 MC。
            `?mode=long` 的 runner（LongPracticeSession）一直存在，但此前全站冇任何
            科目頁連去嗰度，學生實際上只做得到選擇題。此卡就是缺失的入口。
            writtenCount === 0 時仍然顯示並可點擊：runner 本身有誠實的空狀態
            （「呢科暫時未有長題目」＋ 說明人手審批流程 ＋ 回退去選擇題），
            比隱藏入口更好 —— 學生至少知道呢個題型存在、亦知道點解未有。 */}
        <Link
          href={`/practice?subject=${meta.id}&mode=long`}
          className={`group border rounded-2xl p-5 mb-4 flex items-center justify-between gap-4 transition-all ${
            writtenCount > 0
              ? 'bg-accent/[0.06] hover:bg-accent/[0.10] border-accent/25 hover:border-accent/40'
              : 'bg-ink/[0.03] hover:bg-ink/[0.05] border-ink/10 hover:border-ink/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText
              size={20}
              className={`shrink-0 ${writtenCount > 0 ? 'text-accent' : 'text-ink-muted'}`}
            />
            <div>
              <div className="font-medium text-ink">
                {en ? 'Written Paper · Long Questions' : '書寫卷・長題目'}
                {writtenCount > 0 && (
                  <span className="ml-2 text-xs font-normal text-ink-muted">
                    {writtenCount}
                    {en ? ' available' : ' 題'}
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                {writtenCount > 0
                  ? en
                    ? 'Write your own answer, then self-assess against the reference answer and marking scheme. Never machine-marked.'
                    : '自己寫答案，交卷後對照參考答案同評分準則自評。機器永不批改。'
                  : en
                    ? 'Coming soon — every written question is approved by a human one by one, so they arrive slowly.'
                    : '準備中 —— 長題目要逐條經真人審批先會上線，所以出得慢。'}
              </p>
            </div>
          </div>
          <ArrowRight
            size={16}
            className={`shrink-0 group-hover:translate-x-0.5 transition-transform ${
              writtenCount > 0 ? 'text-accent' : 'text-ink-muted'
            }`}
          />
        </Link>

        {/* English-only: Paper 2 Writing Studio entry */}
        {meta.id === 'english' && (
          <Link
            href="/writing"
            className="group bg-violet/[0.06] hover:bg-violet/[0.10] border border-violet/25 hover:border-violet/40 rounded-2xl p-5 mb-10 flex items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <PenLine size={20} className="text-violet shrink-0" />
              <div>
                <div className="font-medium text-ink">{en ? 'Paper 2 · Writing Studio' : '卷二・寫作工作室'}</div>
                <p className="text-xs text-ink-muted mt-0.5">
                  {en
                    ? 'Drafting canvas + HKEAA 7-point self-assessment rubric (2023 "Poems & Songs" theme).'
                    : '草稿區 + HKEAA 7 分制自評量表（2023「Poems & Songs」主題）。'}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-violet shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* English-only: Paper 1 original parallel reading passages */}
        {meta.id === 'english' && (
          <Link
            href="/reading"
            className="group bg-violet/[0.06] hover:bg-violet/[0.10] border border-violet/25 hover:border-violet/40 rounded-2xl p-5 mb-10 flex items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <BookOpenCheck size={20} className="text-violet shrink-0" />
              <div>
                <div className="font-medium text-ink">{en ? 'Paper 1 · Reading Passages' : '卷一・閱讀理解篇章'}</div>
                <p className="text-xs text-ink-muted mt-0.5">
                  {en
                    ? '3 original parallel passages (Dramatic Irony · Attitude · Metaphor) + 12 questions.'
                    : '3 篇原創平行篇章（戲劇性反諷・態度・比喻）+ 12 道題。'}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-violet shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* History-only: 史料判讀室（卷一資料題訓練）。中史科目前未有條目，故只掛歷史科。 */}
        {meta.id === 'history' && (
          <Link
            href="/source-lab"
            className="group bg-gold/[0.06] hover:bg-gold/[0.10] border border-gold/25 hover:border-gold/40 rounded-2xl p-5 mb-10 flex items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <Search size={20} className="text-gold shrink-0" />
              <div>
                <div className="font-medium text-ink">{en ? 'Paper 1 · Source Lab' : '卷一・史料判讀室'}</div>
                <p className="text-xs text-ink-muted mt-0.5">
                  {en
                    ? 'Fact / interpretation / position separated, each with a named citation and reliability grade.'
                    : '事實層、詮釋層、立場層分離陳列，逐項附具名引用與可靠性等級。'}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gold shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Topic list */}
        <h2 className="text-lg font-medium mb-4 text-ink">{sd.byTopic}</h2>
        {/* 只列出【有 MC】嘅課題 —— 呢啲 chips 全部連去 /practice?topic=，
            而嗰條路只服務客觀題（getQuestionsByTopic 只返 MC）。題庫自 2026-07-31
            起收 text／long，於是可以出現「有題但一條 MC 都冇」嘅課題；唔隔走，
            學生撳入去就會見到一份空白練習。書寫題有自己嘅入口（?mode=long）。 */}
        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {topics.filter((t) => (t.mcCount ?? t.count) > 0).map((topic) => (
            <Link
              key={topic.id}
              href={`/practice?subject=${meta.id}&topic=${topic.id}`}
              className="group bg-surface-raised hover:bg-surface-sunken border border-line hover:border-accent/40 rounded-xl p-5 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{topic.emoji}</div>
                <div>
                  <div className="font-medium mb-0.5 text-ink">{en ? (topic.en ?? topic.zh) : topic.zh}</div>
                  <div className="text-xs text-ink-muted">
                    {sd.topicFwPrefix}{en ? (topic.frameworkEn ?? topic.framework) : topic.framework}{sd.topicCountA}{topic.count}{sd.topicCountB}
                  </div>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-ink-muted group-hover:text-accent transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Cross-link to other subjects */}
        <div className="bg-surface-sunken border border-line rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm mb-0.5 text-ink">{sd.crossTitle}</div>
            <div className="text-xs text-ink-muted">{activeShortNames}{sd.crossLiveSuffix}</div>
          </div>
          <Link
            href="/subjects"
            className="shrink-0 text-sm text-accent hover:text-accent-strong flex items-center gap-1"
          >
            {sd.crossAll} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
