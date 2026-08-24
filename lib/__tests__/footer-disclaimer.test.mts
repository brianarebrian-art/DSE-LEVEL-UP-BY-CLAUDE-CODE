// HKEAA 免責聲明常駐保證（憲章 §4 + §13）。
//
// 憲章要求免責聲明「每頁必須顯示」，但直到此測試出現之前，呢個保證完全靠人手：
// 只要有人喺 app/layout.tsx 刪走 <Footer />，或者改寫 dictionary 入面嘅
// disclaimerBody，全站免責聲明就會靜靜消失，冇任何閘會攔。呢個屬法務風險，
// 唔應該靠記性。
//
// 測試策略係【結構 + 內容】兩層，唔渲染 React（避免為咗一個字串檢查而引入
// testing-library 呢類新套件 —— 成本紅線）：
//   結構層：Footer 掛喺 root layout。App Router 之下 root layout 包住所有
//           路由（包括 route group 同 app/relax/layout.tsx 呢類嵌套 layout），
//           所以「root layout 有 Footer」等價於「每頁都有 Footer」。
//   內容層：兩個語言嘅 disclaimerBody 都必須講齊兩件事 —— 非官方試題、獨立改寫。
//
// 刻意唔逐字比對憲章 §4 嘅英文句子：實際實作係按 locale 出對應語言嘅完整聲明，
// 比單一句英文更清楚（中文用戶睇到中文）。故此驗【語義要件】而非【字面】。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (rel: string) => readFileSync(fileURLToPath(new URL('../../' + rel, import.meta.url)), 'utf8')

const { dictionary } = await import('../dictionary.ts')

// ── 結構層 ───────────────────────────────────────────────────────────────────

test('root layout 有渲染 <Footer />（等價於全站每頁都有）', () => {
  const layout = read('app/layout.tsx')
  assert.match(layout, /<Footer\s*\/>/, 'app/layout.tsx 必須渲染 <Footer />')
  assert.match(layout, /import\s+Footer\s+from/, 'app/layout.tsx 必須 import Footer')
})

test('Footer 有渲染免責聲明字串，唔係得個空殼', () => {
  const footer = read('components/Footer.tsx')
  assert.match(footer, /t\.footer\.disclaimerLabel/, 'Footer 必須渲染 disclaimerLabel')
  assert.match(footer, /t\.footer\.disclaimerBody/, 'Footer 必須渲染 disclaimerBody')
})

// ── 內容層 ───────────────────────────────────────────────────────────────────

test('中文免責聲明講齊「非官方試題」同「獨立改寫」', () => {
  const body = dictionary.zh.footer.disclaimerBody
  assert.match(body, /並非香港考試及評核局（HKEAA）官方試題/)
  assert.match(body, /獨立改寫/)
  assert.match(body, /等級預測僅供參考/, '憲章 §13 要求同時聲明等級預測只作參考')
})

// 2026-08-23 第 4 週憲章核對補漏：原本只驗中文版。
// 非華語考生睇嘅係英文 footer —— 免責聲明對佢哋一樣具法律意義，
// 唔可以得中文版齊備。
test('英文免責聲明同中文版同樣完整', () => {
  const dict = readFileSync(new URL('../dictionary.ts', import.meta.url).pathname, 'utf8')
  const en = dict.slice(dict.indexOf("disclaimerLabel: 'Disclaimer:'"))
  assert.match(en, /not official HKEAA papers/i, '英文版要講明並非考評局官方試題')
  assert.match(en, /independently rewritten/i, '英文版要講明係獨立改寫')
  assert.match(en, /for reference only/i, '英文版要講明等級預測只作參考')
})

test('英文免責聲明講齊同樣三件事', () => {
  const body = dictionary.en.footer.disclaimerBody
  assert.match(body, /HKEAA/)
  assert.match(body, /not official/i)
  assert.match(body, /independently rewritten/i)
  assert.match(body, /reference only/i)
})

test('兩個語言都唔可以留空', () => {
  for (const locale of ['zh', 'en'] as const) {
    const f = dictionary[locale].footer
    assert.ok(f.disclaimerLabel.trim().length > 0, `${locale} disclaimerLabel 不得為空`)
    assert.ok(f.disclaimerBody.trim().length > 40, `${locale} disclaimerBody 過短，疑似被清空`)
  }
})

test('版權行保留非商業聲明（憲章：100% 免費、非商業）', () => {
  assert.match(dictionary.zh.footer.copyright, /非商業用途/)
  assert.match(dictionary.en.footer.copyright, /Non-commercial/i)
})
