-- DSE Level Up — Supabase security-linter fixes
-- =============================================================================
-- Run ONCE in the Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent and safe to re-run (ALTER / REVOKE are no-ops once applied).
--
-- Clears the 3 WARN-level findings from the Supabase database linter:
--   0011  function_search_path_mutable                      → public.handle_updated_at
--   0028  anon_security_definer_function_executable          → public.rls_auto_enable
--   0029  authenticated_security_definer_function_executable → public.rls_auto_enable
--
-- NOTE: neither function lives in this repo's supabase_schema.sql — they were created
-- directly in your Supabase project (handle_updated_at is typically the table-editor's
-- auto "updated_at" trigger; rls_auto_enable is an RLS automation). These statements
-- fix them in place by name; they do not drop or change what the functions DO.

-- ── Fix 0011: pin a fixed search_path on the updated_at trigger function ──────────
-- A mutable search_path lets a caller's path influence which objects an unqualified
-- name resolves to. A timestamp trigger only calls now() (in pg_catalog, always
-- available), so an EMPTY search_path is safe and closes the hole.
alter function public.handle_updated_at() set search_path = '';

-- ── Fix 0028 + 0029: stop exposing rls_auto_enable() over the public API ─────────-
-- It is a SECURITY DEFINER function that PostgREST currently exposes as an RPC
-- callable by anon AND authenticated (via /rest/v1/rpc/rls_auto_enable). It is an
-- internal automation and does not need to be callable from the public API.
-- Postgres grants EXECUTE to PUBLIC by default, and anon/authenticated inherit it —
-- so we revoke from PUBLIC as well as the two API roles.
--
-- ⚠️ Impact: if rls_auto_enable() is an EVENT-TRIGGER function (the usual case), it
-- keeps firing automatically — event triggers run as the owner regardless of these
-- grants. If some backend role is *meant* to call it directly, re-grant to that
-- specific role afterwards, e.g.  grant execute on function public.rls_auto_enable() to service_role;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Optional extra hardening (recommended for any SECURITY DEFINER function): also pin
-- its search_path. ⚠️ Only enable this if its body fully-qualifies object names; if it
-- relies on an unqualified path, set the schemas it needs instead. Inspect first with:
--   select pg_get_functiondef('public.rls_auto_enable()'::regprocedure);
-- alter function public.rls_auto_enable() set search_path = '';

-- ── Verify ───────────────────────────────────────────────────────────────────────
-- 1) search_path is now pinned on the trigger function (expects {search_path=}):
--   select proname, proconfig
--   from pg_proc
--   where proname in ('handle_updated_at','touch_updated_at') and pronamespace = 'public'::regnamespace;
--
-- 2) anon / authenticated can no longer execute the RPC (both expect FALSE):
--   select has_function_privilege('anon',          'public.rls_auto_enable()', 'execute') as anon_can,
--          has_function_privilege('authenticated',  'public.rls_auto_enable()', 'execute') as auth_can;
--
-- 3) Re-run the linter (Dashboard → Advisors → Security) — the 3 warnings should clear.
