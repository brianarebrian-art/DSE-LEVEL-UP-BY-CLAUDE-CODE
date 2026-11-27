# DSE Level Up — Research Notes

**Reviewed:** 2026-11-25. This is desk research, not a user study, legal opinion, or an endorsement of any competitor. Product pages can change; recheck before external publication.

## Official assessment context

- HKEAA’s [Assessment Frameworks](https://www.hkeaa.edu.hk/en/hkdse/assessment/assessment_framework/) lists frameworks by subject and examination year. The page identifies revisions for multiple subjects in the 2026–2029 cycles (including 2027 Geography and several Music years). Therefore question scope must be checked against the **subject and examination year**, not only a timeless subject label.
- HKEAA’s [Examination Report](https://www.hkeaa.edu.hk/en/HKDSE/assessment/exam_reports/) currently links the 2025 report. HKEAA describes it as examination-process, administration and statistics reporting. It is useful for cohort/exam context, but does not by itself establish the response rate or empirical facility of every original DSE Level Up item.
- Official subject material may include copyrighted papers, marking schemes and candidate-performance commentary. A public page or purchased report is not permission to reproduce its questions. This project’s question-bank policy is original parallel items; retain the applicable provenance and rights check for every item.

## Market scan (qualitative)

| Service | Publicly stated positioning (checked 2026-11-25) | Product implication, not a market-share claim |
| --- | --- | --- |
| [EdCity OQB](https://www.edcity.hk/oqb/) | Assessment-for-learning platform using HKEAA-provided historical questions, covering 10 named DSE subjects; offers a free practice area and school subscription model. | Historical-item coverage and school assessment are existing alternatives. DSE Level Up should distinguish itself through its free, individual, short-session experience and explanations, without implying official-paper access. |
| [LATTE](https://latte.wiseman.com.hk/) | School-facing HKDSE English platform; its page describes licensed English reading papers, feedback/analytics and school subscription. | Avoid copying a school/teacher analytics proposition; protect the no-ranking, student-first boundary. |
| [thinka](https://www.thinka.ai/) | The current public homepage emphasizes AI-generated practice, automated marking and AI tutoring for AP/SAT/international curricula; it does not establish a like-for-like DSE-only service comparison. | A possible adjacent AI-practice alternative, not a verified direct competitor for every DSE subject. Do not repeat its outcome metrics as independently validated evidence. |
| DSE Level Up (this project) | Existing free, ad-free, student-facing platform; original questions, short practice, feedback and personal progress. Current feature/access limits are described in the app and README. | The distinctive bet is low-friction, individual practice and clear explanations; user interviews are still needed to test whether this matters enough to drive repeat use. |

This scan does not assess market size, pricing elasticity, school procurement, customer counts, retention, conversion, or competitor product quality. Vendor statements above are attributed statements, not independently verified outcomes.

## Student needs — evidence status

- **Observed in project decisions:** cross-device continuation is important to the product owners; the signed 2026-09-08 charter amendment explicitly records the rationale. This is a design decision, not proof of population-wide demand.
- **Hypotheses to validate:** short mobile sessions reduce the activation barrier; an explanatory distractor analysis improves perceived usefulness; students prefer individual feedback to public comparison; the one-session guest limit may reduce continued use.
- **Not yet studied in this milestone:** interviews or usability tests with current S4–S6 students, SEN students, parents or teachers; representative retention/learning outcomes; willingness to pay (the product is defined as free); item-level response distributions.

Run voluntary usability sessions with students/guardians as appropriate, avoid collecting names or school identifiers, do not ask for sensitive disclosures, and do not turn research participation into an access condition. Record consent, script, sample characteristics at a high level, dates, and limitations before citing findings.

## Difficulty benchmark evidence

The requested target is interpreted as **10 percentage points lower mean correctness** than a matched baseline (e.g. 60% to 50%), not “10% relative decrease.” The code’s `easy | medium | hard` property is categorical editorial metadata. `data/questions/math-parametric.ts` labels the K2 generated family hard; it contains no observed per-item success-rate field or matched-baseline evidence. HKEAA’s public exam report landing page does not provide such a comparison for these original generated questions.

Consequently, no defensible claim that any existing or new 10 items meet the 10-point threshold can be made from the reviewed materials. The existing `mp_k2_0`–`mp_k2_9` set can be inspected as candidate practice, not designated as calibrated examples. Do not infer student scores, calibrate from overall exam statistics, or copy official questions to manufacture a baseline.

## Sources

1. HKEAA, Assessment Frameworks — https://www.hkeaa.edu.hk/en/hkdse/assessment/assessment_framework/ (accessed 2026-11-25).
2. HKEAA, Examination Report — https://www.hkeaa.edu.hk/en/HKDSE/assessment/exam_reports/ (accessed 2026-11-25).
3. Hong Kong Education City, OQB Introduction — https://www.edcity.hk/oqb/ (accessed 2026-11-25).
4. LATTE public product page — https://latte.wiseman.com.hk/ (accessed 2026-11-25).
5. thinka public product page — https://www.thinka.ai/ (accessed 2026-11-25).
6. Project charter and dated product records — [`charter.md`](./charter.md), [`charter-amendment-2026-09-08.md`](./charter-amendment-2026-09-08.md), [`2027-student-data-inventory.md`](./2027-student-data-inventory.md), and [`REPOSITORY-TRUTH-REPORT.md`](./REPOSITORY-TRUTH-REPORT.md). Treat dated snapshots as historical evidence, not live metrics.
