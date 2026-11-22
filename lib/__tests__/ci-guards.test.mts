import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { validateTopLevel, loadSchema } from '../../scripts/ci/vercel-config.mjs'
import { runGates, gates } from '../../scripts/ci/qa.mjs'

const schema = { properties: { framework: {}, installCommand: {}, regions: {}, crons: {} } }

test('config property guard rejects invalid keys and malformed schema instead of passing', () => {
  validateTopLevel({ framework: 'nextjs', $schema: 'https://openapi.vercel.sh/vercel.json' }, schema)
  assert.throws(() => validateTopLevel({ NODE_VERSION: '26' }, schema), /Pin Node/)
  assert.throws(() => validateTopLevel({ typo: true }, schema), /Unsupported/)
  assert.throws(() => validateTopLevel([], schema), /must be an object/)
  assert.throws(() => validateTopLevel({}, {}), /no top-level/)
})

test('schema download retries transient errors but fails closed after three attempts', async () => {
  let calls = 0
  const request = async () => {
    calls++
    if (calls === 1) throw new Error('temporary network failure')
    return Response.json(schema)
  }
  assert.deepEqual(await loadSchema(request, async () => {}), schema)
  assert.equal(calls, 2)
  calls = 0
  await assert.rejects(loadSchema(async () => {
    calls++
    return new Response('', { status: 503 })
  }, async () => {}), /after 3 attempts/)
  assert.equal(calls, 3)
  await assert.rejects(loadSchema(async () => Response.json({}), async () => {}), /validation did not run/)
})

test('QA runs every gate and preserves nonzero exits, signals and reports', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ci-qa-test-'))
  const calls: string[][] = []
  try {
    const spawn = (_command: string, args: string[]) => {
      calls.push(args)
      return { pid: 1, output: [], status: calls.length === 1 ? 1 : null, signal: calls.length === 1 ? null : 'SIGTERM' as const, stdout: 'evidence\n', stderr: '' }
    }
    assert.equal(runGates([['first', 'one'], ['second', 'two', '--check']], dir, spawn), 1)
    assert.equal(calls.length, 2, 'first failure must not hide the next gate')
    assert.deepEqual(calls[1], ['scripts/two.mjs', '--check'])
    const results = JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8'))
    assert.equal(results[1].exitCode, 1)
    assert.equal(results[1].signal, 'SIGTERM')
    assert.equal(readFileSync(join(dir, 'first.log'), 'utf8'), 'evidence\n')
    assert.equal(runGates([['pass', 'one']], dir, () => ({ pid: 1, output: [], signal: null, status: 0, stdout: '', stderr: '' })), 0)
    assert.equal(gates.length, 13, 'retain all original QA gates')
    assert.equal(new Set(gates.map(([name]) => name)).size, 13)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('calm demo is only renderable in development, not production or test', () => {
  for (const mode of ['development', 'production', 'test'] as const) {
    const result = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
      import { registerHooks } from 'node:module';
      registerHooks({ load(url, context, nextLoad) {
        if (url.endsWith('.css')) return { format: 'commonjs', source: '', shortCircuit: true };
        return nextLoad(url, context);
      }});
      const { default: React } = await import('react');
      globalThis.React = React;
      const m = await import('./app/calm-demo/page.tsx');
      const page = m.default?.default ?? m.default;
      try {
        const element = page();
        if (process.env.NODE_ENV !== 'development' || !element) process.exit(1);
      } catch (error) {
        if (process.env.NODE_ENV === 'development' || !String(error.digest).includes('404')) throw error;
      }
    `], { env: { ...process.env, NODE_ENV: mode }, encoding: 'utf8' })
    assert.equal(result.status, 0, `${mode}: ${result.stderr}`)
  }
})
