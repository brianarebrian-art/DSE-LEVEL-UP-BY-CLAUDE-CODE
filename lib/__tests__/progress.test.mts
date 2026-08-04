// 進度統計嘅行為測試 —— 重點係「學生嘅最佳成績唔會被靜靜雞蓋走」。
//
// 背景：`betterGrade` 原本淨係用 `GRADE_RANK.indexOf()` 比較。公社科嘅「達標」
// 唔喺 GRADE_RANK 入面，indexOf 回 -1，即係會被判定為低過「U」——
// 學生考到達標，畫面卻顯示 U。呢個 bug 已於 2026-08-04b 修好，呢批測試係
// 迴歸鎖，防止日後有人「簡化」返做單一 indexOf。
//
// ⚠️ 外部 spec 提到嘅 `mergeProgress` 唔喺呢個模組 —— 跨裝置合併喺 lib/sync.ts
// 嘅 `mergeSnapshots`，簽名同語意完全唔同（snapshot vs 逐科等級）。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { betterGrade, computeStats, RECENT_WINDOW_DAYS } = await import('../progress.ts')

type Attempt = {
  subjectId: string
  subjectName: string
  topicFilter: string | null
  score: number
  total: number
  grade: string
  topicResults: { topic: string; correct: number; total: number }[]
  elapsed: number
  timestamp: number
}

function attempt(over: Partial<Attempt> = {}): Attempt {
  return {
    subjectId: 'csd',
    subjectName: '公民與社會發展',
    topicFilter: null,
    score: 14,
    total: 20,
    grade: '達標',
    topicResults: [{ topic: '香港', correct: 7, total: 10 }],
    elapsed: 600,
    timestamp: Date.now(),
    ...over,
  }
}

// ── 核心迴歸：達標／不達標唔會被當成 -1 ────────────────────────────────

test('【核心】達標 vs U：達標唔會被當成低過 U', () => {
  // 舊 bug：indexOf('達標') === -1 < indexOf('U') === 0 → 回 'U'，蓋走達標。
  assert.equal(betterGrade('達標', 'U'), '達標')
})

test('【核心】不達標 vs U：保留累積值，唔會被跨制式新值蓋走', () => {
  // a = 累積值。跨制式一律保 a —— 兩個都唔可比，保住已有嗰個先安全。
  assert.equal(betterGrade('不達標', 'U'), '不達標')
  assert.equal(betterGrade('U', '達標'), 'U')
})

test('【核心】達標 vs 5**：跨制式唔會混比出荒謬結果', () => {
  assert.equal(betterGrade('達標', '5**'), '達標')
  assert.equal(betterGrade('5**', '達標'), '5**')
})

// ── 同制式內部：達標制 ──────────────────────────────────────────────────

test('達標 > 不達標（兩邊次序都試）', () => {
  assert.equal(betterGrade('達標', '不達標'), '達標')
  assert.equal(betterGrade('不達標', '達標'), '達標')
})

test('達標 vs 達標 → 達標；不達標 vs 不達標 → 不達標', () => {
  assert.equal(betterGrade('達標', '達標'), '達標')
  assert.equal(betterGrade('不達標', '不達標'), '不達標')
})

// ── 同制式內部：1–5** ──────────────────────────────────────────────────

test('1–5** 排序正確', () => {
  assert.equal(betterGrade('5**', '5'), '5**')
  assert.equal(betterGrade('5', '5**'), '5**')
  assert.equal(betterGrade('5*', '5'), '5*')
  assert.equal(betterGrade('5', '4'), '5')
  assert.equal(betterGrade('1', 'U'), '1')
  assert.equal(betterGrade('U', '1'), '1')
})

test('相同等級 → 原值', () => {
  for (const g of ['5**', '5*', '5', '4', '3', '2', '1', 'U']) {
    assert.equal(betterGrade(g, g), g)
  }
})

test('完整階梯：每一級都贏得過下一級', () => {
  const rank = ['U', '1', '2', '3', '4', '5', '5*', '5**']
  for (let i = 1; i < rank.length; i++) {
    assert.equal(betterGrade(rank[i - 1], rank[i]), rank[i], `${rank[i]} 應該贏 ${rank[i - 1]}`)
    assert.equal(betterGrade(rank[i], rank[i - 1]), rank[i])
  }
})

// ── 經 computeStats 嘅整合證明（bug 真正咬人嗰條路）──────────────────────

