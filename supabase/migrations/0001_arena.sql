-- DSE Level Up — Class Battle Arena schema (server-only, like user_progress).
-- =============================================================================
-- Run ONCE in the Supabase Dashboard → SQL Editor. Safe to re-run.
--
-- ADAPTED to this project's real architecture (the three-in-one spec assumed a
-- different stack):
--   • Identity is the Auth.js Google `sub` (a STRING), NOT Supabase auth.uid() — so
--     every user id column is TEXT and there is NO FK to auth.users.
--   • Questions live in static bundled TS with STRING ids (e.g. 'm2h_ve_1'), not a DB
--     table with UUIDs — so question refs are TEXT[], not UUID[].
--   • The browser never touches Supabase directly. All arena reads/writes go through
--     Next.js API routes with the service_role key (identity + room membership checked
--     in code). RLS therefore locks anon/authenticated out entirely (as user_progress).
--   • No WebSockets — the client polls the API routes for lobby/leaderboard updates.

-- ── Rooms ────────────────────────────────────────────────────────────────────
create table if not exists public.arenas (
  id                  uuid primary key default gen_random_uuid(),
  created_by          text not null,                 -- Auth.js Google sub of the host
  title               text not null,
  description         text,
  subject             text not null,                 -- matches a static subject id
  question_ids        text[] not null,               -- static question string ids (MC/text/long)
  time_limit_minutes  int  not null default 30,
  status              text not null default 'open'
                        check (status in ('open', 'active', 'closed')),
  invite_code         text not null unique,          -- short join code
  created_at          timestamptz not null default now(),
  closes_at           timestamptz
);

-- ── Participants ───────────────────────────────────────────────────────────────
create table if not exists public.arena_participants (
  id            uuid primary key default gen_random_uuid(),
  arena_id      uuid not null references public.arenas(id) on delete cascade,
  user_id       text not null,                       -- Auth.js Google sub
  display_name  text,
  joined_at     timestamptz not null default now(),
  started_at    timestamptz,                         -- set when the student presses "start"
  submitted_at  timestamptz,
  score         int not null default 0,              -- MC + self-assessed text only
  max_possible  int not null default 0,
  unique (arena_id, user_id)
);

-- ── Answers (isolated from personal practice data — never touches user_progress) ─
create table if not exists public.arena_answers (
  id            uuid primary key default gen_random_uuid(),
  arena_id      uuid not null references public.arenas(id) on delete cascade,
  user_id       text not null,                       -- Auth.js Google sub
  question_id   text not null,                       -- static question string id
  answer        text,                                -- MC option / text / long working
  is_correct    boolean,                             -- MC auto; text after self-mark; long = null
  earned_points int not null default 0,
  created_at    timestamptz not null default now(),
  unique (arena_id, user_id, question_id)
);

-- ── Indexes for the lobby + leaderboard queries ────────────────────────────────
create index if not exists idx_arenas_invite_code       on public.arenas (invite_code);
create index if not exists idx_participants_arena        on public.arena_participants (arena_id);
create index if not exists idx_participants_leaderboard  on public.arena_participants (arena_id, score desc, submitted_at);
create index if not exists idx_answers_arena_user        on public.arena_answers (arena_id, user_id);

-- ── Lock down: server-side service_role only (identical model to user_progress) ──
alter table public.arenas             enable row level security;
alter table public.arena_participants enable row level security;
alter table public.arena_answers      enable row level security;

revoke all on public.arenas             from anon, authenticated, public;
revoke all on public.arena_participants from anon, authenticated, public;
revoke all on public.arena_answers      from anon, authenticated, public;

grant all on public.arenas             to service_role;
grant all on public.arena_participants to service_role;
grant all on public.arena_answers      to service_role;

-- Belt-and-suspenders policies (service_role bypasses RLS; these document the model).
drop policy if exists "arena_service_all" on public.arenas;
create policy "arena_service_all" on public.arenas for all to service_role using (true) with check (true);
drop policy if exists "arena_participants_service_all" on public.arena_participants;
create policy "arena_participants_service_all" on public.arena_participants for all to service_role using (true) with check (true);
drop policy if exists "arena_answers_service_all" on public.arena_answers;
create policy "arena_answers_service_all" on public.arena_answers for all to service_role using (true) with check (true);
