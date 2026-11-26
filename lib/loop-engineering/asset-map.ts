/**
 * 必修數學在練題的資產地圖。
 * 完整度與客觀缺陷由題庫欄位計算。五維「現況分」只在試點用規則代理，
 * 並標明須人工確認；不得當成已驗證的難度提升。
 */
import { createHash } from 'node:crypto'
import {
  type BaselineClassification,
  type BaselineProfileId,
  type DimensionScores,
  classifyBaseline,
  composite,
  meetsUpgradeTarget,
} from './rubric.ts'

export const PROXY_SCORER_ID = 'ruleset_proxy_v1'
export const PILOT_LIMIT = 50

export const OFF_SYLLABUS_TOPIC_IDS = ['calculus', 'differentiation', 'integration'] as const

export type AbcGrade = 'A' | 'B' | 'C' | 'unscored'

export interface MapSourceItem {
  id: string
  topic: string
  topicZh?: string
  type: string
  marks?: number | null
  difficulty?: string
  content?: string
  options?: string[]
  correctIndex?: number
  explanation?: string
  referenceAnswer?: string
  markingScheme?: string
  figure?: unknown
  image?: unknown
  imageUrl?: unknown
  diagram?: unknown
}

export interface Completeness {
  stem: boolean
  options: 'present' | 'missing' | 'not_applicable'
  answer: boolean
  explanation: boolean
  figures: 'not_applicable' | 'referenced_missing' | 'present'
}

export interface AssetRow {
  id: string
  subject: 'math'
  pool: 'in_practice_authored'
  topic: string
  topicZh: string
  itemType: string
  marks: number | null
  completeness: Completeness
  baseline: BaselineClassification & { labelZh: string }
  abcGrade: 'C' | 'unscored'
  abcReasons: string[]
  verifiedDsePlus10: false
}

export interface PilotScore {
  id: string
  topic: string
  itemType: string
  marks: number | null
  baselineProfileId: BaselineProfileId
  baselineComposite: number
  upgradeThreshold: number
  currentProxy: {
    scores: DimensionScores
    composite: number
    trace: string[]
    scorer: typeof PROXY_SCORER_ID
    needsHumanConfirmation: true
  }
  formulaMetByProxy: boolean
  verifiedDsePlus10: false
  abcGrade: 'A' | 'B' | 'C'
  abcReasons: string[]
}

export interface AssetMapResult {
  rubricVersion: string
  generatedFor: 'math-compulsory-in-practice'
  itemCount: number
  pilotCount: number
  scoringNoteZh: string
  summary: AssetSummary
  rows: AssetRow[]
  pilot: PilotScore[]
}

export interface AssetSummary {
  itemCount: number
  byType: Record<string, number>
  byTopic: Array<{ topic: string; topicZh: string; labelCount: number; count: number }>
  completeness: {
    stem: number
    optionsApplicable: number
    optionsPresent: number
    answer: number
    explanation: number
    figureReferencedMissing: number
    figurePresent: number
  }
  abc: { C: number; unscored: number }
  baselineProfiles: Record<string, number>
  defectReasons: Record<string, number>
  pilot: { count: number; A: number; B: number; C: number; proxyMeetsFormula: number }
}

const FIGURE_REF = /下圖|附圖|見圖|圖中|如圖|圖\s*\d|figure\s*\d/i

export function stemFingerprint(content: string | undefined): string | null {
  const norm = (content ?? '').normalize('NFKC').replace(/\s+/g, '').toLowerCase()
  if (!norm) return null
  return createHash('sha256').update(norm).digest('hex').slice(0, 16)
}

