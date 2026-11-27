import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { buildCatalog } from '../loop-engineering/catalog.ts'
import { isLoopDisclosureRouteHidden, PREVIEW_ITEM_LABEL_ZH } from '../loop-engineering/disclosure.ts'
import { decideAiReview } from '../loop-engineering/pipeline.ts'
import { composite, meetsUpgradeTarget, profileComposite } from '../loop-engineering/rubric.ts'
import { WEEK58_PROTECTED_SOURCE_IDS, isWeek58Eligible, selectWeek58Sample } from '../loop-engineering/week58-scope.ts'
import {
  FAMILY_IDS,
  PROPOSED_BY_PROFILE,
  allowedTopicSet,
  createWeek58Item,
  familyVariantCount,
  solveWeek58,
  toCatalogInput,
  week58DisclosureZh,
} from '../loop-engineering/week58-items.ts'
import { marksFromChecklist, noteForMarks, reviewWeek58Item, runWeek58Loop3 } from '../loop-engineering/week58-review.ts'
import { buildWeek58Bundle } from '../loop-engineering/week58-batch.ts'
import { contentStatus, PENDING_REVIEW, WITHDRAWN } from '../../data/questions/hidden-topics.ts'
import { isMachineRestored } from '../../data/questions/machine-restored-ids.ts'
import { loadSubjectQuestions } from '../../data/questions/load.ts'

const allowed = allowedTopicSet()

test('擬評跨過公式 (1)，而且不向下取整', () => {
  for (const profile of Object.keys(PROPOSED_BY_PROFILE) as Array<keyof typeof PROPOSED_BY_PROFILE>) {
    const total = composite(PROPOSED_BY_PROFILE[profile])
    assert.equal(meetsUpgradeTarget(total, profileComposite(profile)), true, profile)
  }
  assert.equal(meetsUpgradeTarget(12, 11), false)
  assert.equal(meetsUpgradeTarget(12.1, 11), true)
  assert.equal(composite(PROPOSED_BY_PROFILE.p2_mc), 13)
  assert.equal(composite(PROPOSED_BY_PROFILE.p1_b), 20)
})

test('每個課題模板都有足夠的可覆算變體', () => {
  for (const family of FAMILY_IDS) {
    assert.ok(familyVariantCount(family) >= 12, family)
  }
})

test('手算抽樣與求解器一致', () => {
  const percent = solveWeek58('successive_percent', { slot: 0, setting: 0, goods: 0, cost: 200, markup: 25, discount: 20 })
  assert.equal(percent?.correctText, '結果是：不賺不蝕')
  const quad = solveWeek58('quadratic_sum_squares', { slot: 0, setting: 0, s: 5, q: 13 })
  assert.equal(quad?.correctText.includes('k=6'), true)
  assert.equal(quad?.correctText.includes('判別式是 1'), true)
  const probability = solveWeek58('replacement_probability', { slot: 0, setting: 0, thing: 0, red: 2, blue: 5 })
  assert.equal(probability?.correctText.includes('4/49'), true)
  assert.equal(probability?.correctText.includes('1/21'), true)
  assert.equal(probability?.correctText.includes('放回較大'), true)
  const similar = solveWeek58('similar_powers', { slot: 0, setting: 0, row: 0 })
  assert.equal(similar?.correctText, '結果是：表面面積比是 4:9')
  const order = solveWeek58('order_or_not', { slot: 0, setting: 0, n: 5, ordered: 0 })
  assert.equal(order?.correctText, '結果是：不計次序，共 10 種')
  assert.equal(order?.partC.includes('再除以 2'), false)
  const ordered = solveWeek58('order_or_not', { slot: 1, setting: 0, n: 7, ordered: 1 })
  assert.match(ordered?.partC ?? '', /再除以 2/)
})

test('軟項無法判斷不得寫成通過，也不單獨回爐', () => {
  const marks = marksFromChecklist({
    solvedOk: true,
    correct: true,
    syllabus: 'in',
    clear: true,
    trap: 'unclear',
    explanationOk: true,
    difficulty: 'met',
    originality: 'ok',
    disclosureOk: true,
  })
  assert.equal(marks.trap, '無法判斷')
  const note = noteForMarks(marks)
  assert.match(note, /不得寫成通過/)
  assert.equal(decideAiReview(marks, note).decision, 'pass_to_human')
})

