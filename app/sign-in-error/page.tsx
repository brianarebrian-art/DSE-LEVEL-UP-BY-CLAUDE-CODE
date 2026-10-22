import { completeSeoMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import SignInErrorView from './SignInErrorView'

// 登入失敗落腳頁（UX 循環 LOOP 14，2026-09-30）。auth.ts 的 pages.error 指向這裏。
// 以前沒有設定，失敗時會去 Auth.js 內建的英文錯誤頁，沒有返回練習的路。
export const metadata = completeSeoMetadata({
  title: '登入未完成 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '登入流程未完成；你仍可不登入而使用公開練習，紀錄會保留在本機。', // i18n-exempt: zh-Hant fixed search metadata
}, '/sign-in-error')

export default function SignInErrorPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      {/* useSearchParams 要喺 Suspense 之內，否則整頁會變成純客戶端渲染。 */}
      <Suspense fallback={null}>
        <SignInErrorView />
      </Suspense>
    </div>
  )
}
