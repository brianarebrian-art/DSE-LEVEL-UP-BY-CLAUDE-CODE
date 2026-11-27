/**
 * Loop 2 草稿 → Loop 3 AI 初審 → Loop 4 兩人批次覆核 → 預覽。
 * Loop 5 真實學生實測不可進入，固定回報「待批准」。
 * AI 初審是進入人手覆核的硬閘。預覽題不得標成已驗證達標或教師可上線。
 */
import {
  type DimensionScores,
  type BaselineProfileId,
  composite,
  meetsUpgradeTarget,
  profileComposite,
  BASELINE_PROFILES,
} from './rubric.ts'
import {
  LOOP5_BLOCKED_LABEL_ZH,
  PREVIEW_ITEM_LABEL_ZH,
  STUDENT_ANSWER_USE,
} from './disclosure.ts'

export const PIPELINE_STATUSES = [
  'loop2_draft',
  'loop3_ai_first_review',
  'loop4_two_person_review',
  'preview',
] as const

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number]

export const AI_CHECKS = [
  'correctness',
  'solvability',
  'syllabus',
  'clarity',
  'trap',
  'explanation',
  'difficulty_engineering',
  'originality',
  'disclosure',
] as const

export type AiCheck = (typeof AI_CHECKS)[number]
export type AiMark = '通過' | '不通過' | '無法判斷'

const BLOCKING_UNCERTAIN = new Set<AiCheck>(['correctness', 'solvability', 'syllabus', 'originality'])

export interface AiReview {
  decision: 'pass_to_human' | 'rework'
  results: Record<AiCheck, AiMark>
  noteZh: string
}

export interface TwoPersonReview {
  reviewerA: string
  reviewerB: string
  signoffKind: 'scaffold_not_subject_teacher'
  independentReviewers: false
  checks: {
    clarity: boolean
    answerConsistent: boolean
    syllabus: boolean
    explanation: boolean
    trap: boolean
    formulaNotOnlyArithmetic: boolean
    originality: boolean
  }
  conclusion: 'keep_preview' | 'rework' | 'retire_or_legal'
  noteZh: string
}

export interface PipelineRecord {
  draftId: string
  sourceQuestionId: string
  subject: 'math'
  status: PipelineStatus
  published: false
  releaseChannel: 'unpublished_preview'
  verifiedDsePlus10: false
  expertReleaseClaimed: false
  usesStudentAnswers: false
  difficultyClaim: '未驗證'
  disclosureLabel: typeof PREVIEW_ITEM_LABEL_ZH
  baselineProfileId: BaselineProfileId
  baselineComposite: number
  proposed: DimensionScores
  proposedComposite: number
  formulaMetByProposedScores: boolean
  aiReview: AiReview | null
  twoPersonReview: TwoPersonReview | null
  loop5: { state: 'blocked'; label: typeof LOOP5_BLOCKED_LABEL_ZH }
  events: PipelineEvent[]
}

export interface PipelineEvent {
  at: string
  from: PipelineStatus | 'none' | 'loop5_user_testing'
  to: PipelineStatus | 'loop5_user_testing'
  ok: boolean
  reasonZh: string
}

export class PipelineGateError extends Error {
  readonly blockedLabel?: string
  constructor(message: string, blockedLabel?: string) {
    super(message)
    this.name = 'PipelineGateError'
    this.blockedLabel = blockedLabel
  }
}

export function decideAiReview(results: Record<AiCheck, AiMark>, noteZh: string): AiReview {
  for (const check of AI_CHECKS) {
    if (!results[check]) throw new Error(`AI 初審缺少項目 ${check}`)
  }
  const failed = AI_CHECKS.some((check) => results[check] === '不通過')
  const uncertain = AI_CHECKS.some((check) => results[check] === '無法判斷' && BLOCKING_UNCERTAIN.has(check))
  return {
    decision: failed || uncertain ? 'rework' : 'pass_to_human',
    results,
    noteZh,
  }
}

