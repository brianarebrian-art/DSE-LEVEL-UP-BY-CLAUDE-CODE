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

// ── 情境 4：課題統計（雷達圖）—— 兩邊各自累積 ──────────────────────────────
{
  const cloud = snap([A('c1', 'math', 1000)], 1000, 500)
  cloud.dse_topic_stats = { 'math::algebra': { total: 20, wrong: 5 } }
  const local = snap([A('l1', 'econ', 2000)], 2000, 500)
  local.dse_topic_stats = { 'econ::demand': { total: 15, wrong: 3 } }
  const win = mergeSnapshots(local as never, { progress: cloud as never, updated_at: null } as never) as Snap
  check('情境 4 · 錯題 DNA 雷達（兩邊各自累積唔同科）',
    Object.keys(win.dse_topic_stats ?? {}), ['math::algebra', 'econ::demand'])
}

console.log(`\n${'─'.repeat(72)}`)
if (failures) {
  console.log(`❌ ${failures} / 4 個情境有進度掉失。`)
  console.log(``)
  console.log(`成因（讀 lib/sync.ts:178 mergeSnapshots）：`)
  console.log(`  防線 C 寫住 \`return localT >= cloudT ? local : cloudSnap\` ——`)
  console.log(`  即係【整份快照二選一】，唔係逐欄合併。輸嗰邊嘅 dse_progress 陣列`)
  console.log(`  連同佢入面所有節，一次過被丟棄。`)
  console.log(``)
  console.log(`  防線 B（未同步過）用 score() 比完整度，同樣係二選一。`)
  console.log(``)
  console.log(`點解一直冇人察覺：單一裝置用戶永遠唔會撞到（冇第二邊）。`)
  console.log(`兩部機順序使用（做完 A 機先開 B 機）亦唔會撞到 —— 因為較新嗰邊`)
  console.log(`本身已經包含較舊嗰邊嘅資料。只有【兩邊各自離線做過題】先會掉。`)
  console.log(``)
  console.log(`⚠️ 呢個係重現，唔係修正。dse_progress 係 append-only 而且每條有`)
  console.log(`   timestamp，理論上可以按 timestamp 去重合併而唔掉任何嘢 ——`)
  console.log(`   但改 merge 語意會影響 177 個現存帳號，屬 Phase 2，要人拍板。`)
} else {
  console.log(`✅ 四個情境全部冇掉失。`)
}
console.log(`\n唯讀 —— 冇改代碼、冇掂 localStorage、冇寫 Supabase。\n`)
process.exit(0)
