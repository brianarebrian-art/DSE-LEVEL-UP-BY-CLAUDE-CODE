// ============================================================================
// draft-topic-registration.test.mts —— 草稿嘅 topicId 必須已登記
// ----------------------------------------------------------------------------
// 點解要有呢個閘：
// promote-drafts.mjs 會把草稿嘅 `topicId` 直接寫入題庫，但【唔會驗】呢個 id
// 喺唔喺該科嘅 curated topics 清單入面。一旦唔喺，條題目就變成「孤兒課題」——
// 題喺庫入面存在，但學生用課題入口（/practice?subject=X&topic=Y、科目頁嘅
// 課題 chips、/notes）永遠篩唔到。呢件事已經真實發生過：現存題庫仍有 58 條
// 孤兒題（見 node scripts/qbank/topic-coverage.mjs）。
//
// 呢個閘擺喺【草稿】層而唔係 promote 層，係因為咁樣問題會喺真人審批之前就浮面 ——
// 審批完先發現要改 id，等於要重新審一次。
//
// 修法：唔係喺呢度加豁免，而係去該科嘅 *Topics 登記個 id。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const { getSubjectTopics } = await import('../index.ts')

const DRAFTS = 'scripts/qbank/drafts'

// 草稿檔名 → 科目 id。冇喺呢度登記嘅草稿檔會被跳過並喺下面單獨報告，
// 以免新增草稿時靜靜地繞過本閘。
const SUBJECT_OF: Record<string, string> = {
  // 已入庫嘅早期書寫題批次 —— 一併納入，令現存登記狀態亦有迴歸保護。
  'chinese-fanwen-long-batch1.json': 'chinese',
  'chinese-p2-writing-batch1.json': 'chinese',
  'english-written-batch1.json': 'english',
  'math-long-batch-1.json': 'math',
  'history-p2-essays.json': 'history',
  'chinese-p2-writing-batch2.json': 'chinese',
  'chinese-p1-fillin.json': 'chinese',
  'math-p1-long.json': 'math',
}

const files = readdirSync(DRAFTS).filter(
  (f) => f.endsWith('.json') && !f.endsWith('.decisions.json'),
)

for (const [file, subject] of Object.entries(SUBJECT_OF)) {
  test(`${file}：全部 topicId 都已喺 ${subject} 登記`, () => {
    assert.ok(files.includes(file), `草稿檔 ${file} 唔見咗 —— 改名或刪走咗就要一齊更新本測試`)
    const registered = new Set((getSubjectTopics(subject) as { id: string }[]).map((t) => t.id))
    assert.ok(registered.size > 0, `${subject} 冇登記任何課題`)
    const rows: { id: string; topicId?: string }[] = JSON.parse(readFileSync(`${DRAFTS}/${file}`, 'utf8'))
    const missing = [...new Set(rows.filter((r) => r.topicId && !registered.has(r.topicId)).map((r) => r.topicId!))]
    assert.deepEqual(
      missing, [],
      `未登記嘅 topicId（promote 之後會變孤兒課題，學生永遠篩唔到）：${missing.join('、')}\n` +
      `→ 去 data/questions/${subject === 'chinese-history' ? 'chinese-history' : subject}.ts 嘅 *Topics 登記，唔好喺呢度加豁免。`,
    )
  })
}

test('每個草稿檔都有登記所屬科目（唔准靜靜繞過本閘）', () => {
  // 只管本輪新增嘅書寫題草稿。舊 MC 草稿檔一直用中文標籤做 topic（見 _gate.mjs
  // 註釋），佢哋嘅孤兒問題係另一條軌，唔喺呢度處理 —— 硬加會即刻誤殺 21 條
  // 等緊人手審嘅草稿（憲章 §6：唔准以 feature change 令現有數據集失效）。
  const written = files.filter((f) => {
    try {
      const rows = JSON.parse(readFileSync(`${DRAFTS}/${f}`, 'utf8'))
      return Array.isArray(rows) && rows.some((r) => r?.type === 'long' || r?.type === 'text')
    } catch { return false }
  })
  const unmapped = written.filter((f) => !(f in SUBJECT_OF))
  assert.deepEqual(
    unmapped.filter((f) => {
      const rows = JSON.parse(readFileSync(`${DRAFTS}/${f}`, 'utf8'))
      return rows.some((r: { topicId?: string }) => r?.topicId) // 只有用 topicId 嘅先受本閘管
    }),
    [],
    '有書寫題草稿用咗 topicId 但未喺 SUBJECT_OF 登記所屬科目',
  )
})
