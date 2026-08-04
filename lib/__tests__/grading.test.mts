// 等級預測嘅行為測試。
//
// 呢個係學生最信嗰個數字 —— 做完 20 題，畫面話你「5 級」，佢就會照住呢個
// 去決定溫邊科。所以邊界（啱啱夠線 / 差一分）同公社科二元制係必守嘅。
//
// ⚠️ 函數簽名以真檔為準：`predictGrade(score, table, subjectSlug?)`。
// 外部 spec 寫嘅 calculateGrade / predictLevel / getCutoff / linearInterpolate
// 四個函數喺呢個 repo 全部唔存在；cut-off 亦唔係「econ 2025」咁樣按年份查，
// 而係由 `getPracticeCutoffs(total)` 按題數即時計。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { predictGrade, CSD_PASS_RATIO, gradeColors, gradeBgColors, gradeMessages } =
  await import('../grading.ts')
const { getPracticeCutoffs, mathPaper1Cutoffs } = await import('../../data/cutoffs.ts')

// 20 題練習卷（SESSION_SIZE），全站最常見嘅情境。
const T20 = getPracticeCutoffs(20, 'math')
// 實際邊界：5**=18 5*=17 5=14 4=11 3=8 2=5 1=2
const C = T20.cutoffs

// ── 邊界：啱啱夠線 vs 差一分 ────────────────────────────────────────────

test('啱啱夠 5 級線 → 5 級', () => {
  assert.equal(predictGrade(C['5'], T20).grade, '5')
})

test('差一分 → 跌落 4 級（唔會四捨五入上去）', () => {
  assert.equal(predictGrade(C['5'] - 1, T20).grade, '4')
})

test('啱啱夠 5** 線 → 5**', () => {
  assert.equal(predictGrade(C['5**'], T20).grade, '5**')
})

test('啱啱夠 1 級線 → 1 級；差一分 → U', () => {
  assert.equal(predictGrade(C['1'], T20).grade, '1')
  assert.equal(predictGrade(C['1'] - 1, T20).grade, 'U')
})

test('每一個等級邊界都各自成立（7 級逐個行一次）', () => {
  for (const g of ['5**', '5*', '5', '4', '3', '2', '1'] as const) {
    assert.equal(predictGrade(C[g], T20).grade, g, `${g} 線上應該係 ${g}`)
  }
})

// ── 零分 / 滿分 ─────────────────────────────────────────────────────────

test('零分 → U，唔會 crash', () => {
  const r = predictGrade(0, T20)
  assert.equal(r.grade, 'U')
  assert.equal(r.percentage, 0)
})

test('滿分 → 5**，gradePosition 封頂 1', () => {
  const r = predictGrade(20, T20)
  assert.equal(r.grade, '5**')
  assert.equal(r.percentage, 100)
  assert.equal(r.gradePosition, 1)
  assert.equal(r.nextGrade, null)
  assert.equal(r.marksToNextGrade, null)
})

test('gradePosition 永遠喺 0–1 之間（掃全部可能分數）', () => {
  for (let s = 0; s <= 20; s++) {
    const p = predictGrade(s, T20).gradePosition
    assert.ok(p >= 0 && p <= 1, `score=${s} 出咗界：${p}`)
  }
})

test('分數升，等級唔會跌（單調性）', () => {
  const rank = ['U', '1', '2', '3', '4', '5', '5*', '5**']
  let prev = -1
  for (let s = 0; s <= 20; s++) {
    const i = rank.indexOf(predictGrade(s, T20).grade)
    assert.ok(i >= prev, `score=${s} 令等級跌返轉頭`)
    prev = i
  }
})

// ── 「距離下一級」 ──────────────────────────────────────────────────────

test('marksToNextGrade 係真差距，加返上去就升級', () => {
  const r = predictGrade(C['4'], T20)
  assert.equal(r.grade, '4')
  assert.ok(r.marksToNextGrade !== null && r.marksToNextGrade > 0)
  assert.equal(predictGrade(C['4'] + r.marksToNextGrade!, T20).grade, r.nextGrade)
})

test('U 級都要有路可走（nextGrade = 1）', () => {
  const r = predictGrade(0, T20)
  assert.equal(r.nextGrade, '1')
  assert.equal(r.marksToNextGrade, C['1'])
})

// ── 公社科：達標／不達標 ────────────────────────────────────────────────

