// Per-sub-topic answer tally for the "weakness brain" (radar chart + repair
// worksheet). Stored in localStorage under `dse_topic_stats`, keyed by
// `${subjectId}::${topicId}`. Purely client-side and null-safe; degrades to no-op
// without a browser. This is the live error-weight signal that adaptive worksheets
// and the dashboard radar both read.

import { notifyProgressChanged } from '@/lib/sync'

const KEY = 'dse_topic_stats'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

interface Row {
  subjectId: string
  topic: string // topic id
  label: string // display label (topicZh)
  /**
   * English display label (topicEn). Optional on purpose: rows written before
   * 2026-08-23 have no such field, and an existing tally must never be
   * invalidated by a schema addition (charter §6). Readers fall back to `label`.
   */
  labelEn?: string
  total: number
  wrong: number
}
type Store = Record<string, Row>

function load(): Store {
  if (!isBrowser()) return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {}
  } catch {
    return {}
  }
}
function save(s: Store): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* quota / private mode — soft signal, ignore */
  }
}

export interface TopicStatEntry extends Row {
  key: string
}

/** Fold one finished run's per-topic outcomes into the tally. */
export function recordTopicOutcomes(
  subjectId: string,
  rows: { topic: string; label: string; labelEn?: string; correct: number; total: number }[],
): void {
  if (!isBrowser() || !rows.length) return
  const s = load()
  for (const r of rows) {
    if (!r.topic || r.total <= 0) continue
    const k = `${subjectId}::${r.topic}`
    const e = s[k] ?? { subjectId, topic: r.topic, label: r.label, total: 0, wrong: 0 }
    e.total += r.total
    e.wrong += Math.max(0, r.total - r.correct)
    e.label = r.label || e.label
    // 補回英文課題名（非華語考生）。舊 row 一答新題就會補到，唔使 migration。
    if (r.labelEn) e.labelEn = r.labelEn
    s[k] = e
  }
  save(s)
  notifyProgressChanged() // queue a debounced cloud sync (if signed in)
}

export function getTopicStats(): TopicStatEntry[] {
  return Object.entries(load()).map(([key, v]) => ({ key, ...v }))
}

/**
 * 按語言取課題顯示名。英文介面之下，舊紀錄（未有 labelEn）會回落中文名 ——
 * 顯示中文名總好過顯示 topic id 或者空白。
 */
export function topicLabel(e: { label: string; labelEn?: string }, en: boolean): string {
  return en ? (e.labelEn || e.label) : e.label
}

export function winRate(e: { total: number; wrong: number }): number {
  return e.total > 0 ? (e.total - e.wrong) / e.total : 0
}

/** Weakest topics (lowest win rate first), optionally scoped to one subject. */
export function weakestTopics(opts?: {
  subjectId?: string
  min?: number
  limit?: number
}): TopicStatEntry[] {
  const min = opts?.min ?? 1
  let arr = getTopicStats().filter((e) => e.total >= min)
  if (opts?.subjectId) arr = arr.filter((e) => e.subjectId === opts.subjectId)
  return arr.sort((a, b) => winRate(a) - winRate(b)).slice(0, opts?.limit ?? 6)
}

export function resetTopicStats(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
