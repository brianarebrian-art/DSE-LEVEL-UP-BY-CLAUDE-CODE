// `/admin` 係全站【唯一】一條真正要等伺服器嘅使用者頁面路由
// （build 標記 `ƒ`：force-dynamic + requireAdmin() + Supabase 查詢）。
// 其餘 40 幾條路由全部係 `○` 靜態或 `●` SSG，預先 render 好，冇伺服器等候期，
// 加 loading.tsx 只會令仲有用嘅舊頁面提早被骨架屏取代 —— 詳見 app/README-loading.md。
export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 骨架係純視覺佔位，讀屏用戶唔應該聽到一堆空白方塊；
            真正嘅載入狀態由下面嗰句可見文字交代。 */}
        <div role="presentation" aria-hidden className="mb-8">
          <div className="skeleton mb-2 h-8 w-40" />
          <div className="skeleton h-4 w-72" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-line bg-surface-raised px-4 py-3">
                <div className="skeleton mb-2 h-7 w-16" />
                <div className="skeleton h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-ink-muted">
          載入審核面板⋯⋯{/* i18n-exempt: admin 內部工具，只限創辦人 */}
        </p>
      </div>
    </div>
  )
}
