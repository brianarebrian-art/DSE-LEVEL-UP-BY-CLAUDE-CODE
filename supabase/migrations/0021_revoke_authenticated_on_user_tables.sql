-- 0021 —— 收回 authenticated 角色對兩張用戶資料表的讀取權
--
-- 依據：審計 #8（2026-10-04）；創辦人同日回覆「2a」。
--
-- 2026-10-04 只讀核對 information_schema.role_table_grants：authenticated 在
-- review_decisions、user_settings 仍有 SELECT（0018 只收回了 anon）。
-- 兩表均開 RLS 且無 authenticated policy，實際讀出 0 行；本檔是多一層防護，
-- 令權限本身亦不存在。
--
-- 本站登入用 Auth.js，不用 Supabase Auth；所有用戶資料只經 server-only
-- service role 讀寫，所以 authenticated 角色無任何正當用途。

revoke all on table public.review_decisions from authenticated;
revoke all on table public.user_settings from authenticated;
