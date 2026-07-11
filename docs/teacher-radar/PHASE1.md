# Teacher Radar — Phase 1 (classes + consent flow) + security reconciliation

> Status: **Phase 1 backend shipped & verified** (build green, authz gates curl-tested).
> UI (teacher dashboard + student join/consent screens) is **Phase 1b**, held until the
> migration is run so it can be tested against real data.
> Source specs: `teacher_radar_platform_security_audit.txt`, `teacher_radar_init.sql`,
> `security_audit_teacher_radar.json`, `security_snippets.ts`, `teacher_radar_quick_ref.txt`,
> `meeting_foundation_reality_check.txt`.

## Shipped this phase

| File | What |
|---|---|
| `app/api/admin/set-role/route.ts` | Admin-only role elevation — the ONLY path to teacher/admin |
| `app/api/teacher/classes/route.ts` | Teacher lists/creates own classes (scoped to `teacher_id = caller`) |
| `app/api/student/join/route.ts` | Any authed user joins by 6-char code; consent starts `pending` |
| `app/api/enrollment/consent/route.ts` | Student sets their OWN consent (`granted`/`declined`) |
| `lib/teacher/classes.ts` | `genJoinCode` (unambiguous alphabet) + create/list/join/setConsent |
| `lib/teacher/kAnonymity.ts` | small-class masking for Phase 3 snapshots |
| `lib/safeLog.ts` | prod-safe logging (message+code only) |
| `proxy.ts` | teacher/admin bucket 40/min/IP |
| `public/robots.txt` | also Disallow `/teacher/`, `/admin/` |

**Verified (curl, unauthenticated):** `/api/teacher/classes` + `/api/admin/set-role` → **403**;
`/api/student/join` + `/api/enrollment/consent` → **401**. k-anonymity: exact at ≥5, else 多數/少數/個別.

## Why the Kimi platform code was NOT copied verbatim

The deck's code targets a **Supabase-Auth** stack this app does not run. This app is
**Auth.js (Google OAuth, JWT)** with **server-only service_role** DB access.

| Kimi artefact | Problem | What I did instead |
|---|---|---|
| `teacher_radar_init.sql` — `auth.users(id)` FKs, `auth.uid()` RLS | `auth.uid()` is always NULL here (no Supabase Auth session); RLS on the anon path would imply client reads | `0002_teacher_radar.sql` keyed on Google `sub`, service_role-locked, **in-route** authz — supersedes it |
| routes using `@supabase/auth-helpers-nextjs`, `supabase.auth.getSession()`, `supabase.auth.admin.createUser()` | package not installed; wrong auth backend | `requireRole()` + `getServiceSupabase()`; teachers are Google accounts elevated via `profiles.role` |
| `middleware.ts` | Next 16 renamed it to `proxy.ts`, which exists; a 2nd file conflicts | folded teacher limits into `proxy.ts` |
| `teacher_profiles.class_ids JSONB` + `jsonb_array_elements_text` RLS | JSONB-array authz = the deck's own "JSONB injection" worry | relational `enrollments` table — the risk is **designed out** |

## Reconciliation of the Kimi 7-finding audit (`security_audit_teacher_radar.json`)

| # | Finding | Status on the real architecture |
|---|---|---|
| D02 CRITICAL | self-serve teacher registration | ✅ **closed by design** — elevation is admin-only (`/api/admin/set-role`, `requireRole('admin')`); default is `student`; first admin seeded once in SQL |
| D01 HIGH | teacher IDOR across classes | ✅ every query scoped to `teacher_id`/`student_id = caller`; unified 403; Phase 3 teacher→student reads will enforce ownership+consent in-route |
| D03 MEDIUM | small-class re-identification | ✅ **adopted** `lib/teacher/kAnonymity.ts` (applied in Phase 3 snapshots) |
| D04 MEDIUM | teacher-route rate limiting | ✅ **adopted** in `proxy.ts` (40/min/IP) |
| D06 MEDIUM | log leakage | ✅ **adopted** `lib/safeLog.ts`; retrofitted `/api/progress` |
| D05 MEDIUM | CSRF on teacher POST | ⚠️ **deferred, explained** — Auth.js JWT cookie is SameSite=Lax + JSON-only (no CORS allowance), so form-CSRF is already blocked; a bespoke double-submit token is the belt-and-suspenders upgrade, not required now |
| D07 LOW | JSONB injection | ✅ **N/A by design** — no JSONB-array authz; relational `enrollments` |

## Rejected/deferred UI note

The Kimi dashboard uses a neon cyberpunk palette (`#0a0a0f`/`#00F5D4`/`#FF006E`). Phase 1b will
use the app's existing slate dashboard styling — the dark-neon token set was vetoed site-wide
earlier (kept only inside the self-contained /relax zone). Flag if you want the neon look for the
teacher surface specifically.

## Phase 1b UI — DONE (render-verified; data states pending migration)

- `app/teacher/page.tsx` — teacher dashboard: create class + list classes with join codes;
  shows a sign-in card (unauthenticated) or a "not a teacher" card (403). Slate theme, **not** neon.
- `app/join/page.tsx` — student flow: enter 6-char code → plain-language **consent** screen
  (grant/decline, explains exactly what is shared) → confirmation.
- Verified in-browser: both render and degrade gracefully to the sign-in state while
  unauthenticated. The populated states (class list, real join+consent writes) light up once
  the migration is run and an account is elevated to `teacher`.
- Not yet wired into global nav (URL-reachable at `/teacher` and `/join`) — nav integration is
  cosmetic, deferred to avoid touching every page.

## Next

- **Phase 2:** consent-gated `question_events` logging (the data source).
- **Phase 3:** teacher read APIs + `class_daily_snapshots` + cron + audit_logs + permission matrix.
