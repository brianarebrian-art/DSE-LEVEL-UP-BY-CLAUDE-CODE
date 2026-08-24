#!/usr/bin/env node
// responsive-guard —— 攔截會喺 375px 手機爆版嘅寫法（HOTFIX-0823 第三階段）
//
// 點解要有呢個閘：
// 2026-08-24 喺首頁揾到一個 `w-[560px]` 嘅裝飾光暈。喺 375px 機上，佢左右各爆
// 出 93px。手機 Chrome 遇到呢種情況唔係出橫向捲軸，而係【自動撐大版面視窗】——
// 實測 innerWidth 由 375 變成 467，即係成頁被瀏覽器縮細到 80%。字細一圈，對
// 讀寫障礙、弱視同 SEN 考生就係直接嘅無障礙倒退。
//
// 更麻煩嘅係，最常見嗰句驗收 `document.documentElement.scrollWidth ===
// window.innerWidth` 喺呢種情況之下【回傳 true】—— 因為兩邊一齊被撐大。即係話
// 人手驗收會話「冇溢出」，但部機實際上真係爆緊。所以呢個閘用靜態掃描，唔靠
// 執行時量度。
//
// 點解唔用 headless 瀏覽器逐頁量：Playwright／Puppeteer 都係新套件，
// 憲章 §5 成本死鎖唔准新增。靜態掃描零依賴、零成本，攔到嘅係【成因】，
// 唔係症狀。
//
// 呢個閘只掃【明確會爆】嘅寫法，唔做啟發式猜測 —— 一個成日誤報嘅閘，
// 三個星期之後就會有人加 `--no-verify` 繞過佢。

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['app', 'components']
const CSS_FILE = 'app/globals.css'

// 最窄支援闊度。iPhone SE / iPhone 8 都係 375。
const MIN_VIEWPORT = 375
// 扣起左右各 16px 嘅慣用內距之後，內容可用闊度。超過呢個數就算高風險。
const SAFE_CONTENT_WIDTH = MIN_VIEWPORT - 32

const problems = []

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === '__tests__') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.(tsx|jsx)$/.test(name)) out.push(full)
  }
  return out
}

/** 剝走註釋，避免掃到解釋本規則嘅文字（呢個陷阱之前中過好多次）。 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
}

const files = SCAN_DIRS.flatMap((d) => {
  try { return walk(join(ROOT, d)) } catch { return [] }
})

for (const file of files) {
  const rel = relative(ROOT, file)
  const raw = readFileSync(file, 'utf8')
  const src = stripComments(raw)
  const lines = src.split('\n')

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`

    // ── (1) 寫死像素闊度，闊過安全內容闊度，而同一個 class 串又冇 max-w- 封頂
    for (const m of line.matchAll(/(?<![\w-])(min-)?w-\[(\d+)px\]/g)) {
      const px = Number(m[2])
      if (px <= SAFE_CONTENT_WIDTH) continue
      // 同一個 className 串裡面有 max-w- 就當已經封咗頂（例如 w-full max-w-[560px]）
      const cls = line.slice(Math.max(0, m.index - 400), m.index + 400)
      if (/max-w-(\[|full|screen-|xs|sm|md|lg|xl|\d)/.test(cls)) continue
      problems.push({
        at,
        rule: '寫死闊度',
        detail: `${m[0]} = ${px}px，闊過 375px 機嘅可用內容闊度（${SAFE_CONTENT_WIDTH}px），而且冇 max-w- 封頂`,
        fix: `改成 w-full max-w-[${px}px]（桌面版一模一樣，手機版自動收窄）`,
      })
    }

    // ── (2) w-screen / 100vw：喺有直向捲軸嘅頁面會闊過視窗（vw 計埋捲軸位）
    for (const m of line.matchAll(/(?<![\w-])w-screen(?![\w-])|100vw/g)) {
      const cls = line.slice(Math.max(0, m.index - 300), m.index + 300)
      if (/max-w-(\[|full)/.test(cls)) continue
      problems.push({
        at,
        rule: 'w-screen / 100vw',
        detail: `${m[0]} 冇 max-w- 封頂。100vw 計埋直向捲軸嘅闊度，喺桌面會爆出視窗`,
        fix: '用 w-full（跟父容器）代替，或者加 max-w-full',
      })
    }

    // ── (3) SVG 寫死 width 屬性但冇 viewBox：唔會跟容器縮
    if (/<svg\b/.test(line)) {
      const w = line.match(/\bwidth=["{]?(\d+)/)
      if (w && Number(w[1]) > SAFE_CONTENT_WIDTH && !/viewBox/.test(line)) {
        problems.push({
          at,
          rule: 'SVG 寫死闊度',
          detail: `<svg width="${w[1]}"> 冇 viewBox，唔會跟容器縮細`,
          fix: '加 viewBox 同 className="w-full h-auto"',
        })
      }
    }
  })
}

// ── (4) 全局保險必須仲喺度 ──────────────────────────────────────────────────
// 呢層唔係修理，係安全網。但佢一旦被人手誤刪，所有未攔到嘅溢出會即刻返晒出嚟，
// 而且因為上面講嘅「版面視窗自動撐大」，人手驗收多數睇唔出。
let css = ''
try { css = readFileSync(join(ROOT, CSS_FILE), 'utf8') } catch {
  problems.push({ at: CSS_FILE, rule: '搵唔到檔案', detail: '讀唔到全局樣式檔', fix: '確認路徑' })
}
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, ' ')
// 用 lookbehind 唔好將前面個 `}` 食咗 —— 一食咗，下一個 html {} 區塊就會因為
// 前面已經冇 `}` 而配對唔到（本閘第一版就係咁走漏咗）。
const htmlRules = [...cssNoComments.matchAll(/(?<![\w.#-])html\s*\{([^}]*)\}/g)].map((m) => m[1]).join(';')
if (css && !/overflow-x:\s*clip/.test(htmlRules)) {
  problems.push({
    at: CSS_FILE,
    rule: '全局保險唔見咗',
    detail: 'html 冇 overflow-x: clip',
    fix: '睇返「橫向溢出保險」嗰段。用 clip 唔用 hidden —— hidden 會整爛 position: sticky',
  })
}
if (css && !/overflow-wrap:\s*break-word/.test(cssNoComments)) {
  problems.push({
    at: CSS_FILE,
    rule: '全局保險唔見咗',
    detail: 'body 冇 overflow-wrap: break-word',
    fix: '長英文詞／URL／化學式喺 375px 窄欄會撐爆容器',
  })
}

// ── 報告 ────────────────────────────────────────────────────────────────────
if (problems.length === 0) {
  console.log(`✅ responsive-guard：${files.length} 個檔案，冇揾到 375px 爆版風險`)
  process.exit(0)
}

console.error(`\n❌ responsive-guard：揾到 ${problems.length} 處 375px 爆版風險\n`)
for (const p of problems) {
  console.error(`  ${p.at}`)
  console.error(`    [${p.rule}] ${p.detail}`)
  console.error(`    → ${p.fix}\n`)
}
console.error('375px = iPhone SE / iPhone 8，仍然係香港中學生手上最常見嘅細機之一。\n')
process.exit(1)
