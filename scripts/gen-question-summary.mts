#!/usr/bin/env -S npx tsx
// ============================================================================
// gen-question-summary.mts —— 產生 data/questions/summary.generated.ts
// ----------------------------------------------------------------------------
//   npx tsx scripts/gen-question-summary.mts
//   npm run gen:summary
//
// 點解要有呢個檔：
//
// `data/questions/index.ts`（barrel）靜態 import 齊 25 科題庫。喺 server 冇問題，
// 但一個 `'use client'` 檔一 import 佢，webpack 就要將【全部題目】build 入
// 瀏覽器 —— 呢點 data/questions/load.ts 檔頭一直有警告。
//
// 2026-09-05 喺生產站實測，證實咗呢件事一直發生緊：
//   /          171 個資源，其中 28 個題庫 chunk，2.2MB 未壓縮，涵蓋 23 科
//   /subjects  171 個資源，28 個題庫 chunk，全 25 科
//   /relax      38 個資源，0 個題庫 chunk（對照組）
// 首頁下載 1,067 條題目嘅資料，然後一條都唔顯示 —— 因為佢只係想要一個總數。
//
// 呢個檔就係嗰個總數（連埋課題清單同逐課題題數）：50KB JSON、gzip 12KB，
// 取代 2.2MB。凡係只需要「數字」同「課題名」嘅 client 組件都應該讀呢度，
// 唔好掂 barrel。真係需要題目內容嗰啲，行 load.ts 嘅逐科 lazy loader。
//
// ⚠️ 呢個檔【產生出嚟】，唔好手改。數字同題庫脫節 = 向學生顯示失實數字，
//    同憲章 §8「不虛構數據」係同一類問題（Topic.count 檔頭已為咗同樣理由
//    由人手維護改成衍生）。data/questions/__tests__/summary-parity.test.mts
//    每次 npm test 都會拎真題庫重算一次同呢個檔比對，唔一致即刻紅。
// ============================================================================
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const idx = await import(join(ROOT, 'data/questions/index.ts')) as {
  getSubjectQuestions: (id: string) => { type?: string }[]
  getSubjectTopics: (id: string) => Record<string, unknown>[]
}
const { subjects } = await import(join(ROOT, 'data/subjects.ts')) as {
  subjects: { id: string; isActive?: boolean }[]
}

const active = subjects.filter((s) => s.isActive !== false)

const summary: Record<string, { total: number; mc: number; written: number; topics: number }> = {}
const topics: Record<string, unknown[]> = {}

for (const s of active) {
  const qs = idx.getSubjectQuestions(s.id)
  const mc = qs.filter((q) => (q.type ?? 'mc') === 'mc').length
  const ts = idx.getSubjectTopics(s.id)
  summary[s.id] = { total: qs.length, mc, written: qs.length - mc, topics: ts.length }
  // 只帶【呈現同篩選】需要嘅欄位。刻意逐個列出而唔係整個 spread ——
  // Topic 將來加欄位唔應該靜靜哋令呢個檔發脹。
  topics[s.id] = ts.map((t) => ({
    id: t.id, zh: t.zh, en: t.en,
    framework: t.framework, frameworkEn: t.frameworkEn, emoji: t.emoji,
    count: t.count, mcCount: t.mcCount, writtenCount: t.writtenCount,
  }))
}

const total = Object.values(summary).reduce((n, v) => n + v.total, 0)

// ⚠️ 呢個檔【產生出嚟】—— 檔頭文案受 term-guard 管（同 load.ts 一樣位於
// data/questions/ 之下），所以下面嘅字一律用書面語。
const out = `// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts（每次 npm test 均取真題庫重算比對）
//
// 本檔存在的唯一理由：令 client 組件毋須 import barrel。
// barrel 靜態 import 全部 25 科題庫，任何 'use client' 檔案觸及即會將 2.2MB
// 題目 build 入瀏覽器（2026-09-05 生產站實測）。此處是同一批數字，gzip 12KB。
//
// 只需要數字／課題名稱 → 使用本檔。
// 確實需要題目內容   → 使用 data/questions/load.ts 的逐科 lazy loader。
import type { Topic } from './types'

export interface SubjectSummary {
  /** 全部題目（MC ＋ 書寫題）*/
  total: number
  mc: number
  /** text ＋ long。此兩類永不由機器批改（憲章 §16.A）。 */
  written: number
  topics: number
}

export const SUBJECT_SUMMARY: Record<string, SubjectSummary> = ${JSON.stringify(summary, null, 2)}

/** 課題清單，連同逐課題題數。等同 getSubjectTopics()，但不會拉入題目。 */
export const SUBJECT_TOPICS: Record<string, Topic[]> = ${JSON.stringify(topics, null, 2)}

/** 全站題目總數。 */
export const TOTAL_QUESTIONS = ${total}
`

const dest = join(ROOT, 'data/questions/summary.generated.ts')
writeFileSync(dest, out)
console.log(`✓ data/questions/summary.generated.ts`)
console.log(`  ${active.length} 科 · ${Object.values(summary).reduce((n, v) => n + v.topics, 0)} 個課題 · ${total} 條題目`)
console.log(`  檔案大小 ${(out.length / 1024).toFixed(0)}KB`)
