// Phase 6 — 共融黑名單：擋辱罵變體，唔誤殺共融／教學用語。
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { scanInclusiveText } = await import('../inclusiveFilter.ts')

test('block：肥老／衰L／fei lou／hak gwai（含夾雜同全形）', () => {
  for (const raw of [
    '呢個肥老寫錯',
    '真係衰L',
    '真係衰Ｌ',
    'what a fei lou',
    'FeiLou again',
    'hak gwai 唔得',
    'HakGwai',
    '黑鬼唔得',
  ]) {
    const r = scanInclusiveText(raw)
    assert.equal(r.ok, false, raw)
    assert.ok(r.blocked.length > 0, raw)
  }
})

test('allow：失敗率／放下執念／同志／黑板（唔誤殺）', () => {
  for (const raw of [
    '呢條計失敗率有冇錯？',
    '解析叫人放下執念',
    '同志關係喺倫理科點答',
    '黑板上面嘅公式寫錯',
    'failure rate in the stem',
    'let go of the trap',
  ]) {
    const r = scanInclusiveText(raw)
    assert.equal(r.ok, true, raw)
    assert.deepEqual(r.blocked, [])
  }
})

test('allow 唔會遮住同句嘅 block', () => {
  const r = scanInclusiveText('黑板寫住肥老')
  assert.equal(r.ok, false)
  assert.ok(r.blocked.includes('肥老'))
})
