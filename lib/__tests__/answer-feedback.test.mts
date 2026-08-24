// ============================================================================
// answer-feedback.test.mts —— 第 1 週：溫暖即時反饋 + 個人微進度
// ----------------------------------------------------------------------------
// 這一批測試守的不是「功能行唔行到」，而是「有冇偷偷變返做懲罰性回饋」。
// 動畫同音效好易喺日後某次改版被人加返紅色、加返震動、加返等級數字，
// 而呢啲改動全部唔會令任何現有測試變紅。所以這裏直接對原始碼落斷言。
//
// 憲章依據：
//   第 7 條 —— 禁大紅交叉／FAIL；答錯的回饋力度必須與答對一致；
//              一鍵舒適模式要整層關掉，唔係調慢。
//   §8.1 約束 4 —— SEN 必須可以整層關掉。
// 規格書依據：§4.2（答錯無紅色閃屏）、§4.3（無「等級」數字，僅顯示百分比）。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8')

const PRACTICE = read('app/practice/PracticeSession.tsx')
const CSS = read('app/globals.css')
const RING = read('components/MasteryRing.tsx')
const PANEL = read('components/A11yPanel.tsx')

// ── 提示音：預設關閉 ────────────────────────────────────────────────────────
// localStorage 喺 node 冇，所以用最小 stub。答題音效唯一嘅持久狀態就係呢個 key。
function withStorage(store: Record<string, string> | null, fn: () => void) {
  const g = globalThis as unknown as { localStorage?: unknown }
  const prev = g.localStorage
  g.localStorage =
    store === null
      ? undefined
      : {
          getItem: (k: string) => (k in store ? store[k] : null),
          setItem: (k: string, v: string) => { store[k] = v },
        }
  try {
    fn()
  } finally {
    g.localStorage = prev
  }
}

const { isAnswerSoundOn, playCorrectChime, ANSWER_SOUND_KEY } = await import('../answerChime.ts')

test('答題提示音預設關閉 —— 未設定過就係關', () => {
  withStorage({}, () => assert.equal(isAnswerSoundOn(), false))
})

test('只有明確寫入 "1" 先當開；任何其他值都當關', () => {
  withStorage({ [ANSWER_SOUND_KEY]: '1' }, () => assert.equal(isAnswerSoundOn(), true))
  for (const v of ['0', 'true', 'on', 'yes', '']) {
    withStorage({ [ANSWER_SOUND_KEY]: v }, () => assert.equal(isAnswerSoundOn(), false, v))
  }
})

test('localStorage 唔存在時唔可以 throw —— 冇聲都唔可以阻住作答', () => {
  withStorage(null, () => {
    assert.equal(isAnswerSoundOn(), false)
    assert.doesNotThrow(() => playCorrectChime())
  })
})

test('冇 AudioContext 嘅環境（SSR／舊瀏覽器）靜默降級', () => {
  withStorage({ [ANSWER_SOUND_KEY]: '1' }, () => {
    assert.doesNotThrow(() => playCorrectChime())
  })
})

// ── 答錯：無紅色、無交叉、無震動 ───────────────────────────────────────────
test('答錯回饋唔可以出現大紅交叉（XCircle）', () => {
  assert.ok(!/\bXCircle\b/.test(PRACTICE), 'PracticeSession 仍然引用 XCircle')
  assert.ok(/\bLightbulb\b/.test(PRACTICE), '答錯應該用燈泡而非交叉')
})

test('答錯衝擊波唔可以用霓虹粉', () => {
  assert.ok(!/shockwave-pink/.test(PRACTICE), 'shockwave-pink 仍然接住答錯')
  assert.ok(/shockwave-gold/.test(PRACTICE), '答錯衝擊波應該係金色')
})

test('答錯回饋鏈由頭到尾冇任何玫紅（規格書 §4.2）', () => {
  // 剝走註解：註解可以講「原本用玫紅，已改金色」，但生效代碼一個都唔准剩。
  // 要連 /* … */ 跨行註解一齊剝 —— 只睇行首會漏咗續行（實測踩過）。
  const code = PRACTICE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
  for (const re of [/border-rose/, /bg-rose/, /text-rose/]) {
    assert.ok(!re.test(code), `練習頁仲有 ${re} —— 答錯唔可以出現紅色`)
  }
})

test('進度點答錯用金色，唔係紅點 —— 一行紅點就係一行判決', () => {
  assert.match(PRACTICE, /isCorrect \? 'bg-accent' : 'bg-gold'/)
})

test('答錯第一句係「發現盲點」而非「錯」', () => {
  assert.ok(/你發現咗一個新盲點/.test(PRACTICE))
  assert.ok(/blindspot-in/.test(PRACTICE), '該句應該有淡入 class')
})

test('全站練習頁不得出現 FAIL 字眼或震動 API', () => {
  assert.ok(!/navigator\.vibrate/.test(PRACTICE), '震動對 SEN 用戶係干擾源')
  // 跟 term-guard 同一個豁免規則：技術註解唔算文案。
  // （PracticeSession 有一句 "FAIL-OPEN" 講故障安全設計，唔會出現喺畫面。）
  const copy = PRACTICE.split('\n').filter((l) => {
    const t = l.trim()
    return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*')
  })
  for (const line of copy) {
    assert.ok(!/(?<![A-Za-z-])FAIL(?![A-Za-z-])/.test(line), `出現 FAIL：${line.trim()}`)
  }
})

