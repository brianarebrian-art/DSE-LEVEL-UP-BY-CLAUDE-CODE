// ============================================================================
// difficulty-bilingual.test.mts —— 難度徽章兩種語言都要有標籤
// ----------------------------------------------------------------------------
// 2026-08-23 實測：`DIFFICULTY_TIERS` 一直只有中文標籤（基礎／進階），於是英文
// 介面每一科、每一條題目都出住中文。
//
// ⚠️ i18n-guard 掃唔到呢一個 —— 佢只掃 app/ 同 components/ 嘅 .tsx，而呢個常數
//    喺 lib/ 嘅 .ts 入面。所以要有呢條測試補返個窿。
//
// 決策依據同中文科課題名同一批（創辦人 2026-08-23）：非華語（NCS）考生要讀得明
// 導覽層，否則整個介面用唔到。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { DIFFICULTY_TIERS } = await import('../difficulty.ts')

test('easy／medium 兩種語言都要有標籤，hard 兩種語言都唔顯示', () => {
  assert.equal(DIFFICULTY_TIERS.easy.label, '基礎')
  assert.equal(DIFFICULTY_TIERS.easy.labelEn, 'Foundation')
  assert.equal(DIFFICULTY_TIERS.medium.label, '進階')
  assert.equal(DIFFICULTY_TIERS.medium.labelEn, 'Advanced')
  // 最難嗰層刻意冇徽章 —— 難度由題目本身感受得到，唔使宣告。
  // 兩種語言必須一致噉樣冇，唔可以淨係中文冇。
  assert.equal(DIFFICULTY_TIERS.hard.label, null)
  assert.equal(DIFFICULTY_TIERS.hard.labelEn, null)
})

test('英文標籤唔可以係中文', () => {
  const CJK = /[一-鿿]/
  for (const [k, t] of Object.entries(DIFFICULTY_TIERS)) {
    if (t.labelEn === null) continue
    assert.ok(!CJK.test(t.labelEn), `${k} 嘅 labelEn 係中文：「${t.labelEn}」`)
  }
})

test('徽章組件會跟 locale 揀標籤 —— 唔可以寫死中文欄', async () => {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync(new URL('../../components/DifficultyBadge.tsx', import.meta.url), 'utf8')
  assert.ok(src.includes('useLocale'), '組件冇讀 locale')
  assert.ok(src.includes('labelEn'), '組件冇用英文標籤')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  assert.ok(!/\{\s*t\.label\s*\}/.test(code), '仍然直接渲染 t.label —— 英文介面會出中文')
})
