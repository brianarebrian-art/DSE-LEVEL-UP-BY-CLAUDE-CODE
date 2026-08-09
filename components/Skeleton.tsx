// 骨架屏（#117）。純 CSS，零套件、零 JS 動畫。
//
// 為何值得做：對象好多用舊機、慢網絡。原本載入中只得一句「載入中」置中文字 ——
// 屏幕近乎空白，等待感被放大。畫返內容輪廓之後，學生知道「嘢緊要嚟緊、幾多嘢
// 嚟緊」，等待焦慮明顯細啲。
//
// 無障礙：整組加 `aria-hidden` + `role="presentation"` —— 骨架係純視覺佔位，
// 讀屏用戶唔應該聽到一堆空白方塊。真正嘅載入狀態由外層 `aria-busy` 或可見文字
// 交代（見各使用點）。動畫規格見 globals.css `.skeleton`（呼吸式，非掃光）。

function Bar({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

/** 一張題目卡嘅輪廓：題型標籤 → 題幹兩三行 → 四個選項。 */
export function QuestionSkeleton() {
  return (
    <div role="presentation" aria-hidden className="rounded-2xl border border-line bg-surface-raised p-6">
      <div className="mb-4 flex items-center gap-2">
        <Bar className="h-5 w-16 rounded-full" />
        <Bar className="h-4 w-24" />
      </div>
      <div className="mb-6 space-y-2.5">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-11/12" />
        <Bar className="h-4 w-2/3" />
      </div>
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/** 練習頁整頁輪廓：進度條 + 一張題目卡。 */
export function PracticeSkeleton() {
  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div role="presentation" aria-hidden className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <Bar className="h-4 w-28" />
            <Bar className="h-4 w-16" />
          </div>
          <Bar className="h-2 w-full rounded-full" />
        </div>
        <QuestionSkeleton />
      </div>
    </div>
  )
}

/** 進度頁輪廓：四格數據卡 + 兩個圖表位。 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div role="presentation" aria-hidden className="mx-auto max-w-4xl">
        <Bar className="mb-2 h-9 w-40" />
        <Bar className="mb-8 h-4 w-64" />
        <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface-raised p-5">
              <Bar className="mb-3 h-5 w-5 rounded" />
              <Bar className="mb-2 h-7 w-16" />
              <Bar className="h-3 w-20" />
            </div>
          ))}
        </div>
        <Bar className="mb-6 h-48 w-full rounded-2xl" />
        <Bar className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  )
}
