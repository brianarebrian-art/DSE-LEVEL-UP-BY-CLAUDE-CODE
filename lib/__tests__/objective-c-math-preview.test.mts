// Preview withdrawal of two confirmed objective-C compulsory-maths items
// (2026-11-27). They stay in the repo and drop out of every filtered student read.
// A nearby unscored maths item stays served. Other subjects are not withdrawn here.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const HIDDEN_IDS = ['math_fl_ns04', 'mb_n1_5_2'] as const
const STILL_SERVED = 'math_fl_ns05'

const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import('../../data/questions/index.ts'))
const L = pick(await import('../../data/questions/load.ts'))
const H = pick(await import('../../data/questions/hidden-topics.ts'))
const catalog = await import('../loop-engineering/catalog.ts')

test('the two objective-C maths items stay in storage and leave every student loader', async () => {
  const raw = I.getSubjectQuestionsRaw('math')
  const served = I.getSubjectQuestions('math')
  const mc = I.getSubjectMCQuestions('math')
  const loaded = await L.loadSubjectQuestions('math')
  const rawIds = new Set(raw.map((q: { id: string }) => q.id))
  const servedIds = new Set(served.map((q: { id: string }) => q.id))
  const mcIds = new Set(mc.map((q: { id: string }) => q.id))
  const loadedIds = new Set(loaded.map((q: { id: string }) => q.id))

  for (const id of HIDDEN_IDS) {
    assert.equal(rawIds.has(id), true, `${id} must remain in the repo`)
    assert.equal(servedIds.has(id), false, `${id} is still in the served bank`)
    assert.equal(mcIds.has(id), false, `${id} is still in the MC pool`)
    assert.equal(loadedIds.has(id), false, `${id} is still returned by loadSubjectQuestions`)
    assert.equal(H.isWithdrawn('math', id), true)
    assert.equal(H.withdrawnReason('math', id), 'DUPLICATE_STEM')
    assert.equal(H.countsAsWithdrawnFault('DUPLICATE_STEM'), false)
  }

  assert.equal(servedIds.has(STILL_SERVED), true, `${STILL_SERVED} must stay in the served bank`)
  assert.equal(loadedIds.has(STILL_SERVED), true)
  const rows = catalog.buildCatalog('math', loaded)
  const neighbor = rows.find((row) => row.id === STILL_SERVED)
  assert.ok(neighbor, `${STILL_SERVED} missing from the maths catalog`)
  assert.equal(neighbor.grade, 'unscored')
  assert.equal(rows.some((row) => row.id === 'math_fl_ns04' || row.id === 'mb_n1_5_2'), false)
  assert.ok(rows.filter((row) => row.grade === 'unscored').length >= 1631)

  const archive = JSON.parse(readFileSync('data/questions/archive/objective-c-math-2026-11-27.json', 'utf8'))
  assert.deepEqual(archive.items.map((item: { id: string }) => item.id).sort(), [...HIDDEN_IDS].sort())
  assert.equal(JSON.stringify(archive).includes('sqrt'), false)
  assert.equal(archive.appliedToProductionDatabase, false)

  const bookmarks = readFileSync('app/bookmarks/BookmarksView.tsx', 'utf8')
  assert.match(bookmarks, /DUPLICATE_STEM/)
  assert.match(bookmarks, /收藏會保留/)
  assert.match(bookmarks, /isWithdrawn\(bm\.subjectId, bm\.questionId\)/)
  assert.match(readFileSync('app/api/practice/check/route.ts', 'utf8'), /loadBank\(subjectId\)/)
  assert.match(readFileSync('app/api/paper/build/route.ts', 'utf8'), /loadMcBank/)
  assert.match(readFileSync('lib/practice/bankCache.ts', 'utf8'), /loadSubjectQuestions\(subjectId\)/)
  assert.match(readFileSync('lib/recommendNext.ts', 'utf8'), /Published topics/)

  const chinese = await L.loadSubjectQuestions('chinese')
  assert.equal(chinese.some((q: { id: string }) => q.id === 'zh_ch_106'), true, 'another subject C item must stay served')
})
