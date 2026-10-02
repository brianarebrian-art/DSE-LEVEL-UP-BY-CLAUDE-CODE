'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import { useAuthSession } from '@/lib/auth/session'
import { CONSENT_POINTS } from '@/lib/privacy/consent'
import { CLOUD_COUNT } from '@/lib/cloudKeys'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// 登入前的同步說明（audit loop T39，2026-10-02）。擺喺登入掣附近，唔係彈窗。
// 「會攞咩」直接引用同意書第一點（CONSENT_POINTS[0]），項數由 lib/cloudKeys.ts 計，
// 所以同私隱頁、同意書、實際同步清單三者唔會分叉；完整清單交由私隱頁列出。
function Note({ className }: { className?: string }) {
  const { user, status } = useAuthSession()
  const { locale } = useLocale()
  const en = locale === 'en'
  if (status !== 'unauthenticated' || user) return null
  const what = CONSENT_POINTS[0].a
  return (
    <p className={`text-xs leading-relaxed text-ink-muted ${className ?? ''}`}>
      {en ? 'Signing in syncs: ' : '登入之後會同步：'}
      {en ? what.en : what.zh}{' '}
      {en ? `Full list of ${CLOUD_COUNT} items in the ` : `完整 ${CLOUD_COUNT} 項見`}
      <Link href="/privacy" className="text-accent underline underline-offset-2">
        {en ? 'privacy policy' : '私隱政策'}
      </Link>
      {en ? '; you can delete it any time on the ' : '；想刪除，隨時可以去'}
      <Link href="/account" className="text-accent underline underline-offset-2">
        {en ? 'account page' : '帳戶頁'}
      </Link>
      {en ? '.' : '。'}
    </p>
  )
}

export default function SignInNote({ className }: { className?: string }) {
  if (!AUTH_ENABLED) return null
  return <Note className={className} />
}