export function createDraft(input: {
  draftId: string
  sourceQuestionId: string
  baselineProfileId: BaselineProfileId
  proposed: DimensionScores
  at?: string
}): PipelineRecord {
  const baselineComposite = profileComposite(input.baselineProfileId)
  const proposedComposite = composite(input.proposed)
  const record: PipelineRecord = {
    draftId: input.draftId,
    sourceQuestionId: input.sourceQuestionId,
    subject: 'math',
    status: 'loop2_draft',
    published: false,
    releaseChannel: 'unpublished_preview',
    verifiedDsePlus10: false,
    expertReleaseClaimed: false,
    usesStudentAnswers: false,
    difficultyClaim: '未驗證',
    disclosureLabel: PREVIEW_ITEM_LABEL_ZH,
    baselineProfileId: input.baselineProfileId,
    baselineComposite,
    proposed: input.proposed,
    proposedComposite,
    formulaMetByProposedScores: meetsUpgradeTarget(proposedComposite, baselineComposite),
    aiReview: null,
    twoPersonReview: null,
    loop5: { state: 'blocked', label: LOOP5_BLOCKED_LABEL_ZH },
    events: [],
  }
  record.events.push({
    at: input.at ?? '2026-11-26T21:53:00+08:00',
    from: 'none',
    to: 'loop2_draft',
    ok: true,
    reasonZh: '建立升級草稿。分數只供覆核，難度宣稱維持未驗證。',
  })
  assertRecordClaims(record)
  return record
}

export function moveToAiReview(record: PipelineRecord, at: string): PipelineRecord {
  assertTransition(record, 'loop3_ai_first_review')
  const from = record.status
  record.aiReview = null
  record.status = 'loop3_ai_first_review'
  record.events.push({
    at,
    from,
    to: 'loop3_ai_first_review',
    ok: true,
    reasonZh: '送交 AI 初審。進入本輪初審後，先前的通過結果不再有效。',
  })
  return record
}

export function applyAiReview(record: PipelineRecord, review: AiReview, at: string): PipelineRecord {
  if (record.status !== 'loop3_ai_first_review') {
    throw new PipelineGateError('AI 初審只可在 Loop 3 寫入')
  }
  record.aiReview = review
  if (review.decision === 'rework') {
    record.status = 'loop2_draft'
    record.events.push({
      at,
      from: 'loop3_ai_first_review',
      to: 'loop2_draft',
      ok: true,
      reasonZh: 'AI 初審未通過，退回 Loop 2。不得進入人手覆核。',
    })
  } else {
    record.events.push({
      at,
      from: 'loop3_ai_first_review',
      to: 'loop3_ai_first_review',
      ok: true,
      reasonZh: 'AI 初審通過，可以進入人手覆核。',
    })
  }
  return record
}

export function moveToTwoPersonReview(record: PipelineRecord, at: string): PipelineRecord {
  if (record.aiReview?.decision !== 'pass_to_human') {
    throw new PipelineGateError('AI 初審未通過，不得進入人手覆核')
  }
  assertTransition(record, 'loop4_two_person_review')
  const from = record.status
  record.status = 'loop4_two_person_review'
  record.events.push({ at, from, to: 'loop4_two_person_review', ok: true, reasonZh: '進入兩人批次覆核。此步不是學科教師審核。' })
  return record
}

export function applyTwoPersonReview(record: PipelineRecord, review: TwoPersonReview, at: string): PipelineRecord {
  if (record.status !== 'loop4_two_person_review') {
    throw new PipelineGateError('兩人覆核只可在 Loop 4 寫入')
  }
  if (record.aiReview?.decision !== 'pass_to_human') {
    throw new PipelineGateError('AI 初審未通過，不得進入人手覆核')
  }
  if (review.reviewerA.trim() === review.reviewerB.trim()) {
    throw new PipelineGateError('兩人覆核須留下兩個覆核欄位')
  }
  if (review.signoffKind !== 'scaffold_not_subject_teacher' || review.independentReviewers !== false) {
    throw new PipelineGateError('兩人覆核只能標成非正式學科教師的批次覆核，不得標成教師雙審')
  }
  record.twoPersonReview = review
  if (review.conclusion === 'keep_preview') {
    assertPreviewReady(record)
    record.status = 'preview'
    record.events.push({
      at,
      from: 'loop4_two_person_review',
      to: 'preview',
      ok: true,
      reasonZh: '可留未發佈預覽，並保留未經學科教師審核的標示。',
    })
  } else {
    record.status = 'loop2_draft'
    record.aiReview = null
    record.events.push({
      at,
      from: 'loop4_two_person_review',
      to: 'loop2_draft',
      ok: true,
      reasonZh: '兩人覆核不通過，退回 Loop 2。先前的 AI 初審不再有效，須重新初審。',
    })
  }
  assertRecordClaims(record)
  return record
}

