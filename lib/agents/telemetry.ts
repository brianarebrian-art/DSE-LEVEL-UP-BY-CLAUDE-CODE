// Agentic Harness v5 · Phase 5 — 遙測（寫 agent_traces；OTel GenAI 命名；$0）
//
// 記真 trace（零虛構）。cost_usd 餵 §5 財務死鎖監控 + Phase 4 成本斷路。
// server-only：由 route 用 getServiceSupabase() 建 client 傳入，service_role 永不落客戶端。

import type { SupabaseClient } from '@supabase/supabase-js'

export interface AgentTrace {
  traceId: string
  parentTraceId?: string
  spanName: 'invoke_agent' | 'chat' | 'execute_tool'
  agentId?: string
  userId?: string
  eventType?: 'THOUGHT' | 'TOOL_CALL' | 'TOOL_RESULT' | 'DECISION' | 'ESCALATE' | 'ERROR'
  genAiInputTokens?: number
  genAiOutputTokens?: number
  genAiToolName?: string
  costUsd?: number
  payload?: Record<string, unknown>
}

export function newTraceId(): string {
  return `dse-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export async function logAgentTrace(supabase: SupabaseClient, t: AgentTrace): Promise<void> {
  await supabase.from('agent_traces').insert({
    trace_id: t.traceId,
    parent_trace_id: t.parentTraceId ?? null,
    span_name: t.spanName,
    agent_id: t.agentId ?? null,
    user_id: t.userId ?? null,
    event_type: t.eventType ?? null,
    gen_ai_input_tokens: t.genAiInputTokens ?? null,
    gen_ai_output_tokens: t.genAiOutputTokens ?? null,
    gen_ai_tool_name: t.genAiToolName ?? null,
    cost_usd: t.costUsd ?? 0,
    payload: t.payload ?? {},
  })
}

// 窗口內累計 cost_usd（餵成本斷路 + 財務死鎖監控）。
export async function recentCostUsd(supabase: SupabaseClient, sinceMs: number): Promise<number> {
  const since = new Date(Date.now() - sinceMs).toISOString()
  const { data, error } = await supabase.from('agent_traces').select('cost_usd').gte('created_at', since)
  if (error || !data) return 0
  return data.reduce((sum, r) => sum + Number((r as { cost_usd?: number }).cost_usd ?? 0), 0)
}
