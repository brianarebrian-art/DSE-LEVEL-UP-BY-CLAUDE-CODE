// ============================================================================
// week3-adaptive-hints-timer.test.mts —— 無聲自適應 / 分步提示 / 計時 / 時間軸
// ----------------------------------------------------------------------------
// 呢四個模組最危險嘅唔係壞，係「悄悄變咗質」：
//   自適應由排序變成重抽（3:5:2 就冧咗，而且冇人會發現）
//   分步提示由俾方向變成收學生嘅字（就變咗長答題自動批改，憲章永久禁令）
//   計時由可選變成預設、由溫和提示變成強制交卷
//   時間軸由「同自己比」變成「同人比」
// 所以呢批測試守嘅係邊界，唔係功能。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8')

const PRACTICE = read('app/practice/PracticeSession.tsx')
const HINTS_UI = read('components/StepHints.tsx')
const TIMELINE_UI = read('components/PersonalTimeline.tsx')

const strip = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')

function withStorage(store: Record<string, string>, fn: () => void) {
  const g = globalThis as unknown as { localStorage?: unknown; window?: unknown }
  const pl = g.localStorage
  const pw = g.window
  g.localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
  }
  g.window = g.window ?? {}
  try { fn() } finally { g.localStorage = pl; g.window = pw }
}

// ── §4.6 無聲難度自適應 ────────────────────────────────────────────────────
const { advanceStreak, preferredTier, nextIndex, EMPTY_STREAK, UP_STREAK, DOWN_STREAK } =
  await import('../adaptiveOrder.ts')

test('連續答對 3 題 → 下一題升一級；上限 hard', () => {
  let s = EMPTY_STREAK
  for (let i = 0; i < UP_STREAK; i++) s = advanceStreak(s, true)
  assert.equal(preferredTier('easy', s), 'medium')
  assert.equal(preferredTier('medium', s), 'hard')
  assert.equal(preferredTier('hard', s), 'hard', 'hard 之上冇嘢')
})

test('連續答錯 2 題 → 下一題降一級；下限 easy', () => {
  let s = EMPTY_STREAK
  for (let i = 0; i < DOWN_STREAK; i++) s = advanceStreak(s, false)
  assert.equal(preferredTier('hard', s), 'medium')
  assert.equal(preferredTier('medium', s), 'easy')
  assert.equal(preferredTier('easy', s), 'easy', 'easy 之下冇嘢')
})

test('未夠連續次數就冇偏好 —— 唔可以一答錯就即刻降', () => {
  assert.equal(preferredTier('hard', advanceStreak(EMPTY_STREAK, false)), null)
  let s = EMPTY_STREAK
  s = advanceStreak(s, true)
  s = advanceStreak(s, true)
  assert.equal(preferredTier('easy', s), null)
})

test('答啱會清走連續答錯，反之亦然', () => {
  let s = EMPTY_STREAK
  s = advanceStreak(s, false)
  s = advanceStreak(s, false)
  assert.equal(s.wrong, 2)
  s = advanceStreak(s, true)
  assert.deepEqual(s, { correct: 1, wrong: 0 })
})

test('手動選擇【永遠】蓋過自適應', () => {
  let s = EMPTY_STREAK
  for (let i = 0; i < UP_STREAK; i++) s = advanceStreak(s, true)
  assert.equal(preferredTier('medium', s, 'easy'), 'easy', '手動揀咗 easy 就要係 easy')
})

test('搵唔到偏好層級就照原本次序 —— 唔會換走題目', () => {
  assert.equal(nextIndex(['easy', 'easy', 'medium'], 'hard'), 0)
  assert.equal(nextIndex(['easy', 'medium', 'hard'], 'hard'), 2)
  assert.equal(nextIndex([], 'hard'), -1)
  assert.equal(nextIndex(['easy', 'medium'], null), 0)
})

test('自適應【只排序，唔重抽】—— 換位之後題目集合完全一樣', () => {
  // 呢條係 3:5:2 嘅命根。PracticeSession 用 swap 而唔係重新 buildPool。
  const code = strip(PRACTICE)
  assert.match(code, /const swapped = \[\.\.\.questions\]/, '應該係喺原陣列換位')
  assert.ok(
    !/buildPool\([^)]*\)/.test(code.split('const next = useCallback')[1] ?? ''),
    '換題途中唔可以再叫 buildPool —— 咁樣會重抽，3:5:2 就唔保證',
  )
})

test('自適應係【無聲】—— 練習頁唔可以出現難度變化提示', () => {
  const code = strip(PRACTICE)
  for (const re of [/難度上升/, /難度下降/, /難度提升/, /levelled up/i, /difficulty (up|down)/i]) {
    assert.ok(!re.test(code), `出現咗難度變化提示 ${re}`)
  }
  // 連續數亦唔可以顯示（連續中斷會變成一件事）
  assert.ok(!/連續答對\s*\{/.test(code) && !/streak\.correct\}/.test(code), '連續數唔應該顯示')
})

// ── §4.7 分步提示 ──────────────────────────────────────────────────────────
const { ladderFor, stepsFor, STEP_COUNT } = await import('../stepHints.ts')

