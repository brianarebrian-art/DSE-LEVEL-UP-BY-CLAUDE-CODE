# MCP 連線檢查

檢查時間：2026-11-05 21:43 起（香港時間）。數值是當下讀到的，不是發布後的承諾。

## Vercel

- 專案：`dse-level-up-by-claude-code`（`prj_CQRC5oit3FL5KrrmCaAXxqUugfYu`）
- `SUPABASE_URL` 是 `https://aegekxapxgcfdrkzisis.supabase.co`。這是 HTTPS 的 API 網址，沒有 Postgres 埠。
- `POSTGRES_HOST` 是 `db.aegekxapxgcfdrkzisis.supabase.co`，屬於直連主機那一類。
- `POSTGRES_URL`、`POSTGRES_PRISMA_URL`、`POSTGRES_URL_NON_POOLING` 被標成 sensitive，這次沒有解出內容，所以不能宣稱它們的埠是 6543 或 5432。
- 網站執行路徑讀 `NEXT_PUBLIC_SUPABASE_URL` 同 service role，經 supabase-js 的 HTTPS。程式沒有讀 `POSTGRES_URL`。
- `scripts/db-slow-queries.mjs` 現在會拒絕不是 `*.pooler.supabase.com:6543` 的 `DATABASE_URL`。規則同一份在 `lib/db/pooler.ts`。沒有改動 Vercel 上的生產環境變數。

## Supabase

- 專案 `DSE-LEVEL-UP`（`aegekxapxgcfdrkzisis`）狀態 `ACTIVE_HEALTHY`，區域 `ap-northeast-1`。
- `list_tables` 與 `execute_sql` 都可以用。
- 當下 `pg_stat_activity` 連線 15，`max_connections` 60，約 25%。
- `public` 的 RLS：`qual` 含 `(SELECT auth.uid())` 的有 8 條；裸 `auth.uid()` 而沒有包在 `SELECT` 裡的有 0 條。其餘政策是公開讀取或 service 用的 `true`。
- 沒有把 `0035` 草稿套用到這個生產庫。

## Sentry

- 組織 `dselevelup`，區域 `https://de.sentry.io`。
- 已有專案 `javascript-nextjs`。沒有另建專案，避免同一條 API 的錯誤拆去兩個地方。
- 過去 24 小時未解決問題有一條：`JAVASCRIPT-NEXTJS-6`，`/transparency` 上的 `M_ID`。堆疊在 `executors/200.js`，受影響用戶數是 0。見 `docs/post-release-verification.md`。

## Playwright

- MCP namespace 可用，工具是瀏覽器操作（導覽、點擊、截圖）。
- 沒有 `playwright_generate_test` 或 `playwright_run_test` 這兩個名字。情境測試寫在 `lib/__tests__/socratic-tutor.test.mts`，頁面走查用瀏覽器 MCP。

## Mobbin

- `search_screens` 回覆需要付費方案，沒有截圖可存。`docs/research/ui-references/README.md` 記錄了這件事。沒有從其他網站抓取 App 截圖來代替。

## Canva

- Open Graph 設計已完成：`DAHaDfSasiU`，檔案在 `docs/research/canva/og-dse-level-up.png`。連結：https://canva.link/zuz7o8ssp6va80a
- README banner 設計已完成：`DAHaDXnEmag`。連結：https://canva.link/brf4fr533ughpo0
- 第二次匯出 banner PNG 被 Canva 拒絕（不允許存取該設計）。沒有把未下載的檔當成已經進 repo。

## Higgsfield 與 Runway

- 沒有呼叫。憲章第 5 條禁止新增付費第三方 API，短片生成會用額度。三次提示之後播放的是 `public/explainers/` 的原創 SVG，不直接給出原題答案。
