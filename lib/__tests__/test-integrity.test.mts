// Tests must fail when the thing they test is broken (refinement loop 2, 2026-09-30;
// prompt §45). Earlier one test returned early when its module failed to import, so it
// "passed" without running. No skip, no todo, no early return on a missing module.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIRS = ['lib/__tests__', 'data/questions/__tests__', 'components/__tests__']
// This file is excluded: its negative self-test necessarily contains the patterns.
const files = DIRS.flatMap((d) => readdirSync(d).filter((f) => f.endsWith('.test.mts')).map((f) => join(d, f)))
  .filter((f) => !f.endsWith('test-integrity.test.mts'))

test('no skipped or todo tests', () => {
  const bad = files.filter((f) => {
    const src = readFileSync(f, 'utf8').replace(/^\s*\/\/.*$/gm, '')
    return /\b(test|it|describe)\.(skip|todo)\s*\(|[{,]\s*(skip|todo)\s*:\s*(true|['"`])/.test(src)
  })
  assert.deepEqual(bad, [])
})

test('no test returns early because a module or fixture is missing', () => {
  const escape = /if\s*\(\s*!\s*(mod|m|module|ns|raw|lib|src|data|file|fixture)\s*\)\s*return\s*;?\s*($|\})|catch\s*(\(\w*\))?\s*\{\s*return\s*;?\s*\}/m
  const bad = files.filter((f) => escape.test(readFileSync(f, 'utf8').replace(/^\s*\/\/.*$/gm, '')))
  assert.deepEqual(bad, [])
})

test('negative self-test: the scans catch the patterns they are for', () => {
  assert.ok(/\b(test|it|describe)\.(skip|todo)\s*\(/.test("test.skip('x', () => {})"))
  assert.ok(/[{,]\s*(skip|todo)\s*:\s*(true|['"`])/.test("test('x', { skip: true }, () => {})"))
  const escape = /if\s*\(\s*!\s*(mod|m|module|ns|raw|lib|src|data|file|fixture)\s*\)\s*return\s*;?\s*($|\})|catch\s*(\(\w*\))?\s*\{\s*return\s*;?\s*\}/m
  assert.ok(escape.test('if (!mod) return'))
  assert.ok(escape.test('try { x() } catch { return }'))
  // A helper that returns a value is not an escape hatch.
  assert.ok(!escape.test('if (!m) return v.toUpperCase()'))
})

test('the suite runs every test directory', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }
  for (const d of DIRS) assert.ok(pkg.scripts.test.includes(`${d}/*.test.mts`), d)
})
