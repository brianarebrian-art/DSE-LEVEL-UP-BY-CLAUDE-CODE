# Teacher Radar — Foundation (Phase 0)

> Status: **Phase 0 shipped** (data model + roles + RLS + consent design + role helper + `/api/account/me`).
> Source spec: `claude_prompts_teacher_radar.txt` (26 prompts). This doc is the load-bearing
> foundation those prompts hang off — most of them were **blocked on infrastructure that did
> not exist**; Phase 0 builds that infrastructure honestly and safely.

## Why a foundation first

The deck's 26 prompts assume a teacher dashboard over per-student, per-class performance data.
Before Phase 0 the app had **none of it**:

- No teacher/student/admin **roles**, no teacher accounts, no classes, no rosters.
- **Student answers were never sent to the server per-question** — only one aggregate
  progress blob keyed to each user's own Google account (`user_progress`) is synced.

So there was no data source and no user model for any "radar", LO breakdown, blindspot,
careless-rate, or snapshot. Phase 0 creates the minimum correct substrate.

## The privacy invariant (non-negotiable)

> **Solo users stay 100% local-only. Server-side per-question rows (`question_events`) are
> written ONLY for a student who has joined a class AND whose enrollment
> `consent_status = 'granted'`.**

This confines minors' performance data to an explicit, consented teacher–class relationship.
Anonymous and solo-logged-in users are unaffected — their answers never leave the device
except as today's aggregate `user_progress` blob. Enforced in application code (the Phase 2
logging route), documented in the migration.

## Data model (`supabase/migrations/0002_teacher_radar.sql`)

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | one row per authenticated user; **role source of truth** | `user_id` (Google sub, PK), `role` ∈ {student,teacher,admin} default student |
| `classes` | a teacher's class; students join by code | `id`, `teacher_id`→profiles, `name`, `subject`, `join_code` (unique), `archived` |
| `enrollments` | student ↔ class link **with the consent gate** | `class_id`, `student_id`, `status`, `consent_status` ∈ {pending,granted,declined} |
| `question_events` | consent-gated, **minimised** per-question log | `student_id`, `subject`, `topic`, `question_id`, `difficulty`, `is_correct`, `self_diagnosed_cause` |

**Data minimisation:** `question_events` stores only subject/topic/question-id, correctness,
difficulty, and the student's own A/B/C self-diagnosed cause from the 60s lockout. No answer
text, no free input, no PII beyond the account key.

## Security model

- **RLS lockdown, identical to `user_progress`/`arenas`:** every table has RLS enabled, all
  grants revoked from `anon`/`authenticated`/`public`, and only `service_role` (server-only)
  may touch them. The browser never calls Supabase directly.
- **Authz enforced in-route** (service_role bypasses RLS, so the route is the gate — same
  pattern as `/api/progress`'s IDOR scoping): a teacher may read a student's events only when
  that student has a `granted` enrollment in a class the teacher **owns**.
- **Role elevation is admin-only, never self-serve.** A self-serve "I'm a teacher" flag would
  let anyone read class data. `getCurrentProfile()` auto-provisions `student`; teacher/admin is
  set out-of-band (admin route in a later phase, or manually in SQL for the first admin).
- **Fail-safe to least privilege:** `lib/auth/roles.ts` degrades to `student` on any infra
  error (env absent, table not migrated, query failure) — a failure can never grant elevation.

## Shipped in Phase 0

- `supabase/migrations/0002_teacher_radar.sql` — the 4 tables + RLS lockdown (**you run this
  once in Supabase SQL Editor**).
- `lib/auth/roles.ts` — `getCurrentProfile()`, `requireRole(min)`, auto-provision, fail-safe.
- `app/api/account/me/route.ts` — `GET → { authenticated, role }`; proves the role system
  end-to-end (returns `student` until an admin elevates you).

> ⚠️ Until you run `0002_teacher_radar.sql`, `/api/account/me` returns `role: 'student'` via
> the fail-safe path (no error surfaced to the user). Run it to activate the real profiles table.

## Staged roadmap (how the 26 prompts map on)

- **Phase 1 — Classes & consent (unblocks 001, 002):** teacher creates a class (`requireRole('teacher')`);
  student joins by code; consent flow sets `consent_status`. Routes: `/api/teacher/classes`,
  `/api/student/join`, `/api/enrollment/consent`. UI: join screen + consent screen.
- **Phase 2 — Consent-gated answer logging:** on quiz answer, if the student has a `granted`
  enrollment, POST a minimised `question_events` row. This is the data source everything else needs.
- **Phase 3 — Teacher read APIs + snapshots (unblocks 003, 006–019, 022, 026):** aggregate
  `question_events` → topic mastery / blindspots / careless-rate, scoped to owned+consented
  students. `class_daily_snapshots` + the cron (PROMPT 003) sit here.
- **Cross-cutting (do alongside the phase that first needs them):** 004 2FA — note the app uses
  Google OAuth, whose accounts already carry their own 2FA; a bespoke TOTP layer only makes
  sense if/when email-password teacher accounts exist. 005 audit_logs + 021 permission matrix
  land with Phase 3 (once there's privileged access to audit/test).

### Already done / already refused (unchanged by this foundation)

- **PROMPT 024 禁用詞** — ✅ live in `scripts/qbank/term-guard.mjs` (RED_WORDS), extended with
  差勁 / 無藥可救 / 冇得救.
- **PROMPT 017 關懷提醒** — ♻️ single-user version already live (ErrorDNA streak + EmotionTags).
- **PROMPT 018 「上年預測準確度 85%」** — ❌ refused: no real DSE-result cohort = fabricated stat.
- **PROMPT 026 出題頻率趨勢 (as specced)** — ❌ refused: mining HKEAA papers = copyright +
  unverifiable; only official syllabus weightings are safe to cite.

## Compliance note (PDPO)

Teacher Radar collects **minors' performance data** server-side once consented. Before any
Phase 2 rollout to real students, confirm: a privacy notice covering purpose/retention, a
consent record (the `consent_status` field is the technical hook — the human process must
back it), a data-processing understanding with each school, Supabase region disclosure, and a
self-serve deletion path (`DELETE` cascades are wired via `on delete cascade`, but a
user-facing deletion route is still needed — tracked with the security-audit finding D11-F01).
