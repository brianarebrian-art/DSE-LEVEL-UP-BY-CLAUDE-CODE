// 逆向錯因真相引擎嘅行為測試。
//
// 全部用注入嘅 priorLogs 陣列，絕對唔掂 localStorage —— Node 入面
// `window` 係 undefined，reverseLog 兩個函數都會靜靜降級（寫入 no-op、
// 讀出空陣列）。之前有版本嘅測試靠 logReverseError 寫入再讀返出嚟，
// 喺 Node 上必然全部 fail。
//
// 另外，呢度用真題庫嘅 topic id（fanwen_content / integrated /
// quadratic_equations）而唔係篇名，因為引擎就係靠 id 命中。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const {
  inferTruth,
  diagnose,
  cumulativeReviewNote,
  calculateFingerprint,
  REPEAT_QUESTION_WINDOW_DAYS,
  REPEAT_SLIP_WINDOW_DAYS,
} = await import('../truth-engine.ts')

type Cause = 'A' | 'B' | 'C'
type Diff = 'easy' | 'medium' | 'hard'

const NOW = Date.UTC(2026, 7, 5, 12, 0, 0) // 固定時間基準，測試唔會隨真實日期漂移
const DAY = 24 * 60 * 60 * 1000

function entry(over: Partial<Record<string, unknown>> = {}) {
  return {
    subjectId: 'economics',
    questionId: 'econ-001',
    topic: '供求',
    topicId: 'demand_supply',
    cause: 'A' as Cause,
    selected: '選項一',
    correct: '選項二',
    ts: NOW,
    ...over,
  } as never
}

// ── 真相 1／2：概念盲區按難度分流 ──────────────────────────────────────────

test('真相 1：cause A + easy → 基礎概念盲點', () => {
  const t = inferTruth(entry({ cause: 'A', difficulty: 'easy' as Diff }), [], NOW)
  assert.equal(t.id, 1)
  assert.equal(t.key, 'basic-concept')
})

test('真相 1：cause A + medium → 基礎概念盲點', () => {
  const t = inferTruth(entry({ cause: 'A', difficulty: 'medium' as Diff }), [], NOW)
  assert.equal(t.key, 'basic-concept')
})

test('真相 2：cause A + hard → 進階概念', () => {
  const t = inferTruth(entry({ cause: 'A', difficulty: 'hard' as Diff }), [], NOW)
  assert.equal(t.id, 2)
  assert.equal(t.key, 'advanced-concept')
})

test('真相 2：cause A + 難度未知（舊記錄）→ 歸進階，唔會誤判做基礎', () => {
  const t = inferTruth(entry({ cause: 'A', difficulty: undefined }), [], NOW)
  assert.equal(t.key, 'advanced-concept')
})

// ── 真相 4：審題陷阱 / 運算粗心（spec 同用 id 4，靠 key 分辨）──────────────

test('真相 4：cause B → 審題陷阱', () => {
  const t = inferTruth(entry({ cause: 'B' }), [], NOW)
  assert.equal(t.id, 4)
  assert.equal(t.key, 'question-trap')
})

test('真相 4：cause C 且無重覆 → 運算粗心（同 id 4 但唔同 key）', () => {
  const t = inferTruth(entry({ cause: 'C' }), [], NOW)
  assert.equal(t.id, 4)
  assert.equal(t.key, 'careless')
})

test('question-trap 同 careless 係兩條唔同訊息 —— 淨靠 id 分唔開', () => {
  const b = inferTruth(entry({ cause: 'B' }), [], NOW)
  const c = inferTruth(entry({ cause: 'C' }), [], NOW)
  assert.equal(b.id, c.id)
  assert.notEqual(b.key, c.key)
  assert.notEqual(b.message[0], c.message[0])
  assert.notEqual(b.message[1], c.message[1])
})

// ── 真相 3：同課題 7 日內第二次運算失手 ────────────────────────────────────

test('真相 3：第二次就觸發（唔係第三次）', () => {
  const prior = [entry({ cause: 'C', questionId: 'econ-000', ts: NOW - 2 * DAY })]
  const t = inferTruth(entry({ cause: 'C' }), [prior[0]], NOW)
  assert.equal(t.id, 3)
  assert.equal(t.key, 'repeat-slip')
})

test('真相 3：只有今次一條（priorLogs 空）唔觸發', () => {
  const t = inferTruth(entry({ cause: 'C' }), [], NOW)
  assert.equal(t.key, 'careless')
})

