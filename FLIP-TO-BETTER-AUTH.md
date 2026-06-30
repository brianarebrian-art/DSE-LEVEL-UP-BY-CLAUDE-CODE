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
- [ ] **Data compatibility:** sign in with a Google account that already had synced
      progress → the dashboard shows that progress (proves the Google-`sub` key carried
      over). See note below.

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
