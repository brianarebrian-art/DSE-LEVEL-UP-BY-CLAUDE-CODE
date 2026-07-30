#!/usr/bin/env node
/**
 * ink-faint → ink-muted 收窄遷移（2026-07-30，Brian 拍板選項 (b)）
 *
 * 背景：Light 主題 `--color-ink-faint` = #9CA3AF，對比只有 2.43:1，遠低於
 * WCAG AA 內文 4.5:1。曾考慮直接暗化 token（選項 a），但要達 4.5 就要暗到
 * 約 #6E7480，同 ink-muted 幾乎一樣，等於淺色主題容納唔到三層灰。
 *
 * 故採選項 (b)：**收窄用途**。token 值不動，但只准留喺 WCAG 1.4.3 明文豁免
 * 嘅兩類位置，其餘一律遷去 ink-muted：
 *   (a) inactive user interface component —— 停用／禁按狀態
 *   (b) 純裝飾圖形（aria-hidden，唔帶資訊）
 *
 * 判斷標準（保守原則，有懷疑就當資訊性）：如果學生**必須讀到**呢段字先明白
 * 內容或知道點操作，就係資訊性 → ink-muted。時間戳、題數、metadata、提示
 * 文案、輸入框 placeholder 全部屬資訊性。
 *
 * 可重複執行（idempotent）：跑幾次結果一樣。
 * 用法：node scripts/inkfaint-migrate.mjs [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const DRY = process.argv.includes('--dry')

/** 逐行豁免。key = 檔案路徑，值 = 該行必須包含嘅特徵字串（防止行號漂移改錯行）。 */
const EXEMPT = [
  // (a) 停用狀態控件 —— WCAG 1.4.3 "Incidental: inactive user interface component"
  { file: 'components/PracticeSupport.tsx', match: 'disabled:text-ink-faint', n: 2, why: '字體縮放掣到頂／到底時嘅停用態' },
  { file: 'app/practice/PracticeSession.tsx', match: 'cursor-not-allowed', n: 1, why: '鎖死期間禁按嘅下一題掣' },
  // (b) 純裝飾圖形 —— aria-hidden，唔帶任何資訊
  { file: 'app/waiting/page.tsx', match: 'aria-hidden', n: 1, why: '放榜等候頁裝飾人形圖示，文字已另列' },
]
const EXPECT_KEPT = EXEMPT.reduce((s, e) => s + e.n, 0)

const files = execSync(
  "grep -rl 'ink-faint' --include='*.tsx' app components",
  { encoding: 'utf8', cwd: process.cwd() }
)
  .trim()
  .split('\n')
  .filter(Boolean)

let changed = 0
let kept = 0
const report = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  let fileChanged = 0

  const exemptions = EXEMPT.filter((e) => e.file === file)

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('ink-faint')) continue
    const ex = exemptions.find((e) => lines[i].includes(e.match))
    if (ex) {
      kept++
      report.push(`  保留 ${file}:${i + 1} — ${ex.why}`)
      continue
    }
    // 基礎色由 faint 升去 muted 之後，原本 hover 去 muted 就冇分別，順手升一級
    lines[i] = lines[i]
      .replace(/hover:text-ink-muted/g, 'hover:text-ink-soft')
      .replace(/ink-faint/g, 'ink-muted')
    fileChanged++
  }

  if (fileChanged) {
    changed += fileChanged
    report.push(`✎ ${file} — ${fileChanged} 行`)
    if (!DRY) writeFileSync(file, lines.join('\n'))
  }
}

console.log(report.join('\n'))
console.log(`\n${DRY ? '[乾跑] ' : ''}遷移 ${changed} 行；按 WCAG 1.4.3 豁免保留 ${kept} 行。`)
if (kept !== EXPECT_KEPT) {
  console.error(`⚠️ 預期保留 ${EXPECT_KEPT} 行，實際 ${kept} 行 —— 豁免清單同代碼已脫節，請人手核對。`)
  process.exit(1)
}
