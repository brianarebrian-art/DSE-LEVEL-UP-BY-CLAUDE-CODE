'use client'

import Link from 'next/link'
import { ArrowRight, PenLine, BookOpenCheck } from 'lucide-react'
import { getActiveSubjects, type SubjectMeta } from '@/data/subjects'
import type { Topic } from '@/data/questions'
import { useLocale } from '@/lib/i18n'

export default function SubjectDetailView({
  meta,
  questionsCount,
  topics,
}: {
  meta: SubjectMeta
  questionsCount: number
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

        {/* Topic list */}
        <h2 className="text-lg font-medium mb-4 text-ink">{sd.byTopic}</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {topics.map((topic) => (
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
