// ============================================================================
// cross-device-e2e.test.mts —— Mobile ↔ iPad ↔ Desktop 全程往返
// ----------------------------------------------------------------------------
// 2027 目標書階段四驗收原文：
//   「執行 Playwright 跨裝置 E2E 測試，模擬 Mobile 做題中途切換至
//     iPad/Desktop，進度 100% 無縫銜接」
//
// 2026-09-10 簽署：「確認唔新增 Playwright，用 $0 替代方案」。
//
// ══ 呢個替代方案覆蓋到啲乜、覆蓋唔到啲乜 ══
// Playwright 喺呢個情境入面真正買到嘅嘢，係【三部機各有一份獨立
// localStorage，而資料要經雲端喺三者之間流轉】。呢份測試就係嗰件事：
// 每部「機」有自己嘅 storage shim，跑嘅係【真實嘅】snapshotLocal /
// mergeSnapshots / applyLocal，唔係複製品。
//
// 覆蓋唔到：像素、CSS、真實 OAuth。像素有 responsive-guard 掃 375px，
// OAuth 唔喺呢層 —— 而歷來每一次跨裝置掉進度，都係喺 merge 語義度掉，
// 唔係喺 render 度掉。
//
// ⚠️ 全程零網絡、零 Supabase 寫入。雲端係一個記憶體物件，
//    形狀對齊 CloudData（progress + updated_at）。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'

const sync = await import('../sync.ts')
const { snapshotLocal, mergeSnapshots, applyLocal } = sync
// ⚠️ 交卷要叫【真實嘅】clearActiveSession，唔可以喺測試度自己 removeItem。
//    第一版就係自己 removeItem，於是啱啱好繞過咗佢個 bug —— 一份用捷徑
//    模擬真實動作嘅 E2E，捉到嘅係捷徑，唔係產品。
const { clearActiveSession } = await import('../sessionResume.ts')
type Snapshot = Awaited<ReturnType<typeof snapshotLocal>>

// ── 一部「機」＝ 一份獨立 localStorage ────────────────────────────────────
class Device {
  store = new Map<string, string>()
  constructor(public name: string) {}
}
/** 把 globalThis 換成呢部機嘅 storage，跑完還原 —— 三部機唔會互相污染。 */
function on<T>(d: Device, fn: () => T): T {
  const g = globalThis as Record<string, unknown>
  const prevW = g.window, prevL = g.localStorage
  const ls = {
    getItem: (k: string) => (d.store.has(k) ? d.store.get(k)! : null),
    setItem: (k: string, v: string) => void d.store.set(k, String(v)),
    removeItem: (k: string) => void d.store.delete(k),
  }
  g.localStorage = ls
  g.window = { localStorage: ls, dispatchEvent: () => true }
  try { return fn() } finally { g.window = prevW; g.localStorage = prevL }
}

/** 雲端 —— 一行 user_progress。 */
interface Cloud { progress: Snapshot | null; updated_at: string | null }
const newCloud = (): Cloud => ({ progress: null, updated_at: null })

/** 推：本機快照 → 雲。拉：雲 merge 落本機。同 app 嘅次序一致。 */
const push = (d: Device, c: Cloud, at: number) => {
  c.progress = on(d, snapshotLocal)
  c.updated_at = new Date(at).toISOString()
}
const pull = (d: Device, c: Cloud) => on(d, () => {
  const merged = mergeSnapshots(snapshotLocal(), c as never)
  applyLocal(merged)
  return merged
})

const attempt = (id: string, subjectId: string, ts: number) =>
  ({ id, subjectId, subjectName: subjectId, topicFilter: null, score: 7, total: 10,
     grade: '4', topicResults: [{ topic: 't', correct: 7, total: 10 }], elapsed: 600, timestamp: ts })

const readProgress = (d: Device) =>
  (JSON.parse(d.store.get('dse_progress') ?? '[]') as { id: string }[]).map((a) => a.id).sort()
const readActive = (d: Device) => {
  const raw = d.store.get('dse_active_session')
  return raw ? (JSON.parse(raw) as { current: number; subjectId: string; answers: unknown[] }) : null
}

