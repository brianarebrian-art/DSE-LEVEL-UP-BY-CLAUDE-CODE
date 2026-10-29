# Auth architecture — DSE Level Up

**Status:** Production = Auth.js v5 (Google JWT). Better Auth = code-complete, dormant until founder flip (`FLIP-TO-BETTER-AUTH.md`).

## Goals

1. Cross-device progress sync for students who choose to sign in.
2. Site remains fully usable **without** an account.
3. Minors: collect the minimum (no school, class, ID card).
4. Two-person team: reversible cutover, no silent orphan keys.

## Backends

| Mode | Env | Methods |
|---|---|---|
| Auth.js (default) | `NEXT_PUBLIC_AUTH_BACKEND` unset / `next-auth` | Google OAuth |
| Better Auth | `NEXT_PUBLIC_AUTH_BACKEND=better-auth` + `DATABASE_URL` + `BETTER_AUTH_SECRET` | Google, email/password, magic link, password reset, optional Apple, email verification (flag) |

Unified UI surface: `lib/auth/session.tsx` (`useAuthSession`, `authSignIn*`). Sync key: `getSyncUserId()` in `lib/auth/server.ts` (Google `sub` / accountId; never guess on failure).

## Session model

- **Auth.js:** JWT cookie, ~device-local persistence (S1). Remote “logout all” cannot revoke other JWTs.
- **Better Auth:** DB sessions (`0027` DRAFT). `revokeSessions` + password-reset session revoke supported. Default expiry 30 days, sliding update 24h.

## Routes

- `/sign-in`, `/sign-up` — Google always; email forms when Better Auth live
- `/forgot-password`, `/magic-link` — Better Auth only (safe copy when dormant)
- `/api/auth/[...nextauth]` — dual handler
- `/api/auth/revoke-sessions` — logout-all
- Progress: `/api/progress` after privacy consent (`SyncProvider`)

## Security controls

- PKCE / OAuth via provider SDKs; Auth.js `trustHost` on Vercel
- Redirect targets limited to same-origin path in `authSignInGoogle`
- Rate limits: `proxy.ts` + Better Auth `rateLimit`
- Service role never in client; user tables RLS ON + revoke client grants
- Auth emails via `auth_email_outbox` + optional `AUTH_EMAIL_WEBHOOK_URL` (no mandatory paid ESP)
- Account enumeration: forgot/magic always show generic success

## Cutover (do not improvise)

1. Apply `0027_better_auth_tables.DRAFT.sql` on staging → prod after backup.
2. Set BA env vars; keep Google client IDs.
3. Flip `NEXT_PUBLIC_AUTH_BACKEND=better-auth`.
4. Smoke: Google sync key continuity, email signup, magic link, reset, revoke-all.
5. Rollback: unset backend flag (Auth.js). Do **not** run wipe (`0028`) as part of auth flip.