test('公社科 14/20 → 達標', () => {
  assert.equal(predictGrade(14, T20, 'csd').grade, '達標')
})

test('公社科 7/20 → 不達標', () => {
  assert.equal(predictGrade(7, T20, 'csd').grade, '不達標')
})

test('公社科啱啱踩線（50%）→ 達標', () => {
  assert.equal(predictGrade(20 * CSD_PASS_RATIO, T20, 'csd').grade, '達標')
  assert.equal(predictGrade(20 * CSD_PASS_RATIO - 1, T20, 'csd').grade, '不達標')
})

test('公社科冇「距離下一級」概念 → 兩欄都係 null', () => {
  const r = predictGrade(7, T20, 'csd')
  assert.equal(r.marksToNextGrade, null)
  assert.equal(r.nextGrade, null)
})

test('公社科唔會出 1–5** 任何一級（掃全部分數）', () => {
  for (let s = 0; s <= 20; s++) {
    const g = predictGrade(s, T20, 'csd').grade
    assert.ok(g === '達標' || g === '不達標', `score=${s} 出咗 ${g}`)
  }
})

test('達標時 gradePosition = 1，不達標時按比例且唔出界', () => {
  assert.equal(predictGrade(20, T20, 'csd').gradePosition, 1)
  for (let s = 0; s < 10; s++) {
    const p = predictGrade(s, T20, 'csd').gradePosition
    assert.ok(p >= 0 && p <= 1)
  }
})

// ── 零回歸：其餘 24 科唔受公社科分支影響 ────────────────────────────────

test('唔傳 subjectSlug → 行原有 1–5** 邏輯', () => {
  assert.equal(predictGrade(14, T20).grade, '5')
})

test('傳其他科目 slug → 一樣行 1–5**，唔會誤中公社科分支', () => {
  for (const slug of ['math', 'economics', 'chinese', 'english', 'physics', 'biology']) {
    const r = predictGrade(14, T20, slug)
    assert.equal(r.grade, '5', `${slug} 出咗 ${r.grade}`)
    assert.ok(r.nextGrade !== null, `${slug} 應該仲有下一級`)
  }
})

test('唔存在嘅 slug 唔會 crash，照行 1–5**', () => {
  assert.equal(predictGrade(14, T20, 'nonexistent-subject').grade, '5')
})

// ── 另一張真表（官方數學卷一近似值），證明唔係寫死 20 題 ──────────────

test('數學卷一 105 分制：邊界照樣成立', () => {
  const M = mathPaper1Cutoffs
  assert.equal(predictGrade(M.cutoffs['5'], M).grade, '5')
  assert.equal(predictGrade(M.cutoffs['5'] - 1, M).grade, '4')
  assert.equal(predictGrade(M.totalMarks, M).grade, '5**')
  assert.equal(predictGrade(0, M).grade, 'U')
})

test('percentage 按 totalMarks 計，唔係當 100 分制', () => {
  assert.equal(predictGrade(21, mathPaper1Cutoffs).percentage, 20) // 21/105
  assert.equal(predictGrade(10, T20).percentage, 50) // 10/20
})

// ── 憲章 §7：查表唔可以有窿，亦唔可以用紅色責備 ────────────────────────

test('每一個可能出現嘅等級，三張查表都有對應值', () => {
  const all = ['5**', '5*', '5', '4', '3', '2', '1', 'U', '達標', '不達標']
  for (const g of all) {
    assert.ok(gradeColors[g], `gradeColors 冇 ${g}`)
    assert.ok(gradeBgColors[g], `gradeBgColors 冇 ${g}`)
    assert.ok(gradeMessages[g], `gradeMessages 冇 ${g}`)
  }
})

test('憲章 §7：訊息唔准有打擊自信字眼', () => {
  const banned = ['FAIL', 'Fail', '失敗', '不合格', '差勁', '蠢']
  for (const [g, msg] of Object.entries(gradeMessages)) {
    for (const w of banned) assert.ok(!msg.includes(w), `${g} 含「${w}」`)
  }
})

test('不達標唔用紅色（憲章 §7 禁大紅）', () => {
  // 用主題 token，唔係 red-*；「未達標」係狀態唔係責備。
  assert.ok(!/red|#f?f?0000|rose/i.test(gradeColors['不達標']))
  assert.ok(!/\bred-/.test(gradeBgColors['不達標']))
})
