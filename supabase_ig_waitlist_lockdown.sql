-- DSE Level Up — ig_group_waitlist table + server-only lockdown.
-- =============================================================================
-- Run ONCE in the Supabase Dashboard → SQL Editor → New query → Run.
-- Supersedes the bare `create table` handed out with the IG Group spec: it adds the
-- SAME RLS lockdown as user_progress / arenas, so the anon public API key has ZERO
-- access and only the Next.js server route (/api/ig-waitlist, service_role) can write.
-- Idempotent — safe to re-run.

-- ── Table ────────────────────────────────────────────────────────────────────
create table if not exists public.ig_group_waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,               -- indexed by UNIQUE → no timing leak
  created_at timestamptz not null default now(),
  notified   boolean not null default false
);

-- ── Lock it down: ONLY the server-side service_role may touch this table ──────
-- RLS on + no anon/authenticated policy = those roles are denied every row.
alter table public.ig_group_waitlist enable row level security;

-- Remove the default table grants Supabase hands anon/authenticated, so there is no
-- direct external access path to the collected emails at all.
revoke all on public.ig_group_waitlist from anon, authenticated, public;

-- service_role bypasses RLS; this GRANT is what actually matters. The policy below
-- documents the model explicitly (belt-and-suspenders; technically a no-op).
grant all on public.ig_group_waitlist to service_role;

drop policy if exists "ig_waitlist_service_all" on public.ig_group_waitlist;
create policy "ig_waitlist_service_all"
  on public.ig_group_waitlist
  for all
  to service_role
  using (true)
  with check (true);

-- Result: the public anon key → ZERO access to the waitlist emails. Only the
-- /api/ig-waitlist route (service_role) can insert, and it validates the email first.
