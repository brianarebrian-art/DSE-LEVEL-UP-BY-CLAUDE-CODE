// ============================================================================
// level-distribution.test.mts —— 考評局 2025 年成績分佈
// ----------------------------------------------------------------------------
// 呢個檔嘅數字係由考評局公開 PDF 抽出嚟嘅事實。測試守三樣嘢：
//   ① 抽得啱（對得返考評局公布嘅數）
//   ② 內部一致（累積百分率單調、1+ 與 U 相加為 100）
//   ③ 唔准被誤用（跨科比較、SEN、當成分數線）
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { subjectDistribution, shareAtOrAbove, isBinarySubject, DISTRIBUTION_YEAR } =
  await import('../levelDistribution.ts')
const { getActiveSubjects } = await import('../../data/subjects.ts')

const LEVELS = ['5**', '5*+', '5+', '4+', '3+', '2+', '1+'] as const

test('抽出嚟嘅數對得返考評局表 5a', () => {
  // 逐科由 PDF 原文核過。任何一個對唔上，就係抽取邏輯出咗事。
  const EXPECT: Record<string, [number, number, number, number]> = {
    english: [10.1, 28.4, 55.1, 79.7],
    chinese: [11.0, 33.8, 64.9, 89.4],
    math: [14.5, 38.8, 60.9, 83.6],
    economics: [17.3, 45.3, 70.1, 88.0],
    physics: [26.3, 48.8, 73.8, 90.3],
    m2: [34.4, 60.1, 81.0, 93.3],
    pe: [3.6, 16.5, 46.2, 73.5],
  }
  for (const [id, want] of Object.entries(EXPECT)) {
    const s = subjectDistribution(id)
    assert.ok(s, `冇 ${id} 嘅數據`)
    assert.deepEqual(
      [s.cumulative['5+'], s.cumulative['4+'], s.cumulative['3+'], s.cumulative['2+']],
      want,
      `${id} 對唔上考評局表 5a`,
    )
  }
  assert.equal(DISTRIBUTION_YEAR, 2025)
})

test('累積百分率必須單調遞增，1+ 與 U 相加為 100', () => {
  for (const s of getActiveSubjects()) {
    const d = subjectDistribution(s.id)
    if (!d) continue
    const vals = LEVELS.map((k) => d.cumulative[k])
    assert.deepEqual(vals, [...vals].sort((a, b) => a - b), `${s.id} 累積百分率唔係遞增`)
    assert.ok(Math.abs(d.cumulative['1+'] + d.u - 100) < 0.15, `${s.id} 1+ 與 U 相加唔等於 100`)
  }
})

test('出席人數少於 200 嘅科目必須標記 smallSample（規格書 §3.2）', () => {
  const small: string[] = []
  for (const s of getActiveSubjects()) {
    const d = subjectDistribution(s.id)
    if (!d) continue
    assert.equal(d.smallSample, d.sat < 200, `${s.id} smallSample 標錯（n=${d.sat}）`)
    if (d.smallSample) small.push(`${s.id}(${d.sat})`)
  }
  // 實際係音樂 173、英語文學 193、科技與生活 198（兩個單元合併）。
  assert.deepEqual(small.sort(), ['english-literature(193)', 'music(173)', 'technology-living(198)'])
})

test('公民與社會發展只設達標／未達標，永不輸出 1–5 等級', () => {
  assert.equal(isBinarySubject('csd'), true)
  assert.equal(subjectDistribution('csd'), null, 'CSD 唔應該有等級分佈')
  assert.equal(shareAtOrAbove('csd', 4), null)
})

test('平台 25 科入面，除 CSD 外每一科都有分佈', () => {
  const missing = getActiveSubjects()
    .map((s) => s.id)
    .filter((id) => !isBinarySubject(id) && subjectDistribution(id) === null)
  assert.deepEqual(missing, [], `呢啲科冇分佈數據：${missing.join(', ')}`)
})

test('shareAtOrAbove 按等級遞減 —— 級數越高，達標人數越少', () => {
  const d = subjectDistribution('economics')!
  const seq = [1, 2, 3, 4, 5, 5.5, 5.75].map((l) => shareAtOrAbove('economics', l)!)
  assert.deepEqual(seq, [...seq].sort((a, b) => b - a), '唔係遞減')
  assert.equal(shareAtOrAbove('economics', 3), d.cumulative['3+'])
  assert.equal(shareAtOrAbove('economics', 5.75), d.cumulative['5**'])
})

test('⛔ 模組唔提供任何跨科比較 —— 自我選擇偏差', () => {
  // M2 有 34.4% 考生達 5 級以上、體育 3.6%，但唔代表 M2 易過體育：M2 係自選
  // 科目，報考嘅本身就係數學能力較強嗰群。一個學生因為呢個數字轉科然後跟唔上，
  // 係我哋造成嘅傷害。所以模組層面就唔准有排序／比較函數。
  const src = readFileSync(new URL('../levelDistribution.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const banned of ['rank', 'sort', 'easiest', 'hardest', 'compareSubjects']) {
    assert.ok(!code.includes(banned), `模組唔應該有 ${banned} —— 呢個係跨科比較嘅入口`)
  }
})

test('⛔ 分佈檔唔含任何特殊需要考生統計', () => {
  const raw = readFileSync(new URL('../../data/dse-2025-level-distribution.json', import.meta.url), 'utf8')
  for (const banned of ['特殊需要', 'special needs', 'SEN', 'dyslex']) {
    assert.ok(!raw.includes(banned) || raw.includes('永不進入個人估算'),
      `分佈檔唔應該帶 ${banned} 相關數據`)
  }
})

test('檔案本身要講明呢啲唔係分數線', () => {
  const raw = JSON.parse(
    readFileSync(new URL('../../data/dse-2025-level-distribution.json', import.meta.url), 'utf8'),
  ) as { source: { caveat: string } }
  assert.match(raw.source.caveat, /從來沒有公布過任何一科的分數線/)
})
