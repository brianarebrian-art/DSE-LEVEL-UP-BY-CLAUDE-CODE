// ============================================================================
// originkit-motion.test.mts —— Originkit 動態劇場底層嘅紅線鎖
// ----------------------------------------------------------------------------
// 動畫本身壞咗，眼見得到；下面呢四樣壞咗係【睇唔出】嘅，所以要用測試鎖住。
//
//   1. 答錯唔可以比答啱「大聲」。憲章 §7 禁止一切打擊自信嘅元素，規格書 §0
//      亦明訂「答錯無震屏、無負面驚嚇回饋」。青色同粉色衝擊波必須同一時長、
//      同一尺寸 —— 有人日後「順手」把粉色改快或改大，呢條就會紅。
//   2. 三重降級必須齊全：prefers-reduced-motion／SEN(font-easy)／Light 主題。
//      SEN 之下裝飾層要【整層隱藏】而唔係調慢 —— 調慢對讀寫障礙同注意力障礙
//      用戶一樣係干擾源。
//   3. back／elastic 過衝曲線只准出現喺成就彈窗一處。globals.css 上方
//      P1-7-R2（Leo 2026-07-16）訂明全站禁止 bounce，pop-in 嘅過衝當時已刻意
//      剷走；2026-08-22 CEO 拍板保留遊戲化，只為成就彈窗破例，唔可以蔓延。
//   4. 規格書明寫嘅數值（×5 連擊 5s、焦慮 40s）唔可以靜靜雞飄走。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const CSS = readFileSync(new URL('../../app/globals.css', import.meta.url).pathname, 'utf8')
/** 剝走 /* … *\/ 註釋之後嘅 CSS。註釋入面引用嘅曲線唔係生效規則，
 *  唔剝走就會令下面「過衝曲線只准一條」誤報 —— 實測踩過一次。 */
const LIVE = CSS.replace(/\/\*[\s\S]*?\*\//g, '')

/** 抽出某條規則嘅內文（第一個相符者）。 */
function ruleBody(selector: string): string {
  const i = CSS.indexOf(selector)
  assert.notEqual(i, -1, `搵唔到選擇器 ${selector}`)
  const open = CSS.indexOf('{', i)
  const close = CSS.indexOf('}', open)
  return CSS.slice(open + 1, close)
}

test('答錯嘅衝擊波唔可以比答啱大聲 —— 粉色版本只准換色，唔准改時長或尺寸', () => {
  const base = ruleBody('.shockwave {')
  const pink = ruleBody('.shockwave-pink {')
  // 基礎版必須訂明 600ms
  assert.match(base, /animation:\s*shockwave-expand\s+600ms/, '.shockwave 應為 600ms')
  // 粉色版【只准】覆寫 background —— 一旦出現 animation／width／height／transform 就係在加碼
  for (const forbidden of ['animation', 'width', 'height', 'transform', 'box-shadow']) {
    assert.ok(
      !new RegExp(`(^|;)\\s*${forbidden}\\s*:`, 'm').test(pink),
      `.shockwave-pink 唔可以覆寫 ${forbidden} —— 答錯嘅回饋必須同答啱一致（憲章 §7）`,
    )
  }
  // 全份 CSS 唔可以有針對答錯嘅震動關鍵幀
  assert.ok(!/@keyframes\s+[\w-]*shake/i.test(LIVE), 'CSS 唔應該有 shake 關鍵幀 —— 規格書 §0 明訂答錯無震屏')
})

test('三重降級齊全：reduced-motion／SEN／Light 主題', () => {
  const decorative = ['.particle-bg', '.combo-flame', '.scatter-title', '.achievement-pop']

  // (a) prefers-reduced-motion
  const rmIdx = CSS.lastIndexOf('@media (prefers-reduced-motion: reduce)')
  assert.notEqual(rmIdx, -1, '缺 prefers-reduced-motion 區塊')
  const rmBlock = CSS.slice(rmIdx)
  for (const c of decorative) {
    assert.ok(rmBlock.includes(c), `${c} 未納入 prefers-reduced-motion 降級`)
  }

  // (b) SEN（一鍵舒適模式 = html.font-easy）—— 粒子同火焰要 display:none，唔係調慢
  assert.match(
    CSS,
    /html\.font-easy \.particle-bg,\s*\nhtml\.font-easy \.combo-flame \{\s*\n\s*display:\s*none/,
    'SEN 之下粒子場與連擊火焰必須整層隱藏（display:none），唔可以只係調慢',
  )

  // (c) Light 主題唔套用霓虹裝飾層
  assert.match(CSS, /:root\[data-theme='light'\] \.particle-bg/, 'Light 主題未關掉粒子場')
  assert.match(CSS, /:root\[data-theme='light'\] \.combo-flame/, 'Light 主題未關掉連擊火焰')
})

test('過衝（back）曲線只准出現喺成就彈窗一處 —— P1-7-R2 全站禁令未被解禁', () => {
  // cubic-bezier 第二個控制點 y > 1 即屬過衝
  const overshoot = [...LIVE.matchAll(/cubic-bezier\(\s*[\d.-]+\s*,\s*([\d.-]+)\s*,/g)]
    .filter((m) => Number(m[1]) > 1)
  assert.equal(overshoot.length, 1, `過衝曲線只准一條（成就彈窗），實際 ${overshoot.length} 條`)
  // 而且必須就係 .achievement-pop 用嗰條
  assert.match(ruleBody('.achievement-pop {'), /cubic-bezier\(0\.34,\s*1\.56,\s*0\.64,\s*1\)/)
})

test('規格書明訂嘅數值唔可以飄走：×5 連擊 5s、焦慮 40s', () => {
  assert.match(ruleBody('.particle-combo-3 {'), /--particle-speed:\s*5s/, '×5 連擊應為 5s（規格書 §2.1）')
  assert.match(ruleBody('.particle-calm {'), /--particle-speed:\s*40s/, '焦慮狀態應放慢至 40s（規格書 §2.1）')
  assert.match(ruleBody('.particle-calm {'), /--particle-alpha:\s*0\.05/, '焦慮狀態透明度應降至 0.05')
})

test('練習頁真係用緊衝擊波 —— 唔可以淨係有 CSS 冇接線（憲章 §4）', () => {
  const src = readFileSync(new URL('../../app/practice/PracticeSession.tsx', import.meta.url).pathname, 'utf8')
  assert.match(src, /className=\{`shockwave\$\{/, 'PracticeSession 未 render 衝擊波')
  assert.match(src, /shockwave-pink/, 'PracticeSession 未接答錯嘅粉色版本')
  assert.match(src, /relative overflow-hidden/, '選項掣缺 relative／overflow-hidden，衝擊波會定位錯')
  // 600ms 之後要拆走節點，唔好長期留喺 DOM
  assert.match(src, /setShockIdx\(null\)\s*\}?,\s*600\s*\)/, '衝擊波節點應於 600ms 後移除')
})
