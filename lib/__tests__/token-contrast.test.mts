// ============================================================================
// token-contrast.test.mts —— 語意 token 對比度鎖（WCAG AA）
// ----------------------------------------------------------------------------
// 2026-09-11。目標書第 5 項：「所有卡片…於淺色及 data-theme='cyber' 下
// 文本與背景對比度全數通過 WCAG AA（≥ 4.5:1）」。
//
// ══ 點解要多一個閘，scripts/contrast-guard.mjs 唔夠 ══
// contrast-guard 掃嘅係【寫死嘅 Tailwind 色階】（text-slate-300 之類），
// 專捉 light-first 遷移漏網。但 JustOneCard 同 /result 兩張卡【零】處寫死色階
// —— 佢哋全部用語意 token（text-ink-muted、bg-surface-raised…）。
// 即係話呢兩張卡對 contrast-guard 完全隱形：
// 有人喺 globals.css 調淺 --color-ml-ink-soft 一個字，
// 全站用 text-ink-muted 嘅地方一齊跌穿 AA，而冇一個測試會紅。
//
// 2026-09-11 實測確認咗呢個缺口係真嘅：兩張卡八對顏色，冇一對受任何閘保護。
//
// ══ 呢個測試點解可信 ══
// 一個「自己解析 CSS、自己計、自己話自己啱」嘅測試冇價值 —— 解析器行錯
// 串聯（cascade）嗰陣，佢只會鎖住一組產品根本冇用嘅值，然後永遠綠。
// globals.css 正正有呢個陷阱：淺色值嚟自【第二個裸 :root】(line 353) 覆寫
// @theme (line 13)，天真咁抓第一個 :root 會攞到一組已經唔生效嘅色。
// scripts/contrast-guard.mjs 檔頭就記低過同一個病（對住一個唔再存在嘅
// --color-surface 計咗一段時間）。
//
// 所以測試 ① 係【錨】：解析器嘅輸出必須逐個字等於 2026-09-11 喺
// localhost:3001 用 getComputedStyle 實測返嚟嘅值。解析器行錯串聯，錨即刻紅。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')
const CSS = readFileSync(join(ROOT, 'app', 'globals.css'), 'utf8')

// ── CSS 解析 ────────────────────────────────────────────────────────────────
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '')

/** 抽出 selector 完全相符嘅所有頂層 block 內容（按文件次序）。 */
function blocks(css: string, selector: string): string[] {
  const out: string[] = []
  const clean = stripComments(css)
  let i = 0
  while (i < clean.length) {
    const open = clean.indexOf('{', i)
    if (open === -1) break
    const sel = clean.slice(i, open).trim().split(/[\n;}]/).pop()!.trim()
    // 數括號揾配對嘅 }
    let depth = 1, j = open + 1
    while (j < clean.length && depth > 0) {
      if (clean[j] === '{') depth++
      else if (clean[j] === '}') depth--
      j++
    }
    if (sel === selector) out.push(clean.slice(open + 1, j - 1))
    i = j
  }
  return out
}

function declsOf(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) out[m[1]] = m[2].trim()
  return out
}

/** 後定義者勝（同一 scope 內嘅文件次序）。 */
function scopeTokens(selectors: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const sel of selectors) for (const b of blocks(CSS, sel)) Object.assign(out, declsOf(b))
  return out
}

function resolve(raw: Record<string, string>, name: string, seen = new Set<string>()): string {
  const v = raw[name]
  if (v === undefined) throw new Error(`token ${name} 喺呢個 scope 冇定義`)
  const m = v.match(/^var\(\s*(--[\w-]+)\s*\)$/)
  if (!m) return v.toUpperCase()
  if (seen.has(name)) throw new Error(`token ${name} var() 循環參照`)
  seen.add(name)
  return resolve(raw, m[1], seen)
}

// 淺色 = @theme + 裸 :root（文件次序，後者覆寫前者）
const LIGHT_RAW = scopeTokens(['@theme', ':root'])
// 暗色 = 淺色再疊 cyber scope
const CYBER_RAW = { ...LIGHT_RAW, ...scopeTokens([":root[data-theme='cyber']"]) }

