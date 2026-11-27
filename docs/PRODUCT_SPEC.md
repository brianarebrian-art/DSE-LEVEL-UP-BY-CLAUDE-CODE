# DSE Level Up — Product Specification

**Status:** Existing production product; this document records the verified baseline and the next evidence-gated experiment. It does not authorize a new pricing model, audience-data use, or public launch of uncalibrated content.

## Product intent

Help Hong Kong DSE candidates practise short, focused questions, understand why distractors are wrong, and continue a session across devices when they choose to sign in. Keep the service free, ad-free and useful without requiring sign-in to begin. The platform is independent and is not an HKEAA product.

## Primary user and job

- **Primary:** S4–S6 students preparing for HKDSE; especially a student using short mobile study sessions who needs an explanation rather than a bare score.
- **Job:** Pick a subject/topic, complete a short practice session, get honest feedback, and see their own progress without public ranking or teacher surveillance.
- **Secondary:** A student who wants a larger-screen continuation; optional Google sign-in synchronizes the explicitly listed progress/settings keys.

## Verified product baseline

The product already has a Next.js App Router web application, 25 DSE Category A subject entries (M1/M2 separate), MC and student-self-assessed written-question flows, explanations, per-user progress, optional Supabase sign-in/sync, printable practice, accessibility settings, and public methodology/privacy/transparency pages. Verify live details in the code and current public pages; README counts are dated snapshots, not live facts.

Current visitor access is limited to one completed trial session per device before sign-in is requested. This is not the same as unlimited anonymous use. Existing written questions are revealed for student self-assessment; they are not machine graded or included in objective accuracy/grade estimates.

## Core user journey

1. Open a subject/topic without an account.
2. Begin a short MC session; answer choices are shuffled without changing their underlying identity.
3. On a wrong answer, receive a hint before the full explanation; review the solution after submission.
4. See a session result and their own progress.
5. Optionally sign in to sync the specifically approved keys, including an unfinished MC session, across devices.
6. Report a content issue through the existing feedback path.

## Product invariants

- No fee, ads, or paywall; no public leaderboard, peer percentile, or classroom analytics.
- Do not treat self-assessed writing as objective correctness or an AI-graded result.
- Default new visitors to Traditional Chinese (`zh-HK`); retain a student's explicitly saved English/Chinese choice.
- Do not imply affiliation with HKEAA or that generated parallel questions are official past-paper questions.
- Student-authored free text remains local; only the charter-approved, platform-provided selections/settings/progress may sync.
- A difficulty label is an editorial category, not an empirical success probability. Never call a question “10% harder” without a measured and documented comparison.
- Honor the currently effective charter and privacy disclosures; an old inventory is not authority to reverse a signed decision.

## Next evidence-gated pilot

Use an existing, already accessible Math permutation/combination practice set to test the product journey; do not create a second product or duplicate the live bank. The ten existing `mp_k2_0`–`mp_k2_9` conditional-probability variants in `data/questions/math-parametric.ts` are a candidate review set only. They are labelled `hard`, but have **not** been shown to be 10 percentage points below a matched baseline. Do not market or report them as meeting that threshold.

Before a separate calibration claim: freeze a versioned item set, choose year-specific curriculum and matched baseline items, confirm rights to use any official item-level data, collect only opt-in and minimum response data, pre-register the calculation, run a qualified content review, and publish uncertainty/limitations. The actionable, approval-gated sequence is in [`ROADMAP.md`](./ROADMAP.md). No new response-data field, cloud key, database migration, or third-party data use is authorized by this specification.

## Success measures

Measure the current product honestly before proposing new features:

- **Task completion:** percentage of trial sessions submitted successfully; report denominator and time window.
- **Learning clarity:** student-reported “I understand why my answer was wrong” after review; voluntary, anonymous, and not required to continue.
- **Reliability:** question/answer report rate and confirmed correction rate, by bank release.
- **Access:** mobile and keyboard/screen-reader completion of the core session.
- **Privacy:** no new collected fields; verify cloud-key allowlists and disclosures match.

Do not present any of these as observed results until measured. Do not use a small volunteer sample as proof of score improvement or causal learning gains.

## Not in this MVP

Automated essay marking; grade predictions based on written responses; teachers' dashboards; class rankings; peer comparisons; ads/payments; social messaging; an AI tutor; copying HKEAA paper content without a licence; or an unreviewed “10% harder” set.

## Acceptance criteria for this documentation milestone

- Existing application is launched and its user-visible practice route is checked in the browser.
- New visitors see Traditional Chinese by default; a saved explicit English choice remains respected.
- Product facts, consent boundary, and outstanding calibration gap are documented with dated sources.
- Runtime change is limited to the new-visitor language fallback (`zh-HK`) and preserving the student's saved preference; practice routes, question content and sync behavior remain unchanged.
- No claim of empirical difficulty calibration is added to user-facing UI.
