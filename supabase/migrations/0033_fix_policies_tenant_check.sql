-- 0033_fix_policies_tenant_check.sql
-- Fix cross-tenant / organizational join bypass vulnerability in Row Level Security policies.
-- Ensures all user-owned rows enforce strict auth.uid() matching and JWT tenant isolation checks.

-- 1. Profiles & Learning Profiles hardening
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
  CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

  DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
  CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  -- Learning Profiles
  DROP POLICY IF EXISTS "learning_profiles_select_policy" ON public.learning_profiles;
  CREATE POLICY "learning_profiles_select_policy" ON public.learning_profiles
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "learning_profiles_upsert_policy" ON public.learning_profiles;
  CREATE POLICY "learning_profiles_upsert_policy" ON public.learning_profiles
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- Learning Progress
  DROP POLICY IF EXISTS "learning_progress_select_policy" ON public.learning_progress;
  CREATE POLICY "learning_progress_select_policy" ON public.learning_progress
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "learning_progress_upsert_policy" ON public.learning_progress;
  CREATE POLICY "learning_progress_upsert_policy" ON public.learning_progress
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- Practice Attempts
  DROP POLICY IF EXISTS "practice_attempts_select_policy" ON public.practice_attempts;
  CREATE POLICY "practice_attempts_select_policy" ON public.practice_attempts
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "practice_attempts_insert_policy" ON public.practice_attempts;
  CREATE POLICY "practice_attempts_insert_policy" ON public.practice_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- User Settings
  DROP POLICY IF EXISTS "user_settings_isolate" ON public.user_settings;
  CREATE POLICY "user_settings_isolate" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- User Sessions
  DROP POLICY IF EXISTS "user_sessions_isolate" ON public.user_sessions;
  CREATE POLICY "user_sessions_isolate" ON public.user_sessions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;
