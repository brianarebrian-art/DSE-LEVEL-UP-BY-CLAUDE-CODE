import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  BASELINE_PROFILES,
  classifyBaseline,
  composite,
  meetsUpgradeTarget,
  profileComposite,
  upgradeThreshold,
} from '../loop-engineering/rubric.ts'
import {
  buildAssetMap,
  defectReasons,
  gradeAgainstBaseline,
  proxyScoreCurrent,
  selectPilotIds,
} from '../loop-engineering/asset-map.ts'
import {
  PipelineGateError,
  applyAiReview,
  attemptLoop5,
  createDraft,
  decideAiReview,
  moveToAiReview,
  moveToTwoPersonReview,
} from '../loop-engineering/pipeline.ts'
import {
  BANK_DISCLOSURE_ZH,
  PREDICTION_DISCLOSURE_ZH,
  PREVIEW_ITEM_LABEL_ZH,
  STUDENT_ANSWER_USE,
} from '../loop-engineering/disclosure.ts'
import { loadStoredPrompt, userTestQuestionnaireStatus } from '../loop-engineering/prompts.ts'
import { buildWeek12DryRun } from '../loop-engineering/dry-run.ts'
import { RUBRIC_VERSION } from '../loop-engineering/rubric.ts'

const AI_PASS = {
  correctness: '通過',
  solvability: '通過',
  syllabus: '通過',
  clarity: '通過',
  trap: '通過',
  explanation: '通過',
  difficulty_engineering: '通過',
  originality: '通過',
  disclosure: '通過',
} as const

test('公式 (1) 不向下取整', () => {
  assert.equal(upgradeThreshold(15), 16.5)
  assert.equal(meetsUpgradeTarget(16, 15), false)
  assert.equal(meetsUpgradeTarget(16.5, 15), true)
  assert.equal(meetsUpgradeTarget(17, 15), true)
  assert.equal(profileComposite('p2_mc'), 11)
  assert.equal(profileComposite('p1_a2'), 15)
  assert.equal(composite(BASELINE_PROFILES.p1_b.scores), 18)
})

test('維度超出 1 至 5 會被拒絕', () => {
  assert.throws(() => composite({ reasoning: 0, stepIntegration: 3, trapQuality: 3, expression: 3, transfer: 3 }))
  assert.throws(() => composite({ reasoning: 3.5, stepIntegration: 3, trapQuality: 3, expression: 3, transfer: 3 }))
})

test('基準剖面按題型、卷別標籤與分值帶分類', () => {
  assert.equal(classifyBaseline({ type: 'mc', marks: 1, content: '求 x' }).profileId, 'p2_mc')
  assert.equal(classifyBaseline({ type: 'mc', marks: 1 }).precision, 'mc_default')
  const a1 = classifyBaseline({ type: 'long', marks: 4, content: '〔卷一・甲部(1)〕化簡' })
  assert.equal(a1.profileId, 'p1_a1')
  assert.equal(a1.precision, 'section_tag')
  assert.equal(a1.officialStatistic, false)
  assert.equal(classifyBaseline({ type: 'long', marks: 6, content: '甲部(2) 求體積' }).profileId, 'p1_a2')
  assert.equal(classifyBaseline({ type: 'long', marks: 8, content: '〔卷一・乙部〕' }).profileId, 'p1_b')
  assert.equal(classifyBaseline({ type: 'long', marks: 10, content: '求方程' }).precision, 'marks_band')
  assert.equal(classifyBaseline({ type: 'long', marks: 10, content: '求方程' }).profileId, 'p1_b')
  assert.equal(classifyBaseline({ type: 'text', marks: 3, content: '求值' }).profileId, 'p1_a1')
})

test('客觀缺陷先於 A/B，重複題幹標 C', () => {
  const a = { id: 'a', topic: 'probability', type: 'mc', content: '同一題幹', options: ['1', '2', '3', '4'], correctIndex: 0, explanation: '因為總數。' }
  const b = { ...a, id: 'b' }
  const map = buildAssetMap([a, b], RUBRIC_VERSION)
  assert.equal(map.rows.length, 2)
  assert.ok(map.rows.every((row) => row.abcGrade === 'C' && row.abcReasons.includes('duplicate_stem')))
  assert.equal(map.rows[0].verifiedDsePlus10, false)
})

test('缺答案、超綱與有圖無檔都是 C', () => {
  assert.ok(defectReasons({ id: 'x', topic: 'calculus', type: 'mc', content: '見下圖', options: ['1', '1'], correctIndex: 0, explanation: '' }, false).includes('off_syllabus_topic'))
  const reasons = defectReasons({ id: 'y', topic: 'circles', type: 'long', marks: 4, content: '見下圖求角', referenceAnswer: '' }, false)
  assert.ok(reasons.includes('missing_answer'))
  assert.ok(reasons.includes('missing_explanation'))
  assert.ok(reasons.includes('figure_referenced_without_asset'))
})

