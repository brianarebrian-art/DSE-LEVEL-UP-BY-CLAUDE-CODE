-- 0026 DRAFT: push endpoint management tokens and compare-and-set bookkeeping.
-- Local draft only; do not apply without explicit schema-migration approval.
-- Additive to the existing push_subscriptions table; existing subscriptions remain
-- untouched and NULL management tokens are never auto-claimed by endpoint alone.

create table if not exists public.push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  last_ok_at timestamptz,
  fail_count smallint not null default 0
);

alter table public.push_subscriptions
  add column if not exists management_token_hash text,
  add column if not exists version bigint not null default 1;

alter table public.push_subscriptions enable row level security;
revoke all on table public.push_subscriptions from public, anon, authenticated;
grant select, insert, update, delete on table public.push_subscriptions to service_role;

comment on column public.push_subscriptions.management_token_hash is
  'SHA-256 digest of a server-generated 256-bit opaque management token; NULL means legacy and is not claimable through endpoint or endpoint keys alone. The user can disable local notifications, and a stale row is pruned only after the push provider confirms 404/410.';
comment on column public.push_subscriptions.version is
  'Compare-and-set generation for ownership updates and cron delivery bookkeeping.';
