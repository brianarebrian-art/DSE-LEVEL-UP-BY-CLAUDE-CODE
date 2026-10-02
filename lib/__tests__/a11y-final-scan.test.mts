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

// Keyboard (R2-11, prompt §15): links inside a visually hidden block took Tab focus off
// screen. On /practice a keyboard user pressed Tab 25 times before reaching the question.
test('links inside visually hidden blocks are not in the Tab order', async () => {
  const { readdirSync, statSync } = await import('node:fs')
  const { join } = await import('node:path')
  const bad: string[] = []
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f)
      if (f === '__tests__' || f === 'node_modules') continue
      if (statSync(p).isDirectory()) { walk(p); continue }
      if (!/\.tsx$/.test(f)) continue
      const src = readFileSync(p, 'utf8')
      for (const m of src.matchAll(/^( *)<div className="sr-only">/gm)) {
        const end = src.indexOf(`\n${m[1]}</div>`, m.index)
        const block = src.slice(m.index, end < 0 ? undefined : end)
        for (const a of block.matchAll(/<(a|Link)\s[^>]*>/g)) if (!/tabIndex=\{-1\}/.test(a[0])) bad.push(`${p}: ${a[0].slice(0, 60)}`)
      }
    }
  }
  walk('app'); walk('components')
  assert.deepEqual(bad, [])
})

// Keyboard (R2-11): the chosen option becomes disabled, so focus fell back to <body>.
test('after answering, lost focus moves to the feedback region without scrolling', () => {
  const s = code('app/practice/PracticeSession.tsx')
  assert.match(s, /if \(!active \|\| active === document\.body \|\| active\.disabled\) el\.focus\(\{ preventScroll: true \}\)/)
  assert.match(s, /<div ref=\{feedbackRef\} tabIndex=\{-1\} className="animate-slide-up focus:outline-none">/)
})

// 2026-10-02：錯因自診已刪除（憲章 §7.2），答完之後焦點由上面嗰條規則交畀回饋區。
test('no leftover focus hand-off for the removed cause buttons', () => {
  const s = code('app/practice/PracticeSession.tsx')
  assert.doesNotMatch(s, /diagnosedNextRef/)
})
