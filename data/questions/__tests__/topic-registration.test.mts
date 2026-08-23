// ============================================================================
// topic-registration.test.mts —— 每一條題目嘅 topic 必須係已註冊課題
// ----------------------------------------------------------------------------
// 科目頁嘅課題 chip 只列【已註冊】課題，連去 /practice?subject=X&topic=<id>；
// PracticeSession 嘅 buildPool 以 `q.topic === topicFilter` 篩選。所以一條
// topic id 未註冊嘅題目，喺任何課題入口都篩唔到 —— 佢入咗庫，但學生搵唔到。
//
// ══ 病源有兩個，唔係一個 ══
//
// 一、草稿嘅 `topic` 欄一直係【人類可讀標籤】（例如「需求變動 vs 需求量變動」）。
//    冇填 `topicId` 嘅話，promote 時 slug() 會原樣帶入，變成一個中文 id。
//    2026-08-23 實測 61 條中招（economics 20／bafs 6／math 23／chinese 12）。
//
// 二、code-generated bank 嘅 T map 自己開咗一個同註冊表唔同嘅 id。
//    chemistry-bank.ts 寫 'mole_concept'，但 chemistry.ts 註冊嘅係 'mole'
//    —— 29 條題目就咁掛咗喺一個唔存在嘅課題上。
//
// ⚠️ 判準係【有冇註冊】，唔係【有冇中文】。英文科 6 條（Idiom_in_context 等）
//    同屬呢個病，但標籤本身係英文，掃中文字元完全捉唔到。呢個測試掃嘅係
//    註冊表，所以兩種都捉到。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getSubjectQuestions, getSubjectTopics } = await import('../index.ts')
const { getActiveSubjects } = await import('../../subjects.ts')

/**
 * 已知仍然未修嘅孤兒課題，逐個附理由。
 *
 * 呢個唔係「豁免清單」而係「未還嘅債」—— 每一條都有人負責，修完就要喺此
 * 刪走（測試會因為「少咗一個預期孤兒」而紅，逼人更新，唔會靜靜過關）。
 */
const KNOWN_ORPHANS: Record<string, number> = {
  // 2026-08-23：全部接返曬。
  //
  // · math 嘅「有效數字」「數系判別」—— 創辦人拍板為數學科新增
  //   approximation（近似與誤差）同 number_systems（數系）兩個課題。
  // · m1 嘅 binomial_theorem —— m1-bank.ts 個 T map 自行開咗個同註冊表唔同
  //   嘅 id（m1.ts 註冊嘅係 'binomial'）。同 chemistry-bank.ts 嘅
  //   'mole_concept' 屬同一個病。
  //
  // 呢個表而家係空嘅。任何一條新孤兒都會令測試紅 —— 呢個就係佢嘅用途。
}

test('每一條題目嘅 topic 都要係該科已註冊嘅課題 id', () => {
  const found: Record<string, number> = {}
  for (const s of getActiveSubjects()) {
    const registered = new Set(getSubjectTopics(s.id).map((t) => t.id))
    for (const q of getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]) {
      const topic = String(q.topic)
      if (registered.has(topic)) continue
      const key = `${s.id} / ${topic}`
      found[key] = (found[key] ?? 0) + 1
    }
  }
  assert.deepEqual(
    found,
    KNOWN_ORPHANS,
    '孤兒課題清單同預期唔一致。\n' +
      '  · 多咗 → 有新題目掛咗喺未註冊嘅 topic id 上，學生喺課題入口篩唔到佢。\n' +
      '    草稿要填 `topicId`（已註冊 id），`topic` 留返做人類可讀標籤。\n' +
      '  · 少咗 → 有孤兒已經修好，請喺 KNOWN_ORPHANS 刪走嗰一行。\n' +
      `  實際：${JSON.stringify(found, null, 2)}`,
  )
})

test('修正表只准指向已註冊課題 —— 唔准經呢條路新增課題', async () => {
  const { readFileSync } = await import('node:fs')
  const doc = JSON.parse(
    readFileSync(new URL('../../../scripts/qbank/topic-id-fixes.json', import.meta.url), 'utf8'),
  ) as { fixes: { subject: string; rows: { id: string; topicId: string }[] }[] }
  const bad: string[] = []
  for (const batch of doc.fixes) {
    const registered = new Set(getSubjectTopics(batch.subject).map((t) => t.id))
    for (const r of batch.rows) {
      if (!registered.has(r.topicId)) bad.push(`${batch.subject}/${r.id} → ${r.topicId}`)
    }
  }
  assert.deepEqual(bad, [], `修正表指向未註冊課題：\n  ${bad.join('\n  ')}`)
})

