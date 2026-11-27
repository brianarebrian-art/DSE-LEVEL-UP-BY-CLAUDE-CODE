/**
 * 第 5–8 星期抽樣範圍。
 * 已確認範圍仍是必修數學 200 至 500 條。本模組的 200 是範圍內的第一批，不是把範圍收窄成 200。
 * 只選在練、未評 C、不是已點名保留的題。不改寫、不收起 C 級或重複題。
 */
import { type BaselineProfileId } from './rubric.ts'

export const WEEK58_AUTHORIZED_ON = '2026-11-27'
export const WEEK58_AUTHORIZED_MIN = 200
export const WEEK58_AUTHORIZED_MAX = 500
export const WEEK58_FIRST_BATCH = 200

/** 第 1–2 星期已點名的 C 級／重複題。本批不選、不改寫、不收起。 */
export const WEEK58_PROTECTED_SOURCE_IDS = ['math_fl_ns04', 'mb_n1_5_2'] as const

export interface SampleCandidate {
  id: string
  subject: string
  topic: string
  topicZh: string
  itemType: string
  marks: number | null
  grade: 'C' | 'unscored'
  gradeReasons: string[]
  baselineProfileId: BaselineProfileId | null
}

export function isWeek58Eligible(row: SampleCandidate, allowedTopics: ReadonlySet<string>): boolean {
  if (row.subject !== 'math') return false
  if (row.grade !== 'unscored') return false
  if (row.gradeReasons.length > 0) return false
  if ((WEEK58_PROTECTED_SOURCE_IDS as readonly string[]).includes(row.id)) return false
  if (!row.baselineProfileId) return false
  if (!allowedTopics.has(row.topic)) return false
  if (row.itemType !== 'mc' && row.itemType !== 'long') return false
  return true
}

/**
 * 先收全部合格書寫題，再按課題代號輪流取選擇題，直到 first batch。
 * 同一輸入的次序固定。
 */
export function selectWeek58Sample<T extends SampleCandidate>(
  rows: readonly T[],
  allowedTopics: ReadonlySet<string>,
  limit = WEEK58_FIRST_BATCH,
): T[] {
  if (limit < WEEK58_AUTHORIZED_MIN || limit > WEEK58_AUTHORIZED_MAX) {
    throw new Error(`抽樣題量必須落在 ${WEEK58_AUTHORIZED_MIN} 至 ${WEEK58_AUTHORIZED_MAX}`)
  }
  const eligible = rows
    .filter((row) => isWeek58Eligible(row, allowedTopics))
    .sort((a, b) => a.id.localeCompare(b.id, 'en'))
  const picked: T[] = []
  for (const row of eligible) {
    if (row.itemType === 'mc') continue
    if (picked.length >= limit) break
    picked.push(row)
  }
  const mcByTopic = new Map<string, T[]>()
  for (const row of eligible) {
    if (row.itemType !== 'mc') continue
    const list = mcByTopic.get(row.topic) ?? []
    list.push(row)
    mcByTopic.set(row.topic, list)
  }
  const topics = [...mcByTopic.keys()].sort((a, b) => a.localeCompare(b, 'en'))
  let added = true
  while (picked.length < limit && added) {
    added = false
    for (const topic of topics) {
      if (picked.length >= limit) break
      const next = mcByTopic.get(topic)?.shift()
      if (!next) continue
      picked.push(next)
      added = true
    }
  }
  if (picked.length !== limit) {
    throw new Error(`合格題不足以抽出 ${limit} 條，實際 ${picked.length}`)
  }
  return picked
}
