-- 0029 —— 產品分析事件 + 題目回報 triage 擴充 + 題目修訂版本史
--
-- 設計原則（未成年人優先）：
-- · analytics_events 唔存完整 email、密碼、token、題目全文、學校／姓名
-- · 寫入只經 server service_role（RLS ON、零 policy、revoke anon/authenticated）
-- · question_reports 仍然【唔】由學生提交自由文字（憲章 §16.E）；本 migration 只加 admin 營運欄
-- · AI 草稿必須進入 human_review，唔可以直接當已審核教材

-- ══════════════════════════════════════════════════════════════════
-- 1. analytics_events
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.analytics_events (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default timezone('utc', now()),
  event_name      text not null
    check (char_length(event_name) between 1 and 64),
  -- 登入用戶用 sync user id；未登入用本機匿名 id（hash 後亦可）。兩者都唔係 email。
  subject_key     text
    check (subject_key is null or char_length(subject_key) between 1 and 128),
  anonymous_id    text
    check (anonymous_id is null or char_length(anonymous_id) between 8 and 64),
  platform        text not null default 'web'
    check (platform in ('web', 'unknown')),
  app_version     text
    check (app_version is null or char_length(app_version) <= 32),
  -- 已驗證白名單欄位嘅 JSON；server 會再 scrub
  payload         jsonb not null default '{}'::jsonb,
  constraint analytics_events_actor_present check (
    subject_key is not null or anonymous_id is not null
  )
);

comment on table public.analytics_events is
  'Privacy-minimised product events. No PII. Server insert only.';

create index if not exists analytics_events_name_created_idx
  on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_payload_subject_idx
  on public.analytics_events ((payload->>'subjectId'), created_at desc)
  where payload ? 'subjectId';
create index if not exists analytics_events_payload_question_idx
  on public.analytics_events ((payload->>'questionId'))
  where payload ? 'questionId';

alter table public.analytics_events enable row level security;
revoke all on table public.analytics_events from anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 2. 聚合 views（只讀、給創辦人 SQL Editor／週報腳本）
-- ══════════════════════════════════════════════════════════════════

create or replace view public.v_analytics_topic_practice as
select
  coalesce(payload->>'subjectId', '(unknown)') as subject_id,
  coalesce(payload->>'topicId', '(unknown)') as topic_id,
  count(*) filter (where event_name = 'topic_practice_completed') as completions,
  count(*) filter (where event_name = 'question_answered') as answers,
  count(*) filter (where event_name = 'question_answered' and (payload->>'correct') = 'false') as wrong_answers
from public.analytics_events
where created_at > timezone('utc', now()) - interval '90 days'
group by 1, 2;

create or replace view public.v_analytics_hard_questions as
select
  payload->>'questionId' as question_id,
  coalesce(payload->>'subjectId', '(unknown)') as subject_id,
  count(*) filter (where (payload->>'correct') = 'false') as wrong_n,
  count(*) as answered_n,
  round(
    100.0 * count(*) filter (where (payload->>'correct') = 'false')
    / nullif(count(*), 0),
    1
  ) as wrong_pct
from public.analytics_events
where event_name = 'question_answered'
  and payload ? 'questionId'
  and created_at > timezone('utc', now()) - interval '90 days'
group by 1, 2
having count(*) >= 5
order by wrong_pct desc nulls last;

create or replace view public.v_question_report_hotspots as
select
  question_id,
  category,
  count(*) as report_n,
  min(created_at) as first_seen,
  max(created_at) as last_seen,
  count(*) filter (where status in ('open', 'new', 'triaged', 'ai_drafted', 'human_review')) as open_n
from public.question_reports
group by question_id, category
order by report_n desc;

-- Views inherit underlying table privileges; lock them down.
revoke all on public.v_analytics_topic_practice from anon, authenticated;
revoke all on public.v_analytics_hard_questions from anon, authenticated;
revoke all on public.v_question_report_hotspots from anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 3. question_reports triage 擴充（唔加學生自由文字）
-- ══════════════════════════════════════════════════════════════════

alter table public.question_reports
  add column if not exists priority_score integer not null default 0
    check (priority_score between 0 and 100);

alter table public.question_reports
  add column if not exists triaged_at timestamptz;

alter table public.question_reports
  add column if not exists admin_note text
    check (admin_note is null or char_length(admin_note) <= 1000);

-- Expand status values used by admin triage (keep legacy 'open').
alter table public.question_reports drop constraint if exists question_reports_status_check;
alter table public.question_reports
  add constraint question_reports_status_check
  check (status in (
    'open', 'new', 'triaged', 'ai_drafted', 'human_review', 'fixed', 'rejected'
  ));

update public.question_reports set status = 'new' where status = 'open';

-- ══════════════════════════════════════════════════════════════════
-- 4. question_revisions — 逐題修訂可追溯（AI 草稿必須 human_review）
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.question_revisions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  question_id     text not null check (char_length(question_id) between 1 and 100),
  source_report_id bigint references public.question_reports(id) on delete set null,
  revision_status text not null default 'ai_drafted'
    check (revision_status in (
      'ai_drafted', 'human_review', 'approved', 'rejected', 'published'
    )),
  ai_confidence   numeric check (ai_confidence is null or (ai_confidence >= 0 and ai_confidence <= 1)),
  change_summary  text not null check (char_length(change_summary) between 1 and 2000),
  -- Diff payload: { before?: object, after?: object, rationale?: string } — never student PII
  diff_json       jsonb not null default '{}'::jsonb,
  reviewer_email_hash text
    check (reviewer_email_hash is null or char_length(reviewer_email_hash) <= 128),
  reviewed_at     timestamptz,
  constraint question_revisions_no_auto_publish check (
    revision_status <> 'published'
    or reviewed_at is not null
  )
);

comment on table public.question_revisions is
  'AI-assisted question edits. Must pass human_review before published. Never auto-publish.';

create index if not exists question_revisions_queue_idx
  on public.question_revisions (revision_status, created_at desc);
create index if not exists question_revisions_question_idx
  on public.question_revisions (question_id, created_at desc);

alter table public.question_revisions enable row level security;
revoke all on table public.question_revisions from anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 5. auth_email_outbox — Better Auth 電郵唔強制付費 ESP
-- ══════════════════════════════════════════════════════════════════
-- 開發／兩人團隊：reset／magic link／verify URL 寫入此表；
-- 可選 AUTH_EMAIL_WEBHOOK_URL 轉發。唔存密碼；to_email 只留喺 server 表。

create table if not exists public.auth_email_outbox (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default timezone('utc', now()),
  kind         text not null check (kind in ('magic_link', 'reset_password', 'verify_email')),
  -- Store a truncated/hashed form for ops; full address only when needed for delivery
  to_email     text not null check (char_length(to_email) between 3 and 320),
  subject      text not null check (char_length(subject) <= 200),
  -- Contains one-time URL; treat as secret; purge after send
  body_text    text not null check (char_length(body_text) <= 8000),
  delivered_at timestamptz,
  error        text check (error is null or char_length(error) <= 500)
);

alter table public.auth_email_outbox enable row level security;
revoke all on table public.auth_email_outbox from anon, authenticated;
