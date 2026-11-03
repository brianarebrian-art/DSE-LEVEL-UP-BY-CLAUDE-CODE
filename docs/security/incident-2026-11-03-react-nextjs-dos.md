# P0 Incident Review: React / Next.js DoS

- **Date:** 2026-11-03
- **Scope:** Dependency assessment only; no application logic, schema, or production changes made.
- **Reported issues:** CVE-2026-23870 (React Server Components DoS) and CVE-2026-94482 (Next.js App Router / Server Action DoS).

## Affected Versions

| Component | Declared / resolved version | Advisory range supplied | Status |
| --- | --- | --- | --- |
| `next` | `16.4.2` in `package.json` and `package-lock.json` | `13.0.0–15.5.27`, `16.0.0–16.4.0` | **Not in the supplied affected range**; already >= `16.4.1` |
| `react` | `19.2.4` in `package.json` and `package-lock.json` | `19.0.0–19.0.5`, `19.1.0–19.1.6`, `19.2.0–19.2.5` | **Affected by CVE-2026-23870**; below `19.2.6` |
| `react-dom` | `19.2.4` in `package.json` and `package-lock.json` | React runtime family | **Upgrade with React** to maintain matching versions |
| `react-server-dom-webpack` | Not declared or present in lockfile | Same as CVE-2026-23870 | No direct package evidence |
| `react-server-dom-turbopack` | Not declared or present in lockfile | Same as CVE-2026-23870 | No direct package evidence |
| `react-server-dom-parcel` | Not declared or present in lockfile | Same as CVE-2026-23870 | No direct package evidence |

## Evidence

1. `package.json` declares `next: ^16.4.2`, `react: 19.2.4`, and `react-dom: 19.2.4`.
2. `package-lock.json` resolves `next` to `16.4.2`, `react` to `19.2.4`, and `react-dom` to `19.2.4`.
3. `lib/founder/actions.ts` is a Server Actions module (`'use server'`) and confirms the App Router / Server Action execution surface is used.
4. `next.config.ts` is the active Next.js configuration and confirms deployment-specific configuration exists for Vercel.
5. `npm ls next react react-dom react-server-dom-webpack react-server-dom-turbopack react-server-dom-parcel --all` returned an empty tree with exit code 1 because `node_modules` is not installed in this checkout. Therefore the resolved-version evidence is from the lockfile, not an installed tree.
6. No direct `react-server-dom-webpack`, `react-server-dom-turbopack`, or `react-server-dom-parcel` package entry was found in the lockfile.

## Assessment

- **CVE-2026-23870:** **P0 affected** through React `19.2.4`; a lockfile version remains below the supplied fixed version `19.2.6`.
- **CVE-2026-94482:** Based strictly on the supplied affected ranges, Next.js `16.4.2` is already outside the affected range and meets the requested minimum `16.4.1`. The repository still uses Server Actions, so the planned hotfix should verify the installed result and retain `next >=16.4.1`.
- **P0 blocker:** React `19.2.4` remains in `package-lock.json` until the approved hotfix updates it. Do not treat the repository as remediated before lockfile and clean-install evidence show `react >=19.2.6` and matching `react-dom`.

## Fix Plan (pending approval)

1. After approval, create `security/react-nextjs-dos-hotfix` from the current `main` tip.
2. Upgrade `next` to `>=16.4.1` (the manifest currently requests `^16.4.2`; retain or update only as needed to produce a patched lockfile).
3. Upgrade `react` and `react-dom` together to `>=19.2.6`, with matching compatible versions.
4. If any `react-server-dom-webpack`, `react-server-dom-turbopack`, or `react-server-dom-parcel` dependency is introduced by the resolved graph, ensure it is `>=19.2.6`; otherwise do not add it.
5. Refresh the lockfile, remove `node_modules`, and run `npm ci`.
6. Do not modify business logic, database schema, student data, or add unrelated dependencies/features.

## Test Plan

- Capture before/after `npm ls next react react-dom react-server-dom-webpack react-server-dom-turbopack react-server-dom-parcel` output.
- Confirm lockfile contains no supplied affected versions; any remaining affected entry is a P0 blocker.
- Run, when available: `npm run build`, `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run qa`.
- Exercise existing Server Action smoke paths in staging, including founder batch preview/confirmation authorization and origin checks.
- In **staging only**, use an approved, rate-limited security test to send crafted POST requests containing large nested `$K` references to a Server Action endpoint. Record CPU, latency, 5xx rate, request completion, and whether the service freezes or recovers. Define pass criteria before execution and stop on resource exhaustion.
- Never run the crafted DoS test against production.

## Rollback Plan

- Stop promotion and redeploy the last known-good production deployment if staging or validation fails.
- Revert only the hotfix commit/branch changes, restoring the prior manifest and lockfile as a controlled rollback; do not reset unrelated commits.
- If rollback would restore an affected dependency, keep production on the last patched deployment or use the previous patched artifact rather than knowingly redeploying an affected build.
- Preserve before/after `npm ls`, test output, and lockfile diff evidence for incident review.

## Deferred Upgrade Decision

