// ============================================================================
// sync-conflict-repro.mts —— 跨裝置同步衝突重現（唯讀，唔改任何嘢）
// ----------------------------------------------------------------------------
//   npx tsx scripts/sync-conflict-repro.mts
//
// 2027 目標書階段四：「排查 applyLocal 邏輯」「0 進度覆蓋事故」。
// 本腳本唔係斷言有 bug，係【重現】—— 用真實嘅 mergeSnapshots 逐格跑，
// 睇實際掉唔掉資料。有就有，冇就冇，數字講嘢。
//
// ⚠️ 純函數層，唔掂 localStorage、唔掂 Supabase、唔改代碼。
// ============================================================================

// mergeSnapshots 唔掂 browser API，可以直接 import。
// （applyLocal 就唔得 —— 佢寫 localStorage，所以本腳本只驗 merge 決策。）
const { mergeSnapshots } = await import('../lib/sync.ts')

type Attempt = { id: string; subjectId: string; score: number; total: number; timestamp: number }
type Snap = {
  dse_progress: Attempt[]
  dse_free_attempts_total: number
  dse_topic_stats?: Record<string, { total: number; wrong: number }>
  updatedAt: number | null
  syncedAt: number | null
}
const snap = (attempts: Attempt[], updatedAt: number | null, syncedAt: number | null): Snap => ({
  dse_progress: attempts,
  dse_free_attempts_total: attempts.length,
  dse_topic_stats: Object.fromEntries(attempts.map((a) => [`${a.subjectId}::t`, { total: a.total, wrong: a.total - a.score }])),
  updatedAt, syncedAt,
})
const A = (id: string, subj: string, t: number): Attempt => ({ id, subjectId: subj, score: 8, total: 10, timestamp: t })

let failures = 0
const check = (name: string, got: string[], want: string[]) => {
  const ok = got.length === want.length && got.every((x) => want.includes(x))
  if (!ok) failures++
  console.log(`\n${ok ? '✅' : '❌'} ${name}`)
  console.log(`   保住：${got.join(', ') || '(冇)'}`)
  console.log(`   應有：${want.join(', ')}`)
  if (!ok) {
    const lost = want.filter((x) => !got.includes(x))
    console.log(`   ⚠️  掉失：${lost.join(', ')}`)
  }
}

console.log(`\n${'═'.repeat(72)}\n  跨裝置同步衝突重現（Mobile ↔ iPad ↔ Desktop）\n${'═'.repeat(72)}`)
console.log(`\n用真實 lib/sync.ts 嘅 mergeSnapshots，逐格模擬。`)

// ── 情境 1：正常先後 —— 手機做完，iPad 拉落嚟 ──────────────────────────────
{
  const mobile = snap([A('m1', 'math', 1000)], 1000, 900)
  const ipadLocal = snap([], null, null) // 全新機，未同步過
  const win = mergeSnapshots(ipadLocal as never, { progress: mobile as never, updated_at: null } as never) as Snap
  check('情境 1 · 全新 iPad 拉手機進度（防線 B：完整者勝）',
    win.dse_progress.map((a) => a.id), ['m1'])
}

// ── 情境 2：兩部機都同步過，一部離線做多咗 ────────────────────────────────
{
  // 手機同 iPad 都已經同步過，各自有 m1。
  // iPad 離線做多咗一節（i1），跟住上傳 → 雲端 = [m1, i1]，updatedAt=2000
  const cloud = snap([A('m1', 'math', 1000), A('i1', 'econ', 2000)], 2000, 1500)
  // 手機【冇拉過】就自己做多咗一節（m2），updatedAt=3000（比雲端新）
  const mobile = snap([A('m1', 'math', 1000), A('m2', 'chem', 3000)], 3000, 1500)
  const win = mergeSnapshots(mobile as never, { progress: cloud as never, updated_at: null } as never) as Snap
  check('情境 2 · 兩部機各自離線做題，手機較新（防線 C：較新者勝）',
    win.dse_progress.map((a) => a.id), ['m1', 'i1', 'm2'])
}

// ── 情境 3：三裝置 —— goal 明文提到嘅 Mobile → iPad → Desktop ──────────────
{
  const t0 = [A('s0', 'math', 1000)]
  // Desktop 拉走 s0 之後離線做 d1
  const desktop = snap([...t0, A('d1', 'bio', 2000)], 2000, 1000)
  // 同一時間 iPad 亦離線做 i1，較遲上傳 → 雲端 = [s0, i1]
  const cloud = snap([...t0, A('i1', 'phys', 2500)], 2500, 1000)
  const win = mergeSnapshots(desktop as never, { progress: cloud as never, updated_at: null } as never) as Snap
  check('情境 3 · 三裝置並行（Mobile→iPad→Desktop）',
    win.dse_progress.map((a) => a.id), ['s0', 'd1', 'i1'])
}

