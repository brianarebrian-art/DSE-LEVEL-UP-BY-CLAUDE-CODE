// ============================================================================
// term-redlines.test.mts —— 術語紅線：既要攔得住，又唔可以誤殺
// ----------------------------------------------------------------------------
// 憲章 §5 訂明強制術語對照（Public Good → 共用品，不可寫「公共財」）。
// 呢個閘同時有兩種失效方式，兩種都要鎖：
//
//   ① 攔唔到 —— 規則放寬過頭，違規詞照樣入庫。
//   ② 誤殺   —— 規則太闊，合法用語被當成違規，出題人被逼改成錯嘅寫法，
//                或者索性喺閘度加豁免，最後整條紅線名存實亡。
//
// 2026-08-27 實際踩過 ②：/公共財/ 連「公共財**政**」（public finances）一齊捉。
// 呢個係完全正確嘅中文，同 Public Good 冇任何關係。當日一條公民科人口老化題
// 就係因此被機器閘自動退回。
//
// 影響統計（憲章 §6，改閘前實測）：掃 89 個題庫檔，「公共財」命中 0 次 ——
// 即係話呢個誤報從未喺 live 內容爆過，加負向斷言對現有題庫零影響。
//
// 呢個檔【唔可以】只測「攔到違規詞」。只測一邊嘅閘測試，正正就係令人為咗
// 熄紅而放寬規則嗰陣冇嘢會紅。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { gateRow } = await import('../../../scripts/qbank/_gate.mjs')

const row = (question: string) => ({
  id: 'termtest_01', type: 'mc', subject: 'economics',
  topic: '市場', topicId: 'market_mechanism', topicZh: '市場', topicEn: 'Market',
  difficulty: 'basic', question,
  options: ['甲選項內容', '乙選項內容', '丙選項內容', '丁選項內容'],
  correctIndex: 0, explanation: '這是一段足夠長度的解析文字，用以通過格式檢查，內容並非重點。',
})
const term = (q: string) => (gateRow(row(q), 'economics') as string[]).filter((e) => /術語紅線/.test(e))

test('攔得住：「公共財」必須被術語紅線退回', () => {
  assert.equal(term('下列關於公共財的敘述，何者正確？').length, 1,
    '「公共財」係憲章 §5 明文禁用詞（應為「共用品」），閘放咗佢過去')
})

test('唔誤殺：「公共財政」係合法用語，唔可以當成違規', () => {
  assert.deepEqual(term('人口老化對公共財政的主要影響是甚麼？'), [],
    '「公共財政」＝ public finances，同 Public Good 無關；誤報會逼出題人寫錯字')
})

test('唔誤殺：同一句同時出現兩者時，只應攔違規嗰個', () => {
  assert.equal(term('公共財政支出用於提供公共財。').length, 1,
    '應攔「公共財。」而唔應該連「公共財政」一齊計')
})

test('正寫「共用品」暢通無阻', () => {
  assert.deepEqual(term('下列關於共用品的敘述，何者正確？'), [])
})
