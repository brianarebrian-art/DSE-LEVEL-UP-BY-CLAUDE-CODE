'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Lock, Sparkles, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useT, useLocale } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'
import { getSubject, getActiveSubjects } from '@/data/subjects'
import {
  canAccessSubject,
  sessionSizeFor,
  attemptCapFor,
  FREE_ATTEMPTS_PER_SUBJECT,
} from '@/lib/entitlements'
import { getAttemptsUsed } from '@/lib/freeUsage'

// Client-only quiz runner (uses Math.random/localStorage); mounted only once the
// gate has confirmed access + the correct question count.
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

function UpgradeWall({
  kind,
  subjectName,
  cap,
  activeCount,
  signedIn,
}: {
  kind: 'subject' | 'limit'
  subjectName: string
  cap: number
  activeCount: number
  signedIn: boolean
}) {
  const { t } = useLocale()
  const p = t.premium
  const title = kind === 'subject' ? p.wallSubjectTitle : p.wallLimitTitle
  const body =
    kind === 'subject'
      ? p.wallSubjectBody.replace('{n}', String(activeCount))
      : p.wallLimitBody.replace('{cap}', String(cap)).replace('{subject}', subjectName)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center">
        <Lock className="text-amber-400" size={28} />
      </div>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="text-slate-400 max-w-md leading-relaxed">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {signedIn ? (
          <Link
            href="/upgrade"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Sparkles size={16} /> {p.upgrade}
          </Link>
        ) : (
          // Guest → encourage Google login first: it's free and may unlock Premium
          // outright (school / registered / paid email), no payment needed.
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
          <Link href="/upgrade" className="text-amber-400 hover:underline">
            {p.upgrade}
          </Link>
        </p>
      )}
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
  const { locale } = useLocale()
  const meta = getSubject(subjectId)
  const subjectName = meta ? (locale === 'en' ? meta.nameEn : meta.name) : subjectId

  // Free-tier usage is in localStorage, so read it after mount (client only).
  const [used, setUsed] = useState<number | null>(null)
  useEffect(() => {
    setUsed(getAttemptsUsed(subjectId))
  }, [subjectId])

  if (loading || used === null) return <Loading />

  const activeCount = getActiveSubjects().length

  // Subject not on the free plan → block.
  if (!canAccessSubject(isPremium, subjectId)) {
    return (
      <UpgradeWall
        kind="subject"
        subjectName={subjectName}
        cap={FREE_ATTEMPTS_PER_SUBJECT}
        activeCount={activeCount}
        signedIn={signedIn}
      />
    )
  }

  // Free plan + per-subject attempt cap reached → block.
  const cap = attemptCapFor(isPremium)
  if (cap !== null && used >= cap) {
    return (
      <UpgradeWall
        kind="limit"
        subjectName={subjectName}
        cap={cap}
        activeCount={activeCount}
        signedIn={signedIn}
      />
    )
  }

  return (
    <PracticeSession
      subjectId={subjectId}
      topicFilter={topicFilter}
      sessionSize={sessionSizeFor(isPremium)}
      countsAgainstFreeQuota={cap !== null}
    />
  )
}
