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
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const DRAFTS = 'scripts/qbank/drafts'
const OUT = 'data/provenance.ts'

/** 只收 approved。rejected 同 pending 唔係「已入庫」，唔可以當審批紀錄出。 */
const APPROVED = 'approved'

// ══ 第二條紀律：批咗 ≠ 上咗線 ══
//
// /transparency 同 /trust 兩版都用 REVIEWED_COUNT 講同一句話：
// 「N 條題目有實名審批紀錄 —— 佔現時 X 條【上線】題目嘅 pct%」。
// 呢句話成立嘅前提係 N ⊆ 上線題目。本生成器原本淨係數 decisions.json 入面
// approved 嘅 id，冇問過嗰條題係咪 promote 咗 —— 兩個數放埋一齊就會講大咗。
//
// 2026-09-12 撞正：Yuna 一次過批晒 1,878 條草稿（全部未 promote）。
// 照舊生成的話 REVIEWED_COUNT 604 → 2,482，百分比 2.31% → 9.47%，
// 而多出嗰 1,878 條學生一條都做唔到。憲章 §8 禁虛構統計，呢個就係一單。
//
// 所以：approved 之上再加一層 —— 要真係載入得到先計。
// 條題一日未 wire 入 load.ts，佢就一日唔會出現喺呢個檔度；promote 完再跑一次
// 就會自己入返嚟。
const liveIds = () => {
  const out = execFileSync('npx', ['tsx', 'scripts/qbank/live-ids.mts'], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  })
  const arr = JSON.parse(out)
  // 空集 = 列舉行錯咗，唔係「一條題都冇上線」。噉樣落去會靜靜哋清空成個
  // provenance 檔（604 → 0），對外變成「我哋一條實名審批都冇」。寧可死。
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('live-ids.mts 回咗空集 —— 題庫列舉失敗，拒絕生成（唔可以靜靜哋清空 provenance）')
  }
  return new Set(arr)
}

export function collect() {
  const entries = {}
  const batches = []
  if (!fs.existsSync(DRAFTS)) return { entries, batches }
  const live = liveIds()

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
      if (!live.has(id)) continue // 批咗但未 promote —— 見上方 liveIds() 註釋
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

// ── 只有【直接執行】本腳本先會寫檔 ──────────────────────────────────────
// 2026-08-28 之前呢段喺模組頂層無條件執行，於是任何人 `import` 佢都會寫檔 ——
// 包括 lib/__tests__/trust-disclosure.test.mts 嗰條「provenance 生成檔冇過時」。
// 後果係嗰條 test 【只可能紅一次】：
//   第一次跑 → import 觸發寫檔，但 REVIEWED 早喺檔案頂部 import 咗（舊值）→ 紅
//   第二次跑 → 檔案已經被上一次跑修好 → 綠
// 即係話一條用嚟守審批紀錄嘅閘，自己把自己修好，仲要訓練人「再跑一次睇下」。
// 實測：入完 43 條數學題之後跑 `npm test` 得 617/1 紅，緊接再跑就 618/0。
//
// 加咗守衛之後，條 test 會【一直紅】直到有人真係去跑 `node scripts/gen-provenance.mjs`
// 並且 commit 生成檔 —— 呢個先係佢本來想做嘅事。
const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url
if (isDirectRun) {
  const out = render(collect())
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
  if (prev === out) {
    console.log('✅ data/provenance.ts 已係最新（無變更）')
  } else {
    fs.writeFileSync(OUT, out)
    console.log(`✅ 已生成 data/provenance.ts`)
  }
}
