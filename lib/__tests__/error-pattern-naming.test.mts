// 「錯題 DNA」becomes 「錯誤模式」 (UX loop 25, 2026-09-30; hardening prompt §12–§13).
//
// The feature counts the causes a student picks after a wrong answer. "DNA" and
// "fingerprint" suggest the site has built a model of the learner; it has not. The page
// now also says the counts are the student's own read, not a diagnosis.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const files = (dir: string): string[] =>
  readdirSync(join(ROOT, dir)).flatMap((f) => {
    const p = join(dir, f)
    if (f === '__tests__') return []
    return statSync(join(ROOT, p)).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : []
  })
const strip = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')

test('no visible string calls it DNA or a fingerprint', () => {
  const hits: string[] = []
  for (const f of [...files('app'), ...files('components'), 'lib/dictionary.ts']) {
    strip(read(f)).split('\n').forEach((l, i) => {
      if (/錯題 ?DNA|錯因 ?DNA|Error DNA|錯題指紋|error fingerprint/i.test(l)) hits.push(`${f}:${i + 1} ${l.trim().slice(0, 80)}`)
    })
  }
  assert.deepEqual(hits, [])
})

test('the new name is used in navigation and says what it is built from', () => {
  const dict = read('lib/dictionary.ts')
  assert.match(dict, /errorDna: '錯誤模式',/)
  assert.match(dict, /errorDna: 'Error patterns',/)
  assert.match(read('components/ErrorDNA.tsx'), /唔係網站幫你診斷/)
  assert.match(read('components/ErrorRadar.tsx'), /你自己揀嘅錯因分佈/)
})
