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
//   3. DevTools Console 貼晒本檔，然後 `await __settle()`（等入場動畫做完）
//      先至 __probe() / __ovf()
//
// ══ 四個曾經令呢支嘢報錯數嘅坑（全部實測踩過）══
//
// ① 半透明前景。`color: rgba(0,0,0,.18)` 唔合成落背景就會當成純黑而「合格」。
//    要 over(fg, bg) 先。負向測試就係為咗釘死呢一點。
// ② 漸變背景。`getComputedStyle().backgroundColor` 喺 linear-gradient 之下
//    係 transparent，向上砌會砌到一個唔存在嘅底色，然後報一堆假陽性。
//    遇到 backgroundImage !== 'none' 就【放棄呢個元素】，寧可漏報唔好亂嗌。
// ③ eval 覆蓋唔到已存在嘅 window.__probe。改完探針再跑，量緊嘅可能係舊版。
//    每次跑之前一定要 `delete window.__probe`。
// ④ 祖先 opacity（2026-09-16 修）。舊版只睇元素【自己】嘅 opacity，所以 Focus 燈
//    開住（非聚焦區 opacity: .25）嗰陣照樣報「0 失敗」——啲字實際淡到 1.8:1。
//    而家由元素沿祖先鏈逐層合成背景同 opacity，自測亦加咗一紅一綠兩個 opacity 例。
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
  // Porter-Duff source-over; the bottom colour may itself be translucent.
  const over = (top, bot) => {
    const a = top.a + bot.a * (1 - top.a)
    if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 }
    const mix = (t, b) => (t * top.a + b * bot.a * (1 - top.a)) / a
    return { r: mix(top.r, bot.r), g: mix(top.g, bot.g), b: mix(top.b, bot.b), a }
  }
  const WHITE = { r: 255, g: 255, b: 255, a: 1 }

  // Final on-screen colour of `start` painted inside `el`: composite it over each
  // ancestor's background and apply each ancestor's opacity, up to the canvas.
  // Pitfall ④ (2026-09-16): the old version only looked at the element's own opacity.
  // With the Focus light on, the dimmed regions sit at opacity 0.25, yet the probe
  // still reported zero failures because ancestor opacity was never applied.
  // Returns null on a gradient background (pitfall ②: give up rather than guess).
  function render(el, start) {
    const chain = []
    for (let cur = el; cur; cur = cur.parentElement) chain.push(cur)
    const styles = chain.map((n) => getComputedStyle(n))
    // dimAbove[i]: some node at index >= i has opacity < 1, so an opaque colour
    // below it will still be blended with whatever lies behind.
    const dimAbove = new Array(chain.length + 1).fill(false)
    for (let i = chain.length - 1; i >= 0; i--) dimAbove[i] = dimAbove[i + 1] || Number(styles[i].opacity) < 1
    let acc = start
    for (let i = 0; i < chain.length; i++) {
      const cs = styles[i]
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null
      const c = parse(cs.backgroundColor)
      if (c && c.a > 0) acc = over(acc, c)
      const op = Number(cs.opacity)
      if (op < 1) acc = { ...acc, a: acc.a * op }
      if (acc.a >= 0.999 && !dimAbove[i + 1]) return acc
    }
    return over(acc, WHITE)
  }

  const cumulativeOpacity = (el) => {
    let o = 1
    for (let cur = el; cur; cur = cur.parentElement) o *= Number(getComputedStyle(cur).opacity)
    return o
  }

  const hidden = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') return true
    if (cumulativeOpacity(el) < 0.02) return true // an ancestor at opacity 0 hides it as well
    const r = el.getBoundingClientRect()
    return r.width < 2 || r.height < 2
  }

  // 動畫途中量到嘅 opacity 唔算數（2026-09-16 實測）：`/practice` 張卡有入場動畫
  // `ml-q-enter`，載入後 1.2 秒量到 4.28:1，等佢做完再量係 4.98:1。
  // 計埋祖先 opacity 之後，唔避開呢一刻就會報一批唔存在嘅失敗。
  const midAnimation = new Set()
  for (const a of (document.getAnimations ? document.getAnimations() : [])) {
    if (a.playState !== 'running') continue
    const t = a.effect && a.effect.target
    if (t) midAnimation.add(t)
  }
  const animatingChain = (el) => {
    for (let cur = el; cur; cur = cur.parentElement) if (midAnimation.has(cur)) return true
    return false
  }

  const fails = []
  let checked = 0
  let redacted = 0
  let inactive = 0
  let animating = 0
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[aria-hidden="true"]')) continue     // 裝飾元素，唔係畀人讀
    if (el.closest('svg, script, style, noscript')) continue
    // 只睇【自己直接持有文字】嘅元素，避免同一段文字數十次
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('')
    if (!text) continue
    if (hidden(el)) continue
    // WCAG 1.4.3 exempts text in inactive UI components. Now that ancestor opacity
    // is counted, a disabled button at opacity-50 would otherwise be reported.
    if (el.closest(':disabled, [aria-disabled="true"]')) { inactive++; continue }
    if (animatingChain(el)) { animating++; continue } // 先 await __settle()，剩返嘅先跳過
    const cs = getComputedStyle(el)
    const fgRaw = parse(cs.color); if (!fgRaw) continue
    const bg = render(el, { r: 0, g: 0, b: 0, a: 0 }); if (!bg) continue
    const eff = render(el, fgRaw); if (!eff) continue
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
  return { redacted, inactive, animating, theme: document.documentElement.getAttribute('data-theme'), checked, fails }
}

