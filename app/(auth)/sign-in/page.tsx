import { completeSeoMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { getSyncUserId } from '@/lib/auth/server'
import SignInPageClient from './SignInPageClient'

export const metadata = completeSeoMetadata({
  title: '登入 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '登入 DSE Level Up 以同步你的練習紀錄；未登入亦可照常使用公開練習功能。', // i18n-exempt: zh-Hant fixed search metadata
}, '/sign-in')

// Already signed in → dashboard. getSyncUserId() = Supabase auth.users.id.
// Read the error query here so the form is in the first HTML inside <main>.
// A useSearchParams() boundary with an empty fallback left #main-content blank.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>
}) {
  if (await getSyncUserId()) redirect('/dashboard')
  const params = await searchParams
  const raw = params.error
  const error = Array.isArray(raw) ? raw[0] : raw

  return <SignInPageClient error={error ?? null} />
}
