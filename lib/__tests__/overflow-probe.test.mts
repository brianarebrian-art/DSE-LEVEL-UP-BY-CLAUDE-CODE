// ============================================================================
// overflow-probe.test.mts —— 375px 爆版探針唔可以再淨係靠 scrollX
// ----------------------------------------------------------------------------
// globals.css 由 2026-08-24 起有 `html { overflow-x: clip }`：頁面層永遠捲唔郁，
// 闊過屏幕嘅內容直接被裁走。舊 __ovf() 淨係靠 scrollTo(400) 之後睇 scrollX，
// 喺呢個設定之下一定係 0 —— 2026-09-13 嘅 34 路由「0 爆版」就係咁得出嚟。
// 本測試守住：只要 html 仲有 clip，探針就一定要量元素，而且一定要有負向自測。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const PROBE = readFileSync(join(ROOT, 'scripts', 'a11y', 'runtime-probe.js'), 'utf8')
const CSS = readFileSync(join(ROOT, 'app', 'globals.css'), 'utf8')
const ovf = PROBE.slice(PROBE.indexOf('window.__ovf = function'), PROBE.indexOf('window.__ovfSelfTest'))

test('① html 有 overflow-x: clip 嘅時候，探針唔可以淨係靠 scrollX', () => {
  if (!/html\s*\{[^}]*overflow-x:\s*clip/.test(CSS)) return // 冇 clip 就唔適用
  const code = ovf.replace(/^\s*\/\/.*$/gm, '')
  assert.ok(!/scrollTo\(400/.test(code), '__ovf 仲靠 scrollTo(400) —— 喺 html clip 之下永遠報 0')
  assert.match(code, /getBoundingClientRect/, '__ovf 冇量元素位置')
  assert.match(code, /overflowX !== 'visible'/, '__ovf 冇分辨「喺可捲容器入面」同「靠 html 裁走」')
})

test('② 一定要有負向自測：捉到闊元素、唔誤報可捲容器', () => {
  assert.match(PROBE, /window\.__ovfSelfTest = function/, '冇 __ovfSelfTest —— 一支未紅過嘅探針分唔到冇問題定壞咗')
  const st = PROBE.slice(PROBE.indexOf('window.__ovfSelfTest'))
  assert.match(st, /overflowX = 'auto'/, '自測冇包「可捲容器」嗰一邊')
  assert.match(st, /ok: caught && !falseAlarm/, '自測冇同時要求兩邊都啱')
})

// 對比度探針嘅同一個病：一支永遠報「0 失敗」嘅探針，分唔到「冇問題」同「量唔到」。
// Focus 燈（2026-09-14 上線）將非聚焦區擺喺 opacity .25，而舊版 __probe 只睇元素
// 自己嘅 opacity —— 開住 Focus 燈掃，照樣報 0 失敗。
test('④ 對比度探針要計埋祖先嘅 opacity', () => {
  const probe = PROBE.slice(PROBE.indexOf('window.__probe = function'), PROBE.indexOf('window.__ovf = function'))
  const code = probe.replace(/^\s*\/\/.*$/gm, '')
  assert.match(code, /parentElement/, '__probe 冇行過祖先鏈')
  assert.match(code, /a:\s*acc\.a\s*\*\s*op/, '__probe 冇將祖先嘅 opacity 乘入去')
  assert.match(code, /disabled/, '__probe 冇跳過停用控制項 —— WCAG 1.4.3 豁免佢哋，計入去會嘈')
  // 計埋祖先 opacity 之後，入場動畫途中嗰一刻會被當成失敗（2026-09-16 喺 /practice 實測到）。
  assert.match(code, /getAnimations/, '__probe 冇避開動畫途中嘅一刻 —— 會報一批唔存在嘅失敗')
  assert.match(PROBE, /window\.__settle = async function/, '冇 __settle —— 掃之前冇嘢等入場動畫做完')
})

test('⑤ 自測要有 opacity 嘅一紅一綠', () => {
  const st = PROBE.slice(PROBE.indexOf('window.__probeSelfTest'))
  assert.match(st, /SELFTEST_FAIL_OPACITY/, '自測冇「祖先 opacity 令對比度唔合格」嗰個例')
  assert.match(st, /SELFTEST_PASS_OPACITY/, '自測冇「祖先 opacity 但仍然合格」嗰個例 —— 淨係要紅會變成亂嗌都算啱')
  assert.match(st, /SELFTEST_FAIL_OPACITY:\s*true/, '自測冇要求嗰個例一定要紅')
  assert.match(st, /SELFTEST_PASS_OPACITY:\s*false/, '自測冇要求嗰個例一定要綠')
})

test('③ KaTeX 顯示式要可以橫向捲動（否則喺 html clip 之下會被裁走）', () => {
  assert.match(CSS, /\.katex-display\s*\{[^}]*overflow-x:\s*auto/, '.katex-display 冇 overflow-x: auto —— 長算式右半會被裁走')
})
