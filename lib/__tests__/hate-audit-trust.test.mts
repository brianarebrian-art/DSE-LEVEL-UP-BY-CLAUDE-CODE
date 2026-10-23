// Trust-audit guards (2026-10-23). Counts stay on CONTENT_STATS; level ranges stay
// off subjects that cannot support them; the study day is Hong Kong, not UTC.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import type { AttemptRecord } from '../progress.ts'

function attempt(score: number, total: number, timestamp: number): AttemptRecord {
  return {
    subjectId: 'math',
    subjectName: '數學',
    topicFilter: null,
    score,
    total,
    grade: '—',
    topicResults: [],
    elapsed: 0,
    timestamp,
  }
}

const { levelEstimateBlock } = await import('../levelEstimatePolicy.ts')
const { isLengthBiased } = await import('../optionLengthBias.ts')
const { pickByDifficulty } = await import('../sessionSample.ts')
const { formatStudyDay, hkDayString } = await import('../hkTime.ts')
const { latestAccuracy, latestSessionIsLow } = await import('../celebrationGate.ts')

test('no-MC exams and the named length-bias list do not get a level range', () => {
  assert.equal(levelEstimateBlock('visual-arts'), 'no-mc-exam')
  assert.equal(levelEstimateBlock('history'), 'no-mc-exam')
  assert.equal(levelEstimateBlock('chinese'), 'option-length')
  assert.equal(levelEstimateBlock('csd'), 'option-length')
  assert.equal(levelEstimateBlock('economics'), isLengthBiased('economics') ? 'option-length' : null)
})

test('the study day follows Hong Kong, not the UTC calendar date', () => {
  const t = Date.parse('2026-10-22T20:30:00Z')
  assert.equal(hkDayString(t), '2026-10-23')
  assert.equal(formatStudyDay(t, false), '10月23日')
  assert.equal(formatStudyDay(t, true), '23/10/2026')
})

test('a tier skips a second copy of the same stem while another family is unused', () => {
  const ordered = [
    { id: 'dup-a', difficulty: 'medium' as const, topic: 't', content: 'find x when side is 8 and edge is 12' },
    { id: 'dup-b', difficulty: 'medium' as const, topic: 't', content: 'find x when side is 6 and edge is 9' },
    { id: 'other', difficulty: 'medium' as const, topic: 't', content: 'the demand curve shifts after a tax' },
  ]
  assert.deepEqual(pickByDifficulty(ordered, 2, 'math').map((q) => q.id), ['dup-a', 'other'])
  const onlyFamily = [0, 1, 2, 3].map((n) => ({
    id: `a${n}`,
    difficulty: 'medium' as const,
    topic: 't',
    content: `find x when side is ${n + 1} and edge is ${n + 9}`,
  }))
  assert.equal(pickByDifficulty(onlyFamily, 3, 'math').length, 3)
})

test('the pyramid distractor is the full-side cosine, not a different angle', () => {
  const src = readFileSync('data/questions/math-parametric.ts', 'utf8')
  assert.match(src, /Math\.acos\(Math\.min\(1, side \/ L\)\)/)
  assert.match(src, /dfrac\{\$\{side\}\}\{\$\{L\}\}/)
  const tuples = [[6, 9], [8, 12], [6, 10], [10, 13], [8, 10], [12, 13], [6, 8], [10, 12], [8, 15], [6, 12]] as const
  for (const [side, L] of tuples) {
    const half = side / Math.SQRT2
    const h = Math.sqrt(L * L - half * half)
    const ans = Math.round((Math.acos(half / L) * 180) / Math.PI)
    const dFace = Math.round((Math.atan2(h, side / 2) * 180) / Math.PI)
    const dComp = 90 - ans
    const dSide = Math.round((Math.acos(Math.min(1, side / L)) * 180) / Math.PI)
    assert.equal(new Set([ans, dFace, dComp, dSide]).size, 4, `${side},${L}`)
  }
})

