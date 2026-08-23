// ============================================================================
// logic-homestead.test.mts —— 足跡與家園（SPEC-GAMIFY-P1）
// ----------------------------------------------------------------------------
// 這兩個模組的價值在於「不會傷害到學生」，所以測試也圍住這件事寫：
// 不倒退、弱的學生一樣有東西看、遊戲化層不可以碰練習頁的儲存。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { computeLogEntries, nodeTone, nodeSize, currentStreak, isConsecutive, MOOD_NOTE_MAX } =
  await import('../logicLog.ts')
const { computeHomestead, ZONES, MAX_LEVEL } = await import('../homestead.ts')

type Attempt = Parameters<typeof computeLogEntries>[0][number]

const DAY = 86400000
// hkDayString 用 04:00 HKT 日界線；用正午 UTC 落錨可以避開邊界，
// 測試要驗的是聚合邏輯，不是時區換算（那一層有 hkTime 自己的測試）。
const noon = (dayOffsetFromNow: number, now: number) => now - dayOffsetFromNow * DAY

function attempt(ts: number, over: Partial<Attempt> = {}): Attempt {
  return {
    subjectId: 'math', subjectName: '數學', topicFilter: null,
    score: 5, total: 20, grade: '3',
    topicResults: [{ topic: '二次方程', correct: 3, total: 10 }],
    elapsed: 600, timestamp: ts,
    ...over,
  } as Attempt
}

const NOW = Date.UTC(2026, 7, 22, 12, 0, 0)

test('足跡由練習紀錄導出，同一日的多節會合併成一條', () => {
  const a = [attempt(noon(0, NOW)), attempt(noon(0, NOW) - 3600000), attempt(noon(2, NOW))]
  const out = computeLogEntries(a, [], {}, 30, NOW)
  assert.equal(out.length, 2, '兩個不同日子應得兩條足跡')
  assert.equal(out[0].sessions, 2)
  assert.equal(out[0].questionsCount, 40)
  assert.equal(out[0].timeMinutes, 20)
})

test('全部答錯的一日照樣有足跡 —— 足跡記錄的不是分數', () => {
  const out = computeLogEntries([attempt(NOW, { score: 0 })], [], {}, 30, NOW)
  assert.equal(out.length, 1)
  assert.equal(out[0].questionsCount, 20)
  assert.ok(!JSON.stringify(out[0]).includes('score'), '足跡不應帶任何分數欄位')
})

test('自診紀錄只補「陷阱」一欄，不會憑空造出一日足跡', () => {
  const reverse = [{ subjectId: 'math', questionId: 'q1', topic: '機率', cause: 'B' as const, selected: 'x', correct: 'y', ts: noon(5, NOW) }]
  const out = computeLogEntries([attempt(NOW)], reverse, {}, 30, NOW)
  assert.equal(out.length, 1, '沒有做過題的日子不可以只憑自診紀錄生出足跡')
  assert.deepEqual(out[0].trapsFound, [])
})

test('只有 B 類（審題陷阱）才算作認出陷阱', () => {
  const ts = NOW - 60000
  const mk = (cause: 'A' | 'B' | 'C', topic: string) =>
    ({ subjectId: 'math', questionId: `q_${cause}`, topic, cause, selected: 'x', correct: 'y', ts })
  const out = computeLogEntries([attempt(ts)], [mk('A', '概念'), mk('B', '審題'), mk('C', '粗心')], {}, 30, NOW)
  assert.deepEqual(out[0].trapsFound, ['審題'])
})

test('節點顏色與大小照規格書分級', () => {
  assert.equal(nodeTone({ topics: [] }), 'quiet')
  assert.equal(nodeTone({ topics: ['a', 'b'] }), 'cyan')
  assert.equal(nodeTone({ topics: ['a', 'b', 'c'] }), 'pink')
  assert.equal(nodeTone({ topics: ['a', 'b', 'c', 'd', 'e'] }), 'gold')
  assert.equal(nodeSize({ questionsCount: 9 }), 'sm')
  assert.equal(nodeSize({ questionsCount: 10 }), 'md')
  assert.equal(nodeSize({ questionsCount: 31 }), 'lg')
})

test('連續日數：昨日做過都算未斷 —— 早上開頁不應見到 0', () => {
  const entries = computeLogEntries([attempt(noon(1, NOW)), attempt(noon(2, NOW))], [], {}, 30, NOW)
  assert.equal(currentStreak(entries, NOW), 2)
  assert.equal(isConsecutive('2026-08-22', '2026-08-21'), true)
  assert.equal(isConsecutive('2026-08-22', '2026-08-20'), false)
})

test('休息幾日之後回來，舊足跡一條都不會消失', () => {
  const entries = computeLogEntries([attempt(noon(10, NOW)), attempt(noon(11, NOW))], [], {}, 30, NOW)
  assert.equal(entries.length, 2, '斷了 streak 不等於刪走歷史')
  assert.equal(currentStreak(entries, NOW), 0, '斷咗就係 0，但呢個數字只用嚟加特效')
})

