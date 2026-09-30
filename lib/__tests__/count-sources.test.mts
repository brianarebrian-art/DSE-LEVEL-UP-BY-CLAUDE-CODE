// Question and subject counts come from the bank, never from a typed number
// (UX loop 11, P1-H, 2026-09-30).
//
// Found on 2026-09-30: the social-sharing image (app/opengraph-image.tsx) said
// "5,167 questions" while the bank served 26,510, and "25 科／25 subjects" was typed
// into six metadata strings and the subject list's intro. The numbers now come from
// data/questions/summary.generated.ts and data/subjects.ts. This scan stops a new
// literal count from appearing in any page, component or copy file.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === '__tests__' || name === 'node_modules') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|mts)$/.test(name)) out.push(p)
  }
  return out
}

/** Code without comments, so that notes about old numbers are allowed. */
export function stripComments(src: string): string {
  return src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
}

// A total of questions (four or more digits) or a count of subjects, typed as text.
const LITERAL_COUNT = /\b\d{1,3},\d{3}\s?(?:questions|條|題)|\b\d{4,}\s?(?:questions|條題目)|(?<![\d$])\b2[0-9]\s?(?:科|subjects\b)/

function literalCounts(file: string): string[] {
  return stripComments(readFileSync(file, 'utf8'))
    .split('\n')
    .filter((line) => LITERAL_COUNT.test(line))
    .map((line) => `${relative(ROOT, file)}: ${line.trim().slice(0, 120)}`)
}

const FILES = [
  ...walk(join(ROOT, 'app')),
  ...walk(join(ROOT, 'components')),
  join(ROOT, 'lib/dictionary.ts'),
  join(ROOT, 'data/heroContent.ts'),
]

test('no page, component or copy file types a question total or a subject count', () => {
  const hits = FILES.flatMap(literalCounts)
  assert.deepEqual(hits, [])
})

test('the sharing image reads the live totals', () => {
  const og = readFileSync(join(ROOT, 'app/opengraph-image.tsx'), 'utf8')
  assert.match(og, /\$\{TOTAL_QUESTIONS\.toLocaleString\('en-US'\)\} questions, \$\{getActiveSubjects\(\)\.length\} subjects/)
})

test('negative self-test: the scan catches the numbers it was written for', () => {
  for (const line of [
    "Free HKDSE practice — 5,167 questions, 25 subjects",
    "description: '免費 DSE 練習平台，涵蓋 25 科獨立改寫試題。'",
    "introB: '. MC practice for all 25 subjects'",
    "<span>26510 questions</span>",
  ]) assert.ok(LITERAL_COUNT.test(stripComments(line)), line)
  // Numbers in comments are notes, not claims.
  assert.ok(!LITERAL_COUNT.test(stripComments('// used to say 5,167 questions')))
  assert.ok(!LITERAL_COUNT.test(stripComments('{/* 25 科 */}')))
})
