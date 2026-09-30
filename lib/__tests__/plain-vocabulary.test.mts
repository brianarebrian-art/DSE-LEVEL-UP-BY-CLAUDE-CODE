// Plain names first, brand names second (UX loop 36, 2026-09-30; hardening prompt §24).
// 紙筆戰士 stays as the page's subtitle; everywhere a student chooses where to go, the
// label says what it is: a printable practice set.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const strip = (s: string) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')

test('navigation labels use the plain name', () => {
  const dict = readFileSync('lib/dictionary.ts', 'utf8')
  assert.match(dict, /paper: '列印練習卷',/)
  assert.match(dict, /paper: 'Printable practice set',/)
})

test('the brand name appears only as the page subtitle', () => {
  const pw = readFileSync('app/paper-warrior/PaperWarriorClient.tsx', 'utf8')
  const h1 = pw.slice(pw.indexOf('<h1'), pw.indexOf('</h1>'))
  assert.match(h1, /列印練習卷/)
  assert.match(readFileSync('app/paper-warrior/page.tsx', 'utf8'), /title: '列印練習卷 \| DSE Level Up'/)
  assert.equal((strip(pw).match(/紙筆戰士/g) ?? []).length, 1, 'once, as the subtitle')
  for (const f of ['app/answer-sheet/AnswerSheetClient.tsx', 'app/subjects/SubjectsView.tsx', 'components/Footer.tsx']) {
    assert.doesNotMatch(strip(readFileSync(f, 'utf8')), /紙筆戰士|Paper Warrior/, f)
  }
})