test('爛資料不可以令足跡出 NaN', () => {
  const junk = [
    attempt(NOW, { total: Number.NaN, elapsed: Number.NaN }),
    attempt(NOW, { topicResults: undefined as never }),
  ]
  const out = computeLogEntries(junk, [], {}, 30, NOW)
  assert.ok(Number.isFinite(out[0].questionsCount))
  assert.ok(Number.isFinite(out[0].timeMinutes))
})

test('備註上限跟規格書（50 字）', () => {
  assert.equal(MOOD_NOTE_MAX, 50)
})

// ── 家園 ────────────────────────────────────────────────────────────────────

test('零練習時四區都在第一級，不會出現第 0 級', () => {
  const h = computeHomestead({ attempts: [], reverse: [], reviewsDone: 0 })
  assert.equal(h.zones.length, 4)
  for (const z of h.zones) assert.equal(z.level, 1)
  assert.equal(h.total, 4)
})

test('等級只升不跌 —— 累計數值單調上升，等級必然單調上升', () => {
  let prev = 0
  for (const n of [0, 5, 60, 200, 500, 1000, 5000]) {
    const h = computeHomestead({
      attempts: [{ subjectId: 'math', subjectName: '數學', topicFilter: null, score: 0, total: n, grade: 'U', topicResults: [], elapsed: 0, timestamp: NOW } as Attempt],
      reverse: [], reviewsDone: 0,
    })
    const forge = h.zones.find((z) => z.zone.id === 'forge')!
    assert.ok(forge.level >= prev, `熔爐等級由 ${prev} 跌到 ${forge.level}`)
    prev = forge.level
  }
  assert.equal(prev, MAX_LEVEL)
})

test('熔爐只計核心三科 —— 淨係做物理不會令熔爐升級', () => {
  const phys = { subjectId: 'physics', subjectName: '物理', topicFilter: null, score: 0, total: 500, grade: 'U', topicResults: [], elapsed: 0, timestamp: NOW } as Attempt
  const h = computeHomestead({ attempts: [phys], reverse: [], reviewsDone: 0 })
  assert.equal(h.zones.find((z) => z.zone.id === 'forge')!.level, 1)
})

test('花園數的是自診次數，不是答對次數 —— 全部答錯一樣種到花', () => {
  const reverse = Array.from({ length: 40 }, (_, i) => ({
    subjectId: 'math', questionId: `q${i}`, topic: 't', cause: 'A' as const, selected: 'x', correct: 'y', ts: NOW,
  }))
  const h = computeHomestead({ attempts: [], reverse, reviewsDone: 0 })
  assert.ok(h.zones.find((z) => z.zone.id === 'garden')!.level >= 3)
})

test('家園唔可以用等級預測做升級條件（憲章 §7 / §8）', () => {
  const src = readFileSync(new URL('../homestead.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const banned of ['gradeConfidence', 'predictedGrade', 'betterGrade']) {
    assert.ok(!code.includes(banned), `家園不應讀取等級預測（見到 ${banned}）`)
  }
})

test('遊戲化層唔可以寫任何練習數據 —— 只准寫學生自己嘅備註', () => {
  for (const f of ['../homestead.ts', '../arena.ts'] as const) {
    const src = readFileSync(new URL(f, import.meta.url), 'utf8')
    const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
    assert.ok(!code.includes('setItem'), `${f} 唔應該寫 localStorage`)
  }
  const log = readFileSync(new URL('../logicLog.ts', import.meta.url), 'utf8')
  const logCode = log.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  const writes = logCode.match(/localStorage\.setItem\(([^,]+)/g) ?? []
  assert.equal(writes.length, 1, 'logicLog 只應有一個寫入點（心情備註）')
  assert.ok(writes[0].includes('NOTE_KEY'), '唯一嘅寫入必須係備註 key')
})

test('規格書嘅家園儲存 key 一律唔可以出現 —— 等級係導出值', () => {
  // 只掃代碼：檔首的說明註釋本來就要提到這兩個 key（解釋為何不寫），
  // 連註釋一齊掃就會把「說明」誤當成「實作」。
  const src = readFileSync(new URL('../homestead.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  assert.ok(!code.includes('dse_homestead_state'))
  assert.ok(!code.includes('dse_homestead_cache'))
})

test('每區都有雙語名、意義說明同四個遞增門檻', () => {
  for (const z of ZONES) {
    assert.ok(z.zh && z.en && z.meaningZh && z.meaningEn, `${z.id} 缺雙語文案`)
    assert.equal(z.thresholds.length, MAX_LEVEL - 1)
    for (let i = 1; i < z.thresholds.length; i++) {
      assert.ok(z.thresholds[i] > z.thresholds[i - 1], `${z.id} 門檻並非遞增`)
    }
  }
})
