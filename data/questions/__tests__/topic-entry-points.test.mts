// ============================================================================
// topic-entry-points.test.mts —— 有題嘅課題必須有入口
// ----------------------------------------------------------------------------
// 點解要有呢個閘：
//
// 科目頁嘅課題 chips 一路以嚟用 `mcCount > 0` 過濾。個過濾本身係啱嘅 ——
// chips 連去 `/practice?topic=`，而嗰條路只服務客觀題（getQuestionsByTopic
// 只返 MC），一個零 MC 嘅課題撳入去就係一份空白卷。
//
// 但過濾之後，一個【淨係有書寫題】嘅課題就變成完全冇入口：
// 題喺庫入面、`?topic=&mode=long` 亦服務得到，只係科目頁冇一個位撳得入去。
//
// 2026-08-27 實際爆過兩次，而兩次都冇任何測試紅：
//   ① 中文科四個寫作課題入庫 46 條 —— 四個課題各 10 條，科目頁一個都見唔到
//   ② 歷史科三個課題（hk_mod／seasia／postwar_conflicts）早喺 38 條論述題
//      入庫嗰陣已經冇咗入口，一直冇人為意
//
// 呢類故障嘅特徵係【靜】：題庫、loader、build、qa 全部綠，題目亦真係入咗庫，
// 得個學生見唔到。所以要有一條測試由「學生撳唔撳得到」呢個角度去問。
//
// 修法：唔係喺呢度加豁免，而係去 SubjectDetailView 令該課題有一個連去
// 有題嗰條路嘅 chip。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const idx = await import('../index.ts').then((m) => ((m as { default?: unknown }).default ?? m) as {
  getSubjectTopics: (s: string) => { id: string; zh: string; count: number; mcCount?: number; writtenCount?: number }[]
  getWrittenQuestions: (s: string) => { topic: string }[]
  getSubjectQuestions: (s: string) => { topic: string }[]
  getQuestionsByTopic: (s: string, t: string) => unknown[]
})

// 科目清單由 coverage-report 嘅正本讀返出嚟，唔喺呢度另抄一份 ——
// 抄一份就會漂移，新科目上線之後本閘會靜靜咁跳過佢。
const SUBJECT_IDS = (() => {
  const src = readFileSync('scripts/qbank/coverage-report.mts', 'utf8')
  const block = src.match(/const SUBJECTS: \[string, string\]\[\] = \[([\s\S]*?)\n\]/)
  assert.ok(block, 'coverage-report.mts 嘅 SUBJECTS 清單搵唔到 —— 格式改咗就要一齊更新本測試')
  const ids = [...block[1].matchAll(/\['([^']+)',\s*'[^']+'\]/g)].map((m) => m[1])
  assert.ok(ids.length >= 25, `只讀到 ${ids.length} 個科目，預期至少 25 個`)
  return ids
})()

test('每個有題嘅課題都撳得入去（唔可以有題但冇入口）', () => {
  const orphaned: string[] = []
  for (const s of SUBJECT_IDS) {
    for (const t of idx.getSubjectTopics(s)) {
      if (t.count === 0) continue // 真係零題 —— 唔顯示係啱嘅
      const mc = t.mcCount ?? t.count
      const written = t.writtenCount ?? 0
      if (mc === 0 && written === 0) {
        orphaned.push(`${s}/${t.id}（${t.zh}）count=${t.count} 但 MC 同書寫題都係零`)
      }
    }
  }
  assert.deepEqual(orphaned, [], `有題但冇入口嘅課題：\n  ${orphaned.join('\n  ')}`)
})

test('mcCount ＋ writtenCount 等於 count（兩個入口加埋要覆蓋晒）', () => {
  const bad: string[] = []
  for (const s of SUBJECT_IDS) {
    for (const t of idx.getSubjectTopics(s)) {
      const sum = (t.mcCount ?? 0) + (t.writtenCount ?? 0)
      if (sum !== t.count) bad.push(`${s}/${t.id}：mc ${t.mcCount} ＋ 書寫 ${t.writtenCount} ≠ count ${t.count}`)
    }
  }
  assert.deepEqual(bad, [], `分項加唔返總數 —— 有題型漏咗計：\n  ${bad.join('\n  ')}`)
})

