# Generated Diff Review — React/Next.js DoS Hotfix

## Status

Generated diff ready for approval. No build, QA, staging traffic, merge, or production deployment was performed in this step.

## Generator

- Command: `npm run gen:summary`
- Resolved command: `npx --yes tsx@4.19.2 scripts/gen-question-summary.mts`
- Generator: `scripts/gen-question-summary.mts`
- Version algorithm: `scripts/qbank/bank-version.mts`, SHA-256 of questions sorted by `id`, truncated to 16 hex characters.

## Inputs and outputs

Inputs are loaded by the generator from:

- `data/questions/index.ts`
- `data/subjects.ts`
- `data/questions/hidden-topics.ts`
- `scripts/qbank/bank-version.mts`
- `scripts/qbank/_gate.mjs`
- Existing generated dates/measurement files for preserving stable dates when versions do not change.

Generated outputs:

- `data/questions/summary.generated.ts`
- `data/questions/bank-versions.generated.ts`
- `data/questions/bank-dates.generated.ts`
- `data/questions/option-length.generated.ts`

## Diff summary

Only 2 files changed: 3 insertions and 3 deletions.

- `data/questions/bank-versions.generated.ts`: 1 value changed for `ict`.
- `data/questions/bank-dates.generated.ts`: the matching `ict` version and generated date changed.
- `summary.generated.ts`: unchanged.
- `option-length.generated.ts`: unchanged.

Expected change: the approved `ict` BANK_VERSION correction from `2d7e827bdef14374` to `8474815423402f54`, plus the generator's corresponding date update from `2026-10-31` to `2026-11-03`.

Unexpected changes: none observed.

## Unified diff

The complete diff is stored at `docs/security/artifacts/react-nextjs-dos-generated.diff`.

```diff
diff --git a/data/questions/bank-dates.generated.ts b/data/questions/bank-dates.generated.ts
@@
   "ict": {
-    "version": "2d7e827bdef14374",
-    "date": "2026-10-31"
+    "version": "8474815423402f54",
+    "date": "2026-11-03"
   },

diff --git a/data/questions/bank-versions.generated.ts b/data/questions/bank-versions.generated.ts
@@
-  "ict": "2d7e827bdef14374",
+  "ict": "8474815423402f54",
```

## Scope confirmation

The generator run changed no business logic, schema, route, component, dependency, test, or runtime configuration. No `ict` parity assertion was modified, deleted, weakened, or bypassed; the generated value now reflects the existing question-bank input.

## Reproducibility

```bash
npm run gen:summary
git diff -- data/questions/summary.generated.ts data/questions/bank-versions.generated.ts data/questions/bank-dates.generated.ts data/questions/option-length.generated.ts
```

## Approval request

Please review and approve this generated diff before any build rerun. The known `ict` parity issue remains a separate pre-existing blocker and is not being represented as part of the React/Next.js dependency hotfix.
