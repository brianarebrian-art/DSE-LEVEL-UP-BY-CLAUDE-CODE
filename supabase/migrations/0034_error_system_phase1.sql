-- 0034 —— 題目錯誤反映系統 Phase 1（DB／RLS／WORM）
--
-- 來源：docs/update-error-noapi/phase-1-db.md
-- 創辦人決策（2026-11-05）：
--   1. 冇任何冷門科豁免雙審
--   2. 替換題要 L1（human_review）快審 24h
--   3. 匿名可以舉報（沿用 0020：無 reporter_id／IP／自由文字）
--   4. 新題唔標「AI生成替換」（學生端繼續用「經自動檢查」披露，§12.1／§16.B）
--
-- 本 migration【唔】：
--   - 新增 reporter_id／description（違 §16.E）
--   - 喺 questions 加 is_active／replaced_by（撤回繼續走 withdraw.mts＋withdrawn.json）
--   - 開 anon／authenticated 寫入 policy
--   - 設科目白名單跳過 second_review
--
-- ⚠️ DRAFT：Phase 1 只入 repo；等批准後先喺 Supabase SQL Editor 執行。

-- ══════════════════════════════════════════════════════════════════
-- 1. 擴充 question_reports.status
-- ══════════════════════════════════════════════════════════════════

alter table public.question_reports
  drop constraint if exists question_reports_status_check;

alter table public.question_reports
  add constraint question_reports_status_check
  check (status in (
    'open',
    'queued',
    'investigating',
    'confirmed',
    'needs_human',
    'fixed',
    'rejected'
  ));

comment on column public.question_reports.status is
  'open→queued→investigating→confirmed|needs_human|rejected；confirmed 後經撤回＋替換雙審→fixed。無學生身份欄。';

-- ══════════════════════════════════════════════════════════════════
-- 2. question_error_triage（調查／分流；WORM 風格：client 無寫權）
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.question_error_triage (
  id                uuid primary key default gen_random_uuid(),
  report_id         bigint not null references public.question_reports(id),
  assigned_subject  text not null check (char_length(assigned_subject) between 1 and 80),
  assigned_bot_id   text not null check (char_length(assigned_bot_id) between 1 and 80),
  is_valid          boolean,
  confidence        double precision check (confidence is null or (confidence >= 0 and confidence <= 1)),
  error_type        text check (error_type is null or char_length(error_type) <= 80),
  evidence          jsonb not null default '{}'::jsonb,
  grok_reasoning    text check (grok_reasoning is null or char_length(grok_reasoning) <= 8000),
  should_replace    boolean,
  created_at        timestamptz not null default timezone('utc', now())
);

create index if not exists question_error_triage_report_idx
  on public.question_error_triage (report_id, created_at desc);
create index if not exists question_error_triage_bot_idx
  on public.question_error_triage (assigned_bot_id, created_at desc);

comment on table public.question_error_triage is
  '錯誤反映分流／調查結果。寫入只經 service_role（Agent／ops）；唔存學生身份。';

alter table public.question_error_triage enable row level security;
revoke all on table public.question_error_triage from anon, authenticated;
grant all on table public.question_error_triage to service_role;

