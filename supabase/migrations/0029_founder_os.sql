-- 0029 —— DSE Level Up Founder OS 營運實體
--
-- 用途：審計、營運任務、AI 工作、事故、發佈批次、預算、整合狀態、功能開關。
-- 寫入／讀取只經 server-only service role（同其他用戶表）；anon／authenticated 無任何權限。
-- RLS 開啟且不設 policy（刻意；與 0018／0020 同一模式）。
--
-- ⚠️ 本 migration 唔會重置或清空既有學生／題庫資料。

-- ── 操作審計（最小化變更摘要；禁止存 secret／完整學生答案）────────────
create table if not exists public.founder_audit_events (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default timezone('utc', now()),
  actor_sub       text not null check (char_length(actor_sub) between 1 and 128),
  actor_email     text not null check (char_length(actor_email) between 3 and 320),
  action          text not null check (char_length(action) between 1 and 80),
  target_type     text not null check (char_length(target_type) between 1 and 80),
  target_id       text check (target_id is null or char_length(target_id) <= 200),
  result          text not null check (result in ('ok', 'denied', 'error', 'cancelled')),
  summary         text check (summary is null or char_length(summary) <= 500),
  correlation_id  text check (correlation_id is null or char_length(correlation_id) <= 80),
  meta            jsonb not null default '{}'::jsonb
);

create index if not exists founder_audit_events_created_idx
  on public.founder_audit_events (created_at desc);
create index if not exists founder_audit_events_actor_idx
  on public.founder_audit_events (actor_sub, created_at desc);
create index if not exists founder_audit_events_action_idx
  on public.founder_audit_events (action, created_at desc);

alter table public.founder_audit_events enable row level security;
revoke all on table public.founder_audit_events from anon, authenticated;

-- ── 營運時間線／任務 ────────────────────────────────────────────────
create table if not exists public.founder_operational_tasks (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  kind            text not null check (kind in (
    'publish_batch', 'question_review', 'maintenance', 'incident', 'custom'
  )),
  title           text not null check (char_length(title) between 1 and 200),
  status          text not null default 'open' check (status in (
    'open', 'in_progress', 'blocked', 'done', 'cancelled'
  )),
  priority        text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  owner_label     text check (owner_label is null or char_length(owner_label) <= 120),
  due_at          timestamptz,
  notes           text check (notes is null or char_length(notes) <= 2000),
  created_by_sub  text not null check (char_length(created_by_sub) between 1 and 128),
  meta            jsonb not null default '{}'::jsonb
);

create index if not exists founder_ops_tasks_status_idx
  on public.founder_operational_tasks (status, priority, updated_at desc);

alter table public.founder_operational_tasks enable row level security;
revoke all on table public.founder_operational_tasks from anon, authenticated;

-- ── AI 工作任務 ────────────────────────────────────────────────────
create table if not exists public.founder_ai_jobs (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  kind            text not null check (char_length(kind) between 1 and 80),
  status          text not null default 'queued' check (status in (
    'queued', 'running', 'needs_human', 'failed', 'cancelled', 'completed'
  )),
  title           text not null check (char_length(title) between 1 and 200),
  provider        text check (provider is null or char_length(provider) <= 80),
  model           text check (model is null or char_length(model) <= 120),
  input_summary   text check (input_summary is null or char_length(input_summary) <= 500),
  output_summary  text check (output_summary is null or char_length(output_summary) <= 2000),
  error_message   text check (error_message is null or char_length(error_message) <= 1000),
  cost_amount     numeric,
  cost_currency   text check (cost_currency is null or char_length(cost_currency) <= 8),
  cost_hkd        numeric,
  created_by_sub  text not null check (char_length(created_by_sub) between 1 and 128),
  idempotency_key text unique,
  meta            jsonb not null default '{}'::jsonb
);

create index if not exists founder_ai_jobs_status_idx
  on public.founder_ai_jobs (status, updated_at desc);

alter table public.founder_ai_jobs enable row level security;
revoke all on table public.founder_ai_jobs from anon, authenticated;

-- ── 事故 ───────────────────────────────────────────────────────────
create table if not exists public.founder_incidents (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  title           text not null check (char_length(title) between 1 and 200),
  severity        text not null check (severity in ('info', 'warn', 'critical')),
  status          text not null default 'open' check (status in (
    'open', 'mitigating', 'monitoring', 'resolved', 'cancelled'
  )),
  impact          text check (impact is null or char_length(impact) <= 500),
  owner_label     text check (owner_label is null or char_length(owner_label) <= 120),
  first_seen_at   timestamptz not null default timezone('utc', now()),
  resolved_at     timestamptz,
  timeline        jsonb not null default '[]'::jsonb,
  fingerprint     text not null check (char_length(fingerprint) between 1 and 200),
  meta            jsonb not null default '{}'::jsonb,
  unique (fingerprint)
);

create index if not exists founder_incidents_status_idx
  on public.founder_incidents (status, severity, updated_at desc);

alter table public.founder_incidents enable row level security;
revoke all on table public.founder_incidents from anon, authenticated;

-- ── 發佈批次 ───────────────────────────────────────────────────────
create table if not exists public.founder_publish_batches (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  name            text not null check (char_length(name) between 1 and 160),
  subject_slug    text check (subject_slug is null or char_length(subject_slug) <= 40),
  status          text not null default 'draft' check (status in (
    'draft', 'pending_review', 'approved', 'published', 'rolled_back', 'cancelled'
  )),
  question_ids    jsonb not null default '[]'::jsonb,
  created_by_sub  text not null check (char_length(created_by_sub) between 1 and 128),
  notes           text check (notes is null or char_length(notes) <= 2000),
  meta            jsonb not null default '{}'::jsonb
);

