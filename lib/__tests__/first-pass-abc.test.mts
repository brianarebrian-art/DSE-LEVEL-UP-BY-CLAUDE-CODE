import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { FirstPassGradePreview } from '../../components/loop/FirstPassGradePreview.tsx'
import {
  CLOSE_RATIO_MAX,
  CLOSE_RATIO_MIN,
  FIRST_PASS_DISCLAIMER_ZH,
  FIRST_PASS_METHOD_VERSION,
  SERVED_SET_DEFINITION_ZH,
  gradeFromSignals,
  gradeSubject,
  isFirstPassGradeRouteHidden,
} from '../loop-engineering/first-pass-abc.ts'
import { shouldNoIndex } from '../seoPolicy.ts'

const read = (path: string) => readFileSync(path, 'utf8')

test('不確定時標 B，客觀缺陷先於代理，其他科不標 A', () => {
  assert.equal(gradeFromSignals({ subject: 'math', objectiveReasons: [], proxyRatio: CLOSE_RATIO_MIN }).grade, 'A')
  assert.equal(gradeFromSignals({ subject: 'math', objectiveReasons: [], proxyRatio: CLOSE_RATIO_MAX - 0.001 }).grade, 'A')
  assert.equal(gradeFromSignals({ subject: 'math', objectiveReasons: [], proxyRatio: CLOSE_RATIO_MIN - 0.001 }).grade, 'B')
  assert.deepEqual(
    gradeFromSignals({ subject: 'math', objectiveReasons: [], proxyRatio: CLOSE_RATIO_MAX }).reasonCodes,
    ['above_close_band_unverified'],
  )
  assert.equal(gradeFromSignals({ subject: 'math', objectiveReasons: [], proxyRatio: Number.NaN }).grade, 'unable')
  assert.deepEqual(
    gradeFromSignals({ subject: 'physics', objectiveReasons: [], proxyRatio: 1 }).reasonCodes,
    ['pending_subject_baseline'],
  )
  assert.equal(
    gradeFromSignals({ subject: 'math', objectiveReasons: ['duplicate_stem'], proxyRatio: 1 }).grade,
    'C',
  )

  const complete = {
    topic: 'motion',
    type: 'mc' as const,
    marks: 1,
    content: 'alpha',
    options: ['1', '2', '3', '4'],
    correctIndex: 0,
    explanation: 'because',
  }
  const physics = gradeSubject('physics', [{ id: 'p1', ...complete }])
  assert.equal(physics[0].grade, 'B')
  assert.deepEqual(physics[0].reasonCodes, ['pending_subject_baseline'])

  const calculus = gradeSubject('math', [{ id: 'm-cal', ...complete, topic: 'calculus' }])
  assert.equal(calculus[0].grade, 'C')
  assert.ok(calculus[0].reasonCodes.includes('off_syllabus_topic'))
  const physicsCalculus = gradeSubject('physics', [{ id: 'p-cal', ...complete, topic: 'calculus' }])
  assert.equal(physicsCalculus[0].grade, 'B')
  assert.equal(physicsCalculus[0].reasonCodes.includes('off_syllabus_topic'), false)

  const duplicates = gradeSubject('english', [
    { id: 'e1', ...complete },
    { id: 'e2', ...complete },
  ])
  assert.deepEqual(duplicates.map((row) => row.grade), ['C', 'C'])
  assert.ok(duplicates.every((row) => row.reasonCodes.includes('duplicate_stem')))

  const broken = gradeSubject('math', [{
    id: 'm-bad',
    topic: 'algebra',
    type: 'mc',
    content: '下圖',
    options: ['1', '1'],
    correctIndex: 4,
    explanation: '',
  }])
  assert.equal(broken[0].grade, 'C')
  for (const reason of ['invalid_or_duplicate_answer', 'missing_explanation', 'figure_referenced_without_asset']) {
    assert.ok(broken[0].reasonCodes.includes(reason), reason)
  }
  assert.equal(JSON.stringify(broken).includes('content'), false)
})

