'use client'

import Link from 'next/link'
import { PublicFrame } from '@/components/research/AdminShell'
import { ResearchGate } from '@/components/research/ResearchProvider'

export function ThanksPage({ code }: { code: string }) {
  const shown = /^R-\d{4}$/.test(code) ? code : ''
  return (
    <PublicFrame>
      <ResearchGate>
        <div className="rounded-2xl border border-line bg-surface-raised p-6" role="status">
          <h1 className="text-2xl font-semibold text-ink">已收到</h1>
          {shown ? <p className="mt-3 text-lg font-medium text-ink">編號 {shown}</p> : null}
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            呢份回覆只儲存在你而家用緊嘅瀏覽器，唔會上傳，亦唔會連到任何學生帳戶。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-on-accent">
              填寫另一份問卷
            </Link>
            <Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-4 text-sm font-medium text-ink">
              返回首頁
            </Link>
          </div>
        </div>
      </ResearchGate>
    </PublicFrame>
  )
}