// ══════════════════════════════════════════════════════════════════════════
// ① 主線：手機做到一半 → iPad 接住做完 → Desktop 睇到成績
// ══════════════════════════════════════════════════════════════════════════
test('Mobile 做題中途切換至 iPad，未完成嗰節原地接落去', () => {
  const cloud = newCloud()
  const mobile = new Device('Mobile'), ipad = new Device('iPad')

  // 手機：開咗一節 chemistry，10 題做到第 5 題，走咗去食飯
  on(mobile, () => {
    localStorage.setItem('dse_active_session', JSON.stringify({
      subjectId: 'chemistry', topicFilter: 'mole', current: 4, elapsed: 51, updatedAt: 1000,
      questionIds: Array.from({ length: 10 }, (_, i) => `chem_${i}`),
      answers: [{ isCorrect: true, selectedZh: 'A' }, { isCorrect: false, selectedZh: 'B' },
                { isCorrect: true, selectedZh: 'C' }, { isCorrect: true, selectedZh: 'D' }],
    }))
    localStorage.setItem('dse_updated_at', '1000')
  })
  push(mobile, cloud, 1000)

  // iPad：一部未同步過嘅新機，第一次拉
  pull(ipad, cloud)
  const a = readActive(ipad)
  assert.ok(a, 'iPad 應該收到未完成嗰節 —— 收唔到就係「切換裝置＝由頭再做」')
  assert.equal(a!.current, 4, '應該停返喺第 5 題')
  assert.equal(a!.answers.length, 4, '前 4 題嘅答案要一齊過嚟')
  assert.equal(a!.subjectId, 'chemistry')
})

test('iPad 做完嗰節之後，手機唔可以「復活」返嗰節', () => {
  const cloud = newCloud()
  const mobile = new Device('Mobile'), ipad = new Device('iPad')

  on(mobile, () => {
    localStorage.setItem('dse_active_session', JSON.stringify({
      subjectId: 'chemistry', current: 4, answers: [1, 2, 3, 4], questionIds: [], updatedAt: 1000 }))
    localStorage.setItem('dse_updated_at', '1000')
  })
  push(mobile, cloud, 1000)
  pull(ipad, cloud)

  // iPad 做完 → 交卷（清走 active session、寫低成績）
  on(ipad, () => {
    clearActiveSession() // ← 真實交卷路徑（PracticeSession.tsx:587 叫嘅就係佢）
    localStorage.setItem('dse_progress', JSON.stringify([attempt('s1', 'chemistry', 2000)]))
    localStorage.setItem('dse_free_attempts_total', '1')
    localStorage.setItem('dse_updated_at', '2000')
  })
  push(ipad, cloud, 2000)

  // ⚠️ 呢度先係真正嘅陷阱：手機部機仲攞住一份【已經做完】嘅未完成節。
  //    佢一拉落嚟，如果 merge 揀錯邊，學生就會見到一節做過嘅題目又出返嚟。
  //    snapshotLocal 特登分開 `null`（做完咗）同 `undefined`（呢部機冇資料），
  //    applyLocal 見到 null 先會 removeItem —— 呢條測試就係守住嗰個分別。
  pull(mobile, cloud)
  assert.equal(readActive(mobile), null, '做完咗嘅節唔可以喺舊機度復活')
  assert.deepEqual(readProgress(mobile), ['s1'], '成績要跟到落手機')
})

test('Desktop 第三部機加入，兩邊嘅成績都見到', () => {
  const cloud = newCloud()
  const mobile = new Device('Mobile'), ipad = new Device('iPad'), desktop = new Device('Desktop')

  on(mobile, () => {
    localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000)]))
    localStorage.setItem('dse_free_attempts_total', '1')
    localStorage.setItem('dse_updated_at', '1000')
  })
  push(mobile, cloud, 1000)
  pull(ipad, cloud)

  on(ipad, () => {
    localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000), attempt('i1', 'physics', 2000)]))
    localStorage.setItem('dse_free_attempts_total', '2')
    localStorage.setItem('dse_updated_at', '2000')
  })
  push(ipad, cloud, 2000)

  pull(desktop, cloud)
  assert.deepEqual(readProgress(desktop), ['i1', 'm1'], 'Desktop 應該見到兩部機嘅成績')
})

// ══════════════════════════════════════════════════════════════════════════
// ② 離線分叉 —— 呢個先係「進度覆蓋事故」嘅真正來源
// ══════════════════════════════════════════════════════════════════════════
test('兩部機離線各做一節，合併之後兩節都要在（唔可以一邊蓋一邊）', () => {
  const cloud = newCloud()
  const mobile = new Device('Mobile'), ipad = new Device('iPad')

  // 共同起點：兩部機都同步過，各有 m1
  on(mobile, () => {
    localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000)]))
    localStorage.setItem('dse_free_attempts_total', '1')
    localStorage.setItem('dse_updated_at', '1000')
  })
  push(mobile, cloud, 1000)
  pull(ipad, cloud)

  // 各自離線做多一節
  on(mobile, () => {
    localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000), attempt('m2', 'math', 3000)]))
    localStorage.setItem('dse_free_attempts_total', '2')
    localStorage.setItem('dse_updated_at', '3000')
  })
  on(ipad, () => {
    localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000), attempt('i2', 'physics', 2500)]))
    localStorage.setItem('dse_free_attempts_total', '2')
    localStorage.setItem('dse_updated_at', '2500')
  })

  // iPad 先上，手機後上 —— 手機比較新，舊寫法會令 i2 蒸發
  push(ipad, cloud, 2500)
  const merged = pull(mobile, cloud)
  assert.deepEqual((merged.dse_progress as { id: string }[]).map((a) => a.id).sort(), ['i2', 'm1', 'm2'],
    '三節都要在 —— dse_progress 係 append-only，唔可以 last-writer-wins')
  push(mobile, cloud, 3000)
  pull(ipad, cloud)
  assert.deepEqual(readProgress(ipad), ['i2', 'm1', 'm2'], '收斂之後兩部機要一模一樣')
})