test('正式環境隱藏預覽，preview 不隱藏', () => {
  assert.equal(isFirstPassGradeRouteHidden({ VERCEL_ENV: 'production', NODE_ENV: 'production' }), true)
  assert.equal(isFirstPassGradeRouteHidden({ VERCEL_ENV: 'production', NODE_ENV: 'development' }), true)
  assert.equal(isFirstPassGradeRouteHidden({ VERCEL_ENV: 'preview', NODE_ENV: 'production' }), false)
  assert.equal(isFirstPassGradeRouteHidden({ VERCEL_ENV: 'preview', NODE_ENV: 'development' }), false)
  assert.equal(isFirstPassGradeRouteHidden({ NODE_ENV: 'production' }), true)
  assert.equal(isFirstPassGradeRouteHidden({ NODE_ENV: 'development' }), false)
  assert.equal(shouldNoIndex('/dev/first-pass-grades'), true)

  const page = read('app/dev/first-pass-grades/page.tsx')
  assert.match(page, /isFirstPassGradeRouteHidden\(\)/)
  assert.match(page, /notFound\(\)/)
  assert.match(page, /force-dynamic/)
  assert.match(read('lib/pageOrder.ts'), /'\/dev\/first-pass-grades':/)
  assert.match(read('scripts/integration-guard.mjs'), /'\/dev\/first-pass-grades':/)
  assert.match(read('package.json'), /"loop:first-pass-abc":/)
})

test('分級檔覆蓋彙總，而且沒有題幹欄位', () => {
  const summary = JSON.parse(read('data/loop-engineering/first-pass-abc/summary.json'))
  const unable = JSON.parse(read('data/loop-engineering/first-pass-abc/unable.json'))
  const candidates = JSON.parse(read('data/loop-engineering/first-pass-abc/objective-c-candidates.json'))
  assert.equal(summary.methodVersion, FIRST_PASS_METHOD_VERSION)
  assert.equal(summary.unverified, true)
  assert.equal(summary.teacherReviewed, false)
  assert.equal(summary.verifiedDsePlus10, false)
  assert.equal(summary.officialStatistic, false)
  assert.equal(summary.pilotFileUsed, false)
  assert.equal(summary.appliedToStudentPool, false)
  assert.equal(summary.disclaimerZh, FIRST_PASS_DISCLAIMER_ZH)
  assert.equal(summary.servedSet.definitionZh, SERVED_SET_DEFINITION_ZH)
  assert.equal(summary.servedSet.itemCount, 26426)
  assert.equal(summary.byGrade.A + summary.byGrade.B + summary.byGrade.C + summary.byGrade.unable, 26426)
  assert.equal(unable.itemCount, summary.byGrade.unable)
  assert.equal(unable.items.length, summary.byGrade.unable)

  const doc = read('docs/loop-engineering/first-pass-abc-zh-hk.md')
  assert.match(doc, /first-pass-abc-v1/)
  assert.match(doc, /2026-11-27/)
  assert.match(doc, /未經驗證/)
  assert.match(doc, /npm run loop:first-pass-abc/)
  for (const grade of ['A', 'B', 'C'] as const) {
    assert.match(doc, new RegExp(`\\| ${grade} \\| ${summary.byGrade[grade]} \\|`))
  }
  assert.equal(doc.includes('化簡'), false)

  let covered = 0
  const seen = new Set<string>()
  for (const subject of summary.bySubject) {
    const rows = JSON.parse(read(`data/loop-engineering/first-pass-abc/grades/${subject.subject}.json`))
    assert.equal(rows.length, subject.itemCount)
    const tally = { A: 0, B: 0, C: 0, unable: 0 }
    for (const row of rows) {
      assert.deepEqual(Object.keys(row), ['id', 'subject', 'itemType', 'topic', 'grade', 'reasonCodes', 'methodVersion'])
      assert.equal(row.subject, subject.subject)
      assert.equal(row.methodVersion, FIRST_PASS_METHOD_VERSION)
      assert.equal(/[。？！\n]/.test(JSON.stringify(row)), false)
      assert.ok(row.id.length > 0 && row.id.length <= 64)
      assert.ok(row.topic.length > 0 && row.topic.length <= 64)
      const key = `${row.subject}\t${row.id}`
      assert.equal(seen.has(key), false, key)
      seen.add(key)
      tally[row.grade as 'A' | 'B' | 'C' | 'unable'] += 1
      covered += 1
    }
    assert.equal(tally.A, subject.A)
    assert.equal(tally.B, subject.B)
    assert.equal(tally.C, subject.C)
    assert.equal(tally.unable, subject.unable)
  }
  assert.equal(covered, summary.servedSet.itemCount)
  assert.equal(seen.has('math\tmath_fl_ns04'), false)
  assert.equal(seen.has('math\tmb_n1_5_2'), false)

  const servedListed = [
    ...candidates.alreadyInLoopGradeCInventory,
    ...candidates.newlyFound,
  ]
  assert.equal(servedListed.length, summary.objectiveC.total)
  assert.equal(summary.objectiveC.newlyFound.length, 0)
  for (const row of servedListed) {
    assert.deepEqual(Object.keys(row), ['id', 'subject', 'reasonCodes'])
    assert.equal(seen.has(`${row.subject}\t${row.id}`), true)
  }
  for (const row of candidates.knownConfirmedWithdrawalPair) {
    assert.deepEqual(Object.keys(row), ['id', 'subject', 'reasonCodes'])
    assert.equal(seen.has(`${row.subject}\t${row.id}`), false)
  }
  assert.equal(JSON.stringify(candidates).includes('化簡'), false)
  assert.deepEqual(
    candidates.knownConfirmedWithdrawalPair.map((row: { id: string }) => row.id),
    ['math_fl_ns04', 'mb_n1_5_2'],
  )
})

