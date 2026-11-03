-- ============================================================================
-- 0032_security_baseline_audit_and_roles.sql
-- Milestone 1: Security Baseline Foundation (RLS, Audit Logging, Role Model)
-- ============================================================================

BEGIN;

-- 1. Profiles 表新增角色模型（預設為 student，向下相容）
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN role text NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'reviewer', 'admin', 'founder'));
      CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);
    END IF;
  END IF;
END $$;

-- 2. 建立不可篡改之安全審計日誌表 (audit_logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role text NOT NULL CHECK (actor_role IN ('student', 'reviewer', 'admin', 'founder', 'system')),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  ip_hash text NOT NULL,
  user_agent_hash text,
  metadata jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- 3. 嚴格鎖定 audit_logs：預設 Deny All，匿名與認證用戶不可直接讀寫
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.audit_logs FROM anon, authenticated, public;
GRANT ALL ON TABLE public.audit_logs TO service_role;

-- 4. 建立審計日誌時間戳與查詢索引
CREATE INDEX IF NOT EXISTS audit_logs_timestamp_idx ON public.audit_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON public.audit_logs (actor_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs (action, timestamp DESC);

COMMIT;
