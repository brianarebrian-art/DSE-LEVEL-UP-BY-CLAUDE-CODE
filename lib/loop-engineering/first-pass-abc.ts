/**
 * 在練題首輪 A／B／C（first-pass-abc-v1，2026-11-27）。
 * 未經驗證，未經教師審核。不得寫入學生練習、目錄或批改載入器。
 * 輸出只保留 id、科目、題型、課題代號、分級、原因碼與方法版本。
 */
import { composite, classifyBaseline } from './rubric.ts'
import {
  type MapSourceItem,
  defectReasons,
  proxyScoreCurrent,
  stemFingerprint,
} from './asset-map.ts'

export const FIRST_PASS_METHOD_VERSION = 'first-pass-abc-v1'
export const FIRST_PASS_POLICY_DATE = '2026-11-27'
export const CLOSE_RATIO_MIN = 0.9
export const CLOSE_RATIO_MAX = 1.1

export const KNOWN_CONFIRMED_C = [
  { id: 'math_fl_ns04', subject: 'math' },
  { id: 'mb_n1_5_2', subject: 'math' },
] as const

export const OBJECTIVE_REASON_ORDER = [
  'missing_id',
  'missing_topic',
  'unknown_item_type',
  'duplicate_id',
  'missing_stem',
  'missing_options',
  'invalid_or_duplicate_answer',
  'missing_answer',
  'missing_explanation',
  'figure_referenced_without_asset',
  'off_syllabus_topic',
  'duplicate_stem',
] as const

export const AB_REASON_CODES = [
  'pending_subject_baseline',
  'below_typical_demand_proxy',
  'close_to_typical_demand_proxy',
  'above_close_band_unverified',
] as const

export const UNABLE_REASON_CODES = ['proxy_ratio_not_finite'] as const

const KNOWN_ITEM_TYPES = new Set(['mc', 'text', 'long'])

export const SERVED_SET_DEFINITION_ZH =
  '在練題是所有 isActive 科目經 loadSubjectQuestions 在伺服器路徑取出的題目：靜態題庫合併機器閘與實名批次，套用難度覆寫與全庫升級 overlay，再以 withoutWithheld 只留下 published。不讀雲端鏡像，不補雲端缺少的題，也不刪雲端多出的題。題數必須與 TOTAL_QUESTIONS 相同。'

export const FIRST_PASS_DISCLAIMER_ZH =
  '這是未經核實、未經教師審核的首輪分級。沒有套用到學生練習、目錄或批改。正式環境不顯示此頁。這不是官方考試統計，也不是已驗證的難度提升。'

export const FIRST_PASS_FRAME_ZH =
  '內部預覽。正式環境回 404。B 與 C 都未從練習池移除。'

export const FIRST_PASS_TITLE_ZH = '在練題首輪分級'

export const NOT_APPLIED_ZH = '這些分級只供檢視。學生仍然會做到未套用分級的題目。'

export const FIRST_PASS_LABELS = {
  served: '在練題',
  method: '方法版本',
  policyDate: '政策日期',
  subjects: '分科題數',
  subject: '科目',
  items: '題數',
  unable: '未能分級',
  reasons: '原因碼',
  reasonCounts: '原因碼次數',
  knownPair: '已確認並已由另一變更收起的兩條（不在在練題）',
  inventoried: '既有客觀 C 清單，仍在練、本輪不收起',
  newlyFound: '今次新發現的客觀 C',
  none: '0 條',
  proxyNote: 'A 只出現在必修數學，而且只代表規則代理落在接近典型要求的區間。其他科目沒有該科基準剖面，不標 A。',
} as const

export const KNOWN_CONFIRMED_C_ARCHIVE = 'data/questions/archive/objective-c-math-2026-11-27.json'
export const KNOWN_CONFIRMED_C_WITHDRAW_REASON = 'DUPLICATE_STEM'

