// The FAQ says where the tools actually are (UX loop 29, 2026-09-30).
// Since loop 3 「今日夠了」 is at the top of each question, and since loop 18 the phone
// accessibility entry is in the page header; the FAQ still described a bottom-left corner.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('FAQ copy matches the current tool locations', () => {
  const faq = readFileSync('components/FAQSection.tsx', 'utf8')
  assert.doesNotMatch(faq, /練習頁左下角係無障礙工具角|accessibility corner in the bottom-left/)
  assert.match(faq, /手機頁頂嘅無障礙掣/)
  assert.match(faq, /at the top of the page on phones/)
  // The facts the copy relies on.
  assert.match(readFileSync('components/Navbar.tsx', 'utf8'), /<A11yButton \/>/)
  assert.match(readFileSync('app/practice/PracticeSession.tsx', 'utf8'), /<EnoughTodayButton \/>/)
  assert.doesNotMatch(readFileSync('content/community/faq.md', 'utf8'), /練習頁左下角嘅開關/)
})
