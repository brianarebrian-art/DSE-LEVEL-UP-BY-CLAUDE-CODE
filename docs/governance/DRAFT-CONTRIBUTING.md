# Contributing（草稿存檔）

狀態：**已晉升** · 2026-10-29（創辦人要求完善 GitHub 治理）  
**正本：** [`/CONTRIBUTING.md`](../../CONTRIBUTING.md)

## Before you change code

1. Read `docs/charter.md` — permanent free, no ads, no paywall, brand lock, no gamification rebuild.
2. One focused change per PR; prefer Draft PR until a founder asks to merge.
3. Do not commit secrets, `.env*`, or production credentials.
4. Do not push unpublished question-bank copyright material until PHASE2 is cleared.
5. Auth / RLS / account deletion / wipe changes need explicit founder review.

## Local checks

```bash
npm ci
npm test
npm run qa
npm run build
```

## PR expectations

- Describe user impact in plain language (Traditional Chinese HK welcome).
- Link tests or explain why none apply.
- CI green helps but does **not** equal production approval.
