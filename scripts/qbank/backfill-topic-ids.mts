// ============================================================================
// backfill-topic-ids.mts —— 為已審批草稿補回 topicId / topicZh / topicEn
// ----------------------------------------------------------------------------
// 點解要有：`toReviewedQuestion()` 只會照抄草稿有嘅欄。草稿冇 `topicId` 就會
// 用 `slug(topic)`，中文標籤 slug 完仍然係中文，match 唔到任何已註冊 id ——
// 條題目變成孤兒課題，學生喺課題入口【永遠篩唔到佢】。冇 `topicEn` 就英文介面
// 顯示中文標籤。兩樣都唔會令題目消失，所以唔會有人察覺。
//
// 2026-09-12 實測：66 批已審批草稿 promote 之後，678 條題目冇 topicEn、
// 21 個 (科|topic) 組合係孤兒。
//
// 兩種情況分開處理：
//   ① `topic` 本身已經係註冊 id（62 組）—— 由課題表查返 zh / en，純補資料。
//   ② `topic` 係人類可讀標籤（21 組，全部係跨課題／跨單元批次）—— 冇得自動推，
//      下面 CROSS_UNIT 逐條寫死主課題。跨課題題目本質上跨幾個課題，
//      揀一個【主】課題入去，係為咗令佢喺課題入口出得返嚟；
//      原本嗰個描述性標籤會保留落 `topicZh`，學生見到嘅字唔會變。
//
// 用法：npx tsx scripts/qbank/backfill-topic-ids.mts [--apply]
// ============================================================================

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const APPLY = process.argv.includes('--apply')
const D = 'scripts/qbank/drafts'

// 跨課題批次 → 主課題 id。揀嘅準則：條題目【最主要考】嗰一個課題。
const CROSS_UNIT: Record<string, string> = {
  // math-crossunit-batch
  'math-cu-01': 'quadratic_equations',  // 圍欄圍最大面積 —— 二次函數頂點
  'math-cu-02': 'percentage',           // 百分變化 → 面積
  'math-cu-03': 'geometric_sequence',   // 等比數列應用
  'math-cu-04': 'trigonometry',         // 仰角、高度與距離
  'math-cu-05': 'indices',              // 指數折舊
  // econ-crossunit-batch
  'econ-cu-01': 'firm_production',      // 生產成本、邊際分析
  'econ-cu-02': 'demand_supply',        // 從量稅、供求均衡、稅負轉嫁
  'econ-cu-03': 'market_failure',       // 共用品、市場失靈
  'econ-cu-04': 'trade',                // 比較優勢、貿易得益
  'econ-cu-05': 'macroeconomics',       // 通脹、名義與實質
  // english-crossunit-batch
  'eng-cu-01': 'p1_vocab_ref',          // vocabulary in context
  'eng-cu-02': 'p1_tone',               // tone / attitude
  'eng-cu-03': 'reading',               // main idea vs supporting detail
  'eng-cu-04': 'p1_vocab_ref',          // reference / cohesion
  'eng-cu-05': 'p1_inference',          // function of a sentence
  // bafs-batch-2
  'bafs-07': 'accounting',              // 合夥會計（盈利分撥）
  'bafs-08': 'accounting',              // 合夥會計（退伙・重估）
  'bafs-09': 'accounting',              // 銀行往來調節表
  'bafs-10': 'accounting',              // 存貨計價（正常損耗）
  'bafs-11': 'costing',                 // 停產決策・邊際成本
  'bafs-12': 'costing',                 // 本量利・目標利潤
}

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)
const { getSubjectTopics } = await mod<{
  getSubjectTopics: (id: string) => Array<{ id: string; zh?: string; en?: string }>
}>('../../data/questions/index.ts')

const topicsFor = new Map<string, Map<string, { zh?: string; en?: string }>>()
const lookup = (subject: string, id: string) => {
  if (!topicsFor.has(subject)) topicsFor.set(subject, new Map(getSubjectTopics(subject).map((t) => [t.id, t])))
  return topicsFor.get(subject)!.get(id)
}

let touched = 0, files = 0
const unresolved: string[] = []

for (const f of readdirSync(D)) {
  if (!f.endsWith('.json') || f.startsWith('_') || f.endsWith('.decisions.json')
    || f.endsWith('.rejected.json') || f.endsWith('.sample.json')) continue
  const dp = join(D, f.replace(/\.json$/, '.decisions.json'))
  if (!existsSync(dp)) continue
  const dec = JSON.parse(readFileSync(dp, 'utf8'))
  if (!String(dec?._meta?.reviewer ?? '').trim()) continue
  const subject = dec._meta.subject
  const raw = JSON.parse(readFileSync(join(D, f), 'utf8'))
  const arr = Array.isArray(raw) ? raw : (raw.questions ?? raw.rows ?? raw.drafts ?? [])
  let changed = 0
  for (const q of arr) {
    const cross = CROSS_UNIT[q.id]
    const id = q.topicId ?? cross ?? q.topic
    const t = lookup(subject, id)
    if (!t) { if (!q.topicEn) unresolved.push(`${subject} / ${q.id} / ${id}`); continue }
    const before = JSON.stringify([q.topicId, q.topicZh, q.topicEn])
    q.topicId = id
    // 跨課題批次保留原本嗰個描述性標籤 —— 學生見到嘅字一個都唔應該變。
    q.topicZh ??= cross ? q.topic : (t.zh ?? q.topic)
    q.topicEn ??= t.en
    if (JSON.stringify([q.topicId, q.topicZh, q.topicEn]) !== before) changed++
  }
  if (changed) {
    files++; touched += changed
    if (APPLY) writeFileSync(join(D, f), JSON.stringify(raw, null, 2) + '\n')
  }
}

console.log(`${APPLY ? '✅ 已改' : 'DRY-RUN'} — ${files} 個檔 · ${touched} 條題目補咗 topicId／topicZh／topicEn`)
if (unresolved.length) {
  console.log(`\n⚠️ 仍然解唔到（${unresolved.length}）—— 要人手加入 CROSS_UNIT：`)
  for (const u of unresolved.slice(0, 40)) console.log('   ' + u)
}
