-- 0023 —— 匿名練習計數（practice_counts）
--
-- 依據：創辦人回覆 40a（2026-10-08），docs/learning-loop-measurement-plan-2026-10-08.md 方案丙。
-- ⚠️ 未套用到正式資料庫：須創辦人另行批准（計劃書第七節第 1 點）。套用時須同日開啟
--    lib/practiceCount.ts 的 PRACTICE_COUNTS_ENABLED，並更新私隱頁。
--
-- 每日、每科、每種動作一行，只存累計數目，不存逐次紀錄：
--   started    一節練習開始；from_result = 由結果頁的再練連結開始
--   completed  一節練習完成；answered 累計該節題數
-- 沒有 user_id、ip_address、user_agent、email、時間（只有香港日期），無法還原任何一個人做過甚麼。
-- 寫入只經 app/api/practice-count/route.ts（server-only service role）呼叫 bump_practice_count；
-- anon、authenticated 對表及函數均無任何權限，RLS 開啟且不設 policy。
-- 值必須與 lib/practiceCount.ts 一致（lib/__tests__/practice-count.test.mts 把關）。

create table if not exists public.practice_counts (
  day          date    not null,
  subject      text    not null check (subject ~ '^[a-z0-9-]{1,40}$'),
  event        text    not null check (event in ('started', 'completed')),
  from_result  boolean not null default false,
  sessions     bigint  not null default 0 check (sessions >= 0),
  answered     bigint  not null default 0 check (answered >= 0),
  primary key (day, subject, event, from_result)
);

alter table public.practice_counts enable row level security;
revoke all on table public.practice_counts from anon, authenticated;

create or replace function public.bump_practice_count(
  p_subject     text,
  p_event       text,
  p_from_result boolean,
  p_answered    integer
) returns void
language sql
security invoker
set search_path = public
as $$
  insert into public.practice_counts as c (day, subject, event, from_result, sessions, answered)
  values ((now() at time zone 'Asia/Hong_Kong')::date, p_subject, p_event, p_from_result, 1, greatest(0, least(p_answered, 100)))
  on conflict (day, subject, event, from_result)
  do update set sessions = c.sessions + 1, answered = c.answered + excluded.answered;
$$;

revoke all on function public.bump_practice_count(text, text, boolean, integer) from public, anon, authenticated;
grant execute on function public.bump_practice_count(text, text, boolean, integer) to service_role;
