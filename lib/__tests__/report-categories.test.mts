// Question report categories cover what students run into (UX loop 30, 2026-09-30;
// hardening prompt §34). Reports still go by email or copy-paste, never to a table.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = readFileSync('components/ReportQuestionButton.tsx', 'utf8')

test('the categories include answer, explanation, ambiguity, topic, scope/difficulty and other', () => {
  for (const key of ['answer', 'explain', 'wording', 'topic', 'scope', 'other']) {
    assert.match(src, new RegExp(`\\{ key: '${key}', zh: '[^']+', en: '[^']+' \\}`), key)
  }
  assert.match(src, /key: 'topic', zh: '課題分類錯'/)
})

test('reports are not stored by the site', () => {
  const code = src.replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(code, /localStorage|fetch\(|\/api\//)
})

// Refinement loop 2 (2026-09-30; prompt §20–§21): reports stay email-only and the dialog
// says so; opening the email app is "prepared", not "sent".
test('the report dialog is honest about email delivery and stores nothing', () => {
  const src = readFileSync('components/ReportQuestionButton.tsx', 'utf8')
  const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')
  assert.match(code, /報告會透過你自己嘅電郵寄出，本站唔會儲存。/)
  assert.match(code, /報告已準備。要喺你嘅電郵程式撳「傳送」先算寄出/)
  assert.match(code, /onClick=\{\(\) => setPrepared\(true\)\}/)
  assert.doesNotMatch(code, /localStorage|fetch\(|supabase|已送出|已提交|submitted/i)
})
