/**
 * Mark all non-pilot bank ids as LEGACY_UNCALIBRATED in a ledger file.
 * Does not mutate student-visible question TS files.
 */
import { writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { subjects } = await mod<{ subjects: Array<{ id: string }> }>(
  '../../../data/subjects.ts',
)
const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<{ id: string }>>
}>('../../../data/questions/load.ts')

const pilot = JSON.parse(
  readFileSync('data/questions/lifecycle/pilot-500-ledger.json', 'utf8'),
) as { ledger: Array<{ id: string }> }
const pilotIds = new Set(pilot.ledger.map((r) => r.id))

const legacy: Array<{ id: string; subject: string; review_status: string; reason: string }> =
  []

for (const s of subjects) {
  const qs = await loadSubjectQuestions(s.id)
  for (const q of qs) {
    if (pilotIds.has(q.id)) continue
    legacy.push({
      id: q.id,
      subject: s.id,
      review_status: 'LEGACY_UNCALIBRATED',
      reason: 'outside_30d_pilot_scope_1B',
    })
  }
}

const out = {
  generatedAt: new Date().toISOString(),
  pilotCount: pilotIds.size,
  legacyCount: legacy.length,
  expectedTotal: pilotIds.size + legacy.length,
  note: 'Student banks unchanged; status is ledger-only until promote + RELEASED gate',
  legacySample: legacy.slice(0, 20),
}

writeFileSync(
  'data/questions/lifecycle/legacy-uncalibrated-ids.tsv',
  'subject\tid\n' + legacy.map((r) => `${r.subject}\t${r.id}`).join('\n') + '\n',
)
writeFileSync(
  'data/questions/lifecycle/legacy-uncalibrated-ledger.json',
  JSON.stringify(
    {
      summary: out,
      reason: 'outside_30d_pilot_scope_1B',
      review_status: 'LEGACY_UNCALIBRATED',
      idsFile: 'data/questions/lifecycle/legacy-uncalibrated-ids.tsv',
    },
    null,
    2,
  ),
)
console.log(JSON.stringify(out, null, 2))
