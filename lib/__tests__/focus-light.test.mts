// ============================================================================
// focus-light.test.mts —— Focus 專注燈光模式（html.focus-light）
// ----------------------------------------------------------------------------
// 呢個功能嘅本質係【故意令一部分介面難睇啲】。所以佢同其餘無障礙功能唔同：
// 佢有一種特有嘅壞法 —— 唔係壞咗唔生效，而係【生效咗但收唔返】。
// 下面四條測試守嘅就係嗰四條唔可以甩嘅安全線，唔係守「呢個功能仲喺度」。
//
//   ① 還原路徑（:hover / :focus-within）—— 0.25 嘅文字對比度大約 1.3:1，
//      遠低於 AA。冇還原路徑嘅話，一個開咗呢個模式嘅學生要讀返個「返回」掣，
//      就只剩「盲摸摸去關閉呢個模式」一條路。呢條係成個功能可唔可以存在嘅前提。
//   ② 觸控入口（A11yPanel 個掣）—— 目標書寫嘅係 Shift + F，但手機平板冇 Shift。
//      只得快捷鍵 = 觸控機嘅學生開咗（由雲端／另一部機）就永遠關唔返。
//      憲章 §7.2 記低過完全一樣嘅 bug：dse_calm_lock 個掣隨反思鎖一齊消失，
//      設定仲喺度、仲會同步、但改唔到。
//   ③ 唔可以用 visibility／display／aria-hidden 去做 —— 嗰三樣會真係由讀屏
//      同 Tab 次序度攞走內容。opacity 對輔助技術完全透明，呢個就係目標書
//      「不破壞 ARIA 讀屏」嘅落實方式。
//   ④ 唔可以上雲（憲章 §16.E 執行第 1 點：每個上雲 key 要創辦人書面批准）。
//
// ⚠️ 本測試掃原始碼。佢證明唔到個掣撳落去真係郁 —— 2026-09-11 嗰個
//    re-entrant bug 四條測試全綠而個掣係壞嘅。運行中 UI 嘅實測見 commit message。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')

const CSS = read('app', 'globals.css')
const PRACTICE = read('app', 'practice', 'PracticeSession.tsx')
const PANEL = read('components', 'A11yPanel.tsx')
const GLOBAL = read('components', 'GlobalA11y.tsx')

test('① 淡咗嘅嘢一定要有還原路徑（:hover ＋ :focus-within）', () => {
  assert.match(
    CSS,
    /html\.focus-light \.focus-dim\s*\{[^}]*opacity:\s*0?\.\d+/,
    '揾唔到 focus-dim 嘅 opacity 規則 —— 功能俾人剷咗？',
  )
  assert.match(
    CSS,
    /html\.focus-light \.focus-dim:hover/,
    'hover 還原冇咗：滑鼠用戶要關閉成個模式先讀返到周邊',
  )
  assert.match(
    CSS,
    /html\.focus-light \.focus-dim:focus-within/,
    'focus-within 還原冇咗：鍵盤用戶 Tab 入去都係 1.3:1，等於封死咗出口',
  )
})

test('② 觸控機一定要開關得到 —— A11yPanel 有個掣，唔止 Shift + F', () => {
  assert.match(PANEL, /FOCUS_LIGHT_KEY/, 'A11yPanel 冇引用 FOCUS_LIGHT_KEY')
  assert.match(
    PANEL,
    /aria-pressed=\{focusLight\}/,
    '面板冇一個 aria-pressed 綁住 focusLight 嘅掣 —— 手機學生關唔返',
  )
  assert.match(
    GLOBAL,
    /localStorage\.getItem\(FOCUS_LIGHT_KEY\) === '1'\) document\.documentElement\.classList\.add\('focus-light'\)/,
    'GlobalA11y 冇喺開機套用 —— reload 之後個偏好會靜靜哋失效',
  )
})

test('③ 唔可以用 visibility／display／aria-hidden 去淡化（會斷讀屏同 Tab）', () => {
  const block = CSS.slice(CSS.indexOf('html.focus-light .focus-dim'), CSS.indexOf('html.focus-light .focus-dim') + 400)
  assert.ok(!/visibility\s*:/.test(block), 'focus-dim 用咗 visibility —— 讀屏會攞唔到內容')
  assert.ok(!/display\s*:\s*none/.test(block), 'focus-dim 用咗 display:none —— 內容由 DOM 消失')
  // 頁內三個淡化區都唔可以掛 aria-hidden
  for (const m of PRACTICE.matchAll(/className="focus-dim[^"]*"/g)) {
    const around = PRACTICE.slice(Math.max(0, m.index - 200), m.index + 200)
    assert.ok(
      !/aria-hidden/.test(around),
      'focus-dim 區域附近見到 aria-hidden —— 淡化唔可以順手由讀屏度攞走內容',
    )
  }
})

test('④ 個 key 唔可以上雲（憲章 §16.E：每個上雲 key 要創辦人書面批准）', () => {
  const SYNC = read('lib', 'sync.ts')
  assert.ok(
    !SYNC.includes('dse_focus_light'),
    'dse_focus_light 出現咗喺 lib/sync.ts —— 上雲白名單而家係 5 個 key，加多一個要重新簽名',
  )
})

test('⑤ Shift + F 要喺修飾鍵／輸入焦點兩個守衛之後', () => {
  const i = PRACTICE.indexOf('const onKey = (e: KeyboardEvent)')
  assert.ok(i > 0, '揾唔到 keydown handler')
  const h = PRACTICE.slice(i, i + 1800)
  const guardMeta = h.indexOf('e.metaKey')
  const guardInput = h.indexOf('isContentEditable')
  const shiftF = h.indexOf('e.shiftKey')
  assert.ok(shiftF > 0, 'Shift + F 冇咗')
  assert.ok(guardMeta > 0 && guardMeta < shiftF, 'Shift + F 排咗喺修飾鍵守衛之前')
  assert.ok(
    guardInput > 0 && guardInput < shiftF,
    'Shift + F 排咗喺輸入焦點守衛之前 —— 學生喺輸入框打大階 F 會變成切換',
  )
})

test('⑥ CSS 規則要真係有人用 —— focus-dim 至少掛咗喺練習頁', () => {
  const n = [...PRACTICE.matchAll(/className="focus-dim/g)].length
  assert.ok(n >= 3, `練習頁只有 ${n} 個 focus-dim 區 —— 一條冇人用嘅 CSS 規則等於冇做`)
})