test('試點抽樣穩定，並先保留書寫題', () => {
  const rows = [
    { id: 'm2', topic: 'b', type: 'mc' },
    { id: 'm1', topic: 'a', type: 'mc' },
    { id: 'l1', topic: 'b', type: 'long' },
    { id: 'm3', topic: 'a', type: 'mc' },
  ]
  assert.deepEqual(selectPilotIds(rows, 3), ['l1', 'm1', 'm2'])
  assert.deepEqual(selectPilotIds(rows, 3), selectPilotIds([...rows].reverse(), 3))
})

test('規則代理分數有上限，而且跨過公式仍標未驗證', () => {
  const easy = proxyScoreCurrent({
    id: 'e',
    topic: 'indices',
    type: 'mc',
    marks: 1,
    content: '化簡 2^2',
    options: ['4', '2', '8', '6'],
    correctIndex: 0,
    explanation: '直接計算。',
  })
  assert.equal(easy.scores.reasoning, 1)
  assert.equal(easy.scores.transfer, 1)
  const graded = gradeAgainstBaseline(6, 11, [])
  assert.equal(graded.grade, 'B')
  const above = gradeAgainstBaseline(16, 11, [])
  assert.equal(above.grade, 'A')
  assert.ok(above.reasons.includes('proxy_at_or_above_formula_not_verified'))
  assert.equal(gradeAgainstBaseline(16, 11, ['duplicate_stem']).grade, 'C')
})

test('AI 初審未通過就不能進入人手覆核', () => {
  const record = createDraft({
    draftId: 'gate-ai',
    sourceQuestionId: 'src',
    baselineProfileId: 'p2_mc',
    proposed: { reasoning: 4, stepIntegration: 3, trapQuality: 3, expression: 2, transfer: 3 },
  })
  moveToAiReview(record, '2026-11-26T22:00:00+08:00')
  applyAiReview(
    record,
    decideAiReview({ ...AI_PASS, difficulty_engineering: '不通過' }, '只加運算量。'),
    '2026-11-26T22:01:00+08:00',
  )
  assert.equal(record.status, 'loop2_draft')
  assert.throws(() => moveToTwoPersonReview(record, '2026-11-26T22:02:00+08:00'), PipelineGateError)
})

test('正確性無法判斷亦不能進入人手覆核', () => {
  const review = decideAiReview({ ...AI_PASS, correctness: '無法判斷' }, '計算未能核對。')
  assert.equal(review.decision, 'rework')
})

test('Loop 5 維持待批准，而且不改變原狀態', () => {
  const record = createDraft({
    draftId: 'gate-loop5',
    sourceQuestionId: 'src',
    baselineProfileId: 'p2_mc',
    proposed: { reasoning: 4, stepIntegration: 3, trapQuality: 3, expression: 2, transfer: 3 },
  })
  const result = attemptLoop5(record, '2026-11-26T22:05:00+08:00')
  assert.equal(result.ok, false)
  assert.equal(result.label, '待批准')
  assert.equal(record.status, 'loop2_draft')
  assert.equal(record.loop5.state, 'blocked')
})

test('披露草稿未接上介面，學生作答開關關閉', () => {
  assert.match(PREDICTION_DISCLOSURE_ZH, /非官方參考估算/)
  assert.match(PREDICTION_DISCLOSURE_ZH, /同一個結果畫面/)
  assert.match(BANK_DISCLOSURE_ZH, /自行編寫/)
  assert.match(BANK_DISCLOSURE_ZH, /未經 HKDSE 學科教師審核/)
  assert.equal(PREVIEW_ITEM_LABEL_ZH, '未經 HKDSE 學科教師審核')
  assert.equal(STUDENT_ANSWER_USE.calibration, false)
  assert.equal(STUDENT_ANSWER_USE.ai, false)
  const page = readFileSync('docs/loop-engineering/disclosure-zh-hk.md', 'utf8')
  assert.ok(page.includes(PREDICTION_DISCLOSURE_ZH))
  assert.ok(page.includes(BANK_DISCLOSURE_ZH))
  assert.match(page, /沒有改結果頁/)
})

test('提示與問卷已存放，問卷不可發放', () => {
  const upgrade = loadStoredPrompt('upgrade')
  const ai = loadStoredPrompt('aiReview')
  const two = loadStoredPrompt('twoPersonReview')
  assert.match(upgrade, /基準分乘以 1\.10/)
  assert.match(upgrade, /不得只靠加長計算/)
  assert.match(ai, /不得進入人手覆核/)
  assert.match(ai, /通過／不通過／無法判斷/)
  assert.match(two, /未經 HKDSE 學科教師審核/)
  assert.match(two, /專家可上線/)
  const questionnaire = userTestQuestionnaireStatus()
  assert.equal(questionnaire.enabled, false)
  assert.equal(questionnaire.mayDistribute, false)
  assert.equal(questionnaire.label, '待批准')
  assert.match(loadStoredPrompt('questionnaireBlocked'), /未批准前不得發放/)
})

