import { writeFileSync, readFileSync } from 'node:fs'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

const pilot = JSON.parse(
  readFileSync('data/questions/lifecycle/pilot-500-ledger.json', 'utf8'),
) as { ledger: Array<{ id: string; subject: string }> }

const ids = new Set(
  pilot.ledger.filter((r) => r.subject === 'math').map((r) => r.id),
)
const all = await loadSubjectQuestions('math')
const picked = all
  .filter((q) => ids.has(String(q.id)) && q.type === 'mc')
  .slice(0, 50)

writeFileSync(
  'scripts/qbank/drafts/math-cursor-batch1-source.json',
  JSON.stringify(picked, null, 2),
)
console.log(JSON.stringify({ n: picked.length, ids: picked.map((q) => q.id) }))