test('machine-restored ids match the repair log', async () => {
  const log = JSON.parse(readFileSync('data/questions/rationale-repairs.json', 'utf8')) as Record<
    string,
    { stage?: string; restoreBasis?: string }
  >
  const ids = Object.entries(log)
    .filter(([, row]) => row.stage === 'restored' && row.restoreBasis === 'machine-gate')
    .map(([id]) => id)
    .sort()
  const mod = await import('../../data/questions/machine-restored-ids.ts')
  assert.deepEqual([...(mod.MACHINE_RESTORED_IDS as readonly string[])], ids)
  assert.equal(ids.length, 172)
  assert.equal(mod.isMachineRestored(ids[0]!), true)
  assert.equal(mod.isMachineRestored('not-a-question'), false)
  assert.match(readFileSync('components/QuestionProvenance.tsx', 'utf8'), /isMachineRestored\(/)
  const { getSubjectQuestions, getSubjectQuestionsRaw } = await import('../../data/questions/index.ts')
  const ht: { contentStatus: (subjectId: string, q: { id: string; topic: string }) => string } = await import('../../data/questions/hidden-topics.ts')
  const { subjects } = await import('../../data/subjects.ts')
  const active = subjects.filter((s: { isActive?: boolean }) => s.isActive !== false)
  const served = new Set<string>()
  for (const s of active) for (const q of getSubjectQuestions(s.id)) served.add(q.id)
  let frozen = 0
  for (const s of active) for (const q of getSubjectQuestionsRaw(s.id)) {
    if (!mod.isMachineRestored(q.id)) continue
    assert.equal(served.has(q.id), false, `${q.id} is still in the default practice pool`)
    if (ht.contentStatus(s.id, q) === 'machine_restored') frozen++
  }
  assert.equal(frozen, ids.length)
})

test('celebration and the spectrum name attempts separately from correct answers', () => {
  const attempts = [attempt(9, 10, 1), attempt(2, 10, 2)]
  assert.equal(latestAccuracy(attempts), 0.2)
  assert.equal(latestSessionIsLow(attempts), true)
  const result = readFileSync('app/result/ResultPageClient.tsx', 'utf8')
  assert.doesNotMatch(result, /MasteryEstimate/)
  assert.match(result, /formatStudyDay\(/)
  assert.match(readFileSync('components/DailySpectrum.tsx', 'utf8'), /已練習/)
  assert.match(readFileSync('app/HomePageClient.tsx', 'utf8'), /CONTENT_STATS\.withdrawn/)
  assert.match(readFileSync('app/HomePageClient.tsx', 'utf8'), /CONTENT_STATS\.machineRestored/)
})

test('zh_cmp is not in the Chinese bank, and generic writing notes are not shown as a mark scheme', async () => {
  const { getSubjectQuestionsRaw } = await import('../../data/questions/index.ts')
  const chinese = getSubjectQuestionsRaw('chinese')
  assert.equal(chinese.some((q: { id: string }) => q.id.startsWith('zh_cmp_')), false)
  const { isGenericWritingGuide } = await import('../genericWritingGuide.ts')
  const sample = '本題考核的是【由資料走到結論】的完整過程：計算要寫得出步驟。'
  assert.equal(isGenericWritingGuide(sample), true)
  assert.equal(isGenericWritingGuide('機會成本是放棄的最高價值。'), false)
  const card = readFileSync('components/LongQuestionCard.tsx', 'utf8')
  assert.match(card, /ExplanationBody/)
  assert.match(card, /isGenericWritingGuide/)
  assert.match(readFileSync('app/terms/page.tsx', 'utf8'), /使用條款 \| DSE Level Up/)
  assert.match(readFileSync('components/Footer.tsx', 'utf8'), /href="\/terms"/)
  assert.match(readFileSync('app/privacy/PrivacyClient.tsx', 'utf8'), /href="\/terms"/)
  assert.match(readFileSync('app/subjects/[subject]/SubjectDetailView.tsx', 'utf8'), /概念溫習 MC（非考試題型）/)
})