/**
 * 掃之前 await 佢：等入場動畫做完先量。無限循環嘅動畫（脈動、轉圈）永遠唔會完，
 * 所以唔等佢哋 —— 佢哋嘅 target 會喺 __probe 入面被跳過並計入 `animating`。
 */
window.__settle = async function (maxMs = 3000) {
  const t0 = Date.now()
  const finite = () => (document.getAnimations ? document.getAnimations() : []).filter((a) => {
    if (a.playState !== 'running') return false
    const it = a.effect && a.effect.getTiming ? a.effect.getTiming().iterations : 1
    return it !== Infinity
  })
  while (Date.now() - t0 < maxMs) {
    const running = finite()
    if (!running.length) return { settled: true, waitedMs: Date.now() - t0 }
    await Promise.race([
      Promise.allSettled(running.map((a) => a.finished)),
      new Promise((r) => setTimeout(r, 150)),
    ])
  }
  return { settled: false, waitedMs: Date.now() - t0 }
}

window.__ovf = function () {
  // ══ 2026-09-15 重寫 —— 舊版喺呢個站【結構上量唔到嘢】══
  // 舊版只靠「scrollTo(400) 之後 scrollX > 0」判斷爆版。但 globals.css 由 2026-08-24
  // （HOTFIX-0823）起有 `html { overflow-x: clip }` 安全網：頁面層根本捲唔郁，
  // 闊過屏幕嘅內容係【直接被裁走】—— scrollX 永遠係 0，舊版永遠報「0 爆版」。
  // 2026-09-13 嘅 34 路由掃描就係咁得出「0 爆版」，嗰個結果唔作數。
  //
  // 而家嘅地面真相：有冇元素伸出屏幕右邊，而佢同 <html> 之間【冇】任何會
  // 裁剪或者捲動嘅祖先（overflow-x ≠ visible）。有嘅話，佢係喺一個捲得郁／
  // 本身就裁嘅容器入面（例如 overflow-x-auto 嘅表格、.katex-display），唔算。
  // 冇嘅話，佢就係俾 html 嘅 clip 裁走咗 —— 學生睇唔到嗰部分。
  const vv = window.visualViewport ? Math.round(window.visualViewport.width) : window.innerWidth
  const contained = (el) => {
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      if (a === document.body) continue // body 冇設 overflow；html 嘅 clip 先係要揾嘅嘢
      if (getComputedStyle(a).overflowX !== 'visible') return true
    }
    return false
  }
  const culprits = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    if (r.right <= vv + 1) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    if (cs.position === 'fixed') continue // 抽屜式選單等離屏元素：由佢自己嘅 transform 管
    if (contained(el)) continue
    culprits.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 70), right: Math.round(r.right), w: Math.round(r.width) })
  }
  // 只報最外層：一個闊元素入面嘅子元素全部都會超出，唔使逐個列
  const outer = culprits.filter((c, k) => k === 0 || c.right !== culprits[k - 1].right || c.w !== culprits[k - 1].w)
  return { vv, clipped: culprits.length > 0, count: culprits.length, culprits: outer.slice(0, 6) }
}