test('【整合】公社科連做兩次（不達標 → 達標）→ bestGrade = 達標', () => {
  const s = computeStats([
    attempt({ grade: '不達標', score: 7, timestamp: Date.now() - 86400000 }),
    attempt({ grade: '達標', score: 14 }),
  ])
  assert.equal(s.subjects[0].bestGrade, '達標')
})

test('【整合】公社科先達標後不達標 → bestGrade 保持達標，唔會被拉低', () => {
  const s = computeStats([
    attempt({ grade: '達標', score: 14, timestamp: Date.now() - 86400000 }),
    attempt({ grade: '不達標', score: 6 }),
  ])
  assert.equal(s.subjects[0].bestGrade, '達標')
})

test('【整合】公社科單次達標，bestGrade 唔會顯示做 U（bug 原貌）', () => {
  // bestGrade 初始值就係 'U'。舊邏輯會令第一次「達標」直接輸畀初始值。
  const s = computeStats([attempt({ grade: '達標' })])
  assert.equal(s.subjects[0].bestGrade, '達標')
  assert.notEqual(s.subjects[0].bestGrade, 'U')
})

test('【整合】一般科目零回歸：4 → 5 會升', () => {
  const s = computeStats([
    attempt({ subjectId: 'math', subjectName: '數學', grade: '4', timestamp: Date.now() - 1000 }),
    attempt({ subjectId: 'math', subjectName: '數學', grade: '5' }),
  ])
  assert.equal(s.subjects[0].bestGrade, '5')
})

test('【整合】兩科同時存在，各自用自己制式，唔會互相污染', () => {
  const s = computeStats([
    attempt({ subjectId: 'csd', grade: '達標' }),
    attempt({ subjectId: 'math', subjectName: '數學', grade: '5*' }),
  ])
  const byId = Object.fromEntries(s.subjects.map((x) => [x.subjectId, x.bestGrade]))
  assert.equal(byId.csd, '達標')
  assert.equal(byId.math, '5*')
})

// ── computeStats 其餘保障 ───────────────────────────────────────────────

test('空 attempts → 全零，唔會除以零出 NaN', () => {
  const s = computeStats([])
  assert.equal(s.totalAttempts, 0)
  assert.equal(s.overallAccuracy, 0)
  assert.equal(s.activeDays, 0)
  assert.equal(s.recentActiveDays, 0)
  assert.deepEqual(s.subjects, [])
})

test('準確率按題數加權，唔係按卷數平均', () => {
  const s = computeStats([
    attempt({ subjectId: 'math', subjectName: '數學', grade: '5', score: 20, total: 20 }),
    attempt({ subjectId: 'math', subjectName: '數學', grade: '1', score: 0, total: 80 }),
  ])
  assert.equal(s.overallAccuracy, 20 / 100) // 唔係 (1.0 + 0)/2 = 0.5
})

test('近期活躍日數：同一日做幾份卷只計一日', () => {
  const t = Date.now()
  const s = computeStats([attempt({ timestamp: t }), attempt({ timestamp: t + 1000 })])
  assert.equal(s.recentActiveDays, 1)
})

test('近期活躍日數：窗口外嘅舊記錄唔計入', () => {
  const old = Date.now() - (RECENT_WINDOW_DAYS + 5) * 86400000
  const s = computeStats([attempt({ timestamp: old })])
  assert.equal(s.recentActiveDays, 0)
  assert.equal(s.activeDays, 1) // 但總活躍日仍然數得到
})

test('弱項課題：正確率 ≥80% 或樣本太少唔會被標為弱項', () => {
  const s = computeStats([
    attempt({ topicResults: [{ topic: '強項', correct: 9, total: 10 }] }), // 90%
    attempt({ topicResults: [{ topic: '樣本太少', correct: 0, total: 1 }] }), // total < 2
    attempt({ topicResults: [{ topic: '真弱項', correct: 1, total: 10 }] }), // 10%
  ])
  const names = s.weakTopics.map((t) => t.topic)
  assert.ok(names.includes('真弱項'))
  assert.ok(!names.includes('強項'))
  assert.ok(!names.includes('樣本太少'))
})

test('弱項最多 5 個，且由最弱排起', () => {
  const s = computeStats(
    Array.from({ length: 8 }, (_, i) =>
      attempt({ topicResults: [{ topic: `t${i}`, correct: i, total: 10 }] }),
    ),
  )
  assert.ok(s.weakTopics.length <= 5)
  for (let i = 1; i < s.weakTopics.length; i++) {
    assert.ok(s.weakTopics[i - 1].accuracy <= s.weakTopics[i].accuracy)
  }
})
