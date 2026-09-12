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
import { readFileSync, readdirSync, statSync } from 'node:fs'
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

// ── ⑤ ink-faint 只准用於停用控件同 aria-hidden 裝飾 ─────────────────────────
// globals.css 兩處都明文寫住呢條限制（light 2.49–2.91、cyber 2.36–2.70，
// 全部遠低於 AA），但一直只係註釋，冇任何嘢執行緊。
//
// 2026-09-12 掃全站捉到四處真違規，全部係學生要讀嘅內容：
//   · BreathingExercise 嘅哮喘安全提示 —— 一個哮喘學生喺呼吸練習度
//     睇唔清嗰句講緊佢自己嘅提示，就等於冇提示過
//   · PrivacyConsentGate 通往完整私隱政策嘅連結（Link 繼承 p 嘅顏色）
//   · BreathingExercise 嘅語音回退說明
//   · PersonalTimeline 嘅對照數字
// 四處已改 ink-muted。
//
// 判斷準則：同一行有 `aria-hidden` 或 `disabled:` 即視為正當（裝飾／停用態）。
// 其餘一律要喺下面嘅基線之內 —— 呢個係 _gate.mjs `SHAPE_BASELINE` 同一個做法：
// 祖父清單之內嘅舊碼豁免，新碼一律要過。修法係改用 ink-muted，唔係加基線。
const FAINT_BASELINE: Record<string, number> = {
  // relax 嘅「未啟用狀態」切換 —— 語義上就係停用控件，屬 globals.css 准許範圍，
  // 只係寫法上冇 `disabled:` 前綴（佢哋係三元運算而唔係 CSS variant）。
  'app/relax/components/BreathingExercise.tsx': 1,
  'app/relax/components/GroundingExercise.tsx': 1,
  // 管理員內部工具，唔係學生介面。數字密集嘅表格用最淡一階係合理取捨，
  // 但仍然計入基線，令佢只可以減唔可以加。
  'components/admin/UserOverview.tsx': 16,
}

test('⑤ text-ink-faint 只用於裝飾／停用態，其餘不得超出基線', () => {
  const found: Record<string, number> = {}
  const offenders: string[] = []
  const walk = (d: string) => {
    for (const e of readdirSync(join(ROOT, d))) {
      const rel = `${d}/${e}`
      if (statSync(join(ROOT, rel)).isDirectory()) {
        if (!/node_modules|__tests__|\.next/.test(rel)) walk(rel)
      } else if (rel.endsWith('.tsx')) {
        readFileSync(join(ROOT, rel), 'utf8').split('\n').forEach((ln, i) => {
          if (!ln.includes('text-ink-faint')) return
          if (/aria-hidden|disabled:/.test(ln)) return      // 裝飾／停用態，正當
          found[rel] = (found[rel] ?? 0) + 1
          if (!(rel in FAINT_BASELINE)) offenders.push(`${rel}:${i + 1}  ${ln.trim().slice(0, 70)}`)
        })
      }
    }
  }
  walk('components'); walk('app')

  assert.deepEqual(offenders, [],
    `text-ink-faint 用咗喺唔係裝飾／停用態嘅地方（對比 2.36–2.91，遠低於 AA 4.5）：\n` +
    `${offenders.join('\n')}\n` +
    `修法：改用 text-ink-muted（4.98–6.80，兩個主題都過）。唔好加入基線。`)

  for (const [f, cap] of Object.entries(FAINT_BASELINE)) {
    assert.ok((found[f] ?? 0) <= cap,
      `${f} 嘅 ink-faint 由 ${cap} 增至 ${found[f]} —— 基線只可以減，唔可以加。`)
  }
})

