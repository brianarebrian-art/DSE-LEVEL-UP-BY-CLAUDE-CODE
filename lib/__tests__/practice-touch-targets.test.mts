// Every control in the answer flow is at least 48px tall (UX loop 17, P0-5, 2026-09-30).
//
// Measured at 375×812 after answering: the header buttons, 睇埋成個解析, the emotion
// tags and 收藏 were 44px; the 下一題想要 difficulty chips were 27px. The two text
// links inside the provenance sentence are inline links (WCAG 2.5.8 exception) and
// are left as they are.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const FILES = [
  'app/practice/PracticeSession.tsx',
  'app/practice/LongPracticeSession.tsx',
  'components/PracticeSupport.tsx',
  'components/StagedExplanation.tsx',
  'components/BookmarkButton.tsx',
  'components/EmotionTags.tsx',
]
const code = (p: string) => readFileSync(p, 'utf8').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')

test('no 44px minimum is left in the practice flow', () => {
  for (const f of FILES) assert.doesNotMatch(code(f), /\bmin-h-11\b/, f)
})

test('the next-question difficulty chips are 48px targets', () => {
  const s = code('app/practice/PracticeSession.tsx')
  const at = s.indexOf("tr('下一題想要：', 'Next one:')")
  assert.match(s.slice(at, at + 1500), /inline-flex min-h-12 items-center px-3 rounded-full border/)
})
