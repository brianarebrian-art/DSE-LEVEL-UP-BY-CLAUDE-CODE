// ============================================================================
// sync-merge-union.test.mts —— mergeSnapshots 唔准再掉失進度
// ----------------------------------------------------------------------------
// 2026-09-10 修正嘅迴歸鎖。修正之前，mergeSnapshots 係【整份快照二選一】，
// 輸嗰邊嘅 dse_progress 連同入面所有節一次過丟棄。
//
// 實測重現（scripts/sync-conflict-repro.mts）4 個情境跑咗 3 個掉失，
// 包括 Mobile→iPad→Desktop —— 即係跨裝置同步嘅核心用例。
//
// 呢個 bug 難察覺嘅原因：單一裝置用戶永遠撞唔到；兩部機順序使用亦撞唔到
//（較新嗰邊本身已經包含較舊嗰邊）。只有【兩邊各自離線做過題】先會掉。
// 所以佢喺日常使用之下係隱形嘅，只能靠測試守住。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'

const { mergeSnapshots } = await import('../sync.ts')

type Att = { subjectId: string; score: number; total: number; timestamp: number }
const A = (subj: string, t: number): Att => ({ subjectId: subj, score: 8, total: 10, timestamp: t })
const ids = (rows: unknown[]) => rows.map((r) => `${(r as Att).subjectId}@${(r as Att).timestamp}`)

const snap = (o: Partial<Record<string, unknown>>) => ({
  dse_progress: [],
  dse_free_attempts_total: 0,
  updatedAt: null,
  syncedAt: null,
  ...o,
}) as never
const cloudOf = (s: unknown) => ({ progress: s, updated_at: null }) as never

// ── ① 兩邊各自離線做題 —— 本來會掉失輸嗰邊 ─────────────────────────────────
test('兩部機各自離線做題，兩邊嘅節都要保住', () => {
  const cloud = snap({ dse_progress: [A('math', 1000), A('econ', 2000)], dse_free_attempts_total: 2, updatedAt: 2000, syncedAt: 1500 })
  const local = snap({ dse_progress: [A('math', 1000), A('chem', 3000)], dse_free_attempts_total: 2, updatedAt: 3000, syncedAt: 1500 })
  const out = mergeSnapshots(local, cloudOf(cloud))
  assert.deepEqual(ids(out.dse_progress), ['math@1000', 'econ@2000', 'chem@3000'],
    '合併後應包含兩邊全部節，並按 timestamp 由舊到新（dse_progress 用 push 寫入）')
})

// ── ② 三裝置並行 —— goal 明文嘅 Mobile→iPad→Desktop ────────────────────────
test('三裝置並行唔可以掉失任何一部嘅進度', () => {
  const shared = A('math', 1000)
  const cloud = snap({ dse_progress: [shared, A('phys', 2500)], updatedAt: 2500, syncedAt: 1000 })
  const desktop = snap({ dse_progress: [shared, A('bio', 2000)], updatedAt: 2000, syncedAt: 1000 })
  const out = mergeSnapshots(desktop, cloudOf(cloud))
  assert.equal(out.dse_progress.length, 3, '共同嗰節唔可以重複，另外兩節唔可以掉')
  assert.deepEqual(ids(out.dse_progress), ['math@1000', 'bio@2000', 'phys@2500'])
})

// ── ③ Union 唔可以製造重複 ────────────────────────────────────────────────
//
// 去重鍵用「timestamp + subjectId」而唔係整條 JSON：同一條記錄喺兩部機之間
// 來回同步之後，optional 欄可能唔一樣（例如 topicEn 係 2026-08-23 之後先加），
// JSON 比對會當佢哋係兩條。
test('同一節喺兩邊出現只算一次，即使 optional 欄唔同', () => {
  const a = { ...A('math', 1000), grade: '5**' }
  const b = { ...A('math', 1000) } // 同一節，但少咗 grade
  const out = mergeSnapshots(
    snap({ dse_progress: [a], updatedAt: 1000, syncedAt: 500 }),
    cloudOf(snap({ dse_progress: [b], updatedAt: 900, syncedAt: 500 })),
  )
  assert.equal(out.dse_progress.length, 1, '去重鍵用 timestamp + subjectId，唔係整條 JSON')
})

// ── ④ 計數器唔可以倒退 ────────────────────────────────────────────────────
test('dse_free_attempts_total 唔可以細過合併後嘅節數', () => {
  const out = mergeSnapshots(
    snap({ dse_progress: [A('math', 1000)], dse_free_attempts_total: 1, updatedAt: 3000, syncedAt: 500 }),
    cloudOf(snap({ dse_progress: [A('econ', 2000)], dse_free_attempts_total: 7, updatedAt: 2000, syncedAt: 500 })),
  )
  assert.equal(out.dse_progress.length, 2)
  assert.equal(out.dse_free_attempts_total, 7, '取三者最大值 —— 贏家嗰邊個數可能細過實際節數')
})

