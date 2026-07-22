import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { isSandboxRequest, executionFingerprint, type SandboxRequest } from '@/lib/agents/sandbox'

// Agentic Harness v5 · Phase 1 — 沙箱控制封套 route
//
// 【為何 Node runtime 而非文件講嘅 Edge】三個理由（誠實記錄）：
//  1. 全 codebase 嘅 server helper（getServiceSupabase / getSyncUserId / safeLog）都係 Node；
//     硬上 Edge 要全部重寫，離棄慣例＝加維護負擔（憲章 #8）。
//  2. Tier 0 根本未執行不可信代碼（見文件 D-3），Edge/V8 隔離嘅價值而家用唔著。
//  3. Tier 0 真正嘅「沙箱」價值係【控制封套】：指紋去重 / 超時 / 升級 / 白名單 —— Node 一樣做到。
//     真・硬體隔離（MicroVM）留返真係要跑學生代碼先上（Tier 1）。
//
// 呢個 route 家陣【唔執行真任務】：Generator/Evaluator 係 Phase 3。任務位置係誠實 stub，
// 但封套（auth / shape-guard / 指紋去重 / 超時 / 升級 / 記真 trace）全部真實生效、可驗收。
// 生產紀律：日後真產出一律入 drafts/，機器永不自動入庫。

export const dynamic = 'force-dynamic'
export const maxDuration = 10 // 硬超時（秒）

const MAX_DUPLICATES = 3 // 窗口內同指紋 ≥3 次 = 語義死循環（近似；真餘弦語義熔斷屬 Tier 1）
const DEDUP_WINDOW_MS = 10 * 60_000 // 10 分鐘窗口
const TASK_TIMEOUT_MS = 9_500 // 內部超時，略短於 maxDuration，留 buffer 記 trace
const RECENT_SCAN = 20 // 掃最近 N 條同 agent/taskType trace 數重複

type ServiceClient = ReturnType<typeof getServiceSupabase>

export async function POST(request: Request) {
  const started = Date.now()

  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  if (!isSandboxRequest(body)) {
    return NextResponse.json({ error: 'invalid sandbox request' }, { status: 400 })
  }

  const req = body as SandboxRequest
  const fingerprint = await executionFingerprint(req)
  const supabase = getServiceSupabase()

  try {
    // 1. 語義死循環近似檢測：窗口內、同 agent + 同 taskType、同指紋嘅 prior 次數。
    //    用 JS 端數（唔靠 PostgREST JSON-path filter），穩陣。
    const windowStart = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
    const { data: recent, error: scanErr } = await supabase
      .from('agent_traces')
      .select('payload')
      .eq('agent_id', req.agentId)
      .eq('gen_ai_tool_name', req.taskType)
      .gte('created_at', windowStart)
      .order('created_at', { ascending: false })
      .limit(RECENT_SCAN)
    if (scanErr) throw scanErr

    const dupCount = (recent ?? []).filter(
      (r) => (r.payload as { fingerprint?: string } | null)?.fingerprint === fingerprint,
    ).length

    if (dupCount >= MAX_DUPLICATES) {
      // 熔斷 → 人手升級隊列（機器唔自己解，交人）。
      await supabase.from('escalation_queue').insert({
        trace_id: req.traceId,
        agent_id: req.agentId,
        reason: 'repeated_no_progress',
        detail: { fingerprint, task_type: req.taskType, window_ms: DEDUP_WINDOW_MS, dup_count: dupCount },
      })
      await logTrace(supabase, req, userId, fingerprint, 'ESCALATE', Date.now() - started)
      return NextResponse.json(
        {
          ok: false,
          verdict: 'SEMANTIC_CIRCUIT_BREAKER',
          error: 'Repeated identical execution detected; escalated for human review.',
        },
        { status: 429 },
      )
    }

    // 2. Tier 0 誠實 stub：真任務（Generator/Evaluator）喺 Phase 3 先到。
    //    依然套超時封套，證明控制層有效。
    const result = await withTimeout(runAgentTaskStub(req), TASK_TIMEOUT_MS)

    // 3. 記真 trace（零虛構；cost_usd = 0，因為 Phase 1 冇付費推理）。
    await logTrace(supabase, req, userId, fingerprint, 'TOOL_CALL', Date.now() - started)

    return NextResponse.json({ ok: true, ...result, executionMs: Date.now() - started })
  } catch (e) {
    const timedOut = e instanceof Error && e.message === 'TASK_TIMEOUT'
    safeLog('error', 'api/agent/sandbox POST', e)
    try {
      await logTrace(supabase, req, userId, fingerprint, 'ERROR', Date.now() - started)
    } catch {
      /* trace 失敗唔可以蓋過原錯 */
    }
    return NextResponse.json(
      { ok: false, error: timedOut ? 'TASK_TIMEOUT' : 'internal error' },
      { status: timedOut ? 504 : 500 },
    )
  }
}

// 誠實 stub：Phase 1 唔執行真任務，只證明封套。Phase 3 換成 Generator/Evaluator。
async function runAgentTaskStub(req: SandboxRequest): Promise<{ status: string; note: string }> {
  return {
    status: 'not_implemented',
    note: `Sandbox envelope OK for "${req.taskType}". Generator/Evaluator arrive in Phase 3; output will go to drafts/, never auto-committed.`,
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('TASK_TIMEOUT')), ms)),
  ])
}

async function logTrace(
  supabase: ServiceClient,
  req: SandboxRequest,
  userId: string,
  fingerprint: string,
  eventType: 'TOOL_CALL' | 'ESCALATE' | 'ERROR',
  durationMs: number,
): Promise<void> {
  await supabase.from('agent_traces').insert({
    trace_id: req.traceId,
    span_name: 'execute_tool',
    agent_id: req.agentId,
    user_id: userId,
    event_type: eventType,
    gen_ai_tool_name: req.taskType,
    cost_usd: 0,
    payload: { fingerprint, duration_ms: durationMs, tier: 0 },
  })
}
