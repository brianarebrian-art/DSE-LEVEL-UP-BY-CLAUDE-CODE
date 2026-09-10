// Cross-device progress sync helpers (client-side, SSR-safe, no React).
//
// Reuses the EXISTING localStorage keys verbatim (防線 A) — the synced blob is just
// a snapshot of `dse_progress`, `dse_free_attempts_total` and `dse_topic_stats`.
// Two extra bookkeeping markers drive the smart-merge:
//   dse_updated_at — wall-clock ms of the last LOCAL change (any device)
//   dse_synced_at  — set once this device has merged with the cloud at least once
// All access is guarded by `typeof window` so it never runs during SSR (防線 B).

import { ACTIVE_SESSION_KEY, type ActiveSession } from '@/lib/sessionResume'

const KEYS = {
  progress: 'dse_progress',
  counter: 'dse_free_attempts_total',
  topicStats: 'dse_topic_stats',
  reverseLog: 'dse_reverse_log',
} as const
const UPDATED_AT = 'dse_updated_at'
const SYNCED_AT = 'dse_synced_at'
const SYNC_OWNER = 'dse_sync_owner' // which user id the local data last synced as

/** Window event fired after a LOCAL progress change (drives debounced push + UI). */
export const PROGRESS_EVENT = 'dse:progress-changed'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}
function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function readNum(key: string): number | null {
  if (!isBrowser()) return null
  try {
    const v = localStorage.getItem(key)
    if (v == null) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export interface Snapshot {
  dse_progress: unknown[]
  dse_free_attempts_total: number
  /** 逐課題累計（做過／錯咗）。2026-09-07 起重新上傳（憲章 §16.E，2026-09-04 雙簽）。 */
  dse_topic_stats?: Record<string, unknown>
  /**
   * 未完成嗰節練習，包括 `answers[].selectedZh`（＝答案原文）。
   * 2026-09-08 起上傳 —— 憲章 §16.E 約束 5 已修訂，見 snapshotLocal 說明。
   */
  dse_active_session?: ActiveSession | null
  /**
   * 錯因自診紀錄，包括 `selected` / `correct`（＝答案原文）。
   * 2026-09-08 起上傳 —— 同上。
   */
  dse_reverse_log?: unknown[]
  updatedAt: number | null // last local change (device wall-clock ms)
  syncedAt: number | null // last cloud merge on THIS device
}

export interface CloudData {
  progress: Snapshot | null
  updated_at: string | null // server timestamptz of the cloud row
}

/**
 * Snapshot the current local progress for upload / comparison.
 *
 * ══ 2026-08-26 資料邊界修正（P0，Brian／Yuna 批准）══
 *
 * 【剔走 dse_active_session】——「答案原文」唔可以離開部機。
 * 該物件嘅 `answers[].selectedZh` 係學生揀嗰個選項嘅【文字內容】，之前會連同
 * user_id 一齊 upsert 入 Supabase `user_progress.progress_data`。三份安全文件
 * 都明文禁止（「作答內容」「答案原文」「人工閱讀個人作答」）。
 *
 * 點解係整個剔走，而唔係淨係剝走 `selectedZh`：
 *   · `answers[]` 入面【冇】questionId 欄位（題目 id 喺平行陣列 `questionIds`），
 *     所以「只保留 questionId」呢個做法喺呢個結構度做唔到。
 *   · `isCorrect` 剝唔得 —— PracticeSession.tsx:552 靠佢計分
 *     （`newAnswers.filter(a => a?.isCorrect).length`）。剝咗，跨機續做嘅學生
 *     會見到一個【靜靜計錯咗】嘅分數，比私隱問題更差。
 *   · `selectedZh` 亦剝唔得 —— PracticeSession.tsx:592 喺節末要用佢砌
 *     `/api/result/verify` 嘅覆核 payload；剝咗，之前答過嗰啲題會被當成冇作答。
 *   → 所以唯一唔會整錯分數、又完全止血嘅做法，就係唔上傳。
 *
 * 犧牲咗嘅：喺【另一部機】接住做未完成嗰節。同一部機續做完全冇影響
 * （localStorage 一個字都冇郁），做完嘅結果亦照樣經 `dse_progress` 同步。
 *
 * 【dse_topic_stats 已於 2026-09-07 重新加入】—— 2026-08-25 曾經剔走，
 * 但憲章 §16.E 已於 2026-09-04 由 Brian ＋ Yuna 雙簽【明文批准】此 key 上雲
 * （執行第 1 點：「已批准：dse_progress、dse_free_attempts_total、
 * dse_topic_stats」）。代碼一直未跟，形成憲章同實作漂移 ——
 * 條文批准咗，學生換部機雷達圖依然由零開始。此處補回。
 *
 * §16.E 七條約束全部維持：只限用戶本人查閱（/api/progress 已按
 * session user_id 綁定）、禁止third party、禁止跨用戶比較、唔做付費牆。
 *
 * ⚠️ 空物件唔上傳 —— 見下面 topicStats 段。`applyLocal` 用
 * `if (s.dse_topic_stats)` 判斷，而 `{}` 喺 JS 係 truthy，所以一部
 * 【未累積過】嘅新機一旦上傳 `{}`，就會將雲端已有嘅雷達數據洗白。
 * 只喺有內容時先帶呢個欄位，`undefined` 對 applyLocal 嚟講＝「唔好郁」。
 *
 * ══ 2026-09-08 修訂：答案原文改為上雲（憲章 §16.E 約束 5 已修訂）══
 *
 * 【dse_active_session ＋ dse_reverse_log 現在會上傳】，兩者都含答案原文
 * （前者 `answers[].selectedZh`，後者 `selected` / `correct`）。
 *
 * 裁決：Yuna（COO）2026-09-08 就本條單獨開題並選定「選項 C：整個上傳」，
 * 理由係跨裝置連續性 —— 手機做到一半，返到屋企用 iPad 接唔返，對焦慮症
 * 同 SEN 學生造成嘅打擊，大過答案原文留喺 server 嘅風險。
 * 憲章 §1.1「學生成效與長期信任為最高原則」。
 * ⬜ 待 Brian 副署 —— §16.E 原條文係雙簽寫入，修訂亦應雙簽。
 * 修訂全文：docs/charter-amendment-2026-09-08.md
 *
 * 【點解之前禁】（保留存檔，唔好當佢消失咗）：2026-08-26 修正嘅起因，係
 * `selectedZh` 曾經【冇人為呢件事做過決定】就連同 user_id upsert 咗上雲。
 * 今次唔同嘅唔係風險大細，係【有冇人決定過】—— 前者係漏，後者係簽咗名嘅取捨。
 *
 * 【同時生效嘅約束】：
 *   · 只限用戶本人查閱 —— /api/progress 按 session user_id 綁定，
 *     admin 面板明文唔掂呢兩個 key（見 app/api/admin/users/stats/route.ts 檔頭）
 *   · 禁止向任何第三方提供、禁止跨用戶匯總比較（§16.E 約束 2／3 不變）
 *   · 私隱頁必須同步講明 —— 已改（app/privacy/PrivacyClient.tsx）
 *   · active session 交卷即 `clearActiveSession()`，所以係短暫嘅；
 *     reverse log 有 CAP 200（lib/reverseLog.ts:33），唔會無限增長
 *
 * ⚠️ 空陣列／空物件唔上傳 —— `applyLocal` 用 truthy 判斷，
 * 一部未累積過嘅新機一旦上傳空值，就會將雲端已有嘅嘢洗白，而且冇聲。
 */
export function snapshotLocal(): Snapshot {
  // 只喺真係累積過先帶呢個欄位 —— 空物件會經 applyLocal 洗走雲端已有嘅雷達。
  const topicStats = readJSON<Record<string, unknown>>(KEYS.topicStats, {})
  const hasTopicStats = topicStats && Object.keys(topicStats).length > 0
  // `null` 同「個 key 根本唔存在」係兩件事：前者代表「嗰節喺呢部機做完咗」，
  // 要傳上去叫其他機清走；後者代表「呢部機冇資料」，唔應該覆蓋雲端。
  // 所以要睇 raw string，唔可以只睇 parse 完嘅值。
  const rawActive = typeof localStorage !== 'undefined' ? localStorage.getItem(ACTIVE_SESSION_KEY) : null
  const activeSession = rawActive === null ? undefined : readJSON<ActiveSession | null>(ACTIVE_SESSION_KEY, null)
  const reverseLog = readJSON<unknown[]>(KEYS.reverseLog, [])
  return {
    dse_progress: readJSON<unknown[]>(KEYS.progress, []),
    dse_free_attempts_total: readNum(KEYS.counter) ?? 0,
    ...(hasTopicStats ? { dse_topic_stats: topicStats } : {}),
    // `null` 有意義（＝嗰節喺呢部機做完咗，要通知其他機清走），所以照帶。
    ...(activeSession !== undefined ? { dse_active_session: activeSession } : {}),
    ...(reverseLog.length > 0 ? { dse_reverse_log: reverseLog } : {}),
    updatedAt: readNum(UPDATED_AT),
    syncedAt: readNum(SYNCED_AT),
  }
}

// "Completeness" score — bigger means more effort to preserve (防線 E 情境 B,
// "數值較大者 / 較完整者"). Attempts dominate; topic volume and the counter break ties.
function score(s: Snapshot): number {
  const attempts = Array.isArray(s.dse_progress) ? s.dse_progress.length : 0
  let topicTotal = 0
  for (const v of Object.values(s.dse_topic_stats || {})) {
    const t = (v as { total?: number } | null)?.total
    if (typeof t === 'number') topicTotal += t
  }
  const counter = Number(s.dse_free_attempts_total) || 0
  // ⚠️ 未完成嗰節同錯因自診【一定要計入】。
  //    2026-09-10 實測（lib/__tests__/cross-device-e2e.test.mts ①）：
  //    學生喺手機做到第 5 題，跳去一部【從未同步過】嘅機（新電腦、學校電腦、
  //    重灌完個瀏覽器），兩邊 score 都係 0，而防線 B 嘅平手判本機贏 ——
  //    嗰半節就【靜靜哋冇咗】，學生要由第一題重做。
  //
  //    佢哋刻意擺喺 attempts 以下同一個檔次（同 topicTotal / counter 一齊）：
  //    做完嘅節永遠重過未完成嘅節，所以呢個改動只會喺原本平手嗰啲情況度分到勝負，
  //    唔會令一份較少嘅快照贏過一份較多嘅。
  const inflight = Array.isArray(s.dse_active_session?.answers) ? s.dse_active_session.answers.length : 0
  const diagnosed = Array.isArray(s.dse_reverse_log) ? s.dse_reverse_log.length : 0
  return attempts * 1000 + topicTotal + counter + inflight + diagnosed
}

/**
 * Smart merge (防線 E). Returns the winning snapshot — never blindly wipes effort:
 *  - A: no cloud row yet → keep local (it gets pushed up).
 *  - B: this device has never synced (no `syncedAt`) → the more COMPLETE side wins.
 *  - C: this device has synced before → the NEWER change wins (by wall-clock).
 */
export function mergeSnapshots(local: Snapshot, cloud: CloudData): Snapshot {
  const cloudSnap = cloud.progress
  if (!cloudSnap) return local // A

  // ── 邊一邊「贏」———————————————————————————————————————————————————
  // 呢段邏輯逐字不變（防線 A／B／C）。贏家決定嗰啲【唔可以合併】嘅欄位：
  // active session（一節就係一節，冇得合併）、topic stats（見下面）、時間戳。
  let winner: Snapshot
  if (local.syncedAt == null) {
    // B — avoid clobbering: take whichever side has more data.
    winner = score(local) >= score(cloudSnap) ? local : cloudSnap
  } else {
    // C — both ends are established; newest local change wins.
    const localT = local.updatedAt ?? 0
    const cloudT = cloudSnap.updatedAt ?? (cloud.updated_at ? Date.parse(cloud.updated_at) : 0)
    winner = localT >= cloudT ? local : cloudSnap
  }

  // ── 2026-09-10：append-only 嘅欄位改為【union】而唔係跟贏家 ────────────────
  //
  // 點解要改：原本成個函數 `return local` 或者 `return cloudSnap`，即係整份
  // 快照二選一。輸嗰邊嘅 `dse_progress` 陣列連同入面所有節，一次過被丟棄。
  //
  // 實測重現（scripts/sync-conflict-repro.mts，4 個情境跑咗 3 個掉失）：
  //   · 兩部機各自離線做題 → 掉失一節
  //   · 三裝置並行（Mobile→iPad→Desktop）→ 掉失一節
  //
  // 點解一直冇人察覺：單一裝置用戶永遠撞唔到；兩部機順序使用亦撞唔到，
  // 因為較新嗰邊本身已經包含較舊嗰邊。只有【兩邊各自離線做過題】先會掉。
  //
  // 點解 union 係安全嘅：`dse_progress` 同 `dse_reverse_log` 都係 append-only
  // 而且每條記錄自帶時間戳（AttemptRecord.timestamp / ReverseLogEntry.ts）。
  // Union 只會【加返】被丟棄嘅記錄，數學上唔可能刪走任何一條 ——
  // 即係最壞情況等於改動前，唔存在「改完之後掉多咗」呢個可能。
  //
  // ⚠️ `dse_topic_stats` 【刻意唔 union】。每部機嘅數字係「該機對累積歷史
  //    嘅視角」：兩邊分叉之後，相加會把共同歷史雙計，取 max 又會掉失較細
  //    嗰邊嘅增量。呢個係 CRDT 問題，揀錯會污染現有帳號嘅雷達數據，
  //    而雷達正正係 §16.E 特登開放上雲嗰批 key。故此維持跟贏家，
  //    留待創辦人拍板（scripts/sync-conflict-repro.mts 情境 4 仍然會紅，
  //    嗰個紅係【故意留住】嘅提醒，唔係未修好嘅疏忽）。
  const mergedProgress = unionBy(
    asArray(local.dse_progress),
    asArray(cloudSnap.dse_progress),
    (r) => `${(r as { timestamp?: number })?.timestamp ?? ''}|${(r as { subjectId?: string })?.subjectId ?? ''}`,
    (a, b) => ((a as { timestamp?: number })?.timestamp ?? 0) - ((b as { timestamp?: number })?.timestamp ?? 0), // push 順序＝舊到新
  )
  // reverse log 用 unshift 寫入（新到舊），並有 CAP 200（lib/reverseLog.ts:33）。
  // Union 之後照樣新到舊排並截 200，唔可以無視個 CAP —— 否則同步會令本機
  // 嘅日誌長過本機自己寫得出嘅上限。
  const mergedReverse = unionBy(
    asArray(local.dse_reverse_log),
    asArray(cloudSnap.dse_reverse_log),
    (r) => `${(r as { ts?: number })?.ts ?? ''}|${(r as { questionId?: string })?.questionId ?? ''}`,
    (a, b) => ((b as { ts?: number })?.ts ?? 0) - ((a as { ts?: number })?.ts ?? 0), // unshift 順序＝新到舊
  ).slice(0, REVERSE_LOG_CAP)

  const out: Snapshot = {
    ...winner,
    dse_progress: mergedProgress,
    // 計數器唔可以跟贏家 —— 贏家嗰邊嘅數可能細過合併後嘅實際節數。
    // 取三者最大值，保證同步之後永遠唔會倒退。
    dse_free_attempts_total: Math.max(
      Number(local.dse_free_attempts_total) || 0,
      Number(cloudSnap.dse_free_attempts_total) || 0,
      mergedProgress.length,
    ),
  }
  // `undefined` 同「空陣列」係兩件事：前者代表舊快照冇呢個欄位，applyLocal
  // 見到 undefined 會【唔郁】本機資料。所以合併結果為空就唔好帶呢個欄位出去，
  // 否則會把一部有日誌嘅機洗成空白（同 snapshotLocal 嗰個空物件陷阱同源）。
  if (mergedReverse.length > 0) out.dse_reverse_log = mergedReverse
  else if (winner.dse_reverse_log !== undefined) out.dse_reverse_log = winner.dse_reverse_log

  return out
}

/** reverse log 上限，同 lib/reverseLog.ts 嘅 CAP 一致。 */
const REVERSE_LOG_CAP = 200

const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])

