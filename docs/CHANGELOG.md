# Project Changelog

## 2026-11-25 — DSE MVP baseline and evidence gates

- Added product specification, desk-research notes, assumptions, question review/calibration standard, data-boundary documentation, test plan, deployment checklist and decision log; linked the set from the README.
- Documented the existing app as the trialable MVP rather than creating duplicate runtime/auth/question-bank systems.
- Marked the ten existing Math conditional-probability variants as uncalibrated candidates; no “10 percentage points harder” claim is supported by current data.
- Added a dated correction to the older student-data inventory pointing to the signed cross-device-sync amendment.
- Changed the no-preference locale fallback to Traditional Chinese (`zh-HK`); explicit saved English/Chinese preferences remain respected.
- Verified the Math 10-question entry, one answer submission, and the resulting one-question progress display in an isolated mobile browser session.
- Automated checks passed: `npm test`, `npm run typecheck`, `npm run lint`, `npm run qa`, and `npm run secret:scan`.
- No question-bank content, user data, environment variables, database schema or production deployment changed.
