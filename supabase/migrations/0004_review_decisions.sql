-- 0004: Admin 審核面板 decisions 表（2026-07-17）
--
-- /admin 面板將 Brian/Yuna 嘅逐題 A/R/P 決定記入呢張表；本地再用
-- scripts/qbank/pull-decisions.mjs 拉返落 repo 生成 <batch>.decisions.json，
-- 之後行返正常 promote-drafts.mjs 流程 —— 資料庫只係「傳送層」，
-- 入庫嘅唯一路徑仍然係本地 promote + 人手 wire + git push。
--
-- 刻意同原 spec 唔同嘅位（已向創辦人提報）：
--   • 冇 profiles.role 欄位 —— admin 身份由 ADMIN_EMAILS 環境變數判定，
--     唔重新引入 0003 已剷嘅 teacher 角色詞彙，資料庫亦唔使識別「邊個係admin」。
--   • decision 用全寫 approved/rejected/pending，同 promote-drafts 詞彙一致。
--   • 冇 promoted_at/promoted_by —— promote 發生喺本地，審計軌跡係
--     <科>-reviewed.ts 檔頭 + git 歷史；資料庫唔重複記錄，免兩處狀態分歧。

CREATE TABLE IF NOT EXISTS review_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch TEXT NOT NULL,           -- drafts 檔名（不含 .json），如 "chinese-fanwen-weak-84"
  draft_id TEXT NOT NULL,        -- 批次內題目 id，如 "econ-sd-mc-0"
  subject TEXT NOT NULL,
  topic TEXT,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'pending')),
  comment TEXT,
  reviewer_email TEXT NOT NULL,
  reviewer_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 同一題可以多次覆核（改主意）；pull 腳本取每 draft_id 最新一筆。
CREATE INDEX IF NOT EXISTS idx_review_decisions_batch
  ON review_decisions (batch, draft_id, created_at DESC);

-- 本 app 用 Auth.js（唔係 Supabase Auth）：瀏覽器從來唔會帶住用戶 JWT 直連
-- PostgREST，所有讀寫都經 server-only service role（繞過 RLS）。
-- 所以正確做法係開 RLS 而【零 policy】= anon/authenticated 全鎖死。
-- （原 spec 嘅 auth.jwt()->>'email' policy 假設咗 Supabase Auth，喺呢個 stack
--   永遠唔會 match —— 唔係加強保護，係死码。）
ALTER TABLE review_decisions ENABLE ROW LEVEL SECURITY;