-- ══════════════════════════════════════════════════════════════════
-- 3. question_replacement_queue（替換題：L1 24h ＋ 全科雙審）
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.question_replacement_queue (
  id                  uuid primary key default gen_random_uuid(),
  report_id           bigint not null references public.question_reports(id),
  triage_id           uuid references public.question_error_triage(id),
  old_question_id     text not null check (char_length(old_question_id) between 1 and 100),
  subject_slug        text not null check (char_length(subject_slug) between 1 and 80),
  -- git／draft 路徑或題號；正本仍係 data/questions/*，唔 runtime insert questions
  draft_ref           text check (draft_ref is null or char_length(draft_ref) <= 400),
  new_question_id     text check (new_question_id is null or char_length(new_question_id) between 1 and 100),
  -- L1 = human_review；L2 = second_review。禁止單審／冷門豁免。
  review_stage        text not null default 'human_review'
    check (review_stage in (
      'queued',
      'human_review',
      'second_review',
      'approved',
      'revision_required',
      'withdrawn'
    )),
  l1_due_at           timestamptz not null
                        default (timezone('utc', now()) + interval '24 hours'),
  l1_completed_at     timestamptz,
  l2_completed_at     timestamptz,
  -- ops-only；學生 UI 唔准渲染「AI生成替換」
  internal_source     text not null default 'error_replacement'
    check (internal_source in ('error_replacement', 'manual_replacement')),
  public_label_zh     text not null default '經自動檢查'
    check (
      char_length(public_label_zh) between 1 and 40
      and public_label_zh not ilike '%AI生成%'
      and public_label_zh not ilike '%AI 生成%'
    ),
  public_label_en     text not null default 'Automated checks only'
    check (
      char_length(public_label_en) between 1 and 60
      and public_label_en not ilike '%AI-generated%'
      and public_label_en not ilike '%AI generated%'
    ),
  -- 必須雙審先可 promote；唔准科目豁免
  dual_review_required boolean not null default true
    check (dual_review_required = true),
  promoted_at         timestamptz,
  notes               text check (notes is null or char_length(notes) <= 2000),
  created_at          timestamptz not null default timezone('utc', now()),
  updated_at          timestamptz not null default timezone('utc', now()),
  constraint question_replacement_promote_requires_dual_review
    check (
      promoted_at is null
      or (
        l1_completed_at is not null
        and l2_completed_at is not null
        and review_stage = 'approved'
      )
    )
);

create index if not exists question_replacement_queue_stage_due_idx
  on public.question_replacement_queue (review_stage, l1_due_at asc);
create index if not exists question_replacement_queue_report_idx
  on public.question_replacement_queue (report_id);
create index if not exists question_replacement_queue_old_q_idx
  on public.question_replacement_queue (old_question_id);

comment on table public.question_replacement_queue is
  '錯誤反映替換題佇列。全科 dual_review_required=true；L1 期限 l1_due_at（預設建立後 24h）。公開標籤禁「AI生成替換」。';
comment on column public.question_replacement_queue.l1_due_at is
  'L1（human_review）到期時間；Founder 佇列按此排序，逾期 = l1_due_at < now() 且 l1_completed_at is null。';
comment on column public.question_replacement_queue.public_label_zh is
  '學生可見 provenance；預設「經自動檢查」（§12.1）。禁止「AI生成／AI 生成」字樣。';

alter table public.question_replacement_queue enable row level security;
revoke all on table public.question_replacement_queue from anon, authenticated;
grant all on table public.question_replacement_queue to service_role;

-- 新列預設 L1 期限：插入時若呼叫端未設，用 now()+24h
create or replace function public.question_replacement_set_l1_due()
returns trigger
language plpgsql
as $$
begin
  if new.l1_due_at is null then
    new.l1_due_at := timezone('utc', now()) + interval '24 hours';
  end if;
  new.updated_at := timezone('utc', now());
  new.dual_review_required := true;
  return new;
end;
$$;

drop trigger if exists trg_question_replacement_set_l1_due
  on public.question_replacement_queue;
create trigger trg_question_replacement_set_l1_due
  before insert or update on public.question_replacement_queue
  for each row execute function public.question_replacement_set_l1_due();

-- ══════════════════════════════════════════════════════════════════
-- 4. error_system_audit_logs（WORM）
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.error_system_audit_logs (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default timezone('utc', now()),
  action          text not null check (char_length(action) between 1 and 80),
  target_type     text not null check (char_length(target_type) between 1 and 80),
  target_id       text check (target_id is null or char_length(target_id) <= 200),
  report_id       bigint references public.question_reports(id),
  actor_label     text not null default 'system'
    check (char_length(actor_label) between 1 and 120),
  result          text not null check (result in ('ok', 'denied', 'error', 'cancelled')),
  summary         text check (summary is null or char_length(summary) <= 500),
  meta            jsonb not null default '{}'::jsonb
);

create index if not exists error_system_audit_logs_created_idx
  on public.error_system_audit_logs (created_at desc);
create index if not exists error_system_audit_logs_report_idx
  on public.error_system_audit_logs (report_id, created_at desc);
create index if not exists error_system_audit_logs_action_idx
  on public.error_system_audit_logs (action, created_at desc);

comment on table public.error_system_audit_logs is
  '錯誤反映系統 WORM 審計：只准 INSERT；UPDATE／DELETE 由 trigger 拒絕。唔存學生 PII／自由文字描述。';

alter table public.error_system_audit_logs enable row level security;
revoke all on table public.error_system_audit_logs from anon, authenticated;
grant all on table public.error_system_audit_logs to service_role;

create or replace function public.prevent_error_system_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'WORM: error_system_audit_logs cannot be updated or deleted';
end;
$$;

drop trigger if exists worm_error_system_audit on public.error_system_audit_logs;
create trigger worm_error_system_audit
  before update or delete on public.error_system_audit_logs
  for each row execute function public.prevent_error_system_audit_mutation();

-- ══════════════════════════════════════════════════════════════════
-- 5. 硬禁：唔為冷門科開豁免表／flag
-- ══════════════════════════════════════════════════════════════════
-- 刻意不建立 subject_dual_review_exemptions 或類似表。
-- question_replacement_queue.dual_review_required 恒為 true（check ＋ trigger）。
