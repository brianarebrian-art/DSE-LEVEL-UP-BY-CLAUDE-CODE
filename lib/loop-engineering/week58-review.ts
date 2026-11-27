/**
 * Loop 3 九項清單的可重現檢查。
 * 對照 docs/loop-engineering/prompts/ai-review.md 與 review-process-zh-hk.md。
 * 軟項「無法判斷」不會改寫成通過，也不會因此單獨回爐。
 * 正確性、可解性、課綱、原創性的「無法判斷」會回爐。
 * 這裡不呼叫付費模型。
 */
import { BANK_DISCLOSURE_ZH, PREVIEW_ITEM_LABEL_ZH } from './disclosure.ts'
import {
  type AiCheck,
  type AiMark,
  type PipelineRecord,
  applyAiReview,
  createDraft,
  decideAiReview,
  moveToAiReview,
} from './pipeline.ts'
import { composite, meetsUpgradeTarget, profileComposite } from './rubric.ts'
import { OFF_SYLLABUS_TOPIC_IDS } from './asset-map.ts'
import {
  type Week58Item,
  PROPOSED_BY_PROFILE,
  placeOptions,
  solveWeek58,
  week58DisclosureZh,
} from './week58-items.ts'

export interface ChecklistInput {
  solvedOk: boolean
  correct: boolean
  syllabus: 'in' | 'off' | 'unknown'
  clear: boolean
  trap: 'present' | 'missing' | 'unclear'
  explanationOk: boolean
  difficulty: 'met' | 'failed' | 'unclear'
  originality: 'ok' | 'fail' | 'unclear'
  disclosureOk: boolean
}

const SOFT: readonly AiCheck[] = ['clarity', 'trap', 'explanation', 'difficulty_engineering', 'disclosure']

export function marksFromChecklist(input: ChecklistInput): Record<AiCheck, AiMark> {
  return {
    correctness: input.solvedOk ? (input.correct ? '通過' : '不通過') : '無法判斷',
    solvability: input.solvedOk ? (input.correct && input.clear ? '通過' : '不通過') : '無法判斷',
    syllabus: input.syllabus === 'in' ? '通過' : input.syllabus === 'off' ? '不通過' : '無法判斷',
    clarity: input.clear ? '通過' : '不通過',
    trap: input.trap === 'present' ? '通過' : input.trap === 'missing' ? '不通過' : '無法判斷',
    explanation: input.explanationOk ? '通過' : '不通過',
    difficulty_engineering: input.difficulty === 'met' ? '通過' : input.difficulty === 'failed' ? '不通過' : '無法判斷',
    originality: input.originality === 'ok' ? '通過' : input.originality === 'fail' ? '不通過' : '無法判斷',
    disclosure: input.disclosureOk ? '通過' : '不通過',
  }
}

export function noteForMarks(marks: Record<AiCheck, AiMark>): string {
  const decision = decideAiReview(marks, '待寫').decision
  const unclearSoft = SOFT.filter((key) => marks[key] === '無法判斷')
  if (decision === 'rework') return '初審未通過，退回草稿。不得進入人手覆核。'
  if (unclearSoft.length > 0) {
    return `可交人手覆核。以下項目是無法判斷，不得寫成通過：${unclearSoft.join('、')}。`
  }
  return '九項均為通過，可交人手覆核。難度宣稱維持未驗證。'
}

function syllabusOf(topic: string, allowed: ReadonlySet<string>): ChecklistInput['syllabus'] {
  if ((OFF_SYLLABUS_TOPIC_IDS as readonly string[]).includes(topic)) return 'off'
  if (allowed.has(topic)) return 'in'
  return 'unknown'
}

function originalityOf(content: string, disclosure: string): ChecklistInput['originality'] {
  if (/考評局試題|官方試卷|歷屆試題|文憑試.{0,8}題/.test(content)) return 'fail'
  if (/20[0-2]\d年/.test(content) && /試題/.test(content)) return 'unclear'
  if (disclosure.includes('自編') && disclosure.includes('不是香港考試及評核局')) return 'ok'
  return 'unclear'
}

