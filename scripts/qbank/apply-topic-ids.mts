// ============================================================================
// apply-topic-ids.mts —— 把孤兒課題接返去已註冊嘅 topic id
// ----------------------------------------------------------------------------
// ══ 呢個唔係 promote-drafts 嘅替代品 ══
// promote-drafts 係【由草稿產生題目】；本腳本淨係做一件事：改已入庫題目嘅
// `topic`（課題 id）同 `topicEn`（英文課題名）。題目內容、選項、correctIndex、
// 解析、英文譯文一律逐欄斷言不變。
//
// ══ 點解唔直接重跑 promote-drafts ══
// 單子原本要求重跑三個批次。查證之後唔可以照做，三個具體理由：
//
//   ① `economics-reviewed.ts` 嘅 source 係 `econ-combined.json` —— 該檔已經
//      唔存在。唔加 `--out` 重跑兩個分開嘅 draft，第二批會冚走第一批
//      （promote-drafts.mjs 自己嘅註釋記錄咗 2026-08-07 就係咁樣整無咗 12 條）。
//
//   ② 重跑會剷走 20 條【人手核准】嘅英文譯文。economics 兩個 draft 完全冇
//      questionEn／optionsEn／explanationEn；live 嗰 20 條有齊，係 2026-08-07
//      由 apply-translations.mjs 補入（譯稿 en-backfill-51，reviewer brian，
//      逐條 approved）。promote 只寫 draft 有嘅嘢。
//
//   ③ bafs 更差：`bafs-batch.json` 有英文欄，但同 live 嘅六條【全部唔同】。
//      重跑會用舊嗰版靜靜覆蓋人手核准嗰版，而 apply-translations.mjs 嘅
//      第 ④ 條不變式（目標題目必須本來就冇 En 欄）令佢救唔返。
//
// 故此改用一個窄口、逐欄斷言嘅 applier —— 同 apply-translations.mjs 同一路數。
// 目標檔標明「Do NOT hand-edit」，本腳本正正就係為咗唔使手改：改動由
// `topic-id-fixes.json` 決定，可重跑、可審計。
//
// ══ 唔涉及任何審批記錄 ══
// 本腳本【唔會】讀寫任何 decisions.json，亦唔會碰 reviewer 欄。課題 id 係
// 路由資料，唔係題目內容 —— 冇新題入庫，冇答案改動，故此唔需要（亦唔應該）
// 借用真人簽名。
//
// 用法：npx tsx scripts/qbank/apply-topic-ids.mts [--dry]
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { getSubjectTopics } from '../../data/questions/index.ts'

const DRY = process.argv.includes('--dry')
const FIXES = 'scripts/qbank/topic-id-fixes.json'

interface Row { id: string; topicId: string; topicEn?: string }
interface Batch { file: string; subject: string; rows: Row[] }
interface Doc { fixes: Batch[]; notFixed?: { id: string; topic: string; why: string }[] }

const doc = JSON.parse(readFileSync(FIXES, 'utf8')) as Doc
const errs: string[] = []
const writes: { file: string; text: string; changed: number }[] = []

/** 讀 bank 檔入面嗰個 JSON 陣列，同時記低前後綴以便原樣寫返。 */
function slice(src: string): { head: string; body: string; tail: string } {
  const i = src.indexOf('= [')
  const j = src.lastIndexOf(']')
  if (i < 0 || j < 0) throw new Error('搵唔到題目陣列')
  return { head: src.slice(0, i + 2), body: src.slice(i + 2, j + 1), tail: src.slice(j + 1) }
}

/** 依照 toReviewedQuestion 嘅欄位次序重砌，令 topicEn 落喺 topicZh 之後。 */
function withTopicEn(q: Record<string, unknown>, topicEn: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(q)) {
    out[k] = q[k]
    if (k === 'topicZh') out.topicEn = topicEn
  }
  if (!('topicEn' in out)) out.topicEn = topicEn
  return out
}

for (const batch of doc.fixes) {
  const registered = new Set(getSubjectTopics(batch.subject).map((t) => t.id))
  let src: string
  try { src = readFileSync(batch.file, 'utf8') } catch (e) { errs.push(`${batch.file}: 讀唔到 —— ${(e as Error).message}`); continue }

  let parts: ReturnType<typeof slice>
  try { parts = slice(src) } catch (e) { errs.push(`${batch.file}: ${(e as Error).message}`); continue }

  let rows: Record<string, unknown>[]
  try { rows = JSON.parse(parts.body) } catch (e) { errs.push(`${batch.file}: JSON 解析失敗 —— ${(e as Error).message}`); continue }

  // 生死線：先確認【未改動】嘅陣列可以逐字重現原檔。做唔到就代表本腳本嘅
  // 序列化同原檔格式唔一致，一寫落去就會產生大量與本次修正無關嘅 diff。
  const roundTrip = JSON.stringify(rows, null, 2)
  if (roundTrip !== parts.body) {
    errs.push(`${batch.file}: 序列化對唔返原檔格式 —— 拒絕寫入（避免製造無關 diff）`)
    continue
  }

  const byId = new Map(rows.map((q) => [String(q.id), q]))
  const before = new Map(rows.map((q) => [String(q.id), JSON.stringify(q)]))
  let changed = 0

  for (const r of batch.rows) {
    const q = byId.get(r.id)
    if (!q) { errs.push(`${batch.file}: 搵唔到題目 ${r.id}`); continue }
    if (!registered.has(r.topicId)) {
      errs.push(`${batch.file}/${r.id}: topicId「${r.topicId}」唔喺 ${batch.subject} 嘅已註冊課題之內 —— 本腳本唔准新增課題`)
      continue
    }
    const idx = rows.indexOf(q)
    const next = r.topicEn ? withTopicEn(q, r.topicEn) : { ...q }
    next.topic = r.topicId
    rows[idx] = next
    changed++
  }

  // 生死線：除咗 topic／topicEn，其餘每一欄都要逐字不變。
  for (const q of rows) {
    const id = String(q.id)
    const orig = JSON.parse(before.get(id) as string) as Record<string, unknown>
    const keys = new Set([...Object.keys(orig), ...Object.keys(q)])
    for (const k of keys) {
      if (k === 'topic' || k === 'topicEn') continue
      if (JSON.stringify(orig[k]) !== JSON.stringify(q[k])) {
        errs.push(`${batch.file}/${id}: 欄位 ${k} 被改動 —— 拒絕寫入`)
      }
    }
  }

  writes.push({ file: batch.file, text: parts.head + JSON.stringify(rows, null, 2) + parts.tail, changed })
}

console.log('='.repeat(70))
console.log('孤兒課題修正')
console.log('='.repeat(70))
if (errs.length > 0) {
  console.error(`\n✗ ${errs.length} 項問題 —— 一個檔都冇寫：`)
  for (const e of errs) console.error(`   ${e}`)
  process.exit(1)
}
for (const w of writes) {
  if (!DRY) writeFileSync(w.file, w.text)
  console.log(`  ${DRY ? '（試跑）' : '✓'} ${w.file} —— ${w.changed} 條`)
}
console.log(`\n合計 ${writes.reduce((s, w) => s + w.changed, 0)} 條${DRY ? '（試跑，冇寫檔）' : ''}`)
for (const n of doc.notFixed ?? []) console.log(`  · 未修 ${n.id}（${n.topic}）—— ${n.why}`)
