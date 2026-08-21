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
  "art-chinese-lrxj-comp-1": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-lrxj-comp-2": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-lrxj-comp-3": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-lrxj-comp-4": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-lrxj-lexis-0": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-lrxj-synthesis-5": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-yxdz-content-0": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-yxdz-diction-3": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-yxdz-technique-1": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "art-chinese-yxdz-technique-2": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", batch: "chinese-fanwen-weak-84" },
  "bafs-01": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "bafs-02": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "bafs-03": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "bafs-04": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "bafs-05": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "bafs-06": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "ctx-demo-1": { reviewer: "brian", reviewedAt: "2026-07-17", batch: "chinese-crosstext-demo" },
  "ctx-demo-2": { reviewer: "brian", reviewedAt: "2026-07-17", batch: "chinese-crosstext-demo" },
  "econ-ms-mc-0": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-1": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-2": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-3": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-4": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-5": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-6": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-7": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-8": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-ms-mc-9": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-0": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-1": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-2": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-3": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-4": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-5": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-6": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-7": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-8": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "econ-sd-mc-9": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "eng-idiom-01": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", batch: "english-idioms-batch" },
  "eng-idiom-02": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", batch: "english-idioms-batch" },
  "eng-idiom-03": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", batch: "english-idioms-batch" },
  "eng-idiom-04": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", batch: "english-idioms-batch" },
  "eng-idiom-05": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", batch: "english-idioms-batch" },
  "eng-idiom-06": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", batch: "english-idioms-batch" },
  "math_imp_031": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_033": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_035": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_039": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_041": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_042": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_044": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_045": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_048": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_052": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_058": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_060": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_061": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_062": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_063": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_064": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_066": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_067": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_068": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_072": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_082": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_086": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_096": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_098": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "math_imp_100": { reviewer: "brian", reviewedAt: "2026-08-07", batch: "en-backfill-51" },
  "zh_long_b1_01": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_02": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_03": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_04": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_05": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_06": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_07": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_08": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_09": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_10": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_11": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_12": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_13": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_14": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_15": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_16": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_17": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_18": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_19": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_long_b1_20": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-fanwen-long-batch1" },
  "zh_p2_b1_01": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-p2-writing-batch1" },
  "zh_p2_b1_02": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-p2-writing-batch1" },
  "zh_p2_b1_03": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-p2-writing-batch1" },
  "zh_p2_b1_04": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-p2-writing-batch1" },
  "zh_p2_b1_05": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-p2-writing-batch1" },
  "zh_p2_b1_06": { reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", batch: "chinese-p2-writing-batch1" },
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
  { batch: "bafs-batch", subject: "bafs", reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", approved: 6 },
  { batch: "chinese-crosstext-demo", subject: "chinese", reviewer: "brian", reviewedAt: "2026-07-17", approved: 2 },
  { batch: "chinese-fanwen-long-batch1", subject: "chinese", reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", approved: 20 },
  { batch: "chinese-fanwen-weak-84", subject: "chinese", reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-17", approved: 10 },
  { batch: "chinese-p2-writing-batch1", subject: "chinese", reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-08-07", approved: 6 },
  { batch: "econ-market-structure-mc-10", subject: "economics", reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-18", approved: 10 },
  { batch: "econ-supply-demand-mc-10", subject: "economics", reviewer: "brian", reviewedAt: "2026-07-17", approved: 10 },
  { batch: "en-backfill-51", subject: "translation", reviewer: "brian", reviewedAt: "2026-08-07", approved: 51 },
  { batch: "english-idioms-batch", subject: "english", reviewer: "望咩望,未見過海綿寶寶咩?", reviewedAt: "2026-07-23", approved: 6 },
]

/** 有實名審批紀錄嘅題目總數。 */
export const REVIEWED_COUNT = 95

/** 查一條題目有冇實名審批紀錄。冇 = 回 undefined，唔會拗直。 */
export const getReviewRecord = (questionId: string): ReviewRecord | undefined =>
  REVIEWED[questionId]
