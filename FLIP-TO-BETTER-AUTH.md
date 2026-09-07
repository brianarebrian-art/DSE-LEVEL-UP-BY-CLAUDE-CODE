# Cutover runbook — flip auth from Auth.js → Better Auth

The Better Auth migration is **code-complete and build-green**, but it ships **dormant**:
the app keeps using the existing Auth.js (Google) login until you flip a single env var.
This means **zero downtime** and a clean, reversible cutover. Nothing unverified goes
live on its own — you flip it when your database is ready.

## How the staged design works

A single build-time/runtime gate selects the backend:

| Gate | Where | Effect |
|---|---|---|
| `NEXT_PUBLIC_AUTH_BACKEND` | client (`lib/auth/client.ts`) | `=better-auth` → UI uses the Better Auth client; otherwise Auth.js |
| `DATABASE_URL` + `BETTER_AUTH_SECRET` | server (`lib/auth/better-auth.ts`) | both present → server serves Better Auth; otherwise Auth.js |

Until you set these, **everything behaves exactly as today**. The whole app talks to one
seam — `useAuthSession()` / `auth*` helpers on the client, `getSyncUserId()` on the
server — so flipping the backend needs **no component changes**, only env.

### Files added/changed
- `lib/auth/better-auth.ts` — server instance (gated; all secrets from env, never a file)
- `lib/auth/client.ts` — `AUTH_BACKEND` constant + Better Auth HTTP client
- `lib/auth/session.tsx` — `AuthProvider`, `useAuthSession()`, `authSignIn*/authSignOut`
- `lib/auth/server.ts` — `getSyncUserId()` (backend-agnostic; preserves the Google `sub` key)
- `app/api/auth/[...nextauth]/route.ts` — delegates to the active backend
- `app/api/progress/route.ts` — uses `getSyncUserId()`
- `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx` — email/password + Google
- `components/{Providers,AuthButton,SyncProvider,SyncStatus}.tsx`, `lib/usePlan.ts` — use the seam

---

## 2026-09-07 更新 —— 開工前已經處理咗嘅三個坑

Brian 2026-09-07 裁決要開 email/password。以下三樣一 flip 就會即刻壞，
而且【三樣都唔會拋錯、唔會紅 build】，所以已經預先改好：

| # | 一 flip 就壞嘅嘢 | 已做 |
|---|---|---|
| 1 | 私隱頁寫住「我哋唔會將你嘅電郵地址存入資料庫」—— Better Auth 個 `user` 表存電郵，嗰句即刻變假 | 改為由 `betterAuthEnabled` 衍生，兩個狀態各有一段真文案 |
| 2 | 刪帳號只清 `user_id` 一套 key；Better Auth 用 `id`／`userId`／`identifier`，塞入原本個迴圈仲會撞 42703 令成個抹除 500 | 新增 `BETTER_AUTH_TABLES` 獨立處理（`verification` 由 email 做 key）|
| 3 | `getSyncUserId()` 解析失敗會回落 Better Auth user id —— **169 個帳號**（2026-09-07 實測）嘅雲端進度全部 keyed on Google `sub`，換咗 key 就永久失聯，而且冇聲 | 改為回 `null`（＝今次唔同步，本機資料無損），並且 log |

迴歸鎖：`lib/__tests__/email-auth-readiness.test.mts`。憲章 §3 同日更正。

⚠️ 下面步驟 1–3 涉及 connection string 同 secret，**要你自己做** ——
Claude Code 唔會將 credential 寫入任何檔案。

---

## Cutover steps (do these when you're ready to switch)

### 1. Get a Postgres connection string
You already run Supabase Postgres. In the Supabase dashboard:
**Project Settings → Database → Connection string → URI** (use the direct/session
connection, not the transaction pooler, so migrations can run DDL).

### 2. Set environment variables
Put these in `.env.local` (dev) and in your host's env (e.g. Vercel) for prod. **Do not
commit secrets.**

