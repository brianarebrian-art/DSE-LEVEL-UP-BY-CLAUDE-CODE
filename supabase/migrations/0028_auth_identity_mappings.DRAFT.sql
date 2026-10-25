-- DRAFT ONLY — not applied. Add stable, traceable identity-to-business-user mappings.
-- No email, OAuth token, session or provider secret is stored here.
-- Legacy Auth.js Google business user_id is the verified Google `sub`; new
-- Better Auth user ids and explicitly linked Google subjects map to that same key.

create table if not exists public.auth_identity_mappings (
  provider          text        not null check (provider in ('better_auth_user', 'google')),
  provider_subject  text        not null,
  user_id           text        not null,
  mapping_method    text        not null check (mapping_method in ('better_auth_user_id', 'verified_google_subject')),
  created_at        timestamptz not null default timezone('utc', now()),
  constraint auth_identity_mappings_provider_subject_unique unique (provider, provider_subject)
);

create index if not exists auth_identity_mappings_user_id_idx
  on public.auth_identity_mappings (user_id);

comment on table public.auth_identity_mappings is
  'Verified Better Auth/Google identity subjects mapped to the stable business user_id. No email-based matching; collisions fail closed.';
comment on column public.auth_identity_mappings.provider_subject is
  'Better Auth internal user id or verified Google subject; never an email address or credential.';

alter table public.auth_identity_mappings enable row level security;
revoke all on public.auth_identity_mappings from public, anon, authenticated;
grant select, insert, delete on public.auth_identity_mappings to service_role;

-- Applying this draft requires a separate approved migration window. Do not backfill
-- from production in this task. First authenticated Better Auth requests create
-- mappings through lib/auth/identityMapping.ts; existing Auth.js rows remain untouched.
