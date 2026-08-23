// ============================================================================
// mastery.test.mts —— 等級估算 v4 驗收測試
// ----------------------------------------------------------------------------
// v4 嘅主張係「界線唔係我哋作嘅」。所以測試除咗驗行為，仲要驗【出處】：
// 源碼入面唔可以再有一張自訂門檻表，等級一定要由考評局公布嘅累積百分率查返。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const {
  predictMastery, corrected, wilson, sampleCap, sessionIsValid,
  levelForTopShare, levelLabel, GUESS_RATE, TIER_WEIGHTS, MIN_QUESTIONS,
} = await import('../mastery.ts')
const { subjectDistribution } = await import('../levelDistribution.ts')
const { boundaryDrift } = await import('../levelDrift.ts')

type Tiers = Parameters<typeof predictMastery>[0]['tiers']
const tiers = (e: [number, number], m: [number, number], h: [number, number]): Tiers => ({
  easy: { correct: e[0], total: e[1] },
  medium: { correct: m[0], total: m[1] },
  hard: { correct: h[0], total: h[1] },
})
const at = (p: number, n: number): [number, number] => [Math.round(p * n), n]
const run = (p: [number, number, number], n: number, subjectId = 'economics') => {
  const per = Math.floor(n / 3)
  return predictMastery({
    subjectId,
    tiers: tiers(at(p[0], per), at(p[1], per), at(p[2], n - 2 * per)),
    effectiveTotal: n,
  })
}

// ── 出處：唔可以再有自訂門檻 ──────────────────────────────────────────────

