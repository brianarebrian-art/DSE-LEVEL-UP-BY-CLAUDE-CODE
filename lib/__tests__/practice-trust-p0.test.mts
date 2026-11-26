import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import type { MCQuestion } from '../../data/questions/types.ts'
import { projectPaperMc, toPublicMc, toStem, checkMc } from '../practice/publicQuestion.ts'
import { conceptPreview } from '../practice/conceptPreview.ts'
import { assertNoAnswerLeak } from '../practice/serverSession.ts'
import { difficultyTier } from '../difficulty.ts'

const sample: MCQuestion = {
  id: 'mb_demo_1',
  type: 'mc',
  subject: 'math',
  topic: 'logarithms',
  topicZh: '對數',
  framework: 'algebra',
  frameworkZh: '代數',
  frameworkEmoji: '',
  difficulty: 'easy',
  year: 0,
  content: '求 $\\log_{5} 125$ 的值。',
  options: ['3', '5', '25', '15'],
  optionsEn: ['3', '5', '25', '15'],
  correctIndex: 0,
  explanation: '125 = 5^{3}，故 log_5 125 = 3。',
  explanationEn: '125 = 5^3, so the logarithm is 3.',
  steps: ['Write 125 as a power of 5.', 'Read off the index.'],
  mcHack: 'Count the factors of 5.',
  marks: 1,
}

test('public practice items do not carry answer keys', () => {
  const pub = toPublicMc(sample, () => 0.9)
  const json = JSON.stringify(pub)
  assert.equal(assertNoAnswerLeak(pub).length, 0)
  assert.equal(json.includes('correctIndex'), false)
  assert.equal(json.includes('explanation'), false)
  assert.equal(json.includes('mcHack'), false)
  assert.equal(pub.options.length, 4)
  assert.ok(pub.options.includes('3'))
})

test('check returns the explanation only for a real option', () => {
  const hit = checkMc(sample, '5')
  assert.ok(hit)
  assert.equal(hit!.correct, false)
  assert.equal(hit!.correctText, '3')
  assert.match(hit!.explanation, /125/)
  assert.equal(checkMc(sample, 'not-an-option'), null)
  const right = checkMc(sample, '3')
  assert.equal(right!.correct, true)
  assert.deepEqual(right!.steps, sample.steps)
})

test('questions-only paper items omit the answer index and explanation', () => {
  const item = {
    question: sample,
    options: ['5', '3', '25', '15'],
    optionsEn: ['5', '3', '25', '15'],
    answerIndex: 1,
  }
  const hidden = projectPaperMc(item, false)
  assert.equal('answerIndex' in hidden, false)
  assert.equal('explanation' in hidden, false)
  assert.equal(assertNoAnswerLeak(hidden).length, 0)
  const shown = projectPaperMc(item, true)
  assert.equal(shown.answerIndex, 1)
  assert.match(shown.explanation ?? '', /125/)
})

test('bookmark stems and concept previews do not carry an answer index', () => {
  const stem = toStem(sample)
  assert.equal(JSON.stringify(stem).includes('correctIndex'), false)
  assert.equal('explanation' in stem, false)
  assert.equal('options' in stem, false)
  const preview = conceptPreview([sample], 'lunyu')
  assert.equal(preview.length, 0)
  const hit = conceptPreview(
    [{ ...sample, content: '《論仁》一則。', topicZh: '論仁' }],
    'lunyu',
  )
  assert.equal(hit.length, 1)
  assert.equal('correctIndex' in hit[0], false)
  assert.equal('options' in hit[0], false)
  assert.match(hit[0].explanation, /125/)
})

test('questions-only toggle drops the previous paper, and notes clear on topic change', () => {
  const paper = readFileSync(new URL('../../app/paper-warrior/PaperWarriorClient.tsx', import.meta.url), 'utf8')
  const checkbox = paper.slice(paper.indexOf('setWithExplain(e.target.checked)'), paper.indexOf('setWithExplain(e.target.checked)') + 180)
  assert.match(checkbox, /setPaper\(null\)/)
  assert.match(checkbox, /setRevealCode\(false\)/)
  assert.match(paper, /\} catch \{[\s\S]*setPaper\(null\)[\s\S]*setBuildError\(true\)/)
  const notes = readFileSync(new URL('../../app/notes/[subject]/NotesSubjectClient.tsx', import.meta.url), 'utf8')
  assert.match(notes, /setNote\(null\)/)
  assert.match(notes, /noteState === 'ready' && note && note\.yourMistakes/)
})

test('practice and paper clients do not import the question banks', () => {
  const files = [
    'app/practice/PracticeGate.tsx',
    'app/practice/PracticeSession.tsx',
    'app/paper-warrior/PaperWarriorClient.tsx',
    'app/answer-sheet/AnswerSheetClient.tsx',
    'app/notes/[subject]/NotesSubjectClient.tsx',
    'app/bookmarks/BookmarksView.tsx',
    'app/concept-net/ConceptNetView.tsx',
  ]
  for (const file of files) {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8')
    assert.equal(src.includes("data/questions/load"), false, file)
    assert.equal(src.includes('questionCloud'), false, file)
    assert.equal(src.includes('mathBankQuestions'), false, file)
  }
})

test('basic math items are easy, and medium is not labelled Advanced', async () => {
  const { getSubjectQuestions } = await import('../../data/questions/index.ts')
  const byId = new Map(getSubjectQuestions('math').map((q) => [q.id, q]))
  const basic = [
    'mb_m7_5_3',
    'mb_m7_5_4',
    'mb_m2_8_6_8',
    'mb_m2_1_2_6',
    'mb_m3_1_2_5',
    'math_log_1',
    'math_log_2',
    'math_log_4',
    'math_log_7',
    'math_seq_ap_1',
    'math_seq_ap_3',
    'math_seq_gp_3',
  ]
  const direct = getSubjectQuestions('math').filter(
    (q) => q.type === 'mc' && (q.id.startsWith('mb_m7_') || q.id.startsWith('mb_m2_') || q.id.startsWith('mb_m3_')),
  )
  assert.ok(direct.length >= 20, `expected a sample of direct-formula items, got ${direct.length}`)
  for (const q of direct) {
    if (q.type !== 'mc') continue
    assert.equal(q.difficulty, 'easy', q.id)
    assert.notEqual(difficultyTier(q.difficulty).labelEn, 'Advanced', q.id)
  }
  for (const id of basic) {
    const q = byId.get(id)
    assert.ok(q, `missing ${id}`)
    assert.equal(q!.type, 'mc')
    if (q!.type !== 'mc') continue
    assert.equal(q!.difficulty, 'easy', id)
    const tier = difficultyTier(q!.difficulty)
    assert.equal(tier.label, '基礎', id)
    assert.notEqual(tier.label, '進階', id)
    assert.notEqual(tier.labelEn, 'Advanced', id)
  }
  const medium = byId.get('mb_m1_10_8')
  assert.ok(medium && medium.type === 'mc')
  if (medium && medium.type === 'mc') {
    assert.equal(medium.difficulty, 'medium')
    assert.equal(difficultyTier(medium.difficulty).label, '普通')
    assert.equal(difficultyTier(medium.difficulty).labelEn, 'Intermediate')
  }
  const hard = byId.get('mb_h1_1_1')
  assert.ok(hard && hard.type === 'mc')
  if (hard && hard.type === 'mc') {
    assert.equal(hard.difficulty, 'hard')
    assert.equal(difficultyTier(hard.difficulty).label, null)
  }
})
