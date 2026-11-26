-- DRAFT — DO NOT APPLY to the production Supabase project.
-- Loop Engineering Week 1–2 (2026-11-26 to 2026-12-09 HKT).
-- Stores rubric scores and unpublished preview drafts.
-- Does not alter public.questions or public.question_bank_versions.
-- Does not collect student answers. Loop 5 user testing is not a storable status.
-- Apply only after a separate founder approval and a backup drill.

create table if not exists public.loop_eng_rubric_scores (
  id bigserial primary key,
  item_id text not null,
  rubric_version text not null,
  score_role text not null,
  profile_id text,
  reasoning smallint not null,
  step_integration smallint not null,
  trap_quality smallint not null,
  expression smallint not null,
  transfer smallint not null,
  composite smallint not null,
  baseline_composite smallint,
  upgrade_threshold numeric,
  formula_met boolean,
  source text not null,
  official_statistic boolean not null default false,
  verified_dse_plus_10 boolean not null default false,
  actor text not null,
  note text,
  created_at timestamptz not null default now(),
  constraint ck_loop_eng_score_role check (score_role in ('baseline', 'proposed', 'proxy_current')),
  constraint ck_loop_eng_score_bounds check (
    reasoning between 1 and 5
    and step_integration between 1 and 5
    and trap_quality between 1 and 5
    and expression between 1 and 5
    and transfer between 1 and 5
    and composite = reasoning + step_integration + trap_quality + expression + transfer
  ),
  constraint ck_loop_eng_score_not_official check (official_statistic = false),
  constraint ck_loop_eng_score_not_verified check (verified_dse_plus_10 = false)
);

comment on table public.loop_eng_rubric_scores is
  'DRAFT. Five-dimension scores for review. verified_dse_plus_10 must stay false.';

create table if not exists public.loop_eng_pipeline_items (
  draft_id text primary key,
  source_question_id text not null,
  subject text not null default 'math',
  status text not null,
  published boolean not null default false,
  release_channel text not null default 'unpublished_preview',
  disclosure_label text not null,
  difficulty_claim text not null default '未驗證',
  verified_dse_plus_10 boolean not null default false,
  expert_release_claimed boolean not null default false,
  uses_student_answers boolean not null default false,
  ai_decision text,
  rubric_version text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ck_loop_eng_status check (
    status in ('loop2_draft', 'loop3_ai_first_review', 'loop4_two_person_review', 'preview')
  ),
  constraint ck_loop_eng_ai_gate check (
    status in ('loop2_draft', 'loop3_ai_first_review')
    or ai_decision = 'pass_to_human'
  ),
  constraint ck_loop_eng_preview_label check (
    status <> 'preview'
    or disclosure_label = '未經 HKDSE 學科教師審核'
  ),
  constraint ck_loop_eng_unpublished check (
    published = false and release_channel = 'unpublished_preview'
  ),
  constraint ck_loop_eng_claim check (difficulty_claim = '未驗證'),
  constraint ck_loop_eng_not_verified check (verified_dse_plus_10 = false),
  constraint ck_loop_eng_not_expert check (expert_release_claimed = false),
  constraint ck_loop_eng_no_student_answers check (uses_student_answers = false)
);

comment on table public.loop_eng_pipeline_items is
  'DRAFT. Unpublished Loop 2-4 records. Loop 5 cannot be stored. Do not apply to production in Week 1-2.';

create table if not exists public.loop_eng_pipeline_events (
  id bigserial primary key,
  draft_id text not null references public.loop_eng_pipeline_items (draft_id),
  from_status text not null,
  to_status text not null,
  ok boolean not null,
  actor text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

comment on table public.loop_eng_pipeline_events is
  'DRAFT audit trail. to_status may record a rejected loop5 attempt; the item status check still rejects storing loop5.';

create table if not exists public.loop_eng_prompts (
  prompt_key text not null,
  version text not null,
  body text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (prompt_key, version)
);

comment on table public.loop_eng_prompts is
  'DRAFT prompt registry. Week 1-2 canonical text lives in docs/loop-engineering/prompts/.';

alter table public.loop_eng_rubric_scores enable row level security;
alter table public.loop_eng_pipeline_items enable row level security;
alter table public.loop_eng_pipeline_events enable row level security;
alter table public.loop_eng_prompts enable row level security;

revoke all on public.loop_eng_rubric_scores from anon, authenticated;
revoke all on public.loop_eng_pipeline_items from anon, authenticated;
revoke all on public.loop_eng_pipeline_events from anon, authenticated;
revoke all on public.loop_eng_prompts from anon, authenticated;

grant all on public.loop_eng_rubric_scores to service_role;
grant all on public.loop_eng_pipeline_items to service_role;
grant all on public.loop_eng_pipeline_events to service_role;
grant all on public.loop_eng_prompts to service_role;
