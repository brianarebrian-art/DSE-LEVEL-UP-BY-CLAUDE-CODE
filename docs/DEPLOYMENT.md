# Deployment and Release Checklist

**This is an operational checklist, not authorization to publish.** Production deployment requires the project owner’s normal approval.

## Before release

- [ ] Confirm the intended branch, reviewed diff and ticket/decision; never push directly to `main` unless the owner explicitly requests it.
- [ ] Confirm framework/env requirements in `package.json`, `.env.example`, Vercel project settings and current deployment configuration. Never copy real secrets into docs, source, logs, or chat.
- [ ] Verify no database/schema/migration change is being bundled without its explicit review and environment plan.
- [ ] Run the current required `npm test`, `npm run typecheck`, `npm run lint`, `npm run qa`, and `npm run secret:scan`; run `npm run build` for production-code or build-configuration changes.
- [ ] Check any question-bank diff for provenance/licensing, applicable HKEAA framework year, unique IDs/options, answer and explanation correctness, subject review sign-off, and updated generated summaries.
- [ ] Check Traditional Chinese, student-safety copy, accessibility, privacy/retention descriptions and mobile behavior. Confirm no unsubstantiated “10% harder,” exam-score improvement, or official-paper claim.
- [ ] Check changed cloud keys/routes and both progress/settings disclosures. Confirm the effective signed charter remains respected.

## Release and observe

- Deploy through the authorized Vercel project workflow only after explicit owner approval. A local preview or successful build is not production deployment.
- Inspect the deployed preview/production URL and Vercel logs; test a disposable account only in the intended environment.
- Monitor error rates, broken question reports and sync failures. Do not log response content or private student-authored text to diagnose them.
- If a material content defect or privacy leak is found, follow the incident/content-withdrawal process, restrict exposure where possible, notify the responsible owner, preserve the minimum necessary evidence, and make required notifications according to the organization’s legal/security process.

## Rollback

Use Vercel’s deployment history to restore the last known-good deployment when an application release causes a material regression. For a bank-only release, revert the exact bank commit and regenerate derived summaries with repository tooling; do not hand-edit generated files. If user data was migrated, a code rollback alone does not reverse the migration—follow the separately approved data rollback plan. Record decision, affected release, validation and incident follow-up.

## Current milestone

This milestone adds product/research/question-governance documentation and one runtime behavior change: first-time visitors without a saved locale default to Traditional Chinese (`zh-HK`), while explicit saved preferences are retained. It does not change question-bank content, environment variables, Supabase data, database schema or deployment configuration. The local preview was verified; no production publish is requested or authorized by this document.