```
# Postgres for Better Auth's own tables (user/session/account/verification)
DATABASE_URL=postgres://...            # from step 1

# Better Auth core
BETTER_AUTH_SECRET=<random 32+ chars>  # generate: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3001  # dev; in prod use your real https origin

# Public flags so the CLIENT uses Better Auth too
NEXT_PUBLIC_AUTH_BACKEND=better-auth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001   # match BETTER_AUTH_URL

# Google OAuth — reuses your existing app. The code already falls back to AUTH_GOOGLE_*,
# so if those are set you can skip these two.
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

### 3. Create the Better Auth tables
With the env from step 2 loaded:

```
npx @better-auth/cli@latest migrate --config lib/auth/better-auth.ts
```

Prefer to review the SQL first / run it in the Supabase SQL editor? Generate it instead:

```
npx @better-auth/cli@latest generate --config lib/auth/better-auth.ts
```

This creates the `user`, `session`, `account` and `verification` tables. **It does NOT
touch your existing `user_progress` table.**

### 4. Update the Google OAuth redirect URI
Both Auth.js and Better Auth use `/api/auth/callback/google`, so the path is unchanged.
Just confirm your Google Cloud console has the authorized redirect URI for each origin:
- `http://localhost:3001/api/auth/callback/google` (dev)
- `https://YOUR_DOMAIN/api/auth/callback/google` (prod)

### 5. Build, run, verify
```
npm run build -- --webpack && npm run dev
```
Then check:
- [ ] Google sign-in works (`/sign-in` or the navbar button)
- [ ] Email/password sign-up + sign-in work (`/sign-up`, `/sign-in`)
- [ ] **Data compatibility（最重要嗰項）：** 用一個【本來已經有雲端進度】嘅 Google
      帳號登入 → dashboard 見返嗰批進度，即係 Google `sub` key 接得返。
      見下面 note。
- [ ] **反面驗證：** 睇 server log 有冇 `refusing to guess a key`。有嘅話代表
      `listUserAccounts` 個 shape 變咗，同步已經停 —— 呢個係設計上嘅安全失敗，
      唔係壞咗，但要跟進，否則所有 Google 用戶都唔會再同步。
- [ ] **刪帳號：** 開一個 email/password 測試帳號 → `/account` 刪除 →
      查 Supabase `user`／`session`／`account`／`verification` 四張表冇殘留。
- [ ] **私隱頁：** `/privacy` 應該顯示「如果你用電郵同密碼註冊，我哋會存低
      嗰個電郵地址…」。仲顯示緊舊嗰句「唔會將你嘅電郵地址存入資料庫」＝
      `betterAuthEnabled` 冇生效，即係 flip 未成功。

---

## Data-compatibility note (IMPORTANT — verify in step 5)

Existing cloud progress in `user_progress` is keyed by the Google `sub`. After the
cutover, `lib/auth/server.ts` resolves the signed-in user's Google account and keys
`/api/progress` on its `accountId` (= the same `sub`), so existing rows stay attached.

The lookup uses `auth.api.listUserAccounts()`. If a future Better Auth version changes
that method's return shape, the code falls back to the Better Auth user id (a new key) —
which would orphan old progress. So **verify the bullet above** during cutover. If it
fails, check the `account` table: the Google row's `accountId` must equal the old `sub`.

## Rollback
Unset `NEXT_PUBLIC_AUTH_BACKEND`, `DATABASE_URL` and `BETTER_AUTH_SECRET` (or just the
public flag) and redeploy — the app returns to Auth.js. The Better Auth tables can stay;
they're harmless when unused.

## After a successful, stable cutover (optional cleanup)
Once you're confident on Better Auth, you can drop the legacy Auth.js path to satisfy the
"minimalism" rule: remove `next-auth` from `package.json`, delete `auth.ts`, and simplify
`lib/auth/session.tsx` + the `/api/auth` route to the Better Auth branch only.
