// Student-facing subject copy and homepage claims (2026-09-29).
//
// 1. Subject descriptions are shown on /subjects, on each subject page, and in search
//    results. Internal planning notes had leaked into them: a Visual Arts or Music
//    student read 「冷門科目、後期補上」 about their own subject.
// 2. The homepage stat wall showed 「10 年 · 年份分析（2014–2023）」 and
//    「25 個核心思維框架」, neither of which the question bank supports (charter §8).
// 3. Search descriptions promise 「每題附解析」, so every live question must have one.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const subjectsMod = await import('../../data/subjects.ts')
const S = (subjectsMod as { default?: typeof subjectsMod }).default ?? subjectsMod
const questionsMod = await import('../../data/questions/index.ts')
const Q = (questionsMod as { default?: typeof questionsMod }).default ?? questionsMod

const INTERNAL_NOTES =
  /冷門|後期補上|小眾|忠實用戶|最易改寫|自動批改|需大量內容改寫|較熱門|熱門選修|高需求|最多考生|added later|smaller subject|niche|loyal users|easiest to rewrite|auto-marked|content rewriting|popular elective|high demand|largest entry/i

test('subject descriptions carry no internal planning notes', () => {
  for (const s of S.subjects) {
    assert.doesNotMatch(s.description, INTERNAL_NOTES, `${s.id} description`)
    assert.doesNotMatch(s.descriptionEn, INTERNAL_NOTES, `${s.id} descriptionEn`)
    assert.ok(s.description.trim() && s.descriptionEn.trim(), `${s.id} has both descriptions`)
  }
})

test('the maths description no longer claims 10 years and 12 frameworks', () => {
  const math = S.getSubject('math')!
  assert.doesNotMatch(math.description, /10 年|12 個/)
  assert.doesNotMatch(math.descriptionEn, /10 years|12 core/)
})

test('subject pages use the fuller search description', () => {
  const math = S.getSubject('math')!
  const d = S.subjectMetaDescription(math)
  assert.ok(d.startsWith(math.name), 'starts with the subject name')
  assert.ok(d.includes(math.description), 'keeps the topic list')
  assert.match(read('app/subjects/[subject]/page.tsx'), /description: subjectMetaDescription\(meta\)/)
})

test('every live question has an explanation, as the search description says', () => {
  for (const s of S.getActiveSubjects()) {
    const missing = Q.getSubjectQuestions(s.id).filter((q) => !String(q.explanation ?? '').trim())
    assert.equal(missing.length, 0, `${s.id}: ${missing.slice(0, 5).map((q) => q.id).join(', ')}`)
  }
})

test('the homepage stat wall has no unsupported numbers', () => {
  const page = read('app/page.tsx')
  const dict = read('lib/dictionary.ts')
  assert.match(page, /const statNums = \[TOTAL_QUESTIONS, SESSION_SIZE, 0\]/)
  assert.doesNotMatch(dict, /label: '年份分析|label: '核心思維框架'|Years analysed|Core thinking frameworks/)
  assert.doesNotMatch(dict, /trust2: '✓ 涵蓋全部 DSE 科目'|trust2: '✓ Every DSE subject'/)
})

test('the homepage hero does not wait for JavaScript to become visible', () => {
  const page = read('app/page.tsx')
  const hero = page.slice(page.indexOf('── HERO ──'), page.indexOf('── 信任列 ──'))
  assert.ok(hero.length > 0, 'hero section found')
  // Comments mention the old class by name; only real className strings count.
  assert.doesNotMatch(hero.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''), /className="[^"]*animate-on-scroll/)
  assert.match(hero, /hero-rise/)
  assert.match(read('app/globals.css'), /@keyframes hero-rise/)
  // The primary call to action comes before the alumni line and trust chips.
  assert.ok(hero.indexOf('hero.ctaStartHref') < hero.indexOf('h.trust1'), 'CTA before trust chips')
  // Size the mascot through its wrapper: an unlayered `img { height: auto }` in
  // globals.css overrides any Tailwind height class on the image itself.
  assert.doesNotMatch(hero, /<Mascot[^>]*className="[^"]*\bh-\[/)
})