export function completenessOf(item: MapSourceItem): Completeness {
  const stem = Boolean(item.content?.trim())
  const isMc = item.type === 'mc'
  const options = item.options ?? []
  const optionsOk = options.length >= 2 && options.every((option) => option.trim().length > 0)
  const answer = isMc
    ? Number.isInteger(item.correctIndex) &&
      (item.correctIndex as number) >= 0 &&
      (item.correctIndex as number) < options.length &&
      new Set(options.map((option) => option.trim())).size === options.length
    : Boolean(item.referenceAnswer?.trim())
  const explanation = Boolean(item.explanation?.trim() || item.markingScheme?.trim())
  const mentionsFigure = FIGURE_REF.test(item.content ?? '')
  const hasAsset = Boolean(item.figure || item.image || item.imageUrl || item.diagram)
  const figures = !mentionsFigure ? 'not_applicable' : hasAsset ? 'present' : 'referenced_missing'
  return {
    stem,
    options: !isMc ? 'not_applicable' : optionsOk ? 'present' : 'missing',
    answer,
    explanation,
    figures,
  }
}

export function defectReasons(item: MapSourceItem, duplicate: boolean): string[] {
  const completeness = completenessOf(item)
  const reasons: string[] = []
  if (!completeness.stem) reasons.push('missing_stem')
  if (completeness.options === 'missing') reasons.push('missing_options')
  if (!completeness.answer) {
    reasons.push(item.type === 'mc' ? 'invalid_or_duplicate_answer' : 'missing_answer')
  }
  if (!completeness.explanation) reasons.push('missing_explanation')
  if (completeness.figures === 'referenced_missing') reasons.push('figure_referenced_without_asset')
  if ((OFF_SYLLABUS_TOPIC_IDS as readonly string[]).includes(item.topic)) reasons.push('off_syllabus_topic')
  if (duplicate) reasons.push('duplicate_stem')
  return reasons
}

export function proxyScoreCurrent(item: MapSourceItem): { scores: DimensionScores; trace: string[] } {
  const stem = item.content ?? ''
  const explanation = `${item.explanation ?? ''}\n${item.markingScheme ?? ''}`
  const subparts = (stem.match(/(?:^|\n)\s*\([a-d]\)/g) ?? []).length
  const conditional = /若|已知|由此|因而/.test(stem)
  const asksWhy = /解釋|為何|為什麼|比較|判斷|評論|說明/.test(stem)
  const shortStem = stem.replace(/\s/g, '').length < 40
  const errTalk = /常見|易錯|混淆|誤以為|陷阱|注意/.test(explanation)
  const trace: string[] = []

  let reasoning = 2
  if (shortStem && !conditional && subparts === 0) reasoning = 1
  if (conditional || asksWhy) reasoning = Math.max(reasoning, 3)
  if (subparts >= 2 && conditional) reasoning = Math.max(reasoning, 4)
  if (asksWhy && subparts >= 3) reasoning = 5
  if (reasoning === 5 && subparts < 3) reasoning = 4
  trace.push(`推理層級 ${reasoning}：按條件句、分題數與是否要求解釋計，不是人手覆核`)

  let stepIntegration = 1
  if (subparts >= 1 || conditional) stepIntegration = 2
  if (subparts >= 2 || /由此/.test(stem)) stepIntegration = 3
  if (subparts >= 3 || ((item.marks ?? 0) >= 8 && subparts >= 2)) stepIntegration = 4
  if (subparts >= 4 && (item.marks ?? 0) >= 10) stepIntegration = 5
  trace.push(`步驟整合 ${stepIntegration}：按分題與「由此」計`)

  let trapQuality = 1
  if (item.type === 'mc' && (item.options?.length ?? 0) >= 4) trapQuality = 2
  if (errTalk) trapQuality = Math.max(trapQuality, 3)
  if (errTalk && item.type === 'mc' && asksWhy) trapQuality = 4
  trace.push(`陷阱質量 ${trapQuality}：選擇題結構只計到 2；解析提及常見混淆才計到 3 或以上`)

  let expression = item.type === 'mc' ? 1 : 2
  if (item.type !== 'mc' && (item.marks ?? 0) >= 4) expression = 3
  if (asksWhy && item.type !== 'mc') expression = Math.max(expression, 4)
  if (item.type === 'mc' && asksWhy) expression = 2
  trace.push(`表達／論證 ${expression}：選擇題預設只要答案`)

  let transfer = 2
  if (shortStem && !conditional) transfer = 1
  if (/情境|商店|書展|書架|斜坡|實驗|設計/.test(stem)) transfer = 3
  if (transfer === 3 && asksWhy && subparts >= 2) transfer = 4
  trace.push(`遷移 ${transfer}：短題幹且無條件句計 1；自帶生活情境詞計 3`)

  const scores = { reasoning, stepIntegration, trapQuality, expression, transfer }
  return { scores, trace }
}

