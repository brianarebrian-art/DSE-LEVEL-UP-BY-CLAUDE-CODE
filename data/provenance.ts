// ⚠️ 本檔由 scripts/gen-provenance.mjs 自動生成，請勿手改。
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
  "bafs_acct_b1_01": { reviewer: "brian", reviewedAt: "2026-09-26", batch: "bafs-accounts-b1" },
  "bafs_acct_b1_02": { reviewer: "brian", reviewedAt: "2026-09-26", batch: "bafs-accounts-b1" },
  "bafs_acct_b1_03": { reviewer: "brian", reviewedAt: "2026-09-26", batch: "bafs-accounts-b1" },
  "bafs_acct_b1_04": { reviewer: "brian", reviewedAt: "2026-09-26", batch: "bafs-accounts-b1" },
  "bafs_acct_b1_05": { reviewer: "brian", reviewedAt: "2026-09-26", batch: "bafs-accounts-b1" },
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
  { batch: "bafs-accounts-b1", subject: "bafs", reviewer: "brian", reviewedAt: "2026-09-26", approved: 5 },
]

/** 有實名審批紀錄嘅題目總數。 */
export const REVIEWED_COUNT = 5

/** 查一條題目有冇實名審批紀錄。冇 = 回 undefined，唔會拗直。 */
export const getReviewRecord = (questionId: string): ReviewRecord | undefined =>
  REVIEWED[questionId]
