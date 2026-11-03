# React / Next.js DoS Staging Acceptance

Deployment: `security/react-nextjs-dos-patched-preview` Preview

- [ ] Build pass
- [ ] Typecheck pass — currently **Not configured**
- [x] Lint pass
- [ ] Existing tests pass — blocked by pre-existing `ict` `BANK_VERSION` mismatch in `summary-parity.test.mts`
- [x] Dependency versions patched: `next 16.4.2`, `react 19.2.6`, `react-dom 19.2.6`
- [ ] Core founder preview/confirmation Server Action smoke test pass
- [ ] Staging-only DoS regression test pass
- [ ] No regression in existing learning flows
- [ ] Rollback plan confirmed

Acceptance remains **blocked** until the failed existing test is reviewed and the unrun build/QA checks are approved to continue. No production deployment or merge is permitted.
