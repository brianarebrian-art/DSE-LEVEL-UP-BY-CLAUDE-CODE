// Trust hardening, Yuna's decisions of 2026-09-29 (docs/DECISIONS-2026-09-29.md).
//
// 1. The 176 questions whose explanations referred to options by position are
//    withdrawn until each explanation is rewritten.
// 2. Until a lawyer or the HKEAA has confirmed it, no public text says that AI
//    analysed past papers. The HKEAA copyright notice bars use of its publications
//    "in relation to any artificial intelligence or machine learning model".
// 3. The result page says plainly that its level is a platform estimate, not an
//    HKEAA grade prediction, and the share text no longer says "predicted grade".
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const withdrawn = JSON.parse(read('data/questions/withdrawn.json')) as Record<string, Record<string, { date: string; reason: string }>>

const idxMod = await import('../../data/questions/index.ts')
const I = (idxMod as { default?: typeof idxMod }).default ?? idxMod
const flagsMod = await import('../../data/qualityFlags.ts')
const F = (flagsMod as { default?: typeof flagsMod }).default ?? flagsMod

test('the positional-explanation batch is withdrawn with a date and a reason', () => {
  const batch = Object.entries(withdrawn).flatMap(([subject, byId]) =>
    Object.entries(byId)
      .filter(([, r]) => r.date === '2026-09-29' && r.reason === 'POSITIONAL_RATIONALE_REFERENCE')
      .map(([id]) => ({ subject, id })),
  )
  // Historical batch size, not a live statistic (live counts: CONTENT_STATS). The batch
  // shrinks as rewritten questions are restored with withdraw.mts --undo.
  const HISTORICAL_BATCH_2026_09_29 = 176 + 135 + 286 // docs/rationale-repairs.md
  assert.ok(batch.length > 0 && batch.length <= HISTORICAL_BATCH_2026_09_29, `${batch.length}`)
  for (const { subject, id } of batch) {
    assert.ok(!I.getSubjectQuestions(subject).some((q) => q.id === id), `${subject}/${id} is still served`)
    assert.ok(I.getSubjectQuestionsRaw(subject).some((q) => q.id === id), `${subject}/${id} was deleted, not withdrawn`)
  }
})

test('no served question is still flagged for positional explanations', () => {
  assert.deepEqual(Object.keys(F.FLAGGED), [])
})

test('the transparency page reports withdrawn questions instead of claiming zero problems', () => {
  const page = read('app/transparency/TransparencyClient.tsx')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  assert.match(page, /WITHDRAWN_COUNT/)
  assert.doesNotMatch(page, /我哋選擇攤出嚟，而唔係收埋|We show them instead of hiding them/)
})

// Every file whose text reaches a visitor or an AI agent.
function publicFiles(): string[] {
  const out = ['lib/dictionary.ts', 'data/heroContent.ts', 'public/llms.txt']
  const walk = (dir: string) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const p = join(dir, name)
      if (name === '__tests__' || name === 'api') continue
      if (statSync(join(ROOT, p)).isDirectory()) walk(p)
      else if (p.endsWith('.tsx')) out.push(p)
    }
  }
  walk('app')
  walk('components')
  return out
}

test('no public text says AI analysed past papers', () => {
  const claim =
    /(AI|人工智能)[^'"`\n]{0,40}(試卷|歷屆|past[- ]papers?|DSE papers)|(試卷|歷屆試題|past[- ]papers?)[^'"`\n]{0,40}(AI\b|人工智能)|2012–2025 (歷屆|past)|analy[sz]e (10|ten) years of (DSE )?papers/
  const hits: string[] = []
  for (const f of publicFiles()) {
    read(f).split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*|\{\/\*)/.test(line)) return // comments explain the removal
      if (claim.test(line)) hits.push(`${f}:${i + 1}`)
    })
  }
  assert.deepEqual(hits, [])
})

test('llms.txt describes the automated publishing rule, not the old named approval', () => {
  const txt = read('public/llms.txt')
  assert.doesNotMatch(txt, /Nothing enters the bank automatically/)
  assert.match(txt, /no person approves them beforehand/)
})

test('the result page calls its level a platform estimate', () => {
  const dict = read('lib/dictionary.ts')
  // Refinement loop 2 (2026-09-30): the result page no longer shows a level at all.
  assert.match(dict, /並不是 HKEAA 官方成績或預測/)
  assert.match(dict, /not an HKEAA result or a prediction of one/)
  assert.doesNotMatch(dict, /shareTextC: ' 分，預測等級 '|shareTextC: ', predicted grade '/)
})
