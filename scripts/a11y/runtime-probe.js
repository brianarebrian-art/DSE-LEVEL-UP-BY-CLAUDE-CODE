// ============================================================================
// runtime-probe.js —— 喺【運行中嘅瀏覽器】量對比度同 375px 爆版
// ----------------------------------------------------------------------------
// ⚠️ 呢個唔係一個閘，係一支【人手量度工具】。憲章 §16.D：
//    build-time 測試唔可以講成 runtime 防護。反過來都一樣 ——
//    呢支嘢喺開發者部機上跑過一次，唔等於學生部機上有任何保護。
//    佢嘅價值係：`scripts/contrast-guard.mjs` 掃源碼，掃唔到 CSS 變數
//    層層覆蓋之後【實際算出嚟】嘅顏色；只有真瀏覽器算得到。
//
// 點解唔寫成自動化測試：憲章 §5 嚴禁新增套件，而無頭瀏覽器
//（Playwright／Puppeteer）係一個大 dependency。所以做成一段貼得入
// DevTools Console 嘅純 JS，零依賴、零成本。
//
// 用法
//   1. npm run dev（port 3001 —— 唔可以用 3002）
//   2. 揀主題：localStorage.setItem('dse-theme','light') 或 'cyber'，然後【重新載入】
//      （淨係改 data-theme attribute 唔夠 —— 開機嗰段 inline script 先係權威）
//   3. DevTools Console 貼晒本檔，然後 __probe() / __ovf()
//
// ══ 三個曾經令呢支嘢報錯數嘅坑（全部實測踩過）══
//
// ① 半透明前景。`color: rgba(0,0,0,.18)` 唔合成落背景就會當成純黑而「合格」。
//    要 over(fg, bg) 先。負向測試就係為咗釘死呢一點。
// ② 漸變背景。`getComputedStyle().backgroundColor` 喺 linear-gradient 之下
//    係 transparent，向上砌會砌到一個唔存在嘅底色，然後報一堆假陽性。
//    遇到 backgroundImage !== 'none' 就【放棄呢個元素】，寧可漏報唔好亂嗌。
// ③ eval 覆蓋唔到已存在嘅 window.__probe。改完探針再跑，量緊嘅可能係舊版。
//    每次跑之前一定要 `delete window.__probe`。
//
// ══ 最緊要嘅一步：負向測試 ══
// 一支未紅過嘅探針，唔知係「冇問題」定係「探針壞咗」。跑之前先種一個
// 明知唔合格嘅元素，確認捉到；再種一個啱啱合格嘅，確認唔會誤報。
// 見本檔尾嘅 __probeSelfTest()。
// ============================================================================

window.__probe = function () {
  const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
  const parse = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number)
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
  }
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 })

  // 由元素向上砌實際背景。遇到 gradient 就放棄呢個元素（見檔頭坑 ②）。
  function bgOf(el) {
    let cur = el, acc = null
    while (cur && cur !== document.documentElement.parentNode) {
      const cs = getComputedStyle(cur)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null
      const c = parse(cs.backgroundColor)
      if (c && c.a > 0) { acc = acc ? over(acc, c) : c; if (acc.a >= 0.999) return acc }
      cur = cur.parentElement
    }
    const html = parse(getComputedStyle(document.documentElement).backgroundColor)
    const base = html && html.a > 0 ? html : { r: 255, g: 255, b: 255, a: 1 }
    return acc ? over(acc, base) : base
  }

  const hidden = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return true
    const r = el.getBoundingClientRect()
    return r.width < 2 || r.height < 2
  }

  const fails = []
  let checked = 0
  let redacted = 0
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[aria-hidden="true"]')) continue     // 裝飾元素，唔係畀人讀
    if (el.closest('svg, script, style, noscript')) continue
    // 只睇【自己直接持有文字】嘅元素，避免同一段文字數十次
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('')
    if (!text) continue
    if (hidden(el)) continue
    const cs = getComputedStyle(el)
    const fg = parse(cs.color); if (!fg) continue
    const bg = bgOf(el); if (!bg) continue
    const eff = fg.a < 1 ? over(fg, bg) : fg
    const L1 = lum([eff.r, eff.g, eff.b]), L2 = lum([bg.r, bg.g, bg.b])
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    const px = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700
    const large = px >= 24 || (bold && px >= 18.66)
    const need = large ? 3 : 4.5
    checked++
    if (ratio < need - 0.005) {
      // 刻意遮蓋（spoiler）唔算對比度失敗：前景背景【逐位完全相同】＋ 有 aria-label
      // ＋ role=button。實測 components/BlindTestQuestion.tsx 嘅 <Black>：
      // 撳咗 / 按 Enter 就揭開，揭開後變 text-paper-warn 疊 bg-paper-ink/10（合格），
      // role 同時收返避免死 tab 停駐點。
      // 意外整出嚟嘅低對比【幾乎唔會】剛好 byte-identical，所以呢個判斷收得夠窄。
      if (cs.color === cs.backgroundColor && el.getAttribute('aria-label') && el.getAttribute('role') === 'button') {
        redacted++
        continue
      }
      fails.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 60),
        text: text.slice(0, 40), ratio: +ratio.toFixed(2), need,
        fg: cs.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, px })
    }
  }
  return { redacted, theme: document.documentElement.getAttribute('data-theme'), checked, fails }
}

