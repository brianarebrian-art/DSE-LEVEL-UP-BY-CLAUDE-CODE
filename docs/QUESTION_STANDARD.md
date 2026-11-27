# Question Authoring, Review and Calibration Standard

**Scope:** Original DSE Level Up questions. This document does not grant a licence to republish HKEAA material or approve a new live-bank batch.

## 1. Curriculum and provenance

For each item, record subject, syllabus/topic, applicable examination year/framework revision, item type, intended marks, source of factual/mathematical content, author, reviewer, version and review date. Check HKEAA’s subject/year assessment framework before drafting. Do not invent an official year, paper code, source paper, or HKEAA endorsement. If a prompt was inspired by an official question, confirm it is an original parallel item and sufficiently transformed; never copy the stem, data, options, images, or answer/explanation. Keep licence evidence for any third-party material and do not promote an item with unresolved rights.

## 2. Item quality checklist

Before a draft may enter the live bank:

- One assessable learning objective and one unambiguous task; language matches Hong Kong Traditional Chinese/English conventions as applicable.
- Content is within the relevant syllabus/framework and does not depend on unstated assumptions.
- Every MC item has exactly one correct answer, plausible misconception-based distractors, no duplicate options, and a worked independent answer check.
- Explanation is mathematically/factually correct, explains the reasoning and the principal distractors, and does not rely on option position (display order is shuffled).
- Marks/difficulty align with the requested work; a “hard” tag alone is not empirical evidence.
- Accessibility: readable math, keyboard-operable practice, no information conveyed only by colour/images, image alternatives, no avoidable time pressure.
- English/Chinese versions preserve meaning and answer equivalence; bilingual options are checked for parallelism.
- Written items have a transparent reference answer/rubric and explicitly use student self-assessment. Never label them automatically graded.
- Automated validation passes for schema, IDs, answer indexes, duplicate options, topic registration, renderability, and bank-summary parity.
- A qualified subject reviewer has signed off the content and derivation; reviewer/date are recorded. Automatic checks are not a substitute for subject review.

## 3. Difficulty labels versus empirical facility

The bank’s `easy | medium | hard` field is an editorial category. It must not be translated into an item success probability or advertised as a measured grade boundary. Any claim of “10% harder” means a **10 percentage-point reduction** in correctness (example: 60% baseline versus 50% candidate). State this interpretation in the measurement protocol and UI copy.

Required evidence for a calibrated claim:

1. Freeze versioned candidate and baseline items; document topic, framework year, marks, item format, and intended population. A baseline is matched on these factors and is not selected after inspecting results.
2. Establish legal rights to the benchmark items/data. Aggregate subject grades or overall examination statistics cannot stand in for item-level accuracy.
3. Use voluntary, informed, minimal-data response collection. Do not use a student’s account identity or progress outside the stated purpose; obtain the necessary guardian/ethics review for minors before a research cohort.
4. Pre-register exclusion rules, duplicate-attempt rules, missing-data handling, analysis method, target population and success threshold. Report sample size, confidence interval, and selection limitations.
5. Compare candidate and baseline using a suitable item/student-aware method (e.g. a pre-specified mixed-effects logistic model for repeated responses, or a justified matched design). Do not treat multiple answers from one student as independent observations.
6. Define Δ = baseline correctness − candidate correctness. Support a “10 percentage points harder” claim only if the pre-registered 95% confidence interval for Δ has a lower bound of at least 0.10 for every item in the claimed set. Report the estimate, interval and sample size, not just a label. A small pilot is directional, not calibration.
7. Conduct an independent content review even when response data support the intended difficulty; confusing, ambiguous or out-of-syllabus items are not “hard” learning items.
8. Revalidate after material edits or framework revisions; keep the item version and evidence linked.

No item-level response dataset or matched baseline was identified in this review. Therefore this repository currently cannot certify a set of ten questions as meeting the 10-point criterion. Existing `mp_k2_0`–`mp_k2_9` items are candidate practice only; they have a `hard` label but no recorded empirical facility estimate. Keep them out of any specifically advertised calibration cohort until independently reviewed and measured.

## 4. Draft to release workflow

Author draft → automated schema/arithmetic/render checks → independent subject review → provenance/rights review → owner’s batch approval → run required question-bank tests → update generated summaries by the documented scripts → inspect staged diff and counts → promote in a dedicated commit → post-release report/correction path. Never edit generated summaries by hand. Do not promote a batch with failed checks or without the required review sign-off.

Use the repository’s existing question-bank tooling and policy (`scripts/qbank/`, `data/questions/__tests__/`, and `docs/SKILL-dse-sop-harness.md`). This standard does not bypass any stricter subject-specific governance.

## 5. Defect handling

Treat a suspected wrong answer, ambiguous wording, out-of-syllabus concept, misleading explanation, inaccessible content, or copyright issue as a content defect. Record item ID, bank version, reproduction, severity and correction decision. Disable/withdraw first if a student could learn a materially wrong rule; correct, regenerate summaries, test and document the release. Preserve an audit trail; do not silently replace a live item while retaining the same calibration claim.
