// ============================================================================
// topic-registration.test.mts —— 每一條題目嘅 topic 必須係已註冊課題
// ----------------------------------------------------------------------------
// 科目頁嘅課題 chip 只列【已註冊】課題，連去 /practice?subject=X&topic=<id>；
// PracticeSession 嘅 buildPool 以 `q.topic === topicFilter` 篩選。所以一條
// topic id 未註冊嘅題目，喺任何課題入口都篩唔到 —— 佢入咗庫，但學生搵唔到。
//
// ══ 病源有兩個，唔係一個 ══
//
// 一、草稿嘅 `topic` 欄一直係【人類可讀標籤】（例如「需求變動 vs 需求量變動」）。
//    冇填 `topicId` 嘅話，promote 時 slug() 會原樣帶入，變成一個中文 id。
//    2026-08-23 實測 61 條中招（economics 20／bafs 6／math 23／chinese 12）。
//
// 二、code-generated bank 嘅 T map 自己開咗一個同註冊表唔同嘅 id。
//    chemistry-bank.ts 寫 'mole_concept'，但 chemistry.ts 註冊嘅係 'mole'
//    —— 29 條題目就咁掛咗喺一個唔存在嘅課題上。
//
// ⚠️ 判準係【有冇註冊】，唔係【有冇中文】。英文科 6 條（Idiom_in_context 等）
//    同屬呢個病，但標籤本身係英文，掃中文字元完全捉唔到。呢個測試掃嘅係
//    註冊表，所以兩種都捉到。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getSubjectQuestions, getSubjectTopics } = await import('../index.ts')
const { getActiveSubjects } = await import('../../subjects.ts')

/**
 * 已知仍然未修嘅孤兒課題，逐個附理由。
 *
 * 呢個唔係「豁免清單」而係「未還嘅債」—— 每一條都有人負責，修完就要喺此
 * 刪走（測試會因為「少咗一個預期孤兒」而紅，逼人更新，唔會靜靜過關）。
 */
const KNOWN_ORPHANS: Record<string, number> = {
  // 數學科註冊表冇「近似與誤差」「數系」一類課題。硬塞入 percentage 或 indices
  // 都係作假 —— 要新增課題定係保留孤兒，屬創辦人決定。
  'math / 有效數字': 1,
  'math / 數系判別': 1,
  // M1 唯一嘅孤兒課題。已另開單處理（正確嘅已註冊 id 係 'binomial'）。
  'm1 / binomial_theorem': 10,
}

test('每一條題目嘅 topic 都要係該科已註冊嘅課題 id', () => {
  const found: Record<string, number> = {}
  for (const s of getActiveSubjects()) {
    const registered = new Set(getSubjectTopics(s.id).map((t) => t.id))
    for (const q of getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]) {
      const topic = String(q.topic)
      if (registered.has(topic)) continue
      const key = `${s.id} / ${topic}`
      found[key] = (found[key] ?? 0) + 1
    }
  }
  assert.deepEqual(
    found,
    KNOWN_ORPHANS,
    '孤兒課題清單同預期唔一致。\n' +
      '  · 多咗 → 有新題目掛咗喺未註冊嘅 topic id 上，學生喺課題入口篩唔到佢。\n' +
      '    草稿要填 `topicId`（已註冊 id），`topic` 留返做人類可讀標籤。\n' +
      '  · 少咗 → 有孤兒已經修好，請喺 KNOWN_ORPHANS 刪走嗰一行。\n' +
      `  實際：${JSON.stringify(found, null, 2)}`,
  )
})

test('修正表只准指向已註冊課題 —— 唔准經呢條路新增課題', async () => {
  const { readFileSync } = await import('node:fs')
  const doc = JSON.parse(
    readFileSync(new URL('../../../scripts/qbank/topic-id-fixes.json', import.meta.url), 'utf8'),
  ) as { fixes: { subject: string; rows: { id: string; topicId: string }[] }[] }
  const bad: string[] = []
  for (const batch of doc.fixes) {
    const registered = new Set(getSubjectTopics(batch.subject).map((t) => t.id))
    for (const r of batch.rows) {
      if (!registered.has(r.topicId)) bad.push(`${batch.subject}/${r.id} → ${r.topicId}`)
    }
  }
  assert.deepEqual(bad, [], `修正表指向未註冊課題：\n  ${bad.join('\n  ')}`)
})

test('修正表列出嘅題目，實際 topic 已經係表上嗰個 id', async () => {
  const { readFileSync } = await import('node:fs')
  const doc = JSON.parse(
    readFileSync(new URL('../../../scripts/qbank/topic-id-fixes.json', import.meta.url), 'utf8'),
  ) as { fixes: { subject: string; rows: { id: string; topicId: string; topicEn?: string }[] }[] }
  const bad: string[] = []
  for (const batch of doc.fixes) {
    const byId = new Map(
      (getSubjectQuestions(batch.subject) as unknown as Record<string, unknown>[]).map((q) => [String(q.id), q]),
    )
    for (const r of batch.rows) {
      const q = byId.get(r.id)
      if (!q) { bad.push(`${batch.subject}/${r.id} 喺 live 題庫搵唔到`); continue }
      if (q.topic !== r.topicId) bad.push(`${batch.subject}/${r.id} topic 係 ${String(q.topic)}，應為 ${r.topicId}`)
      if (r.topicEn && q.topicEn !== r.topicEn) bad.push(`${batch.subject}/${r.id} topicEn 未套用`)
    }
  }
  assert.deepEqual(bad, [], `修正表同 live 題庫對唔上（apply-topic-ids.mts 未跑？）：\n  ${bad.join('\n  ')}`)
})
