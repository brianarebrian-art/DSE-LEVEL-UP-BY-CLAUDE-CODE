# DSE Level Up — Founder OS

創辦人指揮中心（`/founder`）。

**本規格優先於任何「Google 登入成功即可進入」嘅舊設定。**

必須同時通過：

1. 伺服器驗證嘅 Google 身份（唯一電郵 `brianarebrian@gmail.com`、`email_verified = true`、`sub` = `FOUNDER_GOOGLE_SUB`）
2. Google Authenticator 相容 TOTP（Supabase Auth MFA → AAL2）

TOTP **唔可以**取代身份檢查。其他帳戶即使持有正確 TOTP 亦不得進入。

TOTP **唔係**防釣魚驗證。

## 狀態機

| 狀態 | 可做 | 不可做 |
|------|------|--------|
| 未登入 | Google 登入頁 | 後台 |
| Google 已通過、未完成 TOTP | `/founder/mfa/*` 驗證／綁定／復原／登出 | 讀後台資料、API、Server Actions |
| Google + TOTP（AAL2）未超時 | Founder OS 全功能 | — |

後台資料唔會喺 MFA 完成前傳送到瀏覽器再由前端遮住。

## 環境變數（server-only；唔展示秘密值）

| 名稱 | 說明 |
|------|------|
| `FOUNDER_GOOGLE_SUB` | 創辦人 Google `sub`。未設 → 拒絕。**禁止** `NEXT_PUBLIC_*`。 |
| `FOUNDER_MFA_MAX_AGE_SEC` | MFA 最長有效（預設 43200 = 12h） |
| `FOUNDER_MFA_IDLE_SEC` | MFA 閒置上限（預設 7200 = 2h） |
| `FOUNDER_MFA_RECENT_AUTH_SEC` | 首次綁定要求嘅近期 Google 登入窗口（預設 900） |
| `FOUNDER_MFA_STEP_UP_SEC` | 敏感操作近期 MFA 窗口（預設 300） |
| `FOUNDER_AI_API_KEY` / `FOUNDER_AI_BASE_URL` | 可選 AI |
| `FOUNDER_DEMO_FIXTURES` | 只准本機／測試 |

現有 `ADMIN_EMAILS` 只控制 `/admin`，**唔**等於 Founder OS 權限。

TOTP secret 由 **Supabase Auth MFA** 管理；本應用**唔**另存 secret。唔需要應用層 TOTP 加密金鑰。

## Migration

- `supabase/migrations/0029_founder_os.sql` — 審計、營運、AI jobs 等
- `supabase/migrations/0032_founder_mfa.sql` — enrollment token 雜湊、因素版本、復原碼雜湊、復原 session、共享限流 RPC

套用前請審閱；**唔會**清空學生／題庫資料。正式雲端 apply 需另一次批准。

## 安全初始化（首次掃碼）

1. 套用 `0032_founder_mfa.sql`。
2. 確認 Supabase Auth 已啟用 MFA（TOTP）。
3. 設定 `FOUNDER_GOOGLE_SUB` 後部署。
4. 部署環境執行（輸出只顯示一次；唔寫入 Git／公開 env／URL／一般日誌）：

   ```bash
   npx tsx scripts/founder-mfa-enroll-token.mts --ttl-minutes 30 --label ops
   ```

5. 用 `brianarebrian@gmail.com` Google 登入 → `/founder/mfa/enroll`。
6. 貼上 enrollment token → 本地顯示 QR（IdP SVG，唔經第三方 QR API）或手動密鑰。
7. Google Authenticator 掃碼（Issuer：`DSE Level Up`；6 位／30s／SHA1 相容設定）。
8. 輸入驗證碼啟用；**原子**消耗 token 並寫入因素版本。
9. **一次性**顯示復原碼 → 離線保存。

Pending enrollment（未驗證成功嘅 secret）**唔等於** MFA 已啟用。

## 登入日常

1. `/founder` → Google 登入（若未登入）
2. `/founder/mfa/verify` 輸入 TOTP
3. Session 升為 AAL2；`requireFounder()` / `requireFounderApi()` 每次檢查身份 + AAL2 + 閒置／最長期限 + 因素版本

## 復原碼

- 啟用後產生；只顯示一次；伺服器只存雜湊；單次原子消耗
- 使用後：受限 recovery session → 必須重新綁定；唔會永久放行
- 重新產生：需 full session + 近期 MFA／新 TOTP + 明確確認；舊碼全部失效

## 遺失手機且冇復原碼（受控離線復原）

1. 部署擁有人執行：

   ```bash
   npx tsx scripts/founder-mfa-emergency-revoke.mts --reason "lost-phone-no-codes"
   ```

2. 如 IdP 仍有舊 factor，喺 Supabase Dashboard／Admin API unenroll。
3. 發出新 enrollment token（同上腳本）。
4. 創辦人 Google 重新登入 → 綁定新 Authenticator。
5. 審計：`founder_mfa_factor_state.revoked_at` / `revoke_reason`；舊 session 因版本／AAL 失效。

**不提供**僅靠電郵停用 MFA、公開 reset endpoint、萬用驗證碼或隱藏後門。

## Session 撤銷

- UI 登出：`/api/founder/mfa/sign-out` 或頂部登出（`supabase.auth.signOut()`）
- MFA 重設／復原／緊急撤銷 → 舊因素版本失效；舊 AAL2 不再視為 full
- Google 帳戶撤銷本應用授權

## 授權接線

- `lib/founder/mfa/gate.ts` — 狀態機
- `lib/auth/founderAllowlist.ts` — `requireFounder`（頁面 redirect）、`requireFounderApi`（API 回 null／403）
- 所有 `/api/founder/*`（非 MFA 流程本身）必須 `requireFounderApi`
- MFA 頁面唔載入 `loadPlatformOverview` 等後台資料

## 限流

Postgres `founder_mfa_rate_hit`（跨 instance）。表／函式未 migrate 時 **deny-by-default**。

## 日誌

唔記：TOTP secret、otpauth URI、驗證碼、QR、復原碼原文、enrollment token 原文。見 `writeFounderAudit` scrub。

## 測試

見 `lib/__tests__/founder-auth.test.mts`、`lib/__tests__/founder-mfa.test.mts`。正式環境 E2E 需真實 Google + Authenticator；本 repo 唔會聲稱零風險。
