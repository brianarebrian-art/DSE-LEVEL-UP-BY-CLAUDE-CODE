# DSE Level Up — Test Plan

This plan checks the existing app and protects the quality/privacy boundaries. Use the scripts in `package.json`; do not run database migrations or modify production data as part of local verification.

## Automated checks

| Check | Command | Expected coverage |
| --- | --- | --- |
| Unit/regression suite | `npm test` | Session state, content rules, sync/privacy boundaries, answer marking, question-bank behavior. |
| Type correctness | `npm run typecheck` | TypeScript project. |
| Lint | `npm run lint` | Next.js/React and source conventions. |
| Repository QA gates | `npm run qa` | Project-specific documentation, bank and safety rules; inspect failures rather than bypass. |
| Secret scan | `npm run secret:scan` | Ensure no credentials were committed. |
| Production build | `npm run build` | Separate deployability check when source/build behavior changes; not required just to start a development preview. |

Run focused question-bank tests for any bank edit, including the matching family/topic/content tests and generated-summary parity. Run the complete required checks before a commit/push; report the actual command results rather than inherited historical pass counts.

## Browser smoke test — student flow

1. Open the local development preview and confirm the landing page loads without console/runtime errors.
2. Navigate to an existing subject and a topic with live MC questions.
3. Start practice as a guest; verify the question, all choices and progress indicator are present and keyboard operable.
4. Choose a wrong option; confirm the product’s first-step hint does not immediately reveal the answer, then verify the full explanation appears at the intended point in the flow.
5. Complete or submit a session; verify result copy is consistent with the number of answered objective items.
6. Check a written-question mode separately: it must reveal a reference answer for self-assessment and must not display machine-grading or objective accuracy claims.
7. Test a narrow phone viewport (at least 375 CSS px): no horizontal overflow, controls have practical touch targets, text remains readable, inputs are at least 16 px, and content stays inside safe areas.
8. Test the core session with keyboard-only navigation. Check focus visibility, accessible labels, answer state announcements and contrast.
9. If sign-in is available in this environment, test sync only with a disposable account/test environment: continue an unfinished session on another device/session, submit/abandon, and confirm the session clears. Do not use a real student account or production writes for a smoke test.

## Boundary regression checks

- A new storage key cannot silently enter a sync payload; allowlist tests must fail closed.
- A blank local value must not overwrite an existing cloud value unless the explicitly defined contract calls for clearing it.
- User-authored private text remains excluded from progress and settings payloads.
- Student data remains scoped to the signed-in user's ID; cross-user/admin/class analytics remain absent.
- Marketing/privacy copy remains aligned with both sync channels and signed decisions.
- MC answer order shuffling preserves the answer identity and option-specific rationale.
- Generated question data has unique IDs/options, correct result indexes, valid topic mapping, and no stale generated summaries.

## Test-data safety

Use synthetic accounts and synthetic answers only. Redact tokens, cookies, auth headers, emails, and student data in logs/screenshots. Never use browser local storage to seed real users. Delete any disposable test account/data according to the test environment policy.

## Verification record — 2026-11-25

- Passed: `npm test`, `npm run typecheck`, `npm run lint`, `npm run qa`, and `npm run secret:scan` (one sequential command; exit code 0).
- Browser smoke: fresh isolated browser at 390 × 844 rendered Traditional Chinese by default; Math opened a 10-item session with a `1 / 10` indicator; one answer was submitted; the progress page then displayed one attempted question. No account was signed in and no production writes were made.
- Browser console: no runtime errors observed. Development warnings remain for global smooth scrolling and an above-the-fold image’s LCP loading hint.
- Not run: production build (no build/dependency/config change), written-answer mode, wrong-answer hint sequence, keyboard-only/reduced-motion audit, or cross-device sync. These remain separate checks before a release.
