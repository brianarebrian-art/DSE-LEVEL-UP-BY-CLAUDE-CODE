# G · 登入實作（A3 + B1）— 2026-10-29

狀態：**創辦人指示開實作 PR** · 香港時間 2026-10-29  
選定：**G-A3**（Better Auth · Google + email/password）＋ **G-B1**（保留並沿用 Google `sub` sync key）  
明確否決本輪：**G-B3 全庫 wipe**（重建登入 ≠ 清空學生資料）

## 已存在（唔使重寫）

- 雙 backend 閘：`NEXT_PUBLIC_AUTH_BACKEND` + `DATABASE_URL` + `BETTER_AUTH_SECRET`
- `/sign-in`、`/sign-up`、Google／電郵密碼 UI（email 表單只喺 Better Auth 開）
- `getSyncUserId()` B1 相容（Google → `accountId`＝舊 `sub`；失敗回 `null` 唔換 key）
- 私隱文案按 `betterAuthEnabled` 分支；刪帳覆蓋 `BETTER_AUTH_TABLES`
- 回歸：`lib/__tests__/email-auth-readiness.test.mts`

## 本 PR 新增

1. `supabase/migrations/0027_better_auth_tables.DRAFT.sql` — BA 四表 + revoke anon/authenticated（**未套用 production**）
2. 登入方便度：導向 `/sign-in`（多種方式）、登入後 `?sync=ok` 提示、已登入訪 `/sign-in` 仍 redirect dashboard（session 自動延續）
3. 決策紙更新為 A3+B1 鎖定；cutover 仍要創辦人 **R3** 設 Vercel env 同套用 DRAFT SQL

## Production cutover（創辦人手動 · R3）

跟 `FLIP-TO-BETTER-AUTH.md`：

1. 設 `DATABASE_URL`、`BETTER_AUTH_SECRET`、`BETTER_AUTH_URL`、`NEXT_PUBLIC_AUTH_BACKEND=better-auth`、`NEXT_PUBLIC_BETTER_AUTH_URL`
2. 喺 Supabase 審完並執行 `0027_*.DRAFT.sql`（或 CLI migrate）— **確認無 TRUNCATE user_progress**
3. 確認 Google redirect URI
4. 驗證：Google 舊帳見返進度；電郵註冊；刪帳清 BA 表；`/privacy` 顯示存電郵文案
5. 出事：Unset `NEXT_PUBLIC_AUTH_BACKEND` 回滾 Auth.js（BA 表可留）

## 對外一句（B1）

「登入升級中；用 Google 登入嘅同學，練習進度會保留。」