// ── ⑤ reverse log 要 union，而且守住 CAP 200 ──────────────────────────────
test('錯因日誌 union 之後仍然守 CAP 200，並保持新到舊', () => {
  const mk = (n: number, base: number) => Array.from({ length: n }, (_, i) => ({ ts: base + i, questionId: `q${base + i}`, cause: 'A' }))
  const out = mergeSnapshots(
    snap({ dse_progress: [], dse_reverse_log: mk(150, 1000), updatedAt: 2000, syncedAt: 500 }),
    cloudOf(snap({ dse_progress: [], dse_reverse_log: mk(150, 5000), updatedAt: 1000, syncedAt: 500 })),
  )
  const log = out.dse_reverse_log as { ts: number }[]
  assert.equal(log.length, 200, 'CAP 同 lib/reverseLog.ts 嘅 200 一致 —— 同步唔可以令日誌長過本機寫得出嘅上限')
  assert.ok(log[0].ts > log[log.length - 1].ts, 'unshift 順序＝新到舊')
  assert.equal(log[0].ts, 5149, '截走嘅應該係最舊嗰批')
})

// ── ⑥ 空值唔可以洗走另一邊 ────────────────────────────────────────────────
//
// `undefined` 同「空陣列」係兩件事：前者代表舊快照冇呢個欄位，applyLocal
// 見到 undefined 會唔郁本機資料。合併結果為空就唔應該帶呢個欄位出去。
test('一邊冇錯因日誌，唔可以把另一邊洗成空白', () => {
  const entries = [{ ts: 9000, questionId: 'q1', cause: 'B' }]
  const out = mergeSnapshots(
    snap({ dse_progress: [], dse_reverse_log: entries, updatedAt: 1000, syncedAt: 500 }),
    cloudOf(snap({ dse_progress: [], updatedAt: 9999, syncedAt: 500 })), // 雲端較新但冇日誌
  )
  assert.equal((out.dse_reverse_log as unknown[]).length, 1, '雲端贏咗時間戳，但佢冇日誌 —— 唔可以因此洗走本機嘅')
})

// ── ⑦ 防線 A／B／C 嘅贏家判定唔准改 ───────────────────────────────────────
//
// 本次修正只改「輸嗰邊嘅 append-only 欄位唔再丟棄」。邊一邊做贏家、
// 由贏家決定 active session 同 topic stats —— 呢部分逐字不變。
test('冇雲端資料時原樣回傳本機（防線 A）', () => {
  const local = snap({ dse_progress: [A('math', 1000)], updatedAt: 1000, syncedAt: 500 })
  assert.equal(mergeSnapshots(local, { progress: null, updated_at: null } as never), local)
})

test('未同步過嘅機由較完整嗰邊做贏家（防線 B）', () => {
  const thin = snap({ dse_progress: [], dse_active_session: null, syncedAt: null })
  const rich = snap({ dse_progress: [A('math', 1000), A('econ', 2000)], dse_active_session: { subjectId: 'math' }, updatedAt: 2000 })
  const out = mergeSnapshots(thin, cloudOf(rich))
  assert.deepEqual(out.dse_active_session, { subjectId: 'math' }, '未完成嗰節跟贏家 —— 一節就係一節，冇得合併')
})

// ── ⑧ topic_stats 由跟贏家改為三方增量合併（2026-09-11 簽署）────────────────
//
// 舊版呢條測試鎖住「跟贏家」，並寫明「若日後有人改咗合併語意，呢條測試會紅。
// 嗰陣要做嘅唔係改測試，係核實嗰個決定有冇簽名。」
//
// 核實結果：2026-09-11 簽署「實作基於 Timestamp 嘅增量 Union 策略」，
// 故此改測試。完整語意測試喺 lib/__tests__/topic-stats-crdt.test.mts，
// 呢度只留一條把關：合併之後【兩邊嘅課題都要在】。
test('dse_topic_stats 行三方增量合併 —— 兩邊嘅課題都保得住', () => {
  const out = mergeSnapshots(
    snap({ dse_progress: [], dse_topic_stats: { 'econ::demand': { total: 15 } }, updatedAt: 2000, syncedAt: 500 }),
    cloudOf(snap({ dse_progress: [], dse_topic_stats: { 'math::algebra': { total: 20 } }, updatedAt: 1000, syncedAt: 500 })),
    null, // 冇基準 → 退回逐欄取 max（保守，唔雙計）
  )
  assert.deepEqual(
    Object.keys(out.dse_topic_stats as object).sort(),
    ['econ::demand', 'math::algebra'],
    '兩邊各自累積嘅課題都要保住 —— 舊語意會掉失輸嗰邊全部',
  )
})