test('五個步驟，兩條階梯', () => {
  assert.equal(STEP_COUNT, 5)
  assert.equal(stepsFor('quantitative').length, 5)
  assert.equal(stepsFor('discursive').length, 5)
  assert.equal(ladderFor('math'), 'quantitative')
  assert.equal(ladderFor('physics'), 'quantitative')
  assert.equal(ladderFor('history'), 'discursive')
  assert.equal(ladderFor('chinese'), 'discursive')
})

test('計算階梯唔可以套落論述科 —— 「代入數值」對中國歷史係廢話', () => {
  const disc = stepsFor('discursive').map((s) => s.zh + s.promptZh).join(' ')
  for (const re of [/代入數值/, /單位/, /公式/]) {
    assert.ok(!re.test(disc), `論述階梯出現咗計算用語 ${re}`)
  }
})

test('提示只俾方向 —— 每一步都係一條問題，唔係一句答案', () => {
  for (const ladder of ['quantitative', 'discursive'] as const) {
    for (const s of stepsFor(ladder)) {
      assert.ok(
        /？|\?/.test(s.promptZh) || /^將|^寫|^搵|^用/.test(s.promptZh),
        `唔似一句提問或指示：${s.promptZh}`,
      )
    }
  }
})

test('分步提示【結構上】做唔到自動評分 —— 佢收唔到學生寫嘅字', () => {
  const code = strip(HINTS_UI)
  for (const re of [/<textarea/, /\bvalue\b\s*=/, /onChange/, /props?\.answer/, /markingScheme/]) {
    assert.ok(!re.test(code), `StepHints 掂到學生嘅輸入（${re}）—— 憲章禁長答題自動批改`)
  }
  // 唯一嘅 props 應該淨係 subjectId
  assert.match(HINTS_UI, /\{ subjectId \}: \{ subjectId: string \}/)
})

test('提示無消耗、無懲罰、可跳過', () => {
  assert.match(HINTS_UI, /無消耗/)
  assert.match(HINTS_UI, /no cost/i)
  const code = strip(HINTS_UI)
  for (const re of [/remaining|quota|credit|cost\s*[-+]/i, /localStorage/]) {
    assert.ok(!re.test(code), `提示帶咗次數／代價／紀錄（${re}）`)
  }
})

// ── §4.9 可選計時模式 ──────────────────────────────────────────────────────
const { getQuestionTimer, setQuestionTimer, remainingSeconds, isTimeUp, DEFAULT_TIMER } =
  await import('../questionTimer.ts')

test('計時預設關閉；認唔得嘅值一律當關閉', () => {
  assert.equal(DEFAULT_TIMER, 0)
  withStorage({}, () => assert.equal(getQuestionTimer(), 0))
  for (const bad of ['45', 'on', 'true', '', '-60']) {
    withStorage({ dse_question_timer: bad }, () => assert.equal(getQuestionTimer(), 0, bad))
  }
  withStorage({ dse_question_timer: '90' }, () => assert.equal(getQuestionTimer(), 90))
})

test('剩餘秒數唔會負數 —— 「超咗幾多」本身就係責備', () => {
  assert.equal(remainingSeconds(60, 75), 0)
  assert.equal(remainingSeconds(60, 0), 60)
  assert.equal(remainingSeconds(0, 999), 0, '關閉時冇倒數')
  assert.equal(isTimeUp(0, 999), false, '關閉時永遠唔會「時間到」')
  assert.equal(isTimeUp(60, 60), true)
})

