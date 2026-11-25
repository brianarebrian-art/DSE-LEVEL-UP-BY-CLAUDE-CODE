/**
 * Defect scan on pilot subjects — separates broken items from "truly hard".
 * No external LLM. Writes docs/gap-defect-scan-results.json
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { adversarialCheck, paramCheck, bigramJaccard } from './param-check.mts'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const SUBJECTS = ['math', 'physics', 'chemistry', 'biology', 'bafs', 'economics'] as const

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

type Finding = {
  id: string
  subject: string
  severity: 'P0' | 'P1' | 'P2'
  codes: string[]
  enter_raise_queue: boolean
}

const findings: Finding[] = []
const summary = {
  scanned: 0,
  clean: 0,
  defect: 0,
  byCode: {} as Record<string, number>,
  bySubject: {} as Record<string, { scanned: number; defect: number }>,
}

for (const subject of SUBJECTS) {
  const all = await loadSubjectQuestions(subject)
  const mc = all.filter((q) => q.type === 'mc')
  summary.bySubject[subject] = { scanned: 0, defect: 0 }
  // Cap per subject for runtime; prefer pilot ledger ids when present
  let pool = mc
  try {
    const pilot = JSON.parse(
      readFileSync('data/questions/lifecycle/pilot-500-ledger.json', 'utf8'),
    ) as { ledger: Array<{ id: string; subject: string }> }
    const ids = new Set(
      pilot.ledger.filter((r) => r.subject === subject).map((r) => r.id),
    )
    const preferred = mc.filter((q) => ids.has(String(q.id)))
    if (preferred.length) pool = preferred
  } catch {
    /* use full mc sample */
  }
  const sample = pool.slice(0, Math.min(120, pool.length))

  for (const q of sample) {
    summary.scanned++
    summary.bySubject[subject].scanned++
    const codes: string[] = []
    const p = paramCheck(q)
    const a = adversarialCheck(q)
    codes.push(...p.errors, ...a.errors)
    for (const w of [...p.warnings, ...a.warnings]) {
      if (w === 'all_of_the_above_pattern' || w === 'emotional_safety_violation') {
        codes.push(w)
      }
    }
    // Near-duplicate options
    const opts = (q.options as string[]) || []
    for (let i = 0; i < opts.length; i++) {
      for (let j = i + 1; j < opts.length; j++) {
        if (bigramJaccard(opts[i], opts[j]) >= 0.85) codes.push('near_duplicate_options')
      }
    }
    // Empty / tiny explanation
    if (!q.explanation || String(q.explanation).trim().length < 12) {
      codes.push('thin_explanation')
    }

    const uniq = [...new Set(codes)]
    for (const c of uniq) summary.byCode[c] = (summary.byCode[c] || 0) + 1

    if (uniq.length) {
      summary.defect++
      summary.bySubject[subject].defect++
      const severity: Finding['severity'] = uniq.some((c) =>
        /bad_correctIndex|duplicate_options|emotional_safety|near_duplicate/.test(c),
      )
        ? 'P0'
        : uniq.some((c) => /all_of_the_above|thin_explanation|option_length/.test(c))
          ? 'P1'
          : 'P2'
      findings.push({
        id: String(q.id),
        subject,
        severity,
        codes: uniq,
        enter_raise_queue: false,
      })
    } else {
      summary.clean++
      findings.push({
        id: String(q.id),
        subject,
        severity: 'P2',
        codes: [],
        enter_raise_queue: true,
      })
    }
  }
}

const raiseQueue = findings.filter((f) => f.enter_raise_queue).map((f) => f.id)
const blocked = findings.filter((f) => !f.enter_raise_queue)

const out = {
  generatedAt: new Date().toISOString(),
  note: 'Defects blocked from difficulty-raise queue. Clean items may enter CURSOR_REWRITE.',
  summary: {
    ...summary,
    raiseQueueSize: raiseQueue.length,
    blockedSize: blocked.length,
  },
  blocked: blocked.slice(0, 200),
  raiseQueueSample: raiseQueue.slice(0, 100),
  raiseQueue,
}

writeFileSync('docs/gap-defect-scan-results.json', JSON.stringify(out, null, 2))
console.log(JSON.stringify(out.summary, null, 2))
