'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useT } from '@/lib/i18n'
import PracticeGate from './PracticeGate'
import PracticeSupport from '@/components/PracticeSupport'
// NTM 溫柔二次確認：開咗「今晚唔溫得」入嚟會先問一次（零強制，確認即放行）
import NotTonightGate from '@/components/NotTonightGate'

// 2026-07-29：由 `page.tsx` 原封不動搬過嚟。搬遷原因見 page.tsx 檔首註釋 ——
// page.tsx 本身要變返 server component 先有伺服器端內容俾爬蟲讀，
// 而本檔所有互動邏輯（鎖死引擎／錯因自診／NTM／SEN 支援）維持不變。

function LoadingScreen() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface text-ink-muted">{t.common.loading}</div>
  )
}

function PracticeRouter() {
  const params = useSearchParams()
  const subjectId = params.get('subject') ?? 'math'
  const topicFilter = params.get('topic')
  // `long` = 書寫題獨立卷（決策 ②）。同 MC 卷完全分開，唔共用 sessionSize。
  const rawMode = params.get('mode')
  const mode = rawMode === 'weakness' ? 'weakness' : rawMode === 'long' ? 'long' : 'normal'
  // C6「只做 1 題」：唯一支援嘅細卷尺寸。刻意唔開放任意數字 ——
  // 呢個入口存在嘅意義係「門檻低到冇得再低」，唔係一個自訂長度功能。
  const size = params.get('size') === '1' ? 1 : undefined
  // Re-mount the gate (and the session beneath it) whenever subject/topic/mode changes.
  return (
    <PracticeGate
      key={`${subjectId}|${topicFilter ?? ''}|${mode}|${size ?? ''}`}
      subjectId={subjectId}
      topicFilter={topicFilter}
      mode={mode}
      sessionSize={size}
    />
  )
}

export default function PracticeShell() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <NotTonightGate>
          <PracticeRouter />
        </NotTonightGate>
      </Suspense>
      {/* 支援小隊：唞一唞（4-7-8 呼吸）+ 易讀字體切換。防跳行閱讀尺已改為全站常駐（見 layout） */}
      <PracticeSupport />
    </>
  )
}
