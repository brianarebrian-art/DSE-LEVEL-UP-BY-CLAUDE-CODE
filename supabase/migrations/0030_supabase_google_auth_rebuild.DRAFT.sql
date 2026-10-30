-- 0030 DRAFT —— Supabase Auth Google 重建：legacy rename + 新學習表 + RLS
--
-- ⚠️ 檔名含 DRAFT：未經創辦人「批准發布」同 staging 驗收，禁止 apply 到 production。
-- 設計說明：docs/auth/SUPABASE-GOOGLE-REBUILD-DESIGN.md
--
-- 決策鎖定：
--   · 新身份 = auth.users.id (uuid)
--   · 舊 Google sub 經 auth_identity_map 遷移
--   · 舊 profiles → profiles_legacy；再建新 profiles
--   · deny-by-default RLS；anon 不可讀個人學習資料

BEGIN;

-- ══════════════════════════════════════════════════════════════════
-- 0. 擴展（若專案未開）
-- ══════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ══════════════════════════════════════════════════════════════════
-- 1. 舊 profiles → profiles_legacy
-- ══════════════════════════════════════════════════════════════════
-- 若已改名則跳過。CREATE 原始 profiles 可能喺 repo 外；改名前請先備份。
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL
     AND to_regclass('public.profiles_legacy') IS NULL THEN
    ALTER TABLE public.profiles RENAME TO profiles_legacy;
  END IF;
END $$;

-- Legacy：鎖死 client 存取（遷移只用 service_role）
DO $$
BEGIN
  IF to_regclass('public.profiles_legacy') IS NOT NULL THEN
    ALTER TABLE public.profiles_legacy ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON TABLE public.profiles_legacy FROM anon, authenticated;
  END IF;
END $$;

-- 舊 user_progress：保留作遷移來源；鎖死 client 寫入（若尚未 revoke）
DO $$
BEGIN
  IF to_regclass('public.user_progress') IS NOT NULL THEN
    ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON TABLE public.user_progress FROM anon, authenticated;
  END IF;
END $$;

-- ══════════════════════════════════════════════════════════════════
-- 2. auth_identity_map
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.auth_identity_map (
  legacy_google_sub text PRIMARY KEY
    CHECK (char_length(legacy_google_sub) BETWEEN 1 AND 128),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  migrated_at timestamptz,
  source text NOT NULL DEFAULT 'pending'
    CHECK (char_length(source) <= 64),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

COMMENT ON TABLE public.auth_identity_map IS
  'Maps legacy Auth.js Google sub (user_progress.user_id) to Supabase auth.users.id. Server/service_role only.';

ALTER TABLE public.auth_identity_map ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.auth_identity_map FROM anon, authenticated;
-- 無 policy = authenticated/anon 全拒；service_role bypass RLS

-- ══════════════════════════════════════════════════════════════════
-- 3. profiles（新）
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT profiles_display_name_len CHECK (
    display_name IS NULL OR char_length(display_name) <= 120
  ),
  CONSTRAINT profiles_email_len CHECK (
    email IS NULL OR char_length(email) <= 320
  ),
  CONSTRAINT profiles_avatar_url_len CHECK (
    avatar_url IS NULL OR char_length(avatar_url) <= 2048
  )
);

COMMENT ON TABLE public.profiles IS
  'App profile keyed by auth.users.id (Supabase Auth Google).';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ══════════════════════════════════════════════════════════════════
-- 4. learning_profiles
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.learning_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  target_subjects text[] NOT NULL DEFAULT '{}',
  weak_topics jsonb NOT NULL DEFAULT '{}'::jsonb,
  daily_goal_minutes integer
    CHECK (daily_goal_minutes IS NULL OR (daily_goal_minutes >= 0 AND daily_goal_minutes <= 24 * 60)),
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

COMMENT ON TABLE public.learning_profiles IS
  'Learning preferences / goals. No medical or SEN diagnostic labels.';

ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.learning_profiles FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.learning_profiles TO authenticated;

DROP POLICY IF EXISTS learning_profiles_select_own ON public.learning_profiles;
CREATE POLICY learning_profiles_select_own ON public.learning_profiles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS learning_profiles_insert_own ON public.learning_profiles;
CREATE POLICY learning_profiles_insert_own ON public.learning_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS learning_profiles_update_own ON public.learning_profiles;
CREATE POLICY learning_profiles_update_own ON public.learning_profiles
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ══════════════════════════════════════════════════════════════════
-- 5. learning_progress
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject_id text NOT NULL CHECK (char_length(subject_id) BETWEEN 1 AND 64),
  topic_id text CHECK (topic_id IS NULL OR char_length(topic_id) BETWEEN 1 AND 128),
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  correct_count integer NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_practiced_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT learning_progress_counts CHECK (correct_count <= attempt_count),
  CONSTRAINT learning_progress_unique UNIQUE (user_id, subject_id, topic_id)
);

CREATE INDEX IF NOT EXISTS learning_progress_user_subject_idx
  ON public.learning_progress (user_id, subject_id);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.learning_progress FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.learning_progress TO authenticated;

DROP POLICY IF EXISTS learning_progress_select_own ON public.learning_progress;
CREATE POLICY learning_progress_select_own ON public.learning_progress
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS learning_progress_insert_own ON public.learning_progress;
CREATE POLICY learning_progress_insert_own ON public.learning_progress
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS learning_progress_update_own ON public.learning_progress;
CREATE POLICY learning_progress_update_own ON public.learning_progress
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS learning_progress_delete_own ON public.learning_progress;
CREATE POLICY learning_progress_delete_own ON public.learning_progress
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ══════════════════════════════════════════════════════════════════
-- 6. practice_attempts
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.practice_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  question_id text NOT NULL CHECK (char_length(question_id) BETWEEN 1 AND 100),
  subject_id text NOT NULL CHECK (char_length(subject_id) BETWEEN 1 AND 64),
  topic_id text CHECK (topic_id IS NULL OR char_length(topic_id) BETWEEN 1 AND 128),
  is_correct boolean NOT NULL,
  elapsed_ms integer CHECK (elapsed_ms IS NULL OR (elapsed_ms >= 0 AND elapsed_ms <= 86400000)),
  difficulty text CHECK (difficulty IS NULL OR char_length(difficulty) <= 32),
  mistake_cause text CHECK (mistake_cause IS NULL OR char_length(mistake_cause) <= 8),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS practice_attempts_user_created_idx
  ON public.practice_attempts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS practice_attempts_question_idx
  ON public.practice_attempts (question_id);

ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.practice_attempts FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.practice_attempts TO authenticated;
-- 預設唔畀 UPDATE/DELETE 嘗試紀錄（append-only）；要擦除走 account deletion + service_role

DROP POLICY IF EXISTS practice_attempts_select_own ON public.practice_attempts;
CREATE POLICY practice_attempts_select_own ON public.practice_attempts
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS practice_attempts_insert_own ON public.practice_attempts;
CREATE POLICY practice_attempts_insert_own ON public.practice_attempts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ══════════════════════════════════════════════════════════════════
-- 7. 可選：新用戶自動建 profile（兜底；callback 仍應 upsert）
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.learning_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

COMMIT;

-- ── 手動驗收提示（唔會自動跑）──────────────────────────────────────
-- SET ROLE anon; SELECT * FROM profiles;              -- 應失敗／空權限
-- SET ROLE authenticated; -- 配 jwt claim sub = uid_A
-- SELECT * FROM learning_progress WHERE user_id = uid_B; -- 應 0 行
