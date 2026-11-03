# React / Next.js DoS Dependency Evidence

- **Branch:** `security/react-nextjs-dos-patched-preview`
- **Commit status:** dependency changes are uncommitted pending validation approval.
- **Captured:** 2026-11-03

## Before resolved versions

From `package-lock.json` before this branch change:

- `next`: `16.4.2`
- `react`: `19.2.4`
- `react-dom`: `19.2.4`
- Direct `react-server-dom-webpack`, `react-server-dom-turbopack`, and `react-server-dom-parcel`: not present.

## After resolved versions

`npm ls next react react-dom react-server-dom-webpack react-server-dom-turbopack react-server-dom-parcel --all`:

```text
next@16.4.2
react@19.2.6
react-dom@19.2.6
```

The React Server DOM package selectors were absent from the tree; no direct package was added.

## Lockfile diff summary

- `package.json`: `react` and `react-dom` changed from `19.2.4` to `19.2.6`.
- `package-lock.json`: matching root requirements, package entries, integrity hashes, and `react-dom` peer range updated.
- `next` remained `16.4.2`; no unrelated dependency was changed.

## Advisory status

| Advisory | Result |
| --- | --- |
| CVE-2026-23870 | React runtime resolved to `19.2.6`; supplied fixed-version requirement met. |
| CVE-2026-94482 | Next resolved to `16.4.2`; supplied minimum `>=16.4.1` met and supplied affected range avoided. |

## Validation status

- Clean `npm ci`: **pass**. `npm ci` removed the existing install tree as part of its clean reification.
- `npm run lint`: **pass**.
- `npm run typecheck`: **Not configured**.
- `npm run test`: **fail, stopped for approval**. Existing failure: `data/questions/__tests__/summary-parity.test.mts:1:2360`; `ict` `BANK_VERSION` mismatch, with the test instructing `npm run gen:summary`.
- `npm run qa`: **not run** after the required stop-on-failure gate.
- `npm run build`: **not run** after the required stop-on-failure gate.

No remediation was made for the pre-existing question-bank failure; it is outside the approved dependency-only hotfix scope.