test('書寫題入口真係攞到題（連結唔可以指去一份空白卷）', () => {
  const empty: string[] = []
  for (const s of SUBJECT_IDS) {
    const written = idx.getWrittenQuestions(s)
    for (const t of idx.getSubjectTopics(s)) {
      if ((t.writtenCount ?? 0) === 0) continue
      const actual = written.filter((q) => q.topic === t.id).length
      if (actual !== t.writtenCount) {
        empty.push(`${s}/${t.id}：chip 話有 ${t.writtenCount} 條，?mode=long 實際攞到 ${actual} 條`)
      }
    }
  }
  assert.deepEqual(empty, [], `書寫題 chip 同實際攞到嘅題數對唔上：\n  ${empty.join('\n  ')}`)
})

test('MC 入口真係攞到題（連結唔可以指去一份空白卷）', () => {
  const empty: string[] = []
  for (const s of SUBJECT_IDS) {
    for (const t of idx.getSubjectTopics(s)) {
      if ((t.mcCount ?? 0) === 0) continue
      const actual = idx.getQuestionsByTopic(s, t.id).length
      if (actual === 0) empty.push(`${s}/${t.id}：chip 話有 ${t.mcCount} 條 MC，?topic= 實際攞到 0 條`)
    }
  }
  assert.deepEqual(empty, [], `MC chip 指去空白卷：\n  ${empty.join('\n  ')}`)
})

// ── 防「過濾條件靜靜收窄返」回歸 ────────────────────────────────────────────
test('科目頁嘅課題過濾要同時睇 mcCount 同 writtenCount', () => {
  // 上面四條 test 全部係問題庫，唔會察覺得到有人喺 UI 嗰邊將過濾改返
  // `mcCount > 0` —— 嗰下題庫照樣綠，而學生照樣撳唔到。所以呢度直接睇原始碼。
  //
  // ⚠️ 要錨定【課題 chip 嗰兩行】，唔可以淨係喺成個檔搵 `writtenCount`／`mode=long`。
  // 呢個檔另有一個【全科書寫題】入口（`?subject=X&mode=long`）同埋
  // `coveredTopics` 都會出現同樣字眼 —— 用鬆散比對嘅話，就算課題 chip 嗰邊
  // 完全改返只睇 MC，本測試都會照綠。實測過：鬆散版捉唔到，故收窄至下面兩條。
  const src = readFileSync('app/subjects/[subject]/SubjectDetailView.tsx', 'utf8')

  const chipFilter = src.match(/\{topics\.filter\(([^\n]*)\)\.map\(\(topic\)/)
  assert.ok(chipFilter, '搵唔到課題 chip 嗰句 `topics.filter(...).map((topic)` —— 結構改咗就要一齊更新本測試')
  assert.match(
    chipFilter[1], /writtenCount/,
    '課題 chip 嘅過濾冇再睇 writtenCount —— 淨係有書寫題嘅課題會再一次冇入口。'
    + `\n  實際過濾條件：${chipFilter[1]}`,
  )

  const chipHref = src.match(/href=\{`\/practice\?subject=\$\{meta\.id\}&topic=([^\n]*)`\}/)
  assert.ok(chipHref, '搵唔到課題 chip 嘅 href —— 結構改咗就要一齊更新本測試')
  assert.match(
    chipHref[1], /mode=long/,
    '課題 chip 嘅連結唔會再帶 &mode=long —— 書寫題課題嘅 chip 會指返去 MC 卷（空白）。'
    + `\n  實際 href 尾段：${chipHref[1]}`,
  )
})

test('課題題數必須包含機器入庫嗰批（autoBanks）', () => {
  // 2026-08-28 之前 getSubjectTopics() 只數 `banks`，唔數 `autoBanks`，
  // 於是 15 科共 101 個課題向學生少報題數（物理 electricity 顯示 133、實際 213）。
  // 呢個數字係用戶可見內容，顯示一個同題庫唔符嘅數等於向學生講錯嘢；
  // 同時亦令覆蓋率報告（用 getSubjectQuestions）同介面永遠對唔上，
  // 補題時會照住一張錯嘅「最薄課題」清單做 —— 實際發生過：
  // 中文科介面顯示缺 27 條，真實缺口係 23 條。
  const bad: string[] = []
  for (const s of SUBJECT_IDS) {
    const real = new Map<string, number>()
    for (const q of idx.getSubjectQuestions(s)) real.set(q.topic, (real.get(q.topic) ?? 0) + 1)
    for (const t of idx.getSubjectTopics(s)) {
      const r = real.get(t.id) ?? 0
      if (r !== t.count) bad.push(`${s}/${t.id}：顯示 ${t.count} · 實際 ${r}`)
    }
  }
  assert.deepEqual(bad, [], `課題題數同真實題庫對唔上：\n  ${bad.slice(0, 12).join('\n  ')}`)
})