alter table public.founder_publish_batches enable row level security;
revoke all on table public.founder_publish_batches from anon, authenticated;

-- ── 覆核個案（連結錯題回報／質素覆核）──────────────────────────────
create table if not exists public.founder_review_cases (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  source          text not null check (source in (
    'question_report', 'quality_review', 'copyright', 'manual', 'ai_flag'
  )),
  source_id       text check (source_id is null or char_length(source_id) <= 120),
  question_id     text check (question_id is null or char_length(question_id) <= 100),
  subject_slug    text check (subject_slug is null or char_length(subject_slug) <= 40),
  severity        text not null default 'normal' check (severity in ('low', 'normal', 'high', 'critical')),
  status          text not null default 'open' check (status in (
    'open', 'assigned', 'in_review', 'resolved', 'rejected', 'closed'
  )),
  assignee_label  text check (assignee_label is null or char_length(assignee_label) <= 120),
  title           text not null check (char_length(title) between 1 and 200),
  notes           text check (notes is null or char_length(notes) <= 2000),
  fingerprint     text not null check (char_length(fingerprint) between 1 and 200),
  meta            jsonb not null default '{}'::jsonb,
  unique (fingerprint)
);

create index if not exists founder_review_cases_status_idx
  on public.founder_review_cases (status, severity, updated_at desc);

alter table public.founder_review_cases enable row level security;
revoke all on table public.founder_review_cases from anon, authenticated;

-- ── 預算 ───────────────────────────────────────────────────────────
create table if not exists public.founder_budgets (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  period_start    date not null,
  period_end      date not null,
  label           text not null check (char_length(label) between 1 and 120),
  amount          numeric not null check (amount >= 0),
  currency        text not null default 'USD' check (char_length(currency) between 3 and 8),
  amount_hkd      numeric,
  spent_amount    numeric not null default 0 check (spent_amount >= 0),
  spent_currency  text not null default 'USD',
  spent_hkd       numeric,
  warn_pct        numeric not null default 80 check (warn_pct > 0 and warn_pct <= 100),
  notes           text check (notes is null or char_length(notes) <= 1000),
  meta            jsonb not null default '{}'::jsonb,
  check (period_end >= period_start)
);

alter table public.founder_budgets enable row level security;
revoke all on table public.founder_budgets from anon, authenticated;

-- ── 整合／服務狀態（手動或 cron 更新；冇遙測就標 unconnected）──────
create table if not exists public.founder_integration_status (
  key             text primary key check (char_length(key) between 1 and 80),
  label           text not null check (char_length(label) between 1 and 120),
  status          text not null default 'unconnected' check (status in (
    'ok', 'degraded', 'down', 'unconnected', 'unknown'
  )),
  detail          text check (detail is null or char_length(detail) <= 500),
  checked_at      timestamptz,
  meta            jsonb not null default '{}'::jsonb
);

alter table public.founder_integration_status enable row level security;
revoke all on table public.founder_integration_status from anon, authenticated;

insert into public.founder_integration_status (key, label, status, detail) values
  ('supabase', 'Supabase Postgres', 'unknown', '由 Founder OS 健康檢查更新'),
  ('auth_google', 'Google OAuth', 'unknown', '取決於 AUTH_GOOGLE_* 是否已設'),
  ('sentry', 'Sentry', 'unconnected', '未接駁即時健康探測'),
  ('ai_provider', 'AI 供應商', 'unconnected', '未設定 Founder AI API 時保持未接駁'),
  ('vercel', 'Vercel 部署', 'unconnected', '未接駁部署 API'),
  ('background_jobs', '背景任務', 'unconnected', '未接駁專用 worker')
on conflict (key) do nothing;

-- ── 功能開關（創辦人控制；預設安全）────────────────────────────────
create table if not exists public.founder_feature_flags (
  key             text primary key check (char_length(key) between 1 and 80),
  label           text not null check (char_length(label) between 1 and 120),
  enabled         boolean not null default false,
  description     text check (description is null or char_length(description) <= 500),
  updated_at      timestamptz not null default timezone('utc', now()),
  updated_by_sub  text check (updated_by_sub is null or char_length(updated_by_sub) <= 128)
);

alter table public.founder_feature_flags enable row level security;
revoke all on table public.founder_feature_flags from anon, authenticated;

insert into public.founder_feature_flags (key, label, enabled, description) values
  ('founder_ai_command', 'Founder AI 指令列', false, '開啟前必須設定伺服器端 AI API；唔會把 Secret 回傳前端'),
  ('founder_demo_fixtures', '本機 Demo Fixtures', false, '只准本機／測試；正式環境不得自動開啟')
on conflict (key) do nothing;

-- ── AI 指令確認（副作用操作必須綁定具體 payload）──────────────────
create table if not exists public.founder_command_confirmations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default timezone('utc', now()),
  expires_at      timestamptz not null,
  actor_sub       text not null check (char_length(actor_sub) between 1 and 128),
  action          text not null check (char_length(action) between 1 and 80),
  payload_hash    text not null check (char_length(payload_hash) = 64),
  payload_summary text not null check (char_length(payload_summary) between 1 and 1000),
  impact_count    integer not null default 0 check (impact_count >= 0),
  consumed_at     timestamptz
);

create index if not exists founder_cmd_confirm_actor_idx
  on public.founder_command_confirmations (actor_sub, created_at desc);

alter table public.founder_command_confirmations enable row level security;
revoke all on table public.founder_command_confirmations from anon, authenticated;
