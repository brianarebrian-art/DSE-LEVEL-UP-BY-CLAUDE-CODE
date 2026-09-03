'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
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


  // 側欄由 lg 起出現（80px），xl 起 260px —— 見 components/Sidebar.tsx。
  // 內容區要讓返同樣闊度，否則側欄會蓋住頁面左邊。Navbar／Footer 一齊讓，
  // 唔係淨係 main：一條由側欄底下穿出嚟嘅頁尾，睇落就係排版爛咗。
  // ⚠️ 呢度【只】管 <main>。Navbar 同 Footer 各自讓位：
  //   · Navbar 係 position:fixed，對住 viewport 唔對住父層 —— 包一個有 padding
  //     嘅 div 推唔郁佢，所以佢喺自己身上出 lg:left-20 xl:left-[260px]。
  //   · Footer 係靜態流內元素，喺自己身上出 padding 就得；而且沉浸式模式下
  //     佢根本唔 render，唔使再判斷一次。
  // 咁分法唔止係品味問題：包 div 會令 route-states.test.mts 嗰兩句
  // `!immersive && navbar` / `!immersive && footer` source 斷言失效，
  // 而嗰兩句守住嘅係「練習頁唔可以走返個導航列出嚟」呢個真行為。
  const inset = immersive ? '' : 'lg:pl-20 xl:pl-[260px]'

  return (
    <>
      {!immersive && <Sidebar />}
      {!immersive && navbar}
      {/* pb 讀 --bottom-nav-h：底欄唔顯示時係 0，唔會平白多咗一段空白。 */}
      <main
        id="main-content"
        className={immersive ? '' : `pt-16 ${inset}`}
        style={{ paddingBottom: 'var(--bottom-nav-h)' }}
      >
        {children}
      </main>
      {!immersive && footer}
    </>
  )
}
