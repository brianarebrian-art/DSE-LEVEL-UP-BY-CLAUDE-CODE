// /subjects intro says what the site covers, not "all live" (UX loop 24, 2026-09-30;
// hardening prompt §8).
//
// 「25 科已全部上線」read as every paper of every subject being covered. The site has
// multiple-choice practice in every subject, written questions in varying and sometimes
// small numbers, and no listening, speaking, practical or SBA practice anywhere.
// Per-subject "not applicable" needs HKEAA assessment facts, which wait for human
// verification (CONTENT_PROVENANCE.md §3), so the copy says what this site lacks instead.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const dict = readFileSync('lib/dictionary.ts', 'utf8')
const view = readFileSync('app/subjects/SubjectsView.tsx', 'utf8')

test('no "all live" claim remains', () => {
  const code = dict.replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(code, /科已全部上線|subjects are now live/)
})

test('the intro names what exists and what does not, in both languages', () => {
  assert.match(dict, /introLiveA: ' 科都有選擇題練習',/)
  assert.match(dict, /introB: '本站未有聆聽、說話、實作同校本評核練習。全部免費，無限次做。',/)
  assert.match(dict, /introB: 'There is no listening, speaking, practical or school-based assessment practice here\./)
})

test('the written-question range comes from the bank summary, not a typed number', () => {
  assert.match(view, /SUBJECT_SUMMARY\[s\.id\]\?\.written \?\? 0/)
  assert.match(view, /\{tl\.introWrittenA\}\{writtenMin\}\{tl\.introWrittenB\}\{writtenMax\}\{tl\.introWrittenC\}/)
  for (const k of ['introWrittenA', 'introWrittenB', 'introWrittenC']) {
    assert.equal((dict.match(new RegExp(`${k}: '[^']*\\d`, 'g')) ?? []).length, 0, `${k} has no digits`)
  }
})
