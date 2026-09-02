#!/usr/bin/env node
// contrast-guard —— 攔截「淺字疊淺底」呢一類無障礙缺陷。
//
// ══ 點解需要 ══
// 2026-07-22 全站由暗底轉 light-first。轉嘅時候有幾個組件嘅淺灰字冇跟住換
// token，結果係淺灰字留喺淺底上。2026-08-20 人手抽查捉到三處，最嚴重嗰個係
// HourglassTimer 嘅 60 秒反思鎖指示標籤 —— 對比只有 1.42:1，即係學生啱啱答錯
// 難題、最需要睇嗰句自診指示嗰陣，段字近乎隱形。
//
// 呢類缺陷嘅特性係「肉眼喺深色螢幕上唔覺，喺淺色主題先現形」，靠人手複查捉唔
// 穩。本 guard 將佢變成機器檢查。
//
// ══ 判斷準則（刻意高精度、低召回）══
// 只報【同一個檔案入面用咗淺色字階，但成個檔案冇任何深色底】嘅情況。
//   • 有深色底 → 該檔多數係自洽嘅深色卡（例如 /relax、BlindTestQuestion），放行
//   • 冇深色底 → 淺字必然疊喺全站淺底 (--color-surface #FAFAF8) 上，計得出實數
// 呢個準則捉到嗰三個真實缺陷，同時唔會誤報任何一個刻意深色嘅組件。
//
// 寧可漏報都唔可以誤報：一個成日嘈嘅 guard 好快就會被 --force 繞過，
// 到時就等於冇。

import fs from 'node:fs'
import path from 'node:path'

// 全站淺色底（app/globals.css 的 --color-surface）。淺字最終疊喺呢個色上。
const SURFACE = '#FAFAF8'

// Tailwind 預設色階。只列會出問題嘅淺階；深階一律過 AA，不必列。
//
// 灰階以外亦必須覆蓋彩色階 —— 2026-08-20 喺 CalcTipCard 捉到成個組件都係
// light-first 遷移漏網，而佢用嘅係 text-cyan-200/300/400 同 text-amber-300/400。
// 若 guard 只查灰階，呢類「整個組件為深底而設」嘅缺陷會完全隱形。
const GREY_RAMP = {
  50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
  400: '#94a3b8', 500: '#64748b',
}
// gray / zinc / neutral / stone 各家淺階略有出入，但同階之間差距極細（<0.2），
// 統一用 slate 一套估算已足夠判斷過唔過 AA。

