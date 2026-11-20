// Public explanation overlay for the first 12 sample pages.
// The practice bank must keep the original items. The overlay is not an ingest path.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')

const overlay = await import('../../data/public-samples/batch-1.ts')
const questions = await import('../../data/questions/index.ts')

const {
  PUBLIC_SAMPLE_IDS,
  publicExplanationFor,
  explanationDisplay,
} = overlay

const PAIRS: Array<[string, string]> = [
  ['math_quad_1', 'math_quad_2'],
  ['m2_dpow_1', 'm2_dpow_2'],
  ['m1_ncr_1', 'm1_ncr_2'],
  ['phy_fma_1', 'phy_fma_2'],
  ['chem_nmM_1', 'chem_nmM_2'],
  ['ict_b2d_1', 'ict_b2d_2'],
]

const EXPECTED_DIFFICULTY: Record<string, 'easy' | 'medium'> = {
  math_quad_1: 'medium',
  math_quad_2: 'medium',
  m2_dpow_1: 'medium',
  m2_dpow_2: 'medium',
  m1_ncr_1: 'medium',
  m1_ncr_2: 'medium',
  phy_fma_1: 'medium',
  phy_fma_2: 'medium',
  chem_nmM_1: 'easy',
  chem_nmM_2: 'easy',
  ict_b2d_1: 'easy',
  ict_b2d_2: 'easy',
}

const BANK_STEM: Record<string, RegExp> = {
  math_quad_1: /x\^2 - 4x \+ 3 = 0/,
  math_quad_2: /x\^2 - 7x \+ 10 = 0/,
  m2_dpow_1: /2x\^\{3\}/,
  m2_dpow_2: /3x\^\{2\}/,
  m1_ncr_1: /C\^\{5\}_\{2\}/,
  m1_ncr_2: /C\^\{6\}_\{3\}/,
  phy_fma_1: /\$2\\,\\text\{kg\}\$/,
  phy_fma_2: /\$5\\,\\text\{kg\}\$/,
  chem_nmM_1: /\$36\\,\\text\{g\}\$/,
  chem_nmM_2: /\$88\\,\\text\{g\}\$/,
  ict_b2d_1: /00001010_2/,
  ict_b2d_2: /00101010_2/,
}

const SUBJECT_OF: Record<string, string> = {
  math_quad_1: 'math',
  math_quad_2: 'math',
  m2_dpow_1: 'm2',
  m2_dpow_2: 'm2',
  m1_ncr_1: 'm1',
  m1_ncr_2: 'm1',
  phy_fma_1: 'physics',
  phy_fma_2: 'physics',
  chem_nmM_1: 'chemistry',
  chem_nmM_2: 'chemistry',
  ict_b2d_1: 'ict',
  ict_b2d_2: 'ict',
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx|mts|mjs|js)$/.test(name)) out.push(full)
  }
  return out
}

function skeleton(text: string): string {
  return text.replace(/\$[^$]+\$/g, 'MATH').replace(/\d+(?:\.\d+)?/g, '#').replace(/\s+/g, '')
}

function assertKatex(id: string, text: string) {
  const parts = text.match(/\$[^$]+\$/g) ?? []
  assert.ok(parts.length > 0, `${id} has no math`)
  for (const part of parts) {
    const tex = part.slice(1, -1)
    assert.ok(!tex.includes('\f') && !tex.includes('\t') && !tex.includes('\b'), `${id} has a broken escape in ${tex}`)
    katex.renderToString(tex, { throwOnError: true, output: 'htmlAndMathml' })
  }
}

