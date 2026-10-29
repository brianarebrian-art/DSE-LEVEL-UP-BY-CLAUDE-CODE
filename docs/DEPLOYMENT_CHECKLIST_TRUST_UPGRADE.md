# Deployment checklist — platform trust upgrade

## Before merge

- [ ] Read `docs/ENGINEERING_DECISIONS.md` assumptions
- [ ] CI green: test, qa, eslint, **tsc**, build
- [ ] Confirm this PR does **not** set `NEXT_PUBLIC_AUTH_BACKEND=better-auth` in Vercel by accident
- [ ] Confirm this PR does **not** apply `0028` wipe

## Supabase

- [ ] Review `0029_analytics_events_and_qbank_ops.sql` on staging
- [ ] Apply 0029 to production (service role / SQL editor)
- [ ] Spot-check: `select count(*) from analytics_events;`
- [ ] Spot-check: `question_reports` has `priority_score`
- [ ] Confirm anon cannot `select` new tables (RLS + revoke)

## Vercel env (names only)

- [ ] Existing Auth.js vars unchanged for production
- [ ] Optional: `NEXT_PUBLIC_ANALYTICS_EVENTS` (default on)
- [ ] Optional later: Better Auth vars per `FLIP-TO-BETTER-AUTH.md`
- [ ] Optional: `AUTH_EMAIL_WEBHOOK_URL`, `AUTH_REQUIRE_EMAIL_VERIFICATION`
- [ ] Optional Apple: `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET`

## Smoke (production)

- [ ] Anonymous practice still works
- [ ] Google sign-in + sync consent + progress push
- [ ] `/account` export/import with a small progress file
- [ ] Report a question (category only)
- [ ] Admin `/admin/reports` (ADMIN_EMAILS) loads
- [ ] `POST /api/analytics/event` with whitelist event returns ok after 0029

## Rollback

- Revert the Vercel deployment
- New tables can remain empty (harmless) or drop via controlled SQL if required
- Auth stays on Auth.js if backend flag untouched