test('一部從未做過題嘅新機，唔可以將雲端洗白', () => {
  const cloud = newCloud()
  const mobile = new Device('Mobile'), blank = new Device('Blank')

  on(mobile, () => {
    localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000)]))
    localStorage.setItem('dse_free_attempts_total', '1')
    localStorage.setItem('dse_topic_stats', JSON.stringify({ 'math::algebra': { total: 20, wrong: 3 } }))
    localStorage.setItem('dse_updated_at', '1000')
  })
  push(mobile, cloud, 1000)

  // 全新機拉完再推 —— 佢自己乜都冇，推上去唔可以變成一張白紙
  pull(blank, cloud)
  push(blank, cloud, 5000)
  assert.ok(cloud.progress, '雲端唔可以變 null')
  assert.deepEqual((cloud.progress!.dse_progress as { id: string }[]).map((a) => a.id), ['m1'],
    '新機推上去之後，原有成績要仲喺度')
  assert.ok(cloud.progress!.dse_topic_stats, '逐課題統計亦唔可以被洗走')

  pull(mobile, cloud)
  assert.deepEqual(readProgress(mobile), ['m1'], '原本部機唔可以反過來被洗白')
})

// ══════════════════════════════════════════════════════════════════════════
// ③ 收斂：任何次序推拉，最終三部機一致
// ══════════════════════════════════════════════════════════════════════════
test('六種推拉次序，全部收斂到同一個結果', () => {
  const orders: ('MP' | 'IP' | 'MG' | 'IG')[][] = [
    ['MP', 'IG', 'IP', 'MG'], ['IP', 'MG', 'MP', 'IG'],
    ['MP', 'IP', 'IG', 'MG'], ['IP', 'MP', 'MG', 'IG'],
    ['MP', 'IG', 'MG', 'IP'], ['IP', 'MG', 'IG', 'MP'],
  ]
  const results = orders.map((ops) => {
    const cloud = newCloud()
    const m = new Device('M'), i = new Device('I')
    on(m, () => {
      localStorage.setItem('dse_progress', JSON.stringify([attempt('m1', 'math', 1000)]))
      localStorage.setItem('dse_free_attempts_total', '1')
      localStorage.setItem('dse_updated_at', '1000')
    })
    on(i, () => {
      localStorage.setItem('dse_progress', JSON.stringify([attempt('i1', 'physics', 2000)]))
      localStorage.setItem('dse_free_attempts_total', '1')
      localStorage.setItem('dse_updated_at', '2000')
    })
    let clock = 3000
    for (const op of ops) {
      if (op === 'MP') push(m, cloud, clock++)
      else if (op === 'IP') push(i, cloud, clock++)
      else if (op === 'MG') pull(m, cloud)
      else pull(i, cloud)
    }
    // 再對拉一轉令佢收斂
    push(m, cloud, clock++); pull(i, cloud); push(i, cloud, clock++); pull(m, cloud)
    return { m: readProgress(m).join(','), i: readProgress(i).join(',') }
  })
  for (const [n, r] of results.entries()) {
    assert.equal(r.m, r.i, `次序 ${n + 1}：兩部機唔一致（${r.m} vs ${r.i}）`)
    assert.equal(r.m, 'i1,m1', `次序 ${n + 1}：應該兩節都在，實得 ${r.m}`)
  }
})

// ══════════════════════════════════════════════════════════════════════════
// ④ 唔可以靜靜哋改咗做 Playwright
// ══════════════════════════════════════════════════════════════════════════
//
// 2026-09-10 簽署明文「唔新增 Playwright」。憲章 §5 亦禁新增套件。
// 呢條守住個決定 —— 唔係守住個名，係守住「唔可以為咗一條 E2E 而破預算」。
test('冇引入 Playwright／Puppeteer／Cypress', async () => {
  const { readFileSync } = await import('node:fs')
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, Record<string, string>>
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
  for (const banned of ['playwright', '@playwright/test', 'puppeteer', 'cypress', 'selenium-webdriver']) {
    assert.ok(!(banned in deps), `${banned} 唔應該入到 package.json —— 2026-09-10 簽署 ＋ 憲章 §5`)
  }
})