test('原創性無法判斷必須回爐', () => {
  const marks = marksFromChecklist({
    solvedOk: true,
    correct: true,
    syllabus: 'in',
    clear: true,
    trap: 'present',
    explanationOk: true,
    difficulty: 'met',
    originality: 'unclear',
    disclosureOk: true,
  })
  assert.equal(marks.originality, '無法判斷')
  assert.equal(decideAiReview(marks, noteForMarks(marks)).decision, 'rework')
})

test('抽樣排除 C 級與已點名題，次序固定', () => {
  const protectedRow = row('math_fl_ns04', 'number_systems', 'mc', 'C', ['duplicate_stem'])
  const kept = row('kept-long', 'probability', 'long', 'unscored', [])
  const calculus = row('off', 'calculus', 'mc', 'unscored', [])
  assert.equal(isWeek58Eligible(protectedRow, allowed), false)
  assert.equal(isWeek58Eligible(kept, allowed), true)
  assert.equal(isWeek58Eligible(calculus, allowed), false)
  assert.throws(() => selectWeek58Sample([
    row('m2', 'circles', 'mc', 'unscored', []),
    row('m1', 'probability', 'mc', 'unscored', []),
    row('l1', 'probability', 'long', 'unscored', []),
  ], allowed, 200))
})

test('答錯、只加運算量與未簽署都不能當成已核准', () => {
  const item = createWeek58Item(row('gate-src', 'percentage', 'mc', 'unscored', []), 'loop-w58-test', new Set())
  const passed = reviewWeek58Item(item, allowed)
  assert.equal(passed.review.decision, 'pass_to_human')
  assert.equal(passed.marks.trap, '通過')
  const wrong = { ...item, correctIndex: ((item.correctIndex ?? 0) + 1) % 4 }
  const rewound = runWeek58Loop3(wrong, allowed, '2026-11-27T16:10:00+08:00')
  assert.equal(rewound.status, 'loop2_draft')
  assert.equal(rewound.aiReview?.decision, 'rework')
  const inflated = runWeek58Loop3({ ...item, upgradeKind: 'bigger_numbers' }, allowed, '2026-11-27T16:11:00+08:00')
  assert.equal(inflated.status, 'loop2_draft')
  const kept = runWeek58Loop3(item, allowed, '2026-11-27T16:12:00+08:00')
  assert.equal(kept.status, 'loop3_ai_first_review')
  assert.equal(kept.twoPersonReview, null)
  assert.equal(kept.published, false)
  assert.equal(kept.verifiedDsePlus10, false)
  assert.equal(kept.loop5.state, 'blocked')
})

test('預覽路由在 production 404，練習頁不掛草稿', () => {
  assert.equal(isLoopDisclosureRouteHidden({ VERCEL_ENV: 'production', NODE_ENV: 'production' }), true)
  assert.equal(isLoopDisclosureRouteHidden({ VERCEL_ENV: 'preview', NODE_ENV: 'production' }), false)
  const page = readFileSync('app/dev/loop-week58/page.tsx', 'utf8')
  const disclosure = readFileSync('app/dev/loop-disclosure/page.tsx', 'utf8')
  for (const source of [page, disclosure]) {
    assert.match(source, /isLoopDisclosureRouteHidden\(\)/)
    assert.match(source, /notFound\(\)/)
  }
  const preview = readFileSync('components/loop/LoopWeek58Preview.tsx', 'utf8')
  assert.match(preview, /PREDICTION_DISCLOSURE_ZH/)
  assert.match(preview, /BANK_DISCLOSURE_ZH/)
  assert.match(preview, /PREVIEW_ITEM_LABEL_ZH/)
  for (const file of [
    'data/questions/load.ts',
    'lib/practice/bankCache.ts',
    'app/api/practice/catalog/route.ts',
    'app/api/practice/check/route.ts',
    'app/practice/page.tsx',
    'app/result/page.tsx',
    'app/result/ResultPageClient.tsx',
    'app/api/result/verify/route.ts',
  ]) {
    const source = readFileSync(file, 'utf8')
    assert.equal(source.includes('week58'), false, file)
    assert.equal(source.includes('loop-w58-'), false, file)
  }
  const load = readFileSync('data/questions/load.ts', 'utf8')
  const bank = readFileSync('lib/practice/bankCache.ts', 'utf8')
  assert.match(load, /options\?\.skipUpgradeOverlay \? qs : applyFullUpgradeOverlay/)
  assert.match(bank, /loadSubjectQuestions\(subjectId\)/)
  assert.doesNotMatch(bank, /skipUpgradeOverlay/)
  assert.match(readFileSync('lib/loop-engineering/week58-batch.ts', 'utf8'), /week58-drafts\.json/)
  assert.match(readFileSync('next.config.ts', 'utf8'), /week58-drafts\.json/)
  assert.match(readFileSync('lib/pageOrder.ts', 'utf8'), /\/dev\/loop-week58/)
  assert.match(readFileSync('scripts/integration-guard.mjs', 'utf8'), /\/dev\/loop-week58/)
  assert.equal(readFileSync('data/questions/overlays/math.json', 'utf8').includes('loop-w58-'), false)
})

