# 設計：以 Supabase Auth Google 重建登入（階段 4）

- **狀態：** 階段 5 實作中 · **未批准發布**（唔 apply production／唔改 Google Console 直至「批准發布」）
- **基準分支：** `main` @ 設計開始時
- **決策鎖定（創辦人 2026-10-30）：**
  - C1：**登入後先有雲端進度**；未登入可練，**唔寫長期本機、唔上雲**
  - C2：舊 Google `sub` → 新 `auth.users.id` 用 **mapping 表**遷移
  - C3：舊 `profiles` **改名**為 legacy，再建新 `profiles`
  - 拆除意向：**刪** Auth.js、Better Auth、DataPortability、InAppBrowserNotice、舊 auth 專用 docs

---

## 1. 目標架構（一句）

**唯一登入方式：** Supabase Auth · Google OAuth。  
**唯一長期學習資料庫：** Supabase Postgres（RLS + `auth.uid()`）。  
**Session：** Supabase Auth 管理（SSR cookie／官方 client），唔再自研 JWT（Auth.js）或 Better Auth。

```
[學生瀏覽器]
    │  signInWithOAuth({ provider: 'google' })
    ▼
[Google OAuth] ──redirect──► [Supabase Auth callback]
    │                              │
    │                              ▼
    │                     auth.users (+ session cookies)
    │                              │
    ▼                              ▼
練習 UI（未登入：記憶體內／頁面 state）     profiles / learning_* （RLS）
登入後：讀寫自己的列 only
```

---

## 2. Auth flow

### 2.1 登入

1. 用戶撳「使用 Google 登入」。
2. 前端（browser client，**anon key only**）呼叫：
   `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: origin + '/auth/callback' } })`
3. Google 同意後，瀏覽器回到 **Supabase 官方 callback**  
   `https://<PROJECT_REF>.supabase.co/auth/v1/callback`  
   再導向應用 `redirectTo`（我哋嘅 `/auth/callback`）。
4. App route `app/auth/callback/route.ts`（或等價）用 code exchange 建立 session（`@supabase/ssr`）。
5. 成功後：
   - upsert `profiles`（id = `auth.uid()`）
   - upsert 空嘅 `learning_profiles`（若不存在）
   - 若 `auth_identity_map` 搵到舊 Google `sub` → 觸發一次性進度遷移 job／API（見 §5）
6. 導向 `/dashboard` 或原 `next` 路徑（**只允許同源相對 path**，防 open redirect）。

### 2.2 Session 恢復

- Root `Providers` 使用 Supabase session listener / server `getUser()`。
- 跨裝置：同一 Google 帳戶 → 同一 `auth.users.id` → 同一 RLS 範圍資料。

### 2.3 登出

- `supabase.auth.signOut()`；清掉受保護 UI 狀態。
- **唔**再保留本機長期 `dse_progress`（見 §6）。

### 2.4 登入取消／失敗

- 用戶取消 Google → 返回 `/sign-in?error=cancelled`（雙語、無內部 stack）。
- 網絡／provider 錯誤 → `/sign-in?error=oauth`；**唔** log access_token／email 原文到 client console。

### 2.5 Google Cloud / Supabase Dashboard（人工設定 · 發布前）

| 位置 | 值（設計） |
|---|---|
| Google OAuth Web client — JS origins | `http://localhost:3001`、`https://www.dselevelup.com` |
| Google — Authorized redirect URIs | **只** `https://<PROJECT_REF>.supabase.co/auth/v1/callback`（及本地 Supabase 若有） |
| Supabase Auth → Google | Client ID／Secret（**新 client 建議與舊 Auth.js 分開，方便 rollback**） |
| Supabase Auth → URL config | Site URL `https://www.dselevelup.com`；Redirect allowlist 含 `http://localhost:3001/auth/callback`、`https://www.dselevelup.com/auth/callback` |

**退役：** `https://www.dselevelup.com/api/auth/callback/google`（Auth.js）於切換後從 Google Console 移除。

---

## 3. 資料模型

### 3.1 改名舊表

```sql
-- 僅在確認無依賴後執行（DRAFT migration）
ALTER TABLE IF EXISTS public.profiles RENAME TO profiles_legacy;
-- 視需要：索引／policy 名稱一併調整或 drop 後重建
```

`profiles_legacy`：只讀遷移／稽核用；**唔**再畀 app 寫入。RLS：service_role 或 admin-only。

### 3.2 新表（全部 RLS deny-by-default）

