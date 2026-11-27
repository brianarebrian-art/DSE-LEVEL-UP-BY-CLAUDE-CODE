/**
 * 把抽樣列變成未發佈草稿，並跑 Loop 3。
 * 不寫入練習題庫，不進入 Loop 4 的已簽署狀態，不進入 Loop 5。
 */
import week58Drafts from '../../data/loop-engineering/week58-drafts.json'
import { RUBRIC_VERSION } from './rubric.ts'
import { LOOP5_BLOCKED_LABEL_ZH } from './disclosure.ts'
import { type SampleCandidate, WEEK58_AUTHORIZED_MAX, WEEK58_AUTHORIZED_MIN, WEEK58_AUTHORIZED_ON, WEEK58_FIRST_BATCH } from './week58-scope.ts'
import { WEEK58_AT, allowedTopicSet, createWeek58Item, type Week58Item } from './week58-items.ts'
import { runWeek58Loop3 } from './week58-review.ts'
import { type PipelineRecord } from './pipeline.ts'

export interface Week58DraftEntry {
  item: Week58Item
  record: PipelineRecord
}

export interface Week58Bundle {
  authorizedOn: typeof WEEK58_AUTHORIZED_ON
  authorizedRange: { min: number; max: number }
  firstBatchCount: number
  rangeNotNarrowed: true
  subject: 'math'
  rubricVersion: typeof RUBRIC_VERSION
  verifiedDsePlus10: false
  published: false
  releaseChannel: 'unpublished_preview'
  humanReview: 'not_started'
  loop5: typeof LOOP5_BLOCKED_LABEL_ZH
  noteZh: string
  counts: { produced: number; passedLoop3: number; rewound: number }
  byTopic: Array<{ topic: string; topicZh: string; count: number }>
  byType: Record<string, number>
  byProfile: Record<string, number>
  drafts: Week58DraftEntry[]
}

export function buildWeek58Bundle(rows: readonly SampleCandidate[], at = WEEK58_AT): Week58Bundle {
  if (rows.length < WEEK58_AUTHORIZED_MIN || rows.length > WEEK58_AUTHORIZED_MAX) {
    throw new Error('草稿數量必須落在已確認的 200 至 500')
  }
  const allowed = allowedTopicSet()
  const used = new Set<string>()
  const drafts = rows.map((row, index) => {
    const draftId = `loop-w58-${String(index + 1).padStart(3, '0')}`
    const item = createWeek58Item(row, draftId, used)
    const record = runWeek58Loop3(item, allowed, at)
    if (record.published !== false || record.verifiedDsePlus10 || record.twoPersonReview) {
      throw new Error(`草稿狀態不允許發佈或已簽署：${draftId}`)
    }
    return { item, record }
  })
  const passedLoop3 = drafts.filter((entry) => entry.record.status === 'loop3_ai_first_review' && entry.record.aiReview?.decision === 'pass_to_human').length
  const rewound = drafts.filter((entry) => entry.record.status === 'loop2_draft').length
  if (passedLoop3 + rewound !== drafts.length) {
    throw new Error('有草稿停在 Loop 3 與回爐以外的狀態')
  }
  return {
    authorizedOn: WEEK58_AUTHORIZED_ON,
    authorizedRange: { min: WEEK58_AUTHORIZED_MIN, max: WEEK58_AUTHORIZED_MAX },
    firstBatchCount: rows.length,
    rangeNotNarrowed: true,
    subject: 'math',
    rubricVersion: RUBRIC_VERSION,
    verifiedDsePlus10: false,
    published: false,
    releaseChannel: 'unpublished_preview',
    humanReview: 'not_started',
    loop5: LOOP5_BLOCKED_LABEL_ZH,
    noteZh: `已確認範圍仍是必修數學 ${WEEK58_AUTHORIZED_MIN} 至 ${WEEK58_AUTHORIZED_MAX} 條升級草稿。這是範圍內的第一批 ${rows.length} 條，不是把範圍收窄成 ${rows.length}。草稿未發佈，難度未驗證，兩人覆核未開始。`,
    counts: { produced: drafts.length, passedLoop3, rewound },
    byTopic: countTopics(drafts),
    byType: countBy(drafts, (entry) => entry.item.itemType),
    byProfile: countBy(drafts, (entry) => entry.item.baselineProfileId),
    drafts,
  }
}