test('已提交的第一批與生成器一致，而且隔離紀錄成立', { timeout: 120_000 }, async () => {
  const scope = JSON.parse(readFileSync('data/loop-engineering/week58-sample-scope.json', 'utf8'))
  const committed = JSON.parse(readFileSync('data/loop-engineering/week58-drafts.json', 'utf8'))
  const isolation = JSON.parse(readFileSync('data/loop-engineering/week58-isolation.json', 'utf8'))
  const doc = readFileSync('docs/loop-engineering/week58-sample-zh-hk.md', 'utf8')
  const sheet = readFileSync('docs/loop-engineering/week58-two-person-sheet.md', 'utf8')
  assert.equal(scope.firstBatchCount, 200)
  assert.deepEqual(scope.authorizedRange, { min: 200, max: 500 })
  assert.equal(scope.rangeNotNarrowed, true)
  assert.equal(scope.ids.length, 200)
  assert.equal(JSON.stringify(scope).includes('"content"'), false)
  assert.equal(committed.counts.produced, 200)
  assert.equal(committed.counts.passedLoop3, 200)
  assert.equal(committed.counts.rewound, 0)
  assert.match(doc, /產出 200、Loop 3 通過 200、回爐 0/)
  assert.match(sheet, /未開始/)
  for (const id of WEEK58_PROTECTED_SOURCE_IDS) {
    assert.equal(scope.ids.some((row: { id: string }) => row.id === id), false)
  }
  assert.equal(week58DisclosureZh().includes(PREVIEW_ITEM_LABEL_ZH), true)

  const baseline = await loadSubjectQuestions('math', { skipUpgradeOverlay: true })
  const overlaid = await loadSubjectQuestions('math')
  assert.deepEqual(baseline.map((item) => item.id).sort(), overlaid.map((item) => item.id).sort())
  const catalog = buildCatalog('math', baseline.map((item) => toCatalogInput(item)))
  const selected = selectWeek58Sample(catalog, allowed)
  assert.deepEqual(selected.map((row) => row.id), scope.ids.map((row: { id: string }) => row.id))
  for (const row of selected) {
    assert.equal(row.grade, 'unscored')
    assert.equal(contentStatus('math', row), 'published')
    assert.equal(Boolean(WITHDRAWN.math?.[row.id]), false)
    assert.equal(Boolean(PENDING_REVIEW.math?.[row.id]), false)
    assert.equal(isMachineRestored(row.id), false)
  }
  const rebuilt = buildWeek58Bundle(selected)
  assert.equal(rebuilt.counts.passedLoop3, 200)
  assert.equal(rebuilt.counts.rewound, 0)
  assert.deepEqual(
    rebuilt.drafts.map((entry) => [entry.item.draftId, entry.item.stemFingerprint, entry.record.status]),
    committed.drafts.map((entry: { item: { draftId: string; stemFingerprint: string }; record: { status: string } }) => [entry.item.draftId, entry.item.stemFingerprint, entry.record.status]),
  )
  const before = baseline.find((item) => item.id === isolation.sampleSourceId)
  const after = overlaid.find((item) => item.id === isolation.sampleSourceId)
  assert.ok(before && after)
  assert.equal(sha(before.content), isolation.baselineContentSha256)
  assert.equal(sha(after.content), isolation.overlaidContentSha256)
  assert.notEqual(isolation.baselineContentSha256, isolation.overlaidContentSha256)
})

function sha(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function row(id: string, topic: string, itemType: string, grade: 'C' | 'unscored', gradeReasons: string[]) {
  return {
    id,
    subject: 'math',
    topic,
    topicZh: topic,
    itemType,
    marks: itemType === 'mc' ? 1 : 4,
    grade,
    gradeReasons,
    baselineProfileId: itemType === 'mc' ? 'p2_mc' as const : 'p1_a1' as const,
  }
}
