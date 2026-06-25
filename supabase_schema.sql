-- DSE Level Up — cross-device progress sync schema (LOCKED DOWN to server-only).
-- =============================================================================
-- Architecture: Option 1 — Auth.js handles LOGIN; Supabase is the DATABASE ONLY.
-- The browser NEVER calls Supabase directly. Every read/write goes through the
-- Next.js route `/api/progress`, authenticated by the Auth.js session and executed
-- with the SERVICE_ROLE key. Row ownership is enforced IN that route (every query
-- is scoped to the signed-in user's id).
--
-- Identity = the Auth.js Google `sub` (a STRING, e.g. "10934..."), so `user_id` is
-- TEXT, not uuid. (If you ever migrate to Supabase Auth, switch to uuid + auth.uid().)
--
-- Run this ONCE in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- Safe to re-run: it drops the old per-user policies and re-applies the lockdown.

-- ── Table ────────────────────────────────────────────────────────────────────
create table if not exists public.user_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null unique,           -- Auth.js Google sub (string)
  progress_data jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

-- ── Lock it down: ONLY the server-side service_role may touch this table ──────
-- 1) Enable RLS. With RLS on and NO policy for anon/authenticated, those roles are
--    denied every row (RLS denies by default).
alter table public.user_progress enable row level security;

-- 2) Remove the table-level grants Supabase hands anon/authenticated by default, so
--    there is no direct external access path at all (徹底封鎖外部直接存取).
revoke all on public.user_progress from anon, authenticated, public;

-- 3) The service_role is the only allowed caller. It BYPASSES RLS, so this GRANT is
--    what actually matters. The policy below is belt-and-suspenders: it documents
--    "service_role full access" explicitly. (It's technically a no-op because the
--    role bypasses RLS — kept only to make the access model unmistakable.)
grant all on public.user_progress to service_role;

-- Drop any earlier per-user (Supabase-Auth-style) policies from the previous schema.
drop policy if exists "user_progress_select_own" on public.user_progress;
drop policy if exists "user_progress_insert_own" on public.user_progress;
drop policy if exists "user_progress_update_own" on public.user_progress;

drop policy if exists "service_role_full_access" on public.user_progress;
create policy "service_role_full_access"
  on public.user_progress
  for all
  to service_role
  using (true)
  with check (true);

-- ── Keep updated_at fresh on every update ────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_progress_touch on public.user_progress;
create trigger trg_user_progress_touch
  before update on public.user_progress
  for each row execute function public.touch_updated_at();

-- Result: anon/authenticated (the public anon key) → ZERO access. Only the Next.js
-- server route (service_role) can read/write, scoped per-user in code.
