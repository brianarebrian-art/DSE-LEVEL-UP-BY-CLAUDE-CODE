// 44px targets outside the practice flow (UX loop 37, 2026-09-30; hardening prompt §21).
// Measured at 360×800 before: footer links 17px, breadcrumbs 20px, subject filters 30px,
// search and sort 42px, 清除進度紀錄 16px, 繼續練習 on the dashboard 40px.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('footer links are 44px and sit in two columns on phones', () => {
  const f = read('components/Footer.tsx')
  assert.doesNotMatch(f, /className="hover:text-accent transition-colors"/)
  assert.doesNotMatch(f, /className="font-medium hover:text-accent transition-colors"/)
  assert.equal((f.match(/<ul className="grid grid-cols-2 gap-x-4 text-sm text-ink-muted sm:grid-cols-1">/g) ?? []).length, 2)
})

test('breadcrumbs, filters, search, sort and page buttons carry min-h-11', () => {
  const sd = read('app/subjects/[subject]/SubjectDetailView.tsx')
  assert.match(sd, /<Link href="\/" className="inline-flex min-h-11 items-center hover:text-accent">/)
  assert.match(sd, /<Link href="\/subjects" className="inline-flex min-h-11 items-center hover:text-accent">/)
  const sv = read('app/subjects/SubjectsView.tsx')
  assert.match(sv, /className="w-full min-h-11 bg-surface-raised/)
  assert.match(sv, /className="min-h-11 bg-surface-raised border border-line-strong rounded-xl px-3/)
  assert.match(sv, /inline-flex min-h-11 items-center text-xs px-3 rounded-full border/)
  assert.match(sv, /<Link href="\/" className="inline-flex min-h-11 items-center hover:text-accent">/)
  const dash = read('app/dashboard/DashboardPageClient.tsx')
  assert.match(dash, /inline-flex min-h-11 items-center gap-2 text-xs text-ink-muted hover:text-ink-soft transition-colors/)
  assert.match(read('components/SyncStatus.tsx'), /inline-flex min-h-11 items-center gap-2 bg-accent-strong/)
  assert.equal((read('app/account/AccountPageClient.tsx').match(/min-h-11 border border-rose\/40/g) ?? []).length, 2)
})

test('the home demo does not use English jargon for the cause step', () => {
  assert.doesNotMatch(read('components/BlindTestQuestion.tsx'), /Reverse Error Diagnosis/)
})
