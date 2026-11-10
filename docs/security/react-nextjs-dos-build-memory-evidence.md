# React / Next.js Build Memory Evidence

- **Branch:** `security/react-nextjs-dos-patched-preview`
- **Commit:** `733a2fd` (`docs: record generated question bank diff`)
- **Node:** `v24.16.0`
- **npm:** `11.13.0`
- **Next.js:** `16.4.2`
- **React:** `19.2.6`
- **React DOM:** `19.2.6`
- **react-server-dom-webpack:** not declared/resolved
- **react-server-dom-turbopack:** not declared/resolved
- **react-server-dom-parcel:** not declared/resolved
- **Build command:** `npm run build` (`next build --webpack`)
- **NODE_OPTIONS:** `--max-old-space-size=8192` (temporary; not written to package.json)
- **Runner RAM:** `8,605,824 kB` reported by `/proc/meminfo` (~8.21 GiB)
- **Start:** `2026-11-03T07:50:06Z`
- **End:** `2026-11-03T07:51:21Z`
- **Duration:** 75 seconds
- **Exit code:** `137` (process killed by runner/kernel)
- **Build result:** failed
- **Warnings:** Next reported deprecated `preferredRegion` route segment config. No React/Next security warning was emitted before termination.

## Failure evidence

The build reached:

```text
▲ Next.js 16.4.2 (webpack)
Creating an optimized production build ...
⚠ The "preferredRegion" route segment config is deprecated.
```

The shell then reported:

```text
Killed                  NODE_OPTIONS="--max-old-space-size=8192" npm run build
EXIT_CODE=137
```

Kernel evidence at the same timestamp recorded `out_of_memory`, page allocation failure, and approximately 8.1 GiB inactive anonymous memory. This identifies a runner/kernel memory kill, not a JavaScript/V8 heap exception. No full JavaScript heap stack trace exists.

## Propagation assessment

`NODE_OPTIONS` was present on the `npm run build` child command and Next.js started with the requested memory setting. There is no independent worker diagnostic proving a separate build worker received the value; the process was killed before such telemetry could be captured. The available evidence is consistent with the parent build process or its worker group exceeding the runner/cgroup memory budget.

## Upgrade causality

No causal link to the React/Next.js security upgrade was demonstrated. The build used patched React `19.2.6` and existing Next `16.4.2`, reached webpack compilation, and was terminated by external memory pressure without a dependency-related compiler error.

## Next recommended action

Do not change application logic, tests, dependencies, or build flags in the repository. Re-run the unchanged commit on a build runner with materially more memory than the reported ~8.2 GiB (recommended minimum 16 GiB) and capture cgroup limits/events. Keep QA and staging regression blocked until that build succeeds. This branch is not safe to merge while the production build gate is failing.

## Remediation decision

- **Decision:** use a 16 GiB build runner; no repository workaround.
- **Approved by:** project owner via chat selection.
- **Decision date:** 2026-11-03 (HKT; exact approval timestamp is retained in chat history).
- **Current sandbox check:** still reports `MemTotal: 8605824 kB` (~8.21 GiB), so the selected 16 GiB runner has not been provisioned in this workspace.
- **Acceptance:** rerun the unchanged commit on the 16 GiB runner; record exit code, cgroup memory limit/events, and complete `npm run build` output. Only after a successful build should QA and staging regression resume.
