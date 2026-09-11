// ============================================================================
// settings-have-controls.test.mts —— 每個會同步嘅設定，都要有個掣改得到
// ----------------------------------------------------------------------------
// 2026-09-09 剷 30 秒反思鎖嗰陣，`dse_calm_lock` 嘅【唯一開關】喺鎖個介面入面，
// 一齊被剷走。之後嘅狀態係：
//   · 個設定仲喺 localStorage
//   · 仲會上雲、仲會同步落其他裝置（lib/settingsSync.ts）
//   · 仲影響指令字高亮嘅呈現（PracticeSession → CommandWordText soft）
//   · 但【冇任何介面改得到佢】
//
// 一個改唔到嘅設定唔會嗌，亦唔會令任何測試紅 —— 佢淨係靜靜哋卡死喺某個值。
// 對一個真係需要柔和呈現嘅 SEN 學生嚟講，佢見到嘅係「呢個功能唔存在」。
//
// 呢批測試守嘅唔係嗰一個掣，係【呢一類 bug】。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SYNC = readFileSync('lib/settingsSync.ts', 'utf8')

/** components/ ＋ app/ 之下全部 .tsx，砌成一個大字串攞嚟掃。 */
function allSource(): string {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '__tests__' || e.name.startsWith('.')) continue
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.tsx')) out.push(readFileSync(p, 'utf8'))
    }
  }
  walk('components')
  walk('app')
  return out.join('\n')
}
const UI = allSource()

// ── ① 每個會同步嘅 boolean 設定，都要有地方寫得入 ──────────────────────────
test('每個上雲嘅 SEN 開關都有介面改得到', () => {
  // 由 settingsSync.ts 自己攞 key，唔喺測試度另抄一份 ——
  // 抄一份嘅話，將來加新設定唔會有人記得同步更新呢條測試。
  const keys = [...SYNC.matchAll(/^const (\w*KEY) = '(dse_[a-z_]+)'/gm)].map((m) => m[2])
  assert.ok(keys.length >= 4, `settingsSync.ts 只揾到 ${keys.length} 個 key，個 regex 可能已經失效`)

  for (const key of keys) {
    // 「有介面改得到」＝ 有地方 setItem 佢。淨係 getItem 就係唯讀，即係改唔到。
    // 兩種寫法都要接受：直接用字面 key，或者先綁去一個常數再用。
    const literal = new RegExp(`setItem\\(\\s*['"]${key}['"]`).test(UI)
    const written = literal || constNameWrites(key)
    assert.ok(written, `${key} 會同步上雲，但 components/ 同 app/ 入面冇任何介面寫得入佢 —— ` +
      `即係學生改唔到（2026-09-09 dse_calm_lock 就係咁）`)
  }
})

/** 好多檔案用常數名（例如 CALM_KEY）而唔係字面 key，所以要順住常數名再搵一次。 */
function constNameWrites(key: string): boolean {
  const names = [...UI.matchAll(new RegExp(`const (\\w+) = '${key}'`, 'g'))].map((m) => m[1])
  return names.some((n) => new RegExp(`setItem\\(${n}\\s*,`).test(UI))
}

// ── ② 柔和呈現嗰個掣（今次補返嗰個）────────────────────────────────────────
test('A11yPanel 有柔和呈現嘅掣', () => {
  const panel = readFileSync('components/A11yPanel.tsx', 'utf8')
  assert.match(panel, /const CALM_KEY = 'dse_calm_lock'/, '揾唔到 CALM_KEY')
  assert.match(panel, /setItem\(CALM_KEY/, '個掣要寫得入 localStorage')
  assert.match(panel, /aria-pressed=\{calm\}/, '要有 aria-pressed —— 鍵盤／screen reader 用家要知開咗未')
  assert.match(panel, /toggleCalm/, '揾唔到 toggleCalm')
})

// ── ③ 改完要即刻生效 ──────────────────────────────────────────────────────
//
// A11yPanel 寫完 localStorage 之後派 `dse-a11y`。PracticeSession 如果只係
// mount 讀一次，學生喺做緊題嗰陣撳個掣係【冇反應】嘅 —— 一個要 reload
// 先生效嘅無障礙設定，等於冇。
test('練習頁跟住 dse-a11y 更新柔和呈現，唔使 reload', () => {
  const panel = readFileSync('components/A11yPanel.tsx', 'utf8')
  const calmIdx = panel.indexOf('toggleCalm')
  const seg = panel.slice(calmIdx, calmIdx + 700)
  assert.match(seg, /dispatchEvent\(new Event\('dse-a11y'\)\)/, 'toggleCalm 要派 dse-a11y')

  const ps = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  const idx = ps.indexOf('dse_calm_lock')
  assert.ok(idx > 0, 'PracticeSession 應該仍然讀 dse_calm_lock')
  const window700 = ps.slice(Math.max(0, idx - 700), idx + 700)
  assert.match(window700, /addEventListener\('dse-a11y'/,
    'PracticeSession 要聽 dse-a11y —— 否則做緊題撳個掣冇反應')
})

// ── ④ 唔可以順手改咗「一鍵舒適模式」嘅推導 ────────────────────────────────
//
// 今日已經開住舒適模式嘅學生，唔應該因為新加一個掣而突然見到總掣變「關」。
test('一鍵舒適模式嘅推導唔包含 calm', () => {
  const panel = readFileSync('components/A11yPanel.tsx', 'utf8')
  const m = panel.match(/const comfortOn = ([^\n]+)/)
  assert.ok(m, '揾唔到 comfortOn')
  assert.ok(!/\bcalm\b/.test(m![1]),
    `comfortOn 包含咗 calm（${m![1].trim()}）—— 會令現有學生嘅總掣狀態顯示無故變樣`)
})
