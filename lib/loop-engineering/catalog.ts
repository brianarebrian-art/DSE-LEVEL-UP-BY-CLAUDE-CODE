/**
 * 可按科、題型、分級查閱的資產列。
 * 輸出不含題幹、選項或解析。分級只有客觀缺陷 C，以及尚未人手評分的 unscored。
 * 規則代理分數不得寫入 grade。
 */
import {
  type BaselineProfileId,
  classifyBaseline,
} from './rubric.ts'
import {
  type Completeness,
  type MapSourceItem,
  completenessOf,
  defectReasons,
  stemFingerprint,
} from './asset-map.ts'

export type CatalogGrade = 'C' | 'unscored'

export interface CatalogRow {
  id: string
  subject: string
  topic: string
  topicZh: string
  itemType: string
  marks: number | null
  completeness: Completeness
  baselineProfileId: BaselineProfileId | null
  baselineStatus: 'platform_framework_proxy' | 'pending_subject_profile'
  grade: CatalogGrade
  gradeReasons: string[]
  verifiedDsePlus10: false
}

export interface CatalogQuery {
  subject?: string
  itemType?: string
  grade?: CatalogGrade
}

export function buildCatalog(subject: string, items: MapSourceItem[]): CatalogRow[] {
  const groups = new Map<string, string[]>()
  for (const item of items) {
    const fingerprint = stemFingerprint(item.content)
    if (!fingerprint) continue
    const group = groups.get(fingerprint) ?? []
    group.push(item.id)
    groups.set(fingerprint, group)
  }
  const duplicates = new Set<string>()
  for (const ids of groups.values()) {
    if (ids.length > 1) ids.forEach((id) => duplicates.add(id))
  }
  return items
    .map((item) => toCatalogRow(subject, item, duplicates.has(item.id)))
    .sort((a, b) => a.id.localeCompare(b.id, 'en'))
}

export function toCatalogRow(subject: string, item: MapSourceItem, duplicate: boolean): CatalogRow {
  // 微積分代號只對必修數學算超綱。物理、M1、M2 的同名課題仍在課程內。
  const reasons = defectReasons(item, duplicate).filter(
    (reason) => reason !== 'off_syllabus_topic' || subject === 'math',
  )
  const baseline = subject === 'math' ? classifyBaseline(item) : null
  return {
    id: item.id,
    subject,
    topic: item.topic,
    topicZh: item.topicZh?.trim() || item.topic,
    itemType: item.type,
    marks: typeof item.marks === 'number' ? item.marks : null,
    completeness: completenessOf(item),
    baselineProfileId: baseline?.profileId ?? null,
    baselineStatus: subject === 'math' ? 'platform_framework_proxy' : 'pending_subject_profile',
    grade: reasons.length > 0 ? 'C' : 'unscored',
    gradeReasons: reasons,
    verifiedDsePlus10: false,
  }
}

/** 寫入摘要時必須載入全部在練科目，篩選只影響查詢輸出。 */
export function subjectsToLoad(
  active: readonly string[],
  options: { subject?: string; writeSummary: boolean },
): string[] {
  if (options.writeSummary) return [...active]
  return options.subject ? [options.subject] : [...active]
}

export function queryCatalog(rows: CatalogRow[], query: CatalogQuery): CatalogRow[] {
  return rows.filter((row) => {
    if (query.subject && row.subject !== query.subject) return false
    if (query.itemType && row.itemType !== query.itemType) return false
    if (query.grade && row.grade !== query.grade) return false
    return true
  })
}

export interface SubjectCatalogSummary {
  subject: string
  itemCount: number
  byType: Record<string, number>
  byGrade: Record<CatalogGrade, number>
}

export function summariseCatalog(rows: CatalogRow[]): SubjectCatalogSummary[] {
  const bySubject = new Map<string, CatalogRow[]>()
  for (const row of rows) {
    const list = bySubject.get(row.subject) ?? []
    list.push(row)
    bySubject.set(row.subject, list)
  }
  return [...bySubject.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'en'))
    .map(([subject, list]) => {
      const byType: Record<string, number> = {}
      const byGrade: Record<CatalogGrade, number> = { C: 0, unscored: 0 }
      for (const row of list) {
        byType[row.itemType] = (byType[row.itemType] ?? 0) + 1
        byGrade[row.grade] += 1
      }
      return { subject, itemCount: list.length, byType, byGrade }
    })
}
