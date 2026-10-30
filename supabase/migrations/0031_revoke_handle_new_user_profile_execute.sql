-- 0031 —— Revoke public EXECUTE on handle_new_user_profile (trigger-only)
-- Applied to production 2026-10-30 with 批准發布.
-- Advisor: anon/authenticated must not call this SECURITY DEFINER via PostgREST RPC.

REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_profile() TO postgres, service_role;
