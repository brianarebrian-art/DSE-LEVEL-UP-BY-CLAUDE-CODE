-- 0027 · Better Auth core tables (DRAFT — do NOT apply until founder R3 cutover)
--
-- Decision lock (2026-10-29, updated): G-A3 + G-B3 + S1
--   A3 = Better Auth with Google + email/password
--   B3 user wipe lives in 0028_g_b3_user_data_wipe.DRAFT.sql (R4) — NOT here.
--   After wipe, new progress still keys on Google `sub` via getSyncUserId.
--
-- This file only creates Better Auth's own tables. It does NOT:
--   - wipe or clear user_progress / user_settings / privacy_consents, etc.
--   - flip NEXT_PUBLIC_AUTH_BACKEND (that is a Vercel env change)
--   - store secrets
--
-- Apply only after: founder sets DATABASE_URL + BETTER_AUTH_SECRET +
-- NEXT_PUBLIC_AUTH_BACKEND=better-auth on Vercel, and reviews FLIP-TO-BETTER-AUTH.md.
-- Prefer reviewing this SQL in Supabase SQL editor, or:
--   npx @better-auth/cli generate/migrate --config lib/auth/better-auth.ts
-- Schema matches @better-auth/core getAuthTables({}) for the installed package.

create table if not exists public."user" (
  id text primary key,
  name text not null,
  email text not null unique,
  "emailVerified" boolean not null default false,
  image text,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null
);

create table if not exists public."session" (
  id text primary key,
  "expiresAt" timestamptz not null,
  token text not null unique,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references public."user" (id) on delete cascade
);

create index if not exists session_userId_idx on public."session" ("userId");

create table if not exists public."account" (
  id text primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references public."user" (id) on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  password text,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null
);

create index if not exists account_userId_idx on public."account" ("userId");

create table if not exists public."verification" (
  id text primary key,
  identifier text not null,
  value text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null
);

create index if not exists verification_identifier_idx on public."verification" (identifier);

-- App never uses Supabase Auth JWT for these tables; only service_role via server.
alter table public."user" enable row level security;
alter table public."session" enable row level security;
alter table public."account" enable row level security;
alter table public."verification" enable row level security;

revoke all on table public."user" from anon, authenticated;
revoke all on table public."session" from anon, authenticated;
revoke all on table public."account" from anon, authenticated;
revoke all on table public."verification" from anon, authenticated;
