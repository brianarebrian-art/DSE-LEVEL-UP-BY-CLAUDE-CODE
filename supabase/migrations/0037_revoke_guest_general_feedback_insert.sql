-- 0037 —— 未登入唔可以再直接寫 general_feedback
--
-- 2026-11-20 創辦人：未用 Google／Supabase Auth 登入，唔准寫入
-- session_feedback、general_feedback、question_reports。
-- API 會先用 getSyncUserId() 回 401。本檔只收窄 general_feedback 嘅直接寫入：
-- 0036 曾 grant insert 畀 anon 同 authenticated，並開咗 with check (true) 嘅 policy。
-- anon key 係公開嘅，訪客可以繞過 /api/feedback-general 直接 insert。
--
-- session_feedback（0022）同 question_reports（0020）已經 revoke anon／authenticated，
-- 又冇 insert policy，所以呢度唔再改佢哋嘅權限。
--
-- 唔刪行、唔改欄、唔加 user_id。已存在嘅列全部保留。
-- 登入學生嘅寫入仍然經 service role API，列嘅形狀不變。
-- 呢份 migration 未套用到生產；要創辦人另外批准先可以 apply。

revoke insert on table public.general_feedback from anon;
revoke insert on table public.general_feedback from authenticated;

drop policy if exists general_feedback_insert on public.general_feedback;
