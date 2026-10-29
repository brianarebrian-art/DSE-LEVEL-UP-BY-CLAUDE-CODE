# L · Vercel／Supabase 免費額度與尖峰容量（DRAFT）

狀態：**待驗證** · 2026-10-29  
憲章：每月總技術成本死鎖約 **US$200 以內**；嚴禁擅自開付費第三方 API。  
本文件數字標「官網查核日／待核」——**唔當成已簽約報價**。

## 1. 現用付費面（定性）

| 服務 | 用途 | 備註 |
|---|---|---|
| Vercel | 託管／CDN／Web Analytics／Speed Insights | Hobby／Pro 以創辦人帳戶為準（待核 dashboard） |
| Supabase | Postgres／Auth 無用／storage 有限 | Free／Pro 待核；project `aegekxapxgcfdrkzisis` |
| Sentry | 錯誤 | 免費額常見；Replay 關 |
| Google OAuth | 登入 | 通常免費配額 |

`scripts/budget-guard.mjs` 與憲章對齊——改預算要兩邊一齊改。

## 2. 尖峰風險（考前）

| 風險 | 緩解（現有／建議） |
|---|---|
| SSR／Function 併發 | Fluid／既有 rate limit；H 降級包 |
| DB 連線 | 唔用 transaction pooler 跑 DDL；讀多寫少 |
| 濫用刮題 | IP rate limit；禁 bulk API |
| 電郵（若開 Better Auth） | 免費發信額要先核；否則唔開 A3 |

## 3. 負載測試

只可喺**批准嘅隔離環境**；唔對 production 做壓力／攻擊探測。

## 4. 待創辦人做

- 喺 Vercel／Supabase billing 截圖確認而家方案同剩餘額。  
- 若近 cap：優先降級功能而非偷偷升級（要書面准）。  
