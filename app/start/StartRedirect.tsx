'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import { getSubject } from '@/data/subjects'
import { loadActiveSession } from '@/lib/sessionResume'
import { loadAttempts } from '@/lib/progress'
import { startHref } from '@/lib/quickStart'

// 回訪學生：未做完的一節 → 繼續；否則最近一科開新一節。初次來的學生 → 科目列表。
// 只讀現有的本機紀錄，不寫入任何東西。router.replace：按返回不會回到這個中轉頁。
export default function StartRedirect() {
  const router = useRouter()
  const { locale } = useLocale()
  const en = locale === 'en'

  useEffect(() => {
    router.replace(startHref(loadActiveSession(), loadAttempts(), (id) => !!getSubject(id)?.isActive))
  }, [router])

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center" role="status">
      <p className="text-ink-muted">{en ? 'Taking you to your practice…' : '帶你去練習……'}</p>
      {/* 萬一轉頁失敗（例如 JavaScript 被封鎖），仍有路走。 */}
      <Link href="/subjects" className="mt-4 inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">
        {en ? 'Choose a subject' : '揀科目'}
      </Link>
    </div>
  )
}
