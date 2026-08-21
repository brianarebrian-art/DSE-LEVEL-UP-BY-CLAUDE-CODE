# 點解全站【冇】鋪 `loading.tsx`（2026-08-21 實測後嘅決定）

UI／UX 方案 §4.2 要求每頁四種狀態齊全（載入中／空白／錯誤／成功）。
「錯誤」嗰項已補（`app/error.tsx`）。「載入中」呢項**刻意只加咗一條路由**，
原因如下 —— 唔係漏做，係量過之後決定唔做。

## 一、量度結果

由首頁撳導航去 `/dashboard`（客戶端導航），量由撳落去到新內容出現：

```
urlChangedAt: 837ms
newContentAt: 837ms
gapMs:        0
畫面喺呢 837ms 內顯示緊：首頁（完整、可讀、可再撳）
```

**中間冇任何空白期。** Next App Router 喺冇 `loading.tsx` 嘅情況下，
會保持舊頁面喺畫面，直至新頁面準備好先一次過換。

若加咗 `loading.tsx`，呢 837ms 會變成：舊頁面即刻消失 → 骨架屏 → 新頁面。
即係話我哋會親手把一個「內容連續」嘅過場，換成「內容消失再出現」嘅閃動。
**呢個係倒退，唔係改善。**

（837ms 係 dev 模式即時編譯嘅數；生產環境會短好多，倒退只會更明顯。）

## 二、路由類型（`npm run build` 實際輸出）

| 標記 | 意思 | 本站數量 |
|---|---|---|
| `○` | 靜態預先 render | 34 條 |
| `●` | SSG（`generateStaticParams`）| 3 條：`/notes/[subject]`、`/source-lab/[id]`、`/subjects/[subject]` |
| `ƒ` | 每次請求即時 render | `/admin`、全部 `/api/*`、`/dev/*` |

`○` 同 `●` 兩類喺 build 時已經 render 好，執行時**根本冇伺服器等候期**，
`loading.tsx` 冇嘢好填。

## 三、所以只加咗一條

`app/admin/loading.tsx` —— `/admin` 係唯一一條使用者會見到嘅 `ƒ` 路由，
`force-dynamic` + `requireAdmin()` + Supabase 查詢，等待係真實而且喺伺服器端。
呢度個骨架屏填嘅係一段真空白。

## 四、日後想加之前，請先量

如果將來有路由由靜態改成動態（例如接咗即時資料），嗰時先加 `loading.tsx`。
判斷準則只有一條：

> **`npm run build` 嗰條路由係咪標 `ƒ`？唔係嘅話，加咗只會製造閃動。**

至於「客戶端載入資料」嗰種等待（例如 `/practice` 讀 localStorage、
`/dashboard` 算進度），已經由元件自己嘅骨架屏處理
（`components/Skeleton.tsx` → `PracticeGate`、`DashboardPageClient`），
唔關 `loading.tsx` 事 —— 兩者填嘅係唔同嘅窗口。