/**
 * 兩個 append-only 陣列嘅聯集，按 `key` 去重，再按 `cmp` 排序。
 *
 * 去重鍵用「時間戳 ＋ 識別欄」而唔係整條記錄 JSON：同一條記錄喺兩部機之間
 * 來回同步之後，欄位次序或者 optional 欄可能唔完全一樣（例如 `topicEn`
 * 係 2026-08-23 之後先加），JSON 比對會當佢哋係兩條而造成重複。
 */
function unionBy(
  a: unknown[],
  b: unknown[],
  key: (r: unknown) => string,
  cmp: (x: unknown, y: unknown) => number,
): unknown[] {
  const seen = new Set<string>()
  const out: unknown[] = []
  for (const r of [...a, ...b]) {
    const k = key(r)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(r)
  }
  return out.sort(cmp)
}

/** Write a winning snapshot back to local storage + stamp the sync markers. */
export function applyLocal(s: Snapshot): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(KEYS.progress, JSON.stringify(s.dse_progress ?? []))
    localStorage.setItem(KEYS.counter, String(Number(s.dse_free_attempts_total) || 0))
    // ⚠️ 唔可以寫成 `s.dse_topic_stats ?? {}` —— 而家 snapshotLocal 唔再帶呢個欄位，
    // 一律 `?? {}` 會將本機累積咗嘅課題統計【洗成空白】。同 active session 一樣：
    // 有值先覆蓋，`{}`（換用戶嘅乾淨石板）先清走，`undefined` 就唔郁。
    if (s.dse_topic_stats) {
      localStorage.setItem(KEYS.topicStats, JSON.stringify(s.dse_topic_stats))
    }
    // In-progress run: adopt the winner's. An explicit null means the run was finished
    // (or abandoned) on the winning device, so clear it here too. `undefined` means the
    // snapshot predates this field — leave whatever this device has untouched.
    if (s.dse_active_session) {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(s.dse_active_session))
    } else if (s.dse_active_session === null) {
      // ⚠️ 寫 'null'，唔係 removeItem。
      //    removeItem 之後，呢部機下次 snapshotLocal 會出 `undefined`（＝「呢部機
      //    冇資料，唔好郁雲端」），於是「嗰節做完咗」呢個訊號就喺佢手上斷咗 ——
      //    一部由頭到尾離線嘅第三部機，永遠等唔到通知，會一路 offer 一節
      //    其實已經交咗卷嘅練習。寫 'null' 令個訊號一路傳得落去。
      localStorage.setItem(ACTIVE_SESSION_KEY, 'null')
    }
    // 錯因自診紀錄。同 topic stats 一樣：有值先覆蓋，`undefined` 就唔郁 ——
    // 唔可以 `?? []`，否則一部舊快照就會將本機累積咗嘅自診記錄洗走。
    if (Array.isArray(s.dse_reverse_log)) {
      localStorage.setItem(KEYS.reverseLog, JSON.stringify(s.dse_reverse_log))
    }
    const now = Date.now()
    localStorage.setItem(UPDATED_AT, String(now))
    localStorage.setItem(SYNCED_AT, String(now))
  } catch {
    /* quota / private mode — soft sync, ignore */
  }
}

/** An empty snapshot — used to give a different user a clean local slate. */
export function emptySnapshot(): Snapshot {
  return {
    dse_progress: [],
    dse_free_attempts_total: 0,
    dse_topic_stats: {},
    dse_active_session: null,
    updatedAt: null,
    syncedAt: null,
  }
}

/** The user id this device's local data last synced as (null if never). */
export function getSyncOwner(): string | null {
  if (!isBrowser()) return null
  try {
    return localStorage.getItem(SYNC_OWNER)
  } catch {
    return null
  }
}
export function setSyncOwner(id: string): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(SYNC_OWNER, id)
  } catch {
    /* ignore */
  }
}

/**
 * Call after any LOCAL progress write (quiz finished, counter incremented, etc.).
 * Stamps the local change time and pings the sync layer (debounced push + reactive
 * re-render). SSR-safe no-op on the server.
 */
export function notifyProgressChanged(): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(UPDATED_AT, String(Date.now()))
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  } catch {
    /* ignore */
  }
}