// 彩色階。每族只列到「喺白底上仍未達 4.5:1」嗰幾階為止。
const COLOR_RAMPS = {
  cyan: { 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4' },
  sky: { 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9' },
  teal: { 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6' },
  emerald: { 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981' },
  green: { 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e' },
  lime: { 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16' },
  yellow: { 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308' },
  amber: { 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b' },
  orange: { 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316' },
  rose: { 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185' },
  pink: { 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6' },
  violet: { 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa' },
  purple: { 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc' },
  blue: { 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa' },
  indigo: { 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8' },
  red: { 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171' },
}

const hexToRgb = (h) => {
  const s = h.replace('#', '')
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16))
}
const relLum = (rgb) =>
  0.2126 * ch(rgb[0]) + 0.7152 * ch(rgb[1]) + 0.0722 * ch(rgb[2])
function ch(v) {
  v /= 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const contrast = (a, b) => {
  const l1 = relLum(hexToRgb(a)), l2 = relLum(hexToRgb(b))
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/**
 * 剝走註解 —— 註解入面提及舊色碼（例如記錄「以前用 slate-300，已修正」）唔算違規。
 *
 * ⚠️ 次序關鍵：必須【先剝行註解，後剝區塊註解】。
 * 反過嚟做會出事，因為行註解裡面好常出現 `/*` 呢個字串序列 —— 例如
 * app/relax/layout.tsx 有一句 `// …自成一區（app/relax/**），深空黑…`，
 * 嗰個 `/**` 會被當成區塊註解開頭，一路食到下一個 `*​/` 為止，連中間真正嘅
 * `bg-[#0A0A0F]` 都一併食走。後果係雙向錯：可以食走深色底而誤報，亦可以食走
 * 淺色字而漏報。
 *
 * 行註解只切「唔係 URL 一部分」嘅 `//`（保住 https://），亦唔切字串內容以外
 * 嘅嘢就夠 —— 本 guard 只需判斷 class 字串，唔需要完整 JS parser。
 */
const stripComments = (s) =>
  s
    .split('\n')
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, '$1'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')

// 深色底：有其中一個就代表鋪咗深色表面。
//
// ⚠️ 每個分支尾都有 `(?!\/)` —— 帶 alpha 嘅底【唔算】鋪咗深色表面。
// 2026-09-02 修補：`bg-black/70` 係彈層遮罩，佢同下面嘅嘢合成，
// 唔構成一個已知嘅深色字底；但舊 regex 一見到就當成「呢個檔有深底」，
// 於是成個檔嘅淺色字全部獲豁免。實例：EmotionThermometer 個標題
// `text-white` 疊喺 `bg-surface-raised` 上，淺色主題下對比 1.00:1
// （即係完全隱形），而本 guard 一直放行 —— 就係俾嗰個 bg-black/70 呃咗。
// 落閘前影響統計（憲章 §6）：166 個 .tsx 入面有 4 個檔改變分類
// （sensei、SubjectDetailView、AuthButton、ReadingRuler），
// 但四個都冇淺色字，所以【新增報錯 = 0】。
const DARK_SURFACE = /\b(?:bg|from|via|to)-(?:slate|gray|zinc|neutral|stone)-(?:6|7|8|9)\d{2}\b(?!\/)|\bbg-black\b(?!\/)|\b(?:bg|from|via|to)-\[#(?:0|1|2)[0-9A-Fa-f]{5}\b(?!\/)|\bbg-(?:surface-)?(?:ink|dark)\b(?!\/)/
// 淺色字階（會出事嗰啲）
const LIGHT_TEXT = /\btext-(slate|gray|zinc|neutral|stone|cyan|sky|teal|emerald|green|lime|yellow|amber|orange|rose|pink|violet|purple|blue|indigo|red)-(50|100|200|300|400|500)\b/g
// 硬編 hex 淺字
const HEX_TEXT = /\btext-\[#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\]/g

// 孤兒白字：`text-white` 但同一段 class 字串入面【冇任何 bg-*】。
//
// 點解要獨立一條規則：`text-white` 落淺底係 1.00:1 —— 對比度嘅最壞情況，
// 但佢一直唔喺 LIGHT_TEXT 個 regex 入面（嗰個只覆蓋 text-{色}-{50…500}），
// 所以呢種最嚴重嘅缺陷從來冇入過本 guard 視野。
// 2026-09-02 實例：EmotionThermometer 個標題「而家感覺點？」——
// 學生啱啱答錯難題彈出嚟問佢感受，嗰句問題本身完全睇唔到。
//
// 點解要求「同一串冇 bg-*」而唔係見到就報：白字落實色掣係完全正當嘅用法
// （bg-rose text-white、bg-slate-500 text-white 之類）。落閘前實測：
// 一刀切會產生 6 個誤報（account、admin、dashboard、result 四個檔嘅
// 徽章同掣），而本 guard 檔頭寫住「寧可漏報都唔可以誤報 —— 一個成日嘈嘅
// guard 好快就會被 --force 繞過」。加咗同串 bg-* 呢個條件之後：
// 現行 code 誤報 0；突變測試（把上述兩個真缺陷還原）捉返 2/2。
const CLASS_CHUNK = /(["'`])((?:(?!\1)[\s\S])*)\1/g
const HAS_BG = /\bbg-[\w[\]#./-]+/

/**
 * 深色底可以由【祖先 layout】鋪落嚟，唔一定喺同一個檔案。
 * 例如 app/relax/layout.tsx 用 `bg-[#0A0A0F]` 鋪咗成個 /relax 子樹，
 * 所以 app/relax/components/*.tsx 裡面嘅淺字其實疊喺深底上，唔算違規。
 *
 * 若只按單一檔案判斷，呢啲就會全部誤報 —— 而一個成日誤報嘅 guard 好快會
 * 被繞過。故此沿目錄鏈向上檢查每一層嘅 layout.tsx。
 */
const layoutDarkCache = new Map()
function inheritsDarkLayout(file) {
  let dir = path.dirname(file)
  while (dir && dir !== '.' && dir !== path.sep) {
    if (!layoutDarkCache.has(dir)) {
      const lay = path.join(dir, 'layout.tsx')
      layoutDarkCache.set(
        dir,
        fs.existsSync(lay) && DARK_SURFACE.test(stripComments(fs.readFileSync(lay, 'utf8'))),
      )
    }
    if (layoutDarkCache.get(dir)) return true
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return false
}

/**
 * 推斷「深色區塊」覆蓋邊個行範圍。
 *
 * 一個檔案可以同時有淺底同深底（例如 /transparency 係淺色頁，入面有幾張
 * bg-slate-900 深色卡）。若見到深底就豁免全檔，頁面淺底上嘅淺字就會被連帶
 * 豁免 —— 呢個正正係 2026-08-20 喺 transparency 捉到嗰個 2.52:1 缺陷。
 *
 * JSX 冇辦法唔寫 parser 就準確判斷巢狀，但本 repo 全部經 Prettier 格式化，
 * 縮排穩定，足以做結構代理：一行宣告深底之後，所有【縮排更深】嘅行都屬於
 * 佢嘅子樹，直到縮排回到同層或更淺為止。
 *
 * 判斷唔到嘅情況（例如 className 用多行 template literal 砌）會傾向【唔豁免】，
 * 即係寧可報出嚟畀人手確認，都好過靜靜漏咗。
 */
function darkRanges(src) {
  const lines = src.split('\n')
  const indentOf = (l) => l.match(/^\s*/)[0].length
  const ranges = []

  lines.forEach((line, i) => {
    if (!DARK_SURFACE.test(line)) return

    // ⚠️ 唔可以直接用「宣告深底嗰行」嘅縮排。Prettier 會把長屬性拆行：
    //     <section                                   ← 縮排 12（元素真正層級）
    //       className="bg-slate-900 …"               ← 縮排 14（屬性行）
    //     >                                          ← 縮排 12
    //       <h2 className="… text-slate-100">        ← 縮排 14（子元素）
    // 用屬性行嘅 14 去算，個 `>` 收行（12 ≤ 14）就即刻收掣，成班子元素會漏晒。
    // 所以要向上搵返開標籤，用【開標籤】嘅縮排做基準。
    let tagStart = i
    while (tagStart > 0 && !/^\s*<[A-Za-z]/.test(lines[tagStart])) tagStart--
    const base = indentOf(lines[tagStart])

    // 搵開標籤結尾。自閉合（`/>`）代表冇子元素，只覆蓋自己。
    let tagEnd = tagStart
    while (tagEnd < lines.length && !/\/?>\s*$/.test(lines[tagEnd])) tagEnd++
    if (/\/>\s*$/.test(lines[tagEnd] ?? '')) {
      ranges.push([tagStart + 1, tagEnd + 1])
      return
    }

    // 由開標籤結尾之後開始搵，縮排回到同層或更淺即為終點。
    let end = lines.length
    for (let j = tagEnd + 1; j < lines.length; j++) {
      if (!lines[j].trim()) continue
      if (indentOf(lines[j]) <= base) { end = j; break }
    }
    ranges.push([tagStart + 1, end]) // 1-indexed，含開標籤本身
  })
  return ranges
}

const ROOTS = ['app', 'components', 'lib']
const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) out.push(p)
  }
  return out
}

const findings = []
for (const file of ROOTS.flatMap((r) => walk(r))) {
  const raw = fs.readFileSync(file, 'utf8')
  const src = stripComments(raw)
  if (inheritsDarkLayout(file)) continue // 深色由祖先 layout 鋪落，放行

  // 深色區塊覆蓋範圍（見 darkRanges）。唔再「成個檔有深底就全檔豁免」——
  // 混合表面嘅頁（例如 /transparency：淺色頁 + 深色卡）用嗰種做法會有盲點，
  // 頁面本身淺底上嘅淺字會被連帶豁免。
  const covered = darkRanges(src)
  const isCovered = (line) => covered.some(([a, b]) => line >= a && line <= b)

  const seen = new Map()
  const record = (token, hex, index) => {
    const cr = contrast(hex, SURFACE)
    if (cr >= 4.5) return // 過 AA，唔使報
    const line = src.slice(0, index).split('\n').length
    if (isCovered(line)) return // 真係嵌喺深色塊入面，放行
    if (seen.has(token)) return
    seen.set(token, { cls: token, hex, cr: cr.toFixed(2), line })
  }

  LIGHT_TEXT.lastIndex = 0
  let m
  while ((m = LIGHT_TEXT.exec(src))) {
    const [, family, step] = m
    const ramp = COLOR_RAMPS[family] ?? GREY_RAMP
    const hex = ramp[Number(step)]
    if (hex) record(m[0], hex, m.index)
  }

  // ⚠️ 成對寫死（bg + text 喺同一串）嗰啲喺下面另外處理，唔喺呢度報 ——
  // 攞佢哋去同頁面底色比係錯嘅比較對象。
  const PAIRED = new Set()
  CLASS_CHUNK.lastIndex = 0
  while ((m = CLASS_CHUNK.exec(src))) {
    const c = m[2]
    if (/\bbg-\[#[0-9A-Fa-f]{3,6}\]/.test(c)) {
      for (const t of c.match(/\btext-\[#[0-9A-Fa-f]{3,6}\]/g) ?? []) PAIRED.add(t)
    }
  }
  HEX_TEXT.lastIndex = 0
  while ((m = HEX_TEXT.exec(src))) {
    if (PAIRED.has(m[0])) continue
    record(m[0], `#${m[1]}`, m.index)
  }

  // 孤兒白字。白色喺任何淺色底上都係 1.00–1.05:1，直接當 #FFFFFF 計。
  CLASS_CHUNK.lastIndex = 0
  while ((m = CLASS_CHUNK.exec(src))) {
    const chunk = m[2]
    if (!/\btext-white\b/.test(chunk) || HAS_BG.test(chunk)) continue
    record('text-white', '#FFFFFF', m.index)
  }

  // 【成對寫死】：同一段 class 字串同時寫死 bg 同 text 嘅時候，
  // 應該比對【嗰兩隻色之間】，唔係比對頁面底色。
  //
  // 2026-09-02 加呢段嘅原因：lib/grading.ts 嘅等級徽章莫蘭迪化之後寫成
  // `bg-[#3C443A] text-[#FFFDF9]` —— 深底配暖白字，實測 9.94:1，完全正確。
  // 但本 guard 攞暖白字去同頁面底色 #FAFAF8 比，得 1.03:1，報咗個假警報。
  // 收窄 DARK_SURFACE 個 hex 範圍去遷就唔係辦法（會放過真正嘅中間調誤用），
  // 成對比對先係啱嘅比較對象，而且順帶捉到「深底配深字」呢類真缺陷。
  // §6 影響統計：全站只有 10 處成對寫死，全部喺 lib/grading.ts。
  const PAIR_TEXT = /\btext-\[#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\]/
  const PAIR_BG = /\bbg-\[#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\]/
  CLASS_CHUNK.lastIndex = 0
  while ((m = CLASS_CHUNK.exec(src))) {
    const chunk = m[2]
    const ct = PAIR_TEXT.exec(chunk)
    const cb = PAIR_BG.exec(chunk)
    if (!ct || !cb) continue
    const cr2 = contrast(`#${ct[1]}`, `#${cb[1]}`)
    if (cr2 >= 4.5) continue
    const line = src.slice(0, m.index).split('\n').length
    seen.set(`pair:${ct[0]}@${cb[0]}`, {
      cls: `${ct[0]} on ${cb[0]}`, hex: `#${ct[1]}`, cr: cr2.toFixed(2), line,
      against: `#${cb[1]}`,
    })
  }

  for (const v of seen.values()) findings.push({ file, ...v })
}

const BAR = '─'.repeat(70)
console.log(`\n${BAR}\n  contrast-guard —— 淺字疊淺底檢查（底色 ${SURFACE}）\n${BAR}`)

if (findings.length === 0) {
  console.log('  ✅ CONTRAST GUARD PASSED —— 冇發現淺字疊淺底。\n' + BAR)
  process.exit(0)
}

console.log(`\n❌ 發現 ${findings.length} 處未達 WCAG AA（需 ≥ 4.5:1）：\n`)
let last = ''
for (const f of findings) {
  if (f.file !== last) { console.log(`── ${f.file}`); last = f.file }
  // 成對寫死嗰啲比對嘅係嗰兩隻色之間，唔係頁面底色 —— 訊息要講返啱嘅比較對象，
  // 否則睇報告嘅人會照住 #FAFAF8 去查，查極都對唔上。
  const ground = f.against ?? SURFACE
  console.log(`   L${f.line}: ${f.cls}  (${f.hex} on ${ground} = ${f.cr}:1)`)
}
console.log(`
修法：換用語意 token（見 app/globals.css）——
   正文     → text-ink        (#1A1A1A, 15.91)
   次要正文 → text-ink-soft   (#2D2D2D, 12.59)
   註腳說明 → text-ink-muted  (#5E5E5E,  5.93)
   text-ink-faint (#9CA3AF, 2.43) 刻意未達 AA，只可用於停用控件／aria-hidden 裝飾。

若該處【刻意】係深色卡，請喺同一檔案用深色底 utility（例如 bg-slate-900），
guard 會自動放行。
${BAR}`)
process.exit(1)
