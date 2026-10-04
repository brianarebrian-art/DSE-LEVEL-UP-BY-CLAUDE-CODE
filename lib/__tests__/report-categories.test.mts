// Question report categories cover what students run into (UX loop 30, 2026-09-30;
// hardening prompt §34). Since 2026-10-04 (audit #7, founders' reply "a") a report can also be
// sent to the site, which stores only the question id, category and language; the student's own
// description still goes only by email.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = readFileSync('components/ReportQuestionButton.tsx', 'utf8')
const lib = readFileSync('lib/questionReport.ts', 'utf8')

test('the categories include answer, explanation, ambiguity, topic, scope/difficulty and other', () => {
  for (const key of ['answer', 'explain', 'wording', 'topic', 'scope', 'other']) {
    assert.match(lib, new RegExp(`\\{ key: '${key}', zh: '[^']+', en: '[^']+' \\}`), key)
  }
  assert.match(lib, /key: 'topic', zh: '課題分類錯'/)
})

test('the button talks to /api/report only and keeps nothing on the device', () => {
  const code = src.replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(code, /localStorage|supabase/i)
  assert.deepEqual(code.match(/fetch\('[^']+'/g), ["fetch('/api/report'"])
})

// Refinement loop 2 (2026-09-30; prompt §20–§21): opening the email app is "prepared", not
// "sent". Since 2026-10-04 the dialog also has Send, and says "sent" only after the server
// confirms; the email part says the site does not store what the student writes.
test('the report dialog is honest about what is sent, stored and only prepared', () => {
  const src = readFileSync('components/ReportQuestionButton.tsx', 'utf8')
  const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')
  assert.match(code, /我哋只會收到題號同問題類別，唔會知道你係邊個。/)
  assert.match(code, /呢度寫嘅字只會經你自己嘅電郵寄出，本站唔會儲存。/)
  assert.match(code, /報告已準備。要喺你嘅電郵程式撳「傳送」先算寄出/)
  assert.match(code, /onClick=\{\(\) => setPrepared\(true\)\}/)
  // "已送出" appears only on the send === 'sent' branch, never for the email path
  assert.equal(code.match(/已送出/g)?.length, 1)
  assert.match(code, /send === 'sent' \? \(en \? 'Sent' : '已送出'\)/)
  assert.doesNotMatch(code, /已提交|submitted/i)
})
