# Engineering decisions & assumptions

Recorded 2026-10-29 HKT during the platform trust upgrade. Update when founders override.

## Assumptions made (no founder ping)

1. **Do not flip Better Auth in production** in this PR — ship dormant-ready code + docs; founders run `FLIP-TO-BETTER-AUTH.md`.
2. **Do not apply `0028` wipe** — auth rebuild ≠ data reset.
3. **Keep student question reports free of free-text** despite the brief asking for descriptions — prior charter §16.E + migration 0020 win; detail stays in student email. Admin notes are staff-only.
4. **Apple Sign-In** is wired only when `APPLE_CLIENT_ID` + `APPLE_CLIENT_SECRET` exist; many HK teens use Google/email — Apple requires paid Apple Developer account (founders).
5. **Auth email delivery** uses `auth_email_outbox` + optional webhook — no new paid ESP dependency.
6. **Analytics** inserts are best-effort; missing table → 503, never block practice UI.
7. **AI drafts** create `question_revisions` stubs requiring human approve; publish to bank remains git/promote pipeline.
8. **Auth.js logout-all** cannot remote-revoke JWTs — API returns `next-auth-local-only`.
9. **Email verification** defaults off until `AUTH_REQUIRE_EMAIL_VERIFICATION=true` (avoids locking students out before mail webhook works).
10. **CI gains `tsc --noEmit`** as a reliability gate from the audit.

## Explicit non-goals this PR

- Replacing Auth.js before 0027 is applied.
- Collecting school / parental consent flows (still offline product decision).
- Paying for Mixpanel/Amplitude/etc.
- Auto-publishing AI question text to students.
