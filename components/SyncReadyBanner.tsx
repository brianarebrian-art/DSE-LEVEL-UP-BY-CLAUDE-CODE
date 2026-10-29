'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import { useAuthSession } from '@/lib/auth/session'

/**
 * After email/password or intentional post-login landing on /dashboard?sync=ok,
 * show a one-shot confirmation that progress can sync — then strip the query
 * so refresh does not re-announce.
 */
export default function SyncReadyBanner() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const { user, status } = useAuthSession()
  const search = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (search.get('sync') !== 'ok') return
    if (status === 'authenticated' && user) setShow(true)
    // Drop the flag from the URL without a full navigation stack entry.
    const next = new URLSearchParams(search.toString())
    next.delete('sync')
    const q = next.toString()
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }, [search, status, user, router, pathname])

  if (!show) return null

  return (
    <div
      role="status"
      className="mb-4 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink"
    >
      {en
        ? 'You’re signed in. Progress can sync across devices — still 100% free.'
        : '你已登入。進度可以跨裝置同步 —— 平台仍然 100% 免費。'}
      <button
        type="button"
        className="ml-3 text-accent underline underline-offset-2"
        onClick={() => setShow(false)}
      >
        {en ? 'OK' : '知道'}
      </button>
    </div>
  )
}