test('時間到唔會強制結束 —— 冇自動交、冇跳題、冇封住選項', () => {
  const code = strip(PRACTICE)
  // qTimeUp 唔可以拎去 disable 選項或者自動叫 proceed/next
  assert.ok(!/disabled=\{[^}]*qTimeUp/.test(code), '時間到封住咗選項')
  assert.ok(!/qTimeUp[^\n]*(proceed|setCurrent|router\.push)/.test(code), '時間到自動跳走咗')
  assert.match(code, /qTimeUp && \(/, '應該只係出一段溫和提示')
})

test('隱藏計時器蓋過計時模式 —— 藏起數字而留低「時間到」等於冇藏過', () => {
  assert.match(PRACTICE, /const timerVisible = perQTimer !== 0 && !hideTimer/)
  assert.match(PRACTICE, /const qTimeUp = timerVisible &&/)
})

// ── §4.8 個人進度時間軸 ────────────────────────────────────────────────────
const { windowFor, statsIn, compare, isBlank } = await import('../personalTimeline.ts')

test('星期由星期一起計；上一週啱好早七日', () => {
  const wed = new Date(2026, 7, 26, 15, 0, 0).getTime() // 2026-08-26 係星期三
  const [cs, ce] = windowFor('week', 0, wed)
  assert.equal(new Date(cs).getDay(), 1, '今週應該由星期一開始')
  assert.equal(ce - cs, 7 * 86400000)
  const [ps] = windowFor('week', -1, wed)
  assert.equal(cs - ps, 7 * 86400000)
})

test('月份由 1 號起計', () => {
  const t = new Date(2026, 7, 26).getTime()
  const [cs] = windowFor('month', 0, t)
  assert.equal(new Date(cs).getDate(), 1)
  const [ps, pe] = windowFor('month', -1, t)
  assert.equal(new Date(ps).getMonth(), 6, '上個月應該係 7 月（0-indexed 6）')
  assert.equal(pe, cs)
})

test('只數落喺窗口入面嘅紀錄', () => {
  const now = Date.now()
  const store = {
    dse_progress: JSON.stringify([
      { subjectId: 'math', subjectName: '數學', topicFilter: null, score: 5, total: 20,
        grade: '3', topicResults: [], elapsed: 100, timestamp: now - 3600_000 },
      { subjectId: 'math', subjectName: '數學', topicFilter: null, score: 5, total: 20,
        grade: '3', topicResults: [], elapsed: 100, timestamp: now - 400 * 86400000 },
    ]),
  }
  withStorage(store, () => {
    const s = statsIn(now - 86400000, now + 86400000)
    assert.equal(s.questions, 20, '一年前嗰次唔應該計入')
    assert.equal(s.activeDays, 1)
  })
})

test('兩段時間都空白就當空白 —— 一版 0 讀落係「你乜都冇做過」', () => {
  withStorage({}, () => {
    assert.equal(isBlank(compare('week')), true)
  })
})

test('時間軸【結構上】攞唔到他人數據', () => {
  const src = read('lib/personalTimeline.ts')
  const imports = src.split('\n').filter((l) => /^\s*import\b/.test(l)).join('\n')
  for (const re of [/supabase/i, /fetch/i, /api\//i, /peer/i, /class/i]) {
    assert.ok(!re.test(imports), `時間軸 import 咗 ${re}`)
  }
  const code = strip(TIMELINE_UI)
  for (const re of [/超越/, /百分位/, /percentile/i, /全班/, /平均分/, /average/i, /rank/i]) {
    assert.ok(!re.test(code), `時間軸出現咗同人比較嘅字眼 ${re}`)
  }
})

test('數字跌咗唔可以用紅色 —— 平台冇資格幫呢件事定性', () => {
  const code = strip(TIMELINE_UI)
  for (const re of [/text-rose/, /bg-rose/, /退步/, /進步咗/, /做少咗/]) {
    assert.ok(!re.test(code), `時間軸出現咗判斷性呈現 ${re}`)
  }
  // 真正嘅不變式：差額嘅顏色唔可以跟正負變。
  // （「not a worse you」呢句係反過嚟安慰，所以唔可以純粹掃 worse 呢個字。）
  const delta = code.match(/function Delta\([\s\S]*?\n\}/)?.[0] ?? ''
  assert.ok(delta.length > 0, '搵唔到 Delta 組件')
  const colourClasses = [...delta.matchAll(/text-[a-z-]+/g)].map((m) => m[0])
  assert.equal(new Set(colourClasses).size, 1, `差額用咗多過一隻字色：${colourClasses.join(' / ')}`)
  assert.ok(!/d > 0 \?[^\n]*text-/.test(delta), '差額顏色跟正負變')
})

test('英文文案唔可以夾中文（非華語考生）', () => {
  const CJK = /[一-鿿]/
  for (const m of TIMELINE_UI.matchAll(/\?\s*'([^']*)'\s*\n?\s*:/g)) {
    assert.ok(!CJK.test(m[1]), `英文文案夾咗中文：${m[1]}`)
  }
})

// ── 層級叫法唔可以喺兩個地方開兩套 ─────────────────────────────────────────
test('選擇器嘅層級名同徽章一致；hard 唔會因為選擇器而變返有徽章', async () => {
  const { DIFFICULTY_TIERS, TIER_REQUEST_LABELS } = await import('../difficulty.ts')
  assert.equal(TIER_REQUEST_LABELS.easy.zh, DIFFICULTY_TIERS.easy.label)
  assert.equal(TIER_REQUEST_LABELS.medium.zh, DIFFICULTY_TIERS.medium.label)
  assert.equal(TIER_REQUEST_LABELS.easy.en, DIFFICULTY_TIERS.easy.labelEn)
  assert.equal(TIER_REQUEST_LABELS.medium.en, DIFFICULTY_TIERS.medium.labelEn)
  // 「隱形最深層」設計不變：hard 依然冇徽章
  assert.equal(DIFFICULTY_TIERS.hard.label, null, 'hard 唔應該有徽章')
  assert.equal(DIFFICULTY_TIERS.hard.labelEn, null)
  // 但選擇器要叫得出佢
  assert.ok(TIER_REQUEST_LABELS.hard.zh.length > 0)
  assert.ok(TIER_REQUEST_LABELS.hard.en.length > 0)
})

test('練習頁唔可以自己另開一套層級叫法', () => {
  const code = strip(PRACTICE)
  for (const word of ['普通', '拔尖']) {
    assert.ok(!code.includes(word), `練習頁出現咗第三套叫法「${word}」`)
  }
  assert.match(code, /TIER_REQUEST_LABELS\[tier\]/)
})