// ── 情境 4：課題統計（雷達圖）—— 共同歷史 ＋ 兩邊各自再累積 ────────────────
//
// 2026-09-11 簽署「基於 Timestamp 嘅增量 Union」之後改寫。
// 舊版只測「兩邊各自累積【唔同科】」—— 嗰個情況連取 max 都過到關，
// 測唔出真正嘅難題。真正嘅難題係【同一個課題兩邊都做過】：
//
//   基準（上次同步）  math::algebra 20 題做過 · 5 題錯
//   手機再做 10 題，3 題錯  → 本機 30 / 8
//   iPad 再做  6 題，1 題錯 → 雲端 26 / 6
//
//   正解 36 / 9（20 + 10 + 6 · 5 + 3 + 1）
//   相加 → 56 / 14（共同嗰 20 題被雙計）
//   取max → 30 / 8（掉失 iPad 嗰 6 題）
//   跟贏家 → 30 / 8（同上）
//
// 順帶保留「兩邊唔同科」嘅檢查，確保新邏輯冇整爛舊有嘅正確行為。
{
  const base = {
    'math::algebra': { total: 20, wrong: 5 },
  }
  const cloud = snap([A('c1', 'math', 1000)], 1000, 500)
  cloud.dse_topic_stats = {
    'math::algebra': { total: 26, wrong: 6 }, // iPad 再做咗 6 題
  }
  const local = snap([A('l1', 'econ', 2000)], 2000, 500)
  local.dse_topic_stats = {
    'math::algebra': { total: 30, wrong: 8 }, // 手機再做咗 10 題
    'econ::demand': { total: 15, wrong: 3 }, // 手機新開嘅課題，雲端未見過
  }
  const win = mergeSnapshots(
    local as never,
    { progress: cloud as never, updated_at: null } as never,
    base as never,
  ) as Snap
  const fmt = (m: Record<string, { total?: number; wrong?: number }> | undefined) =>
    Object.entries(m ?? {})
      .map(([k, v]) => `${k}=${v?.total ?? 0}/${v?.wrong ?? 0}`)
      .sort()
  check('情境 4 · 錯題 DNA 雷達（共同歷史 ＋ 兩邊各自再累積）',
    fmt(win.dse_topic_stats as never),
    ['econ::demand=15/3', 'math::algebra=36/9'])
}

console.log(`\n${'─'.repeat(72)}`)
if (failures) {
  console.log(`${failures} / 4 個情境有掉失。`)
  console.log(``)
  console.log(`━━ 進度（dse_progress ／ dse_reverse_log）—— 2026-09-10 已修 ━━`)
  console.log(`  原本 mergeSnapshots 係【整份快照二選一】，輸嗰邊嘅 dse_progress`)
  console.log(`  連同入面所有節一次過丟棄。情境 2、3 就係咁掉嘅。`)
  console.log(`  已改為：贏家決定唔可合併嘅欄位，而 append-only 嘅欄位改行 union。`)
  console.log(`  Union 只會加返被丟棄嘅記錄，數學上刪唔到任何一條 ——`)
  console.log(`  最壞情況等於改動前，唔存在「改完掉多咗」呢個可能。`)
  console.log(``)
  console.log(`━━ 情境 4（dse_topic_stats）━━`)
  console.log(`  逐課題統計行三方增量合併：合併結果 = 雲端 + （本機 − 基準）。`)
  console.log(`  基準係本機記帳（dse_topic_stats_base），永不上雲。`)
  console.log(`  冇蓋到章嗰陣會退回【逐欄取 max】—— 唔會雙計，但會掉失另一邊嘅增量。`)
  console.log(`  所以呢個紅最可能係 markTopicBase() 冇喺 push 成功／applyLocal 之後叫，`)
  console.log(`  而唔係合併公式本身錯。`)
} else {
  console.log(`✅ 四個情境全部冇掉失。`)
  console.log(`   情境 4 由 2026-09-11 起應該綠 —— 逐課題統計行三方增量合併`)
  console.log(`   （基準由 markTopicBase() 喺每次成功同步之後蓋章）。`)
  console.log(`   ⚠️ 若情境 4 再度轉紅，先查 markTopicBase() 嘅呼叫仲喺唔喺，`)
  console.log(`      冇基準就會靜靜哋退回保守嘅取 max。`)
}
console.log(`\n本腳本唯讀 —— 只跑 mergeSnapshots，冇掂 localStorage、冇寫 Supabase。\n`)
process.exit(0)