/**
 * __ovf 嘅負向測試（2026-09-15）。一支未紅過嘅探針，唔知係「冇爆版」定係「探針壞咗」
 * —— 舊版 __ovf 就係從來冇紅過，所以冇人發現佢量唔到嘢。
 * 種兩個 800px 闊嘅元素：一個直接放（應該捉到），一個放喺 overflow-x:auto 容器入面
 * （唔應該捉到）。兩項都要對，嗰次掃描先作數。
 */
window.__ovfSelfTest = function () {
  const host = document.querySelector('main') || document.body
  const bad = document.createElement('div')
  bad.innerHTML = '<span style="display:inline-block;width:800px;height:10px"></span>'
  const box = document.createElement('div')
  box.style.overflowX = 'auto'
  box.innerHTML = '<span style="display:inline-block;width:800px;height:10px"></span>'
  host.appendChild(bad)
  const caught = window.__ovf().clipped
  bad.remove()
  host.appendChild(box)
  const falseAlarm = window.__ovf().clipped
  box.remove()
  const baseline = window.__ovf().clipped // 頁面本身（兩個測試元素都已移走）
  return { ok: caught && !falseAlarm, caughtWide: caught, flaggedScrollableBox: falseAlarm, pageItselfClipped: baseline }
}

/**
 * 負向測試 —— 跑任何一頁之前先跑呢個。
 * 種六個已知答案嘅元素：三個應該紅、三個應該綠。
 * 六項有任何一項唔對，表示探針壞咗，嗰次掃描嘅「零失敗」唔作數。
 */
window.__probeSelfTest = function () {
  const d = document.createElement('div')
  d.style.cssText = 'position:fixed;left:-9999px;top:0'
  d.innerHTML = `
    <div style="background:#ffffff;color:#bbbbbb;font-size:14px">SELFTEST_FAIL_LOW</div>
    <div style="background:#ffffff;color:rgba(0,0,0,0.18);font-size:14px">SELFTEST_FAIL_ALPHA</div>
    <div style="background:#ffffff;color:#595959;font-size:14px">SELFTEST_PASS_GREY</div>
    <div style="background:#ffffff;color:#000000;font-size:14px">SELFTEST_PASS_BLACK</div>
    <div style="background:#ffffff"><div style="opacity:0.25"><div style="color:#000000;font-size:14px">SELFTEST_FAIL_OPACITY</div></div></div>
    <div style="background:#ffffff"><div style="opacity:0.9"><div style="color:#000000;font-size:14px">SELFTEST_PASS_OPACITY</div></div></div>`
  // 要真係喺版面上先量得到 —— left:-9999px 唔影響 getComputedStyle
  document.body.appendChild(d)
  const hit = new Set(window.__probe().fails.map((f) => f.text))
  d.remove()
  // Black text under an ancestor at opacity 0.25 renders as rgb(191,191,191) on white,
  // about 1.8:1. A probe that ignores ancestor opacity reports it as passing.
  const want = {
    SELFTEST_FAIL_LOW: true, SELFTEST_FAIL_ALPHA: true, SELFTEST_FAIL_OPACITY: true,
    SELFTEST_PASS_GREY: false, SELFTEST_PASS_BLACK: false, SELFTEST_PASS_OPACITY: false,
  }
  const bad = Object.entries(want).filter(([k, v]) => hit.has(k) !== v).map(([k]) => k)
  if (bad.length) { console.error('✗ 探針自檢唔通過：', bad, '—— 今次掃描結果唔作數'); return false }
  console.log('✅ 探針自檢通過（三紅三綠）')
  return true
}
