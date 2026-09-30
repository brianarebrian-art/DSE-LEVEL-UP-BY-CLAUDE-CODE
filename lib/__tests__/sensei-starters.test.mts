// Knowledge cards page: plain name first, and starter questions that always find a card
// (UX loop 35, 2026-09-30; hardening prompt §24–§25).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const d: any = await import('../../data/sensei/index.ts')
const i: any = await import('../sensei/intent.ts')
const s: any = await import('../sensei/starters.ts')
const D = d.default?.mathSenseiCards ? d.default : d
const I = i.default?.rankCards ? i.default : i
const S = s.default?.SENSEI_STARTERS ? s.default : s
const cards = [...D.chineseSenseiCards, ...D.englishSenseiCards, ...D.mathSenseiCards, ...D.economicsSenseiCards]

test('every starter question finds its intended approved card first', () => {
  for (const lang of ['zh', 'en'] as const) {
    assert.ok(S.SENSEI_STARTERS[lang].length >= 2, lang)
    for (const { q, card } of S.SENSEI_STARTERS[lang]) {
      const top = I.rankCards(q, cards)[0]
      assert.equal(top?.card?.id ?? top?.id, card, `${lang}: ${q}`)
    }
  }
})

test('the page is named for what it does, says where answers come from, and keeps the AI badge', () => {
  const src = readFileSync('app/sensei/SenseiClient.tsx', 'utf8')
  assert.match(src, /\{en \? 'Knowledge cards' : '知識卡'\}<\/h1>/)
  assert.match(src, /答案只來自本站已由具名真人審核的知識卡/)
  assert.match(src, /\{en \? AI_BADGE\.en : AI_BADGE\.zh\}/, 'charter §16.B badge stays')
  assert.match(src, /isIdentityQuestion\(q\)/, 'identity check still runs first')
  assert.match(src, /onClick=\{\(\) => \{ setInput\(s\.q\); void run\(s\.q\) \}\}/)
})
