// Result score bar: true length must not depend on the fill-bar animation alone.
// Bugbot (e92ab4ee): w-full + inline animation meant a missed animation (and
// motion-reduce:animate-none failing to beat inline style) read as 100%.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')

test('score bar sets static scaleX from barWidth; animation is class-based', () => {
  const page = read('app/result/ResultPageClient.tsx')
  const i = page.indexOf('答對比例條')
  assert.ok(i > 0, 'score bar block missing')
  const block = page.slice(i, page.indexOf('DiscoveryStrip', i))
  assert.match(block, /className="fill-bar /)
  assert.match(block, /transform:\s*`scaleX\(\$\{barWidth \/ 100\}\)`/)
  assert.doesNotMatch(block, /animation:\s*['"]fill-bar/)
  assert.doesNotMatch(block, /motion-reduce:animate-none/)
})

test('globals .fill-bar respects prefers-reduced-motion', () => {
  const css = read('app/globals.css')
  const i = css.indexOf('.fill-bar {')
  assert.ok(i > 0, '.fill-bar class missing')
  // Scope to the rule + the media block that immediately follows (not earlier reduce blocks).
  const slice = css.slice(i, i + 280)
  // 唔用 /s（dotAll）：tsconfig target 係 ES2017，Vercel typecheck 會報 TS1501。
  assert.match(slice, /\.fill-bar\s*\{[\s\S]*?animation:\s*fill-bar/)
  assert.match(slice, /prefers-reduced-motion:\s*reduce/)
  assert.match(slice, /\.fill-bar\s*\{[\s\S]*?animation:\s*none/)
})
