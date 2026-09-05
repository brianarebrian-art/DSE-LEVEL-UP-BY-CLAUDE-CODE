#!/usr/bin/env node
// ============================================================================
// copy-guard.mjs —— 情緒安全文案閘（BUILD-SPEC §5.1）
// ----------------------------------------------------------------------------
//   node scripts/copy-guard.mjs
//
// 守憲章 §7「大愛設計紅線」：學生睇到嘅字入面唔可以有打擊自信嘅講法。
//
// ── 範圍：只掃【學生睇到嘅字串】────────────────────────────────────────────
// 掃 app/ components/ lib/ 入面嘅字串字面值同 JSX 文字。
// 【唔掃】註釋、識別符、`data/questions/` 同 `data/sensei/`。
//
// 三個排除各有理由，唔係為咗令個閘易過：
//
//   註釋   —— 學生睇唔到。而且實測最諷刺嗰個命中係
//             components/GoodTodayCard.tsx:39 一句註釋：
//             「講「你唔係差」本身已經令人諗起「差」。改為只講自己嗰條線」
//             —— 一句記錄緊點樣小心處理措辭嘅註釋，會被個閘攔住。
//
//   識別符 —— `MAX_FAILS`、`fail_count` 係推送通知嘅失敗計數，
//             「FAIL-OPEN by design」係工程術語。同學生無關。
//
//   題庫   —— 學科內容有自己一套規制（term-guard ＋ 覆核管線 ＋ 實名簽署）。
//             一條會計題講「流動性較差的一項」、一條統計題講
//             "expected number of FAILURES"、一條中文卷二講「一份略去這些的
//             報告，是不合格的報告」—— 三句講嘅都係【一件事物】唔係一個學生。
//             用情緒文案嘅尺去度學科內容，會逼人改到啲題目唔準確。
//
// ── 捉句式，唔捉字 ────────────────────────────────────────────────────────
// 2026-09-05 實測：「差」呢隻字全站出現 720 次，當中 582 次係題目解析
// （差值、兩者之差、流動性較差）、30 次係學科術語（標準差、等差數列、誤差）、
// 96 次係註釋。真正涉及情緒語境嘅得 9 次，而嗰 9 次【全部】係刻意寫嚟保護
// 學生嘅句子（「狀態差都嚟到，呢樣嘢好多人做唔到。」「數字細咗唔等於你差咗」）。
//
// 即係話：禁「差」呢隻字，第一批被刪嘅就係個閘想製造嘅嘢。
// 所以下面每一條都係【句式】—— 主語係學生、而且係貶損。
// （Brian 2026-09-05 裁決：「差」由禁詞表剷走。）
// ============================================================================
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SCAN = ['app', 'components', 'lib']

const BANNED = [
  // Brian 2026-09-05 指定嘅七條
  { re: /\bFAIL\b/,        why: '憲章 §7 明文禁「FAIL」字眼', fix: '「再諗下💡」／「你發現咗一個新盲點」' },
  { re: /不合格/,           why: '及格／不及格係一個判決，唔係一個可行動嘅目標', fix: '講返差幾多分到目標等級' },
  { re: /低分/,             why: '將學生歸類落一個分數帶', fix: '講返邊個課題可以補' },
  { re: /你錯咗/,           why: '第二人稱 ＋ 判決', fix: '「你發現咗一個新盲點」' },
  { re: /第幾名/,           why: '排名＝跨用戶比較（憲章 §16.E 約束 3）', fix: '只同自己上一次比' },
  { re: /你落後/,           why: '製造追趕焦慮', fix: '「再做 N 題就夠」' },
  { re: /再唔溫書/,         why: '威嚇語氣', fix: '乜都唔顯示 —— 冇做題唔需要提醒' },
  // 句式（唔係單字）—— 主語係學生、而且係貶損
  { re: /你(好|真係|實在)?(差|弱|唔掂)/, why: '直接貶損學生', fix: '講返具體邊一步卡住' },
  { re: /表現(好)?差/,      why: '對人唔對事', fix: '講返邊個課題、邊種錯因' },
  { re: /你(唔|未)夠班/,    why: '「唔夠班」＝能力判決', fix: '「呢題係 5** 級，慢慢嚟冇問題」' },
]

const files = []
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.') || e.name === '__tests__') continue
    const p = join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(p) && !/\.test\./.test(p)) files.push(p)
  }
}
for (const d of SCAN) walk(join(ROOT, d))

// 剝走註釋，然後淨係攞字串字面值同 JSX 文字。
function studentVisible(src) {
  const out = []
  const noComments = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length))
  noComments.split('\n').forEach((line, i) => {
    const bits = []
    for (const m of line.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g)) {
      bits.push(m[1] ?? m[2] ?? m[3] ?? '')
    }
    for (const m of line.matchAll(/>([^<>{}]+)</g)) bits.push(m[1])
    if (bits.length) out.push({ n: i + 1, text: bits.join(' ⏐ '), raw: line.trim() })
  })
  return out
}

// ── 否定語境放行 ──────────────────────────────────────────────────────────
// 首次跑呢個閘就捉到 components/PersonalTimeline.tsx：
//     「永遠只同你自己上一段時間比。數字細咗【唔等於】你差咗 ——
//       考試週、病咗、屋企有事，全部都住喺呢啲數入面。」
// 句式「你差咗」中招，但成句係【否定】—— 佢正正就係喺度拆穿呢個聯想。
// 冇呢層檢查，個閘第一個刪嘅就係佢想製造嘅嘢。
//
// 同樣手法喺 components/CommandWordText 用過（負向斷言防「消除了／所有權」
// 誤亮）—— 中文冇詞界，靠單向 regex 一定會咬錯，呢個係已知模式。
const NEGATION = /(唔等於|唔係|並非|唔會|從來唔|一啲都唔|does not mean|doesn['’]t mean|is not)/
const near = (text, idx) => text.slice(Math.max(0, idx - 24), idx)

const hits = []
for (const f of files) {
  for (const { n, text, raw } of studentVisible(readFileSync(f, 'utf8'))) {
    for (const b of BANNED) {
      const m = b.re.exec(text)
      if (!m) continue
      if (NEGATION.test(near(text, m.index))) continue // 否定句，放行
      hits.push({ f: relative(ROOT, f), n, raw, b })
    }
  }
}

const line = '─'.repeat(70)
console.log(`\n${line}\n  copy-guard —— 情緒安全文案（憲章 §7 · BUILD-SPEC §5.1）\n${line}`)
if (!hits.length) {
  console.log(`  ✅ COPY GUARD PASSED —— 掃咗 ${files.length} 個檔嘅學生可見文案，${BANNED.length} 條句式全部零命中。`)
  console.log(`${line}\n`)
  process.exit(0)
}
for (const h of hits) {
  console.log(`\n  ❌ ${h.f}:${h.n}`)
  console.log(`     ${h.raw.length > 110 ? h.raw.slice(0, 110) + '…' : h.raw}`)
  console.log(`     點解：${h.b.why}`)
  console.log(`     改成：${h.b.fix}`)
}
console.log(`\n  ${hits.length} 處。憲章 §7：唔准出現打擊自信嘅元素。\n${line}\n`)
process.exit(1)