// ── ⑥ 自己畫深底嘅覆蓋層必須 scope 語意 token ───────────────────────────────
// /relax/breathing 嘅全屏呼吸畫面用 bg-[rgba(10,10,15,0.96)]，即係【兩個主題都深色】，
// 但層內文字一直用跟主題嘅 ink token。暗色主題下 token 本來就淺，所以睇落冇事；
// 淺色主題下就係深字疊深底。
//
// 2026-09-12 實測（localhost:3001，data-theme=light）：14 個文字元素 6 個跌穿 AA，
// 最嚴重係「結束呼吸」掣 1.64、哮喘安全提示 3.13。
// 加 .on-dark-overlay（globals.css 局部重新定義 token）之後，兩個主題皆 0 跌穿。
//
// 本測試守住呢一類：凡係 `fixed inset-0` 配寫死深色底嘅容器，都要帶 scope class。
// 唔守嘅話，下一個做全屏覆蓋層嘅人會由零再中一次，而且【只會喺淺色主題出事】——
// 開發時多數用暗色，所以肉眼發現唔到。
test('⑥ fixed inset-0 嘅寫死深底覆蓋層必須帶 .on-dark-overlay', () => {
  const bad: string[] = []
  const walk = (d: string) => {
    for (const e of readdirSync(join(ROOT, d))) {
      const rel = `${d}/${e}`
      if (statSync(join(ROOT, rel)).isDirectory()) {
        if (!/node_modules|__tests__|\.next/.test(rel)) walk(rel)
      } else if (rel.endsWith('.tsx')) {
        readFileSync(join(ROOT, rel), 'utf8').split('\n').forEach((ln, i) => {
          if (!/fixed\s+inset-0/.test(ln)) return
          // 寫死嘅深底：bg-[rgba(…低亮度…)] 或 bg-[#0-3 開頭]
          const dark = /bg-\[rgba?\(\s*([0-9]{1,2})\s*,/.test(ln) || /bg-\[#[0-3][0-9a-fA-F]/.test(ln)
          if (!dark) return
          if (!ln.includes('on-dark-overlay')) bad.push(`${rel}:${i + 1}  ${ln.trim().slice(0, 74)}`)
        })
      }
    }
  }
  walk('components'); walk('app')
  assert.deepEqual(bad, [],
    `以下覆蓋層自己畫咗深底，但冇 scope 語意 token：\n${bad.join('\n')}\n` +
    `淺色主題下層內文字會變成深字疊深底（實測低至 1.64）。` +
    `修法：喺容器 className 加 on-dark-overlay。`)
})

// ── ⑦ 危機熱線連結唔准帶透明度變體 ──────────────────────────────────────────
// 兩條熱線原本係 text-accent/80，喺深色覆蓋層上實測 4.38 —— 跌穿 AA 4.5。
// 組件註釋自己寫住「NON-NEGOTIABLE」，但「見到」唔可以只係喺 DOM 入面存在。
//
// ⚠️ 呢個缺陷之前量唔到：Tailwind 嘅 alpha 變體（/80）會編譯成 oklab，
// 而當時嘅量度只認 rgb()，所以【靜靜哋跳過晒所有半透明文字】——
// 而嗰批正正最容易跌穿。改用 canvas 取樣先量得到。
test('⑦ 危機熱線連結唔帶 alpha 變體', () => {
  const src = readFileSync(join(ROOT, 'app/relax/components/BreathingExercise.tsx'), 'utf8')
  for (const tel of ['tel:28960000', 'tel:23820000']) {
    const line = src.split('\n').find((l) => l.includes(tel))
    assert.ok(line, `揾唔到 ${tel} —— 熱線唔可以移除`)
    assert.ok(!/text-\w+\/\d+/.test(line!),
      `${tel} 嘅連結帶咗透明度變體：${line!.trim()}\n` +
      `半透明會令對比跌穿 AA（實測 /80 = 4.38）。用實色 text-accent。`)
  }
})

// ── ⑧ 全站掃描：每一對同 className 內嘅（文字 token × 底色 token）都要過 AA ──
// 測試 ② 鎖住嘅係我手揀嘅三張卡。手揀嘅問題係：揀得中就過，揀漏就冇人知，
// 而目標書要求嘅係【所有卡片】—— 一個冇邊界嘅講法冇可能驗收。
//
// 本測試把佢變成可枚舉：掃 components/ 同 app/ 每一個 className 字串，
// 凡係同一個字串入面【同時】有 text-<token> 同 bg-<token>，就當成一對，逐對驗。
// 新加一張卡若果用咗未驗過嘅配搭，即刻紅 —— 唔使有人記得去加入名單。
//
// 2026-09-12 加入時實測 13 對，全部過（最低 accent|surface-sunken 暗色 4.53），
// 所以對當時嘅 build 零影響（憲章 §6）。
//
// ⚠️ 覆蓋邊界（要講清楚，唔好當成全覆蓋）：
//   捉到　：同一個 className 內嘅配搭
//   捉唔到：父容器出底色、子元素出文字（要跑瀏覽器先知，而 $0 約束下冇驅動）
//   捉唔到：寫死嘅色值（bg-[rgba(...)]）—— 嗰類由測試 ⑥ 另外守
//   捉唔到：alpha 變體（text-accent/80）編譯成 oklab 之後嘅實際值 —— 由測試 ⑦ 守熱線嗰處
// 三條測試合埋先算一個防線，冇一條單獨足夠。
const SURFACES_ALL = ['surface', 'surface-raised', 'surface-sunken', 'accent-strong', 'accent-hover'] as const
const INKS_ALL = ['ink', 'ink-soft', 'ink-muted', 'ink-faint', 'accent', 'on-accent'] as const

test('⑧ 全站同 className 內嘅 token 配搭全部過 AA', () => {
  const found = new Map<string, Set<string>>()
  const walk = (d: string) => {
    for (const e of readdirSync(join(ROOT, d))) {
      const rel = `${d}/${e}`
      if (statSync(join(ROOT, rel)).isDirectory()) {
        if (!/node_modules|__tests__|\.next/.test(rel)) walk(rel)
      } else if (rel.endsWith('.tsx')) {
        const src = readFileSync(join(ROOT, rel), 'utf8')
        for (const m of src.matchAll(/["'`]([^"'`\n]*(?:bg-|text-)[^"'`\n]*)["'`]/g)) {
          const cls = m[1]
          const bgs = SURFACES_ALL.filter((s) => new RegExp(`(^|\\s|:)bg-${s}(\\s|$)`).test(cls))
          const inks = INKS_ALL.filter((s) => new RegExp(`(^|\\s|:)text-${s}(\\s|$)`).test(cls))
          for (const b of bgs) for (const i of inks) {
            const k = `${i}|${b}`
            if (!found.has(k)) found.set(k, new Set())
            found.get(k)!.add(rel)
          }
        }
      }
    }
  }
  walk('components'); walk('app')

  const fails: string[] = []
  for (const [k, files] of found) {
    const [ink, bg] = k.split('|')
    for (const [theme, raw] of [['light', LIGHT_RAW], ['cyber', CYBER_RAW]] as const) {
      // ink-faint 只准做裝飾／停用態（測試 ⑤ 守住用法），故此處按非文字 3:1 判。
      const floor = ink === 'ink-faint' ? 3.0 : 4.5
      const r = contrast(tok(raw, ink), tok(raw, bg))
      if (r < floor) fails.push(`${theme} · ${k} = ${r}（要 ≥ ${floor}）· 例：${[...files][0]}`)
    }
  }
  assert.deepEqual(fails, [],
    `以下 token 配搭跌穿 AA：\n${fails.join('\n')}\n` +
    `修法：換一個對比足夠嘅 token，唔好加豁免 —— 呢啲配搭係學生實際睇緊嘅。`)

  // 反向：配搭數目跌到 0 代表掃描器壞咗（例如 className 寫法變咗而正則跟唔上），
  // 而壞咗嘅掃描器係會靜靜哋「全部通過」嘅。
  assert.ok(found.size >= 10,
    `只掃到 ${found.size} 對 token 配搭，遠少於 2026-09-12 實測嘅 13 對 —— ` +
    `多數係掃描器跟唔上 className 寫法嘅變化，而唔係真係少咗配搭。先修掃描器。`)
})
