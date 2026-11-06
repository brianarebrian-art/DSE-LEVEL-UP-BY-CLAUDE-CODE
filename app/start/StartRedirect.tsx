'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import { getSubject } from '@/data/subjects'
import { loadActiveSession } from '@/lib/sessionResume'
import { loadAttempts } from '@/lib/progress'
import { startHref } from '@/lib/quickStart'
import { SESSION_SIZE } from '@/lib/entitlements'

// 回訪學生：未做完的一節 → 繼續；否則最近一科開新一節。初次來的學生 → 科目列表。
// 只讀現有的本機紀錄，不寫入任何東西。router.replace：按返回不會回到這個中轉頁。
export default function StartRedirect() {
  const router = useRouter()
  const { locale } = useLocale()
  const en = locale === 'en'

  useEffect(() => {
    const href = startHref(loadActiveSession(), loadAttempts(), (id) => !!getSubject(id)?.isActive)
    // App Router 的 router.replace 會丟掉 hash，訪客就去唔到首頁揀科區。
    // location.replace 同樣唔留 /start 喺返回堆疊。
    if (href.startsWith('/#')) {
      window.location.replace(href)
      return
    }
    router.replace(href)
  }, [router])

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center" role="status">
      <p className="text-ink-muted">{en ? 'Taking you to your practice…' : '帶你去練習……'}</p>
      {/* 冇 JavaScript 時仍然有路：主路係首頁揀科，科目列表係後備。 */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <Link
          href="/#quick-start"
          className="inline-flex h-14 min-h-14 items-center justify-center rounded-[var(--radius-control)] bg-accent-strong px-5 text-sm font-semibold text-on-accent focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {en ? `No sign-in · pick a subject, start ${SESSION_SIZE}` : `唔使登入／揀科開始 ${SESSION_SIZE} 題`}
        </Link>
        <Link href="/subjects" className="inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">
          {en ? 'Choose a subject' : '揀科目'}
        </Link>
      </div>
    </div>
  )
}
