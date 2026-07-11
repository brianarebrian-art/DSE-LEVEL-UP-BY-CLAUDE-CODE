# LHYMSS teacher onboarding + account deletion

> Source spec: `/TEACHERRADAR-LHYMSS-NAV`. Supersedes the earlier auto-verification spec
> (quiz "consistency" tracks + Resend + Supabase Auth), which stays **refused** — see
> `docs/teacher-radar/VERIFICATION-REFUSAL` note below.

## What shipped (build green, verified)

- `lib/lhymss-verification.ts` — pure classification from the Google-verified email:
  `@lhymss.net` + no digit in local part → **teacher**; + digit → **student**; else **external**.
  Case-insensitive. Verified: `abc@lhymss.net`→teacher, `s12345678@lhymss.net`→student,
  `math01@lhymss.net`→student, `someone@gmail.com`→external.
- `lib/auth/server.ts` — `getSyncUserEmail()` (both auth backends).
- `lib/auth/roles.ts` — first-visit provisioning now derives the initial role from the school
  email. **An existing DB row stays authoritative**, so an admin `set-role` promote/demote
  overrides the heuristic and sticks.
- `components/Navbar.tsx` — "老師專區" button, **left of 科目**, year-friendly (larger text,
  high-contrast amber, text-only, no icon). Shown only for LHYMSS teacher-signal accounts;
  hidden for everyone else (verified hidden while logged out).
- `app/teacher/page.tsx` — LHYMSS **students** get a gentle "呢度係老師專區 → 去練習區" card
  instead of a bare 403.
- `app/api/account/delete/route.ts` + `app/account/page.tsx` — **PDPO one-click erasure**
  (deletes the caller's `user_progress` + `profiles` row, which cascades their classes /
  enrollments / question_events; clears local data). Verified: 401 unauthenticated, requires
  `{ confirm: true }`. Also closes the earlier security-audit finding D11-F01.

## Security caveat (documented, not silently accepted)

The "no digit = teacher" rule is the **school's naming convention**, not a proven boundary.
The one dangerous misclassification is a `@lhymss.net` student with a no-digit email → seen as
teacher. Contained by: (1) the DB role is authoritative after provisioning, so an admin can
demote via `set-role`; (2) the teacher role exposes **no** student data until a student joins
that teacher's class **and grants consent** (Phase 2/3). **The school must confirm students
always carry a digit** for the auto-teacher path to be safe. Founder edge cases (a teacher
whose email has a digit) → `set-role`, or the empty `TEACHER_WHITELIST` in the helper.

## Not built (and why)

- **Neon palette** (#00F5D4/#FF006E/#FEE440) — vetoed site-wide; used the app's slate theme.
- **Quiz "consistency" verification / invite codes / Resend / Supabase Auth** (previous spec) —
  refused: AI-answerable quiz as a gate to minors' data = false confidence; invite chains =
  unaccountable delegation; Resend = needless new PII processor; this app is Auth.js, not
  Supabase Auth. The LHYMSS domain signal replaces all of it at $0 with zero new PII.

## Requires the operator

- Run `supabase/migrations/0002_teacher_radar.sql` (+ seed first admin) — until then role
  resolution fail-safes to `student` and `/teacher` returns 403 for everyone.