- **Decision:** Deferred upgrade（只限第二步補償控制與升級準備；不代表風險已消除）
- **Decision owner:** DSE Level Up engineering/security owner（待指定姓名）
- **Decision time:** 2026-11-03（香港時間；exact timestamp 待 incident owner 補記）
- **Review deadline:** 2026-11-04（香港時間）或任何升級 trigger 觸發時，以較早者為準
- **Maximum deferral window:** 不超過 24 小時；到期前必須重新批准、升級或明確記錄風險決定
- **Reason for deferral:** 本步只建立邊界控制、監察、回歸測試及回滾準備，避免未經批准直接改動 dependency、lockfile 或生產部署。
- **Risk accepted:** 在升級完成前，React `19.2.4` 仍可能受已提供嘅 CVE-2026-23870 影響；補償控制只降低暴露面，不能視為修補。

### Compensating Controls Checklist

- [ ] 確認 Vercel WAF 是否已啟用，並以 preview/staging 驗證規則不誤傷正常 POST。
- [ ] 為 Server Action 入口配置 per-IP、per-session、per-user rate limit；未配置前標記為 open risk。
- [ ] 為 POST request body 設定保守上限，並記錄拒絕率與合法請求影響。
- [ ] 啟用 bot challenge／managed challenge（只按風險路徑，不假設已啟用）。
- [ ] 建立 CPU、duration、5xx、health-check alert，並指定值班負責人。
- [ ] 演練 emergency disable affected Server Action 流程，確認可回滾。
- [ ] 完成 staging-only synthetic DoS regression test plan 及停止條件。

### Upgrade Trigger

以下任何一項出現，立即停止 deferred 狀態並進入 hotfix approval：

1. React advisory fixed version、Next.js advisory 或 Vercel security guidance 有更新。
2. 出現 Server Action 相關 CPU 飆升、duration 飆升、5xx、health-check failure 或服務無回應。
3. WAF、rate limit、body-size limit 或 bot challenge 無法驗證、失效或被繞過。
4. Review deadline 或 24 小時 maximum deferral window 到期。

### Emergency Response Steps

1. 由 incident commander 宣告 severity，保留 request、CPU、duration、5xx、health-check evidence。
2. 立即套用／收緊 WAF managed rule、rate limit、body-size limit；不可直接對 production 做攻擊測試。
3. 暫停或 disable 受影響 Server Action，改用安全 read-only／maintenance response。
4. 如仍不穩定，停止 promotion，回滾至最後已驗證嘅 patched deployment；不得為方便而重新部署已知 affected artifact。
5. 確認是否需要 rotate secrets／credentials，完成通知、事後檢討及 hotfix approval。

## Third-Step Patched Preview Status

- **Patched preview branch:** `security/react-nextjs-dos-patched-preview`, created from `security/react-nextjs-dos-assessment`.
- **Patched versions:** `next 16.4.2`, `react 19.2.6`, `react-dom 19.2.6`.
- **Direct React Server DOM dependencies:** none; none added.
- **Clean install:** `npm ci` passed and reified the clean dependency tree.
- **Lint:** passed.
- **Typecheck:** Not configured.
- **Existing tests:** stopped on failure. `data/questions/__tests__/summary-parity.test.mts` reports `ict 版本號對唔上` and asks to run `npm run gen:summary`. No generated data or business logic was changed.
- **QA:** not run after the required stop-on-failure gate.
- **Build:** not run after the required stop-on-failure gate.
- **Pending staging verification:** Vercel Preview deployment, founder Server Action smoke test, then controlled synthetic DoS regression test; production testing remains prohibited.
- **Approval status:** dependency patch is prepared but not accepted for promotion. The pre-existing test failure requires review and explicit approval before further validation.

## Fourth-Step Validation Status: Conditional Pass

- **Patched versions:** `react 19.2.6`, `react-dom 19.2.6`, `next 16.4.2`.
- **Completed checks:** clean `npm ci`, patched dependency inspection, `npm run lint`, and focused reproduction of the existing ICT parity failure.
- **Test blocker:** `data/questions/__tests__/summary-parity.test.mts` fails because `ict` is `2d7e827bdef14374` in the generated file but recalculates to `8474815423402f54`. The same generated value exists on `main`; no dependency causality found. See `react-nextjs-dos-test-blocker-analysis.md`.
- **Build:** `npm run build` started under Next 16.4.2 but exited 1 after approximately 68 seconds due to Node/V8 heap exhaustion. See `react-nextjs-dos-build-qa-evidence.md`.
- **QA:** Not run because the build failure triggered the stop gate.
- **Staging regression:** Procedure remains prepared only; no attack-shaped traffic was sent.
- **Next approval gate:** approve the minimal generated ICT version refresh after reviewing its diff; separately approve an adequately resourced build rerun and subsequent QA.
- **Production readiness:** This branch is **not ready for production merge**.

## Approval Gate

第四步已完成到 validation/documentation gate，但係 **Conditional Pass**。三個 blockers 係：

1. Existing `ict BANK_VERSION` parity test failure (present on `main`; approval required before regenerating metadata).
2. Production build failed with Node heap OOM; build evidence is incomplete until rerun with approved resources.
3. QA and staging DoS regression test remain unexecuted because the failure gate/build gate is open.

No assertion, fixture, business logic, student data, production deployment, or production attack test was changed or executed. Awaiting approval to address the generated ICT metadata and continue validation.
