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
npm run dev      # http://localhost:3001 — keep this port (Google OAuth redirect)
npm test
npm run qa
npm run build  # uses webpack (see package.json)
```

Notes:

- Next.js 16 uses **`proxy.ts`** (not a new `middleware.ts`).
- Production auth is **Supabase Auth · Google OAuth only** (`@supabase/ssr`). Do not reintroduce Auth.js / Better Auth. Cloud schema changes for auth require founder 「批准發布」 before production apply.
- Supabase access is **server-only** (`service_role`). Browser clients must not hold that key.

## Pull request checklist

- Describe **student impact** in plain language (zh-HK welcome).
- Link tests, or say why none apply.
- Green CI helps; it does **not** mean production merge/deploy is approved.
- Auth / deletion / production DB changes: mark clearly and wait for founder OK.

## Community

- Behaviour: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security reports: [SECURITY.md](./SECURITY.md)
- Licence: [LICENSE](./LICENSE)
