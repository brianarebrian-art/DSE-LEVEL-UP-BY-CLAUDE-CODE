// Tracks which question IDs a user was recently shown, per subject, in
// localStorage. A new practice run prefers questions NOT in this list, so
// re-doing a subject surfaces fresh questions first and only repeats once the
// whole bank has been cycled through. Purely client-side; degrades gracefully.

const KEY_PREFIX = 'dse_seen_'
// How many recent IDs to remember per subject.
//
// ⚠️ 呢個數【必須】大過最大嗰科嘅題數，否則檔頭嗰句「only repeats once the whole
// bank has been cycled through」就唔成立：一超過上限，最舊嗰批 id 會跌出名單，
// 學生會喺仲有大量從未見過嘅題目嘅情況下撞返舊題。
//
// 2026-08-27 實測（舊值 300 之下）：數學 914 條只保證頭 33% 唔重複、物理 620 條
// 48%、M1 422 條 71%、經濟 396 條 76%、BAFS 304 條 99% —— 五科受影響。
// 學生因此會覺得「個題庫得百零題」，而實際上題目係喺度嘅，只係輪唔到。
//
// 新值 1500：覆蓋現時最大嘅 914，亦覆蓋「每科 1,000 題」呢個目標，仲有餘裕。
// 儲存代價：1500 個 id × 約 12 bytes ≈ 18KB／科，localStorage 額度綽綽有餘。
//
// lib/__tests__/seen-window.test.mts 鎖住呢個不變式 —— 任何一科題數升穿
// WINDOW，測試即刻紅，逼人有意識咁調高，唔會靜靜地退化。
const WINDOW = 1500

function storageKey(subjectId: string): string {
  return `${KEY_PREFIX}${subjectId}`
}

// Recently-shown question IDs for a subject, most-recent first.
export function getSeen(subjectId: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(subjectId))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

// Record the IDs just shown. They are moved to the front; older entries are kept
// (deduped) up to WINDOW so the rotation order is preserved.
export function recordSeen(subjectId: string, ids: string[]): void {
  if (typeof window === 'undefined' || ids.length === 0) return
  try {
    const prev = getSeen(subjectId)
    const merged = [...ids, ...prev.filter((id) => !ids.includes(id))].slice(0, WINDOW)
    localStorage.setItem(storageKey(subjectId), JSON.stringify(merged))
  } catch {
    // storage unavailable (private mode / quota) — anti-repeat just no-ops
  }
}
