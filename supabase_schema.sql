-- DSE Level Up — cross-device progress sync schema.
-- Run this ONCE in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- This project keeps Auth.js for login (Option 1); Supabase is the database only.
-- The app writes exclusively through a server route using the service-role key,
-- which BYPASSES RLS — row ownership is enforced in that route (it only ever
-- touches `where user_id = <the Auth.js user id>`).

-- ── Table ────────────────────────────────────────────────────────────────────
-- NOTE: user_id is TEXT, not uuid. Our identity is the Auth.js Google `sub`
-- (e.g. "10934...") which is NOT a uuid. If you later migrate to Supabase Auth,
-- switch this to uuid and key it by auth.uid().
create table if not exists public.user_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null unique,
  progress_data jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Enabling RLS with NO policy for the anon/public role means the public anon key
-- cannot read or write this table AT ALL — only the server route (service role,
-- which bypasses RLS) can. That is the core protection for Option 1.
alter table public.user_progress enable row level security;

-- The policies below scope access to a user's own row. They take effect only if
-- you later authenticate users directly to Supabase (Supabase Auth); under the
-- current service-role server route they are bypassed but harmless to keep.
drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own"
  on public.user_progress for select
  to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own"
  on public.user_progress for insert
  to authenticated
  with check (auth.uid()::text = user_id);

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own"
  on public.user_progress for update
  to authenticated
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

-- Keep updated_at fresh on every write (the server route also sets it explicitly).
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