window.__ovf = function () {
  const before = { x: window.scrollX, y: window.scrollY }
  const vv = window.visualViewport ? Math.round(window.visualViewport.width) : window.innerWidth
  // 真相只有一個：試真係捲得郁唔郁。
  // ⚠️ scrollWidth === innerWidth 呢個做法【唔得】—— Chrome 會撐大 layout viewport，
  //    所以爆版嗰陣兩個數照樣相等，必然假陰性。要真係 scrollTo 然後睇 scrollX。
  const ys = [0, Math.round(document.documentElement.scrollHeight / 3), Math.round(document.documentElement.scrollHeight * 2 / 3)]
  let maxX = 0
  for (const y of ys) { window.scrollTo(400, y); maxX = Math.max(maxX, Math.round(window.scrollX)) }
  window.scrollTo(before.x, before.y)
  let culprits = []
  if (maxX > 0) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) continue
      if (r.right > vv + 1) culprits.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 70), right: Math.round(r.right), w: Math.round(r.width) })
    }
    culprits = culprits.slice(0, 6)
  }
  return { vv, innerWidth: window.innerWidth, scrollXreached: maxX, overflow: maxX > 0, culprits }
}

/**
 * 負向測試 —— 跑任何一頁之前先跑呢個。
 * 種四個已知答案嘅元素：兩個應該紅、兩個應該綠。
 * 四項有任何一項唔對，表示探針壞咗，嗰次掃描嘅「零失敗」唔作數。
 */
window.__probeSelfTest = function () {
  const d = document.createElement('div')
  d.style.cssText = 'position:fixed;left:-9999px;top:0'
  d.innerHTML = `
    <div style="background:#ffffff;color:#bbbbbb;font-size:14px">SELFTEST_FAIL_LOW</div>
    <div style="background:#ffffff;color:rgba(0,0,0,0.18);font-size:14px">SELFTEST_FAIL_ALPHA</div>
    <div style="background:#ffffff;color:#595959;font-size:14px">SELFTEST_PASS_GREY</div>
    <div style="background:#ffffff;color:#000000;font-size:14px">SELFTEST_PASS_BLACK</div>`
  // 要真係喺版面上先量得到 —— left:-9999px 唔影響 getComputedStyle
  document.body.appendChild(d)
  const hit = new Set(window.__probe().fails.map((f) => f.text))
  d.remove()
  const want = {
    SELFTEST_FAIL_LOW: true, SELFTEST_FAIL_ALPHA: true,
    SELFTEST_PASS_GREY: false, SELFTEST_PASS_BLACK: false,
  }
  const bad = Object.entries(want).filter(([k, v]) => hit.has(k) !== v).map(([k]) => k)
  if (bad.length) { console.error('✗ 探針自檢唔通過：', bad, '—— 今次掃描結果唔作數'); return false }
  console.log('✅ 探針自檢通過（兩紅兩綠）')
  return true
}
