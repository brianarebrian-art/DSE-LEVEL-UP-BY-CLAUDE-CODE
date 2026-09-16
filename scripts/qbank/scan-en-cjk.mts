// ============================================================================
// scan-en-cjk.mts —— 掃英文欄入面夾住嘅中文（唯讀）
// ----------------------------------------------------------------------------
// 學生揀英文介面，句子中間突然出現中文，佢會以為個站壞咗。charscan 只掃
// scripts/qbank/drafts/ 嘅草稿 JSON，上線題庫（data/questions/*.ts）冇嘢掃。
//
// ⚠️ 三種命中要分開，混埋一齊就會得出一個嚇人而且冇用嘅數字：
//   ① 英文欄同中文欄【逐字一樣】—— 中文／中國文學／中國歷史三科係單語設計
//      （`m(s) = [s, s]`），呢個係刻意嘅，唔係債。實測 18,626 處。
//   ② 中文科入面英文欄夾中文 —— 科目本身考中文（範文原句、文言詞），
//      英文介面照樣要見到原文。實測 122 處，要中文首席確認，唔預設當債。
//   ③ 其餘科目英文欄夾中文 —— 呢個先係要清嘅債。實測 745 處（六科）。
//
// 用法：
//   npx tsx scripts/qbank/scan-en-cjk.mts            逐科總數
//   npx tsx scripts/qbank/scan-en-cjk.mts --detail   逐欄位＋例子
//   npx tsx scripts/qbank/scan-en-cjk.mts --snippets 逐個中文片段分類
//
// 唯讀：唔會寫任何檔案。
// ============================================================================
import { subjects } from '../../data/subjects'
import { getSubjectQuestions } from '../../data/questions'

const CJK = /[一-鿿]/
const CJK_RUN = /[一-鿿、。，；：！？「」『』（）]+/g
const DETAIL = process.argv.includes('--detail')
const SNIPPETS = process.argv.includes('--snippets')

type Hit = { subject: string; id: string; field: string; value: string; identical: boolean }

const hits: Hit[] = []
for (const s of subjects) {
  for (const q of getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]) {
    for (const [key, raw] of Object.entries(q)) {
      if (!key.endsWith('En')) continue
      const values = Array.isArray(raw) ? raw : [raw]
      const zhRaw = q[key.slice(0, -2)]
      values.forEach((value, i) => {
        if (typeof value !== 'string' || !CJK.test(value)) return
        const zh = Array.isArray(zhRaw) ? zhRaw[i] : zhRaw
        hits.push({
          subject: s.id,
          id: String(q.id),
          field: key,
          value,
          identical: typeof zh === 'string' && zh === value,
        })
      })
    }
  }
}

/** 科目本身考中文 —— 英文介面照樣要見到原文，所以唔預設當債。 */
const CHINESE_SUBJECTS = new Set(['chinese', 'chinese-literature', 'chinese-history'])

const mixed = hits.filter((h) => !h.identical)
const debt = mixed.filter((h) => !CHINESE_SUBJECTS.has(h.subject))
const inChineseSubjects = mixed.filter((h) => CHINESE_SUBJECTS.has(h.subject))
const monolingual = hits.length - mixed.length

const bySubject = new Map<string, { debt: number; ids: Set<string>; mono: number }>()
for (const h of hits) {
  const e = bySubject.get(h.subject) ?? { debt: 0, ids: new Set<string>(), mono: 0 }
  if (h.identical) e.mono++
  else { e.debt++; e.ids.add(h.id) }
  bySubject.set(h.subject, e)
}

console.log('\n英文欄夾住中文（唯讀掃描）\n' + '─'.repeat(64))
for (const [sid, e] of [...bySubject].sort((a, b) => b[1].debt - a[1].debt)) {
  if (!e.debt && !e.mono) continue
  const notes: string[] = []
  if (CHINESE_SUBJECTS.has(sid)) notes.push('科目本身考中文 —— 要中文首席確認')
  if (e.mono) notes.push(`另有 ${e.mono} 處同中文逐字一樣＝單語設計`)
  console.log(
    `${sid.padEnd(20)} ${String(e.debt).padStart(4)} 處 / ${String(e.ids.size).padStart(4)} 題` +
      (notes.length ? `  （${notes.join('；')}）` : ''),
  )
}

if (DETAIL) {
  const byField = new Map<string, Hit[]>()
  for (const h of debt) {
    const k = `${h.subject}·${h.field}`
    byField.set(k, [...(byField.get(k) ?? []), h])
  }
  console.log('\n逐欄位\n' + '─'.repeat(64))
  for (const [k, list] of [...byField].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`${k.padEnd(36)} ${String(list.length).padStart(4)} 處 / ${new Set(list.map((h) => h.id)).size} 題`)
    for (const h of list.slice(0, 2)) console.log(`      ${h.id}: ${h.value.replace(/\s+/g, ' ').slice(0, 64)}`)
  }
}

if (SNIPPETS) {
  const snips = new Map<string, { n: number; sample: string }>()
  for (const h of debt) {
    for (const run of h.value.match(CJK_RUN) ?? []) {
      const key = run.slice(0, 12)
      const e = snips.get(key) ?? { n: 0, sample: '' }
      e.n++
      if (!e.sample) {
        const idx = h.value.indexOf(run)
        e.sample = h.value.slice(Math.max(0, idx - 24), idx + run.length + 16).replace(/\s+/g, ' ')
      }
      snips.set(key, e)
    }
  }
  console.log(`\n中文片段分類（${snips.size} 種）\n` + '─'.repeat(64))
  for (const [k, e] of [...snips].sort((a, b) => b[1].n - a[1].n).slice(0, 20)) {
    console.log(`${String(e.n).padStart(4)}× ${k.padEnd(13)} …${e.sample}…`)
  }
}

console.log('\n' + '─'.repeat(64))
console.log(`要清嘅債：${debt.length} 處 / ${new Set(debt.map((h) => h.id)).size} 題（中文科以外）`)
console.log(`中文科內：${inChineseSubjects.length} 處 / ${new Set(inChineseSubjects.map((h) => h.id)).size} 題 —— 要中文首席確認`)
console.log(`單語設計：${monolingual} 處 —— 唔係債，唔好順手「修」`)
console.log('唯讀 —— 冇改任何檔案。清單同簽名欄見 docs/content-debt-2026-09-16.md\n')