export function attemptLoop5(record: PipelineRecord, at: string): { ok: false; label: typeof LOOP5_BLOCKED_LABEL_ZH } {
  record.events.push({
    at,
    from: record.status,
    to: 'loop5_user_testing',
    ok: false,
    reasonZh: '真實學生實測未獲批准，不得發放問卷或收集作答。',
  })
  record.loop5 = { state: 'blocked', label: LOOP5_BLOCKED_LABEL_ZH }
  return { ok: false, label: LOOP5_BLOCKED_LABEL_ZH }
}

function assertTransition(record: PipelineRecord, to: PipelineStatus): void {
  const allowed: Record<PipelineStatus, PipelineStatus[]> = {
    loop2_draft: ['loop3_ai_first_review'],
    loop3_ai_first_review: ['loop4_two_person_review', 'loop2_draft'],
    loop4_two_person_review: ['preview', 'loop2_draft'],
    preview: ['loop2_draft'],
  }
  if (!allowed[record.status].includes(to)) {
    throw new PipelineGateError(`不可由 ${record.status} 直接進入 ${to}`)
  }
}

function assertPreviewReady(record: PipelineRecord): void {
  const review = record.twoPersonReview
  if (!review || review.conclusion !== 'keep_preview') {
    throw new PipelineGateError('未有可留預覽的兩人覆核結論')
  }
  const checks = Object.values(review.checks)
  if (checks.some((value) => value !== true)) {
    throw new PipelineGateError('覆核清單未全部通過，不得進入預覽')
  }
  if (!record.formulaMetByProposedScores) {
    throw new PipelineGateError('擬評綜合分未達到公式 (1)，不得進入預覽')
  }
  if (record.disclosureLabel !== PREVIEW_ITEM_LABEL_ZH) {
    throw new PipelineGateError('預覽題必須標明未經 HKDSE 學科教師審核')
  }
  if (record.published || record.releaseChannel !== 'unpublished_preview') {
    throw new PipelineGateError('預覽題不得發佈到正式站')
  }
  if (BASELINE_PROFILES[record.baselineProfileId].scores.reasoning < 1) {
    throw new PipelineGateError('基準剖面無效')
  }
}

export function assertRecordClaims(record: PipelineRecord): void {
  if (record.verifiedDsePlus10 || record.expertReleaseClaimed || record.usesStudentAnswers) {
    throw new PipelineGateError('草稿不得宣稱已驗證達標、教師可上線，或使用學生作答')
  }
  if (record.difficultyClaim !== '未驗證') {
    throw new PipelineGateError('難度宣稱必須維持未驗證')
  }
  if (record.disclosureLabel !== PREVIEW_ITEM_LABEL_ZH) {
    throw new PipelineGateError('披露標示不正確')
  }
  if (STUDENT_ANSWER_USE.calibration || STUDENT_ANSWER_USE.ai) {
    throw new PipelineGateError('學生作答開關被打開')
  }
  const blob = JSON.stringify({
    note: record.aiReview?.noteZh,
    two: record.twoPersonReview?.noteZh,
    claim: record.difficultyClaim,
  })
  if (blob.includes('已達 DSE+10%') || blob.includes('專家可上線')) {
    throw new PipelineGateError('紀錄含有禁止使用的達標或上線標籤')
  }
}
