// ============================================================================
// practiceRank.test.mts —— 練習段位層嘅大愛設計紅線
// ----------------------------------------------------------------------------
// 遊戲化於 2026-08-22 解禁（憲章 §8.1），但解禁【唔等於】可以做懲罰性回饋。
// 呢度鎖住四樣一旦壞咗就會直接傷到學生、而且喺畫面上唔一定睇得出嘅嘢。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { readFileSync } from 'node:fs'

const { computePracticeRank, attemptExp, RANKS } = await import('../practiceRank.ts')

type A = { subjectId: string; subjectName: string; topicFilter: null; score: number; total: number; grade: string; topicResults: []; elapsed: number; timestamp: number }
const mk = (score: number, total: number, ts = Date.now()): A => ({
  subjectId: 'math', subjectName: '數學', topicFilter: null,
  score, total, grade: '3', topicResults: [], elapsed: 600, timestamp: ts,
})

test('EXP 只加唔減，段位只升唔跌 —— 考得差唔可以令學生睇住個數字跌返落去', () => {
  const good = [mk(20, 20), mk(19, 20), mk(18, 20)]
  const before = computePracticeRank(good)
  // 之後連續三節考得極差
  const after = computePracticeRank([...good, mk(0, 20), mk(1, 20), mk(0, 20)])
  assert.ok(after.exp >= before.exp, 'EXP 跌咗 —— 憲章 §7 禁止倒扣式回饋')
  assert.ok(
    RANKS.indexOf(after.rank) >= RANKS.indexOf(before.rank),
    '段位跌咗 —— 學生考得差已經夠難受，唔可以再降佢段位',
  )
})

test('答錯晒都要有 EXP —— 越弱嘅學生唔可以獲得越少回饋', () => {
  const zero = attemptExp({ score: 0, total: 20 })
  assert.ok(zero > 0, '零分一節攞唔到任何 EXP —— 對基礎薄弱嘅學生等於做咗等於冇做')
  // 但答啱仍然要明顯著數，否則獎勵同表現脫鈎
  assert.ok(attemptExp({ score: 20, total: 20 }) > zero * 3, '滿分同零分嘅差距太細，EXP 失去意義')
})

test('段位名唔可以似 DSE 等級或考試結果 —— 咁樣等於等級預測（憲章 §8 永久否決）', () => {
  const banned = /5\s*\*|\bband\b|\blevel\s*[1-5]|及格|不及格|失敗|fail|預測|guarantee/i
  for (const r of RANKS) {
    for (const label of [r.id, r.zh, r.en]) {
      assert.ok(!banned.test(label), `段位名「${label}」暗示咗考試結果`)
    }
  }
  // 亦唔可以有任何打擊自信嘅字眼
  const harsh = /廢|差|弱|低手|新手|菜/
  for (const r of RANKS) assert.ok(!harsh.test(r.zh), `段位名「${r.zh}」帶貶意`)
})

test('爛資料唔可以令競技場層炒車或者派出 NaN', () => {
  const junk = [
    mk(5, 10),
    { ...mk(0, 0), score: NaN, total: NaN },
    { ...mk(0, 0), score: -50, total: -3 },
    { ...mk(0, 0), timestamp: Number.NaN },
  ] as A[]
  const s = computePracticeRank(junk)
  for (const [k, v] of Object.entries(s)) {
    if (typeof v === 'number') assert.ok(Number.isFinite(v), `${k} 係 ${v}`)
  }
  assert.ok(s.exp >= 0, 'EXP 變咗負數')
  assert.ok(s.progress >= 0 && s.progress <= 1, `progress 出界：${s.progress}`)
})

test('空資料要派得出合理起始狀態，唔可以 crash', () => {
  const s = computePracticeRank([])
  assert.equal(s.exp, 0)
  assert.equal(s.rank, RANKS[0])
  assert.equal(s.sessions, 0)
  assert.equal(s.activeDays, 0)
  assert.ok(s.next !== null, '第一段位應該有下一級可以行')
})

test('競技場層唔可以自己寫儲存 —— 一有第二份數據就要練習頁負責同步', () => {
  const src = readFileSync(new URL('../practiceRank.ts', import.meta.url).pathname, 'utf8')
  assert.ok(!/localStorage\.setItem|sessionStorage\.setItem/.test(src),
    'practiceRank.ts 寫咗儲存 —— 必須維持純導出值，否則就要改 PracticeSession')
})
