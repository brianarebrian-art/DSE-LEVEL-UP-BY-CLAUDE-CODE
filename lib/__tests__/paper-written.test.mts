// 紙筆戰士乙部（書寫題）—— 卷號格式擴充同確定性重建。
//
// 最要緊嗰條：加乙部【唔可以】令甲部 MC 換咗一批。卷號係印咗上實體紙嘅，
// 如果加個第 5 段會連帶影響 MC 抽題，咁所有舊卷號重建出嚟就唔係原本嗰份卷 ——
// 而張紙已經喺學生手上，冇得補救。故此乙部行獨立 seed 流，並由測試守住。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { encodePaperCode, decodePaperCode, buildPaper, buildWrittenSection } =
  await import('../paper/paper.ts')
const { getSubjectMCQuestions, getWrittenQuestions } = await import('../../data/questions/index.ts')

const BASE = { subject: 'math', topic: '', size: 20, seed: 'k22k' }

// ── 卷號格式 ────────────────────────────────────────────────────────────────

test('冇乙部時卷號同舊格式逐字相同（已印出嘅紙唔可以失效）', () => {
  assert.equal(encodePaperCode(BASE), 'math~all~20~k22k')
  assert.equal(encodePaperCode({ ...BASE, written: 0 }), 'math~all~20~k22k')
})

test('四段式舊卷號照樣解得到，且唔會多出 written 欄', () => {
  assert.deepEqual(decodePaperCode('math~all~20~k22k'), BASE)
})

test('有乙部時加第 5 段，並可完整往返', () => {
  const spec = { ...BASE, subject: 'chinese', written: 2 }
  const code = encodePaperCode(spec)
  assert.equal(code, 'chinese~all~20~k22k~w2')
  assert.deepEqual(decodePaperCode(code), spec)
})

test('第 5 段格式錯或超範圍一律當無效，唔會靜靜當 0', () => {
  // 靜靜當 0 係最壞情況：學生張紙有乙部，開返嚟就話冇
  for (const bad of ['math~all~20~k22k~2', 'math~all~20~k22k~w0', 'math~all~20~k22k~w4', 'math~all~20~k22k~ww', 'math~all~20~k22k~w2~x']) {
    assert.equal(decodePaperCode(bad), null, `${bad} 應為無效`)
  }
})

// ── 加乙部對甲部零影響（本檔重點）──────────────────────────────────────────

test('加乙部之後，甲部 MC 依然係一模一樣嗰批、次序都一樣', () => {
  const pool = getSubjectMCQuestions('chinese')
  const without = buildPaper({ ...BASE, subject: 'chinese' }, pool)
  const withB = buildPaper({ ...BASE, subject: 'chinese', written: 3 }, pool)
  assert.deepEqual(
    withB.map((i) => i.question.id),
    without.map((i) => i.question.id),
    '加乙部改變咗甲部抽題 —— 舊卷號會重建唔到原本嗰份卷',
  )
  // 連選項次序都要一樣，否則紙上嘅 A/B/C/D 對唔返
  assert.deepEqual(withB.map((i) => i.options), without.map((i) => i.options))
})

// ── 乙部本身確定性 ──────────────────────────────────────────────────────────

test('同一 spec 重建到同一批書寫題（跨裝置一致）', () => {
  const pool = getWrittenQuestions('chinese')
  const spec = { ...BASE, subject: 'chinese', written: 3 }
  const a = buildWrittenSection(spec, pool).map((q) => q.id)
  const b = buildWrittenSection(spec, pool).map((q) => q.id)
  assert.deepEqual(a, b)
  assert.equal(a.length, 3)
  assert.equal(new Set(a).size, 3, '唔可以出重複題')
})

test('唔同 seed 出唔同組合', () => {
  const pool = getWrittenQuestions('chinese')
  const a = buildWrittenSection({ ...BASE, subject: 'chinese', seed: 'aaaa', written: 3 }, pool).map((q) => q.id)
  const b = buildWrittenSection({ ...BASE, subject: 'chinese', seed: 'zzzz', written: 3 }, pool).map((q) => q.id)
  assert.notDeepEqual(a, b)
})

test('written 為 0／未定義／科目冇書寫題，一律回空陣列', () => {
  const pool = getWrittenQuestions('chinese')
  assert.deepEqual(buildWrittenSection(BASE, pool), [])
  assert.deepEqual(buildWrittenSection({ ...BASE, written: 0 }, pool), [])
  assert.deepEqual(buildWrittenSection({ ...BASE, written: 3 }, []), [])
})

test('要求多過題庫存量時，取到幾多得幾多，唔會出重複題頂數', () => {
  const pool = getWrittenQuestions('chinese').slice(0, 2)
  const got = buildWrittenSection({ ...BASE, subject: 'chinese', written: 3 }, pool)
  assert.equal(got.length, 2)
  assert.equal(new Set(got.map((q) => q.id)).size, 2)
})

test('抽出嚟嘅全部係書寫題，冇混入 MC', () => {
  const mixed = [...getWrittenQuestions('chinese'), ...getSubjectMCQuestions('chinese').slice(0, 50)]
  const got = buildWrittenSection({ ...BASE, subject: 'chinese', written: 3 }, mixed)
  assert.equal(got.length, 3)
  for (const q of got) assert.notEqual(q.type, 'mc')
})
