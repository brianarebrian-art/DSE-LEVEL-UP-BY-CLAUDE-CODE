# 支柱 2：Serverless 與連線

## 這條程式實際怎麼連資料庫

學生做題的讀取走瀏覽器 PostgREST 加 IndexedDB 版本比對（憲章 3.1）。登入後的用戶資料走伺服器上的 supabase-js。兩條都是 HTTPS，不佔用 Postgres 的 5432 或 6543。

因此「把連接字串改成 6543」不能改在 `NEXT_PUBLIC_SUPABASE_URL` 上。那個值沒有埠，改了網站會連不上 API。

`POSTGRES_HOST` 目前是直連主機 `db.<ref>.supabase.co`。三條 Postgres URL 是 sensitive，這次讀不到埠。應用程式沒有使用它們。沒有改 Vercel 環境變數。

若有人把 `DATABASE_URL` 交給 `scripts/db-slow-queries.mjs`，腳本只接受主機名包含 `pooler.supabase.com` 且埠是 6543。5432 的直連或 session pooler 會直接退出。`/api/review/schedule` 在發現不合規的 `DATABASE_URL` 或 `POSTGRES_URL` 時回 503，回應只含模式名稱，不含連接字串。

## RLS

生產庫上，帶 `auth.uid()` 的政策已經是 `(SELECT auth.uid())`。裸呼叫的數量是 0。

1000 行只存在一個會回滾的臨時表裡，沒有寫進學生的表。

- 裸的 volatile SQL 函數：規劃器把它內聯成常數，Index Only Scan，執行時間 0.148 ms。
- 包在 `(SELECT ...)`：出現 InitPlan，Index Only Scan，執行時間 0.150 ms。

在 1000 行、而且函數被內聯的情況下，看不到「1840 ms 對 0.21 ms」那種差距。那個數量級來自更大的表，以及 `auth.uid()` 這種不能內聯的函數。這次沒有往生產庫灌 100 萬行來重現它。

要守住的是計劃形狀：政策繼續用 `(SELECT auth.uid())`，讓它成為 InitPlan。草稿遷移沿用這個寫法。

## 題庫與 ISR

憲章把題庫放在瀏覽器直連加靜態 chunk 回落，為的是少用 Edge Request，並在離線時仍可做題。把題庫改成 `revalidate = 3600` 的伺服器頁，會把讀取拉回 Vercel，和這項決定相反。題庫路徑沒有改。

新的 `/review/trace` 跟全站一樣是動態頁。每請求的 CSP nonce 不允許 `export const revalidate`，測試 `csp-nonce` 會攔截。因此沒有把這一頁放進 ISR。`POST /api/revalidate` 仍然存在，只接受 `CRON_SECRET`，而且只允許路徑 `/review/trace`。在 nonce 規則之下，它不會把頁面變成可快取的靜態殼。

沒有新增 Vercel Cron。現有兩條考試日 cron 繼續服務推送。FSRS 卡片表尚未在生產庫，cron 沒有資料可掃。到期判斷是純函數 `isDue`，由 `/review/trace` 在學生自己的這一次練習裡呼叫。

## 分頁

這次沒有改題庫分頁。既有題庫讀取仍按憲章的版本比對。cursor 分頁留在有新的大列表時再做，不先加一條沒人呼叫的 API。