// ── 答對與答錯的動畫力度必須一致（憲章第 7 條）────────────────────────────
test('答對脈衝同答錯衝擊波時長一致 —— 都係 600ms', () => {
  const pulse = CSS.match(/\.pulse-correct\s*\{[^}]*\}/)?.[0] ?? ''
  const shock = CSS.match(/\.shockwave\s*\{[^}]*\}/)?.[0] ?? ''
  assert.match(pulse, /600ms/, '.pulse-correct 唔係 600ms')
  assert.match(shock, /600ms/, '.shockwave 唔係 600ms')
})

test('答錯路徑冇 shake／放大／加速嘅動畫', () => {
  const gold = CSS.match(/\.shockwave-gold\s*\{[^}]*\}/)?.[0] ?? ''
  assert.ok(gold.length > 0, '搵唔到 .shockwave-gold')
  assert.ok(!/shake|scale\(|animation-duration/.test(gold), '答錯動畫加咗額外力度')
})

test('答錯【不設任何音效】—— 只有答對先播', () => {
  assert.match(
    PRACTICE,
    /if \(isCorrect\) playCorrectChime\(\)/,
    'playCorrectChime 應該只喺 isCorrect 為真時呼叫'
  )
})

// ── 三層降級：prefers-reduced-motion + 一鍵舒適模式 ────────────────────────
const WEEK1_ANIMATIONS = ['pulse-correct', 'blindspot-in', 'ring-draw', 'radar-grow']

test('第 1 週每個動畫都要喺 prefers-reduced-motion 度靜止', () => {
  const block = CSS.split('@media (prefers-reduced-motion: reduce)').slice(1).join('\n')
  for (const cls of WEEK1_ANIMATIONS) {
    assert.ok(block.includes(`.${cls}`), `${cls} 未喺 prefers-reduced-motion 降級層`)
  }
})

test('第 1 週每個動畫都要受一鍵舒適模式管轄', () => {
  for (const cls of WEEK1_ANIMATIONS) {
    assert.ok(
      new RegExp(`html\\.font-easy[^{]*\\.${cls}`).test(CSS),
      `${cls} 未受 html.font-easy 管轄`
    )
  }
})

test('一鍵舒適模式要一併靜音（憲章 §8.1 約束 4）', () => {
  assert.match(PANEL, /const comfortOn = easy && hideTimer && ruler && !sound/)
  assert.match(PANEL, /if \(next\) setSound\(false\)/)
})

// ── 微進度：無等級、無他人比較 ─────────────────────────────────────────────
test('掌握度圓環唔可以出現等級／段位／EXP 字眼', () => {
  // 跟 term-guard 同一個豁免規則：註解可以講「唔用等級／EXP」，
  // 但實際代碼同 JSX 文案一個字都唔可以有。所以先剝走註解行。
  const code = RING.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')
  // 用字界，唔好撞正 export／experience 之類正常識別符
  for (const re of [/\bEXP\b/, /\bXP\b/, /\bRank\b/i, /\bLevel\b/i, /\bbadge/i]) {
    assert.ok(!re.test(code), `MasteryRing 出現咗 ${re}`)
  }
  for (const banned of ['段位', '徽章', 'Combo', '排行', '稱號', '等級']) {
    assert.ok(!code.includes(banned), `MasteryRing 出現咗「${banned}」`)
  }
})

test('掌握度圓環唔可以引入任何圖表庫', () => {
  const imports = RING.split('\n').filter((l) => /^\s*import\b/.test(l)).join('\n').toLowerCase()
  for (const lib of ['chart.js', 'recharts', 'd3', 'victory', 'nivo']) {
    assert.ok(!imports.includes(lib), `MasteryRing 引入咗 ${lib}`)
  }
  assert.match(RING, /<svg/, 'MasteryRing 應該係純 SVG')
})

test('掌握度圓環冇任何接收他人數據嘅介面', () => {
  for (const banned of ['average', 'peer', 'classmate', 'percentile', 'others', '全班', '平均分']) {
    assert.ok(!RING.includes(banned), `MasteryRing 出現咗「${banned}」`)
  }
})

test('樣本量誠實：少於 4 題要標明樣本仲少', () => {
  assert.match(RING, /MIN_CONFIDENT_SAMPLE = 4/)
  assert.match(RING, /樣本仲少/)
  assert.match(RING, /small sample/)
})

// ── 英文課題名（非華語考生）────────────────────────────────────────────────
const { topicLabel } = await import('../topicStats.ts')

test('英文介面攞英文課題名', () => {
  assert.equal(topicLabel({ label: '市場機制', labelEn: 'Market mechanism' }, true), 'Market mechanism')
  assert.equal(topicLabel({ label: '市場機制', labelEn: 'Market mechanism' }, false), '市場機制')
})

test('舊紀錄冇 labelEn 就回落中文 —— 顯示中文好過顯示空白', () => {
  assert.equal(topicLabel({ label: '市場機制' }, true), '市場機制')
  assert.equal(topicLabel({ label: '市場機制', labelEn: '' }, true), '市場機制')
})

test('labelEn 係 optional —— 加欄唔可以令現有 tally 失效（憲章第 6 條）', () => {
  const store = read('lib/topicStats.ts')
  assert.match(store, /labelEn\?: string/, 'labelEn 必須係 optional')
  // 讀取路徑唔可以要求 labelEn 存在
  assert.match(store, /return en \? \(e\.labelEn \|\| e\.label\) : e\.label/)
})
