'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

const Loading = (
  <div className="min-h-screen flex items-center justify-center text-slate-500">載入中…</div>
)

// Client-only: the quiz uses Math.random()/Date.now()/localStorage, so server
// rendering it would cause a hydration mismatch. ssr:false keeps it browser-only.
const PracticeSession = dynamic(() => import('./PracticeSession'), {
  ssr: false,
  loading: () => Loading,
})

function PracticeRouter() {
  const params = useSearchParams()
  const subjectId = params.get('subject') ?? 'math'
  const topicFilter = params.get('topic')
  // Re-mount the session whenever the subject/topic changes.
  return (
    <PracticeSession
      key={`${subjectId}|${topicFilter ?? ''}`}
      subjectId={subjectId}
      topicFilter={topicFilter}
    />
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={Loading}>
      <PracticeRouter />
    </Suspense>
  )
}
