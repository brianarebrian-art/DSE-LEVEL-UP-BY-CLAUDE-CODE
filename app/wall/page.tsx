import WallClient from './WallClient'

// 影子溫書室 —— 匿名打氣互助牆（安全 MVP：全人手審、無 auto-publish、熱線置頂）。
// <body> 係暗色霓虹，本頁跟 dashboard/result/admin 慣例補 light-first 底色，唔穿底。
export default function WallPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <WallClient />
    </div>
  )
}
