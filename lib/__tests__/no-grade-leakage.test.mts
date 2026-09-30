// Places that used to show a student a DSE level worked out from practice
// (refinement loop 2, 2026-09-30; prompt §7). The stored `grade` field in dse_progress is
// left as it is (it is a synced key); it is simply no longer shown.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const code = (p: string) =>
  readFileSync(p, 'utf8').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

test('progress page shows no grade chips', () => {
  const s = code('app/dashboard/DashboardPageClient.tsx')
  assert.doesNotMatch(s, /gradeBgColors|bestGrade|a\.grade/)
  assert.match(s, /getPracticePerformanceBand\(a\.score, a\.total\)/)
})

test('answer sheet save message has no grade', () => {
  assert.doesNotMatch(code('app/answer-sheet/AnswerSheetClient.tsx'), /等級 \$\{saved\.grade\}|grade \$\{saved\.grade\}/)
})

test('writing self-assessment never names a DSE level', () => {
  const s = code('app/writing/WritingClient.tsx')
  assert.doesNotMatch(s, /預估 [1-5]|Estimated [1-5]|5\*\*/)
  assert.match(s, /不是 DSE 等級/)
})

test('verify API does not return a grade', () => {
  assert.doesNotMatch(code('app/api/result/verify/route.ts'), /predictGrade|\bgrade\b/)
})

test('help copy no longer promises a level range on the result page', () => {
  assert.doesNotMatch(code('components/FAQSection.tsx'), /結果頁會直接寫出範圍|result page states the range/)
  assert.doesNotMatch(code('app/trust/TrustClient.tsx'), /我個等級係點嚟|Where does my level come from/)
})
