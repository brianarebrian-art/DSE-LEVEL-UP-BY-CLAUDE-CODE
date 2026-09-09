-- 0018 —— 收回 anon 喺兩張用戶資料表嘅全套 DML（2026-09-08）
--
-- 背景：0016 個原稿假設咗「唔 grant 就等於冇權限」，實測係錯 —— Supabase 有
-- `ALTER DEFAULT PRIVILEGES`，新表自動畀齊 anon 全套 DML。0017 已經為
-- `questions` / `question_bank_versions` 顯式 revoke，但當時冇一併處理呢兩張。
--
-- 2026-09-08 逐張實測（admin 身份）：
--
--   表                anon SELECT/INSERT/UPDATE/DELETE   RLS   policies
--   review_decisions  全部 true                          on    0
--   user_settings     全部 true                          on    0
--
-- RLS 開咗但零 policy＝deny-all，所以【今日係擋得住嘅】—— 我用 anon 身份實測過，
-- 讀 0 行、寫全擋、冇留低任何探測列。但擋住佢嘅只有 RLS 一層；grant 仲喺度，
-- 即係話任何人（包括未來嘅自己）為咗 debug 而 `disable row level security`
-- 一次，兩張表就即刻全開。
--
-- 呢兩張表入面有咩：
--   review_decisions —— reviewer_email / reviewer_name（真人電郵，全 DB 最敏感嗰批）
--   user_settings    —— user_id ＋ 無障礙偏好（易讀字體、閱讀尺⋯＝可推斷 SEN 狀態）
--
-- 收窄唔會整爛任何嘢（執行前逐條核實）：
--   · user_settings    只經 app/api/sync/settings/route.ts 寫入 → service_role
--   · review_decisions 只經 app/api/admin/route.ts ＋ app/admin/page.tsx（server
--                      component，用 node:fs）＋ scripts/qbank/pull-decisions.mjs
--                      （明文用 SUPABASE_SERVICE_ROLE_KEY）
--   · NEXT_PUBLIC_SUPABASE_ANON_KEY 全 repo 只出現喺 lib/questionCloud.ts
--     ——【只掂題庫兩張表】，符合憲章 §3.1 約束 1
--   · service_role 完全繞過 grant 同 RLS，所以以上三條路徑一律不受影響
--
-- 憲章依據：§3.1 約束 1「任何用戶數據一律維持 server-only」。

revoke select, insert, update, delete, truncate, references, trigger
  on public.review_decisions from anon;

revoke insert, update, delete, truncate, references, trigger
  on public.review_decisions from authenticated;

revoke select, insert, update, delete, truncate, references, trigger
  on public.user_settings from anon;

revoke insert, update, delete, truncate, references, trigger
  on public.user_settings from authenticated;
