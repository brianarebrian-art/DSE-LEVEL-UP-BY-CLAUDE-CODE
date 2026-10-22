import { completeSeoMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { getSyncUserId } from '@/lib/auth/server'
import SignUpPageClient from './SignUpPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '註冊 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '建立 DSE Level Up 帳戶以同步你的練習紀錄；未註冊亦可照常使用公開練習功能。', // i18n-exempt: zh-Hant fixed search metadata
}, '/sign-up')

// 已登入就唔好再見到登入頁。
//
// 用 getSyncUserId() 而唔係直接 auth()：佢係 backend-agnostic（Auth.js 今日、
// Better Auth 一開就自動跟），同 adminAllowlist 一致。
// 未設定 auth env 嗰陣佢回 null，頁面照舊顯示 —— 唔會因為冇 env 而鎖死入口。
export default async function Page() {
  if (await getSyncUserId()) redirect('/dashboard')

  return <SignUpPageClient />
}
