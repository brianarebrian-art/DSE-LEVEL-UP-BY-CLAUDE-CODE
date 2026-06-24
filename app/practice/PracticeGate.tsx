'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Lock, Sparkles, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useT, useLocale } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'
import { getActiveSubjects } from '@/data/subjects'
import { canAccessSubject, sessionSizeFor, attemptCapFor } from '@/lib/entitlements'
import { getGlobalAttemptsUsed } from '@/lib/freeUsage'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { Question } from '@/data/questions'
import UpgradeModal from '@/components/UpgradeModal'

// Client-only quiz runner (uses Math.random/localStorage); mounted only once the
// gate has confirmed access AND the subject bank chunk has loaded.
const PracticeSession = dynamic(() => import('./PracticeSession'), {
  ssr: false,
  loading: () => <Loading />,
})

function Loading() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500">
      {t.common.loading}
    </div>
  )
}

// Full-page wall for a subject that isn't on the free plan at all.
function SubjectWall({ activeCount, signedIn }: { activeCount: number; signedIn: boolean }) {
  const { t } = useLocale()
  const p = t.premium
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center">
        <Lock className="text-amber-400" size={28} />
      </div>
      <h1 className="text-2xl font-extrabold">{p.wallSubjectTitle}</h1>
      <p className="text-slate-400 max-w-md leading-relaxed">
        {p.wallSubjectBody.replace('{n}', String(activeCount))}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {signedIn ? (
          <Link
            href="/upgrade"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Sparkles size={16} /> {p.upgrade}
          </Link>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            <LogIn size={16} /> {p.wallSignIn}
          </button>
        )}
        <Link
          href="/subjects"
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl transition-all text-sm"
        >
          {p.wallBack}
        </Link>
      </div>
      {!signedIn && (
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          {p.wallSignInHint}{' '}
          <Link href="/upgrade" className="text-amber-400 hover:underline">{p.upgrade}</Link>
        </p>
      )}
    </div>
  )
}

// Dimmed, locked practice backdrop sitting behind the cap modal.
function LockedBackdrop() {
  return (
    <div className="min-h-screen px-4 py-10 select-none pointer-events-none blur-[2px] opacity-40">
      <div className="max-w-2xl mx-auto">
        <div className="h-1.5 bg-slate-800 rounded-full mb-6" />
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-4 space-y-4">
          <div className="h-5 w-2/3 bg-slate-800 rounded" />
          <div className="h-12 bg-slate-800/60 rounded-xl" />
          <div className="h-12 bg-slate-800/60 rounded-xl" />
          <div className="h-12 bg-slate-800/60 rounded-xl" />
          <div className="h-12 bg-slate-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function PracticeGate({
  subjectId,
  topicFilter,
}: {
  subjectId: string
  topicFilter: string | null
}) {
  const { isPremium, signedIn, loading } = usePlan()
  const router = useRouter()

  // Free-tier usage lives in localStorage → read after mount (client only).
  const [used, setUsed] = useState<number | null>(null)
  useEffect(() => {
    setUsed(getGlobalAttemptsUsed())
  }, [])

  // The subject's question bank, lazily fetched as its own chunk.
  const [questions, setQuestions] = useState<Question[] | null>(null)

  const subjectLocked = !canAccessSubject(isPremium, subjectId)
  const cap = attemptCapFor(isPremium)
  const capReached = cap !== null && used !== null && used >= cap
  const canPractice = !loading && !subjectLocked && !capReached

  // Download the bank only when the user can actually practise (saves the chunk
  // fetch for locked / capped users).
  useEffect(() => {
    if (!canPractice) return
    let alive = true
    loadSubjectQuestions(subjectId).then((qs) => {
      if (alive) setQuestions(qs)
    })
    return () => {
      alive = false
    }
  }, [canPractice, subjectId])

  if (loading || used === null) return <Loading />

  const activeCount = getActiveSubjects().length

  // Subject not on the free plan → full-page wall.
  if (subjectLocked) {
    return <SubjectWall activeCount={activeCount} signedIn={signedIn} />
  }

  // Free plan + global attempt cap reached → popup modal over a locked backdrop.
  if (capReached) {
    return (
      <>
        <LockedBackdrop />
        <UpgradeModal cap={cap!} signedIn={signedIn} onClose={() => router.push('/subjects')} />
      </>
    )
  }

  // Access granted; wait for the bank chunk before mounting the runner.
  if (questions === null) return <Loading />

  return (
    <PracticeSession
      key={subjectId + '|' + (topicFilter ?? '')}
      bank={questions}
      subjectId={subjectId}
      topicFilter={topicFilter}
      sessionSize={sessionSizeFor(isPremium)}
      countsAgainstFreeQuota={cap !== null}
    />
  )
}
