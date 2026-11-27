/**
 * 由在練必修數學抽出第一批升級草稿。
 * 不改題庫、不套用 migration、不寫 question_bank_versions。
 *
 *   npm run loop:week58
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const mod = async <T>(path: string): Promise<T> =>
  await import(path).then((loaded: Record<string, unknown>) => (loaded.default ?? loaded) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string, options?: { skipUpgradeOverlay?: boolean }) => Promise<Array<Record<string, unknown>>>
}>('../../data/questions/load.ts')
const { buildCatalog } = await import('../../lib/loop-engineering/catalog.ts')
const { WEEK58_PROTECTED_SOURCE_IDS, selectWeek58Sample } = await import('../../lib/loop-engineering/week58-scope.ts')
const { allowedTopicSet, familyVariantCount, FAMILY_IDS, toCatalogInput } = await import('../../lib/loop-engineering/week58-items.ts')
const { buildWeek58Bundle, renderTwoPersonSheet } = await import('../../lib/loop-engineering/week58-batch.ts')
const { contentStatus, WITHDRAWN, PENDING_REVIEW } = await import('../../data/questions/hidden-topics.ts')
const { isMachineRestored } = await import('../../data/questions/machine-restored-ids.ts')

const allowed = allowedTopicSet()
for (const family of FAMILY_IDS) {
  const count = familyVariantCount(family)
  if (count < 12) throw new Error(`${family} 可覆算變體只有 ${count} 個`)
}

const baseline = await loadSubjectQuestions('math', { skipUpgradeOverlay: true })
const overlaid = await loadSubjectQuestions('math')
const baselineIds = baseline.map((item) => String(item.id)).sort()
const overlaidIds = overlaid.map((item) => String(item.id)).sort()
if (baselineIds.join('\n') !== overlaidIds.join('\n')) {
  throw new Error('略過 overlay 與預設載入的題號集合不同，先停止，避免把草稿混進練習池。')
}

const blocked = baseline.filter((item) => contentStatus('math', { id: String(item.id), topic: String(item.topic) }) !== 'published')
if (blocked.length) throw new Error(`預設載入仍含未發佈題 ${blocked.length} 條`)

const catalog = buildCatalog('math', baseline.map((item) => toCatalogInput(item)))
const selected = selectWeek58Sample(catalog, allowed)
for (const row of selected) {
  if ((WEEK58_PROTECTED_SOURCE_IDS as readonly string[]).includes(row.id)) throw new Error(`誤選受保護題 ${row.id}`)
  if (WITHDRAWN.math?.[row.id] || PENDING_REVIEW.math?.[row.id] || isMachineRestored(row.id)) {
    throw new Error(`誤選未發佈題 ${row.id}`)
  }
}

const bundle = buildWeek58Bundle(selected)
if (bundle.counts.produced !== 200 || bundle.counts.rewound !== 0 || bundle.counts.passedLoop3 !== 200) {
  throw new Error(`第一批閘門結果不是 200 通過、0 回爐：${JSON.stringify(bundle.counts)}`)
}

const byId = new Map(baseline.map((item) => [String(item.id), item]))
const overById = new Map(overlaid.map((item) => [String(item.id), item]))
let overlaySampleId = ''
let baselineHash = ''
let overlayHash = ''
for (const row of selected) {
  const before = String(byId.get(row.id)?.content ?? '')
  const after = String(overById.get(row.id)?.content ?? '')
  const beforeHash = createHash('sha256').update(before).digest('hex')
  const afterHash = createHash('sha256').update(after).digest('hex')
  if (beforeHash !== afterHash) {
    overlaySampleId = row.id
    baselineHash = beforeHash
    overlayHash = afterHash
    break
  }
}
if (!overlaySampleId) throw new Error('抽樣題在套用 overlay 前後的題幹雜湊沒有差異，無法核實 #259 是否改變練習文本。')

const overlayFile = readFileSync('data/questions/overlays/math.json', 'utf8')
const draftIdsInOverlay = bundle.drafts.filter((entry) => overlayFile.includes(entry.item.draftId)).length
if (draftIdsInOverlay !== 0) throw new Error('草稿編號出現在數學 overlay')

const practiceFiles = [
  'data/questions/load.ts',
  'lib/practice/bankCache.ts',
  'app/api/practice/catalog/route.ts',
  'app/api/practice/check/route.ts',
  'app/result/page.tsx',
  'app/result/ResultPageClient.tsx',
]
for (const file of practiceFiles) {
  const source = readFileSync(file, 'utf8')
  if (source.includes('week58') || source.includes('loop-w58-')) throw new Error(`${file} 參照了第 5–8 星期草稿`)
}

const scope = {
  authorizedOn: bundle.authorizedOn,
  subject: 'math',
  authorizedRange: bundle.authorizedRange,
  firstBatchCount: bundle.firstBatchCount,
  rangeNotNarrowed: true,
  noteZh: bundle.noteZh,
  protectedSourceIds: WEEK58_PROTECTED_SOURCE_IDS,
  selectionZh: '先取全部合格書寫題，再按課題代號輪流取選擇題。分級用略過 overlay 的在練題。',
  byTopic: bundle.byTopic,
  byType: bundle.byType,
  byProfile: bundle.byProfile,
  ids: selected.map((row) => ({
    id: row.id,
    topic: row.topic,
    topicZh: row.topicZh,
    itemType: row.itemType,
    marks: row.marks,
    baselineProfileId: row.baselineProfileId,
    grade: row.grade,
  })),
}

const isolation = {
  verifiedDsePlus10: false,
  practiceLoaderAppliesOverlayByDefault: true,
  evidenceZh: 'loadSubjectQuestions 預設呼叫 applyFullUpgradeOverlay。loadBank 沒有傳 skipUpgradeOverlay。練習 catalog 與 check 使用 loadBank。第 5–8 星期草稿不在 overlay，也不在題庫 loader。',
  baselineAndOverlayIdSetsMatch: true,
  publishedBaselineCount: baseline.length,
  overlayChangesSampleStemHash: true,
  sampleSourceId: overlaySampleId,
  baselineContentSha256: baselineHash,
  overlaidContentSha256: overlayHash,
  week58DraftIdsInMathOverlay: draftIdsInOverlay,
  draftIdPrefix: 'loop-w58-',
  draftStore: 'data/loop-engineering/week58-drafts.json',
  previewRoute: '/dev/loop-week58',
  productionPreviewRoute: '404 when VERCEL_ENV=production',
}

mkdirSync('data/loop-engineering', { recursive: true })
mkdirSync('docs/loop-engineering', { recursive: true })
writeFileSync('data/loop-engineering/week58-sample-scope.json', `${JSON.stringify(scope, null, 2)}\n`)
writeFileSync('data/loop-engineering/week58-drafts.json', `${JSON.stringify(bundle, null, 2)}\n`)
writeFileSync('data/loop-engineering/week58-isolation.json', `${JSON.stringify(isolation, null, 2)}\n`)
writeFileSync('docs/loop-engineering/week58-two-person-sheet.md', renderTwoPersonSheet(bundle))

console.log(`第一批 ${bundle.counts.produced} 條；Loop 3 通過 ${bundle.counts.passedLoop3}；回爐 ${bundle.counts.rewound}。`)
console.log(`課題數 ${bundle.byTopic.length}；書寫 ${bundle.byType.long ?? 0}；選擇 ${bundle.byType.mc ?? 0}。`)
console.log(`overlay 改變了抽樣題 ${overlaySampleId} 的題幹雜湊，草稿編號沒有寫入 overlay。`)
