/**
 * 由在練題重算首輪 A／B／C。不連線資料庫，不改題庫，不更新 question_bank_versions。
 * 不讀 50 題試點檔。輸出不含題幹。
 *
 *   npm run loop:first-pass-abc
 *   npm run loop:first-pass-abc -- --check
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const checkOnly = process.argv.includes('--check')

const mod = async <T>(specifier: string): Promise<T> =>
  await import(specifier).then((loaded: Record<string, unknown>) => (loaded.default ?? loaded) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<{ id: string }>>
}>('../../data/questions/load.ts')
const { getSubjectQuestions } = await mod<{
  getSubjectQuestions: (id: string) => Array<{ id: string }>
}>('../../data/questions/index.ts')
const { subjects } = await mod<{ subjects: Array<{ id: string; isActive: boolean }> }>('../../data/subjects.ts')
const { TOTAL_QUESTIONS } = await mod<{ TOTAL_QUESTIONS: number }>('../../data/questions/summary.generated.ts')
const firstPass = await import('../../lib/loop-engineering/first-pass-abc.ts')

const root = 'data/loop-engineering/first-pass-abc'
const gradesDir = `${root}/grades`
const prior = JSON.parse(readFileSync('data/loop-engineering/grade-c.json', 'utf8')) as {
  items: Array<{ id: string; subject: string }>
}
const priorGradeCKeys = prior.items.map((item) => `${item.subject}\t${item.id}`)
const withdrawn = JSON.parse(readFileSync('data/questions/withdrawn.json', 'utf8')) as Record<
  string,
  Record<string, { reason?: string }>
>
const archive = JSON.parse(readFileSync(firstPass.KNOWN_CONFIRMED_C_ARCHIVE, 'utf8')) as {
  withdrawReason?: string
  items: Array<{ id: string; subject: string; gradeReasons?: string[] }>
}
if (archive.withdrawReason !== firstPass.KNOWN_CONFIRMED_C_WITHDRAW_REASON) {
  throw new Error('known C archive withdraw reason drifted')
}
const archiveKeys = new Set(archive.items.map((item) => `${item.subject}\t${item.id}`))
const knownWithdrawnConfirmed = firstPass.KNOWN_CONFIRMED_C.map((item) => {
  const entry = withdrawn[item.subject]?.[item.id]
  if (!entry || entry.reason !== firstPass.KNOWN_CONFIRMED_C_WITHDRAW_REASON) {
    throw new Error(`known C is not withdrawn as ${firstPass.KNOWN_CONFIRMED_C_WITHDRAW_REASON}: ${item.subject}/${item.id}`)
  }
  if (!archiveKeys.has(`${item.subject}\t${item.id}`)) {
    throw new Error(`known C missing from archive: ${item.subject}/${item.id}`)
  }
  return { id: item.id, subject: item.subject, reasonCodes: ['duplicate_stem'] }
})

const active = subjects
  .filter((subject) => subject.isActive)
  .map((subject) => subject.id)
  .sort((a, b) => a.localeCompare(b, 'en'))

const bySubject = []
const reasonCounts: Record<string, number> = {}
const objectiveC: Array<{ id: string; subject: string; reasonCodes: string[] }> = []
const unable: Array<{ id: string; subject: string; itemType: string; topic: string; grade: 'unable'; reasonCodes: string[]; methodVersion: string }> = []
let servedCount = 0

for (const subjectId of active) {
  if (!/^[a-z0-9-]+$/.test(subjectId)) throw new Error(`unsafe subject id: ${subjectId}`)
  const loaded = await loadSubjectQuestions(subjectId)
  const published = getSubjectQuestions(subjectId)
  assertSameIds(subjectId, loaded, published)
  const rows = firstPass.gradeSubject(subjectId, loaded)
  if (rows.length !== loaded.length) throw new Error(`${subjectId}: graded rows do not cover the loader`)
  servedCount += rows.length
  bySubject.push(firstPass.countSubject(subjectId, rows))
  for (const row of rows) {
    for (const reason of row.reasonCodes) reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1
    if (row.grade === 'C') objectiveC.push({ id: row.id, subject: row.subject, reasonCodes: row.reasonCodes })
    if (row.grade === 'unable') unable.push(row)
  }
  const target = `${gradesDir}/${subjectId}.json`
  writeOrCheck(target, firstPass.serialiseJson(rows))
}

if (servedCount !== TOTAL_QUESTIONS) {
  throw new Error(`served set ${servedCount} does not match TOTAL_QUESTIONS ${TOTAL_QUESTIONS}`)
}

const summary = firstPass.buildFirstPassSummary({
  servedCount,
  bySubject,
  reasonCounts,
  objectiveC,
  priorGradeCKeys,
  knownWithdrawnConfirmed,
})
if (unable.length !== summary.byGrade.unable) {
  throw new Error(`unable rows ${unable.length} do not match the summary`)
}

writeOrCheck(`${root}/summary.json`, firstPass.serialiseJson(summary))
writeOrCheck(`${root}/unable.json`, firstPass.serialiseJson({
  methodVersion: firstPass.FIRST_PASS_METHOD_VERSION,
  unverified: true,
  teacherReviewed: false,
  appliedToStudentPool: false,
  itemCount: summary.byGrade.unable,
  items: unable,
}))
writeOrCheck(`${root}/objective-c-candidates.json`, firstPass.serialiseJson({
  methodVersion: firstPass.FIRST_PASS_METHOD_VERSION,
  unverified: true,
  teacherReviewed: false,
  appliedToStudentPool: false,
  noteZh: '只列 id、科目與原因碼。沒有題幹。這些候選沒有從練習池移除。',
  knownConfirmedWithdrawalPair: summary.objectiveC.knownConfirmedWithdrawalPair,
  alreadyInLoopGradeCInventory: summary.objectiveC.alreadyInLoopGradeCInventory,
  newlyFound: summary.objectiveC.newlyFound,
}))

console.log(`方法 ${summary.methodVersion}`)
console.log(`在練題 ${summary.servedSet.itemCount}`)
console.log(`A ${summary.byGrade.A}`)
console.log(`B ${summary.byGrade.B}`)
console.log(`C ${summary.byGrade.C}`)
console.log(`未能分級 ${summary.byGrade.unable}`)
console.log(`已知確認並已收起 C ${summary.objectiveC.knownConfirmedWithdrawalPair.length}`)
console.log(`既有客觀 C 清單（仍在練） ${summary.objectiveC.alreadyInLoopGradeCInventory.length}`)
console.log(`今次新發現的客觀 C ${summary.objectiveC.newlyFound.length}`)
for (const row of summary.objectiveC.knownConfirmedWithdrawalPair) {
  console.log(['withdrawn', row.subject, row.id, row.reasonCodes.join('|')].join('\t'))
}
for (const row of [...summary.objectiveC.alreadyInLoopGradeCInventory, ...summary.objectiveC.newlyFound]) {
  console.log(['served', row.subject, row.id, row.reasonCodes.join('|')].join('\t'))
}
if (checkOnly) console.log('已核對，沒有改寫。')

function assertSameIds(subjectId: string, loaded: Array<{ id: string }>, published: Array<{ id: string }>): void {
  const left = loaded.map((item) => item.id).sort((a, b) => a.localeCompare(b, 'en'))
  const right = published.map((item) => item.id).sort((a, b) => a.localeCompare(b, 'en'))
  if (left.length === right.length && left.every((id, index) => id === right[index])) return
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  const onlyLoader = [...leftSet].filter((id) => !rightSet.has(id)).slice(0, 8)
  const onlyPublished = [...rightSet].filter((id) => !leftSet.has(id)).slice(0, 8)
  throw new Error(
    `${subjectId}: loader ids ${left.length} differ from published ids ${right.length}; ` +
      `loader-only ${onlyLoader.join(',') || '-'}; published-only ${onlyPublished.join(',') || '-'}`,
  )
}

function writeOrCheck(path: string, body: string): void {
  if (checkOnly) {
    const current = readFileSync(path, 'utf8')
    if (current !== body) throw new Error(`first-pass artifact drifted: ${path}`)
    return
  }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, body)
}
