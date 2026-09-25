# 保安審計 —— 2026-09-25

> **範圍：** 網站程式碼、依賴套件、Supabase 權限。**方法：** read-only 為主；
> 兩項已修（見 §1），其餘列為待辦，按嚴重度排。
> 所有結果都係實跑或實讀，每項附可以重跑嘅指令或 `file:line`。
>
> **冇做嘅嘢：** 冇讀 Vercel 環境變數嘅值（入面有 secret）、冇向 live site 發過任何攻擊性請求、
> 冇改 production 設定。

---

## 1. 今日已修

| 嚴重度 | 問題 | Commit | 驗證 |
|---|---|---|---|
| **Critical** | Next.js 16.3.2 圖片優化 API 處理 AVIF 時，未經驗證可以遠端執行代碼（GHSA-2xp9-vwfh-vxw4）。同一個版本仲有 sharp（high）同 baseline-browser-mapping（moderate） | `4f694a1` | `npm audit --omit=dev` → 0 個漏洞；build 成功（112 頁）；987/987 |
| **High（將來）** | Better Auth 一開，任何人用創辦人個電郵註冊密碼帳戶，就即刻入到 `/admin` | `b9ad38d` | 7 條新測試；負向自測有效；994/994 |

**Critical 嗰項實際風險偏低：** `next.config.ts` 冇設 `images.remotePatterns`，圖片優化只處理本站自己嘅圖，
而 Vercel 用自己嘅服務做圖片優化。但修正只係一個 patch 版本，冇理由唔升。
lockfile 逐個路徑對過：新增 0、移除 0，全部係現有套件升版，符合憲章 §5。

**High 嗰項而家攻擊唔到：** Supabase `public` 入面冇 Better Auth 嘅 `user`／`session`／`account`／`verification` 表，
即係 production 從來冇開過 Better Auth。但憲章 §3 記住 Brian 2026-09-07 裁決要開電郵／密碼，
而 `FLIP-TO-BETTER-AUTH.md` 係現成 runbook，所以一切換就會中。

---

## 2. 待辦（按嚴重度）

| # | 嚴重度 | 問題 | 位置 | 邊個做 |
|---|---|---|---|---|
| 1 | **Medium（開 Better Auth 之前）** | 電郵可以被人霸佔：有人用你個電郵註冊密碼帳戶但唔驗證，你之後用 Google 登入會被擋。**唔會被盜號**，因為 Better Auth 1.6.23 預設 `requireLocalEmailVerified: true`（`node_modules/better-auth/dist/oauth2/link-account.mjs:22-23`），唔會連入未驗證嘅帳戶 | `lib/auth/better-auth.ts:34` | **創辦人決定**：開密碼註冊之前要有電郵驗證（即係要有發信服務，撞 §5 成本），或者先只開 Google |
| 2 | **Medium** | 同步 API 冇限大小。已登入用戶每次可以寫入最多約 4.5MB（Vercel 請求上限）落自己嗰行，Supabase 免費額度 500MB | `app/api/progress/route.ts`、`app/api/sync/settings/route.ts`、`app/api/sync/session/route.ts` | Claude；5 個檔，要 §4 greenlight |
| 3 | **Medium** | 流量限制只係每個 serverless instance 各自計（`proxy.ts` 自己都寫明「NOT a distributed limiter」），擋唔到分散式暴力破解 | `proxy.ts:11-13` | **創辦人**：喺 Vercel Firewall 加 rate-limit 規則（`/api/auth/*`、`/api/*`）。Claude 唔會登入 Vercel |
| 4 | Low | 6 處 JSON-LD 用 `JSON.stringify` 直接塞入 `<script>`，冇轉義 `<`。而家內容全部係自己嘅資料（唔係用戶輸入），攻擊唔到；但資料入面將來有 `</script>` 就會斷開 | `app/layout.tsx`、`app/subjects/[subject]/page.tsx`、`app/cantonese/**`、`components/Seo/ArticleJsonLd.tsx` | Claude；7 個檔，要 §4 greenlight |
| 5 | Low | CSP 容許 `'unsafe-inline'` script（`next.config.ts` 註釋寫明係取捨：冇 nonce）。削弱咗 XSS 嘅第二道防線 | `next.config.ts:20` | 記錄。改用 nonce 要犧牲靜態生成，唔建議而家做 |
| 6 | Low | Supabase：`public.handle_updated_at` 冇固定 `search_path`（advisor WARN）；`authenticated` 角色喺 `review_decisions`、`user_settings` 有多餘 SELECT 權（RLS 冇 policy 所以擋住，本站亦唔用 Supabase Auth）| Supabase | 要一個 migration，改 production 資料庫 → **創辦人批准** |
| 7 | Info | `/api/push/subscribe` 唔使登入就寫得（刻意設計：唔存 user id）。production 未有 `push_subscriptions` 表，未上線 | `app/api/push/subscribe/route.ts` | 上線前確認有流量限制 |
| 8 | Info | 兩張收款 QR（`a0f17c2` 剷咗）仲喺 git 歷史 | git | **創辦人決定**要唔要改寫歷史 |

---

## 3. 已經做得好嘅（唔使改）

- **保安 headers 齊全：** CSP、HSTS（兩年 ＋ preload）、`X-Frame-Options: DENY`、`frame-ancestors 'none'`、`nosniff`、Referrer-Policy、Permissions-Policy（`next.config.ts:12-34`）
- **冇 secret 入 repo：** `git ls-files` 只有 `.env.example`；掃 `sk_`／JWT／`GOCSPX-`／AWS key／私鑰，零命中
- **Supabase 8 張表全部開咗 RLS。** 用戶資料表（`user_progress`、`profiles`、`user_settings`、`user_sessions`、`privacy_consents`、`review_decisions`）**anon 零權限**；題庫兩張表 anon 只有 SELECT（憲章 §3.1）
- **所有 admin API 都經 `requireAdmin()`**，只有一個判斷點；cron 冇設 `CRON_SECRET` 就拒絕行
- **`/dev/*` 頁喺 production 回 404**（`app/dev/*/page.tsx` 用 `notFound()`）
- **刪帳號**要登入 ＋ body `{ confirm: true }`
- **Auth.js** 只有 Google、JWT、冇 `allowDangerousEmailAccountLinking`

---

## 4. 重跑

```bash
npm audit --omit=dev
npx tsx --test lib/__tests__/admin-verified-email.test.mts
git ls-files | grep -iE '(^|/)\.env'
grep -n "requireLocalEmailVerified" node_modules/better-auth/dist/oauth2/link-account.mjs
```

Supabase（read-only）：`get_advisors(type: security)`；
`select table_name, grantee, privilege_type from information_schema.role_table_grants where table_schema='public' and grantee in ('anon','authenticated')`
