// ============================================================================
// review-scope-difficulty.mts —— 新題入審批之前嘅「範圍 × 難度」覆核
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/review-scope-difficulty.mts <draft.json> <subjectId>
//
// Yuna 2026-08-21 指令：「每一次補之前寫嗰條題目同答案嘅時候，必須要經過覆核，
// 睇吓係唔係符合 DSE 考核嘅範圍同埋難度。」
// 呢個閘把嗰句話變成可重跑嘅檢查，唔靠邊個講「我覆核過」。
//
// ⚠️ 本閘【唔會、亦唔可以】判斷答案學術上啱唔啱 —— 嗰樣永遠係真人嘅事。
//    佢只檢查【可客觀量度】嘅六項：
//      1 課題喺唔喺該科已登記嘅課程範圍
//      2 有冇觸及該科明確超綱嘅概念
//      3 難度標籤同題目結構夾唔夾（basic 唔應該有多步推論／比較指令）
//      4 選項質素：四項互異、長度唔可以一面倒（最長嗰項通常就係答案）
//      5 解析唔可以引選項字母（選項會洗牌，A/B/C/D 冇意義）
//      6 雙語題庫嘅新題必須帶英文欄
// ============================================================================
import { readFileSync } from 'node:fs'
import { getSubjectTopics } from '../../data/questions/index.ts'
import { getPaperFormat } from '../../data/dse-paper-formats.ts'

const [FILE, SUBJECT] = process.argv.slice(2)
if (!FILE || !SUBJECT) {
  console.error('usage: npx tsx scripts/qbank/review-scope-difficulty.mts <draft.json> <subjectId>')
  process.exit(2)
}

/** 逐科明確超綱嘅概念 —— 只列有把握嘅，寧缺勿濫（誤報多咗個閘就會被人繞過）。 */
const OUT_OF_SCOPE: Record<string, { re: RegExp; why: string }[]> = {
  economics: [
    { re: /收入彈性|交叉彈性|點彈性|income elasticity|cross elasticity|point elasticity/i, why: '教育局課程指引未列入' },
    { re: /無異曲線|indifference curve|等產量線|isoquant/i, why: '屬大學課程' },
  ],
  math: [
    { re: /泰勒|Taylor series|偏微分|partial derivative|特徵值|eigenvalue/i, why: '屬大學課程' },
    { re: /洛必達|L.?Hôpital|L.?Hopital/i, why: '不在必修部分亦不在 M1／M2 課程' },
  ],
  m1: [{ re: /偏微分|partial derivative|多元積分|multiple integral/i, why: '超出 M1 課程' }],
  m2: [{ re: /偏微分|partial derivative|拉普拉斯|Laplace transform/i, why: '超出 M2 課程' }],
  chemistry: [{ re: /量子數|quantum number|分子軌域|molecular orbital/i, why: '屬大學課程' }],
  physics: [{ re: /薛定諤|Schr.?dinger|廣義相對論|general relativity/i, why: '屬大學課程' }],
  biology: [{ re: /聚合酶連鎖反應詳細循環|PCR cycle temperatures/i, why: '深度超出課程要求' }],
}

/** basic（容易）題唔應該出現嘅指令 —— 呢啲字眼本身就代表多步推論。 */
const NOT_BASIC = [
  { re: /比較.{0,6}(異同|分別)|compare and contrast/i, why: '比較題屬中等以上' },
  { re: /在多大程度上|to what extent/i, why: '程度判斷屬進階' },
  { re: /先.{0,10}再.{0,10}然後|first.{0,20}then.{0,20}finally/i, why: '多步程序屬中等以上' },
  { re: /評價|評估|assess |evaluate /i, why: '評鑑屬進階' },
]

interface Row {
  id: string; type?: string; topicId?: string; topic?: string; difficulty: string
  question: string; questionEn?: string
  options?: string[]; optionsEn?: string[]; correctIndex?: number
  explanation: string; explanationEn?: string
}

const rows: Row[] = JSON.parse(readFileSync(FILE, 'utf8'))
const registered = new Set((getSubjectTopics(SUBJECT) as { id: string }[]).map((t) => t.id))
const fmt = getPaperFormat(SUBJECT)
/** 語言科慣例：英文欄重複同一串（`m(s)=[s,s]`），故唔要求英文欄同中文唔同。 */
const LANGUAGE_SUBJECTS = new Set(['chinese', 'english', 'chinese-literature', 'english-literature'])

