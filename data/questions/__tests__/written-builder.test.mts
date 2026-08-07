// 書寫題工廠嘅守衛測試。
//
// 呢啲守衛係 build-time 嘅 —— 一條缺料嘅書寫題應該喺編譯／載入嗰刻就炸，
// 而唔係靜靜入到庫，等學生做完之後先發現冇參考答案可對。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { makeQ, makeText, makeLong } = await import('../_builder.ts')

const topic = { id: 'demand_supply', zh: '供求', en: 'Demand & Supply' }
const fw = { id: 'micro', zh: '微觀經濟', en: 'Microeconomics', emoji: '📈' }
const P = (zh: string, en: string) => [zh, en] as [string, string]

const t = makeText('economics')
const l = makeLong('economics')

// ── makeText ────────────────────────────────────────────────────────────

test('makeText 產出 type=text，帶齊中英參考答案', () => {
  const q = t('e1', topic, fw, 'medium', 2024, 3,
    P('列出需求定律', 'State the law of demand'),
    P('價格上升，需求量下降', 'As price rises, quantity demanded falls'),
    P('其他條件不變下的反向關係', 'An inverse relationship, ceteris paribus'))
  assert.equal(q.type, 'text')
  assert.equal(q.subject, 'economics')
  assert.equal(q.referenceAnswer, '價格上升，需求量下降')
  assert.equal(q.referenceAnswerEn, 'As price rises, quantity demanded falls')
  assert.equal(q.marks, 3)
})

test('makeText 唔會帶 options／correctIndex（呢個題型冇客觀對錯）', () => {
  const q = t('e2', topic, fw, 'easy', 2024, 2, P('a', 'a'), P('b', 'b'), P('c', 'c'))
  assert.equal('options' in q, false)
  assert.equal('correctIndex' in q, false)
})

// ── makeLong ────────────────────────────────────────────────────────────

test('makeLong 產出 type=long；markingScheme 屬選填', () => {
  const q = l('e3', topic, fw, 'hard', 2024, 12,
    P('試分析最低工資對就業的影響', 'Analyse the employment effect of a minimum wage'),
    P('分三層：理論、圖示、限制', 'Three layers: theory, diagram, limitations'))
  assert.equal(q.type, 'long')
  assert.equal(q.markingScheme, undefined)
  assert.equal(q.markingSchemeEn, undefined)
})

test('makeLong 傳咗 markingScheme 就中英一齊寫入', () => {
  const q = l('e4', topic, fw, 'hard', 2024, 12, P('a', 'a'), P('b', 'b'), {
    markingScheme: P('理論 4 分／圖示 4 分／評價 4 分', 'Theory 4 / Diagram 4 / Evaluation 4'),
    suggestedMinutes: 18,
  })
  assert.equal(q.markingScheme, '理論 4 分／圖示 4 分／評價 4 分')
  assert.equal(q.markingSchemeEn, 'Theory 4 / Diagram 4 / Evaluation 4')
  assert.equal(q.suggestedMinutes, 18)
})

// ── 守衛：缺料一定要炸 ──────────────────────────────────────────────────

test('【核心】冇參考答案 → 拋錯（學生冇嘢對照，自評做唔到）', () => {
  assert.throws(
    () => t('x', topic, fw, 'easy', 2024, 2, P('a', 'a'), P('', 'en'), P('c', 'c')),
    /referenceAnswer must not be empty/,
  )
  assert.throws(
    () => t('x', topic, fw, 'easy', 2024, 2, P('a', 'a'), P('   ', 'en'), P('c', 'c')),
    /referenceAnswer must not be empty/,
  )
})

test('【核心】冇英文參考答案 → 拋錯（全站雙語）', () => {
  assert.throws(
    () => t('x', topic, fw, 'easy', 2024, 2, P('a', 'a'), P('中文', ''), P('c', 'c')),
    /referenceAnswerEn must not be empty/,
  )
  assert.throws(
    () => l('x', topic, fw, 'easy', 2024, 2, P('a', 'a'), P('中文', '  ')),
    /referenceAnswerEn must not be empty/,
  )
})

test('marks 非正數 → 拋錯', () => {
  for (const bad of [0, -1, NaN, Infinity]) {
    assert.throws(
      () => t('x', topic, fw, 'easy', 2024, bad, P('a', 'a'), P('b', 'b'), P('c', 'c')),
      /marks must be a positive number/,
      `marks=${bad} 應該被拒`,
    )
  }
})

test('markingScheme 只有一種語言 → 拋錯（攤開一半空白比冇更差）', () => {
  assert.throws(
    () => l('x', topic, fw, 'hard', 2024, 10, P('a', 'a'), P('b', 'b'), { markingScheme: P('只有中文', '') }),
    /markingScheme needs both zh and en/,
  )
  assert.throws(
    () => l('x', topic, fw, 'hard', 2024, 10, P('a', 'a'), P('b', 'b'), { markingScheme: P('', 'en only') }),
    /markingScheme needs both zh and en/,
  )
})

test('suggestedMinutes 非正數 → 拋錯', () => {
  assert.throws(
    () => l('x', topic, fw, 'hard', 2024, 10, P('a', 'a'), P('b', 'b'), { suggestedMinutes: 0 }),
    /suggestedMinutes must be a positive number/,
  )
})

// ── makeQ 零回歸 ────────────────────────────────────────────────────────

test('【零回歸】makeQ 行為完全不變：type=mc、correctIndex=0、重複選項照樣拋錯', () => {
  const q = makeQ('economics')('m1', topic, fw, 'medium', 2024, 1,
    P('題目', 'Question'),
    [P('正解', 'Correct'), P('錯誤', 'Wrong')],
    P('解析', 'Explanation'))
  assert.equal(q.type, 'mc')
  assert.equal(q.correctIndex, 0)
  assert.equal(q.options[0], '正解')

  assert.throws(
    () => makeQ('economics')('m2', topic, fw, 'medium', 2024, 1, P('a', 'a'), [P('同', 'x'), P('同', 'y')], P('c', 'c')),
    /duplicate option text/,
  )
  assert.throws(
    () => makeQ('economics')('m3', topic, fw, 'medium', 2024, 1, P('a', 'a'), [P('得一個', 'one')], P('c', 'c')),
    /needs ≥2 options/,
  )
})
