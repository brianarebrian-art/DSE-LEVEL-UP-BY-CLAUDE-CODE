# E · 系統盤點（2026-10-29，香港時間）

狀態：**待批准**（盤點文件；唔改 production）  
來源：本機 `main` `77038bc` 靜態核對；production 表列數以既有審計為準，本輪未再探測。

## 1. 產品與託管

| 項 | 現況 |
|---|---|
| 產品名 | DSE LEVEL UP（憲章鎖定） |
| 正式網域 | `https://www.dselevelup.com`（舊 Vercel 域 308 轉入） |
| 前端 | Next.js `^16.4.2`（`next build --webpack`） |
| 託管 | Vercel project `dse-level-up-by-claude-code` |
| 資料庫 | Supabase Postgres `aegekxapxgcfdrkzisis`（Tokyo） |

## 2. Auth

| 項 | 現況 |
|---|---|
| 預設 | Auth.js v5（`next-auth@^5`）Google OAuth、JWT、唔要 DB |
| 可切 | Better Auth `^1.6.23`（env 閘；未 flip 前 production 等同 Auth.js） |
| 禁 | 新增 Supabase Auth（憲章） |
| 同步 key | Google `sub` via `getSyncUserId()` |
| Cutover | `FLIP-TO-BETTER-AUTH.md` |

## 3. 資料類別（用戶相關）

抹除登記（`lib/privacy/userData.ts`）：`user_progress`、`user_settings`、`profiles`、`user_sessions`、`privacy_consents`。  
Better Auth 表（flip 後）：`user`／`session`／`account`／`verification`。  
公開題庫鏡像：`questions`、`question_bank_versions`（anon SELECT）。  
其他：`question_reports`、`session_feedback`、`practice_counts`；`push_subscriptions`（migration 有、production 先前核對無表）。

## 4. Analytics／監測

| 工具 | 披露 | 備註 |
|---|---|---|
| Vercel Web Analytics | `/privacy` | 同源 script；production only |
| Vercel Speed Insights | `/privacy`（WP-CI-SPEEDINSIGHTS Draft） | `@vercel/speed-insights`；production only |
| Sentry | `/privacy` | 錯誤監察；Session Replay 關 |

## 5. CI／品質閘

GitHub Actions `CI`：`npm test`、`npm run qa`（term／banks／i18n／contrast／claims）、eslint、build、SEO smoke。  
Dependabot 開啟。

## 6. 安全聯絡

`public/.well-known/security.txt` → `mailto:dselevelup@gmail.com`（Expires 2027-10-02）。

## 7. 已知缺口（交 H／G／F）

- FIX-001／002 Draft PR 待 merge；0026 push token migration 未套用。  
- 無 root `SECURITY.md`／`CONTRIBUTING.md`／`CODE_OF_CONDUCT.md`（見同目錄 DRAFT）。  
- Better Auth production flip 未做。  
