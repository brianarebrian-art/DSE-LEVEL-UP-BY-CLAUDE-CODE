-- 0022 —— 完卷意見（session_feedback）
--
-- 依據：審計 #8（2026-10-04）；創辦人回覆「5a」，草稿回覆「5 ok」。
-- 做完一節 10 題後，結果頁問兩條（可以不答）：
--   had_error   「呢 10 題入面，你覺得有冇題目出錯？」   冇／有／唔肯定
--   will_return 「下次溫書，你會唔會再用呢度？」         會／唔會／未知
-- 答案一律存為 yes / no / unsure。
--
-- 沒有 user_id、ip_address、user_agent、email、自由文字；每次撳掣一行，兩條答案互不相連。
-- 寫入只經 app/api/feedback/route.ts（server-only service role）；anon、authenticated
-- 無任何權限，RLS 開啟且不設 policy。值必須與 lib/sessionFeedback.ts 一致
-- （lib/__tests__/session-feedback.test.mts 把關）。

create table if not exists public.session_feedback (
  id          bigint      generated always as identity primary key,
  created_at  timestamptz not null default timezone('utc', now()),
  subject     text        not null check (subject ~ '^[a-z0-9-]{1,40}$'),
  question    text        not null check (question in ('had_error', 'will_return')),
  answer      text        not null check (answer in ('yes', 'no', 'unsure')),
  locale      text        not null check (locale in ('zh', 'en'))
);

alter table public.session_feedback enable row level security;
revoke all on table public.session_feedback from anon, authenticated;

create index if not exists session_feedback_created_idx
  on public.session_feedback (created_at desc);
