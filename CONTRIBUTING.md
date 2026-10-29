# Contributing to DSE Level Up

Thank you for helping Hong Kong DSE students. This guide is for people who want to change **code, docs, or processes** in this repository. Students who only want to practise should use [https://www.dselevelup.com/](https://www.dselevelup.com/) — no GitHub account needed.

## Before you change anything

1. Read `docs/charter.md` — permanent free, no ads, no paywall, student trust first, original rewritten questions only.
2. Prefer **one focused change** per pull request. Use a **Draft PR** until a founder asks to merge or deploy.
3. Do **not** commit secrets, `.env*`, or production credentials.
4. Do **not** push unpublished question-bank material while copyright / PHASE2 gates apply (see `docs/qbank/`).
5. Changes to **auth, RLS, account deletion, or database wipes** need **explicit founder review**. Rebuilding login ≠ wiping student data.

## Local setup

```bash
npm ci
cp .env.example .env.local   # fill secrets locally; never commit
npm run dev      # http://localhost:3001 — keep this port (Google OAuth redirect)
npm test
npx tsc --noEmit
npm run qa
npm run build  # uses webpack (see package.json)
```

### Supabase migrations

1. Read the SQL under `supabase/migrations/` — files named `*.DRAFT.sql` are **not** for casual apply.
2. Apply non-DRAFT migrations in order on staging first.
3. Auth table cutover (`0027`) and user wipe (`0028`) need **written founder approval** and runbooks in `docs/auth/`.
4. Analytics / triage (`0029`) is safe to apply after review; it creates empty tables with RLS lockdown.

### Commit messages

- Prefer conventional prefixes: `fix:`, `feat:`, `docs:`, `security:`, `test:`.
- One logical change per commit when practical.

Notes:

- Next.js 16 uses **`proxy.ts`** (not a new `middleware.ts`).
- Production auth default is **Auth.js v5** (Google). `better-auth` stays off until founders flip env (`FLIP-TO-BETTER-AUTH.md`, `docs/AUTH_ARCHITECTURE.md`).
- Supabase access for user data is **server-only** (`service_role`). Browser clients must not hold that key.
- Decisions log: `docs/ENGINEERING_DECISIONS.md`.

## Pull request checklist

- Describe **student impact** in plain language (zh-HK welcome).
- Link tests, or say why none apply.
- Green CI helps; it does **not** mean production merge/deploy is approved.
- Auth / deletion / production DB changes: mark clearly and wait for founder OK.

## Community

- Behaviour: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security reports: [SECURITY.md](./SECURITY.md)
- Licence: [LICENSE](./LICENSE)
