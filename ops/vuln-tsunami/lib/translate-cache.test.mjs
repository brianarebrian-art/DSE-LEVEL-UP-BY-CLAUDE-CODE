// Offline test: SQLite en→zh cache hit avoids a second MyMemory call.
// Does NOT wipe the live cache — seeds one unique row then checks lookup.
import { createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { ROOT } from './env.mjs'

const dataDir = join(ROOT, 'data')
mkdirSync(dataDir, { recursive: true })
const dbPath = join(dataDir, 'translate-cache.sqlite')

const en = `CACHE-TEST unique buffer overflow ${Date.now()}`
const zh = '快取測試：唯一緩衝區溢位。'
const hash = createHash('sha256').update(en, 'utf8').digest('hex')

const seed = new DatabaseSync(dbPath)
seed.exec(`
  CREATE TABLE IF NOT EXISTS translations (
    en_hash TEXT PRIMARY KEY,
    en_text TEXT NOT NULL,
    zh_text TEXT NOT NULL,
    cve_id TEXT,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_translations_cve ON translations(cve_id);
`)
seed
  .prepare(
    `INSERT OR REPLACE INTO translations (en_hash, en_text, zh_text, cve_id, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
  )
  .run(hash, en, zh, 'CVE-TEST-CACHE-SEED', new Date().toISOString())
seed.close()

const { translateToZh, getTranslateStats } = await import('./translate.mjs')

const hit = await translateToZh('CVE-TEST-CACHE-HIT', en, 0)
if (!hit.zh) throw new Error('expected zh from cache')
if (hit.zh !== zh) throw new Error(`zh mismatch: ${hit.zh}`)
if (hit.from !== 'sqlite' && hit.from !== 'memory') {
  throw new Error(`expected sqlite/memory hit, got from=${hit.from}`)
}

const again = await translateToZh('CVE-TEST-CACHE-HIT-2', en, 0)
if (again.from !== 'memory' && again.from !== 'sqlite') {
  throw new Error(`second lookup unexpected from=${again.from}`)
}

const stats = getTranslateStats()
if ((stats.hitsDb || 0) + (stats.hitsMem || 0) < 1) {
  throw new Error('expected at least one cache hit counter bump')
}

console.log('translate-cache OK', {
  from: hit.from,
  secondFrom: again.from,
  sqliteRows: stats.sqliteRows,
  hitsDb: stats.hitsDb,
  hitsMem: stats.hitsMem,
})
console.log('Next: restart server.mjs — cold start should CACHE HIT from sqlite (no MyMemory)')
