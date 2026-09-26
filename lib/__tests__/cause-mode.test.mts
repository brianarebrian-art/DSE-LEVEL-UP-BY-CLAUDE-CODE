// Practice by error cause (UX audit F1 (a); Yuna 2026-09-21, carried out 2026-09-26).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const cw: any = await import('../commandWords.ts')
const CW = cw.default?.hasCommandWord ? cw.default : cw
const cm: any = await import('../causeMode.ts')
const CM = cm.default?.orderByCause ? cm.default : cm

test('hasCommandWord gives the same answer every time (no /g lastIndex state)', () => {
  const s = 'Which of the following is NOT a reason?'
  assert.deepEqual([1, 2, 3, 4].map(() => CW.hasCommandWord(s)), [true, true, true, true])
  assert.equal(CW.hasCommandWord('下列哪項並非原因？'), true)
  assert.equal(CW.hasCommandWord('政府消除了貿易壁壘。'), false, '消除了 is not a command word')
  assert.equal(CW.hasCommandWord('所有權屬於誰？'), false, '所有權 is not a command word')
  assert.equal(CW.hasCommandWord('Write a note on the cannon.'), false)
})

test('the highlight component uses the shared word list, not its own copy', () => {
  const src = readFileSync('components/CommandWordText.tsx', 'utf8')
  assert.match(src, /from '@\/lib\/commandWords'/)
  assert.doesNotMatch(src, /except\\s\+for/, 'a second copy of the word list would drift')
})

const q = (id: string, topic: string, content: string) => ({ id, topic, content })
const log = (cause: string, topicId: string, subjectId = 'economics') => ({
  subjectId, questionId: 'x', topic: topicId, topicId, cause, selected: '', correct: '', ts: 0,
})

test('B puts command-word questions first and keeps the rest', () => {
  const bank = [q('1', 't', '以下哪項正確？'), q('2', 't', '以下哪項並非原因？'), q('3', 't', '計算 3 + 4')]
  const out = CM.orderByCause(bank, 'B', [], 'economics').map((x: any) => x.id)
  assert.deepEqual(out, ['2', '1', '3'])
  const en = [q('1', 't', '哪項是原因？'), { ...q('2', 't', '哪項是原因？'), contentEn: 'Which is NOT a cause?' }]
  assert.deepEqual(CM.orderByCause(en, 'B', [], 'economics').map((x: any) => x.id), ['2', '1'], 'the English stem counts too')
})

test('A uses topics the student marked A in this subject only', () => {
  const bank = [q('1', 'demand', '...'), q('2', 'supply', '...'), q('3', 'money', '...')]
  const entries = [log('A', 'money'), log('C', 'demand'), log('A', 'supply', 'physics')]
  assert.deepEqual(CM.orderByCause(bank, 'A', entries, 'economics').map((x: any) => x.id), ['3', '1', '2'])
})

test('C needs a C topic and a number or formula in the stem', () => {
  const bank = [q('1', 'money', '貨幣的功能是？'), q('2', 'money', '若利率為 5%，求……'), q('3', 'trade', '$x^2$')]
  assert.deepEqual(CM.orderByCause(bank, 'C', [log('C', 'money')], 'economics').map((x: any) => x.id), ['2', '1', '3'])
})

test('A and C only offer a session when the log has topic ids for them', () => {
  assert.equal(CM.causeHasMaterial([], 'economics', 'B'), true)
  assert.equal(CM.causeHasMaterial([], 'economics', 'A'), false)
  assert.equal(CM.causeHasMaterial([log('A', 'money')], 'economics', 'A'), true)
  assert.equal(CM.parseCause('B'), 'B')
  assert.equal(CM.parseCause('D'), null)
})

test('the session reorders before stratifying, so 3:5:2 still holds', () => {
  const src = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  const reorder = src.indexOf("if (mode === 'cause' && cause) ordered = orderByCause(")
  const stratify = src.indexOf('return shuffle(pickByDifficulty(weighted, sessionSize))')
  assert.ok(reorder > 0 && reorder < stratify)
})

test('the pattern card links to a cause session', () => {
  const src = readFileSync('components/ErrorDNA.tsx', 'utf8')
  assert.match(src, /mode=cause&cause=\$\{head\}/)
  assert.match(src, /即刻練返呢類/)
  const shell = readFileSync('app/practice/PracticeShell.tsx', 'utf8')
  assert.match(shell, /rawMode === 'cause' && cause \? 'cause'/)
})