test('真相 3：超出 7 日窗口唔觸發', () => {
  const old = entry({ cause: 'C', questionId: 'econ-000', ts: NOW - (REPEAT_SLIP_WINDOW_DAYS + 1) * DAY })
  const t = inferTruth(entry({ cause: 'C' }), [old], NOW)
  assert.equal(t.key, 'careless')
})

test('真相 3：唔同課題唔觸發', () => {
  const other = entry({ cause: 'C', questionId: 'econ-000', topicId: 'elasticity', ts: NOW - DAY })
  const t = inferTruth(entry({ cause: 'C' }), [other], NOW)
  assert.equal(t.key, 'careless')
})

test('真相 3：同課題但錯因唔同（A）唔觸發', () => {
  const other = entry({ cause: 'A', questionId: 'econ-000', ts: NOW - DAY })
  const t = inferTruth(entry({ cause: 'C' }), [other], NOW)
  assert.equal(t.key, 'careless')
})

// ── 真相 7：同一題 30 日內第二次錯 ─────────────────────────────────────────

test('真相 7：第二次就觸發（v3 off-by-one 迴歸測試）', () => {
  const prior = [entry({ ts: NOW - 5 * DAY })]
  const t = inferTruth(entry({ cause: 'B' }), prior, NOW)
  assert.equal(t.id, 7)
  assert.equal(t.key, 'repeat-question')
})

test('真相 7：第一次錯絕對唔會觸發', () => {
  const t = inferTruth(entry({ cause: 'B' }), [], NOW)
  assert.equal(t.key, 'question-trap')
})

test('真相 7：超出 30 日窗口唔觸發', () => {
  const old = entry({ ts: NOW - (REPEAT_QUESTION_WINDOW_DAYS + 1) * DAY })
  const t = inferTruth(entry({ cause: 'B' }), [old], NOW)
  assert.equal(t.key, 'question-trap')
})

test('真相 7：優先於 cause 分流（跨錯因覆蓋）', () => {
  const prior = [entry({ cause: 'A', ts: NOW - DAY })]
  const t = inferTruth(entry({ cause: 'C' }), prior, NOW)
  assert.equal(t.key, 'repeat-question')
})

test('真相 7 帶 lockReason，其餘真相冇', () => {
  const seven = inferTruth(entry(), [entry({ ts: NOW - DAY })], NOW)
  assert.ok(seven.lockReason)
  assert.equal(seven.lockReason?.length, 2)
  assert.equal(inferTruth(entry({ cause: 'B' }), [], NOW).lockReason, undefined)
})

// ── 真相 5：中文指定範文（真題庫係 fanwen_ 前綴，唔係篇名）──────────────────

for (const topicId of ['fanwen_content', 'fanwen_diction', 'fanwen_lines']) {
  test(`真相 5：中文 ${topicId} → 指定範文提示`, () => {
    const t = inferTruth(entry({ subjectId: 'chinese', topicId, topic: '指定範文・內容' }), [], NOW)
    assert.equal(t.id, 5)
    assert.equal(t.key, 'set-text')
  })
}