test('試點裡高於區間的 A 在首輪改標 B，而且腳本不讀試點檔', () => {
  const pilot = JSON.parse(read('data/loop-engineering/math-compulsory-pilot-scores.json'))
  const math = new Map(
    JSON.parse(read('data/loop-engineering/first-pass-abc/grades/math.json')).map((row: { id: string; grade: string }) => [row.id, row.grade]),
  )
  const above = pilot.pilot.filter((row: { abcReasons?: string[] }) =>
    row.abcReasons?.includes('proxy_at_or_above_formula_not_verified'),
  )
  assert.ok(above.length > 0)
  for (const row of above) {
    assert.equal(row.abcGrade, 'A')
    assert.equal(math.get(row.id), 'B')
  }
  const source = `${read('lib/loop-engineering/first-pass-abc.ts')}\n${read('scripts/loop-engineering/build-first-pass-abc.mts')}`
  assert.equal(source.includes('math-compulsory-pilot-scores'), false)
  assert.equal(source.includes('ruleset_proxy_v1'), false)
})

test('學生載入器仍送出未套用分級的題；已收起的兩條不在在練池', async () => {
  const allow = new Set([
    'lib/loop-engineering/first-pass-abc.ts',
    'app/dev/first-pass-grades/page.tsx',
    'components/loop/FirstPassGradePreview.tsx',
  ])
  const hits: string[] = []
  for (const root of ['app', 'components', 'data/questions', 'lib']) {
    for (const path of sourceFiles(root)) {
      if (allow.has(path)) continue
      if (read(path).includes('first-pass-abc')) hits.push(path)
    }
  }
  assert.deepEqual(hits, [])

  const withdrawn = JSON.parse(read('data/questions/withdrawn.json')) as Record<string, Record<string, { reason?: string }>>
  assert.equal(withdrawn.math?.math_fl_ns04?.reason, 'DUPLICATE_STEM')
  assert.equal(withdrawn.math?.mb_n1_5_2?.reason, 'DUPLICATE_STEM')
  assert.equal(withdrawn.english?.en_gr_1, undefined)
  assert.equal(withdrawn.chinese?.zh_ch_106, undefined)

  const { loadSubjectQuestions } = await import('../../data/questions/load.ts')
  const math = await loadSubjectQuestions('math')
  const mathIds = new Set(math.map((item) => item.id))
  assert.equal(mathIds.has('math_fl_ns04'), false)
  assert.equal(mathIds.has('mb_n1_5_2'), false)
  const graded = JSON.parse(read('data/loop-engineering/first-pass-abc/grades/math.json')) as Array<{ id: string; grade: string }>
  const stillServedB = graded.find((row) => row.grade === 'B' && mathIds.has(row.id))
  assert.ok(stillServedB)
  const english = await loadSubjectQuestions('english')
  assert.equal(english.some((item) => item.id === 'en_gr_1'), true)
  const chinese = await loadSubjectQuestions('chinese')
  assert.equal(chinese.some((item) => item.id === 'zh_ch_106'), true)
})

test('預覽頁只顯示彙總與候選 id', () => {
  const summary = JSON.parse(read('data/loop-engineering/first-pass-abc/summary.json'))
  const html = renderToStaticMarkup(FirstPassGradePreview({ summary }))
  assert.match(html, new RegExp(`>${summary.servedSet.itemCount}<`))
  assert.match(html, new RegExp(`>${summary.byGrade.A}<`))
  assert.match(html, />math_fl_ns04</)
  assert.match(html, />mb_n1_5_2</)
  assert.match(html, />en_gr_1</)
  assert.match(html, /0 條/)
  assert.equal(html.includes('化簡'), false)
  assert.equal(html.includes('content'), false)
})

test('重跑 --check 與已提交的分級檔一致', { timeout: 180_000 }, () => {
  const result = spawnSync(
    process.execPath,
    ['node_modules/tsx/dist/cli.mjs', 'scripts/loop-engineering/build-first-pass-abc.mts', '--check'],
    { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
  )
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

function sourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '__tests__') continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...sourceFiles(path))
    else if (/\.(ts|tsx|mjs)$/.test(entry.name)) out.push(path)
  }
  return out
}
