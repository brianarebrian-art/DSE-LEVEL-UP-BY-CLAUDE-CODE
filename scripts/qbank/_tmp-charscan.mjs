import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
const D = 'scripts/qbank/drafts'
// 掃：① 英文欄出現 CJK；② 中文欄出現小寫英文單詞；③ 任何欄出現西里爾／希臘字母
const CJK = /[一-鿿]/
// 希臘字母屬正當數理符號（Δv、π、θ）—— 只攔西里爾。
const CYR = /[Ѐ-ӿ]/
let bad = 0
// 語言科（english* / chinese*）嘅題目內容【就是】考核對象，題幹以英文書寫屬正常，
// 同 term-guard 嘅 isLanguageBank 一致豁免；否則成科都會假報。
const LANG = /^(english|chinese)/
for (const f of readdirSync(D).filter((f) => f.endsWith('-b4.json'))) {
  const isLang = LANG.test(f)
  const rows = JSON.parse(readFileSync(join(D, f), 'utf8'))
  for (const q of rows) {
    for (const [k, v] of Object.entries(q)) {
      if (typeof v !== 'string') continue
      if (CYR.test(v)) { console.log(`CYRILLIC ${f} ${q.id} ${k}: ${v.match(/\S*[Ѐ-ӿ]\S*/)?.[0]}`); bad++ }
      if (!isLang && /En$/.test(k) && CJK.test(v)) { console.log(`CJK-IN-EN ${f} ${q.id} ${k}: ${v.match(/[一-鿿]+/)?.[0]}`); bad++ }
      if (!isLang && !/En$/.test(k) && ['question','explanation','referenceAnswer','markingScheme'].includes(k)) {
        const m = v.match(/(?<![A-Za-z0-9\-'/.])[a-z]{3,}(?![A-Za-z0-9\-'/.])/g)
        const ok = new Set(['ph','kcal','rpm','vs','et','al'])
        const hits = (m ?? []).filter((w) => !ok.has(w))
        if (hits.length) { console.log(`LOWER-EN-IN-ZH ${f} ${q.id} ${k}: ${[...new Set(hits)].join(' ')}`); bad++ }
      }
    }
  }
}
console.log(bad ? `\n⚠️ ${bad} 處` : '✅ 零命中')
