// ============================================================================
// quiet-mode.test.mts —— 安靜模式 ＋ 無障礙面板撳唔撳得到
// ----------------------------------------------------------------------------
// ① ～ ④：憲章 §8.1 約束 4「SEN 必須可以整層關掉遊戲化」喺 dashboard 兌現。
// ⑤ ⑥：2026-09-15 捉到嘅面板 bug —— 無障礙面板 fixed 貼底、冇 max-height，
//   一高過視窗頂部就伸出畫面外、捲都捲唔到，而嗰度係「一鍵舒適模式」總掣。
//   實測 992px 面板喺 987px 視窗頂部 −133px；手機 812px 本來就爆。
//   面板每加一個掣就高一截（今日加 Focus 燈就係令 987px 都爆嗰一下），
//   所以要鎖住「面板一定有高度上限」，而唔係靠「目前夠位」。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')

test('① 段位卡同溫習時數卡喺安靜模式下唔出（hook 喺任何 return 之前）', () => {
  for (const f of ['PracticeRankCard.tsx', 'StudyTimeInsight.tsx']) {
    const s = read('components', f)
    const hook = s.indexOf('const quiet = useQuiet()')
    const firstReturn = s.indexOf('return null', s.indexOf('export default function'))
    assert.ok(hook > 0, `${f} 冇用 useQuiet`)
    assert.ok(hook < firstReturn, `${f} 嘅 useQuiet 排咗喺 return 之後 —— 違反 hook 規則，而且會漏收`)
    assert.match(s, /if \(quiet\) return null/, `${f} 安靜模式下冇收埋`)
  }
})

test('② 一鍵舒適模式要一齊開關安靜模式（§8.1 約束 4）', () => {
  const p = read('components', 'A11yPanel.tsx')
  const body = p.slice(p.indexOf('const toggleComfort = useCallback'), p.indexOf('}, [easy, hideTimer, ruler, noMotion, sound])'))
  assert.match(body, /localStorage\.setItem\(QUIET_KEY, next \? '1' : '0'\)/, '舒適模式冇寫安靜模式 —— SEN 學生開咗舒適模式仍然見到段位／EXP')
})

test('③ 安靜模式唔可以納入 comfortOn 推導（同 calm 一樣嘅理由）', () => {
  const p = read('components', 'A11yPanel.tsx')
  const line = p.match(/const comfortOn = [^\n]+/)?.[0] ?? ''
  assert.ok(line && !/quiet/i.test(line), '安靜模式入咗 comfortOn —— 已開舒適模式嘅學生會突然見到總掣變「關」')
})

test('④ 安靜模式 key 唔上雲，而且 dashboard 有個 aria-pressed 掣', () => {
  assert.ok(!read('lib', 'sync.ts').includes('dse_quiet_mode'), 'dse_quiet_mode 入咗上雲白名單')
  assert.match(read('components', 'QuietModeToggle.tsx'), /aria-pressed=\{quiet\}/)
  assert.match(read('app', 'dashboard', 'DashboardPageClient.tsx'), /<QuietModeToggle \/>/, 'dashboard 冇掛安靜模式掣')
})

test('⑤ 無障礙面板一定要有高度上限 ＋ 內部捲動', () => {
  const p = read('components', 'A11yPanel.tsx')
  assert.match(p, /fixed floating-bottom-3 floating-panel-max-h/, '面板冇 floating-panel-max-h —— 高過視窗就撳唔到頂部嘅總掣')
  const css = read('app', 'globals.css')
  const rule = css.slice(css.indexOf('.floating-panel-max-h {'), css.indexOf('}', css.indexOf('.floating-panel-max-h {')))
  assert.match(rule, /overflow-y:\s*auto/, '面板冇內部捲動')
})

test('⑥ 面板高度上限同 .floating-bottom-3 用同一條 bottom 公式', () => {
  const css = read('app', 'globals.css')
  const bottom = css.match(/\.floating-bottom-3 \{\s*bottom: calc\((max\([^;]+\)) \+ var\(--bottom-nav-h\)\);/)?.[1]
  assert.ok(bottom, '讀唔到 .floating-bottom-3 嘅公式')
  const panel = css.slice(css.indexOf('.floating-panel-max-h {'), css.indexOf('}', css.indexOf('.floating-panel-max-h {')))
  assert.ok(panel.includes(bottom), '面板上限嘅 bottom 公式同 .floating-bottom-3 唔一致 —— 改咗一邊冇改另一邊')
})
