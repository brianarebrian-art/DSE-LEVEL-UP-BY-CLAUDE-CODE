'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useT } from '@/lib/i18n'
import PracticeGate from './PracticeGate'
import ReadingRuler from '@/components/ReadingRuler'
import PracticeSupport from '@/components/PracticeSupport'

function LoadingScreen() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500">{t.common.loading}</div>
  )
}

function PracticeRouter() {
  const params = useSearchParams()
  const subjectId = params.get('subject') ?? 'math'
  const topicFilter = params.get('topic')
  const mode = params.get('mode') === 'weakness' ? 'weakness' : 'normal'
  // Re-mount the gate (and the session beneath it) whenever subject/topic/mode changes.
  return (
    <PracticeGate
      key={`${subjectId}|${topicFilter ?? ''}|${mode}`}
      subjectId={subjectId}
      topicFilter={topicFilter}
      mode={mode}
    />
  )
}

export default function PracticePage() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <PracticeRouter />
      </Suspense>
      {/* SEN 閱讀輔助：防跳行閱讀尺（自帶開關，預設關閉） */}
      <ReadingRuler />
      {/* 支援小隊：唞一唞（4-7-8 呼吸）+ 易讀字體切換 */}
      <PracticeSupport />
    </>
  )
}
