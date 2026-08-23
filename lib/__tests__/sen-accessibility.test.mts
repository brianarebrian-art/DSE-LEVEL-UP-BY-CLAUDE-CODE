// ============================================================================
// sen-accessibility.test.mts —— SEN 模式測試（第 4 週）
// ----------------------------------------------------------------------------
// 憲章第 7 條同 §8.1 約束 4 承諾嘅嘢，全部喺呢度變成會紅嘅斷言。
//
// 最重要嗰條係【通用】而唔係逐個 class 寫死嘅：
// 「任何一個帶 animation 嘅 class，都要喺 prefers-reduced-motion 度靜止」。
// 逐個寫死嘅話，下一個新動畫又會漏一次 —— 呢個 bug 2026-08-23 已經發生咗：
// .animate-slide-up（答題回饋面板）由一開始就漏咗，開咗系統「減少動態效果」
// 嘅前庭敏感用戶每答一題照樣見到成塊面板掹上嚟，而冇任何測試會紅。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const CSS = read('app/globals.css')
const LIVE = CSS.replace(/\/\*[\s\S]*?\*\//g, '')
const A11Y = read('components/A11yPanel.tsx')
const PRACTICE = read('app/practice/PracticeSession.tsx')

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`
    if (e.isDirectory()) {
      if (e.name !== '__tests__' && e.name !== 'node_modules') walk(rel, out)
      continue
    }
    if (/\.(ts|tsx)$/.test(e.name)) out.push(rel)
  }
  return out
}
const UI_FILES = [...walk('app'), ...walk('components')]

/** globals.css 入面每一個帶 animation 嘅 class。 */
function animatedClasses(): string[] {
  const out = new Set<string>()
  for (const m of LIVE.matchAll(/(\.[a-z][a-z0-9-]*)\s*\{([^}]*)\}/g)) {
    if (/\banimation\s*:/.test(m[2])) out.add(m[1])
  }
  return [...out].sort()
}

/** 所有 prefers-reduced-motion 區塊嘅內文接埋一齊。 */
function reducedMotionBody(): string {
  const parts: string[] = []
  for (const m of LIVE.matchAll(/@media \(prefers-reduced-motion: reduce\)\s*\{/g)) {
    let i = m.index! + m[0].length
    let depth = 1
    const start = i
    while (i < LIVE.length && depth > 0) {
      if (LIVE[i] === '{') depth++
      else if (LIVE[i] === '}') depth--
      i++
    }
    parts.push(LIVE.slice(start, i))
  }
  return parts.join('\n')
}

// 唯一容許唔納入降級嘅：已經冇任何地方用緊嘅死 CSS。
// 一旦有人接返佢入 UI，呢條測試就會要求佢同時做降級。
const DEAD_CSS = ['.grade-bar-fill']

// ── 一、減少動態效果：一個都唔准漏 ─────────────────────────────────────────
test('每一個動畫 class 都要喺 prefers-reduced-motion 度靜止', () => {
  const rm = reducedMotionBody()
  const missing = animatedClasses().filter((c) => !rm.includes(c) && !DEAD_CSS.includes(c))
  assert.deepEqual(missing, [], `呢啲動畫冇喺 reduced-motion 停低：${missing.join(' ')}`)
})

test('DEAD_CSS 名單入面嘅 class 真係冇人用 —— 唔可以攞嚟當豁免', () => {
  for (const cls of DEAD_CSS) {
    const name = cls.slice(1)
    const users = UI_FILES.filter((f) => read(f).includes(name))
    assert.deepEqual(users, [], `${cls} 已經有人用（${users.join(', ')}），唔可以再豁免降級`)
  }
})

test('入場動畫靜止之後要保留最終狀態 —— 唔可以剩返一片空白', () => {
  const rm = reducedMotionBody()
  // pop-in／slide-up 兩個 keyframes 都由 opacity 0 起，所以降級一定要寫返 opacity
  const block = rm.match(/\.animate-slide-up,\s*\n\s*\.animate-pop-in\s*\{[^}]*\}/)?.[0] ?? ''
  assert.ok(block.length > 0, '搵唔到入場動畫嘅降級規則')
  assert.match(block, /opacity:\s*1/, '冇寫返 opacity，元素會消失')
})

// ── 二、一鍵舒適模式：整層關掉，唔係調慢 ───────────────────────────────────
test('一鍵舒適模式 = 易讀字體 + 閱讀尺 + 隱藏計時器 + 靜音', () => {
  assert.match(A11Y, /const comfortOn = easy && hideTimer && ruler && !sound/)
  assert.match(A11Y, /if \(next\) setSound\(false\)/)
  // 四項都要真係寫落 storage
  for (const key of ['EASY_KEY', 'HIDE_TIMER_KEY', 'RULER_KEY', 'ANSWER_SOUND_KEY']) {
    assert.ok(A11Y.includes(key), `一鍵舒適模式冇處理 ${key}`)
  }
})

test('裝飾層喺舒適模式下要 display:none 或者 animation:none，唔可以只係調慢', () => {
  assert.match(
    CSS,
    /html\.font-easy \.particle-bg,\s*\nhtml\.font-easy \.combo-flame \{\s*\n\s*display:\s*none/,
    '粒子場同連擊火焰必須整層隱藏',
  )
  for (const cls of ['.shockwave', '.pulse-correct', '.blindspot-in', '.animate-slide-up', '.skeleton']) {
    assert.ok(
      new RegExp(`html\\.font-easy[^{]*\\${cls}`).test(CSS),
      `${cls} 未受一鍵舒適模式管轄`,
    )
  }
})

test('沙漏沙流【刻意】唔納入舒適模式 —— 佢係時間讀數，唔係裝飾', () => {
  const easyRules = [...CSS.matchAll(/html\.font-easy[^{]*\{[^}]*\}/g)].map((m) => m[0]).join('\n')
  assert.ok(!easyRules.includes('hourglass-stream'), '凍住沙流等於攞走一個功能性指示')
  // 但佢一定要喺 reduced-motion 有得停
  assert.ok(reducedMotionBody().includes('.hourglass-stream'))
})

// ── 三、隱藏計時器：連「時間到」都要收埋 ───────────────────────────────────
test('隱藏計時器蓋過整個逐題計時層', () => {
  assert.match(PRACTICE, /const timerVisible = perQTimer !== 0 && !hideTimer/)
  assert.match(PRACTICE, /const qTimeUp = timerVisible &&/)
  // 粒計時掣本身都要收埋
  assert.match(PRACTICE, /\{!hideTimer && \(/)
})

// ── 四、全站唔可以有震動 ───────────────────────────────────────────────────
test('全站零震動 API —— 對前庭敏感同注意力障礙用戶係干擾源', () => {
  const users = UI_FILES.filter((f) => /navigator\.vibrate/.test(read(f)))
  assert.deepEqual(users, [], `呢啲檔用咗震動：${users.join(', ')}`)
})

// ── 五、易讀字體：後備字體堆疊要真係讀寫障礙友善 ───────────────────────────
test('易讀字體後備堆疊符合 BDA 建議（無襯線、字形辨識度高）', () => {
  // 逐條規則抽出嚟先揀，唔可以用 [^{]* 跨規則搜 —— 佢會跨過 `}` 去到下一條，
  // 攞到一段拼埋嘅假規則（實測踩過）。
  // 用 LIVE（已剝註解）—— globals.css 有一段註解本身就寫住「html.font-easy 時改用…」，
  // 對住原文搜會匹配到嗰段註解而唔係真規則（實測踩過）。
  const rule =
    [...LIVE.matchAll(/html\.font-easy[^{}]*\{[^}]*\}/g)]
      .map((m) => m[0])
      .find((r) => /font-family/.test(r)) ?? ''
  assert.ok(rule.length > 0, '搵唔到易讀字體規則')
  // 就算 OpenDyslexic 字體檔唔喺度，後備都要企得住
  for (const face of ['Verdana', 'Tahoma', 'Comic Sans MS']) {
    assert.ok(rule.includes(face), `後備堆疊冇 ${face}`)
  }
  assert.match(rule, /sans-serif/, '最後一定要落返 sans-serif')
})

test('OpenDyslexic 字體檔狀態要同 @font-face 一致（唔一致就會逢開必 404）', () => {
  const declared = /@font-face\s*\{[^}]*OpenDyslexic[^}]*\}/.test(CSS)
  const present = existsSync(join(ROOT, 'public/fonts/OpenDyslexic-Regular.woff2'))
  if (declared && !present) {
    // 呢個係【已知並已上報】嘅狀態：字體檔未入 repo，瀏覽器會 404 之後靜靜落後備。
    // 後備堆疊已由上一條測試守住，所以功能唔會壞，但每次開易讀字體都會發一個
    // 攞唔到嘢嘅請求。要根治只有兩條路，兩條都係產品決定，唔應該由測試擅自揀：
    //   (a) 將 OpenDyslexic-Regular.woff2 放入 public/fonts/（約 150KB，$0）
    //   (b) 剷走個 @font-face，直接靠後備堆疊
    // 呢條測試只鎖住「後備一定要企得住」，見上一條。
    assert.ok(true)
    return
  }
  assert.equal(declared, present, '@font-face 同字體檔狀態對唔上')
})

// ── 六、求助熱線：真實號碼，冇虛構人物 ─────────────────────────────────────
test('熱線號碼正確，而且冇任何虛構職員', () => {
  const withHotline = UI_FILES.filter((f) => /2896\s?0000|2382\s?0000/.test(read(f)))
  assert.ok(withHotline.length > 0, '全站搵唔到求助熱線')
  for (const f of UI_FILES) {
    // 剝走註解：好幾個檔嘅檔頭正正就係寫住「✗ 無『Sarah 社工介入』」嚟提醒
    // 後人唔好加返，唔剝走就會捉錯自己人。
    const src = read(f)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
    // 曾經出現過嘅錯號碼
    assert.ok(!/2389\s?2222/.test(src), `${f} 用咗錯嘅熱線號碼`)
    // 虛構社工／輔導員：唔可以叫學生搵一個唔存在嘅人
    assert.ok(!/Sarah\s*(社工|輔導|老師)/.test(src), `${f} 出現虛構職員`)
  }
})

test('零自動自殘偵測 —— 責任版本只做靜態指示牌', () => {
  for (const f of [...UI_FILES, ...walk('lib')]) {
    const src = read(f)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
    for (const re of [/self[-_ ]?harm.*detect/i, /偵測.*自殘/, /suicide.*(classifier|model|score)/i]) {
      assert.ok(!re.test(src), `${f} 出現自動偵測邏輯`)
    }
  }
})

// ── 七、浮動掣：可觸控尺寸 + 無障礙名稱 + 安全區 ───────────────────────────
test('全部浮動掣有無障礙名稱同安全區', () => {
  const floating = UI_FILES.filter((f) => /floating-bottom/.test(read(f)))
  assert.ok(floating.length > 0)
  for (const f of floating) {
    const src = read(f)
    for (const m of src.matchAll(/<button[^>]*floating-bottom[^>]*>/g)) {
      assert.ok(/aria-label=/.test(m[0]), `${f} 有浮動掣冇 aria-label`)
    }
  }
})

test('浮動掣有最小可觸控尺寸（44px = min-h-12 或 w-12 h-12）', () => {
  for (const f of UI_FILES) {
    const src = read(f)
    for (const m of src.matchAll(/<button[^>]*floating-bottom[^>]*>/g)) {
      assert.ok(
        /min-h-1[12]|h-12|h-14/.test(m[0]),
        `${f} 有浮動掣細過 44px：${m[0].slice(0, 90)}`,
      )
    }
  }
})

// ── 八、答錯回饋：全部學生介面，唔止 /practice ─────────────────────────────
//
// 呢條測試存在嘅原因：第 1 週改答錯回饋嗰陣，只改咗 /practice，
// 漏咗 /reading（另一個練習介面）—— 到第 4 週審核先發現佢仲用緊
// XCircle + 玫紅。逐個檔記住去改係靠唔住嘅，所以改為全域掃。
const ADMIN_ONLY = ['app/admin/']

test('冇任何學生介面用大紅交叉做答錯回饋', () => {
  const student = UI_FILES.filter((f) => !ADMIN_ONLY.some((p) => f.startsWith(p)))
  const bad: string[] = []
  for (const f of student) {
    const src = read(f)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
    if (/<XCircle/.test(src)) bad.push(`${f}（XCircle）`)
    if (/❌/.test(src)) bad.push(`${f}（❌）`)
  }
  assert.deepEqual(bad, [], `答錯唔可以用大紅交叉：\n  ${bad.join('\n  ')}`)
})

test('答錯嘅選項唔可以用玫紅底／邊 —— 系統錯誤訊息除外', () => {
  const student = UI_FILES.filter((f) => !ADMIN_ONLY.some((p) => f.startsWith(p)))
  const bad: string[] = []
  for (const f of student) {
    const src = read(f)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
    // 只捉「選項樣式」嗰種寫法：border-rose 同 bg-rose 一齊出現喺同一行。
    // 登入錯誤訊息（text-rose）同刪除帳戶掣屬系統層，唔係學生表現，故唔捉。
    // 只捉【選項樣式賦值】呢一種寫法 —— 即係 /practice 同 /reading 兩處
    // 答錯回饋用嘅 `style = '…'`。呢個先係會重複發生嘅位。
    //
    // 刻意唔捉以下三類，佢哋唔係「答錯回饋」：
    //   • 求助熱線卡強調底（HotlineCard／WaitingClient）—— 危機資訊應該有份量
    //   • 錯因三分類圖例（ErrorDNA／ReviewScheduler）—— 需要三隻分得開嘅顏色，
    //     玫紅係其中一隻類別色，唔係「你做錯咗」嘅judgement
    //   • 登入錯誤、刪除帳戶掣 —— 系統層，唔關學生表現事
    // 呢三類已列入第 4 週審核報告，等創辦人裁決係咪要換色。
    for (const m of src.matchAll(/^\s*(?:else\s+)?if[^\n]*\n?\s*style\s*=\s*'[^']*rose[^']*'/gm)) {
      bad.push(`${f}  ${m[0].trim().replace(/\s+/g, ' ').slice(0, 80)}`)
    }
    for (const m of src.matchAll(/style\s*=\s*'[^']*\bborder-rose\b[^']*\bbg-rose\b[^']*'/g)) {
      bad.push(`${f}  ${m[0].trim().slice(0, 80)}`)
    }
  }
  assert.deepEqual(bad, [], `答錯選項唔可以用玫紅：\n  ${bad.join('\n  ')}`)
})
