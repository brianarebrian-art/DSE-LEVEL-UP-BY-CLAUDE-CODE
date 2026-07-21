'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { SESSION_SIZE } from '@/lib/entitlements'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { Question } from '@/data/questions'

// Client-only quiz runner (uses Math.random/localStorage). The platform is 100%
// free, so there is no wall, cap or tier check here any more — we simply load
// the subject's question bank (its own lazy chunk) and run.
const PracticeSession = dynamic(() => import('./PracticeSession'), {
  ssr: false,
  loading: () => <Loading />,
})

function Loading() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#6B6B6B]">
      {t.common.loading}
    </div>
  )
}

export default function PracticeGate({
  subjectId,
  topicFilter,
  mode = 'normal',
  sessionSize,
}: {
  subjectId: string
  topicFilter: string | null
  mode?: 'normal' | 'weakness'
  /** C6「只做 1 題」會傳 1；其餘一律用標準卷長。 */
  sessionSize?: number
}) {
  // The subject's question bank, lazily fetched as its own chunk.
  const [questions, setQuestions] = useState<Question[] | null>(null)

  useEffect(() => {
    let alive = true
    loadSubjectQuestions(subjectId).then((qs) => {
      if (alive) setQuestions(qs)
    })
    return () => {
      alive = false
    }
  }, [subjectId])

  if (questions === null) return <Loading />

  return (
    <PracticeSession
      key={subjectId + '|' + (topicFilter ?? '') + '|' + mode + '|' + (sessionSize ?? '')}
      bank={questions}
      subjectId={subjectId}
      topicFilter={topicFilter}
      sessionSize={sessionSize ?? SESSION_SIZE}
      mode={mode}
    />
  )
}
