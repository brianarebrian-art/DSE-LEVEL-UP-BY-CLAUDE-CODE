#!/usr/bin/env node
// ============================================================================
// emoji-guard.mjs —— 全站禁止 emoji 入學生可見文案／UI（2026-10-30）
// ----------------------------------------------------------------------------
// 產品規則（.cursor/rules/no-emoji.mdc）：網站任何地方唔准用 emoji；
// 圖案必須係原創 mark／SVG（components/marks、專案內 icons），唔好用 emoji 套件／CDN。
// 掃 app/ · components/ · lib/ 嘅字串字面值同 JSX 文字（剝註釋，同 copy-guard）。
// 題庫 data/questions 唔掃（frameworkEmoji 欄位仍存，但 UI 禁止渲染 —— 見下方 JSX 規則）。
// ============================================================================
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
// data/heroContent 等會直接上畫面；題庫／offSyllabus 卡 emoji 欄位靠 JSX 規則禁渲染。
const SCAN_DIRS = ['app', 'components', 'lib']
const SCAN_FILES = ['data/heroContent.ts']

// Same ranges as lib/stripEmoji.ts (keep in sync).
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}\u{200D}\u{20E3}]/u
const DINGBAT_RE =
  /[⚠✅❌✓✔✖★☆☀☁⚡✨⭐🔥💡📌📍🌱🎓📚🧠💬🙌👏🎯🚀🔢📐⚗️🧬📝📖🕊🔄✍🔍🧮🔖🧭🫂🫁🎧🎹🌧🧘⏳🔇🌬👥📷📸🌙📘📄⏸▶►◀]/u

const JSX_EMOJI_FIELD_RE =
  /\{\s*(?:[A-Za-z0-9_?.[\]]+\.)?(?:frameworkEmoji|emoji)\s*\}/

const files = []
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.') || e.name === '__tests__') continue
    const p = join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(p) && !/\.test\./.test(p)) files.push(p)
  }
}
for (const d of SCAN_DIRS) walk(join(ROOT, d))
for (const f of SCAN_FILES) files.push(join(ROOT, f))

function studentVisibleLines(src) {
  const out = []
  const noComments = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length))
  noComments.split('\n').forEach((line, i) => {
    const bits = []
    for (const m of line.matchAll(
      /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g,
    )) {
      bits.push(m[1] ?? m[2] ?? m[3] ?? '')
    }
    // JSX text nodes between tags: >emoji<
    for (const m of line.matchAll(/>([^<{]+)</g)) bits.push(m[1])
    if (bits.some((b) => EMOJI_RE.test(b) || DINGBAT_RE.test(b))) out.push({ line: i + 1, sample: line.trim().slice(0, 120) })
    if (JSX_EMOJI_FIELD_RE.test(line)) out.push({ line: i + 1, sample: line.trim().slice(0, 120), kind: 'field' })
  })
  return out
}

const findings = []
for (const f of files) {
  // stripEmoji.ts itself documents the ranges — skip.
  if (f.endsWith(`${join('lib', 'stripEmoji.ts')}`) || f.endsWith('lib/stripEmoji.ts')) continue
  const hits = studentVisibleLines(readFileSync(f, 'utf8'))
  for (const h of hits) findings.push({ file: relative(ROOT, f), ...h })
}

const BAR = '─'.repeat(70)
if (findings.length === 0) {
  console.log(`\n${BAR}\n  EMOJI GUARD PASSED —— 學生可見文案／UI 冇 emoji。\n${BAR}\n`)
  process.exit(0)
}

console.log(`\n發現 ${findings.length} 處 emoji／pictograph（網站嚴禁，見 .cursor/rules/no-emoji.mdc）：\n`)
for (const f of findings) {
  const tag = f.kind === 'field' ? ' [JSX .emoji/.frameworkEmoji]' : ''
  console.log(`  ${f.file}:${f.line}${tag}\n    ${f.sample}\n`)
}
console.log('修法：刪走 emoji；圖案改用 components/marks/* 或專案內原創 SVG。唔好加豁免。\n')
process.exit(1)
