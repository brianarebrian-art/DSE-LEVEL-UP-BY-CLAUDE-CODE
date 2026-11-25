# Evidence-Gated Calibration Pilot Roadmap

**Status date:** 2026-11-25. The current app is usable now; this roadmap covers a separate research/content pilot, not a production launch. No response collection is authorized by this document.

Calendar due dates and individual owners remain unassigned because the work is gated on founder approval, subject-review availability, rights and consent decisions. Do not convert the sequence into a public commitment until those owners and dates are set.

| Priority | Action | Owner / due date | Exit metric |
| --- | --- | --- | --- |
| P0 | Select one subject, topic, applicable DSE framework year, target student cohort, and qualified independent reviewer. Decide whether the existing Math K2 family is suitable. | Founder / unassigned | One signed scope record; topic and assessment year map to the correct HKEAA framework. |
| P0 | Select ten candidate items and a matched baseline; document provenance, item version, marks, format, topic and rights for each. Do not reproduce official question text. | Content lead / unassigned | 10/10 candidates and baselines have complete provenance and documented reuse rights. |
| P0 | Draft or adapt ten original items in an isolated review batch, not the live bank. Include worked answer, misconception-based distractors, item-level explanation, bilingual parity and accessibility alternatives. | Subject author / unassigned | Exactly 10 complete draft items; each has one independently recomputed answer and no unresolved ambiguity. |
| P0 | Obtain independent subject-matter review and content/rights approval before any student sees the batch. | Qualified reviewer + owner / unassigned | 10/10 item sign-offs recorded; any rejected item is replaced or removed, never waved through. |
| P1 | Run schema, arithmetic, duplicate-ID/option, topic, render, shuffle, answer-key, bank-summary, mobile and keyboard checks. | Engineering / unassigned | All required checks pass; no unreviewed files or generated-summary drift in the diff. |
| P0 | Decide whether a student calibration study is necessary; complete privacy, guardian/ethics, consent, retention, access and deletion review before collecting responses. | Founder/privacy owner / unassigned | Written approvals and student-facing notice are complete; zero data collection before approval. |
| P1 | Pre-register the statistical design, eligible-attempt rules, repeated-student handling, sample-size/power calculation and reporting format. | Statistician or qualified analyst / unassigned | Protocol frozen before responses; sample size justified for the chosen 10-point threshold and uncertainty target. |
| P1 | If separately approved, run a voluntary, minimal-data, non-production pilot with synthetic/test separation and deletion controls. | Research owner / unassigned | No unconsented records; collected sample meets the pre-registered usable-response target. |
| P1 | Publish an internal item-level report and owner decision; promote only after review, with the estimate, 95% confidence interval, sample size and limitations. | Analyst + owner / unassigned | For Δ = baseline correctness − candidate correctness, the pre-registered 95% interval supports Δ ≥ 10 percentage points for every item claimed; otherwise label it uncalibrated and do not market the claim. |

## Release gates

- `easy | medium | hard` remains an editorial label, not a response-rate estimate.
- Aggregate HKEAA grades or overall subject statistics cannot substitute for item-level matched response data.
- Do not add a response event, cloud key, table, external processor or new data purpose until separately approved and disclosed.
- A content review can reject an item even if its observed correctness rate is low; ambiguity and out-of-syllabus content are defects, not useful difficulty.
- No production promotion or deployment is authorized by completing this roadmap. Use the project’s release checklist and obtain explicit owner approval.