#### `profiles`

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` PK · `references auth.users(id) on delete cascade` | = `auth.uid()` |
| `display_name` | `text` | 來自 Google name，可改 |
| `email` | `text` | 來自 auth；避免喺 client 多餘暴露 |
| `avatar_url` | `text` | 可空 |
| `created_at` / `updated_at` | `timestamptz` | |

#### `learning_profiles`

| 欄位 | 型別 | 說明 |
|---|---|---|
| `user_id` | `uuid` PK/FK → `profiles(id)` | |
| `target_subjects` | `text[]` 或 `jsonb` | 目標科目 |
| `weak_topics` | `jsonb` | 弱點主題（聚合，非診斷標籤） |
| `daily_goal_minutes` | `int` | 可空 |
| `preferences` | `jsonb` | 學習偏好（非 SEN 醫療標籤） |
| `updated_at` | `timestamptz` | |

#### `learning_progress`

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | |
| `subject_id` | `text` | |
| `topic_id` | `text` | 可空 |
| `status` | `text` | e.g. `not_started`/`in_progress`/`completed` |
| `correct_count` / `attempt_count` | `int` | |
| `last_practiced_at` | `timestamptz` | |
| Unique | `(user_id, subject_id, topic_id)` | |

#### `practice_attempts`

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `bigint` identity PK | |
| `user_id` | `uuid` FK | |
| `question_id` | `text` | |
| `subject_id` / `topic_id` | `text` | |
| `is_correct` | `boolean` | |
| `elapsed_ms` | `int` | |
| `difficulty` | `text` | 可空 |
| `mistake_cause` | `text` | 學生自選錯因；**唔**存自由長文答案全文（最小化） |
| `created_at` | `timestamptz` | |

> 註：唔存完整作答原文／解釋全文，符合最小化同未成年謹慎。

#### `auth_identity_map`（C2）

| 欄位 | 型別 | 說明 |
|---|---|---|
| `legacy_google_sub` | `text` PK | 舊 Auth.js `user_id` |
| `user_id` | `uuid` unique FK → `auth.users` | 新 id |
| `migrated_at` | `timestamptz` | |
| `source` | `text` | e.g. `user_progress` |

用途：登入後用 Google `sub`（從 `auth.identities`／provider token claims，**server-only** 讀取）對應舊 `user_progress.user_id`，複製／轉換入新表後標記完成。

#### 與舊 `user_progress` 關係

- 短期：**保留** `user_progress` 作只讀來源（遷移用）。
- 遷移完成後：app **停止寫入**；可於後續 PR 歸檔／rename `user_progress_legacy`（唔喺首遷强制 drop）。

---

## 4. RLS policy 草稿（原則）

每張新用戶表：

1. `ENABLE ROW LEVEL SECURITY`
2. `REVOKE ALL FROM anon, authenticated`（再按需 `GRANT` 最小權利）
3. Policy 只允許：

```sql
-- 例：profiles
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
```

`learning_*`／`practice_attempts`：一律 `user_id = auth.uid()`。  
**禁止** anon 讀寫任何個人學習表。  
`auth_identity_map`：仅 `service_role`（migration／server migrate API）；authenticated **無**直接讀（防枚舉舊 sub）。  
`profiles_legacy`／舊 `user_progress`：authenticated 無存取；service_role 遷移用。

Trigger（建議）：`auth.users` 插入後自動建 `profiles` + `learning_profiles`（或只喺 callback upsert，二選一；設計傾向 **callback upsert + 可選 trigger 兜底**）。

---

## 5. 遷移流程（C2）

1. 用戶用 Google 經 Supabase 首次登入 → 得 `auth.users.id`。
2. Server（service role **或** SECURITY DEFINER 函數，嚴格校验 `auth.uid()`）讀取該用戶 Google identity 嘅 `sub`。
3. `INSERT INTO auth_identity_map ... ON CONFLICT DO NOTHING`。
4. 若 `user_progress` 有該 `legacy_google_sub`：
   - 解析 `progress_data` blob → 寫入 `learning_progress`／`practice_attempts`（best-effort；無法解析則記 log，唔阻登入）。
5. 標記 `migrated_at`；之後登入 skip。

**Rollback：** 保留舊表不動；新表可空；切回 Auth.js 僅作緊急（見 §9）——完整 rollback 成本高，故 **切 production 前必須 staging 驗收**。

---

## 6. 未登入練習行為（C1 確認）

| 行為 | 規則 |
|---|---|
| 打開練習、作答、睇解釋 | **允許** |
| `localStorage` `dse_progress`／topic stats／active session 長期寫入 | **停止**（拆除 DataPortability；progress store 改 memory／sessionStorage 短命或純 React state） |
| 上雲 `/api/progress` | **未登入唔呼叫** |
| 重整／關分頁 | 未登入進度**消失**（產品文案必須講明） |
| 登入後 | 只讀寫 Supabase 自己的列；新練習寫 `practice_attempts` + 更新 `learning_progress` |

---

## 7. 前端／後端模組設計（實作階段建立）

| 路徑 | 職責 |
|---|---|
| `lib/auth/supabase-client.ts` | Browser client（anon） |
| `lib/auth/supabase-server.ts` | Server client（SSR cookie）+ 禁止 export service role 畀 UI |
| `lib/auth/google-auth.ts` | `signInWithGoogle`、`signOut`、redirect 白名單 |
| `components/auth/GoogleSignInButton.tsx` | 雙語掣 |
| `app/auth/callback/route.ts` | code exchange + profile upsert + migrate trigger |
| `utils/supabase/server.ts` | **保留** service_role 畀 admin／migration／cron；**唔**再做登入身份來源 |

Env（設計名單）：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（server only）
- （可選）`NEXT_PUBLIC_AUTH_ENABLED` 繼續做 UI 總閘

**移除：** `AUTH_GOOGLE_*`、`AUTH_SECRET`、`NEXT_PUBLIC_AUTH_BACKEND`、`BETTER_AUTH_*`、`GOOGLE_CLIENT_*`、`DATABASE_URL`（若只為 BA）。

---

## 8. 拆除清單（移除驗收用）

### 8.1 刪除／退役程式

- `auth.ts`
- `app/api/auth/[...nextauth]/`
- `lib/auth/better-auth.ts`、`lib/auth/client.ts`（BA）、現有雙橋 `session.tsx`（改寫為 Supabase 版可取代）
- `package.json`：`next-auth`、`better-auth`、`pg`（若只為 BA Pool）
- `components/DataPortability.tsx`（及帳戶頁引用）
- `components/InAppBrowserNotice.tsx`（及 sign-in 引用）— 按創辦人「刪」；若 Google 內置瀏覽器仍痛，實作階段可用**一句純文案**取代，唔保留舊元件檔
- BA 相關：`FLIP-TO-BETTER-AUTH.md`、`supabase/migrations/0027_*.DRAFT.sql`（歸檔或刪）
- 舊 docs：`docs/auth/G-AUTH-*`、`docs/AUTH_ARCHITECTURE.md`（若存在於其他 branch）——改以本文為準

### 8.2 重寫依賴點

- `components/AuthButton.tsx`、`SignInNote.tsx`、`Providers.tsx`、`SyncProvider.tsx`（改為 Supabase 資料同步或大幅簡化）
- `lib/auth/server.ts` → `getUserId()` = `auth.uid()` 等價
- `app/api/progress/*`：改為 RLS 用戶 JWT **或** 過渡期後废弃，改直接 table client
- Admin allowlist：改讀 Supabase user email + `ADMIN_EMAILS`

### 8.3 保留

- `proxy.ts` rate limit（改 matcher 對齊新 `/auth/*`）
- CSP 對 `accounts.google.com`／`*.supabase.co`
- 題庫 anon read、`questionCloud`
- Charter 其他條款；書寫題永不機器批改

---

## 9. 錯誤處理／安全

- Open redirect：`redirectTo` 只接受以 `/` 開頭且非 `//` 嘅 path  
- Client 禁止 log：access_token、refresh_token、完整 email、service key  
- Rate limit：保留對 OAuth 入口嘅嚴格桶（path 更新）  
- 遷移 API：必須驗證 session；不可接受任意 `legacy_google_sub` 參數冒認  

---

## 10. Rollback plan（設計層）

| 階段 | 做法 |
|---|---|
| Staging 失敗 | 唔 apply production migration；唔改 Google Console redirect |
| Production 已切、要退 | 高風險：需暫時恢復 Auth.js 部署 + 舊 redirect；新表保留；mapping 保留。**預設不鼓勵**；故隔離驗收必須過 |
| 資料 | 唔 drop `user_progress`／`profiles_legacy` 直至創辦人書面批准 |

---

## 11. 測試計劃（實作／隔離驗收階段執行）

見創辦人 brief；設計補充：

- RLS SQL：`anon`／`authenticated` uid_A／uid_B  
- 未登入：練習後重整 → 無 `dse_progress` key、無雲端列  
- 登入：profile 單列、重複登入唔複製  
- Mapping：fixture `user_progress` + 假 sub → 遷移後新表有資料  
- Build：無 `next-auth`／`AUTH_GOOGLE_SECRET` 喺 client bundle  

---

## 12. 實作階段建議順序（階段 5，等批准）

1. 落地 DRAFT → 正式 migration（改名 legacy + 新表 + RLS）  
2. 加 `@supabase/ssr` client／callback  
3. Google 掣 + 拆 Auth.js／BA  
4. 改練習進度寫入路徑（未登入 memory-only）  
5. SyncProvider 簡化／對接新表  
6. 遷移 API + 測試  
7. 移除驗收清單打勾 → 隔離驗收 → **停等「批准發布」**

---

## 13. 需要創辦人喺設計批准後、實作前提供／確認

- [ ] Supabase project ref  
- [ ] 是否用**新** Google OAuth client（建議：是）  
- [ ] Staging：本地 `supabase start` 定共用 project schema  
- [ ] 批准將 `0030_*.DRAFT.sql` 喺實作 PR 改為非 DRAFT 並可喺 staging apply  

---

## 14. 本設計產物檔案

| 檔案 | 說明 |
|---|---|
| `docs/auth/SUPABASE-GOOGLE-REBUILD-DESIGN.md` | 本文 |
| `supabase/migrations/0030_supabase_google_auth_rebuild.DRAFT.sql` | Schema + RLS 草稿（**勿 apply production**） |
