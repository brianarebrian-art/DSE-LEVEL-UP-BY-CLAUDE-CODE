// HOTFIX-0823 回歸鎖 —— 鎖住呢一輪嘅四個決定，唔靠人手記得。
//
// 每條測試都對應一個【實測揾到、已經修好】嘅問題。註釋寫低咗當時量到嘅數字，
// 將來有人想改返轉頭，至少會見到當初點解要咁做。

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

/**
 * 剝走註釋再掃。
 * 呢個陷阱喺本 repo 中過好多次：測試掃自己嘅解釋文字，然後「成功」失敗。
 * 例如下面搵「連續 N 日」嘅測試，如果唔剝註釋，就會掃到本檔自己講緊
 * 「唔准出現連續 N 日」嗰句。
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(join(ROOT, dir))) {
    if (name === 'node_modules' || name === '.next' || name === '__tests__') continue
    const rel = `${dir}/${name}`
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out)
    else if (/\.tsx$/.test(name)) out.push(rel)
  }
  return out
}

const UI_FILES = [...walk('app'), ...walk('components')]

// ── 一、易讀字體：字型檔要真係存在 ─────────────────────────────────────────
// 2026-08-24 之前，globals.css 有 @font-face 指去 /fonts/OpenDyslexic-Regular.woff2，
// 但 public/fonts/ 入面只有一個 README —— 即係每次學生揿「易讀字體」都行一次
// 404。功能冇壞（fallback 落 BDA 系統字體堆疊），但拎唔到真・OpenDyslexic。
test('OpenDyslexic 字型檔存在，@font-face 唔會再 404', () => {
  const css = read('app/globals.css')
  const face = css.match(/@font-face\s*\{[^}]*OpenDyslexic[^}]*\}/)?.[0] ?? ''
  assert.ok(face.length > 0, 'globals.css 搵唔到 OpenDyslexic 嘅 @font-face')

  const src = face.match(/url\(['"]([^'"]+)['"]\)/)?.[1] ?? ''
  assert.ok(src.startsWith('/'), `@font-face 應該指去本站絕對路徑，而家係「${src}」`)

  const onDisk = join(ROOT, 'public', src.replace(/^\//, ''))
  assert.ok(existsSync(onDisk), `@font-face 指住 ${src}，但 ${onDisk} 唔存在 —— 會 404`)

  // woff2 檔頭必須係 'wOF2'。防止有人放咗個 .ttf 入去改個名扮 woff2。
  const head = readFileSync(onDisk).subarray(0, 4).toString('latin1')
  assert.equal(head, 'wOF2', `${src} 唔係一個真嘅 woff2 檔（檔頭係「${head}」）`)

  // 自寄字型先至符合 CSP font-src 'self'，亦先至係 $0（憲章 §5）。
  assert.ok(!/@font-face[\s\S]{0,200}https?:\/\//.test(css), '字型唔可以由外部 CDN 載入')
})

// ── 二、方案 B：全站唔可以再顯示「連續 N 日」 ──────────────────────────────
// 創辦人拍板改用累積制（本月／總共去重日數）。連續制嘅傷害唔喺個符號，
// 而係【中斷一日即歸零】—— 學生休息一日，畫面就將之前嘅累積一次抹走。
test('冇任何學生介面顯示「連續 N 日」式嘅連續打卡', () => {
  const offenders: string[] = []
  // 必須要有一個【真實數字】（字面數字或者 ${…} 內插）夾喺中間先算違規。
  //
  // 第一版寫成 /連續\s*[\w.]*\s*日/，即刻誤報咗 components/GoodTodayCard.tsx ——
  // 嗰句係「唔記連續日數，唔計次數」，即係【明文講自己冇做連續打卡】。
  // 一句聲明唔做某件事，唔可以當成做咗嗰件事。呢個係掃描式測試最常見嘅陷阱：
  // 掃到嘅係否定句，唔係違規本身。
  const ZH_STREAK = /連續\s*(?:\d+|\$\{[^}]*\})\s*日/
  const EN_STREAK = /(?:\d+|\$\{[^}]*\})\s*(?:days?\s+in\s+a\s+row|day\s+streak)/i
  for (const f of UI_FILES) {
    const src = stripComments(read(f))
    if (ZH_STREAK.test(src) || EN_STREAK.test(src)) offenders.push(f)
  }
  assert.deepEqual(offenders, [], `呢啲檔案顯示緊連續打卡：${offenders.join(', ')}`)
})

test('logicLog 唔再導出 currentStreak —— 留住個函數等於留住一個「接返落去」嘅邀請', () => {
  const src = stripComments(read('lib/logicLog.ts'))
  assert.ok(!/export\s+function\s+currentStreak/.test(src), 'currentStreak 唔應該再存在')
  assert.ok(/export\s+function\s+computeActiveDays/.test(src), '累積制函數應該喺度')
  // isConsecutive 要保留 —— 佢淨係用嚟畫時間軸節點之間嘅連接線，唔係計分。
  assert.ok(/export\s+function\s+isConsecutive/.test(src), 'isConsecutive 仲有時間軸用緊')
})

// ── 三、練習頁支援掣唔可以打直排 ────────────────────────────────────────────
// iPhone SE（375×667）實測：直排三粒藥丸高 118px，由下而上壓住答題區，
// 四個選項之中有三個被遮（B 19%、C 24%、D 13%）。改橫排之後高度剩 34px。
// 呢種【縱向遮擋】用 scrollWidth === innerWidth 係驗唔到嘅 —— 闊度一直都啱。
test('練習頁支援掣打橫排，唔可以變返直柱壓住選項', () => {
  const src = stripComments(read('components/PracticeSupport.tsx'))
  const container = src.match(/className="fixed floating-bottom-2[^"]*"/)?.[0] ?? ''
  assert.ok(container.length > 0, '搵唔到練習頁支援掣嘅容器')
  assert.ok(!/flex-col/.test(container), `容器唔可以用 flex-col（會變返 118px 高嘅直柱）：${container}`)
  assert.ok(/flex-row/.test(container), `容器應該用 flex-row：${container}`)

  // 字級滑桿要脫離橫排流（absolute），否則會將成條橫帶推到爆出畫面右邊。
  assert.ok(/absolute bottom-full/.test(src), '字級滑桿應該係浮喺掣上面嘅 popover')
})

// ── 四、全局橫向溢出保險唔可以被人手刪走 ────────────────────────────────────
// 375px 機上，內容闊過視窗時 Chrome 唔係出橫向捲軸，而係自動撐大版面視窗
// （實測 innerWidth 由 375 變 467 ＝ 成頁縮細到 80%）。字細一圈，對讀寫障礙
// 同弱視考生就係無障礙倒退。
test('全局橫向溢出保險仲喺 globals.css 度', () => {
  const css = read('app/globals.css').replace(/\/\*[\s\S]*?\*\//g, ' ')
  const htmlBlocks = [...css.matchAll(/(?<![\w.#-])html\s*\{([^}]*)\}/g)].map((m) => m[1]).join(';')

  assert.match(htmlBlocks, /overflow-x:\s*clip/, 'html 要有 overflow-x: clip')
  // 用 clip 唔用 hidden：hidden 會令元素變成捲動容器，position: sticky 嘅子元素
  // （relax 頁 NowPlayingBar）會失效。hidden 只可以做舊瀏覽器後備。
  assert.match(htmlBlocks, /overflow-x:\s*hidden[\s\S]*overflow-x:\s*clip/, 'hidden 要排喺 clip 前面做後備')
  assert.match(css, /overflow-wrap:\s*break-word/, 'body 要有 overflow-wrap: break-word')
})