export type FirstPassGrade = 'A' | 'B' | 'C'
export type FirstPassRecordGrade = FirstPassGrade | 'unable'

export interface FirstPassGradeRow {
  id: string
  subject: string
  itemType: string
  topic: string
  grade: FirstPassRecordGrade
  reasonCodes: string[]
  methodVersion: typeof FIRST_PASS_METHOD_VERSION
}

export interface FirstPassCandidate {
  id: string
  subject: string
  reasonCodes: string[]
}

export interface FirstPassSubjectCount {
  subject: string
  itemCount: number
  A: number
  B: number
  C: number
  unable: number
}

export interface FirstPassSummary {
  methodVersion: typeof FIRST_PASS_METHOD_VERSION
  policyDate: typeof FIRST_PASS_POLICY_DATE
  unverified: true
  teacherReviewed: false
  verifiedDsePlus10: false
  officialStatistic: false
  pilotFileUsed: false
  appliedToStudentPool: false
  servedSet: {
    itemCount: number
    subjectCount: number
    definitionZh: typeof SERVED_SET_DEFINITION_ZH
  }
  byGrade: { A: number; B: number; C: number; unable: number }
  bySubject: FirstPassSubjectCount[]
  reasonCounts: Record<string, number>
  objectiveC: {
    total: number
    knownConfirmedWithdrawalPair: FirstPassCandidate[]
    alreadyInLoopGradeCInventory: FirstPassCandidate[]
    newlyFound: FirstPassCandidate[]
  }
  disclaimerZh: typeof FIRST_PASS_DISCLAIMER_ZH
}

const ROW_KEYS = ['id', 'subject', 'itemType', 'topic', 'grade', 'reasonCodes', 'methodVersion'] as const
const ASCII_TOKEN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
// Identifiers may contain the characters already used by served ids and topic codes.
// Sentence punctuation and line breaks stay rejected so a stem cannot occupy the field.
const IDENTIFIER = /^[^\n\r\t。？！；：「」$\\]{1,64}$/

export function isFirstPassGradeRouteHidden(env?: {
  VERCEL_ENV?: string
  NODE_ENV?: string
}): boolean {
  const vercelEnv = env ? env.VERCEL_ENV : process.env.VERCEL_ENV
  const nodeEnv = env ? env.NODE_ENV : process.env.NODE_ENV
  return vercelEnv === 'production' || (vercelEnv == null && nodeEnv === 'production')
}

export function objectiveReasons(
  subject: string,
  item: MapSourceItem,
  duplicateStem: boolean,
  duplicateId: boolean,
): string[] {
  const found = new Set<string>()
  if (!item.id?.trim()) found.add('missing_id')
  if (!item.topic?.trim()) found.add('missing_topic')
  if (!KNOWN_ITEM_TYPES.has(item.type)) found.add('unknown_item_type')
  if (duplicateId) found.add('duplicate_id')
  for (const reason of defectReasons(item, duplicateStem)) {
    if (reason === 'off_syllabus_topic' && subject !== 'math') continue
    found.add(reason)
  }
  return OBJECTIVE_REASON_ORDER.filter((reason) => found.has(reason))
}

export function mathProxyRatio(item: MapSourceItem): number {
  const current = composite(proxyScoreCurrent(item).scores)
  const baseline = classifyBaseline(item).composite
  return current / baseline
}

export function gradeFromSignals(input: {
  subject: string
  objectiveReasons: readonly string[]
  proxyRatio: number | null
}): { grade: FirstPassRecordGrade; reasonCodes: string[] } {
  if (input.objectiveReasons.length > 0) {
    return { grade: 'C', reasonCodes: [...input.objectiveReasons] }
  }
  if (input.subject !== 'math') {
    return { grade: 'B', reasonCodes: ['pending_subject_baseline'] }
  }
  if (input.proxyRatio == null || !Number.isFinite(input.proxyRatio)) {
    return { grade: 'unable', reasonCodes: ['proxy_ratio_not_finite'] }
  }
  if (input.proxyRatio < CLOSE_RATIO_MIN) {
    return { grade: 'B', reasonCodes: ['below_typical_demand_proxy'] }
  }
  if (input.proxyRatio < CLOSE_RATIO_MAX) {
    return { grade: 'A', reasonCodes: ['close_to_typical_demand_proxy'] }
  }
  return { grade: 'B', reasonCodes: ['above_close_band_unverified'] }
}