function disclosureOk(item: Week58Item): boolean {
  if (item.disclosureZh !== week58DisclosureZh()) return false
  const blob = JSON.stringify(item)
  if (blob.includes('已達 DSE+10%') || blob.includes('已驗證 DSE+10%')) return false
  if (blob.includes('專家可上線') || blob.includes('教師審核通過')) return false
  if (!item.disclosureZh.includes(BANK_DISCLOSURE_ZH)) return false
  if (!item.disclosureZh.includes(PREVIEW_ITEM_LABEL_ZH)) return false
  if (!item.disclosureZh.includes('未驗證')) return false
  return true
}

export function checklistForItem(item: Week58Item, allowedTopics: ReadonlySet<string>): ChecklistInput {
  const solved = solveWeek58(item.family, item.params)
  const expected = PROPOSED_BY_PROFILE[item.baselineProfileId]
  const scoresMatch = JSON.stringify(item.proposed) === JSON.stringify(expected)
  let formula = false
  try {
    formula = meetsUpgradeTarget(composite(item.proposed), profileComposite(item.baselineProfileId))
  } catch {
    formula = false
  }
  const markersOk = Boolean(solved && solved.markers.every((marker) => item.content.includes(marker)))
  const scenarioOk = Boolean(solved && item.content.includes(solved.scenario))
  const answerLeaked = Boolean(solved && item.content.includes(solved.correctText))
  const stemHasAnswerPrefix = item.content.includes('結果是')
  const longShapeOk = item.itemType === 'mc'
    ? item.baselineProfileId === 'p2_mc' && !item.content.includes('(a)')
    : item.baselineProfileId !== 'p2_mc' &&
      item.content.includes('(a)') &&
      item.content.includes('(b)') &&
      (item.baselineProfileId !== 'p1_b' || item.content.includes('(c)'))
  const kindOk = item.upgradeKind !== 'bigger_numbers' && item.upgradeKind !== ('off_syllabus' as Week58Item['upgradeKind'])
  let difficulty: ChecklistInput['difficulty'] = 'failed'
  if (!solved) difficulty = 'unclear'
  else if (item.upgradeKind === 'bigger_numbers' || !scoresMatch || !formula || !markersOk || !longShapeOk || !kindOk) difficulty = 'failed'
  else difficulty = 'met'

  let correct = false
  let trap: ChecklistInput['trap'] = 'unclear'
  if (solved) {
    if (item.itemType === 'mc' && item.options && item.correctIndex != null) {
      const placed = placeOptions(solved.correctText, solved.traps, item.params.slot ?? 0)
      correct = item.correctIndex === placed.correctIndex && item.options.join('\n') === placed.options.join('\n')
      const trapsInOptions = solved.traps.every((text) => item.options?.includes(text))
      trap = trapsInOptions && correct ? 'present' : 'missing'
    } else if (item.itemType === 'long' && item.referenceAnswer) {
      correct = item.referenceAnswer.includes(solved.correctText) && item.referenceAnswer.includes('(a)')
      const trapsInExplanation = solved.traps.every((text) => item.explanation.includes(text))
      trap = trapsInExplanation ? 'present' : 'missing'
    } else {
      trap = 'missing'
    }
  }

  const explanationOk = item.explanation.includes('常見錯因') && item.explanation.includes('可遷移') && item.explanation.includes('正確結論')
  const clear = Boolean(solved) && scenarioOk && !answerLeaked && !stemHasAnswerPrefix && item.content.trim().length >= 20 && !/下圖|附圖/.test(item.content)

  return {
    solvedOk: Boolean(solved),
    correct,
    syllabus: syllabusOf(item.topic, allowedTopics),
    clear,
    trap,
    explanationOk,
    difficulty,
    originality: originalityOf(item.content, item.disclosureZh),
    disclosureOk: disclosureOk(item),
  }
}

export function reviewWeek58Item(item: Week58Item, allowedTopics: ReadonlySet<string>, noteOverride?: string) {
  const marks = marksFromChecklist(checklistForItem(item, allowedTopics))
  const noteZh = noteOverride ?? noteForMarks(marks)
  return { marks, review: decideAiReview(marks, noteZh) }
}

export function runWeek58Loop3(item: Week58Item, allowedTopics: ReadonlySet<string>, at: string): PipelineRecord {
  const record = createDraft({
    draftId: item.draftId,
    sourceQuestionId: item.sourceQuestionId,
    baselineProfileId: item.baselineProfileId,
    proposed: item.proposed,
    at,
  })
  moveToAiReview(record, at)
  const { review } = reviewWeek58Item(item, allowedTopics)
  applyAiReview(record, review, at)
  return record
}
