// Findings from the R2-11 browser accessibility scan (2026-10-01; prompt §14–§16).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const code = (p: string) =>
  readFileSync(p, 'utf8').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')

test('/answer-sheet has exactly one h1 (the client heading)', () => {
  assert.doesNotMatch(code('app/answer-sheet/page.tsx'), /<h1[\s>]/)
  assert.equal((code('app/answer-sheet/AnswerSheetClient.tsx').match(/<h1[\s>]/g) ?? []).length, 1)
})

test('/dashboard empty state does not jump from h1 to h3', () => {
  assert.match(code('app/dashboard/DashboardPageClient.tsx'), /<GoodTodayCard className="mt-4 text-left" headingLevel=\{2\} \/>/)
  assert.match(code('components/GoodTodayCard.tsx'), /headingLevel === 2 \? 'h2' : 'h3'/)
})

test('/writing: the draft has a label and the 1–7 ratings expose their state', () => {
  const s = code('app/writing/WritingClient.tsx')
  assert.match(s, /aria-label=\{tr\('文章草稿', 'Article draft'\)\}/)
  assert.match(s, /aria-pressed=\{scores\[d\.key\] === band\}/)
  assert.match(s, /className=\{`min-h-11 py-2 rounded-lg/)
})

test('/sensei search field and button are 44px tall', () => {
  const s = code('app/sensei/SenseiClient.tsx')
  assert.match(s, /className="min-h-11 flex-1 min-w-0 rounded-lg/)
  assert.match(s, /type="submit"[\s\S]{0,80}className="inline-flex min-h-11/)
})
