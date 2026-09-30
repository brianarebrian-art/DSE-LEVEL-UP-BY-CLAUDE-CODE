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
