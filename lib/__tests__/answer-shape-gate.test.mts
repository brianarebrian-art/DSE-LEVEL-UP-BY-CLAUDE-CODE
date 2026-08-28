// ============================================================================
// answer-shape-gate.test.mts —— 答案形狀閘（正確項唔可以明顯最長）
// ----------------------------------------------------------------------------
// 呢個閘擋嘅係一種「題目睇落正常、但根本冇考到科目」嘅缺陷：
// 概念題／評價題嘅正確答案本身要有轉折（「A，同時亦 B」），干擾項就好易寫成
// 短促斷言（「消除了一切戰爭」）。結果學生一條都唔識，淨係揀最長嗰項就攞高分。
//
// 已經兩次實際發生：公社科第三批 34 條、歷史補底初稿 88%（36/43）。
// 兩次都係靠事後人手量度先發現 —— 所以要落閘，唔可以靠記得。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const g = await import('../../scripts/qbank/_gate.mjs') as unknown as {
  visualLength: (s: string) => number
  answerShapeMargin: (o: string[], i: number) => number
  SHAPE_MARGIN_LIMIT: number
  gateRow: (row: unknown, subject: string) => string[]
}

const BASELINE = 'scripts/qbank/shape-baseline.json'

const probe = (options: string[], correctIndex: number, id = 'probe_shape_x') => ({
  id, type: 'mc', subject: 'history', topic: 'hist_source', topicId: 'hist_source',
  difficulty: 'basic', question: '閘門測試探針題目，永不入庫。', options, correctIndex,
  explanation: '此為閘門測試用嘅探針題目，永遠唔會經 promote 入庫，只用嚟驗證形狀閘。',
})
const shapeErrs = (row: unknown) => g.gateRow(row, 'history').filter((e) => e.includes('正確答案明顯最長'))

test('視覺長度剝走 LaTeX —— 短分數唔可以被當成長答案', () => {
  // 呢條係本閘可用嘅前提。用字串長度嘅話 `$\frac{1}{9}$` 有 13 個字元，
  // 會令數學／M1 大量正解被誤判為「明顯最長」（實測 math_log_10、m1_el_59 等）。
  assert.ok(g.visualLength('$\\frac{1}{9}$') < g.visualLength('0.111'),
    '$\\frac{1}{9}$ 畫出嚟應該窄過 0.111')
  assert.ok(g.visualLength('$\\sqrt{20}$') <= 4, '$\\sqrt{20}$ 應該當成 3–4 個字闊')
  assert.equal(g.visualLength('反映漫畫家及其預期讀者對事件的看法'), 17)
})

test('正確項明顯最長 —— 必須攔住', () => {
  const errs = shapeErrs(probe(
    ['這是一個明顯比其他三項都要長得多的正確答案選項', '短答案甲', '短答案乙', '短答案丙'], 0))
  assert.equal(errs.length, 1, '一條正解長 19 個字嘅題目竟然過到閘')
  assert.match(errs[0], /視覺字/)
})

test('四項長度相若 —— 唔可以誤報', () => {
  // 一個成日嘈嘅閘好快會被繞過，到時就等於冇。
  assert.deepEqual(shapeErrs(probe(
    ['這是長度相若的正確答案甲', '這是長度相若的干擾項乙', '這是長度相若的干擾項丙', '這是長度相若的干擾項丁'], 0)), [])
})

test('干擾項比正解長 —— 唔可以攔（本閘只管單一方向）', () => {
  assert.deepEqual(shapeErrs(probe(
    ['短正解', '這是一個寫得非常長而且相當詳盡的干擾項', '干擾項乙', '干擾項丙'], 0)), [])
})

test('祖父清單之內嘅舊題獲豁免', () => {
  const ids: string[] = JSON.parse(readFileSync(BASELINE, 'utf8')).ids
  assert.ok(ids.length > 0, '祖父清單係空 —— 生成過程可能出錯')
  const bad = ['這是一個明顯比其他三項都要長得多的正確答案選項', '短答案甲', '短答案乙', '短答案丙']
  assert.deepEqual(shapeErrs(probe(bad, 0, ids[0])), [], `${ids[0]} 喺祖父清單之內，唔應該被攔`)
  assert.equal(shapeErrs(probe(bad, 0, 'a_brand_new_id')).length, 1, '新 id 必須照攔')
})

// ── 棘輪：豁免只准減，唔准加 ────────────────────────────────────────────────
test('祖父清單唔可以變長（新題要過閘，唔係加豁免）', () => {
  const b = JSON.parse(readFileSync(BASELINE, 'utf8')) as { ids: string[]; count: number; limit: number }
  assert.equal(b.ids.length, b.count, 'count 同 ids 長度對唔上 —— 重新跑 gen-shape-baseline.mjs')
  assert.equal(b.limit, g.SHAPE_MARGIN_LIMIT, '清單記低嘅門檻同 _gate.mjs 唔一致')
  // 呢個上限係人手釘死嘅。想加豁免就要改呢個數字，而改嗰刻會出現喺 diff 入面，
  // 唔會靜靜地滑過去 —— 呢個先係重點。
  const CEILING = 166
  assert.ok(b.ids.length <= CEILING,
    `豁免由 ${CEILING} 增加到 ${b.ids.length} —— 新題應該改長干擾項令佢過閘，而唔係加入豁免清單。`
    + '\n  如果係刻意擴大（例如收窄門檻令更多舊題入列），請一併調高本測試嘅 CEILING 並喺 commit 講明原因。')
  assert.equal(new Set(b.ids).size, b.ids.length, '祖父清單有重複 id')
})
