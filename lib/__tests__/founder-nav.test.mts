import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const { FOUNDER_ALL_HREFS, FOUNDER_NAV } = await import('../founder/nav.ts')
const { classifyCommand, searchFounderNav, payloadHash } = await import('../founder/command.ts')
const { shouldNoIndex } = await import('../seoPolicy.ts')
const { isImmersiveRoute } = await import('../immersiveRoutes.ts')

test('導航無死連結：每個 href 都有對應 app/founder page', () => {
  const root = join(process.cwd(), 'app')
  for (const href of FOUNDER_ALL_HREFS) {
    assert.ok(href.startsWith('/founder'), href)
    const rel = href.replace(/^\//, '')
    const page = join(root, rel, 'page.tsx')
    assert.ok(existsSync(page), `缺少頁面：${page}`)
  }
})

test('導航分組完整且無重複 href', () => {
  assert.ok(FOUNDER_NAV.length >= 8)
  const set = new Set(FOUNDER_ALL_HREFS)
  assert.equal(set.size, FOUNDER_ALL_HREFS.length)
})

test('/founder 必須 noindex 且 immersive', () => {
  assert.equal(shouldNoIndex('/founder'), true)
  assert.equal(shouldNoIndex('/founder/questions'), true)
  assert.equal(isImmersiveRoute('/founder'), true)
  assert.equal(isImmersiveRoute('/founder/ai'), true)
})

test('指令分類：唯讀／草稿／副作用', () => {
  assert.equal(classifyCommand('草擬今日創辦人簡報').kind, 'draft')
  assert.equal(classifyCommand('比較最近四星期各科錯題回報率').kind, 'readonly')
  assert.equal(classifyCommand('找出未完成覆核嘅最近發佈題目').kind, 'readonly')
  const side = classifyCommand('為 math-q-001 建立覆核任務草稿')
  assert.equal(side.kind, 'side_effect')
  assert.equal(side.requiresConfirm, true)
  assert.ok(classifyCommand('發佈全部題目').requiresConfirm)
})

test('確認 hash：內容變就要重新確認', () => {
  const a = payloadHash('x', { id: 1 })
  const b = payloadHash('x', { id: 2 })
  assert.notEqual(a, b)
  assert.equal(a.length, 64)
})

test('導航搜尋', () => {
  const hits = searchFounderNav('題目')
  assert.ok(hits.some((h) => h.href.includes('/founder/questions')))
  assert.ok(searchFounderNav('questions').some((h) => h.href === '/founder/questions'))
})