const problems: { id: string; kind: string; msg: string }[] = []
const flag = (id: string, kind: string, msg: string) => problems.push({ id, kind, msg })

for (const r of rows) {
  const type = r.type ?? 'mc'
  const blob = [r.question, ...(r.options ?? []), r.explanation].join('\n')

  // 1 課題範圍
  if (!r.topicId) flag(r.id, '範圍', '冇 topicId —— promote 之後會用中文標籤 slug，變孤兒課題')
  else if (!registered.has(r.topicId)) flag(r.id, '範圍', `topicId「${r.topicId}」未喺 ${SUBJECT} 登記`)

  // 2 超綱概念
  for (const o of OUT_OF_SCOPE[SUBJECT] ?? []) {
    if (o.re.test(blob)) flag(r.id, '超綱', `觸及 ${o.re.source.split('|')[0]} —— ${o.why}`)
  }

  // 3 難度標籤同結構
  if (r.difficulty === 'basic') {
    for (const n of NOT_BASIC) if (n.re.test(r.question)) flag(r.id, '難度', `標作 basic 但題幹有「${n.re.source.split('|')[0]}」—— ${n.why}`)
  }

  if (type === 'mc') {
    const opts = r.options ?? []
    // 4 選項質素
    if (new Set(opts.map((o) => o.trim())).size !== opts.length) flag(r.id, '選項', '有重複選項')
    const lens = opts.map((o) => o.length)
    const max = Math.max(...lens), min = Math.min(...lens)
    if (max > 0 && min > 0 && max / min >= 3) {
      const longestIsAnswer = lens.indexOf(max) === r.correctIndex
      flag(r.id, '選項', `最長選項係最短嘅 ${(max / min).toFixed(1)} 倍${longestIsAnswer ? '，而且啱啱就係正解 —— 學生唔使識都揀得中' : ''}`)
    }
    // 5 解析引選項字母
    if (/(?:選項|答案|option|Option)\s*[（(]?\s*[A-D][）)]?(?![a-zA-Z])/.test(r.explanation ?? '')) {
      flag(r.id, '解析', '引用了選項字母 —— 選項運行時會洗牌，A/B/C/D 對學生冇意義')
    }
    // 6 雙語
    if (!LANGUAGE_SUBJECTS.has(SUBJECT)) {
      if (!r.questionEn) flag(r.id, '雙語', '冇 questionEn')
      if (!r.optionsEn || r.optionsEn.length !== opts.length) flag(r.id, '雙語', 'optionsEn 缺失或長度同 options 唔夾')
      if (!r.explanationEn) flag(r.id, '雙語', '冇 explanationEn')
    }
  }
}

// ── 難度分佈 ───────────────────────────────────────────────────────────────
const d: Record<string, number> = { basic: 0, intermediate: 0, hard: 0 }
for (const r of rows) d[r.difficulty] = (d[r.difficulty] ?? 0) + 1

console.log('='.repeat(84))
console.log(`範圍 × 難度覆核：${FILE}　（科目 ${SUBJECT}）`)
console.log('='.repeat(84))
if (fmt) {
  console.log(`真實卷面：${fmt.hasMC ? '有多項選擇題' : '⚠️ 全卷無多項選擇題 —— 本批屬知識檢查，非卷面題型'}`)
  console.log(`　　　　　${fmt.papersZh}`)
}
console.log(`\n題數 ${rows.length}　難度 basic ${d.basic} / intermediate ${d.intermediate} / hard ${d.hard}`)
console.log(`課題覆蓋 ${new Set(rows.map((r) => r.topicId)).size} 個（該科已登記 ${registered.size} 個）`)

if (!problems.length) {
  console.log('\n✅ 六項客觀覆核全部通過。')
  console.log('   ⚠️ 呢個結果【唔代表答案啱】—— 學術正確永遠要真人逐題睇。')
} else {
  console.log(`\n❌ ${problems.length} 項要處理：\n`)
  const byKind = new Map<string, typeof problems>()
  for (const p of problems) { const a = byKind.get(p.kind) ?? []; a.push(p); byKind.set(p.kind, a) }
  for (const [kind, ps] of byKind) {
    console.log(`  【${kind}】${ps.length} 項`)
    for (const p of ps.slice(0, 8)) console.log(`     ${p.id.padEnd(22)} ${p.msg}`)
    if (ps.length > 8) console.log(`     …… 另外 ${ps.length - 8} 項`)
  }
  process.exit(1)
}
