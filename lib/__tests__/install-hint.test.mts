// ============================================================================
// install-hint.test.mts —「加到主畫面」輕提示唔可以變成催促
// ----------------------------------------------------------------------------
// 一個每次開都彈嘅安裝提示，對焦慮嘅學生嚟講係另一件「未做嘅事」（憲章 §7）。
// 守：撳過唔使就永遠唔出、已裝唔出、唔出嘅時候唔攔瀏覽器、唔上雲。
// 行為實測見 commit（合成 beforeinstallprompt 事件）。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = readFileSync(join(ROOT, 'components', 'InstallHint.tsx'), 'utf8')
const CODE = SRC.replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '')

test('① 撳過「唔使喇」就永遠唔出 —— 喺裝任何監聽之前就 return', () => {
  const eff = CODE.slice(CODE.indexOf('useEffect(() => {'))
  const dismissedCheck = eff.indexOf("localStorage.getItem(DISMISS_KEY) === '1') return")
  const listener = eff.indexOf("addEventListener('beforeinstallprompt'")
  assert.ok(dismissedCheck > 0, '冇檢查已關')
  assert.ok(listener > dismissedCheck, '已關嘅檢查排咗喺監聽之後 —— 關咗都會攔瀏覽器事件')
})

test('② 已經裝咗（standalone）唔出', () => {
  assert.match(CODE, /if \(isStandalone\(\)\) return/)
})

test('③ 撳「唔使喇」要寫入 localStorage，而且 key 唔上雲（憲章 §16.E）', () => {
  assert.match(CODE, /localStorage\.setItem\(DISMISS_KEY, '1'\)/)
  const sync = readFileSync(join(ROOT, 'lib', 'sync.ts'), 'utf8')
  assert.ok(!sync.includes('dse_install_hint_dismissed'), '安裝提示 key 入咗上雲白名單')
})

test('④ 唔係彈窗 —— 冇 role=dialog、冇 fixed 定位', () => {
  assert.ok(!/role="dialog"|aria-modal/.test(CODE), '做咗彈窗')
  assert.ok(!/\bfixed\b/.test(CODE), '用咗 fixed 定位 —— 會遮住內容')
})
