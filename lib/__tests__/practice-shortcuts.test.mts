// ============================================================================
// practice-shortcuts.test.mts —— 答題快捷鍵嘅三條守則，同一個自己踩過嘅坑
// ----------------------------------------------------------------------------
// 快捷鍵（1–4 ／ A–D 揀答案、Enter 落下一題）本身係效率功能，唔係無障礙合規 ——
// 選項掣一直 Tab 得到。但佢係一個【全域 keydown 監聽】，而全域監聽有三種
// 靜靜哋壞嘅方式，三種都唔會令任何現有測試紅：
//
//   ① 冇擋修飾鍵 → ⌘A 全選、⌃D 等系統快捷鍵會變成「答咗 A」。
//      學生撳 ⌘A 想複製題目，個介面就幫佢交咗答案，而且封晒其餘選項。
//   ② 冇擋輸入焦點 → 學生喺任何 input／textarea 打字，每個 A/B/C/D 都會答題。
//   ③ 冇擋已答狀態 → 鍵盤繞過一個介面上已經 disabled 嘅掣，答案改得到。
//
// 三條喺 localhost:3001 逐條實測過（⌘A 冇反應、輸入框內撳 B 冇反應、
// 答咗再撳 3 答案唔變、撳 2 揀到 B、Enter 101ms 後換題）。本測試守住佢哋
// 唔會喺往後嘅重構入面靜靜哋甩走。
//
// ④ 係另一件事：快捷鍵提示文字唔可以用 `ink-faint`，亦唔可以 `aria-hidden`。
//    第一版兩樣都犯咗。`ink-faint` 喺 globals.css:62 明文寫住 2.43、未達 AA、
//    只限停用控件同裝飾；而 `aria-hidden` 會令 docs/a11y-runtime-sweep 嗰個
//    對比度探針【跳過】呢個元素（佢刻意唔掃裝飾元素）。兩樣夾埋嘅後果係：
//    整咗一段睇唔清嘅字，再親手令自己個閘睇唔到佢。呢條測試守住嗰個組合。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = readFileSync(join(ROOT, 'app', 'practice', 'PracticeSession.tsx'), 'utf8')

/** 抽出 keydown handler 嗰段，避免成個檔亂撞。 */
const handler = (() => {
  const start = SRC.indexOf('const onKey = (e: KeyboardEvent)')
  assert.ok(start > 0, '揾唔到 keydown handler —— 快捷鍵俾人剷咗？')
  // 截到 addEventListener 為止，唔用固定字數 —— 加咗 Shift+F 之後，
  // 固定 1400 字會截走後面嘅 Enter 分支，令 ④ 靜靜哋掃唔到嘢。
  const end = SRC.indexOf("window.addEventListener('keydown'", start)
  assert.ok(end > start, '揾唔到 keydown 監聽嘅結尾')
  return SRC.slice(start, end)
})()

test('① 有修飾鍵一律唔攔 —— ⌘A / ⌃D 要照樣係瀏覽器嘅', () => {
  assert.match(
    handler,
    /e\.metaKey\s*\|\|\s*e\.ctrlKey\s*\|\|\s*e\.altKey/,
    '冇擋修飾鍵：學生撳 ⌘A 想全選，會變成答咗 A 並封晒其餘選項',
  )
})

test('② 輸入焦點一律唔攔 —— input / textarea / contenteditable', () => {
  assert.match(handler, /isContentEditable/, '冇擋 contenteditable')
  assert.match(
    handler,
    /INPUT\|TEXTAREA|TEXTAREA\|INPUT/,
    '冇擋 input／textarea：學生打字時每個 A–D 都會答題',
  )
})

test('③ 答咗就唔再接受選項鍵 —— 唔可以由鍵盤繞過 disabled', () => {
  assert.match(
    handler,
    /answerState\s*!==\s*null/,
    '冇擋已答狀態：介面上封咗嘅選項，鍵盤仲改得到',
  )
})

test('④ Enter 唔可以喺掣有焦點時再攔一次（否則一下撳跳兩題）', () => {
  assert.match(
    handler,
    /BUTTON\|A|A\|BUTTON/,
    'Enter 冇讓返畀瀏覽器原生觸發：焦點喺「下一題」時會跳兩題',
  )
})

test('⑤ 監聽要拆返 —— 唔可以漏 removeEventListener', () => {
  const eff = SRC.slice(SRC.indexOf("window.addEventListener('keydown'"), SRC.indexOf("window.addEventListener('keydown'") + 300)
  assert.match(eff, /removeEventListener\('keydown'/, 'keydown 監聽冇喺 cleanup 拆返')
})

test('⑥ 快捷鍵提示唔可以用 ink-faint，亦唔可以 aria-hidden', () => {
  const i = SRC.indexOf('快捷鍵：1–4')
  assert.ok(i > 0, '快捷鍵提示唔見咗 —— 一個冇人知嘅快捷鍵等於冇')
  // 由提示往前抠返個 <p> 開標籤
  const open = SRC.lastIndexOf('<p', i)
  const tag = SRC.slice(open, i)
  assert.ok(
    !/text-ink-faint/.test(tag),
    'ink-faint 係 2.43、未達 AA（globals.css:62 明文），只限停用控件同裝飾 —— 唔可以攞嚟做真資訊文字',
  )
  assert.ok(
    !/aria-hidden/.test(tag),
    'aria-hidden 會令 a11y 探針跳過呢個元素 —— 等於親手令自己個對比度閘睇唔到佢',
  )
})

test('⑦ Enter 同「下一題」掣要用同一個判斷 —— 未自診唔可以由鍵盤跳過', () => {
  // 2026-09-15 localhost:3001 實測：答錯、三維自診未揀，介面冇「下一題」掣，
  // 但真 Enter（key: 'Enter'）一撳就由第 2 題跳去第 3 題，dse_reverse_log 冇增加。
  // 自診係錯題 DNA 唯一入料口（憲章 §7.2 明文保留）。
  assert.match(
    SRC,
    /const canProceed = answerState !== null && \(answerState\.isCorrect \|\| diagnosed !== null\)/,
    'canProceed 定義唔見咗或者被改咗',
  )
  const enter = handler.slice(handler.indexOf("e.key === 'Enter'"))
  assert.match(enter, /if \(!canProceed/, 'Enter 冇檢查 canProceed —— 未自診都會跳去下一題')
  assert.match(enter, /emoOpen/, 'Enter 冇擋情緒溫度計 —— 會喺 modal 背後推進')
  assert.match(enter, /restOpen/, 'Enter 冇擋休息模式 —— 會喺 modal 背後推進')
  // JSX 嗰邊要用返同一個變數，唔可以另寫一條等價但會分叉嘅條件
  assert.match(SRC, /\{!canProceed \? \(/, '「下一題」嘅 JSX 條件冇用 canProceed —— 兩邊遲早會分叉')
  assert.ok(
    !/!answerState\.isCorrect && diagnosed === null/.test(SRC),
    '仲有一條手寫嘅「答錯又未自診」條件 —— 應該用 canProceed',
  )
})

test('⑧ 休息模式開住，唔可以喺背後用 1–4／A–D 答題', () => {
  const opt = handler.slice(handler.indexOf('const k = e.key.toUpperCase()') - 200)
  assert.match(opt, /restOpen\) return/, '選項鍵冇擋休息模式')
})
