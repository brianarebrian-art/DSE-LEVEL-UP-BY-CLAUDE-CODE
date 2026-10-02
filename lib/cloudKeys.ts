// 上雲 key 的唯一清單（憲章 §16.E）。client（StoredDataInspector、信任中心、私隱頁）
// 與 server（/api/progress 的白名單過濾）共用。新增任何一個 key 仍須創辦人明確決定。
/**
 * 登入後會上傳到 Supabase 嘅 key。
 *
 * ⚠️ 有【兩條】獨立同步通道，一開始只計到第一條就會向學生講漏嘢：
 *   ① 進度   —— lib/sync.ts snapshotLocal() → POST /api/progress → user_progress
 *   ② 設定   —— lib/settingsSync.ts pushSettings() → user_settings
 * 兩條都要列。有測試把關，加咗新 key 而冇更新呢度就會 fail。
 */
export const CLOUD_PROGRESS_KEYS = [
  'dse_progress',
  'dse_free_attempts_total',
  'dse_topic_stats',
  'dse_active_session',
  'dse_reverse_log',
  'dse_electives', // 2026-09-26, Yuna: elective choices follow the student to another device
] as const

export const CLOUD_SETTINGS_KEYS = [
  'dse_easy_font',
  'dse_reading_ruler',
  'dse_hide_timer',
  'dse_font_size',
  'dse_line_height',
  'dse_letter_spacing',
  'dse_relax_sensory_pref',
] as const

export const CLOUD_KEYS = [...CLOUD_PROGRESS_KEYS, ...CLOUD_SETTINGS_KEYS] as const

/** 上雲 key 總數。私隱頁標題同登入說明（components/SignInNote.tsx）用同一個數。 */
export const CLOUD_COUNT = CLOUD_KEYS.length