test('the overlay is exactly these 12 ids and does not enter the practice bank', () => {
  assert.deepEqual([...PUBLIC_SAMPLE_IDS], Object.keys(BANK_STEM))
  const blockedRoots = ['data/questions', 'scripts/qbank', 'app/practice', 'data/questions/load.ts']
  const files = [
    ...walk(join(ROOT, 'data/questions')),
    ...walk(join(ROOT, 'scripts/qbank')),
    ...walk(join(ROOT, 'app/practice')),
  ]
  for (const file of files) {
    assert.equal(readFileSync(file, 'utf8').includes('public-samples'), false, file)
  }
  assert.ok(blockedRoots.length > 0)
  const page = read('app/subject/[subject]/[topic]/[id]/page.tsx')
  assert.match(page, /explanationDisplay/)
  assert.match(page, /TeachingForceDiagram/)
  assert.match(page, /正解 · Correct/)
  assert.match(page, /completeSeoMetadata/)
  assert.doesNotMatch(page, /noindex|noIndex:\s*true/)
})

test('practice-bank stems stay on the original one-step items', () => {
  for (const id of PUBLIC_SAMPLE_IDS) {
    const subject = SUBJECT_OF[id]
    const bank = questions.getSubjectQuestions(subject).find((q) => q.id === id)
    assert.ok(bank, id)
    assert.equal(bank.type, 'mc')
    assert.equal(bank.correctIndex, 0)
    assert.match(bank.content, BANK_STEM[id])
    const sample = publicExplanationFor(id)
    assert.ok(sample)
    assert.equal(sample.subject, bank.subject)
    assert.equal(sample.topic, bank.topic)
    assert.equal(sample.topicZh, bank.topicZh)
    assert.doesNotMatch(sample.content, BANK_STEM[id])
    const shown = explanationDisplay(id, bank)
    assert.equal(shown.source, 'public-sample')
    assert.equal(shown.content, sample.content)
    assert.equal(shown.correctIndex, sample.correctIndex)
  }
})

test('a subject or topic mismatch keeps the bank text', () => {
  const sample = publicExplanationFor('math_quad_1')
  assert.ok(sample)
  const shown = explanationDisplay('math_quad_1', {
    subject: 'physics',
    topic: 'mechanics',
    topicZh: '力學',
    content: 'bank stem',
    options: ['a'],
    correctIndex: 0,
    explanation: 'bank note',
    difficulty: 'easy',
  })
  assert.equal(shown.source, 'bank')
  assert.equal(shown.content, 'bank stem')
})

test('rewrites are not parameter twins, and the correct index is not always 0', () => {
  const indexes = PUBLIC_SAMPLE_IDS.map((id) => publicExplanationFor(id)!.correctIndex)
  assert.ok(indexes.some((index) => index !== 0))
  assert.ok(new Set(indexes).size >= 3)
  for (const [left, right] of PAIRS) {
    const a = publicExplanationFor(left)!
    const b = publicExplanationFor(right)!
    assert.notEqual(skeleton(a.content), skeleton(b.content))
    assert.equal(a.difficulty, EXPECTED_DIFFICULTY[left])
    assert.equal(b.difficulty, EXPECTED_DIFFICULTY[right])
  }
})

test('each public sample is a four-option item with cited content, KaTeX, and no forbidden claims', () => {
  const colloquial = /[嘅唔喺咗嗰啲嚟佢畀冇囉喎咩噉]|點解|即係|咁樣|唔好/
  const letterRef = /選項\s*[A-DＡ-Ｄ]|option\s+[A-D]|答案[是為]\s*[A-D]|第[一二三四]個選項/i
  const claims = /考試急症室|間隔重複|即時錯因|老師審|公共財|收入彈性|保證升|保證考|保證成績/
  for (const id of PUBLIC_SAMPLE_IDS) {
    const sample = publicExplanationFor(id)!
    assert.equal(sample.options.length, 4)
    assert.equal(new Set(sample.options).size, 4)
    assert.ok(sample.correctIndex >= 0 && sample.correctIndex <= 3)
    const correct = sample.options[sample.correctIndex]
    const visible = `${sample.content}\n${sample.options.join('\n')}\n${sample.explanation}\n${sample.diagram?.caption ?? ''}\n${sample.diagram?.ariaLabel ?? ''}`
    assert.doesNotMatch(visible, colloquial)
    assert.doesNotMatch(visible, letterRef)
    assert.doesNotMatch(visible, claims)
    assert.ok(sample.explanation.includes(correct.split('，')[0].replace(/\$/g, '').slice(0, 2)) || sample.explanation.includes(correct), `${id} explanation does not cite its correct option`)
    assertKatex(id, sample.content)
    for (const option of sample.options) assertKatex(id, option)
    assertKatex(id, sample.explanation)
  }
})

