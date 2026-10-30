// Vercel Ignored Build Step — branch-wide path listing (Bugbot c638a1e).
//
// Vercel clones with depth ~10 and usually has no origin/main. Falling back to
// HEAD^ / diff-tree only sees the tip commit, so a docs-only tip incorrectly
// skips a preview that earlier commits on the same branch still need.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = join(ROOT, 'scripts/vercel-ignore-build.mjs')

const { DOC_ONLY, changedPaths, shouldSkipDocsOnly } = await import(
  pathToFileURL(SRC).href
)

test('DOC_ONLY matches governance paths and rejects app code', () => {
  assert.ok(DOC_ONLY.test('docs/tokens.md'))
  assert.ok(DOC_ONLY.test('.cursor/skills/apple-design/SKILL.md'))
  assert.ok(DOC_ONLY.test('scripts/vercel-ignore-build.mjs'))
  assert.ok(!DOC_ONLY.test('app/page.tsx'))
  assert.ok(!DOC_ONLY.test('components/Navbar.tsx'))
  assert.ok(!DOC_ONLY.test('scripts/emoji-guard.mjs'))
})

test('shouldSkipDocsOnly only when every path is docs-only', () => {
  assert.equal(shouldSkipDocsOnly(['docs/a.md', 'README.md']), true)
  assert.equal(shouldSkipDocsOnly(['docs/a.md', 'app/page.tsx']), false)
  assert.equal(shouldSkipDocsOnly(null), false)
  assert.equal(shouldSkipDocsOnly([]), false)
})

test('changedPaths prefers origin/main...HEAD over tip-only commands', () => {
  const calls = []
  const exec = (cmd) => {
    calls.push(cmd)
    if (cmd.includes('origin/main...HEAD')) {
      return 'app/page.tsx\ndocs/note.md\n'
    }
    throw new Error(`unexpected: ${cmd}`)
  }
  assert.deepEqual(changedPaths(exec), ['app/page.tsx', 'docs/note.md'])
  assert.ok(calls[0].includes('origin/main...HEAD'))
  assert.ok(!calls.some((c) => c.includes('HEAD^') || c.includes('diff-tree')))
})

test('without main refs, changedPaths unions shallow-root diffs (not tip only)', () => {
  const exec = (cmd) => {
    if (cmd.includes('origin/main') || cmd === 'git diff --name-only main...HEAD') {
      throw new Error('missing main')
    }
    if (cmd === 'git rev-list --max-parents=0 HEAD') {
      return 'rootA\nrootB\n'
    }
    if (cmd === 'git diff --name-only rootA HEAD') {
      // Earlier commit on the branch touched app code
      return 'app/practice/PracticeSession.tsx\n'
    }
    if (cmd === 'git diff --name-only rootB HEAD') {
      // Tip is docs-only relative to another shallow root
      return 'docs/tokens.md\n'
    }
    throw new Error(`unexpected: ${cmd}`)
  }
  const paths = changedPaths(exec)
  assert.deepEqual(new Set(paths), new Set(['app/practice/PracticeSession.tsx', 'docs/tokens.md']))
  assert.equal(shouldSkipDocsOnly(paths), false)
})

test('docs-only tip on top of app history must not skip (regression for Bugbot)', () => {
  // Simulate the buggy tip-only world: HEAD^ would return only docs.
  // Our shallow-root union still sees the earlier app path.
  const exec = (cmd) => {
    if (cmd.includes('origin/main') || cmd.includes('main...HEAD')) throw new Error('no main')
    if (cmd === 'git rev-list --max-parents=0 HEAD') return 'shallowRoot\n'
    if (cmd === 'git diff --name-only shallowRoot HEAD') {
      return 'app/layout.tsx\ndocs/charter.md\n'
    }
    throw new Error(cmd)
  }
  const paths = changedPaths(exec)
  assert.ok(paths.includes('app/layout.tsx'))
  assert.equal(shouldSkipDocsOnly(paths), false)
})

test('source never falls back to tip-only git commands', () => {
  // Strip comments so prose mentioning the anti-pattern cannot false-fail.
  const src = readFileSync(SRC, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
  assert.doesNotMatch(src, /HEAD\^/)
  assert.doesNotMatch(src, /diff-tree/)
  assert.match(src, /rev-list --max-parents=0 HEAD/)
  assert.match(src, /origin\/main\.\.\.HEAD/)
})
