'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { isImmersiveRoute, isMorandiRoute } from '@/lib/immersiveRoutes'

// 全站外殼 —— 決定 Navbar／Footer 出唔出，同埋 <main> 要唔要留返導航列嘅位。
//
// Navbar／Footer 由 root layout（server component）render 好再當 prop 傳入嚟，
// 所以呢個 client 組件唔會令佢哋變成 client-only，亦唔會影響 SSR。
//
// `pt-16` 係為咗避開 fixed 嘅 Navbar。全屏模式冇 Navbar，就唔可以留返嗰 64px ——
// 否則頁頂會多咗一條吉位，正正就係要剷走嗰條接縫。
export default function AppShell({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const immersive = isImmersiveRoute(pathname)

  // 莫蘭迪 scope 掛喺 <html>，唔係淨係掛喺頁面個 div。
  //
  // 點解：GlobalA11y、A11yPanel、ReadingRuler 呢啲全域浮動面板同 portal
  // 全部由 root layout render，喺頁面 div 外面 —— 只掛喺 div 嘅話，
  // 練習頁底下係莫蘭迪、但彈出嚟嘅無障礙面板仲係用返正常主題色，
  // 即係斷層。掛上 <html> 之後，任何位置嘅彈層都自動跟，
  // 將來新加嘅 portal 都唔使逐個記得包 scope。
  //
  // 頁面個 div 上面嗰個 data-ml 【刻意保留】：呢度係 useEffect，
  // 首次繪畫之前未掛得上，留住 div 嗰個可以避免內容閃一下非莫蘭迪色。
  useEffect(() => {
    const el = document.documentElement
    if (isMorandiRoute(pathname)) el.setAttribute('data-ml', '')
    else el.removeAttribute('data-ml')
    return () => el.removeAttribute('data-ml')
  }, [pathname])

  return (
    <>
      {!immersive && navbar}
      {/* pb 讀 --bottom-nav-h：底欄唔顯示時係 0，唔會平白多咗一段空白。 */}
      <main
        id="main-content"
        className={immersive ? '' : 'pt-16'}
        style={{ paddingBottom: 'var(--bottom-nav-h)' }}
      >
        {children}
      </main>
      {!immersive && footer}
    </>
  )
}
