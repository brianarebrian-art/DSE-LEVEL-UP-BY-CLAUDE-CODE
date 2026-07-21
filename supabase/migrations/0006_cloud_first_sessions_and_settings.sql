-- 0006 — v8.0 CLOUD-FIRST：DB1 user_sessions + DB2 user_settings
-- 已於 2026-07-22 經 Supabase MCP apply_migration 套用到 aegekxapxgcfdrkzisis（生產）。
-- 創辦人 2026-07-22 拍板：架構轉 cloud-first，SEN 設定開獨立 user_settings 表。
--
-- 同 v8 原 spec 刻意唔同嘅四處（已提報，理由如下）：
--
--   1. answers 存【選項文字】唔存 correctIndex。
--      原 spec：`answers JSONB -- [null, 0, 2, 1, ...] correctIndex`
--      但本平台由 2026-06-18 起就係按選項文字批改（correctZh），因為選項每次
--      render 都 Fisher-Yates 洗牌。存 index 嘅話跨裝置續做會對到另一個選項 ——
--      唔會報錯，只會【靜默改錯卷】。故沿用已 shipped 嘅 ActiveSession 型別：
--      answers = [{ selectedZh, isCorrect } | null, ...]
--
--   2. user_settings 只用【真實存在】嘅 localStorage key。
--      原 spec §8.1 七行有三行嘅 key 喺 repo 唔存在：
--        dse_dark_mode ❌（全站 0 個 dark: utility，冇深色模式可 toggle）
--        dse_dyslexic_font ❌（實際係 dse_easy_font）
--        dse_focus_mode ❌（dse_focus_today 係番茄鐘計數，兩回事）
--
--   3. 冇 dark_mode 欄。v8 §5 自己禁「亮色模式切換（推翻 light-first）」，
--      再開一個乜都控制唔到嘅欄只會製造 schema 債。ThemeToggle 真正落地先加。
--
--   4. 冇新建 update_updated_at_column()。DB 已有 handle_updated_at，而原 spec
--      個新函數冇 SET search_path —— 正正係 security advisor 已經 flag 緊嘅問題，
--      照抄等於新增一個已知 advisory。updated_at 由 API route 明碼寫入。

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,          -- Auth.js Google `sub`，同 user_progress.user_id 一致
  device_id TEXT NOT NULL,        -- 隨機 UUID（localStorage），非瀏覽器指紋、不可反向識別
  session_id TEXT NOT NULL,       -- 每份練習卷一個

  subject_id TEXT,
  topic_filter TEXT,
  mode TEXT,                      -- 'normal' | 'weakness'
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,

  current_index INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,   -- 按【文字】錨定，見上面第 1 點
  time_spent INTEGER NOT NULL DEFAULT 0,
  error_dna JSONB NOT NULL DEFAULT '[]'::jsonb,

  last_modified TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_modified
  ON user_sessions (user_id, last_modified DESC);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,

  easy_font BOOLEAN NOT NULL DEFAULT false,          -- dse_easy_font
  reading_ruler BOOLEAN NOT NULL DEFAULT false,      -- dse_reading_ruler
  hide_timer BOOLEAN NOT NULL DEFAULT false,         -- dse_hide_timer
  calm_lock BOOLEAN NOT NULL DEFAULT false,          -- dse_calm_lock

  font_size INTEGER NOT NULL DEFAULT 16
    CHECK (font_size BETWEEN 12 AND 24),             -- dse_font_size
  line_height NUMERIC(2,1) NOT NULL DEFAULT 1.6
    CHECK (line_height BETWEEN 1.2 AND 2.0),         -- dse_line_height
  letter_spacing TEXT NOT NULL DEFAULT 'normal'
    CHECK (letter_spacing IN ('normal','wide','extra-wide')), -- dse_letter_spacing

  sensory_pref JSONB,                                -- dse_relax_sensory_pref
  locale TEXT CHECK (locale IN ('zh','en')),         -- dse_locale

  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 本 app 用 Auth.js（唔係 Supabase Auth）：瀏覽器從來唔會帶住用戶 JWT 直連
-- PostgREST，所有讀寫都經 server-only service role（繞過 RLS）。
-- 所以開 RLS 而【零 policy】= anon/authenticated 全鎖死；擁有權喺 route 內
-- 以 .eq('user_id', userId) 強制（同 user_progress / review_decisions 一致）。
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 套用後實測：
--   user_sessions  rls=true  policies=0  cols=14
--   user_settings  rls=true  policies=0  cols=11
--   user_progress  完全冇改動（rls=true policies=1 cols=6，24 行）
