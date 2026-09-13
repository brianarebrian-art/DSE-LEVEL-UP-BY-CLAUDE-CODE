#!/usr/bin/env node
// ============================================================================
// aaa-tokens.mjs —— 算「AAA（7:1）模式」要改邊幾個 token、改成幾多
// ----------------------------------------------------------------------------
// ⚠️ 入面啲值【一定要由運行中瀏覽器量返嚟】，唔可以由 globals.css 讀。
//    2026-09-13 踩過：我由 globals.css:45–100 嗰個 :root 讀值去計，
//    算出一套完全唔啱嘅數。原因係莫蘭迪調色盤 2026-09-02「由 [data-ml] scope
//    升上 :root」（globals.css:333），即係現行生效嘅係後面嗰個 :root，
//    而唔係檔案前面嗰個。同一個 token 名喺一個檔入面定義咗兩次，
//    肉眼讀邊個都可以講得通 —— 只有瀏覽器答到邊個真係生效。
//
//    重新量法（DevTools Console，逐個主題各做一次，記住換完主題要 reload）：
//      const cs = getComputedStyle(document.documentElement)
//      cs.getPropertyValue('--color-ink-muted')
//
// 用法：node scripts/a11y/aaa-tokens.mjs
// ============================================================================

const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// 2026-09-13 由 localhost:3001 實測（getComputedStyle(document.documentElement)）
const THEMES = {
  light: {
    bgs: ['#F4F0EA', '#FFFDF9', '#F0EBE3'],
    fg: { ink: '#2C2A29', 'ink-soft': '#3D3A38', 'ink-muted': '#69635F', accent: '#57685C', gold: '#706347', rose: '#845956' },
    dir: 'darken',
  },
  cyber: {
    bgs: ['#1a1917', '#252422', '#2f2e2c'],
    fg: { ink: '#f0e8dc', 'ink-soft': '#c1bab0', 'ink-muted': '#a8a095', accent: '#7a9e7e', gold: '#b8956f', rose: '#c49a9a' },
    dir: 'lighten',
  },
}

const TARGET = 7.0
const darken = (h, f) => '#' + hex(h).map((c) => Math.round(c * f).toString(16).padStart(2, '0')).join('')
const lighten = (h, f) => '#' + hex(h).map((c) => Math.round(Math.min(255, c + (255 - c) * f)).toString(16).padStart(2, '0')).join('')

for (const [name, t] of Object.entries(THEMES)) {
  const worst = (fg) => Math.min(...t.bgs.map((b) => ratio(fg, b)))
  console.log(`\n── ${name}（最差底面 ${t.bgs.length} 個之中取最低）──`)
  for (const [k, v] of Object.entries(t.fg)) {
    const r = worst(v)
    if (r >= TARGET) { console.log(`  ${k.padEnd(11)} ${v}  ${r.toFixed(2)}  ✅ 已達 AAA`); continue }
    let out = null
    for (let f = 0; f <= 1.001; f += 0.005) {
      const c = t.dir === 'darken' ? darken(v, 1 - f) : lighten(v, f)
      if (worst(c) >= TARGET) { out = [c, worst(c)] ; break }
    }
    console.log(`  ${k.padEnd(11)} ${v}  ${r.toFixed(2)}  ✗ → ${out ? `${out[0]}（${out[1].toFixed(2)}）` : '色相內做唔到'}`)
  }
}

console.log(`
⚠️ 上面只係【純底面】嘅數。同色淡底藥丸（bg-accent/[0.10] 之類）另計 ——
   globals.css:347 明文寫住「scope 換底色之後對比會跌約 0.9，而莫蘭迪色相
   本身冇呢個餘量」，當年 40 處係改結構（實色底 ＋ 左側 3px 色條）先過到 AA。
   所以 AAA 唔係換值就搞掂，詳見 docs/aaa-contrast-feasibility.md。`)
