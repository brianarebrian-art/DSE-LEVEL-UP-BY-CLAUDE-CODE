# Data Model and Boundaries

**Last checked:** 2026-11-25. This describes the existing app and separately identifies a future measurement design that is not authorized or implemented.

## Existing question model

Defined in `data/questions/types.ts`:

- `MCQuestion`: stable item ID, subject/topic/framework labels, editorial difficulty, content/options, correct option index, explanation, optional per-option notes/true solution steps, and marks.
- `TextQuestion` / `LongQuestion`: prompt, reference answer, optional marking scheme/explanation and marks; returned to the student for self-assessment. These are not machine-graded, objective accuracy inputs, or grade prediction inputs.
- `Question` aliases `MCQuestion`; `AnyQuestion` is the MC/text/long union.

Generated and hand-authored sources are in `data/questions/`. Bank data is versioned in the repository; the project’s live question content is not a per-student row in Supabase.

## Existing student data and sync boundary

Client-side browser storage holds progress and active-session state. For signed-in users, server-side sync routes store the explicitly allowlisted payloads in the user’s own progress/settings records. `lib/cloudKeys.ts` is the shared key inventory; `app/api/progress/route.ts` validates/sanitizes the progress payload; `lib/sync.ts` is the client progress sync path; settings sync is separate.

The effective sync allowlist includes `dse_progress`, `dse_free_attempts_total`, `dse_topic_stats`, `dse_active_session`, `dse_reverse_log`, `dse_electives`, plus the settings listed in `lib/cloudKeys.ts`. The active session includes selected platform-provided answer options for cross-device continuity; reverse-log selections are also approved. User-authored text such as journal entries, time capsules, essays, mood notes and self-written encouragement is not included. Consult the source of truth and signed charter amendment for the exact current key boundary; do not maintain a second hand-edited allowlist.

All reads/writes must remain scoped to the authenticated user. These records are not accessible to teachers, administrators, other students or third parties, and are not used for cross-user rankings or classroom comparisons. This statement describes product policy; verify implementation/tests before any change.

## Data lifecycle and tests

- Active-session answers exist only while a session is unfinished; submit/abandon clears the active session according to `lib/sessionResume.ts`.
- Reverse-log is bounded by the existing code’s cap and is cleared on account deletion per product policy.
- Settings and progress sync are distinct channels and should both be reviewed when the disclosure changes.
- `CLOUD_PROGRESS_KEYS`, `CLOUD_SETTINGS_KEYS`, the progress endpoint allowlist, local data inspector, privacy page and regression tests must stay aligned.
- The signed `docs/charter-amendment-2026-09-08.md` explicitly supersedes the earlier blanket ban on syncing answer selections. The older [`2027-student-data-inventory.md`](./2027-student-data-inventory.md) is historical; its P0 language must not be interpreted as a current breach without a fresh source audit.

## Future calibration data — proposal only, not implemented

The current model has no empirical per-item success rate, benchmark-item link, participant consent record, or calibration cohort. Do not add these fields or a database table as part of routine question authoring.

If owners separately approve a student research/calibration study, first agree on consent/guardian/ethics requirements, retention, data access and deletion. Prefer a time-limited, pseudonymous response event with only the minimum needed fields: experiment/item version, selected answer, correctness, attempt validity, a coarse applicable subject/framework cohort, and a random study token. Do not include name, email, school/class, location, free-text answer, unrelated progress, diagnosis, or social profile. Keep identity linkage outside the analysis dataset, restrict access, set a deletion date, document the new processor/purpose/disclosure, and obtain approval for any new cloud key or table before migration. This proposal is not approval to collect data.
