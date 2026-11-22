import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Deliberately a top-level property guard, NOT full nested JSON Schema validation.
export function validateTopLevel(config, schema) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('vercel.json must be an object')
  if ('NODE_VERSION' in config) throw new Error('Pin Node in .nvmrc / package.json, not NODE_VERSION in vercel.json')
  if (!schema?.properties || Object.keys(schema.properties).length === 0) throw new Error('Schema has no top-level properties')
  const allowed = new Set([...Object.keys(schema.properties), '$schema'])
  const invalid = Object.keys(config).filter((key) => !allowed.has(key))
  if (invalid.length) throw new Error(`Unsupported vercel.json properties: ${invalid.join(', ')}`)
}

export async function loadSchema(request = fetch, wait = (ms) => new Promise((r) => setTimeout(r, ms))) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await request('https://openapi.vercel.sh/vercel.json', { signal: AbortSignal.timeout(10_000) })
      if (!response.ok) throw new Error(`Schema HTTP ${response.status}`)
      const schema = await response.json()
      if (!schema?.properties || Object.keys(schema.properties).length === 0) throw new Error('Schema has no top-level properties')
      return schema
    } catch (error) {
      lastError = error
      if (attempt < 3) await wait(attempt * 1000)
    }
  }
  throw new Error('Cannot fetch Vercel schema after 3 attempts; validation did not run', { cause: lastError })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
  // Reject local errors even before fetching the schema.
  if (config && typeof config === 'object' && 'NODE_VERSION' in config) throw new Error('Remove NODE_VERSION from vercel.json')
  validateTopLevel(config, await loadSchema())
  console.log('Vercel top-level properties passed (nested values are not schema-validated).')
}
