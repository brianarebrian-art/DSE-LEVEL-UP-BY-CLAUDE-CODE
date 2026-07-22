// Agentic Harness v5 · Phase 1 — 沙箱控制封套（純函式，無 I/O）
//
// 誠實定位（Tier 0）：呢層【唔執行不可信代碼】。學生代碼自動評測（ICT 科）係後話，
// 見 harness 文件 D-3；到時先上真沙箱（E2B/Firecracker MicroVM，Tier 1）。
// 家陣呢層提供嘅係【控制封套】：指紋去重、超時、出站白名單、升級 —— 而非 V8／硬體隔離。
//
// 修正 v4 設計 bug：v4 route 喺 Edge runtime `import { createHash } from 'crypto'`（Node API，
// Edge 用唔到）。呢度改用 Web Crypto `crypto.subtle`，Node 20+ 同 Edge 都通用。

export type SandboxTaskType =
  | 'generate_question'
  | 'evaluate_answer'
  | 'compress_context'
  | 'self_heal'

export const SANDBOX_TASK_TYPES: SandboxTaskType[] = [
  'generate_question',
  'evaluate_answer',
  'compress_context',
  'self_heal',
]

export interface SandboxRequest {
  agentId: string
  taskType: SandboxTaskType
  traceId: string
  payload: Record<string, unknown>
}

// 出站白名單（Phase 3 生成落地時強制執行；Phase 1 已備妥、未被行使）。
// 註：api.anthropic.com 係付費推理 —— 已列入「$0 裂縫」，唔喺 $0 內。
// Supabase 由 getServiceSupabase 內部走，唔經呢個白名單。
export const OUTBOUND_ALLOWLIST = ['api.anthropic.com'] as const

export function isOutboundAllowed(rawUrl: string): boolean {
  try {
    const host = new URL(rawUrl).hostname
    return OUTBOUND_ALLOWLIST.some((h) => host === h || host.endsWith('.' + h))
  } catch {
    return false
  }
}

// Web Crypto SHA-256 指紋（Edge/Node 20+ 通用）。等價 payload → 同一指紋（穩定序列化）。
export async function executionFingerprint(req: SandboxRequest): Promise<string> {
  const canonical = `${req.agentId}::${req.taskType}::${stableStringify(req.payload)}`
  const bytes = new TextEncoder().encode(canonical)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// 穩定序列化（object key 排序），令語義等價但 key 次序不同嘅 payload 得同一指紋。
function stableStringify(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null'
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`
  const obj = v as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`
}

// Shape-guard：呢個 body 由外部嚟，一律當唔可信輸入。
export function isSandboxRequest(v: unknown): v is SandboxRequest {
  if (!v || typeof v !== 'object') return false
  const s = v as Partial<SandboxRequest>
  return (
    typeof s.agentId === 'string' &&
    s.agentId.length > 0 &&
    s.agentId.length <= 100 &&
    typeof s.traceId === 'string' &&
    s.traceId.length > 0 &&
    s.traceId.length <= 100 &&
    typeof s.taskType === 'string' &&
    (SANDBOX_TASK_TYPES as string[]).includes(s.taskType) &&
    !!s.payload &&
    typeof s.payload === 'object' &&
    !Array.isArray(s.payload)
  )
}
