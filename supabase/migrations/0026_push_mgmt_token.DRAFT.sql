-- 0026 DRAFT —— push_subscriptions management token (hash only)
--
-- SEC-R1-001 / FIX-DSE-APP-001
-- STATUS: local draft only. Do NOT apply to production without founder approval.
-- Prerequisite: 0012_push_subscriptions.sql must exist / be applied first.
-- Rollback sketch: drop columns token_hash / token_rotated_at (destroys revoke state).
--
-- Why: knowing only `endpoint` must not authorize DELETE/rotate. The browser keeps
-- a CSPRNG management token; the server stores SHA-256(hex) only. No user_id.
--
-- Also keeps defence-in-depth with 0025 DRAFT (revoke anon/authenticated grants).

-- alter table public.push_subscriptions
--   add column if not exists token_hash text,
--   add column if not exists token_rotated_at timestamptz;

-- Existing rows (if any) cannot be managed without a token — clear them so the
-- app re-subscribes and issues fresh tokens. Safe only when founder confirms
-- no live push dependency, or after a coordinated client re-subscribe.
-- delete from public.push_subscriptions where token_hash is null;

-- alter table public.push_subscriptions
--   alter column token_hash set not null;

-- comment on column public.push_subscriptions.token_hash is
--   'SHA-256 hex of management token; plaintext never stored. SEC-R1-001.';
-- comment on column public.push_subscriptions.token_rotated_at is
--   'Last time a new management token hash was written.';
