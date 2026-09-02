'use client'

import { usePathname } from 'next/navigation'
import { isImmersiveRoute } from '@/lib/immersiveRoutes'

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
  const immersive = isImmersiveRoute(usePathname())


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
