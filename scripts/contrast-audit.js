/**
 * 實際渲染對比度稽核（WCAG 1.4.3）—— 開發用工具，唔會打包入 app。
 *
 * 用法（兩種都得）：
 *   A. 直接貼落瀏覽器 console，然後 `run()`。
 *   B. 暫時 `cp scripts/contrast-audit.js public/_contrast-audit.js`，
 *      再喺 console 跑 `(await import('/_contrast-audit.js')).run()`，
 *      咁樣轉頁之後唔使重新貼。**用完必須刪走 public/ 嗰份**，唔准出街。
 *      （用 import 係因為 next.config.ts 的 CSP 係 script-src 'self'，
 *        外部 CDN 一律封鎖。）
 *
 * 量嘅係【實際渲染色】，唔係 token 定義值。三個必要細節，缺一就會出錯數字：
 *
 *  1. **要合成 alpha 底色。** `text-accent bg-accent/12` 呢類同色淡底藥丸，
 *     係全站最容易踩嘅陷阱：淡底會拉近前後景，對比比純底再跌約 0.9。
 *     只讀 `getComputedStyle(el).backgroundColor` 會拎到 `rgba(...,0.12)`
 *     或跳去最近嘅不透明祖先，兩者都會【高估】對比。必須由 root 向下逐層合成。
 *
 *  2. **唔准用 `canvas.fillStyle` 讀色。** Tailwind v4 調色盤（bg-amber-400 等）
 *     `getComputedStyle` 會回 `oklch(0.828 0.189 84.429)`，而 `fillStyle`
 *     對 oklch 唔會正規化成 rgb/hex，於是 parse 回 null、整層底色被靜靜跳過，
 *     令「黑字落琥珀掣」變成「黑字落深藍卡」＝ 一次過 11 個假陽性（已撞）。
 *     要真正光柵化：畫落 1×1 canvas 再 `getImageData`。
 *
 *  3. **量之前必須【重新載入】頁面，唔可以喺 console 直接翻 `data-theme`。**
 *     全站 `transition-colors` 未走完就讀，會讀到「A 主題前景 + B 主題背景」
 *     嘅混合值 —— 曾經令 /practice 由真實 5 項虛報成 15 項、A11y 面板由 3 項
 *     虛報成 13 項。正確做法：`localStorage.setItem('dse-theme', 'cyber')`
 *     然後 `location.reload()`，一個主題一次。
 *
 * 另外三類【刻意排除】，唔係漏檢：
 *   • 純 emoji 文字 —— 彩色字形唔受 `color` 影響，量出嚟必然係假陽性。
 *   • SVG `<text>` —— 真實色係 `fill`，唔係 `color`。
 *   • 前後景完全同色（比值 ≈ 1.00）—— 盲測黑題（BlindTestQuestion）用同色
 *     遮蓋題面係功能，唔係缺陷。
 *
 * 輸出 `unresolved` ＞ 0 表示有色值解析唔到，**唔可以當合格**，要逐個查。
 */
const cv = document.createElement('canvas')
cv.width = cv.height = 1
const cx = cv.getContext('2d', { willReadFrequently: true })
const CACHE = new Map()

const parse = (s) => {
  if (!s || s === 'transparent' || s === 'none') return [0, 0, 0, 0]
  if (CACHE.has(s)) return CACHE.get(s)
  let out = null
  const m = /^rgba?\(([^)]+)\)$/.exec(s)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    out = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]
  } else {
    cx.clearRect(0, 0, 1, 1)
    cx.fillStyle = 'rgba(0,0,0,0)'
    cx.fillStyle = s
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    out = [d[0], d[1], d[2], d[3] / 255]
    if (out[3] === 0 && !/^(transparent|rgba\(0,\s*0,\s*0,\s*0\))$/.test(s)) {
      console.warn('[contrast-audit] 解析唔到色值，已標記為 unresolved：', s)
      out = null
    }
  }
  CACHE.set(s, out)
  return out
}

const comp = (t, b) => {
  const a = t[3]
  if (a >= 1) return t
  if (a <= 0) return b
  return [0, 1, 2].map((i) => t[i] * a + b[i] * (1 - a)).concat(1)
}
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (f, b) => { const l1 = lum(f), l2 = lum(b); const [h, l] = l1 > l2 ? [l1, l2] : [l2, l1]; return (h + 0.05) / (l + 0.05) }
const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()

const effBg = (el) => {
  const chain = []
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) chain.push(n)
  let bg = [255, 255, 255, 1]
  let unknown = 0
  for (let i = chain.length - 1; i >= 0; i--) {
    const c = parse(getComputedStyle(chain[i]).backgroundColor)
    if (c) bg = comp(c, bg)
    else unknown++
  }
  return { bg, unknown }
}

const PURE_EMOJI = /^[\p{Extended_Pictographic}️‍\s]+$/u

export function run() {
  const out = []
  document.querySelectorAll('*').forEach((el) => {
    const txt = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim()
    if (!txt) return
    if (PURE_EMOJI.test(txt)) return
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return
    const r = el.getBoundingClientRect()
    if (r.width < 3 || r.height < 3) return // 包括 sr-only（0 面積）
    const { bg, unknown } = effBg(el)
    const svg = el.namespaceURI === 'http://www.w3.org/2000/svg'
    const fgRaw = parse(svg ? cs.fill || cs.color : cs.color)
    if (!fgRaw) { out.push({ unknown: 1 }); return }
    if (fgRaw[3] === 0) return
    const fg = comp(fgRaw, bg)
    const cr = ratio(fg, bg)
    if (Math.abs(cr - 1) < 0.02) return
    const px = parseFloat(cs.fontSize)
    const wt = parseInt(cs.fontWeight, 10) || 400
    const need = px >= 24 || (px >= 18.66 && wt >= 700) ? 3 : 4.5 // 大字 3:1、內文 4.5:1
    const cls = String(el.className?.baseVal ?? el.className ?? '').slice(0, 70)
    if (unknown) { out.push({ unknown: 1, cls }); return }
    if (cr < need) out.push({ cr: +cr.toFixed(2), need, px, fg: hex(fg), bg: hex(bg), cls, txt: txt.slice(0, 26) })
    else out.push({ ok: 1 })
  })
  const f = out.filter((o) => !o.ok && !o.unknown)
  const by = {}
  f.forEach((x) => { const k = x.fg + '/' + x.bg; by[k] = (by[k] || 0) + 1 })
  const unknowns = out.filter((o) => o.unknown)
  return {
    path: location.pathname,
    theme: document.documentElement.dataset.theme || '(none)',
    total: out.length,
    failed: f.length,
    unresolved: unknowns.length,
    unresolvedCls: [...new Set(unknowns.map((u) => u.cls))].slice(0, 8),
    by,
    items: f.slice(0, 20),
  }
}
