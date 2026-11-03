# Test Blocker Analysis: `ict` BANK_VERSION

- **Date:** 2026-11-03
- **Branch:** `security/react-nextjs-dos-patched-preview`
- **Status:** Blocked; no test assertion, fixture, or generated data was changed.

## Full failing output

```text
✖ BANK_VERSION 同真題庫內容一致（同 sync-questions.mts 同一算法）
AssertionError [ERR_ASSERTION]: ict 版本號對唔上 ——跑 `npm run gen:summary` 重新產生
+ actual - expected
+ '2d7e827bdef14374'
- '8474815423402f54'
    at data/questions/__tests__/summary-parity.test.mts:72:12

ℹ tests 6
ℹ pass 5
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
```

## Root cause hypothesis

`data/questions/bank-versions.generated.ts` contains a stale generated hash for `ict`. The parity test recalculates the hash from the current bundled ICT question bank using `scripts/qbank/bank-version.mts`; the generated value is `2d7e827bdef14374`, while the current bank calculates as `8474815423402f54`.

## Evidence

- Failing assertion: `data/questions/__tests__/summary-parity.test.mts:68-72`.
- Generated source: `data/questions/bank-versions.generated.ts` contains `"ict": "2d7e827bdef14374"`.
- The test explicitly recommends `npm run gen:summary`.
- `git diff main...HEAD` contains only dependency manifests and security documentation; no question-bank source, test, fixture, or generated version file changed.
- `main` contains the same ICT value (`2d7e827bdef14374`), so the mismatch exists on `main` as well.
- The React 19.2.6 / Next 16.4.2 upgrade cannot explain a content hash mismatch; the test imports the question data and hash utility, not React or Next runtime code.

## Classification

- **Main branch:** Yes, reproducible from the same generated file and question-bank inputs.
- **Patched branch only:** No.
- **Caused by dependency upgrade:** No evidence; dependency diff is unrelated.
- **Fixture/environment issue:** Most likely stale generated artifact, not environment configuration.
- **Required data update:** Potentially yes: regenerate the version file only if review confirms the ICT bank source is authoritative and the resulting diff is limited to generated metadata.
- **Test runner update:** No evidence or requirement.

## Minimal fix proposal — approval required

Run `npm run gen:summary`, inspect the diff, and accept only the generated `ict` version change (plus any deterministic generated metadata required by that command). Then rerun the focused parity test and the full test suite. Do not edit the assertion, skip the test, or weaken the check.

## Risk of fix

Regenerating may reveal that the checked-in ICT bank and the intended cloud/Supabase bank are out of sync. Accepting a hash without confirming the authoritative source could make clients select an incorrect cloud copy. The command may also touch unrelated generated summaries; reject unrelated changes.

## Rollback plan

If review rejects the generated value or the focused/full tests expose further parity failures, revert only the generated-file commit. Keep the dependency hotfix isolated and do not promote it. Restore the prior patched dependency artifact only under the incident rollback approval; never knowingly promote an affected React version.

## Approval needed

Approval is required before running or committing `npm run gen:summary` output. Until then, the test blocker remains open and the branch is not safe to merge.
