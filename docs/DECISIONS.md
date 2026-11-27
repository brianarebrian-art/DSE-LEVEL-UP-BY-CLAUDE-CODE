# Product Decision Log

## 2026-11-25 — Treat the existing DSE platform as the MVP baseline

**Decision:** Do not scaffold a second app or duplicate the live question bank. The repository already has the short-session practice product, a question-bank workflow, personal progress, written-question self-assessment, sync and trust/methodology pages. The milestone is to record the verified product and research baseline and verify the existing browser journey.

**Why:** A parallel MVP would create conflicting bank, auth, privacy and deployment systems. The current application is immediately trialable; improvement should be evidence-led and use the existing routes.

**Consequences:** No route, database schema, auth provider, environment variable or production deployment change in this milestone. `PRODUCT_SPEC.md` gives the current journey and exact next pilot boundary.

## 2026-11-25 — Do not claim a ten-point difficulty delta without item evidence

**Decision:** Interpret “10% harder” as 10 percentage points lower correctness, but make no calibration claim for any item set in this milestone.

**Why:** Current difficulty is a categorical author label. Reviewed HKEAA public reports provide exam-level context; no item-level baseline matched to the existing original questions was found. No response cohort was supplied. A `hard` tag or question author estimate is not a measured success rate.

**Consequences:** Existing `mp_k2_0`–`mp_k2_9` remain candidate practice, not validated examples for a 10-point result. A calibration study requires separate content/rights review, minimal and approved consent-based data collection, pre-registered analysis and uncertainty reporting. No new student-response collection or data field is approved here.

## 2026-11-25 — Preserve the signed sync approval; correct the old inventory status

**Decision:** Do not revert the cross-device active-session/reverse-log sync approved in `charter-amendment-2026-09-08.md`. Add a visible dated status note to the older student-data inventory so its pre-amendment P0 is not mistaken for the current policy.

**Why:** The signed amendment is later, specific and supported by current allowlist/test records. The old report remains useful historical context but is no longer the current decision.

**Consequences:** Student-authored private writing, third-party sharing, teacher/admin access, leaderboard/peer comparison and new unapproved sync keys remain prohibited by product policy. Any change still follows the charter process.

## 2026-11-25 — Keep platform copy independent from official exam claims

**Decision:** Use HKEAA framework and reports as sources for scope and context; do not call original items official past papers or imply affiliation. Do not reproduce copyrighted question text without documented rights.

**Why:** HKEAA’s public assessment framework is year-specific; competitor pages describe their own content/licensing model. Public availability is not a reuse licence.
