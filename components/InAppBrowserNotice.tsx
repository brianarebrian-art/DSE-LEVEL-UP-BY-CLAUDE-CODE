'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'

// ============================================================================
// App 內置瀏覽器提示 —— Google OAuth 喺嗰啲環境會被 Google 自己封
// ----------------------------------------------------------------------------
// Google 由 2021 年起拒絕喺 embedded webview 完成 OAuth（防釣魚），所以喺 IG、
// Threads、Facebook、WeChat、LINE 入面撳「用 Google 繼續」會直接死，而學生
// 睇到嘅只係一版錯誤頁 —— 佢唔會知要換瀏覽器，只會走。
//
// 呢個對本平台特別致命：實測 /sign-in 【只有 Google 一個選項】
//（email/password 嘅 backend 未開），即係 OAuth 一被封就零後路。
// 而香港學生嘅流量好大部分由 IG／Threads 連過嚟。
//
// 純前端 user-agent 判斷，零後端、零套件、零追蹤 —— UA 只喺呢個組件入面讀,
// 唔會傳去任何地方、唔會存落任何地方。
// ============================================================================

// 只列【確定會封 Google OAuth 嘅 embedded webview】。
// 唔用「係咪 webview」呢類寬鬆判斷 —— 誤判嘅代價係向一個本來登入得到嘅學生
// 顯示一版「你登入唔到」，比漏判更差。
const IN_APP = /(Instagram|FBAN|FBAV|FB_IAB|Threads|MicroMessenger|Line\/|LINE|KAKAOTALK)/i

export default function InAppBrowserNotice() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [inApp, setInApp] = useState(false)

  // mount 之後先讀 —— navigator 喺 server 唔存在，而且要避免 hydration 唔一致。
  useEffect(() => {
    try { setInApp(IN_APP.test(navigator.userAgent)) } catch { /* 讀唔到就當唔係 */ }
  }, [])

  if (!inApp) return null

  return (
    <div role="status" className="mb-5 rounded-xl border border-line-strong bg-surface-sunken p-4">
      <p className="text-sm font-medium text-ink">
        {en ? 'Google sign-in is blocked in this app' : 'Google 登入喺呢個 App 入面用唔到'}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {en
          ? 'You opened this page inside an app’s built-in browser, and Google blocks sign-in there. Tap the ⋯ menu at the top and choose “Open in browser” (Safari or Chrome), then sign in again.'
          : '你而家喺 App 嘅內置瀏覽器度開咗呢一版，Google 唔准喺呢啲地方登入。撳右上角「⋯」再揀「用瀏覽器開啟」（Safari 或 Chrome），然後再登入一次。'}
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        {en
          ? 'Not signing in is fine too — practice works without an account. Signing in only syncs your progress across devices.'
          : '唔登入都做得題 —— 登入只係用嚟跨裝置同步進度，唔會解鎖任何嘢。'}
      </p>
    </div>
  )
}