const tok = (raw: Record<string, string>, short: string) => resolve(raw, `--color-${short}`)

// ── 對比度 ──────────────────────────────────────────────────────────────────
function rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as [number, number, number]
}
const lin = (c: number) => (c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
const lum = (hex: string) => { const [r, g, b] = rgb(hex); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) }
function contrast(fg: string, bg: string): number {
  const a = lum(fg), b = lum(bg)
  return +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2))
}

// ── ① 錨：解析器必須重現瀏覽器實測值 ────────────────────────────────────────
// 來源：2026-09-11 localhost:3001 /dashboard，getComputedStyle(documentElement)
// 逐個 --color-* 讀出。呢啲唔係從 CSS 抄落嚟嘅 —— 係瀏覽器行完成個串聯之後
// 嘅結果。解析器同佢對得上，先代表下面嘅比值講緊真實畫面。
const MEASURED = {
  light: {
    surface: '#F4F0EA', 'surface-raised': '#FFFDF9', 'surface-sunken': '#F0EBE3',
    ink: '#2C2A29', 'ink-soft': '#3D3A38', 'ink-muted': '#69635F',
    accent: '#57685C', 'accent-strong': '#57685C', 'on-accent': '#FFFFFF',
  },
  cyber: {
    surface: '#1A1917', 'surface-raised': '#252422', 'surface-sunken': '#2F2E2C',
    ink: '#F0E8DC', 'ink-soft': '#C1BAB0', 'ink-muted': '#A8A095',
    accent: '#7A9E7E', 'accent-strong': '#7A9E7E', 'on-accent': '#1A1917',
  },
} as const

test('① 解析器重現 2026-09-11 瀏覽器實測嘅 token 值', () => {
  for (const [theme, raw] of [['light', LIGHT_RAW], ['cyber', CYBER_RAW]] as const) {
    for (const [short, want] of Object.entries(MEASURED[theme])) {
      assert.equal(
        tok(raw, short), want,
        `${theme} --color-${short}：解析得 ${tok(raw, short)}，實測係 ${want}。\n` +
        `兩者唔同代表解析器行錯 CSS 串聯（最常見：抓咗 @theme 而唔係後面覆寫嘅 :root），\n` +
        `或者 globals.css 真係改咗值。改咗值就重新喺 localhost:3001 量過再更新 MEASURED。`,
      )
    }
  }
})

// ── ② 卡片實際用到嘅顏色對 ──────────────────────────────────────────────────
// 每一對都係從組件原始碼讀返嚟嘅 className 組合，唔係估。
type Pair = { 卡: string; 項: string; fg: string; bg: string; 最低: number }
const PAIRS: Pair[] = [
  // components/JustOneCard.tsx
  { 卡: 'JustOneCard', 項: '標題 text-ink / bg-surface-raised', fg: 'ink', bg: 'surface-raised', 最低: 4.5 },
  { 卡: 'JustOneCard', 項: '說明文 text-ink-muted / bg-surface-raised', fg: 'ink-muted', bg: 'surface-raised', 最低: 4.5 },
  { 卡: 'JustOneCard', 項: '行動掣 text-on-accent / bg-accent-strong', fg: 'on-accent', bg: 'accent-strong', 最低: 4.5 },
  // 圖示係 aria-hidden 裝飾，WCAG 1.4.11 非文字準則 3:1（1.4.3 明文豁免裝飾）
  { 卡: 'JustOneCard', 項: '圖示 text-accent / bg-surface-raised（非文字）', fg: 'accent', bg: 'surface-raised', 最低: 3.0 },
  // app/result/ResultPageClient.tsx —— 聽日有嘢等你
  { 卡: '聽日有嘢等你', 項: '標題 text-ink / bg-surface-raised', fg: 'ink', bg: 'surface-raised', 最低: 4.5 },
  { 卡: '聽日有嘢等你', 項: '遺忘曲線說明 text-ink-muted / bg-surface-raised', fg: 'ink-muted', bg: 'surface-raised', 最低: 4.5 },
  { 卡: '聽日有嘢等你', 項: '課題標籤 text-ink-soft / bg-surface-sunken', fg: 'ink-soft', bg: 'surface-sunken', 最低: 4.5 },
  // app/result/ResultPageClient.tsx —— 發現卡（DiscoveryStrip）
  { 卡: '發現卡', 項: '標題 text-ink / bg-surface-raised', fg: 'ink', bg: 'surface-raised', 最低: 4.5 },
  { 卡: '發現卡', 項: '已作答句 text-ink-muted / bg-surface-raised', fg: 'ink-muted', bg: 'surface-raised', 最低: 4.5 },
  { 卡: '發現卡', 項: '發現項目 text-ink-soft / bg-surface-raised', fg: 'ink-soft', bg: 'surface-raised', 最低: 4.5 },
  // 2026-09-11：呢一行本來係 text-ink-faint（2.49 / 2.36），由測試 ④ 捉到。
  { 卡: '發現卡', 項: '維度名 text-ink-muted / bg-surface-raised', fg: 'ink-muted', bg: 'surface-raised', 最低: 4.5 },
]

