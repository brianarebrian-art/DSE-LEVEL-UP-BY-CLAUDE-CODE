# Product Assumptions and Open Questions

**Last reviewed:** 2026-11-25. “Assumption” means not yet demonstrated by representative evidence.

## Working assumptions

1. S4–S6 students will try a short practice session more readily than a full timed mock.
2. Clear, staged explanations (hint first, full solution after) are more useful than a correctness badge alone.
3. A student may move between phone and tablet; preserving an unfinished session is worth the narrowly scoped, disclosed sync described in the signed charter amendment.
4. A personal, non-comparative progress view is helpful without a teacher dashboard, leaderboard, or peer percentile.
5. A free, ad-free product is the intended operating model, not an introductory offer.

These are product hypotheses and owner decisions; do not cite them as user research findings.

## Fixed decisions / do not reopen casually

- The product is free, ad-free, and not a paywalled trial.
- Account is not required to start; the current guest allowance is one completed session per device before sign-in is requested.
- Signed-in cloud sync is limited to the allowlisted progress and settings keys. `dse_active_session` (including selected platform-provided MC options) and `dse_reverse_log` have explicit approval for continuity. User-authored writing (journal, time capsule, essays, mood notes, self-written encouragement) remains local and is excluded from cloud sync.
- Synced records are per-user. No third-party sharing, teacher dashboard, classroom average, leaderboard, ranking, or cross-user comparison.
- Written answers are self-assessed; they are not machine-graded and do not feed objective accuracy/grade estimates.
- Do not use “official,” “past paper,” or “10% harder” to describe generated questions unless rights and evidence support the exact claim.

Refer to the current [`charter.md`](./charter.md) and signed [`charter-amendment-2026-09-08.md`](./charter-amendment-2026-09-08.md) for authority. An earlier unsuperseded inventory may describe a now-resolved risk.

## Open questions requiring evidence, not guesswork

- Which subject/topic is the best first calibration cohort, based on student demand and expert review capacity?
- Can volunteer cohorts yield enough eligible responses per item to estimate a 10-percentage-point difference with useful confidence intervals?
- Which framework revision applies to each subject/year? Which generated items need review after a framework change?
- Does the guest one-session limit help with abuse control enough to offset its activation/retention cost?
- What accessibility barriers remain on real iOS Safari, including voiceover and larger text?
- Is a student report on a question easier to use and acted upon quickly enough to build trust?

## Guardrails for future product decisions

- A new collected or synced key, use of student data for research/training, new recipient, admin access, cross-user aggregation, or schema/migration change is not implied by the MVP. Follow the charter’s explicit approval process first.
- Ask students only for data essential to the stated purpose. Do not collect school names, class lists, health/SEN diagnoses, or free-text personal details for analytics.
- Do not convert owner estimates into success metrics. Label samples, date ranges, missingness, confidence intervals and selection bias.
- Never block access to core study support on research consent.
