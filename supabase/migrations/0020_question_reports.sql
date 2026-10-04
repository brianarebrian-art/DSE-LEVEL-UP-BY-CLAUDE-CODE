-- 0020 —— 題目問題報告（question_reports）
--
-- 依據：審計 #7（2026-10-04）建議報錯集中儲存；創辦人 2026-10-04 回覆 A7-2「A」，
-- 其後選定「a」：只存學生【揀】的內容（題號、問題類別），學生自己寫的描述不經本站，
-- 仍由學生自己的電郵寄出（憲章 §16.E 約束 5）。
--
-- ══════════════════════════════════════════════════════════════════
-- 本表【沒有】的欄位，與有的欄位同樣重要
-- ══════════════════════════════════════════════════════════════════
--
-- 沒有 user_id、ip_address、user_agent、email、自由文字。
-- 報告無法追溯到任何一個學生；用戶群為 12–18 歲，多一欄就多一樣可以外洩的東西。
--
-- 寫入：只經 app/api/report/route.ts（server-only service role）。
-- anon、authenticated 無任何權限，RLS 開啟且不設 policy（同 0018_revoke_anon_on_user_tables.sql）。
-- 查看及處理：創辦人在 Supabase SQL Editor 執行 docs/question-reports.md 的查詢。
--
-- category 的值必須與 lib/questionReport.ts 的 CATEGORIES 一致
-- （lib/__tests__/question-report.test.mts 把關）。

create table if not exists public.question_reports (
  id          bigint      generated always as identity primary key,
  created_at  timestamptz not null default timezone('utc', now()),
  question_id text        not null check (char_length(question_id) between 1 and 100),
  category    text        not null check (category in ('answer', 'explain', 'wording', 'display', 'scope', 'topic', 'copyright', 'other')),
  locale      text        not null check (locale in ('zh', 'en')),
  status      text        not null default 'open' check (status in ('open', 'fixed', 'rejected'))
);

alter table public.question_reports enable row level security;
revoke all on table public.question_reports from anon, authenticated;

create index if not exists question_reports_status_created_idx
  on public.question_reports (status, created_at desc);
