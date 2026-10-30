/**
 * Founder AI 指令列 —— 分類與安全確認。
 * 冇 AI API 時只提供結構化本地查詢／搜尋，唔假裝有模型回答。
 */

import { createHash } from 'node:crypto'
import { FOUNDER_ALL_HREFS, FOUNDER_NAV } from './nav'

export type CommandKind = 'readonly' | 'draft' | 'side_effect'

export type ParsedCommand = {
  kind: CommandKind
  intent: string
  label: string
  /** 唯讀／草稿可直接執行；副作用要確認。 */
  requiresConfirm: boolean
  /** 本地可執行嘅動作 id */
  actionId:
    | 'search_nav'
    | 'briefing_draft'
    | 'compare_reports'
    | 'list_pending_reviews'
    | 'ai_cost_analysis'
    | 'create_review_draft'
    | 'unknown'
  params: Record<string, string>
}

export function classifyCommand(raw: string): ParsedCommand {
  const text = raw.trim()
  const lower = text.toLowerCase()

  if (!text) {
    return {
      kind: 'readonly',
      intent: 'empty',
      label: '空白指令',
      requiresConfirm: false,
      actionId: 'unknown',
      params: {},
    }
  }

  if (/簡報|briefing/.test(lower)) {
    return {
      kind: 'draft',
      intent: 'daily_briefing',
      label: '草擬今日創辦人簡報',
      requiresConfirm: false,
      actionId: 'briefing_draft',
      params: {},
    }
  }
  if (/錯題回報|report.?rate|回報率/.test(lower)) {
    return {
      kind: 'readonly',
      intent: 'compare_reports',
      label: '比較各科錯題回報',
      requiresConfirm: false,
      actionId: 'compare_reports',
      params: { weeks: '4' },
    }
  }
  if (/未完成覆核|pending.?review|待覆核/.test(lower)) {
    return {
      kind: 'readonly',
      intent: 'list_pending_reviews',
      label: '列出未完成覆核題目',
      requiresConfirm: false,
      actionId: 'list_pending_reviews',
      params: {},
    }
  }
  if (/ai.?成本|成本變化|cost/.test(lower)) {
    return {
      kind: 'readonly',
      intent: 'ai_cost',
      label: '分析 AI 成本變化',
      requiresConfirm: false,
      actionId: 'ai_cost_analysis',
      params: {},
    }
  }
  if (/建立覆核|覆核任務草稿|create.?review/.test(lower)) {
    return {
      kind: 'side_effect',
      intent: 'create_review_draft',
      label: '建立覆核任務草稿',
      requiresConfirm: true,
      actionId: 'create_review_draft',
      params: { questionId: extractQuestionId(text) ?? '' },
    }
  }
  if (/發佈|下架|刪除|匯出/.test(lower)) {
    return {
      kind: 'side_effect',
      intent: 'dangerous_keyword',
      label: '具副作用操作（需確認）',
      requiresConfirm: true,
      actionId: 'unknown',
      params: { raw: text.slice(0, 200) },
    }
  }

  return {
    kind: 'readonly',
    intent: 'search',
    label: '導航／模組搜尋',
    requiresConfirm: false,
    actionId: 'search_nav',
    params: { q: text.slice(0, 120) },
  }
}

function extractQuestionId(text: string): string | null {
  const m = text.match(/\b([a-z]{1,12}[-_][a-z0-9_-]{2,80})\b/i)
  return m ? m[1] : null
}

export function payloadHash(action: string, payload: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify({ action, payload }))
    .digest('hex')
}

export function searchFounderNav(q: string): { href: string; label: string; group: string }[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  const out: { href: string; label: string; group: string }[] = []
  for (const g of FOUNDER_NAV) {
    for (const item of g.items) {
      const hay = `${item.label} ${item.labelEn} ${item.href}`.toLowerCase()
      if (hay.includes(needle)) out.push({ href: item.href, label: item.label, group: g.label })
    }
  }
  // 亦允許直接路徑匹配
  for (const href of FOUNDER_ALL_HREFS) {
    if (href.includes(needle) && !out.some((o) => o.href === href)) {
      out.push({ href, label: href, group: '路徑' })
    }
  }
  return out.slice(0, 12)
}

/** 學生輸入／題目內容／工單文字視為不可信 —— 唔當系統指令執行。 */
export function sanitizeUntrustedContext(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '[已移除程式碼區塊]')
    .replace(/\b(system|assistant)\s*:/gi, '[已移除角色標記]')
    .slice(0, 4000)
}
