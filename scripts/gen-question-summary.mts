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
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const idx = await import(join(ROOT, 'data/questions/index.ts')) as {
  getSubjectQuestions: (id: string) => ({ type?: string } & Record<string, unknown>)[]
  getSubjectQuestionsRaw: (id: string) => { id: string; topic: string }[]
  getSubjectTopics: (id: string) => Record<string, unknown>[]
}
const { subjects } = await import(join(ROOT, 'data/subjects.ts')) as {
  subjects: { id: string; isActive?: boolean }[]
}

const { contentStatus, withdrawnReason } = await import(join(ROOT, 'data/questions/hidden-topics.ts')) as {
  contentStatus: (subjectId: string, q: { id: string; topic: string }) => 'published' | 'withdrawn' | 'withheld_topic' | 'pending_review'
  withdrawnReason: (subjectId: string, id: string) => string | null
}
const { versionOf } = await import(join(ROOT, 'scripts/qbank/bank-version.mts')) as {
  versionOf: (qs: Record<string, unknown>[]) => string
}

const active = subjects.filter((s) => s.isActive !== false)
const versions: Record<string, string> = {}

const summary: Record<string, { total: number; mc: number; written: number; topics: number }> = {}
const topics: Record<string, unknown[]> = {}

for (const s of active) {
  const qs = idx.getSubjectQuestions(s.id)
  const mc = qs.filter((q) => (q.type ?? 'mc') === 'mc').length
  const ts = idx.getSubjectTopics(s.id)
  summary[s.id] = { total: qs.length, mc, written: qs.length - mc, topics: ts.length }
  versions[s.id] = versionOf(qs)
  // 只帶【呈現同篩選】需要嘅欄位。刻意逐個列出而唔係整個 spread ——
  // Topic 將來加欄位唔應該靜靜哋令呢個檔發脹。
  topics[s.id] = ts.map((t) => ({
    id: t.id, zh: t.zh, en: t.en,
    framework: t.framework, frameworkEn: t.frameworkEn, emoji: t.emoji,
    count: t.count, mcCount: t.mcCount, writtenCount: t.writtenCount,
  }))
}

const total = Object.values(summary).reduce((n, v) => n + v.total, 0)

// One status per authored question (data/questions/hidden-topics.ts contentStatus).
// Every question count shown anywhere on the site comes from here or from TOTAL_QUESTIONS,
// which must equal `published`; the generator refuses to write a file where it does not.
const stats = { totalAuthored: 0, published: 0, withdrawn: 0, withheldTopic: 0, pendingReview: 0 }
for (const s of active) {
  for (const q of idx.getSubjectQuestionsRaw(s.id)) {
    stats.totalAuthored++
    const st = contentStatus(s.id, q)
    if (st === 'published') stats.published++
    else if (st === 'withdrawn') stats.withdrawn++
    else if (st === 'withheld_topic') stats.withheldTopic++
    else stats.pendingReview++
  }
}
if (stats.published + stats.withdrawn + stats.withheldTopic + stats.pendingReview !== stats.totalAuthored) {
  throw new Error(`content stats do not add up: ${JSON.stringify(stats)}`)
}
if (stats.published !== total) {
  throw new Error(`published (${stats.published}) differs from the practice pool (${total})`)
}

// The homepage says how many questions were withdrawn because a fault was found. Questions
// withdrawn as PURE_RECALL (founders' replies 49a–55a) had no fault: each was replaced by an
// applied question, so they are left out of that sentence. /transparency lists them separately.
let withdrawnForFault = 0
for (const s of active) {
  for (const q of idx.getSubjectQuestionsRaw(s.id)) {
    if (contentStatus(s.id, q) === 'withdrawn' && withdrawnReason(s.id, q.id) !== 'PURE_RECALL') withdrawnForFault++
  }
}

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

/** 全站題目總數（學生練習得到的題目，即 CONTENT_STATS.published）。 */
export const TOTAL_QUESTIONS = ${total}

/**
 * 題庫各狀態題數，全站唯一來源。每條已編寫的題目只屬一個狀態，四項相加等於 totalAuthored。
 * 只有 published 會出現在練習中。狀態定義見 data/questions/hidden-topics.ts 的 contentStatus。
 */
export const CONTENT_STATS = ${JSON.stringify(stats, null, 2)} as const

/**
 * 因發現錯誤而收起的題數（首頁使用）。不包括以 PURE_RECALL 收起的題目：那些題目並無錯誤，
 * 已逐條由情境應用題取代（創辦人回覆 49a–55a）。
 */