test('資料庫草稿不上正式庫，也不碰題庫版本表', () => {
  const sql = readFileSync('supabase/migrations/0039_loop_engineering_week12.DRAFT.sql', 'utf8')
  assert.match(sql, /DO NOT APPLY/)
  assert.match(sql, /enable row level security/)
  assert.match(sql, /revoke all on public\.loop_eng_pipeline_items from anon, authenticated/)
  assert.match(sql, /uses_student_answers = false/)
  assert.match(sql, /verified_dse_plus_10 = false/)
  assert.match(sql, /未經 HKDSE 學科教師審核/)
  assert.doesNotMatch(sql, /loop5_user_testing/)
  assert.doesNotMatch(sql, /alter table public\.question_bank_versions/i)
  assert.doesNotMatch(sql, /insert into public\.questions/i)
  assert.doesNotMatch(sql, /\buser_id\b/)
})

test('八條試跑草稿留在未發佈預覽或退回，沒有已驗證達標', () => {
  const bundle = buildWeek12DryRun()
  assert.equal(bundle.records.length, 8)
  assert.equal(bundle.loop5Attempt.ok, false)
  assert.equal(bundle.loop5Attempt.label, '待批准')
  const preview = bundle.records.filter((record) => record.status === 'preview')
  const returned = bundle.records.filter((record) => record.status === 'loop2_draft')
  assert.equal(preview.length, 6)
  assert.equal(returned.length, 2)
  for (const record of bundle.records) {
    assert.equal(record.published, false)
    assert.equal(record.verifiedDsePlus10, false)
    assert.equal(record.expertReleaseClaimed, false)
    assert.equal(record.usesStudentAnswers, false)
    assert.equal(record.difficultyClaim, '未驗證')
    assert.equal(record.disclosureLabel, '未經 HKDSE 學科教師審核')
    assert.equal(JSON.stringify(record).includes('已達 DSE+10%'), false)
    assert.equal(JSON.stringify(record).includes('專家可上線'), false)
  }
  const blocked = bundle.records.find((record) => record.draftId === 'loop-w12-008')
  assert.equal(blocked?.aiReview?.decision, 'rework')
  assert.equal(blocked?.twoPersonReview, null)
  const human = bundle.records.find((record) => record.draftId === 'loop-w12-007')
  assert.equal(human?.aiReview?.decision, 'pass_to_human')
  assert.equal(human?.twoPersonReview?.conclusion, 'rework')
  const tracked = bundle.records.find((record) => record.draftId === 'loop-w12-006')
  assert.equal(tracked?.status, 'preview')
  assert.ok(tracked?.events.some((event) => event.to === 'loop5_user_testing' && event.ok === false))
  for (const record of preview) {
    assert.equal(record.formulaMetByProposedScores, true)
    assert.equal(record.twoPersonReview?.signoffKind, 'scaffold_not_subject_teacher')
    assert.equal(record.twoPersonReview?.independentReviewers, false)
  }
})

test('已提交的資產地圖與試點跟建造器一致', async () => {
  const loadMod = await import('../../data/questions/load.ts')
  const load = loadMod.loadSubjectQuestions
  const items = await load('math')
  const built = buildAssetMap(items, RUBRIC_VERSION)
  const committed = JSON.parse(readFileSync('data/loop-engineering/math-compulsory-asset-map.json', 'utf8'))
  const pilot = JSON.parse(readFileSync('data/loop-engineering/math-compulsory-pilot-scores.json', 'utf8'))
  assert.equal(committed.itemCount, built.itemCount)
  assert.equal(committed.itemCount, items.length)
  assert.ok(committed.itemCount > 1000)
  assert.deepEqual(committed.summary, built.summary)
  assert.deepEqual(committed.rows, built.rows)
  assert.equal(pilot.verifiedDsePlus10, false)
  assert.equal(pilot.needsHumanConfirmation, true)
  assert.equal(pilot.pilotCount, 50)
  assert.deepEqual(pilot.pilot, built.pilot)
  const ids = new Set(built.rows.map((row) => row.id))
  assert.ok(built.pilot.every((row) => ids.has(row.id)))
  assert.ok(built.pilot.every((row) => row.verifiedDsePlus10 === false))
  const topics = new Set(built.pilot.map((row) => row.topic))
  assert.equal(topics.size, new Set(built.rows.map((row) => row.topic)).size)
})
