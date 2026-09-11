-- 0018: 重建 user_sessions（2026-09-11）
--
-- ⚠️ 呢張表曾經存在，並且喺 2026-08-20 由 0010_drop_user_sessions.sql 刪走。
--    重建唔係「唔知佢刪過」——  0010 嘅三個理由逐條回應如下：
--
--      0010 理由①「0 行，從未寫入」      → 正正係本 migration 要修嘅嘢：
--                                          今次同時接線（app/api/sync/session）
--      0010 理由②「唯一寫入端點零呼叫」  → 同上；新端點由 SyncProvider 實際呼叫
--      0010 理由③「設計已被 lib/studyTime.ts 取代」
--                                        → 嗰句講嘅係【溫習時長分析】，
--                                          由 dse_progress 嘅 elapsed 算得到。
--                                          今次嘅用途唔同：要量【開咗 app 但一題都冇做】，
--                                          而嗰批人喺 dse_progress 入面冇任何一節，
--                                          所以 studyTime 嗰條路由定義上覆蓋唔到。
--
-- 決策：2026-09-11 目標書階段二「補齊 user_sessions 前端靜態寫入，
--       消滅『未做題即流失』嘅數據黑洞」。
--
-- ══ schema 刻意做到最細 ══
-- 一個用戶一日最多一行。冇 IP、冇 user agent、冇頁面路徑、冇逐次到訪紀錄。
-- 客戶端【唔會送任何資料上嚟】—— user_id 由 server session 解出，
-- day 由 server 時鐘決定。即係話呢張表冇任何一個欄位係客戶端可以注入嘅。
--
-- ⚠️ 只記錄【已登入】用戶。匿名訪客唔追蹤 —— 嗰個屬新增採集（對象係
--    12–18 歲未成年人），需要創辦人另行裁決，不在本 migration 範圍。
--
-- 憲章對照：
--   §3    寫入僅經 server-only getServiceSupabase()；RLS 開、零 policy
--   §16.E 約束 7：question_events 維持刪除 —— 本表【冇】question_id 欄，
--         亦永遠唔准加。逐題答題紀錄同本表係兩回事。
--   PDPO  已加入 lib/privacy/userData.ts 之 USER_SCOPED_TABLES，刪帳號會清走。
--         （lib/__tests__/user-data-erasure.test.mts 會掃 migration 核實。）

CREATE TABLE IF NOT EXISTS user_sessions (
  user_id    text        NOT NULL,
  day        date        NOT NULL,
  first_seen timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);

-- 留存查詢一定係「某用戶有邊幾日」，所以索引跟主鍵次序已經夠用；
-- 另加一個 day 索引畀「某日有幾多人開過」呢類匯總。
CREATE INDEX IF NOT EXISTS idx_user_sessions_day ON user_sessions (day DESC);

-- RLS 開、零 policy —— 同 user_progress 一致：只有 service role（server-only）
-- 掂得到。
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- ⚠️ RLS 唔夠。Supabase 有 ALTER DEFAULT PRIVILEGES，新表會自動畀齊 anon
--    全套 DML —— 呢點喺 0016 原稿寫錯過，0017 檔頭實測捉返。
--    所以一定要【顯式 revoke】，唔可以靠「冇 grant 就等於冇權」。
--    兩層（RLS ＋ revoke）各自獨立成立。
REVOKE ALL ON TABLE user_sessions FROM anon;
REVOKE ALL ON TABLE user_sessions FROM authenticated;
