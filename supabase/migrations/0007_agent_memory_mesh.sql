-- 0007 — Agentic Harness v5 · Phase 0 基建
-- 已於 2026-07-22 經 Supabase MCP apply_migration 套用到 aegekxapxgcfdrkzisis（生產）。
--
-- 背景（誠實記錄）：創辦人在得悉以下事實後，仍拍板起完整 Tier 0 agent 網格 ——
--   • v5 自稱「校正 v4」，但 v4（lib/agents/*、app/api/agent/、0004_agent_memory.sql）
--     一個檔案都不存在；本批屬【淨新建】，非「校正現有」。
--   • 「Tier 0 = $0」只涵蓋基建（Supabase/Edge/遙測）；generator 推理走
--     scripts/gen-questions.mts（@anthropic-ai/sdk + claude-opus-4-8 + 你自己的
--     ANTHROPIC_API_KEY），係【真・付費 API】，不在 $0 內。
--   • 此網格增加大量維護面（憲章 #8 一人團隊）；真正樽頸（#70 API 預算 + 人手審核）
--     不會被自主生成 agent 解決，反而加重。
--
-- 隔離模型（v5 §3.2 校正）：本 app 無 Supabase Auth，auth.uid() 恆 null，故不用
-- auth.uid() 型 RLS。改為：只經 server-only getServiceSupabase() 存取，每條查詢一律
-- .eq('user_id', sessionUserId)；RLS 開而零 policy = anon/authenticated 全鎖死。
-- 與 user_progress / user_sessions / review_decisions 一致。

-- Tier 0 = $0：只裝擴充（免費），唔生成任何 embedding。
-- 裝入 extensions schema（本 DB 既有慣例：pgcrypto / uuid-ossp 都喺嗰度；
-- 消 advisor 0014_extension_in_public WARN）。extensions 在 Supabase 預設 search_path 內。
-- （註：生產首次套用時誤裝入 public，已用 `alter extension … set schema extensions` 補正；
--   此處寫成正確形式，供 fresh replay 一次到位。）
create extension if not exists vector  with schema extensions;   -- v0.8.0，384 維欄位用；Tier 0 唔填
create extension if not exists pg_trgm with schema extensions;   -- Tier 0 關鍵字檢索（trigram），零 API 費

-- ── 記憶層 ────────────────────────────────────────────────────────────────────
create table if not exists agent_memory (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,              -- Auth.js session sub（app 層身分），非 FK 去 auth.users
  agent_id      text not null,
  content       text not null,
  -- Tier 0 唔填（關鍵字檢索）；免費本地嵌入（gte-small 384 維）可用時先寫入
  embedding     extensions.vector(384),
  content_type  text not null check (content_type in
                ('error_pattern','concept_mastery','question_archetype','student_profile','session_summary')),
  metadata      jsonb not null default '{}',
  salience      double precision not null default 0.5 check (salience between 0 and 1),
  access_count  integer not null default 0,
  created_at    timestamptz not null default clock_timestamp(),
  last_accessed timestamptz not null default clock_timestamp()
);
create index if not exists idx_agent_memory_user on agent_memory (user_id, last_accessed desc);
create index if not exists idx_agent_memory_trgm on agent_memory using gin (content extensions.gin_trgm_ops);

-- ── 可觀測性：遙測 trace（OTel GenAI 命名，便於日後零改寫接 OTel）─────────────
create table if not exists agent_traces (
  id                   uuid primary key default gen_random_uuid(),
  trace_id             text not null,
  parent_trace_id      text,
  span_name            text not null,          -- invoke_agent | chat | execute_tool
  agent_id             text,
  user_id              text,
  event_type           text,                   -- THOUGHT | TOOL_CALL | TOOL_RESULT | DECISION | ESCALATE
  gen_ai_input_tokens  integer,
  gen_ai_output_tokens integer,
  gen_ai_tool_name     text,
  cost_usd             numeric(12,6) not null default 0,  -- 餵 $10 斷路 + §5 財務死鎖監控
  payload              jsonb not null default '{}',
  created_at           timestamptz not null default clock_timestamp()
);
create index if not exists idx_agent_traces_trace on agent_traces (trace_id, created_at);
create index if not exists idx_agent_traces_cost on agent_traces (created_at desc);

-- ── 人工升級隊列（熔斷 → 人手接管；生產紀律：機器永不自動入庫）──────────────
create table if not exists escalation_queue (
  id           uuid primary key default gen_random_uuid(),
  trace_id     text,
  agent_id     text,
  reason       text not null check (reason in
               ('repeated_no_progress','cost_break','dangerous_tool','low_confidence','evaluator_block')),
  detail       jsonb not null default '{}',
  status       text not null default 'open' check (status in ('open','acknowledged','resolved')),
  created_at   timestamptz not null default clock_timestamp(),
  resolved_at  timestamptz
);
create index if not exists idx_escalation_open on escalation_queue (status, created_at desc);

-- RLS 開而零 policy = 全鎖死（同全庫一致；service_role 經 server route bypass）
alter table agent_memory     enable row level security;
alter table agent_traces     enable row level security;
alter table escalation_queue enable row level security;

-- 套用後實測：3 表 rls=true policies=0；vector 0.8.0 + pg_trgm 1.6 已裝入 extensions schema；
-- agent_memory.embedding = vector(384)；user_progress 24 行完全未動。
-- security advisor：3 表 rls_enabled_no_policy = INFO（設計內，同全庫一致）；
--   extension_in_public WARN 已由遷 schema 消除。
