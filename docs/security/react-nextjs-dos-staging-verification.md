# React / Next.js DoS Staging Verification

## Scope and safety

- **Environment:** staging / Vercel Preview only.
- **Accounts:** synthetic founder account with the minimum approved allowlist access.
- **Data:** synthetic question IDs and synthetic request data only.
- **Production:** prohibited. Do not send attack-shaped traffic to production or real student data.
- **Payload handling:** generate large nested `$K` references in the test harness at runtime; do not commit the complete payload, log it, or ship it to the client bundle.

## Endpoint under test

The real Server Action surface is the imported actions used by `components/founder/BatchStatusActions.tsx`:

- `previewQuestionStatusBatch` from `lib/founder/actions.ts`
- `confirmQuestionStatusBatch` from `lib/founder/actions.ts`

These are Next Server Actions transported as POST requests by the preview page, not hand-authored API routes. In each deployment, capture the exact POST URL and action headers from the browser Network panel while invoking the synthetic preview flow; use that captured endpoint only for the controlled test.

## Payload design

The harness creates bounded request bodies containing many nested `$K` references, with a configurable count and depth. Start with a low baseline, increase one parameter at a time, enforce a hard request/time budget, and stop immediately on health degradation. Never store the full generated body in Git, CI artifacts, logs, or screenshots.

## Measurements

For unpatched and patched previews, record the same run count and synthetic inputs:

- client-observed CPU duration where available;
- Vercel function duration;
- p95 latency;
- 5xx rate;
- health-check success and recovery time;
- ordinary Server Action success rate during the control flow.

## Comparison

- **Baseline:** the previously approved unpatched preview deployment.
- **Patched:** `security/react-nextjs-dos-patched-preview` preview after the dependency branch is accepted and deployed.
- Use identical region, runtime settings, synthetic account, payload generator configuration, warm-up, and observation window.

## Pass criteria

1. Both previews remain observable and recover without manual process intervention.
2. Patched preview does not show unbounded CPU/function duration or sustained 5xx growth.
3. Health checks remain successful throughout the bounded run.
4. Normal founder preview/confirmation smoke flow succeeds before and after the test.
5. No production request, real student data, secret, or complete payload is used.

## Fail criteria

- Any production traffic is generated.
- Patched preview freezes, loses health checks, exhausts its budget, or produces sustained 5xxs.
- p95/function duration or error rate materially regresses against baseline.
- Synthetic founder flow cannot complete or authorization/origin protections weaken.

## Rollback criteria

Stop the test, disable the test runner, preserve aggregate metrics only, and do not promote the preview if any fail criterion occurs. Redeploy the last known-good patched artifact or revert the dependency commit only under the incident rollback approval; do not knowingly promote the affected React version.

**Status:** prepared only; execution is pending dependency test approval and Vercel Preview deployment.