test('源碼冇任何自訂等級門檻表 —— 界線必須由考評局數據查返', () => {
  const src = readFileSync(new URL('../mastery.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  assert.ok(code.includes('subjectDistribution'), '冇讀考評局分佈')
  assert.ok(!/LADDER|THRESHOLD|thresholds\s*:/.test(code), '仍然有自訂門檻表')
  // v3 嗰七個拍腦袋嘅數（0.85 / 0.80 / 0.65 / 0.50 …）唔應該再出現
  for (const magic of ['0.85', '0.80', '0.70', '0.65']) {
    assert.ok(!code.includes(magic), `源碼仍然有自訂門檻 ${magic}`)
  }
})

test('等級直接由表 5a 嘅累積百分率查返 —— 逐科唔同', () => {
  // 英文前 10.1% 先係 5 級；物理前 26.3% 就係 5 級。同一個「前 15%」，
  // 兩科唔同等級 —— 呢個差異必須來自數據，唔係參數。
  assert.equal(levelForTopShare('english', 15), 4)
  assert.equal(levelForTopShare('physics', 15), 5)
  assert.equal(levelForTopShare('economics', 17.3), 5, '啱啱好踩線要當過')
  assert.equal(levelForTopShare('economics', 17.4), 4)
  assert.equal(levelForTopShare('csd', 20), null, 'CSD 冇等級')
})

// ── 亂按 ────────────────────────────────────────────────────────────────

test('猜測校正：純亂按（25%）校正後歸零', () => {
  assert.equal(corrected(25, 100), 0)
  assert.equal(corrected(10, 100), 0, '低過猜中率一律截於 0')
  assert.ok(Math.abs(corrected(50, 100) - (0.5 - GUESS_RATE) / 0.75) < 1e-9)
})

test('全程亂按（≈25%）—— 唔輸出任何等級', () => {
  for (const n of [30, 60, 120, 240, 480]) {
    const r = run([0.25, 0.25, 0.25], n)
    assert.equal(r.low, null, `n=${n} 竟然出到 ${r.low}–${r.high}`)
    assert.ok(['below_floor', 'too_uncertain'].includes(r.reason), `n=${n} reason=${r.reason}`)
  }
})

// 呢個係【統計檢定】，唔係結構性保證。一個亂撳嘅人如果好彩到喺 120 題度
// 撳中 35%，佢喺數據上同一個真係弱嘅學生無法分辨 —— 冇算法做得到。
// 所以測試驗嘅係【漏出去嘅比率有上限】同【漏出去嗰啲封頂喺第 2 級】，
// 唔係驗「一次都冇」。聲稱 0% 就係講大話。
test('隨機亂按 1,000 次 —— 漏出去少於 2%，而且封頂喺第 2 級', () => {
  let s = 20260823
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648
  const draw = (n: number): [number, number] => {
    let c = 0
    for (let i = 0; i < n; i++) if (rnd() < 0.25) c++
    return [c, n]
  }
  let worst = 0, emitted = 0
  for (let i = 0; i < 1000; i++) {
    const r = predictMastery({
      subjectId: 'economics', tiers: tiers(draw(40), draw(40), draw(40)), effectiveTotal: 120,
    })
    if (r.low !== null) { emitted++; worst = Math.max(worst, r.high ?? 0) }
  }
  assert.ok(emitted <= 20, `1,000 次亂按有 ${emitted} 次出到等級（上限 20）`)
  assert.ok(worst <= 2, `漏出去嘅最高去到 ${worst}，應該封頂喺 2`)
})

test('作答時間效度閘：撳得太快整節作廢', () => {
  assert.equal(sessionIsValid(20, 20), false)
  assert.equal(sessionIsValid(20, 59), false)
  assert.equal(sessionIsValid(20, 60), true)
  assert.equal(sessionIsValid(0, 100), false)
  assert.equal(sessionIsValid(20, Number.NaN), false)
})

// ── 永遠係區間 ──────────────────────────────────────────────────────────

test('永遠輸出區間 —— 冇任何一條路徑會回單一等級', () => {
  const cases: [number, number, number][] = [
    [0.9, 0.85, 0.8], [0.85, 0.75, 0.6], [0.7, 0.5, 0.35], [0.5, 0.4, 0.3], [1, 1, 1],
  ]
  for (const p of cases) {
    for (const n of [30, 60, 120, 300, 900]) {
      const r = run(p, n)
      if (r.low === null) continue
      assert.notEqual(r.low, r.high, `p=${p} n=${n} 出咗單一等級 ${r.low}`)
    }
  }
})

test('兩種不確定性分開回報，唔混埋一齊', () => {
  const r = run([0.85, 0.75, 0.6], 240)
  assert.ok(r.low !== null)
  assert.ok(r.samplingSpread > 0, '抽樣誤差應該係正數')
  assert.ok(r.driftSd !== null && r.driftSd > 0, '年度漂移應該由表 7c 讀返')
  assert.equal(r.driftSd, boundaryDrift('economics', '4+')?.sd ?? boundaryDrift('economics', '5+')?.sd)
})

test('題數越多，抽樣誤差越細（但唔會歸零）', () => {
  const a = run([0.85, 0.75, 0.6], 60).samplingSpread
  const b = run([0.85, 0.75, 0.6], 600).samplingSpread
  assert.ok(b < a, `600 題（${b}）應該窄過 60 題（${a}）`)
  assert.ok(b > 0)
})

// ── 樣本量 ──────────────────────────────────────────────────────────────

test('少過 30 題唔出等級，並且講明仲差幾多題', () => {
  const r = run([0.9, 0.9, 0.9], 14)
  assert.equal(r.low, null)
  assert.equal(r.reason, 'too_few')
  assert.equal(r.questionsShort, MIN_QUESTIONS - 14)
})

test('樣本量上限鎖：題數未夠唔會見到 5**', () => {
  assert.equal(sampleCap(29), null)
  assert.equal(sampleCap(30), 3)
  assert.equal(sampleCap(60), 4)
  assert.equal(sampleCap(120), 5)
  assert.equal(sampleCap(200), 5.75)
  const r = run([1, 1, 1], 100)
  assert.ok((r.high ?? 0) <= 4, `100 題全對唔應該封頂喺 ${r.high}`)
})

// ── 大愛紅線 ────────────────────────────────────────────────────────────

test('弱嘅學生一樣有回饋，但唔會被標成「0 級」', () => {
  const r = run([0.4, 0.3, 0.28], 120)
  assert.ok(!JSON.stringify(r).includes('"low":0'))
  assert.ok(r.low === null || r.low >= 1)
})

test('冇分佈數據嘅科目唔會兜個假等級出嚟', () => {
  const r = run([0.9, 0.9, 0.9], 300, 'csd')
  assert.equal(r.low, null)
  assert.equal(r.reason, 'no_distribution')
})

test('爛資料唔可以令輸出出 NaN', () => {
  const r = predictMastery({
    subjectId: 'economics',
    tiers: tiers([Number.NaN, 10], [5, Number.NaN], [-3, 10]),
    effectiveTotal: 120,
  })
  assert.ok(Number.isFinite(r.mastery))
  assert.ok(r.topPercent === null || Number.isFinite(r.topPercent))
})

test('SEN 中立：輸入型別根本冇 SEN 欄位', () => {
  const src = readFileSync(new URL('../mastery.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const banned of ['sen', 'Sen', 'SEN', 'dyslex', 'adhd', 'accommodation']) {
    assert.ok(!code.includes(banned), `算法唔應該提及 ${banned}`)
  }
  const t = tiers(at(0.85, 40), at(0.75, 40), at(0.6, 40))
  assert.deepEqual(
    predictMastery({ subjectId: 'economics', tiers: t, effectiveTotal: 120 }),
    predictMastery({ subjectId: 'economics', tiers: t, effectiveTotal: 120 }),
  )
})

// ── 權重同輔助函數 ──────────────────────────────────────────────────────

test('難度權重跟 DSE 卷面嘅 3:5:2', () => {
  assert.deepEqual(TIER_WEIGHTS, { easy: 0.3, medium: 0.5, hard: 0.2 })
  assert.equal(TIER_WEIGHTS.easy + TIER_WEIGHTS.medium + TIER_WEIGHTS.hard, 1)
})

test('Wilson 區間：全對唔會收成零寬度', () => {
  const [lo, hi] = wilson(20, 20)
  assert.equal(hi, 1)
  assert.ok(lo < 1 && lo > 0.7, `全對 20 題嘅下界係 ${lo}`)
  const [l2] = wilson(200, 200)
  assert.ok(l2 > lo, '題數多咗，下界應該高啲')
})

test('等級標籤：5.5 → 5*，5.75 → 5**', () => {
  assert.equal(levelLabel(5.5), '5*')
  assert.equal(levelLabel(5.75), '5**')
  assert.equal(levelLabel(4), '4')
})

test('用嘅係表 5a 實數 —— 隨機抽三科核對', () => {
  for (const [sid, lv, want] of [['english', '5+', 10.1], ['math', '3+', 60.9], ['physics', '4+', 48.8]] as const) {
    assert.equal(subjectDistribution(sid)!.cumulative[lv], want)
  }
})

// ── 「太闊就唔講」──────────────────────────────────────────────────────

test('區間跨過兩級就唔輸出 —— 唔可以講一個冇資訊嘅「估算」', () => {
  // 60 題、能力中上：抽樣區間仍然闊過一個等級尺嘅一半。
  const r = run([0.85, 0.75, 0.6], 60)
  assert.equal(r.low, null)
  assert.equal(r.reason, 'too_uncertain')
  assert.ok(r.samplingSpread > 20, `spread=${r.samplingSpread} 應該仍然好闊`)
  assert.ok(r.questionsShort > 0, '要講得出仲差幾多題')
})

test('樣本量上限鎖唔可以用嚟遮住不確定性', () => {
  // 舊版嘅次序錯誤：先封頂再判斷，會把一個 ±60 個百分點嘅區間截成
  // 「2–3 級」，令一個完全冇資訊嘅估算睇落好精準。
  const r = run([1, 1, 1], 30)
  assert.equal(r.low, null, '30 題全對唔應該出到任何區間')
  assert.equal(r.reason, 'too_uncertain')
})

test('做多啲題就講得出 —— 而且係同一個學生', () => {
  const weakEvidence = run([0.85, 0.75, 0.6], 60)
  const strongEvidence = run([0.85, 0.75, 0.6], 480)
  assert.equal(weakEvidence.reason, 'too_uncertain')
  assert.equal(strongEvidence.reason, 'ok')
  assert.ok(strongEvidence.samplingSpread < weakEvidence.samplingSpread)
})

test('高分段要更多證據 —— 頂部嘅等級喺百分位上窄好多', () => {
  // 經濟科：5** 1.9%、5*+ 7.0%、5+ 17.3% —— 頂三級加埋先 17 個百分點；
  // 3 級同 4 級之間就有 25 個百分點。所以分辨 5 同 5* 本來就需要多好多題。
  const mid = run([0.85, 0.75, 0.6], 120)
  const top = run([0.95, 0.9, 0.85], 120)
  assert.equal(mid.reason, 'ok')
  assert.equal(top.reason, 'too_uncertain', '頂部應該更加唔敢講')
})
