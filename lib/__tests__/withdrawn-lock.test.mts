// A withdrawn question stays out of every path a student can reach (Yuna 2026-09-29).
//
//   default practice pool · subject counts · "just one question" · recommendations
//   · printable papers · direct links (bookmarks)
//
// Every student path reads questions through getSubjectQuestions / loadSubjectQuestions,
// which both apply withoutWithheld (data/questions/hidden-topics.ts). These tests lock
// that in for every id in withdrawn.json, not just today's batch, and fail if a new
// file starts reading the unfiltered bank.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const withdrawn = JSON.parse(read('data/questions/withdrawn.json')) as Record<string, Record<string, unknown>>

const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import('../../data/questions/index.ts'))
const L = pick(await import('../../data/questions/load.ts'))
const Sm = pick(await import('../../data/questions/summary.generated.ts'))

const entries = Object.entries(withdrawn).flatMap(([subject, byId]) => Object.keys(byId).map((id) => ({ subject, id })))

test('there is something to lock (the 2026-09-29 batch)', () => {
  assert.ok(entries.length > 0)
})

test('withdrawn questions are not in the served bank, the MC pool or the client loader', async () => {
  const subjects = [...new Set(entries.map((e) => e.subject))]
  for (const subject of subjects) {
    const served = new Set(I.getSubjectQuestions(subject).map((q) => q.id))
    const mc = new Set(I.getSubjectMCQuestions(subject).map((q) => q.id))
    // Outside a browser the loader skips the cloud and uses the bundled chunk; the
    // cloud path applies the same filter (hidden-topics.test.mts checks the source).
    const loaded = new Set((await L.loadSubjectQuestions(subject)).map((q) => q.id))
    const raw = new Set(I.getSubjectQuestionsRaw(subject).map((q) => q.id))
    for (const { id } of entries.filter((e) => e.subject === subject)) {
      assert.ok(raw.has(id), `${subject}/${id}: withdrawn means kept in the repo, not deleted`)
      assert.ok(!served.has(id), `${subject}/${id} is served`)
      assert.ok(!mc.has(id), `${subject}/${id} is in the MC pool`)
      assert.ok(!loaded.has(id), `${subject}/${id} is returned by loadSubjectQuestions`)
    }
  }
})

test('subject counts exclude withdrawn questions', () => {
  for (const subject of new Set(entries.map((e) => e.subject))) {
    assert.equal(Sm.SUBJECT_SUMMARY[subject].total, I.getSubjectQuestions(subject).length, subject)
  }
})

// Files a student can reach. Admin and dev tools may read the raw bank for audits.
function studentFiles(): string[] {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const p = join(dir, name)
      if (['__tests__', 'admin', 'dev'].includes(name)) continue
      if (statSync(join(ROOT, p)).isDirectory()) walk(p)
      else if (/\.(ts|tsx)$/.test(p)) out.push(p)
    }
  }
  for (const d of ['app', 'components', 'lib']) walk(d)
  return out
}

test('no student-facing code reads the unfiltered bank', () => {
  const bad = studentFiles().filter((f) => /getSubjectQuestionsRaw/.test(read(f).replace(/^\s*\/\/.*$/gm, '')))
  assert.deepEqual(bad, [])
})

test('practice, "just one question", recommendations and printable papers all use the filtered loader', () => {
  // size=1 and the review/recommendation links all land on /practice, whose pool comes
  // from PracticeGate; printable papers come from Paper Warrior.
  const filtered = /\bload(Subject(MC)?Questions|QuestionsByTopic|WrittenQuestions)\b/
  assert.match(read('app/practice/PracticeGate.tsx'), filtered)
  assert.match(read('app/paper-warrior/PaperWarriorClient.tsx'), filtered)
  // …and each of those helpers is built on the filtered loadSubjectQuestions.
  const load = read('data/questions/load.ts')
  assert.match(load, /loadSubjectMCQuestions[\s\S]*?return \(await loadSubjectQuestions\(subjectId\)\)/)
  assert.match(load, /loadQuestionsByTopic[\s\S]*?return \(await loadSubjectMCQuestions\(subjectId\)\)/)
  assert.match(load, /loadWrittenQuestions[\s\S]*?return \(await loadSubjectQuestions\(subjectId\)\)/)
})

test('a bookmark to a withdrawn question says so, and keeps the bookmark', () => {
  const view = read('app/bookmarks/BookmarksView.tsx')
  assert.match(view, /isWithdrawn\(bm\.subjectId, bm\.questionId\)/)
  assert.match(view, /暫時收起咗/)
})
