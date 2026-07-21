#!/usr/bin/env node
/**
 * i18n-guard —— 全站雙語完整度自動閘（Kelly/QA + Arthur/英文科）。
 *
 * 目的：揪出「寫死、唔跟語言切換」嘅使用者可見文字。DSE Level Up 用 React context
 * 做 i18n（dictionary[locale] + `en ? 'EN' : '中'` + `tr(zh, en)`），所以任何一句
 * CJK 字串如果冇對應英文構造，切去英文版時就會卡住唔變 —— 呢個 script 專門捉呢種漏網。
 *
 * 用法：node scripts/i18n-guard.mjs
 * 退出碼：發現漏譯 = 1（可用作 CI／qa 閘）；乾淨 = 0。
 *
 * 偵測範圍：app/ + components/ 下所有 .tsx。會先剝走註解（大量中文註解係正常，唔算漏譯）。
 * 一行 CJK 若含以下任一翻譯訊號即當「已配對」而略過：
 *   en 三元、tr(、locale、? '…'、: '…'、'en'、t.（字典取值）。
 * 已知限制：只捉「字面量」漏譯；由 data 傳入嘅中文變量（如 subject.short）需另行人手核。
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOTS = ['app', 'components']
// CJK 統一表意文字 + 擴展A + CJK標點（、。「」）+ 全形標點／字母（！？，：）
const CJK = /[㐀-鿿　-〿！-｠￠-￮]/
// 視窗（該行 + 前兩行）內若出現以下任一，代表 CJK 已同英文配對（跟 locale 切換），略過。
// 睇前兩行係為咗處理多行三元：`locale === 'en'` / `en ?` 通常喺 CJK 那行之上。
const SIGNAL = /(^|[^A-Za-z])en([^A-Za-z]|$)|\blocale\b|\btr\(|['"`]en['"`]|\bt\.[a-zA-Z]|[A-Za-z]*(?:En|Zh|en|zh)\s*:/

// 由 CJK 行向上搜尋（同一表達式區塊內，遇空行即停），搵到翻譯訊號即當已配對。
// 咁樣可以正確辨認多行三元（`points: en ? [ …en… ] : [ …中… ]`），
// 同時唔會漏捉由空行分隔嘅孤立中文區塊（大部分真·漏譯都係咁）。
function signalNearby(lines, i) {
  for (let j = i; j >= 0 && j >= i - 15; j--) {
    if (j < i && /^\s*$/.test(lines[j])) break
    if (SIGNAL.test(lines[j])) return true
  }
  return false
}

// 剝註解時「保留行數」（區塊註解換成同量空白），令回報行號準確。
function stripComments(src) {
  src = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')) // 區塊註解 → 空白（保留 \n）
  src = src.replace(/^([ \t]*)\/\/[^\n]*$/gm, '$1') // 整行註解（行首 //）
  src = src.replace(/([^:"'`\\])\/\/[^\n]*/g, '$1') // 行尾註解（避免切到 http://）
  src = src.replace(/^(\s*)\*.*$/gm, '$1') // JSDoc 星號行
  return src
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!/node_modules|__tests__|\.next/.test(p)) walk(p, out)
    } else if (/\.tsx$/.test(p)) {
      out.push(p)
    }
  }
  return out
}

const flags = []
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const raw = fs.readFileSync(file, 'utf8')
    const rawLines = raw.split('\n')
    const lines = stripComments(raw).split('\n')
    lines.forEach((line, i) => {
      if (!CJK.test(line)) return
      if (/i18n-exempt/.test(rawLines[i] ?? '')) return // 明確標註的例外（SEO meta、特定語言考試內容）
      if (signalNearby(lines, i)) return
      flags.push({ file, line: i + 1, text: line.trim().slice(0, 120) })
    })
  }
}

if (flags.length === 0) {
  console.log('✅ i18n-guard：0 漏譯，全站 UI 文字均跟隨語言切換。')
  process.exit(0)
}

console.log(`❌ i18n-guard：發現 ${flags.length} 處可疑漏譯（寫死、無英文對照）：\n`)
let cur = ''
for (const f of flags) {
  if (f.file !== cur) {
    cur = f.file
    console.log(`\n── ${f.file} ──`)
  }
  console.log(`  L${f.line}: ${f.text}`)
}
console.log(`\n合共 ${flags.length} 處。修好後再跑一次應為 0。`)
process.exit(1)
