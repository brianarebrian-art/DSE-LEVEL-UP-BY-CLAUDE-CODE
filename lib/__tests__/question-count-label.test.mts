// A total that includes written questions must not be labelled as MC.
//
// Found 2026-09-25: the homepage trust strip and /trust showed
// "27,321 條改寫 MC 題". TOTAL_QUESTIONS (and SUBJECT_SUMMARY[x].total) count
// MC plus written questions; only 26,261 were MC, so the label overstated the MC
// count by 1,060.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')
const ns: any = await import('../../data/questions/summary.generated.ts')
const { SUBJECT_SUMMARY, TOTAL_QUESTIONS } = (ns.default?.SUBJECT_SUMMARY ? ns.default : ns) as {
  SUBJECT_SUMMARY: Record<string, { total: number; mc: number; written: number }>
  TOTAL_QUESTIONS: number
}

test('TOTAL_QUESTIONS counts MC plus written questions', () => {
  const rows = Object.values(SUBJECT_SUMMARY)
  const total = rows.reduce((n, r) => n + r.total, 0)
  const mc = rows.reduce((n, r) => n + r.mc, 0)
  const written = rows.reduce((n, r) => n + r.written, 0)
  assert.equal(TOTAL_QUESTIONS, total)
  assert.equal(total, mc + written)
})

const MC_LABEL = /條改寫\s*MC\s*題|rewritten MC questions/

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`
    if (e.isDirectory()) { if (e.name !== '__tests__') walk(rel, out) }
    else if (e.name.endsWith('.tsx')) out.push(rel)
  }
  return out
}

/** Files that render the all-types total: TOTAL_QUESTIONS, or a sum of SUBJECT_SUMMARY[..].total. */
const rendersTotal = (src: string) =>
  src.includes('TOTAL_QUESTIONS') || /SUBJECT_SUMMARY\[[^\]]+\]\?\.total/.test(src)

test('no page labels the all-types total as MC', () => {
  const offenders = [...walk('app'), ...walk('components')].filter((f) => {
    const src = readFileSync(join(ROOT, f), 'utf8')
    return rendersTotal(src) && MC_LABEL.test(src)
  })
  assert.deepEqual(offenders, [], `these files show the MC + written total with an MC label: ${offenders.join(', ')}`)
})

test('negative self-test: the old wording is detected', () => {
  const old = "{TOTAL_QUESTIONS.toLocaleString()}{locale === 'en' ? ' rewritten MC questions' : ' 條改寫 MC 題'}"
  assert.ok(rendersTotal(old) && MC_LABEL.test(old))
})
