import { UserOverview } from 'dse-level-up'

// Admin 用戶概覽 —— 平台真實使用量。
// ⚠️ 呢個係內部頁，唔係學生見到嘅嘢。憲章 §16.E 約束 3 禁跨用戶匯總比較，
// 所以佢只出總量，唔會出「邊個學生做得最多」呢類排名。

export function Default() {
  return (
    <div className="max-w-2xl">
      <UserOverview />
    </div>
  )
}
