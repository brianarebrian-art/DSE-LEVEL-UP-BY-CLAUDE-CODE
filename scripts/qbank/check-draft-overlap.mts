// ============================================================================
// check-draft-overlap.mts —— 新草稿對現有題庫嘅重複度檢查
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/check-draft-overlap.mts <draft.json> <subjectId>
//
// 點解要有呢個閘：本平台最大嘅質素問題係【模板複本】—— 同一條題目換個數字、
// 換個問法就當新題。補底題尤其容易撞板，因為容易題往往就係既有中等題嘅
// 「定義版」，寫落去自己都唔覺重複。
//
// 2026-08-21 實測：呢個閘捉到 hist_floor_15（「緩和 détente 指哪一種狀態」）
// 同題庫既有一條概念、正解及干擾項結構完全重複，已換走。
//
// ⚠️ 本閘只量度【字面重疊】，唔識判斷「概念上係咪同一條題」。
//    過閘唔代表冇重複，只代表冇明顯字面重複 —— 真人審批時仍要自己睇。
//
// 2026-08-21 第二次修訂：只比題幹【唔夠】。實測中國文學補底批之中，人手睇出
// 五對重複（杜甫詩史、李白風格、用典、對比、白描），第一版個閘只捉到一對 ——
// 因為考同一樣嘢嘅兩條題，題幹措辭可以完全唔同（「X 的作用是？」對
// 「X 在作品中的主要作用是甚麼？」），但【正解】幾乎一定撞。
// 故此改為同時比題幹與正解，取兩者之中較高者作判斷。
//
// 判斷方式：題幹與正解分別分詞計 Jaccard 相似度，取較高者。
//   ≥ FAIL  以非零碼結束，必須處理
//   ≥ WARN  只列出嚟畀人手判斷（例如同一課題嘅上下級難度題，屬合理）
// ============================================================================
import { readFileSync } from 'node:fs'
import { loadSubjectQuestions } from '../../data/questions/load.ts'

const [FILE, SUBJECT] = process.argv.slice(2)
if (!FILE || !SUBJECT) {
  console.error('usage: npx tsx scripts/qbank/check-draft-overlap.mts <draft.json> <subjectId>')
  process.exit(2)
}

const FAIL = 0.45
const WARN = 0.30

interface Row { id: string; question: string; options?: string[]; correctIndex?: number }
const rows: Row[] = JSON.parse(readFileSync(FILE, 'utf8'))
const existing = (await loadSubjectQuestions(SUBJECT)) as {
  content: string; options?: string[]; correctIndex?: number
}[]

/** 該題嘅正解文字；非 MC 或資料不全就回空串（空串永遠唔會 match）。 */
const answerOf = (q: { options?: string[]; correctIndex?: number }) =>
  Array.isArray(q.options) && typeof q.correctIndex === 'number' ? (q.options[q.correctIndex] ?? '') : ''

/** 中文冇空格，故逐字切；英文則按詞切並丟走短虛詞。 */
const tokens = (s: string): Set<string> => {
  const out = new Set<string>()
  const zh = s.match(/[一-鿿]/g) ?? []
  for (let i = 0; i < zh.length - 1; i++) out.add(zh[i] + zh[i + 1]) // 二元字組
  for (const w of s.toLowerCase().match(/[a-z]{4,}/g) ?? []) out.add(w)
  return out
}

/**
 * 正解往往極短（「維生素」對「維生素 D」），短字串嘅 Jaccard 極度不穩定 ——
 * 實測 tl_floor_01 就因此報 100% 假警。故兩邊都要夠長先計。
 */
const MIN_TOKENS = 5

const jaccard = (a: Set<string>, b: Set<string>) => {
  if (a.size < MIN_TOKENS || b.size < MIN_TOKENS) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter)
}

const existingToks = existing.map((e) => ({
  text: e.content, toks: tokens(e.content),
  ans: answerOf(e), ansToks: tokens(answerOf(e)),
}))
const hits: { id: string; score: number; via: string; nu: string; old: string }[] = []
let worst = 0

for (const r of rows) {
  const q = tokens(r.question)
  const rAns = answerOf(r)
  const a = tokens(rAns)
  for (const e of existingToks) {
    const jq = jaccard(q, e.toks)
    const ja = jaccard(a, e.ansToks)
    const j = Math.max(jq, ja)
    if (j > worst) worst = j
    if (j >= WARN) {
      const viaAns = ja >= jq
      hits.push({
        id: r.id, score: j, via: viaAns ? '正解' : '題幹',
        nu: viaAns ? rAns : r.question, old: viaAns ? e.ans : e.text,
      })
    }
  }
}
hits.sort((x, y) => y.score - x.score)

const one = (s: string) => s.replace(/\s+/g, ' ').slice(0, 92)
console.log('='.repeat(84))
console.log(`重複度檢查：${FILE}　（科目 ${SUBJECT}，對比題庫 ${existing.length} 條）`)
console.log('='.repeat(84))
console.log(`草稿 ${rows.length} 條　最高相似度 ${(worst * 100).toFixed(0)}%　（警示 ${WARN * 100}%／不通過 ${FAIL * 100}%）\n`)

const fails = hits.filter((h) => h.score >= FAIL)
for (const h of hits) {
  console.log(`  ${h.score >= FAIL ? '❌' : '⚠️ '} ${(h.score * 100).toFixed(0)}%  ${h.id}　（撞喺${h.via}）`)
  console.log(`       新：${one(h.nu)}`)
  console.log(`       舊：${one(h.old)}`)
}
if (!hits.length) console.log('  冇任何一對達到警示線。')

// ── 第二個訊號：引號術語撞擊 ──────────────────────────────────────────────
// 2026-08-21：Jaccard 有個死角 —— 考同一個術語但措辭完全改寫嘅兩條題（例如
// 「集體安全」的基本構想 對 「集體安全」的理念是），字面重疊低到唔會報警，
// 但實質係同一條題。人手覆核揪出四對之後加入呢個訊號。
//
// ⚠️ 撞術語【唔一定】係重複：「X 的定義」對「X 的批評」正正就係補底題應有嘅
//    上下級關係。故此呢一節只列出嚟畀人判斷，唔會令個閘唔通過。
const termsIn = (t: string) => (t.match(/[「『]([^」』]{2,12})[」』]/g) ?? []).map((x) => x.slice(1, -1))
const termHits: string[] = []
for (const r of rows) {
  for (const t of new Set(termsIn(r.question))) {
    for (const e of existing) {
      if (e.content.includes(`「${t}」`)) {
        termHits.push(`  · ${r.id}　同題庫共用術語「${t}」\n      新：${one(r.question)}\n      舊：${one(e.content)}`)
        break
      }
    }
  }
}
if (termHits.length) {
  console.log(`\n【引號術語撞擊】${termHits.length} 項 —— 唔一定係重複，但要人手確認唔係同一條題：`)
  for (const h of termHits) console.log(h)
}

if (fails.length) {
  console.log(`\n❌ ${fails.length} 對達到不通過線 —— 呢啲題目要換走或重寫。`)
  process.exit(1)
}
console.log('\n✅ 冇明顯字面重複。')
console.log('   ⚠️ 字面唔重複【唔等於】概念唔重複 —— 真人審批時仍要自己睇。')
