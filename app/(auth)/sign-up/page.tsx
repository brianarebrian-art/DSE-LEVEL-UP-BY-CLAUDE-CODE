import { completeSeoMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { getSyncUserId } from '@/lib/auth/server'
import SignUpPageClient from './SignUpPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '註冊 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '建立 DSE Level Up 帳戶以同步你的練習紀錄；未註冊亦可照常使用公開練習功能。', // i18n-exempt: zh-Hant fixed search metadata
}, '/sign-up')

// Already signed in → dashboard. getSyncUserId() = Supabase auth.users.id.
export default async function Page() {
  if (await getSyncUserId()) redirect('/dashboard')

  return <SignUpPageClient />
}
