# DSE Level Up — Founder OS

創辦人指揮中心（`/founder`）。只允許程式寫死嘅 Google 帳戶電郵（見 `FOUNDER_EMAILS`），且 Google `sub` 必須屬於伺服器環境變數 `FOUNDER_GOOGLE_SUB` 允許清單。

目前允許電郵：

- `brianarebrian@gmail.com`
- `yunawong0128@gmail.com`

## 環境變數（server-only）

| 名稱 | 說明 |
|------|------|
| `FOUNDER_GOOGLE_SUB` | 創辦人 Google `sub` 清單（單一值，或逗號／空白分隔多個）。未設 → 拒絕進入。**禁止** `NEXT_PUBLIC_*`。 |
| `FOUNDER_AI_API_KEY` | 可選。Founder AI 指令列。永不回傳前端。 |
| `FOUNDER_AI_BASE_URL` | 可選。AI API base URL。 |
| `FOUNDER_DEMO_FIXTURES` | 只准本機／測試；正式環境忽略。 |

現有 `ADMIN_EMAILS` 只控制 `/admin`，**唔**等於 Founder OS 權限。允許電郵**唔**經環境變數擴展。

## 綁定 Google sub

1. 用允許電郵經本站 Google（Supabase Auth）登入一次。
2. 從 Supabase Auth user 的 Google identity `identity_data.sub` 讀取（**唔係** `auth.users.id` UUID）。
3. 將該 `sub` 加入 Vercel／主機環境變數 `FOUNDER_GOOGLE_SUB`（可同現有值用逗號並列；Production + Preview 視需要）。
4. 重新部署後再登入。
5. 建議喺每位允許電郵嘅 Google 帳戶開啟 2FA／Passkey（帳戶擁有人設定；程式唔會代為強制）。

## 授權

- `requireFounder()` / `getVerifiedFounderSession()`（`lib/auth/founderAllowlist.ts`）
- 建基於現有 `getAuthUser()`（Supabase Auth）
- 覆蓋所有 `/founder` 頁、`/api/founder/*`、相關 Server Actions
- Deny-by-default；Layout 只係第一層

## Migration

`supabase/migrations/0029_founder_os.sql` — 審計、營運任務、AI jobs、事故、發佈批次、覆核個案、預算、整合狀態、功能開關、指令確認。套用前請審閱；唔會清空學生／題庫資料。

## Session 撤銷

頂部「登出」（`supabase.auth.signOut()`），或到 Google 帳戶撤銷本應用授權。
