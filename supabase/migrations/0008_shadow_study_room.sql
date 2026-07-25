-- 0008: 影子溫書室 Shadow Study Room — 匿名打氣互助牆（2026-07-25）
--
-- 一個 minor（12–18 歲 DSE 考生）面向嘅 UGC 打氣牆。因為對象係未成年，安全設計
-- 覆蓋一切「夠用就好」的方便：
--
-- 刻意同原 spec 唔同嘅位（已向創辦人提報，見對話紅線討論）：
--   • 冇 auto-publish —— 原 spec §5.1「confidence 0.95→即時公開/零真人」被否決。
--     所有帖一律 status='pending'，真人 approve 先出街。AI 只可以做 queue 排序助手，
--     永遠唔係出街嗰道閘（minor UGC 唔可以靠 model 一句判斷就放行）。
--   • 冇 ai_sentiment / ai_flags / self_harm 欄 —— 原 spec §5.2/§6 要求把「self_harm」
--     等精神健康 label 綁 user_id 存落 DB 被否決（存未成年精神健康 PII = 責任 + 風險）。
--     危機支援嘅唯一做法係：頁面【永遠置頂】公開熱線卡（撒瑪利亞會 2896 0000 /
--     生命熱線 2382 0000），唔靠自動偵測、唔存、唔 label、唔自動 hide 帖。
--   • user_id 係 Auth.js 嘅 Google `sub`（TEXT），唔係 auth.users FK —— 本 app 用
--     Auth.js（唔係 Supabase Auth），auth.users 唔係身份來源。留 user_id 只為
--     問責/防濫用（封累犯、刪帖、限每人 pending 上限），顯示層永遠只見匿名 author_hash。
--   • status 只有 pending/approved/rejected（冇 'hidden'）—— rejected 已涵蓋；狀態越少越清。
--
-- RLS：跟全站慣例（見 0004）—— 本 app 瀏覽器從不帶 JWT 直連 PostgREST，所有讀寫
-- 都經 server-only service role（繞過 RLS）。所以開 RLS + 【零 policy】= anon/authenticated
-- 全鎖死，係正確做法（Supabase Auth 式 policy 喺呢個 stack 永遠唔 match = 死码）。

CREATE TABLE IF NOT EXISTS wall_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,                       -- Auth.js Google sub（問責用，永不顯示）
  author_hash   TEXT NOT NULL,                       -- 發帖當日鹽值哈希，存落 row 令舊帖顯示一致
  content       TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  tags          TEXT[] NOT NULL DEFAULT '{}',        -- 穩定 tag key（'night'|'win'|'sos'|'growth'|'support'）
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  likes_count   INT NOT NULL DEFAULT 0,
  moderator_email TEXT,                              -- approve/reject 嘅真人（取自 session，唔信 client）
  moderator_note  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at  TIMESTAMPTZ
);

-- Feed：只出 approved，最新在前。
CREATE INDEX IF NOT EXISTS idx_wall_posts_feed
  ON wall_posts (status, created_at DESC);
-- 「我發過嘅帖」+ 每人 pending 上限檢查。
CREATE INDEX IF NOT EXISTS idx_wall_posts_user
  ON wall_posts (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS wall_likes (
  post_id    UUID NOT NULL REFERENCES wall_posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE wall_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_likes ENABLE ROW LEVEL SECURITY;