test('真相 5：舊記錄冇 topicId 時，靠標籤「指定範文」命中', () => {
  const t = inferTruth(
    entry({ subjectId: 'chinese', topicId: undefined, topic: '指定範文・名句手法' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'set-text')
})

test('真相 5：中文非範文課題唔觸發', () => {
  const t = inferTruth(
    entry({ subjectId: 'chinese', topicId: 'rhetoric', topic: '修辭手法', cause: 'B' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'question-trap')
})

test('真相 5：非中文科即使 topicId 撞名都唔觸發', () => {
  const t = inferTruth(
    entry({ subjectId: 'chinese-literature', topicId: 'fanwen_content', cause: 'B' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'question-trap')
})

test('真相 5：spec 用嘅篇名（岳陽樓記）唔係真題庫訊號 —— 唔會命中', () => {
  // 記錄呢個事實：155 條中文題冇一條 topic 標籤係篇名，
  // 所以任何靠篇名 match 嘅實作喺真數據上都係死碼。
  const t = inferTruth(
    entry({ subjectId: 'chinese', topicId: undefined, topic: '岳陽樓記', cause: 'B' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'question-trap')
})

// ── 真相 6：計數機程序（現時靜止，等 #83 真人驗證）────────────────────────

test('真相 6：貼士卡未經真人驗證前保持靜止', () => {
  // data/calcTips.ts 5 張卡全部 verified:false。呢個測試釘住嘅係
  // 「唔會喺冇清單可對嘅情況下叫學生去對清單」，唔係釘住卡嘅數量。
  const t = inferTruth(
    entry({ subjectId: 'math', topicId: 'quadratic_equations', topic: '二次方程', cause: 'B' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'question-trap')
})

test('真相 6：數學題庫冇任何 topic 標籤含「程序」或 program', async () => {
  // spec 靠 topic.includes('程序') / includes('program') 命中；
  // 對住真 bank 呢個條件恆為 false，所以實作改用 calcTips 對應表。
  const m = (await import('../../data/questions/math.ts')) as Record<string, unknown>
  const qs = m.mathQuestions as { topicZh: string; topic: string }[]
  const bad = qs.filter(
    (q) =>
      q.topicZh.includes('程序') ||
      q.topicZh.toLowerCase().includes('program') ||
      q.topic.toLowerCase().includes('program'),
  )
  assert.equal(bad.length, 0)
})

// ── 真相 8：英文 Integrated Skills ─────────────────────────────────────────

test('真相 8：topicId integrated → Integrated Skills 提示', () => {
  const t = inferTruth(
    entry({ subjectId: 'english', topicId: 'integrated', topic: 'Integrated Skills' }),
    [],
    NOW,
  )
  assert.equal(t.id, 8)
  assert.equal(t.key, 'integrated-skills')
})

test('真相 8：舊記錄靠標籤 Integrated Skills 命中', () => {
  const t = inferTruth(
    entry({ subjectId: 'english', topicId: undefined, topic: 'Integrated Skills' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'integrated-skills')
})

test('真相 8：英文其他課題唔觸發', () => {
  const t = inferTruth(
    entry({ subjectId: 'english', topicId: 'grammar', topic: 'Grammar', cause: 'B' }),
    [],
    NOW,
  )
  assert.equal(t.key, 'question-trap')
})

test('真相 8 對應嘅 topic id 喺真題庫存在', async () => {
  const m = (await import('../../data/questions/english.ts')) as Record<string, unknown>
  const qs = m.englishQuestions as { topicZh: string; topic: string }[]
  assert.ok(qs.some((q) => q.topic === 'integrated' && q.topicZh === 'Integrated Skills'))
})

test('真相 5 對應嘅 fanwen_ topic id 喺真題庫存在', async () => {
  const m = (await import('../../data/questions/chinese.ts')) as Record<string, unknown>
  const qs = m.chineseQuestions as { topic: string }[]
  assert.ok(qs.some((q) => q.topic.startsWith('fanwen_')))
})

// ── 真相 9：累積重溫（實數，零虛構）───────────────────────────────────────

test('真相 9：實數計去重後嘅課題數', () => {
  const logs = [
    entry({ topicId: 'demand_supply' }),
    entry({ topicId: 'demand_supply' }), // 同課題唔重覆計
    entry({ topicId: 'elasticity' }),
    entry({ topicId: 'ppf' }),
  ]
  const note = cumulativeReviewNote(logs)
  assert.ok(note)
  assert.equal(note.id, 9)
  assert.ok(note.message[0].includes('3 個課題'))
  assert.ok(note.message[1].includes('3 topics'))
})

test('真相 9：同名課題但唔同科目分開計', () => {
  const logs = [
    entry({ subjectId: 'math', topicId: 'statistics' }),
    entry({ subjectId: 'biology', topicId: 'statistics' }),
  ]
  assert.ok(cumulativeReviewNote(logs)?.message[0].includes('2 個課題'))
})

test('真相 9：得 1 個課題唔出（避免同主真相重覆）', () => {
  assert.equal(cumulativeReviewNote([entry()]), null)
})

test('真相 9：空記錄回 null', () => {
  assert.equal(cumulativeReviewNote([]), null)
})

// ── 指紋 ───────────────────────────────────────────────────────────────────

test('指紋：錯因—難度序列，newest-first', () => {
  const logs = [
    entry({ cause: 'A', difficulty: 'hard' as Diff }),
    entry({ cause: 'C', difficulty: 'easy' as Diff }),
    entry({ cause: 'B', difficulty: 'medium' as Diff }),
  ]
  assert.equal(calculateFingerprint(logs), 'A-hard→C-easy→B-medium')
})

test('指紋：舊記錄冇 difficulty 顯示為 ?（真實未知，唔亂填）', () => {
  assert.equal(calculateFingerprint([entry({ cause: 'B', difficulty: undefined })]), 'B-?')
})

test('指紋：只取最近 20 條', () => {
  const logs = Array.from({ length: 30 }, () => entry({ cause: 'A', difficulty: 'easy' as Diff }))
  assert.equal(calculateFingerprint(logs).split('→').length, 20)
})

test('指紋：空記錄回空字串', () => {
  assert.equal(calculateFingerprint([]), '')
})

// ── diagnose 整合 ──────────────────────────────────────────────────────────

test('diagnose：主真相 + 累積提示 + 指紋一次過出', () => {
  const prior = [entry({ questionId: 'econ-009', topicId: 'elasticity', cause: 'C', difficulty: 'hard' as Diff })]
  const r = diagnose(entry({ cause: 'A', difficulty: 'easy' as Diff }), prior, NOW)
  assert.equal(r.truth.key, 'basic-concept')
  assert.ok(r.cumulative) // 2 個課題
  assert.equal(r.fingerprint, 'A-easy→C-hard')
})

test('diagnose：指紋把當前記錄排喺最前（同 reverseLog newest-first 一致）', () => {
  const prior = [entry({ cause: 'B', difficulty: 'hard' as Diff, questionId: 'x' })]
  const r = diagnose(entry({ cause: 'C', difficulty: 'easy' as Diff }), prior, NOW)
  assert.ok(r.fingerprint.startsWith('C-easy→'))
})

test('diagnose：priorLogs 預設空 → 當作第一次錯，唔會誤觸發重覆類真相', () => {
  const r = diagnose(entry({ cause: 'C' }), undefined, NOW)
  assert.equal(r.truth.key, 'careless')
  assert.equal(r.cumulative, null)
})

// ── 憲章紅線 ───────────────────────────────────────────────────────────────

test('所有真相訊息都係雙語，中英俱備且非空', () => {
  const samples = [
    inferTruth(entry({ cause: 'A', difficulty: 'easy' as Diff }), [], NOW),
    inferTruth(entry({ cause: 'A', difficulty: 'hard' as Diff }), [], NOW),
    inferTruth(entry({ cause: 'B' }), [], NOW),
    inferTruth(entry({ cause: 'C' }), [], NOW),
    inferTruth(entry({ cause: 'C' }), [entry({ cause: 'C', ts: NOW - DAY, questionId: 'z' })], NOW),
    inferTruth(entry(), [entry({ ts: NOW - DAY })], NOW),
    inferTruth(entry({ subjectId: 'chinese', topicId: 'fanwen_content' }), [], NOW),
    inferTruth(entry({ subjectId: 'english', topicId: 'integrated' }), [], NOW),
    cumulativeReviewNote([entry({ topicId: 'a' }), entry({ topicId: 'b' })])!,
  ]
  for (const t of samples) {
    assert.equal(t.message.length, 2)
    assert.ok(t.message[0].trim().length > 0, `zh 空：${t.key}`)
    assert.ok(t.message[1].trim().length > 0, `en 空：${t.key}`)
  }
  assert.equal(new Set(samples.map((t) => t.key)).size, samples.length) // 每條都唔同
})

test('憲章 §7：訊息唔准出現打擊自信字眼', () => {
  const banned = ['FAIL', 'Fail', '失敗', '不合格', '差', '蠢', '笨']
  const all = [
    inferTruth(entry({ cause: 'A', difficulty: 'easy' as Diff }), [], NOW),
    inferTruth(entry({ cause: 'A', difficulty: 'hard' as Diff }), [], NOW),
    inferTruth(entry({ cause: 'B' }), [], NOW),
    inferTruth(entry({ cause: 'C' }), [], NOW),
    inferTruth(entry({ cause: 'C' }), [entry({ cause: 'C', ts: NOW - DAY, questionId: 'z' })], NOW),
    inferTruth(entry(), [entry({ ts: NOW - DAY })], NOW),
    inferTruth(entry({ subjectId: 'chinese', topicId: 'fanwen_content' }), [], NOW),
    inferTruth(entry({ subjectId: 'english', topicId: 'integrated' }), [], NOW),
  ]
  for (const t of all) {
    for (const w of banned) {
      assert.ok(!t.message[0].includes(w), `${t.key} 中文含「${w}」`)
      assert.ok(!t.message[1].includes(w), `${t.key} 英文含「${w}」`)
    }
  }
})
