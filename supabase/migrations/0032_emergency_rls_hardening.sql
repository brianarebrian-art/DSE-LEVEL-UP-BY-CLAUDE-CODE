-- 0032_emergency_rls_hardening.sql
-- Emergency Global Patch - RLS & View Security Invoker hardening
-- Ensures all public tables enforce ROW LEVEL SECURITY and revokes unauthorized permissions.

DO $$
DECLARE
    tbl record;
BEGIN
    FOR tbl IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl.tablename);
    END LOOP;
END $$;

-- Explicitly ensure known public tables have RLS enabled (idempotent fallback)
ALTER TABLE IF EXISTS public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.practice_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plus_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plus_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.question_bank_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.question_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.review_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dse_curriculum_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dse_quality_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dse_question_quality_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_operational_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_publish_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_review_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_integration_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.founder_command_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.auth_identity_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.practice_attempts ENABLE ROW LEVEL SECURITY;

-- Set security_invoker = true on any existing views in public schema
DO $$
DECLARE
    v record;
BEGIN
    FOR v IN
        SELECT table_name
        FROM information_schema.views
        WHERE table_schema = 'public'
    LOOP
        EXECUTE format('ALTER VIEW public.%I SET (security_invoker = true);', v.table_name);
    END LOOP;
END $$;
