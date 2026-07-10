# 安全審核記錄 — 2026-07-10（Eric / 資安）

## 現有防護（已上線並驗證）

| 層面 | 措施 | 位置 |
|------|------|------|
| HTTP 安全標頭 | CSP（default-src 'self'、object-src 'none'、frame-ancestors 'none'）、HSTS、X-Frame-Options DENY、X-Content-Type-Options、Referrer-Policy、Permissions-Policy | `next.config.ts` |
| API 速率限制 | 一般 API 60 次/分鐘/IP；auth 路由 30 次/10 分鐘/IP；429 統一 `{error, code}` JSON | `proxy.ts`（Next 16 proxy 約定；build 確認 `ƒ Proxy` 註冊） |
| 認證 | OAuth（Google）經 Auth.js v5；JWT session；雙 backend 架構（next-auth 預設 / better-auth env 切換） | `lib/auth/` |
| API 輸入驗證 | `/api/progress` 手動 typeof/結構驗證；錯誤格式統一（8 處核對） | `app/api/*/route.ts` |
| 鎖時防繞過 | 60 秒鎖設伺服器簽名 token（defence-in-depth，fail-open） | `lib/lockout/serverToken.ts` |
| 資料面 | Supabase service_role 只在伺服器端；客戶端零直連；無追蹤廣告腳本 | `lib/` |

## 誠實限制（已記錄，非隱藏）

1. **速率限制係 per-instance**：edge isolate 之間唔共享狀態，Vercel 上屬 best-effort。分散式限流需 KV/Redis（Stage 2，涉及成本決策）。
2. **CSP 保留 `unsafe-inline`**：Next bootstrap script、KaTeX inline style、framer-motion 需要；nonce 管線未建。
3. **Cookie `sameSite`**：維持 Auth.js 預設 `lax` — `strict` 會斷 Google OAuth 回調。呢個係框架安全預設，非疏漏。
4. **未引入 zod**：現有手動驗證覆蓋單一 API 面；引入依賴留待 API 面擴大時。

## 滲透測試界線（沿用 docs/PENTEST-SCOPING.md）

自家代碼可審計；對 Vercel/Supabase/Google 基建的主動掃描需該等供應商授權。