export const WITHDRAWN_FOR_FAULT = ${withdrawnForFault}
`

const dest = join(ROOT, 'data/questions/summary.generated.ts')
writeFileSync(dest, out)
console.log(`✓ data/questions/summary.generated.ts`)

// Kept in a separate file on purpose: data/questions/load.ts imports it, and
// load.ts is part of the practice page bundle. Importing summary.generated.ts
// there would add its topic lists (about 50KB) to every practice page.
const versionsOut = `// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 每科題庫內容的雜湊，算法見 scripts/qbank/bank-version.mts（與 sync-questions.mts 共用）。
// 瀏覽器只會在雲端版本號與此處一致時使用 Supabase 副本，否則使用隨網站一併建置的題庫。
// 原因：2026-09-25 發現雲端副本停留於 09-05，比 repo 少 1,117 條，而學生一直在做舊版本。

/** 科目 id → 題庫內容版本號（與 Supabase question_bank_versions.version 同一算法）。 */
export const BANK_VERSION: Record<string, string> = ${JSON.stringify(versions, null, 2)}
`
writeFileSync(join(ROOT, 'data/questions/bank-versions.generated.ts'), versionsOut)
console.log(`✓ data/questions/bank-versions.generated.ts`)

// Sitemap dates (founders' reply 61a, 2026-10-09). The date each subject's published bank
// last changed, for <lastmod> on /subjects/<id>. A date moves only when that subject's
// version above changes, so regenerating for another reason does not claim an update.
// The first run (2026-10-09) dated every subject that day: the same commit added a FAQ
// block to every subject page, so all 25 pages did change then.
const DATES_FILE = join(ROOT, 'data/questions/bank-dates.generated.ts')
const todayHK = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date())
let prevDates: Record<string, { version: string; date: string }> = {}
try {
  const m = readFileSync(DATES_FILE, 'utf8').match(/BANK_UPDATED_AT[^=]*= (\{[\s\S]*\})\n/)
  if (m) prevDates = JSON.parse(m[1])
} catch {
  /* first run */
}
const bankDates: Record<string, { version: string; date: string }> = {}
for (const s of active) {
  const prev = prevDates[s.id]
  bankDates[s.id] = prev && prev.version === versions[s.id] ? prev : { version: versions[s.id], date: todayHK }
}
const datesOut = `// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 每科已上線題庫最後一次改動的日期（香港時間），供 sitemap.xml 的 lastmod 使用（創辦人回覆 61a）。
// version 與 bank-versions.generated.ts 相同；只有 version 改變時日期才會更新。

export const BANK_UPDATED_AT: Record<string, { version: string; date: string }> = ${JSON.stringify(bankDates, null, 2)}
`
writeFileSync(DATES_FILE, datesOut)
console.log(`✓ data/questions/bank-dates.generated.ts`)

// Founders' reply 17C (2026-10-04): the practice estimate says, per subject, when
// picking the longest option succeeds more than half the time. Measured on the
// published MC questions with the same visual length as the answer-shape check.
// The date only moves when a figure changes, so regenerating for an unrelated
// reason does not make the page claim a new measurement.
const { longestOptionStats } = (await import(join(ROOT, 'scripts/qbank/_gate.mjs'))) as unknown as {
  longestOptionStats: (qs: unknown[]) => { unique: number; correct: number }
}
const longest: Record<string, { unique: number; correct: number }> = {}
for (const s of active) {
  longest[s.id] = longestOptionStats(idx.getSubjectQuestions(s.id).filter((q) => (q.type ?? 'mc') === 'mc'))
}
const LONGEST_FILE = join(ROOT, 'data/questions/option-length.generated.ts')
let measuredAt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date())
try {
  const prev = readFileSync(LONGEST_FILE, 'utf8')
  const prevDate = prev.match(/OPTION_LENGTH_MEASURED_AT = '([\d-]+)'/)?.[1]
  const prevBody = prev.slice(prev.indexOf('LONGEST_OPTION'))
  if (prevDate && prevBody.includes(JSON.stringify(longest, null, 2))) measuredAt = prevDate
} catch {
  /* first run */
}
const longestOut = `// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 逐科「揀最長選項」的命中情況（創辦人回覆 17C，2026-10-04）。只計已上線的選擇題；
// unique 為四個選項中有唯一最長者的題數，correct 為該最長選項正是答案的題數。
// 隨機揀選的命中率約為四分之一。長度以 scripts/qbank/_gate.mjs 的 visualLength 量度。
// 日期只在數字改變時更新。

export const OPTION_LENGTH_MEASURED_AT = '${measuredAt}'

export const LONGEST_OPTION: Record<string, { unique: number; correct: number }> = ${JSON.stringify(longest, null, 2)}
`
writeFileSync(LONGEST_FILE, longestOut)
console.log(`✓ data/questions/option-length.generated.ts (measured ${measuredAt})`)
console.log(`  ${active.length} 科 · ${Object.values(summary).reduce((n, v) => n + v.topics, 0)} 個課題 · ${total} 條題目`)
console.log(`  檔案大小 ${(out.length / 1024).toFixed(0)}KB`)
