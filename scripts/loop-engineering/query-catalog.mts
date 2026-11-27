/**
 * 按科、題型、分級查閱在練題資產列。不把題幹寫入倉庫。
 *
 *   npm run loop:query -- --subject math --type mc --grade C
 *   npm run loop:query -- --subject math --grade unscored --count
 *   npm run loop:query -- --write-summary
 */
import { mkdirSync, writeFileSync } from 'node:fs'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../data/questions/load.ts')
const { subjects } = await mod<{ subjects: Array<{ id: string; isActive: boolean }> }>(
  '../../data/subjects.ts',
)
const catalog = await import('../../lib/loop-engineering/catalog.ts')

type Row = {
  id: string
  subject: string
  topic: string
  topicZh: string
  itemType: string
  marks: number | null
  grade: 'C' | 'unscored'
  gradeReasons: string[]
  baselineProfileId: string | null
  verifiedDsePlus10: false
}

const args = process.argv.slice(2)
const readFlag = (name: string) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}

const subject = readFlag('--subject')
const itemType = readFlag('--type')
const grade = readFlag('--grade')
const countOnly = args.includes('--count')
const writeSummary = args.includes('--write-summary')

if (grade && grade !== 'C' && grade !== 'unscored') {
  console.error('分級只可以是 C 或 unscored。A／B 尚未人手評分，規則代理不得當作分級。')
  process.exit(1)
}

const active = subjects.filter((item) => item.isActive).map((item) => item.id)
const wanted = catalog.subjectsToLoad(active, { subject, writeSummary })
if (writeSummary && (subject || itemType || grade)) {
  console.error('寫入摘要一律覆蓋全部在練科目。科、題型、分級只篩選這次的查詢輸出。')
}
const rows: Row[] = []
for (const id of wanted) {
  const items = await loadSubjectQuestions(id)
  rows.push(...catalog.buildCatalog(id, items))
}

if (writeSummary) {
  const summary = catalog.summariseCatalog(rows)
  const defects = rows
    .filter((row) => row.grade === 'C')
    .map((row) => ({
      id: row.id,
      subject: row.subject,
      topic: row.topic,
      topicZh: row.topicZh,
      itemType: row.itemType,
      marks: row.marks,
      grade: row.grade,
      gradeReasons: row.gradeReasons,
      baselineProfileId: row.baselineProfileId,
      verifiedDsePlus10: false as const,
    }))
  mkdirSync('data/loop-engineering', { recursive: true })
  writeFileSync(
    'data/loop-engineering/catalog-summary.json',
    JSON.stringify(
      {
        gradeValues: ['C', 'unscored'],
        noteZh:
          '分級只標客觀缺陷 C，其餘是 unscored。這不是人手 A／B，也不是已驗證的難度提升，更不是考評局統計。基準剖面目前只為必修數學而設。',
        subjects: summary,
      },
      null,
      2,
    ) + '\n',
  )
  writeFileSync(
    'data/loop-engineering/grade-c.json',
    JSON.stringify({ verifiedDsePlus10: false, items: defects }, null, 2) + '\n',
  )
  console.log(`已寫入精簡摘要。C 級 ${defects.length} 條，沒有題幹。`)
}

const matched = catalog.queryCatalog(rows, {
  subject,
  itemType,
  grade: grade as 'C' | 'unscored' | undefined,
})

if (!writeSummary || subject || itemType || grade) {
  if (countOnly) {
    console.log(String(matched.length))
  } else if (!writeSummary) {
    for (const row of matched) {
      console.log(
        [row.subject, row.itemType, row.grade, row.id, row.topic, row.marks ?? '', row.gradeReasons.join('|')].join(
          '\t',
        ),
      )
    }
    console.error(`共 ${matched.length} 條。輸出沒有題幹。`)
  }
}
