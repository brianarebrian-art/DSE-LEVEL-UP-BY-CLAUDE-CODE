# Milestone A：Secret 盤點與 remediation（計劃，唔執行 rotation）

- **狀態：** 文件完成；**未**做 production key rotation  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **硬閘：** P0（production／staging project、部署來源、事故負責人）未書面確認前，**禁止**撤銷或輪轉 production keys  

對齊：`phase-4b-data-security-design.md` §4；SEC-P1-003。

---

## 1. Inventory（名，唔寫值）

| Secret | 預期位置 | `NEXT_PUBLIC_*`？ | 備註 |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel／CI／本機 `.env.local`；只經 `utils/supabase/server.ts` | **否** | 繞過 RLS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 瀏覽器 | 是 | 刻意公開；靠 RLS／server 再驗證 |
| `NEXT_PUBLIC_SUPABASE_URL` | 瀏覽器 | 是 | |
| `CRON_SECRET` | cron route | 否 | |
| `SENTRY_AUTH_TOKEN` | CI source map upload | 否 | |
| `NEXT_PUBLIC_SENTRY_DSN` | 瀏覽器 | 是 | |
| VAPID private | push server | 否 | private 永唔入 client |
| VAPID public | client | 可公開 | |
| `ADMIN_EMAILS`／`REVIEWER_EMAILS`／`FOUNDER_GOOGLE_SUB` | server env | 否 | 角色 allowlist |

---

## 2. 已落地防線（本 Milestone）

1. `utils/supabase/server.ts`：`import 'server-only'`——誤 import 入 client bundle 會喺 build 失敗。  
2. `npm run secret:scan`（`scripts/secret-scan.mjs`）：掃 `app`／`components`／`lib`／`data`／`utils`，禁止非 server-only 模組出現 `SUPABASE_SERVICE_ROLE_KEY`、PEM private key、`sk_live_`／`sk_test_` 形態字串。  
3. CI：`Secret scan` step 擋 PR；另跑 `npm audit --omit=dev`。  
4. Progress／auth 註釋已去掉過時 Auth.js／Better Auth 誤導，減低後續誤加第二套 secret。

---

## 3. Forbidden patterns（持續）

- 任何 `NEXT_PUBLIC_*SERVICE*`／把 service role 寫入 client 環境變數名。  
- 將 service key、完整 session token、password 寫入 log／toast／Sentry breadcrumb。  
- Commit `.env`／`.env.local`（只准 `.env.example` 占位）。  
- Preview／個人 Vercel 專案共用 **production** service role（文件風險；改 per-env）。

---

## 4. Rotation plan（觸發後先做；而家唔跑）

懷疑外洩或人員離職時：

1. **分類 SEV1**（見 backup／incident runbook）。  
2. Supabase Dashboard：**立即** rotate `service_role`（必要時連 anon）；更新 Vercel Production／Preview／CI secrets。  
3. 輪轉 `CRON_SECRET`、VAPID private、`SENTRY_AUTH_TOKEN`（若相關）。  
4. 撤銷舊 key 後，抽樣打 `/api/health`、登入、progress GET／POST。  
5. 搜尋 git 歷史同聊天紀錄是否曾貼過 key；若有，當已外洩處理。  
6. 72h 內 post-mortem：外洩途徑、為何 scan 未攔、行動項。

**未批准前唔做：** 預防性 production rotation、改 production RLS、刪舊 key 而未備妥新 env。

---

## 5. Preview／環境分隔（待 P0）

| 環境 | 期望 |
|---|---|
| Production | 獨立 Supabase project＋獨立 service role |
| Staging／Preview | 另一 project 或嚴格隔離 schema；**唔**共用 prod service role |
| 本機 | `.env.local`；唔提交 |

P0 未答：邊個 project 係 prod／staging——本計劃唔能指派實際 dashboard 連結。

---

## 6. Rollback

- 還原 `server-only`／secret-scan／CI step 唔影響已輪轉嘅 key。  
- 若誤 rotate：用 Supabase／Vercel 還原上一組 secret（若平台仍保留）或重新簽發並 redeploy。

---

## 7. 驗收

- [x] `server-only` 於 service helper  
- [x] `secret:scan` 本地＋CI  
- [x] `npm audit --omit=dev` 入 CI  
- [ ] Production key rotation（**未做**，等 P0＋明確指示）  
- [ ] Preview 與 prod service role 分隔對帳（等 P0）
