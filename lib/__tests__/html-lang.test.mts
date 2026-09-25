// <html lang> 要跟住介面語言轉（WCAG 3.1.1，A 級）—— 2026-09-25。
//
// 之前 app/layout.tsx 寫死 lang="zh-HK"，而 lib/i18n.tsx 切語言時從來冇改佢。
// 學生切咗英文，讀屏軟件照用廣東話聲線讀英文字。
//
// 兩層：① 對應值（純函數）；② 接線 —— LanguageProvider 真係喺 locale 變嘅時候
// 寫 document.documentElement.lang。淨係測 ① 唔夠：函數啱但冇人叫，一樣係個 bug。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = readFileSync(fileURLToPath(new URL('../i18n.tsx', import.meta.url)), 'utf8')
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

test('對應值：en → en；zh → zh-HK（同 layout.tsx 伺服器端預設一致）', () => {
  const m = code.match(/export function htmlLang\(locale: Locale\): string \{\s*return ([^\n]+)\n/)
  assert.ok(m, '搵唔到 htmlLang()')
  const layout = readFileSync(fileURLToPath(new URL('../../app/layout.tsx', import.meta.url)), 'utf8')
  const serverLang = layout.match(/<html lang="([^"]+)"/)?.[1]
  assert.equal(serverLang, 'zh-HK')
  assert.match(m[1], /locale === 'en' \? 'en' : 'zh-HK'/)
})

const WIRING = /useEffect\(\(\) => \{\s*document\.documentElement\.lang = htmlLang\(locale\)\s*\}, \[locale\]\)/

test('接線：locale 一變就寫 document.documentElement.lang', () => {
  assert.match(code, WIRING, 'LanguageProvider 要喺 [locale] 嘅 effect 入面設 <html lang>')
})

test('負向自測：同一條檢查，對住改壞咗嘅版本會紅', () => {
  // ① 冇咗嗰句；② dependency 寫成 []（淨係設一次，之後切語言唔跟）
  const noLine = code.replace(/document\.documentElement\.lang = htmlLang\(locale\)/, '')
  const staleDeps = code.replace(/(document\.documentElement\.lang = htmlLang\(locale\)\s*\}, )\[locale\]/, '$1[]')
  assert.doesNotMatch(noLine, WIRING)
  assert.doesNotMatch(staleDeps, WIRING)
})