function countTopics(drafts: Week58DraftEntry[]): Week58Bundle['byTopic'] {
  const map = new Map<string, { topicZh: string; count: number }>()
  for (const entry of drafts) {
    const current = map.get(entry.item.topic) ?? { topicZh: entry.item.topicZh, count: 0 }
    current.count += 1
    map.set(entry.item.topic, current)
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'en'))
    .map(([topic, value]) => ({ topic, topicZh: value.topicZh, count: value.count }))
}

function countBy(drafts: Week58DraftEntry[], key: (entry: Week58DraftEntry) => string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const entry of drafts) {
    const name = key(entry)
    out[name] = (out[name] ?? 0) + 1
  }
  return out
}

export function renderTwoPersonSheet(bundle: Week58Bundle): string {
  const lines = [
    '# 第 5–8 星期兩人批次覆核表（未開始）',
    '',
    '這不是資深 HKDSE 學科教師雙審。沒有任何一列已簽署，不得當成覆核通過，也不得當成可留預覽。',
    '',
    '覆核人 A：__________    覆核人 B：__________',
    '日期（香港時間）：__________',
    '簽署紀錄：未開始。完成時只可使用 scaffold_not_subject_teacher，而且兩欄覆核人不是獨立學科教師。',
    '',
    `${bundle.noteZh}`,
    '',
    `AI 初審通過 ${bundle.counts.passedLoop3} 條，回爐 ${bundle.counts.rewound} 條。通過只表示可交人手覆核。`,
    '',
    '| 草稿 | 來源題號 | 課題 | AI 初審 | 覆核人 A | 覆核人 B | 結論 |',
    '|---|---|---|---|---|---|---|',
  ]
  for (const entry of bundle.drafts) {
    const ai = entry.record.aiReview?.decision === 'pass_to_human' ? '可交人手覆核' : '回爐'
    lines.push(`| ${entry.item.draftId} | ${entry.item.sourceQuestionId} | ${entry.item.topic} | ${ai} |  |  | 未開始 |`)
  }
  lines.push('')
  lines.push('每人每個工作日細審約 10 至 15 條。不要為趕進度把上表空白格填成通過。')
  lines.push('')
  return lines.join('\n')
}

export interface Week58PreviewModel {
  noteZh: string
  counts: Week58Bundle['counts']
  authorizedRange: Week58Bundle['authorizedRange']
  verifiedDsePlus10: false
  humanReview: 'not_started'
  drafts: Array<{
    draftId: string
    sourceQuestionId: string
    topicZh: string
    itemType: string
    status: string
    aiDecision: string | null
    gistZh: string
    content: string
    options?: string[]
    correctIndex?: number
    referenceAnswer?: string
    explanation: string
    disclosureZh: string
  }>
}

export function toPreviewModel(bundle: Week58Bundle): Week58PreviewModel {
  return {
    noteZh: bundle.noteZh,
    counts: bundle.counts,
    authorizedRange: bundle.authorizedRange,
    verifiedDsePlus10: false,
    humanReview: bundle.humanReview,
    drafts: bundle.drafts.map((entry) => ({
      draftId: entry.item.draftId,
      sourceQuestionId: entry.item.sourceQuestionId,
      topicZh: entry.item.topicZh,
      itemType: entry.item.itemType,
      status: entry.record.status,
      aiDecision: entry.record.aiReview?.decision ?? null,
      gistZh: entry.item.gistZh,
      content: entry.item.content,
      options: entry.item.options,
      correctIndex: entry.item.correctIndex,
      referenceAnswer: entry.item.referenceAnswer,
      explanation: entry.item.explanation,
      disclosureZh: entry.item.disclosureZh,
    })),
  }
}

export function loadWeek58Bundle(): Week58Bundle {
  return week58Drafts as unknown as Week58Bundle
}

export function loadWeek58PreviewModel(): Week58PreviewModel {
  return toPreviewModel(loadWeek58Bundle())
}

export const WEEK58_BATCH_SIZE = WEEK58_FIRST_BATCH