export function gradeSubject(subject: string, items: readonly MapSourceItem[]): FirstPassGradeRow[] {
  const fingerprintCounts = new Map<string, number>()
  const idCounts = new Map<string, number>()
  for (const item of items) {
    const fingerprint = stemFingerprint(item.content)
    if (fingerprint) fingerprintCounts.set(fingerprint, (fingerprintCounts.get(fingerprint) ?? 0) + 1)
    const id = item.id ?? ''
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1)
  }

  const indexed = items.map((item, index) => ({ item, index }))
  indexed.sort((a, b) => (a.item.id ?? '').localeCompare(b.item.id ?? '', 'en') || a.index - b.index)

  return indexed.map(({ item }) => {
    const fingerprint = stemFingerprint(item.content)
    const duplicateStem = fingerprint != null && (fingerprintCounts.get(fingerprint) ?? 0) > 1
    const duplicateId = (idCounts.get(item.id ?? '') ?? 0) > 1
    const defects = objectiveReasons(subject, item, duplicateStem, duplicateId)
    const proxyRatio = subject === 'math' && defects.length === 0 ? mathProxyRatio(item) : null
    const graded = gradeFromSignals({
      subject,
      objectiveReasons: defects,
      proxyRatio,
    })
    const row: FirstPassGradeRow = {
      id: item.id ?? '',
      subject,
      itemType: item.type || 'unknown',
      topic: item.topic ?? '',
      grade: graded.grade,
      reasonCodes: graded.reasonCodes,
      methodVersion: FIRST_PASS_METHOD_VERSION,
    }
    assertGradeRowSafe(row)
    return row
  })
}

export function assertGradeRowSafe(row: FirstPassGradeRow): void {
  const keys = Object.keys(row)
  if (keys.length !== ROW_KEYS.length || ROW_KEYS.some((key) => !keys.includes(key))) {
    throw new Error(`grade row keys rejected for ${row.subject}/${row.id || '(empty id)'}`)
  }
  for (const token of [row.id, row.topic]) {
    if (!IDENTIFIER.test(token)) {
      throw new Error(`grade identifier rejected for ${row.subject} (length ${token.length})`)
    }
  }
  for (const token of [row.subject, row.itemType, row.grade, row.methodVersion]) {
    if (!ASCII_TOKEN.test(token)) {
      throw new Error(`grade token rejected for ${row.subject}/${row.id} (length ${token.length})`)
    }
  }
  if (row.methodVersion !== FIRST_PASS_METHOD_VERSION) {
    throw new Error(`unexpected method version on ${row.subject}/${row.id}`)
  }
  for (const reason of row.reasonCodes) {
    if (!ASCII_TOKEN.test(reason)) {
      throw new Error(`reason code rejected for ${row.subject}/${row.id} (length ${reason.length})`)
    }
  }
}

export function countSubject(subject: string, rows: readonly FirstPassGradeRow[]): FirstPassSubjectCount {
  const count: FirstPassSubjectCount = { subject, itemCount: rows.length, A: 0, B: 0, C: 0, unable: 0 }
  for (const row of rows) count[row.grade] += 1
  return count
}

