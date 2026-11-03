# Build / QA Evidence

- **Date:** 2026-11-03
- **Branch:** `security/react-nextjs-dos-patched-preview`
- **Dependency versions:** `react 19.2.6`, `react-dom 19.2.6`, `next 16.4.2`

## `npm run build`

- **Exit code:** 1
- **Duration:** approximately 68 seconds (process reached V8 heap failure at ~67.5s)
- **Result:** Failed before a completed production build.
- **Output summary:** Next.js 16.4.2 webpack build started successfully and emitted the existing `preferredRegion` deprecation warning, then Node/V8 terminated with an out-of-memory error.
- **Error:** `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`
- **Dependency relationship:** Not shown to be caused by the React/Next patch. The failure is a resource limit during webpack build; no dependency rollback or build-config change was attempted.
- **Required action:** Re-run in an approved build environment with an adequate memory budget, without changing application logic. If it still fails, capture memory diagnostics and investigate separately.

## `npm run qa`

- **Status:** Not run.
- **Reason:** The build failed, so execution stopped at the required failure gate. No QA result is claimed.
- **Required action:** Run only after the test blocker is approved/resolved and the build failure gate is cleared, or explicitly approved as an independent check.

## Other checks already completed

- `npm ci`: passed.
- `npm ls`: clean patched React/React DOM tree was recorded in the previous step.
- `npm run lint`: passed.
- `npm run test`: blocked by the pre-existing ICT `BANK_VERSION` mismatch; see `react-nextjs-dos-test-blocker-analysis.md`.
- Typecheck: Not configured.