test('② 兩張卡喺淺色同 cyber 兩個主題都過 WCAG AA', () => {
  const fails: string[] = []
  for (const [theme, raw] of [['light', LIGHT_RAW], ['cyber', CYBER_RAW]] as const) {
    for (const p of PAIRS) {
      const r = contrast(tok(raw, p.fg), tok(raw, p.bg))
      if (r < p.最低) fails.push(`${theme} · ${p.卡} · ${p.項} = ${r}（要 ≥ ${p.最低}）`)
    }
  }
  assert.deepEqual(fails, [], `對比度跌穿 AA：\n${fails.join('\n')}`)
})

// ── ③ 防止 PAIRS 靜靜哋過時 ─────────────────────────────────────────────────
// 測試 ② 嘅弱點：佢淨係計顏色，唔知卡仲用唔用緊嗰啲 class。
// 有人將 text-ink-muted 改做 text-ink-faint（2.49，遠低於 AA），
// 測試 ② 照樣綠 —— 因為佢仲喺度計緊一對已經冇人用嘅顏色。
// 所以要反過嚟釘死：組件原始碼必須仲有呢啲 class。
const USES: Record<string, string[]> = {
  'components/JustOneCard.tsx': ['bg-surface-raised', 'text-ink', 'text-ink-muted', 'text-accent', 'bg-accent-strong', 'text-on-accent'],
  'app/result/ResultPageClient.tsx': ['bg-surface-raised', 'text-ink', 'text-ink-muted', 'text-ink-soft', 'bg-surface-sunken'],
}

test('③ 組件仍然用緊 PAIRS 所假設嘅 class', () => {
  const missing: string[] = []
  for (const [file, classes] of Object.entries(USES)) {
    const src = readFileSync(join(ROOT, file), 'utf8')
    for (const c of classes) {
      // 前後要係 class 邊界，唔好畀 text-ink 撞中 text-ink-muted
      if (!new RegExp(`[\\s"'\`]${c}[\\s"'\`]`).test(src)) missing.push(`${file} 揾唔到 ${c}`)
    }
  }
  assert.deepEqual(missing, [],
    `PAIRS 已經同組件脫節：\n${missing.join('\n')}\n` +
    `class 改咗就要同步更新 PAIRS，否則測試 ② 會計緊一對冇人用嘅顏色而永遠綠。`)
})

// ── ④ ink-faint 唔准做正文 ──────────────────────────────────────────────────
// globals.css 兩處都明文標住 ink-faint 只准用於停用控件／aria-hidden 裝飾
// （light 2.49、cyber 2.36，兩個都遠低於 AA）。呢個約束只寫喺註釋度，
// 冇任何嘢執行緊 —— 對一個趕住搵個「淡啲嘅灰」嘅人嚟講，佢就係下一個選擇。
test('④ 兩張卡冇用 text-ink-faint 做文字', () => {
  for (const file of Object.keys(USES)) {
    const src = readFileSync(join(ROOT, file), 'utf8')
    assert.ok(!/[\s"'`]text-ink-faint[\s"'`]/.test(src),
      `${file} 用咗 text-ink-faint —— 佢喺兩個主題分別得 2.49 / 2.36，` +
      `只准用於停用控件同 aria-hidden 裝飾（見 globals.css）。`)
  }
})
