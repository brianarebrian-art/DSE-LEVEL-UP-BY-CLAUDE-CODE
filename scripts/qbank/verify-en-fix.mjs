#!/usr/bin/env node
// ============================================================================
// verify-en-fix.mjs —— 核對「英文欄修正提案」同原草稿
// ----------------------------------------------------------------------------
// 提案：docs/qbank-en-fix-math-p1-long.json（id → 四個 En 欄嘅新內容）
// 原稿：scripts/qbank/drafts/math-p1-long.json
//
// 點解要有：提案改嘅係【已經由真人逐題簽名批過】嘅內容（brian 2026-08-27），
// 而審批人唔會逐條數式對一次。四項檢查入面，③ 最緊要 ——
// 譯文改動數式係最貴嘅錯：學生會照住一條錯公式做，而文字睇落完全正常，
// 冇任何現有閘會嗌。
//
// 用法：node scripts/qbank/verify-en-fix.mjs
//       簽署之後套用提案，再跑一次確認冇改壞。
// ============================================================================

import { readFileSync } from 'node:fs'

const DRAFT = 'scripts/qbank/drafts/math-p1-long.json'
const PROPOSAL = 'docs/qbank-en-fix-math-p1-long.json'
const rows = JSON.parse(readFileSync(DRAFT, 'utf8'))
const EN = JSON.parse(readFileSync(PROPOSAL, 'utf8'))
const FIELDS = [
  ['question', 'questionEn'],
  ['referenceAnswer', 'referenceAnswerEn'],
  ['markingScheme', 'markingSchemeEn'],
  ['explanation', 'explanationEn'],
]

// ── 已逐項查核、屬正當翻譯差異嘅數式 ──────────────────────────────────
// 每一條都人手睇過，確認【唔係公式改錯】。任何唔喺呢張表嘅差異照樣 fail，
// 所以呢個檢查唔會因為「差異太多」而失去效力。
const ALLOWED = {
  // 中文用「八折」呢個成語（唔喺數式內），英文冇對應講法，只可以寫
  // "a $20\\%$ discount"。數值一致，只係中文嗰邊根本冇呢條數式。
  'math_p1_04.questionEn': [String.raw`$20\%$`],
  'math_p1_04.explanationEn': [String.raw`$20\%$`],
  // 中文寫「第 $20$ 項」「首 $20$ 項」（數字入數式），英文慣例寫
  // "the 20th term" / "first 20 terms"（純文字）。DSE 英文卷亦係咁排版。
  'math_p1_10.questionEn': [String.raw`$20$`],
  'math_p1_18.questionEn': [String.raw`$8$`],
  // 2026-08-27 嗰段校訂註，中文原稿用純文字「∠TCA = 124°」同「56°」，
  // 英文統一改用 LaTeX。屬排版收緊，數值不變。
  'math_p1_11.explanationEn': [String.raw`$56^{\circ}$`, String.raw`$\angleTCA=124^{\circ}$`],
  // 中文「$AB$ 的斜率 $=\dfrac{…}$」拆成兩條數式；英文
  // "Slope of $AB=\dfrac{…}$" 併成一條。內容相同。
  'math_p1_15.markingSchemeEn': [String.raw`$AB$`, String.raw`$\dfrac{6-2}{5-(-1)}=\dfrac{4}{6}=\dfrac{2}{3}$`, String.raw`$AB=\dfrac{6-2}{5-(-1)}=\dfrac{4}{6}=\dfrac{2}{3}$`],
  // 中文「取對數」用 $\log$ 入數式，英文用 "logarithms" 散文表達。
  'math_p1_18.explanationEn': [String.raw`$\log$`],
}

const CJK = /[一-鿿]/
const errs = []
let accounted = 0

