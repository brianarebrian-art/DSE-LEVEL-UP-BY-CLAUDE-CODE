// ============================================================================
// theme-migrate.mjs — 將硬編色值改為語意主題 token（一次性遷移工具，可重複執行）
// ----------------------------------------------------------------------------
// 背景：Tailwind v4 的 arbitrary value（`bg-[#FAFAF8]`）會編譯成字面色碼，
// CSS 變數蓋唔到，所以主題切換必須改 call site。本腳本做機械替換部分。
//
// 為何機械替換係安全的（已實測）：每個色值喺本專案只對應一個「顏色角色」，
// 而 Tailwind 前綴（bg-／text-／border-）本身已帶屬性語義。所以
// `text-[#008B84]` → `text-accent`、`bg-[#008B84]` → `bg-accent` 兩者都正確。
//
// 本腳本【不處理】的部分（必須人手判斷）：
//   `text-white` 落強調色底 —— cyber 下強調色變淺青，白字對比只有 1.40:1，
//   等同睇唔到。此類需逐個改為 `text-on-accent`，見 --report。
//
// 用法：
//   node scripts/theme-migrate.mjs            # dry-run，只報告
//   node scripts/theme-migrate.mjs --write    # 實際寫入
//   node scripts/theme-migrate.mjs --report   # 只列出需人手處理的位置
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const WRITE = process.argv.includes('--write')
const REPORT_ONLY = process.argv.includes('--report')

// ── 排除清單 ────────────────────────────────────────────────────────────────
// ① app/relax/** —— 呼吸空間本身就係刻意的深色房間（減壓設計），兩個主題下
//    都應該維持深色，唔可以當「淺色頁」遷移。其專屬色值 #14141B／#0A0A0F／
//    #E8E8EC／#C2C2CC 只出現喺此處。
// ② 導出鎖色組件 —— html2canvas 匯出的圖卡必須用固定標準色，唔跟使用者主題走
//    （見 globals.css 檔首說明）。跟主題變會令匯出的 PNG 每次唔同色。
const EXCLUDE = [
  /^app\/relax\//,
  /^components\/DailyStatsCard\.tsx$/,
  /^components\/ErrorRadar\.tsx$/,
  /^components\/DailySpectrum\.tsx$/,
  /^app\/dashboard\/report\//,
]

// ── 色值 → token 映射 ───────────────────────────────────────────────────────
// 每個 cyber 對應值都經 WCAG 對比度實測（vs 底 #0B1120），數字見 globals.css。
const MAP = {
  // 面（背景）
  '#FAFAF8': 'surface', '#FDFCF8': 'surface', '#FDFBF8': 'surface', '#F7F7F3': 'surface',
  '#F5F5F0': 'surface-sunken', '#EDEDE8': 'surface-sunken',
  // 墨（文字）
  '#1A1A1A': 'ink',
  '#2D2D2D': 'ink-soft', '#4A4A4A': 'ink-soft',
  '#6B6B6B': 'ink-muted', '#8A8A8A': 'ink-muted',
  '#9CA3AF': 'ink-faint', '#8B8B96': 'ink-faint',
  // 強調（青）
  '#008B84': 'accent', '#00A8A0': 'accent', '#00877F': 'accent',
  '#00726C': 'accent-strong', '#00635E': 'accent-strong', '#128C7E': 'accent-strong', '#0E6F64': 'accent-strong',
  '#005F5A': 'accent-hover',
  // 金（提示／年份／次要標記）
  '#B8860B': 'gold', '#D4A017': 'gold-soft', '#8A6608': 'gold-strong',
  // 紫（課題／框架標記）
  '#7C3AED': 'violet', '#6D28D9': 'violet-strong',
  // 玫（提醒；憲章禁大紅，故用柔和玫紅）
  '#C2185B': 'rose', '#9D1449': 'rose-strong', '#A01450': 'rose-strong',
}

const files = execSync('git ls-files app components', { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /\.(tsx|ts)$/.test(f))
  .filter((f) => !EXCLUDE.some((re) => re.test(f)))

let touched = 0, total = 0
const perFile = []

for (const f of files) {
  const src = readFileSync(f, 'utf8')
  let out = src, n = 0
  for (const [hex, token] of Object.entries(MAP)) {
    // 大小寫都要處理（源檔混用），只換 Tailwind arbitrary value 形式，
    // 唔會誤中 inline style 或 SVG attribute 內的裸色碼。
    for (const h of [hex, hex.toLowerCase()]) {
      const re = new RegExp(`(\\b[a-z-]+)-\\[${h.replace('#', '#')}\\]`, 'g')
      out = out.replace(re, (m, prop) => { n++; return `${prop}-${token}` })
    }
  }
  if (n) { perFile.push([f, n]); touched++; total += n; if (WRITE && !REPORT_ONLY) writeFileSync(f, out) }
}

if (!REPORT_ONLY) {
  console.log(`\n${'═'.repeat(66)}`)
  console.log(`  theme-migrate ${WRITE ? '（已寫入）' : '（dry-run，未改動）'}`)
  console.log(`${'═'.repeat(66)}`)
  perFile.sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([f, n]) => console.log(`  ${String(n).padStart(4)}  ${f}`))
  if (perFile.length > 15) console.log(`  … 另有 ${perFile.length - 15} 個檔案`)
  console.log(`  合計：${total} 處，${touched} 個檔案`)
}

// ── 需人手判斷：白字落強調色底 ──────────────────────────────────────────────
const ACCENT_BG = /bg-(accent|accent-strong|accent-hover)\b|bg-\[#00(8B84|726C|5F5A|A8A0|635E|877F)\]/i
const hand = []
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/text-white/.test(line) && ACCENT_BG.test(line)) hand.push(`${f}:${i + 1}`)
  })
}
console.log(`\n  ⚠️ 需人手改為 text-on-accent（白字落強調色底，cyber 下 1.40:1）：${hand.length} 處`)
hand.slice(0, 40).forEach((h) => console.log(`     ${h}`))
if (hand.length > 40) console.log(`     … 另有 ${hand.length - 40} 處`)
console.log()
