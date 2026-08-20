#!/usr/bin/env node
// 由 scripts/qbank/drafts/*.decisions.json 生成 data/provenance.ts。
//
// ══ 點解要有呢個 ══
// 學生對一個免費題庫嘅第一個懷疑係「啲題係咪求其作出嚟」。平台其實有實名逐題
// 審批紀錄（decisions.json，同時備份喺 Supabase review_decisions），但學生一筆
// 都見唔到。攤出嚟，個懷疑先答得到。
//
// ══ 最重要嘅一條紀律 ══
// 只可以出【真係有紀錄】嗰啲。5,201 條 live 題入面，得約 121 條有實名審批。
// 呢個比例唔好聽，但唯一可以講嘅就係佢 —— 一個聲稱「全部經專家審核」而攞唔出
// 名單嘅平台，比一個講「121 條有實名紀錄，名單喺呢度」嘅平台可信度低得多。
// 所以本檔【永遠唔會】為冇紀錄嘅題目補一個「已審核」。
//
// ══ 點解生成靜態檔而唔係查 DB ══
// ① 題庫本身係靜態，審批紀錄亦唔會事後變 —— 冇理由為咗顯示一個定值而開 DB 連線。
// ② 生成檔 check 入 git，任何人 clone 落嚟都對得返 decisions.json，可審計。
// ③ $0：零 runtime 查詢、零額外請求。
// 對應嘅代價係可能過時，所以配一個測試：重新生成必須同 check-in 嘅檔一致。

import fs from 'node:fs'
import path from 'node:path'

const DRAFTS = 'scripts/qbank/drafts'
const OUT = 'data/provenance.ts'

/** 只收 approved。rejected 同 pending 唔係「已入庫」，唔可以當審批紀錄出。 */
const APPROVED = 'approved'

export function collect() {
  const entries = {}
  const batches = []
  if (!fs.existsSync(DRAFTS)) return { entries, batches }

  for (const file of fs.readdirSync(DRAFTS).filter((f) => f.endsWith('.decisions.json')).sort()) {
    let json
    try {
      json = JSON.parse(fs.readFileSync(path.join(DRAFTS, file), 'utf8'))
    } catch {
      continue // 壞檔跳過好過令 build 死 —— 但唔會靜靜當佢通過
    }
    const meta = json?._meta ?? {}
    const decisions = json?.decisions ?? {}
    const reviewer = String(meta.reviewer ?? '').trim()
    const reviewedAt = String(meta.reviewedAt ?? '').trim()

    // 冇實名審批人／冇日期 = 唔算實名審批紀錄，整批跳過。
    // 呢度係機器唔可以代人簽名嗰條紅線嘅落實點。
    if (!reviewer || !reviewedAt) continue

    let n = 0
    for (const [id, decision] of Object.entries(decisions)) {
      if (decision !== APPROVED) continue
      entries[id] = { reviewer, reviewedAt, batch: file.replace('.decisions.json', '') }
      n++
    }
    if (n > 0) {
      batches.push({
        batch: file.replace('.decisions.json', ''),
        subject: String(meta.subject ?? '').trim() || 'unknown',
        reviewer, reviewedAt, approved: n,
      })
    }
  }
  return { entries, batches }
}

function render({ entries, batches }) {
  const ids = Object.keys(entries).sort()
  const rows = ids.map((id) => {
    const e = entries[id]
    return `  ${JSON.stringify(id)}: { reviewer: ${JSON.stringify(e.reviewer)}, reviewedAt: ${JSON.stringify(e.reviewedAt)}, batch: ${JSON.stringify(e.batch)} },`
  }).join('\n')

  const batchRows = batches
    .sort((a, b) => a.batch.localeCompare(b.batch))
    .map((b) => `  { batch: ${JSON.stringify(b.batch)}, subject: ${JSON.stringify(b.subject)}, reviewer: ${JSON.stringify(b.reviewer)}, reviewedAt: ${JSON.stringify(b.reviewedAt)}, approved: ${b.approved} },`)
    .join('\n')

  return `// ⚠️ 本檔由 scripts/gen-provenance.mjs 自動生成，請勿手改。
// 來源：scripts/qbank/drafts/*.decisions.json（同時備份於 Supabase review_decisions）。
// 重新生成：node scripts/gen-provenance.mjs
//
// 只收錄【approved 且有實名審批人同日期】嘅題目。冇紀錄嘅題目唔會出現喺呢度，
// 亦【永遠唔會】被補上一個「已審核」—— 見生成器檔頭嘅紀律說明。

export interface ReviewRecord {
  /** 實名審批人（真人，非虛擬角色） */
  reviewer: string
  /** 審批日期 YYYY-MM-DD */
  reviewedAt: string
  /** 所屬批次檔名 */
  batch: string
}

/** 題目 id → 實名審批紀錄。 */
export const REVIEWED: Record<string, ReviewRecord> = {
${rows}
}

export interface ReviewBatch {
  batch: string
  subject: string
  reviewer: string
  reviewedAt: string
  approved: number
}

/** 逐批彙總，供透明度頁顯示。 */
export const REVIEW_BATCHES: ReviewBatch[] = [
${batchRows}
]

/** 有實名審批紀錄嘅題目總數。 */
export const REVIEWED_COUNT = ${ids.length}

/** 查一條題目有冇實名審批紀錄。冇 = 回 undefined，唔會拗直。 */
export const getReviewRecord = (questionId: string): ReviewRecord | undefined =>
  REVIEWED[questionId]
`
}

const out = render(collect())
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
if (prev === out) {
  console.log('✅ data/provenance.ts 已係最新（無變更）')
} else {
  fs.writeFileSync(OUT, out)
  console.log(`✅ 已生成 data/provenance.ts`)
}
