import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const gates = [
  ['term-guard', 'qbank/term-guard'],
  ['check-posref', 'qbank/check-posref', '--banks'],
  ['validate-banks', 'qbank/validate-banks'],
  ...['i18n', 'contrast', 'emoji', 'claims', 'integration', 'responsive', 'barrel', 'copy'].map((name) => [name, `${name}-guard`]),
  ['token-doc', 'gen-token-doc', '--check'],
  ['navigation', 'guard-nav'],
]

// All gates run; a failed gate still fails the command. No continue-on-error.
/**
 * @param {string[][]} checks
 * @param {string} output
 * @param {(command: string, args: string[], options: import('node:child_process').SpawnSyncOptionsWithStringEncoding) => {status: number | null, signal?: string | null, stdout?: string, stderr?: string, error?: Error}} spawn
 * @param {boolean} annotate
 */
export function runGates(checks = gates, output = 'artifacts/qa', spawn = spawnSync, annotate = false) {
  mkdirSync(output, { recursive: true })
  const results = []
  for (const [name, script, ...args] of checks) {
    console.log(annotate ? `::group::QA / ${name}` : `QA / ${name}`)
    const result = spawn(process.execPath, [`scripts/${script}.mjs`, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
    const log = `${result.stdout ?? ''}${result.stderr ?? ''}${result.error ? `${result.error}\n` : ''}`
    process.stdout.write(log)
    const code = result.status ?? 1
    results.push({ name, exitCode: code, signal: result.signal ?? null })
    writeFileSync(`${output}/${name}.log`, log)
    if (code !== 0 && annotate) console.log(`::error title=QA ${name}::Gate failed (exit ${code}). See ${name}.log`)
    if (annotate) console.log('::endgroup::')
  }
  writeFileSync(`${output}/results.json`, `${JSON.stringify(results, null, 2)}\n`)
  console.table(results)
  return results.some((result) => result.exitCode !== 0) ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = runGates(gates, 'artifacts/qa', spawnSync, process.env.GITHUB_ACTIONS === 'true')
}