test('the worked answers match the marked option', () => {
  const answer = (id: string) => publicExplanationFor(id)!.options[publicExplanationFor(id)!.correctIndex]
  assert.equal(answer('math_quad_1'), '$6$')
  assert.equal(6 * 6, 5 * 6 + 6)
  assert.match(answer('math_quad_2'), /\\frac\{37\}\{4\}/)
  assert.equal((7 / 2) ** 2 - 2 * (3 / 2), 37 / 4)
  assert.equal(answer('m2_dpow_1'), '$8$')
  assert.equal(3 * 9 - 8 * 3 + 5, 8)
  assert.equal(answer('m2_dpow_2'), '$11$')
  assert.equal(6 * 2 - 4 / 4, 11)
  assert.equal(answer('m1_ncr_1'), '$60$')
  assert.equal((5 * 4 / 2) * (4 * 3 / 2), 60)
  assert.equal(answer('m1_ncr_2'), '$30$')
  assert.equal(35 - 5, 30)
  assert.ok(answer('phy_fma_1').includes('3\\,\\text{m/s}^2$，向右'))
  assert.equal((15 - 6) / 3, 3)
  assert.ok(answer('phy_fma_2').includes('11.0\\,\\text{N}'))
  assert.equal(2 * 4 + 3, 11)
  assert.match(answer('chem_nmM_1'), /400\\,\\text\{g\}/)
  assert.equal(4 * 100, 400)
  assert.match(answer('chem_nmM_2'), /0\.60\\,\\text\{mol\}/)
  assert.equal(answer('ict_b2d_1'), '$89$')
  assert.equal(Number.parseInt('01011001', 2), 89)
  assert.match(answer('ict_b2d_2'), /\{1101\}_\{2\}/)
  assert.equal(Number.parseInt('1101', 2), 13)
  assert.equal(Number.parseInt('1011', 2), 11)
  assert.equal(Number.parseInt('1110', 2), 14)
  assert.equal(Number.parseInt('0111', 2), 7)
})

test('only the two mechanics samples carry a teaching force diagram, and the diagram does not print the unknown', () => {
  for (const id of PUBLIC_SAMPLE_IDS) {
    const sample = publicExplanationFor(id)!
    if (id === 'phy_fma_1' || id === 'phy_fma_2') assert.ok(sample.diagram)
    else assert.equal(sample.diagram, undefined)
  }
  const first = publicExplanationFor('phy_fma_1')!.diagram!
  const second = publicExplanationFor('phy_fma_2')!.diagram!
  const firstText = [first.ariaLabel, first.caption, first.bodyLabel, first.leftLabel, first.rightLabel, first.surfaceLabel].join('\n')
  const secondText = [second.ariaLabel, second.caption, second.bodyLabel, second.leftLabel, second.rightLabel, second.surfaceLabel, second.accelLabel].join('\n')
  assert.equal(firstText.includes('m/s'), false)
  assert.match(firstText, /15 N/)
  assert.match(firstText, /6 N/)
  assert.match(secondText, /4\.0 m\/s/)
  assert.equal(secondText.includes('11'), false)
  assert.equal(second.rightLabel, 'F')
  const svg = read('components/subject/TeachingForceDiagram.tsx')
  assert.match(svg, /role="img"/)
  assert.match(svg, /viewBox=/)
  assert.match(svg, /width="320"/)
  assert.match(svg, /focusable="false"/)
  assert.doesNotMatch(svg, /[\u{1F300}-\u{1FAFF}]/u)
})
