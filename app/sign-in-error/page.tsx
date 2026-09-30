import type { Metadata } from 'next'
import { Suspense } from 'react'
import SignInErrorView from './SignInErrorView'

// 登入失敗落腳頁（UX 循環 LOOP 14，2026-09-30）。auth.ts 的 pages.error 指向這裏。
// 以前沒有設定，失敗時會去 Auth.js 內建的英文錯誤頁，沒有返回練習的路。
export const metadata: Metadata = {
  title: '登入唔成功 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  description: '登入冇完成。唔登入都可以照做題，練習紀錄留喺你部機。', // i18n-exempt: 靜態 SEO description
  robots: { index: false, follow: false },
}

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
