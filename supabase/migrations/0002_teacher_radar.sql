-- DSE Level Up — Teacher Radar FOUNDATION (Phase 0 data model).
-- =============================================================================
-- Run ONCE in the Supabase Dashboard → SQL Editor → New query → Run. Idempotent.
--
-- ARCHITECTURE (same lockdown as user_progress / arenas): every table has RLS on and
-- ZERO policy for anon/authenticated → those roles are denied every row. The browser
-- NEVER touches these tables. All reads/writes go through Next.js server routes that
-- (a) authenticate via the session, (b) check the caller's ROLE, and (c) scope every
-- query to what that role may see. The service_role key (server-only) bypasses RLS.
--
-- ⚠️ PRIVACY INVARIANT (non-negotiable, enforced in application code — see
--    docs/teacher-radar/FOUNDATION.md): a student who is NOT enrolled in a class keeps
--    the existing LOCAL-ONLY behaviour — nothing about their answers is written here.
--    Server-side per-question rows (question_events) are written ONLY for a student who
--    has JOINED a class AND whose enrollment consent_status = 'granted'. This keeps the
--    solo/anonymous experience privacy-light and confines minors' performance data to
--    the explicit, consented teacher-class relationship.

-- ── 1) profiles — one row per authenticated user; the role source of truth ───────────
-- Identity = Auth.js Google `sub` (TEXT), same key as user_progress.user_id. Role is
-- 'student' by default; elevation to 'teacher'/'admin' is ADMIN-ONLY and never
-- self-serve (a self-serve teacher flag would let anyone read class data). A profile is
-- auto-provisioned as 'student' on a user's first authenticated request (see lib/auth/roles.ts).
create table if not exists public.profiles (
  user_id      text primary key,
  role         text not null default 'student' check (role in ('student','teacher','admin')),
  display_name text,
  created_at   timestamptz not null default now()
);

-- ── 2) classes — a teacher's class; students join via join_code ───────────────────────
create table if not exists public.classes (
  id         uuid primary key default gen_random_uuid(),
  teacher_id text not null references public.profiles(user_id) on delete cascade,
  name       text not null,
  subject    text,                                   -- optional subject focus (matches data/subjects ids)
  join_code  text not null unique,                   -- short opaque code a teacher shares; students enter it
  archived   boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_classes_teacher on public.classes(teacher_id);

-- ── 3) enrollments — student ↔ class link WITH the consent gate ───────────────────────
-- consent_status gates whether the teacher may see this student's data AND whether the
-- app logs question_events for them at all. Default 'pending' = joined but not yet
-- consented → NO data collected, NO teacher visibility, until it becomes 'granted'.
create table if not exists public.enrollments (
  id             uuid primary key default gen_random_uuid(),
  class_id       uuid not null references public.classes(id) on delete cascade,
  student_id     text not null references public.profiles(user_id) on delete cascade,
  status         text not null default 'active'  check (status in ('active','removed')),
  consent_status text not null default 'pending' check (consent_status in ('pending','granted','declined')),
  joined_at      timestamptz not null default now(),
  unique (class_id, student_id)
);
create index if not exists idx_enrollments_class    on public.enrollments(class_id);
create index if not exists idx_enrollments_student  on public.enrollments(student_id);

-- ── 4) question_events — the consent-gated, MINIMISED per-question log ────────────────
-- Data minimisation: stores only what a radar needs — subject/topic/question id,
-- correctness, difficulty, and the student's own self-diagnosed error cause (the A/B/C
-- from the 60s lockout). NO answer text, NO free input, NO PII beyond the student_id
-- (which is the account key, not a name). Written ONLY when the student has a 'granted'
-- enrollment (enforced in the logging route, Phase 2).
create table if not exists public.question_events (
  id                   uuid primary key default gen_random_uuid(),
  student_id           text not null references public.profiles(user_id) on delete cascade,
  subject              text not null,
  topic                text,
  question_id          text,
  difficulty           text check (difficulty in ('easy','medium','hard')),
  is_correct           boolean not null,
  self_diagnosed_cause text check (self_diagnosed_cause in ('concept','careless','misread')),
  created_at           timestamptz not null default now()
);
create index if not exists idx_qevents_student_time on public.question_events(student_id, created_at desc);
create index if not exists idx_qevents_subject_topic on public.question_events(subject, topic);

-- ── Lock every table to server-only (service_role); deny anon/authenticated entirely ──
do $$
declare t text;
begin
  foreach t in array array['profiles','classes','enrollments','question_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated, public', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('drop policy if exists %I on public.%I', t || '_service_all', t);
    execute format(
      'create policy %I on public.%I for all to service_role using (true) with check (true)',
      t || '_service_all', t
    );
  end loop;
end $$;

-- Result: the public anon key → ZERO access to any Teacher Radar table. Only the
-- Next.js server routes (service_role) can read/write, and they enforce role + class
-- ownership + consent in code. Solo users are unaffected — no enrollment, no events.
