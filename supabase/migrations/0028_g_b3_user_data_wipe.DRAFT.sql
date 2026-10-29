-- G-B3 · Wipe user-scoped cloud data (DRAFT — do NOT apply until R4 checklist done)
-- Decision: docs/auth/G-AUTH-AND-DATA-RESET-DECISIONS-2026-10-29.md
-- Runbook: docs/auth/G-B3-WIPE-RUNBOOK-2026-10-29.md
--
-- BEFORE RUNNING:
--   1. Backup the five USER_SCOPED tables (and Better Auth tables if they exist)
--   2. Publish the student-facing announcement
--   3. Founder confirms in writing that R4 may proceed
--
-- CLEARS (user data only):
--   user_sessions, user_progress, user_settings, privacy_consents, profiles
--   + Better Auth session/account/verification/user IF those tables exist
--
-- NEVER TOUCHES:
--   questions, question_bank_versions, review_decisions,
--   question_reports, session_feedback, practice_counts,
--   curriculum / quality review tables

BEGIN;

-- Order: dependent BA tables first (if present), then app user tables.
DO $$
BEGIN
  IF to_regclass('public.session') IS NOT NULL THEN
    EXECUTE 'TRUNCATE TABLE public."session"';
  END IF;
  IF to_regclass('public.account') IS NOT NULL THEN
    EXECUTE 'TRUNCATE TABLE public."account"';
  END IF;
  IF to_regclass('public.verification') IS NOT NULL THEN
    EXECUTE 'TRUNCATE TABLE public."verification"';
  END IF;
  IF to_regclass('public.user') IS NOT NULL THEN
    EXECUTE 'TRUNCATE TABLE public."user" CASCADE';
  END IF;
END $$;

TRUNCATE TABLE public.user_sessions;
TRUNCATE TABLE public.user_progress;
TRUNCATE TABLE public.user_settings;
TRUNCATE TABLE public.privacy_consents;
TRUNCATE TABLE public.profiles;

COMMIT;

-- Post-check (run manually after commit):
-- SELECT COUNT(*) FROM public.user_progress;          -- expect 0
-- SELECT COUNT(*) FROM public.questions;              -- expect >> 0
