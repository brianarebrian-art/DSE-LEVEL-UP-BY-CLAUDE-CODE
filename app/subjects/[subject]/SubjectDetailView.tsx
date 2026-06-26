'use client'

import Link from 'next/link'
import { ArrowRight, Lock, Sparkles, PenLine, BookOpenCheck } from 'lucide-react'
import { getActiveSubjects, type SubjectMeta } from '@/data/subjects'
import type { Topic } from '@/data/questions'
import { useLocale } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'
import {
  canAccessSubject,
  isFreeSubject,
  FREE_SESSION_SIZE,
  FREE_ATTEMPTS_TOTAL,
} from '@/lib/entitlements'

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
  const { isPremium, loading: planLoading, authEnabled } = usePlan()
  const sd = t.subjectDetail
  const pm = t.premium
  const en = locale === 'en'
  const name = en ? meta.nameEn : meta.name
  const short = en ? meta.shortEn : meta.short
  const description = en ? meta.descriptionEn : meta.description

  // Subject exists but has no live content yet → coming soon view.
  if (!meta.isActive || questionsCount === 0) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-6xl mb-6">{meta.emoji}</div>
          <h1 className="text-3xl font-extrabold mb-3">{name}</h1>
          <p className="text-slate-400 mb-2">{description}</p>
          <div className="inline-flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2 mt-4">
            {sd.launchPrefix}{meta.launchDate ?? sd.launchTBA}
          </div>
          <div className="mt-8">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 rounded-xl transition-all text-sm"
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

  // Paywall state (only once the session has resolved, to avoid flashing).
  const locked = authEnabled && !planLoading && !canAccessSubject(isPremium, meta.id)
  const showFreeNote =
    authEnabled && !planLoading && !isPremium && isFreeSubject(meta.id)

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-slate-500 text-sm mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-slate-300">{t.common.home}</Link>
          <span>/</span>
          <Link href="/subjects" className="hover:text-slate-300">{t.common.subjects}</Link>
          <span>/</span>
          <span>{short}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 flex items-center gap-3 flex-wrap">
            <span>{meta.emoji}</span>
            {name}
            {locked && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                <Lock size={12} /> {pm.paidTag}
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-lg">{description}</p>
        </div>

        {/* Quick start banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg mb-1">{sd.quickStartTitle}</div>
            <p className="text-slate-400 text-sm">
              {questionsCount}{sd.quickDescA}{topics.length}{sd.quickDescB}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-slate-500 flex-wrap">
              <span>{sd.minutesAbout}{Math.max(5, Math.round(questionsCount * 1.5))}{sd.minutesUnit}</span>
              <span>·</span>
              <span>{sd.gradePredict}</span>
              <span>·</span>
              <span>{sd.fullMarksA}{totalMarks}{sd.fullMarksB}</span>
            </div>
            {showFreeNote && (
              <div className="mt-3 text-xs text-amber-400/90">
                {pm.freeNote
                  .replace('{q}', String(FREE_SESSION_SIZE))
                  .replace('{cap}', String(FREE_ATTEMPTS_TOTAL))}
                {' · '}
                <Link href="/upgrade" className="underline hover:text-amber-300">{pm.upgrade}</Link>
              </div>
            )}
          </div>
          {locked ? (
            <Link
              href="/upgrade"
              className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              <Sparkles size={16} /> {pm.upgrade}
            </Link>
          ) : (
            <Link
              href={`/practice?subject=${meta.id}`}
              className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              {sd.startNow} <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* English-only: Paper 2 Writing Studio entry */}
        {meta.id === 'english' && (
          <Link
            href="/writing"
            className="group bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 hover:from-indigo-500/20 border border-indigo-500/25 hover:border-indigo-500/40 rounded-2xl p-5 mb-10 flex items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <PenLine size={20} className="text-indigo-300 shrink-0" />
              <div>
                <div className="font-bold text-slate-100">{en ? 'Paper 2 · Writing Studio' : '卷二・寫作工作室'}</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {en
                    ? 'Drafting canvas + HKEAA 7-point self-assessment rubric (2023 "Poems & Songs" theme).'
                    : '草稿區 + HKEAA 7 分制自評量表（2023「Poems & Songs」主題）。'}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-indigo-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* English-only: Paper 1 original parallel reading passages */}
        {meta.id === 'english' && (
          <Link
            href="/reading"
            className="group bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 hover:from-indigo-500/20 border border-indigo-500/25 hover:border-indigo-500/40 rounded-2xl p-5 mb-10 flex items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <BookOpenCheck size={20} className="text-indigo-300 shrink-0" />
              <div>
                <div className="font-bold text-slate-100">{en ? 'Paper 1 · Reading Passages' : '卷一・閱讀理解篇章'}</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {en
                    ? '3 original parallel passages (Dramatic Irony · Attitude · Metaphor) + 12 questions.'
                    : '3 篇原創平行篇章（戲劇性反諷・態度・比喻）+ 12 道題。'}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-indigo-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Topic list */}
        <h2 className="text-lg font-bold mb-4 text-slate-300">{sd.byTopic}</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {topics.map((topic) => {
            const inner = (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{topic.emoji}</div>
                  <div>
                    <div className="font-semibold mb-0.5">{en ? (topic.en ?? topic.zh) : topic.zh}</div>
                    <div className="text-xs text-slate-500">
                      {sd.topicFwPrefix}{en ? (topic.frameworkEn ?? topic.framework) : topic.framework}{sd.topicCountA}{topic.count}{sd.topicCountB}
                    </div>
                  </div>
                </div>
                {locked ? (
                  <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                ) : (
                  <svg
                    className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </>
            )
            return locked ? (
              <div
                key={topic.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex items-center justify-between opacity-60 cursor-not-allowed"
              >
                {inner}
              </div>
            ) : (
              <Link
                key={topic.id}
                href={`/practice?subject=${meta.id}&topic=${topic.id}`}
                className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-all flex items-center justify-between"
              >
                {inner}
              </Link>
            )
          })}
        </div>

        {/* Cross-link to other subjects */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm mb-0.5">{sd.crossTitle}</div>
            <div className="text-xs text-slate-500">{activeShortNames}{sd.crossLiveSuffix}</div>
          </div>
          <Link
            href="/subjects"
            className="shrink-0 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            {sd.crossAll} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