// ① 覆蓋率
const missing = rows.map((r) => r.id).filter((id) => !EN[id])
if (missing.length) errs.push(`未譯：${missing.join(' ')}`)
const extra = Object.keys(EN).filter((id) => !rows.some((r) => r.id === id))
if (extra.length) errs.push(`多咗唔存在嘅 id：${extra.join(' ')}`)

// ② 英文欄唔可以再有中文
for (const [id, f] of Object.entries(EN)) {
  for (const [k, v] of Object.entries(f)) {
    if (CJK.test(v)) errs.push(`${id}.${k} 仍然有中文：${v.match(/[一-鿿]+/)[0]}`)
  }
}

// ③ LaTeX 逐條核對
// ⚠️ 唔可以用 /\$[^$]*\$/ —— 題目入面有 $\$300$ 呢種【數式內嘅銀碼】，
//    個 \$ 會被當成數式邊界，切出 $。標價$ 一類垃圾 span。
//    要逐字掃，遇到 backslash 就跳過下一個字元。
const latex = (str) => {
  const out = []
  let i = 0
  while (i < str.length) {
    if (str[i] === '\\') { i += 2; continue }
    if (str[i] !== '$') { i++; continue }
    let j = i + 1
    while (j < str.length) {
      if (str[j] === '\\') { j += 2; continue }
      if (str[j] === '$') break
      j++
    }
    if (j >= str.length) break
    out.push(str.slice(i, j + 1).replace(/\s+/g, ''))
    i = j + 1
  }
  return out
}
for (const r of rows) {
  const en = EN[r.id]; if (!en) continue
  for (const [zh, enk] of FIELDS) {
    // 再正規化兩樣，先分得出【真・公式改錯】同【正當翻譯差異】：
    //   · \text{…} 入面係散文，必須譯（$P(\text{兩紅})$ → $P(\text{both red})$），
    //     所以比對前把內容抹走，只留 \text{} 個殼。
    //   · 中英兩邊嘅 `=` 有時一個喺數式內、一個喺數式外
    //     （中「眾數 $=47$」vs 英「mode is $47$」），剝走頭尾嘅 = 再比。
    const norm = (x) => x.replace(/\\text\{[^}]*\}/g, '\\text{}').replace(/^\$=/, '$')
    // 用【多重集】比對而唔係逐位比對：英文語序同中文唔同
    //（「以 S、r 及 n 表示 a」vs「Express a in terms of S, r and n」），
    // 位置必然錯開，但集合應該一樣。
    const a = latex(r[zh]).map(norm).sort(), b = latex(en[enk]).map(norm).sort()
    const onlyZh = a.filter((x) => { const i = b.indexOf(x); if (i >= 0) { b.splice(i, 1); return false } return true })
    const key = `${r.id}.${enk}`
    const ok = ALLOWED[key] ?? []
    const unexplained = [...onlyZh, ...b].filter((x) => !ok.includes(x))
    if (unexplained.length) errs.push(`${key} 未解釋嘅數式差異：${unexplained.join(' , ')}`)
    accounted += onlyZh.length + b.length
  }
}

// ④ 評分準則嘅分數總和要等於題目總分
for (const r of rows) {
  const en = EN[r.id]; if (!en) continue
  const sum = [...en.markingSchemeEn.matchAll(/…… (\d+) marks?/g)].reduce((a, m) => a + Number(m[1]), 0)
  if (sum !== r.marks) errs.push(`${r.id} 評分準則分數總和 ${sum} ≠ 題目 ${r.marks} 分`)
}

if (errs.length) {
  console.error(`\n✗ ${errs.length} 項問題：\n`)
  for (const e of errs) console.error('   ' + e)
  process.exit(1)
}
console.log(`\n✅ ${rows.length} 條全部通過四項檢查`)
console.log(`   ① 覆蓋率 ${rows.length}/${rows.length}`)
console.log('   ② 英文欄零中文')
console.log(`   ③ LaTeX 逐條核對（${accounted} 項差異全部已具名解釋）`)
console.log('   ④ 評分準則分數總和相符\n')