export function gradeAgainstBaseline(
  currentComposite: number,
  baselineComposite: number,
  defects: string[],
): { grade: 'A' | 'B' | 'C'; reasons: string[] } {
  if (defects.length > 0) return { grade: 'C', reasons: defects }
  const ratio = currentComposite / baselineComposite
  if (ratio < 0.9) return { grade: 'B', reasons: ['below_typical_demand'] }
  if (ratio < 1.1) return { grade: 'A', reasons: ['close_to_typical_demand'] }
  return { grade: 'A', reasons: ['proxy_at_or_above_formula_not_verified'] }
}

export function selectPilotIds(rows: Array<{ id: string; topic: string; type: string }>, limit = PILOT_LIMIT): string[] {
  const buckets = new Map<string, { mc: string[]; written: string[] }>()
  const sorted = [...rows].sort((a, b) => a.id.localeCompare(b.id, 'en'))
  for (const row of sorted) {
    const bucket = buckets.get(row.topic) ?? { mc: [], written: [] }
    if (row.type === 'mc') bucket.mc.push(row.id)
    else bucket.written.push(row.id)
    buckets.set(row.topic, bucket)
  }
  const topicIds = [...buckets.keys()].sort((a, b) => a.localeCompare(b, 'en'))
  const picked: string[] = []
  for (const topic of topicIds) {
    for (const id of buckets.get(topic)!.written) {
      if (picked.length >= limit) return picked
      picked.push(id)
    }
  }
  let added = true
  while (picked.length < limit && added) {
    added = false
    for (const topic of topicIds) {
      if (picked.length >= limit) break
      const id = buckets.get(topic)!.mc.shift()
      if (!id) continue
      picked.push(id)
      added = true
    }
  }
  return picked
}