test('修正表列出嘅題目，實際 topic 已經係表上嗰個 id', async () => {
  const { readFileSync } = await import('node:fs')
  const doc = JSON.parse(
    readFileSync(new URL('../../../scripts/qbank/topic-id-fixes.json', import.meta.url), 'utf8'),
  ) as { fixes: { subject: string; rows: { id: string; topicId: string; topicEn?: string }[] }[] }
  const bad: string[] = []
  for (const batch of doc.fixes) {
    const byId = new Map(
      (getSubjectQuestions(batch.subject) as unknown as Record<string, unknown>[]).map((q) => [String(q.id), q]),
    )
    for (const r of batch.rows) {
      const q = byId.get(r.id)
      if (!q) { bad.push(`${batch.subject}/${r.id} 喺 live 題庫搵唔到`); continue }
      if (q.topic !== r.topicId) bad.push(`${batch.subject}/${r.id} topic 係 ${String(q.topic)}，應為 ${r.topicId}`)
      if (r.topicEn && q.topicEn !== r.topicEn) bad.push(`${batch.subject}/${r.id} topicEn 未套用`)
    }
  }
  assert.deepEqual(bad, [], `修正表同 live 題庫對唔上（apply-topic-ids.mts 未跑？）：\n  ${bad.join('\n  ')}`)
})

// ── 憲章：全站雙語 ────────────────────────────────────────────────────────
//
// 2026-08-23：中文科、中國歷史、中國文學三科嘅課題註冊表，英文欄一直填住
// 中文原文（例如 argument_essay 嘅 en 係「論說文・思辨立意」），於是英文介面
// 嘅課題 chip 全部顯示中文。決策依據（創辦人 2026-08-23）：非華語（NCS）考生
// 一樣要應考中國語文，導覽層讀唔明等於成個課題入口用唔到。
//
// ⚠️ 只譯【導覽層】。題目正文、選項、解析一律維持中文 —— 中國語文科考嘅就係
//    中文本身，把試題譯成英文會令呢一科失去意義。呢條測試只掃註冊表。
test('每一科嘅課題註冊表都要有真正嘅英文名，唔可以填返中文', () => {
  const CJK = /[一-鿿]/
  const bad: string[] = []
  for (const s of getActiveSubjects()) {
    for (const t of getSubjectTopics(s.id)) {
      if (CJK.test(String(t.en ?? ''))) bad.push(`${s.id}/${t.id} en=「${t.en}」`)
      if (CJK.test(String(t.frameworkEn ?? ''))) bad.push(`${s.id}/${t.id} frameworkEn=「${t.frameworkEn}」`)
    }
  }
  assert.deepEqual(bad, [], `${bad.length} 個課題／框架嘅英文欄仍然係中文：\n  ${bad.slice(0, 12).join('\n  ')}`)
})

// 註冊表啱唔代表畫面啱：逐題嘅 `topicEn` 係獨立欄位，練習頁嘅課題 chip 讀嘅
// 係佢，唔係註冊表。2026-08-23 實測：中文科 40 條機器閘題目嘅 topicEn 由草稿
// 帶住中文入庫（「範文名句」「錯別字」…），註冊表補完英文之後畫面依然出中文。
// 所以呢一條要分開驗。
test('每一條題目嘅 topicEn 都要有，而且唔可以係中文', () => {
  const CJK = /[一-鿿]/
  const bad: string[] = []
  for (const s of getActiveSubjects()) {
    for (const q of getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]) {
      const en = q.topicEn
      if (typeof en !== 'string' || !en.trim()) { bad.push(`${s.id}/${String(q.id)} 冇 topicEn`); continue }
      if (CJK.test(en)) bad.push(`${s.id}/${String(q.id)} topicEn=「${en}」`)
    }
  }
  assert.deepEqual(bad, [], `${bad.length} 條題目嘅課題標籤喺英文介面出唔到英文：\n  ${bad.slice(0, 12).join('\n  ')}`)
})

test('中文科嘅題目正文維持中文 —— 只譯導覽層，唔譯試題', () => {
  const CJK = /[一-鿿]/
  const zh = getSubjectQuestions('chinese') as unknown as Record<string, unknown>[]
  const translated = zh.filter((q) => typeof q.contentEn === 'string' && !CJK.test(q.contentEn as string))
  assert.equal(
    translated.length, 0,
    `${translated.length} 條中國語文科試題被譯成純英文 —— 呢一科考嘅就係中文本身，譯咗就冇意思。`,
  )
})