export function buildFirstPassSummary(input: {
  servedCount: number
  bySubject: readonly FirstPassSubjectCount[]
  reasonCounts: Record<string, number>
  objectiveC: readonly FirstPassCandidate[]
  priorGradeCKeys: readonly string[]
  knownWithdrawnConfirmed: readonly FirstPassCandidate[]
}): FirstPassSummary {
  const byGrade = { A: 0, B: 0, C: 0, unable: 0 }
  for (const subject of input.bySubject) {
    byGrade.A += subject.A
    byGrade.B += subject.B
    byGrade.C += subject.C
    byGrade.unable += subject.unable
  }
  if (byGrade.A + byGrade.B + byGrade.C + byGrade.unable !== input.servedCount) {
    throw new Error('first-pass counts do not add up to the served set')
  }

  const keyOf = (row: { subject: string; id: string }) => `${row.subject}\t${row.id}`
  const objectiveKeys = new Set(input.objectiveC.map(keyOf))
  const known = new Set(KNOWN_CONFIRMED_C.map(keyOf))
  for (const knownItem of KNOWN_CONFIRMED_C) {
    if (objectiveKeys.has(keyOf(knownItem))) {
      throw new Error(`known withdrawn C is still in the served objective-C list: ${knownItem.subject}/${knownItem.id}`)
    }
  }
  if (input.knownWithdrawnConfirmed.length !== KNOWN_CONFIRMED_C.length) {
    throw new Error('known withdrawn C pair is incomplete')
  }
  for (const knownItem of KNOWN_CONFIRMED_C) {
    const row = input.knownWithdrawnConfirmed.find(
      (candidate) => candidate.id === knownItem.id && candidate.subject === knownItem.subject,
    )
    if (!row?.reasonCodes.includes('duplicate_stem')) {
      throw new Error(`known withdrawn C was not confirmed: ${knownItem.subject}/${knownItem.id}`)
    }
  }
  for (const prior of input.priorGradeCKeys) {
    if (known.has(prior)) continue
    if (!objectiveKeys.has(prior)) throw new Error(`loop grade-c id was not reproduced: ${prior.replace('\t', '/')}`)
  }

  const prior = new Set(input.priorGradeCKeys)
  const sortCandidates = (rows: FirstPassCandidate[]) =>
    rows.sort((a, b) => a.subject.localeCompare(b.subject, 'en') || a.id.localeCompare(b.id, 'en'))

  const knownConfirmedWithdrawalPair = sortCandidates(input.knownWithdrawnConfirmed.map(candidateOnly))
  const alreadyInLoopGradeCInventory = sortCandidates(
    input.objectiveC.filter((row) => !known.has(keyOf(row)) && prior.has(keyOf(row))).map(candidateOnly),
  )
  const newlyFound = sortCandidates(
    input.objectiveC.filter((row) => !known.has(keyOf(row)) && !prior.has(keyOf(row))).map(candidateOnly),
  )

  const bySubject = [...input.bySubject].sort((a, b) => a.subject.localeCompare(b.subject, 'en'))
  return {
    methodVersion: FIRST_PASS_METHOD_VERSION,
    policyDate: FIRST_PASS_POLICY_DATE,
    unverified: true,
    teacherReviewed: false,
    verifiedDsePlus10: false,
    officialStatistic: false,
    pilotFileUsed: false,
    appliedToStudentPool: false,
    servedSet: {
      itemCount: input.servedCount,
      subjectCount: bySubject.length,
      definitionZh: SERVED_SET_DEFINITION_ZH,
    },
    byGrade,
    bySubject,
    reasonCounts: sortRecord(input.reasonCounts),
    objectiveC: {
      total: input.objectiveC.length,
      knownConfirmedWithdrawalPair,
      alreadyInLoopGradeCInventory,
      newlyFound,
    },
    disclaimerZh: FIRST_PASS_DISCLAIMER_ZH,
  }
}

function candidateOnly(row: FirstPassCandidate): FirstPassCandidate {
  return { id: row.id, subject: row.subject, reasonCodes: [...row.reasonCodes] }
}

function sortRecord(record: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(record).sort((a, b) => a[0].localeCompare(b[0], 'en')))
}

export function serialiseJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}