export function buildAssetMap(items: MapSourceItem[], rubricVersion: string): AssetMapResult {
  const fingerprints = new Map<string, string[]>()
  for (const item of items) {
    const fingerprint = stemFingerprint(item.content)
    if (!fingerprint) continue
    const group = fingerprints.get(fingerprint) ?? []
    group.push(item.id)
    fingerprints.set(fingerprint, group)
  }
  const duplicateIds = new Set<string>()
  for (const group of fingerprints.values()) {
    if (group.length > 1) group.forEach((id) => duplicateIds.add(id))
  }

  const rows: AssetRow[] = items
    .map((item) => {
      const defects = defectReasons(item, duplicateIds.has(item.id))
      const baseline = classifyBaseline(item)
      return {
        id: item.id,
        subject: 'math' as const,
        pool: 'in_practice_authored' as const,
        topic: item.topic,
        topicZh: item.topicZh?.trim() || item.topic,
        itemType: item.type,
        marks: typeof item.marks === 'number' ? item.marks : null,
        completeness: completenessOf(item),
        baseline: {
          ...baseline,
          labelZh: baselineLabel(baseline.profileId),
        },
        abcGrade: defects.length > 0 ? ('C' as const) : ('unscored' as const),
        abcReasons: defects,
        verifiedDsePlus10: false as const,
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id, 'en'))

  const byId = new Map(items.map((item) => [item.id, item]))
  const pilotIds = selectPilotIds(rows.map((row) => ({ id: row.id, topic: row.topic, type: row.itemType })))
  const pilot: PilotScore[] = pilotIds.map((id) => {
    const item = byId.get(id)
    const row = rows.find((candidate) => candidate.id === id)
    if (!item || !row) throw new Error(`試點題 ${id} 不在資產地圖內`)
    const current = proxyScoreCurrent(item)
    const total = composite(current.scores)
    const graded = gradeAgainstBaseline(total, row.baseline.composite, row.abcReasons)
    return {
      id,
      topic: row.topic,
      itemType: row.itemType,
      marks: row.marks,
      baselineProfileId: row.baseline.profileId,
      baselineComposite: row.baseline.composite,
      upgradeThreshold: row.baseline.upgradeThreshold,
      currentProxy: {
        scores: current.scores,
        composite: total,
        trace: current.trace,
        scorer: PROXY_SCORER_ID,
        needsHumanConfirmation: true,
      },
      formulaMetByProxy: meetsUpgradeTarget(total, row.baseline.composite),
      verifiedDsePlus10: false,
      abcGrade: graded.grade,
      abcReasons: graded.reasons,
    }
  })

  const summary = summarise(rows, pilot)
  return {
    rubricVersion,
    generatedFor: 'math-compulsory-in-practice',
    itemCount: rows.length,
    pilotCount: pilot.length,
    scoringNoteZh:
      '全庫只計算欄位完整度、基準剖面與客觀 C 級缺陷。約 50 題的現況五維分是規則代理，須人工確認，不是已驗證的難度提升，也不是考評局統計。',
    summary,
    rows,
    pilot,
  }
}

function baselineLabel(profileId: BaselineProfileId): string {
  const labels: Record<BaselineProfileId, string> = {
    p2_mc: '卷二選擇題典型要求（平台操作讀法）',
    p1_a1: '卷一甲部(1) 典型要求（平台操作讀法）',
    p1_a2: '卷一甲部(2) 典型要求（平台操作讀法）',
    p1_b: '卷一乙部典型要求（平台操作讀法）',
  }
  return labels[profileId]
}

function summarise(rows: AssetRow[], pilot: PilotScore[]): AssetSummary {
  const byType: Record<string, number> = {}
  const topicCounts = new Map<string, { labels: Map<string, number>; count: number }>()
  const baselineProfiles: Record<string, number> = {}
  const defectReasons: Record<string, number> = {}
  const completeness = {
    stem: 0,
    optionsApplicable: 0,
    optionsPresent: 0,
    answer: 0,
    explanation: 0,
    figureReferencedMissing: 0,
    figurePresent: 0,
  }
  let c = 0
  for (const row of rows) {
    byType[row.itemType] = (byType[row.itemType] ?? 0) + 1
    const topic = topicCounts.get(row.topic) ?? { labels: new Map<string, number>(), count: 0 }
    topic.count += 1
    topic.labels.set(row.topicZh, (topic.labels.get(row.topicZh) ?? 0) + 1)
    topicCounts.set(row.topic, topic)
    baselineProfiles[row.baseline.profileId] = (baselineProfiles[row.baseline.profileId] ?? 0) + 1
    if (row.abcGrade === 'C') c += 1
    for (const reason of row.abcReasons) defectReasons[reason] = (defectReasons[reason] ?? 0) + 1
    if (row.completeness.stem) completeness.stem += 1
    if (row.completeness.options !== 'not_applicable') completeness.optionsApplicable += 1
    if (row.completeness.options === 'present') completeness.optionsPresent += 1
    if (row.completeness.answer) completeness.answer += 1
    if (row.completeness.explanation) completeness.explanation += 1
    if (row.completeness.figures === 'referenced_missing') completeness.figureReferencedMissing += 1
    if (row.completeness.figures === 'present') completeness.figurePresent += 1
  }
  return {
    itemCount: rows.length,
    byType,
    byTopic: [...topicCounts.entries()]
      .map(([topic, value]) => {
        const [topicZh] = [...value.labels.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hant'))[0]
        return { topic, topicZh, labelCount: value.labels.size, count: value.count }
      })
      .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic, 'en')),
    completeness,
    abc: { C: c, unscored: rows.length - c },
    baselineProfiles,
    defectReasons,
    pilot: {
      count: pilot.length,
      A: pilot.filter((row) => row.abcGrade === 'A').length,
      B: pilot.filter((row) => row.abcGrade === 'B').length,
      C: pilot.filter((row) => row.abcGrade === 'C').length,
      proxyMeetsFormula: pilot.filter((row) => row.formulaMetByProxy).length,
    },
  }
}
