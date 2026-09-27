// 不考之地 topic cards (data/offSyllabus). Yuna 2026-09-27: all 200 cards on /off-syllabus.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const m: any = await import('../../data/offSyllabus/index.ts')
const D = m.CATEGORIES ? m : m.default
const cards = D.CATEGORIES.flatMap((c: any) => c.cards)

test('200 cards, numbered 1 to 200 in order, 20 per category', () => {
  assert.equal(D.CATEGORIES.length, 10)
  assert.deepEqual(cards.map((c: any) => c.id), Array.from({ length: 200 }, (_, i) => i + 1))
  D.CATEGORIES.forEach((cat: any, i: number) => {
    assert.equal(cat.cards.length, 20, cat.slug)
    assert.equal(cat.cards[0].id, i * 20 + 1, `${cat.slug} starts at the wrong id`)
  })
})

test('every card has all five parts', () => {
  for (const c of cards) {
    for (const k of ['title', 'hook', 'scene', 'trivia', 'chat']) {
      assert.ok(typeof c[k] === 'string' && c[k].trim(), `#${c.id} ${k} is empty`)
    }
    assert.ok(c.tags.length && c.dialogue.length && c.explain.length, `#${c.id} has an empty list`)
    const n = c.trivia.replace(/\s/g, '').length
    assert.ok(n >= 80 && n <= 200, `#${c.id} trivia is ${n} characters`)
  }
})

test('no quizzes, scores or answers anywhere (the brief forbids them)', () => {
  const text = JSON.stringify(cards)
  assert.doesNotMatch(text, /quiz|選擇題|答案係|得分|計分/i)
})

test('the page lists every category and each category has its own static page', () => {
  const view = readFileSync('app/off-syllabus/OffSyllabusView.tsx', 'utf8')
  assert.match(view, /href=\{`\/off-syllabus\/\$\{c\.slug\}`\}/)
  const page = readFileSync('app/off-syllabus/[category]/page.tsx', 'utf8')
  assert.match(page, /generateStaticParams/)
  assert.ok(existsSync('app/off-syllabus/[category]/CategoryView.tsx'))
})

test('the AI-help note is shown on the category page', () => {
  assert.match(readFileSync('app/off-syllabus/[category]/CategoryView.tsx', 'utf8'), /\{o\.aiNote\}/)
  assert.match(readFileSync('lib/dictionary.ts', 'utf8'), /aiNote: '話題卡由 AI 協助撰寫/)
})
