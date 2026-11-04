// Translation layer with SQLite en→zh cache (node:sqlite, zero npm deps)
import { createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { ROOT } from './env.mjs'
import { logEvent } from './logger.mjs'

const mem = new Map()
let queue = Promise.resolve()
let translated = 0
let total = 0
let enabled = true
let hitsMem = 0
let hitsDb = 0
let misses = 0
let db = null

function enKey(english) {
  return createHash('sha256').update(String(english || ''), 'utf8').digest('hex')
}

function openDb() {
  if (db) return db
  const dir = join(ROOT, 'data')
  mkdirSync(dir, { recursive: true })
  const path = join(dir, 'translate-cache.sqlite')
  db = new DatabaseSync(path)
  db.exec(`
    CREATE TABLE IF NOT EXISTS translations (
      en_hash TEXT PRIMARY KEY,
      en_text TEXT NOT NULL,
      zh_text TEXT NOT NULL,
      cve_id TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_translations_cve ON translations(cve_id);
  `)
  return db
}

function dbGet(english) {
  try {
    const database = openDb()
    const row = database
      .prepare('SELECT zh_text, en_text, cve_id FROM translations WHERE en_hash = ?')
      .get(enKey(english))
    if (!row) return null
    return { zh: row.zh_text, en: row.en_text, failed: false, from: 'sqlite' }
  } catch (err) {
    logEvent('TRANSLATE', `sqlite get fail: ${err.message}`)
    return null
  }
}

function dbPut(cveId, english, zh) {
  try {
    const database = openDb()
    database
      .prepare(
        `INSERT INTO translations (en_hash, en_text, zh_text, cve_id, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(en_hash) DO UPDATE SET
           zh_text = excluded.zh_text,
           cve_id = excluded.cve_id,
           updated_at = excluded.updated_at`,
      )
      .run(enKey(english), String(english).slice(0, 2000), zh, cveId || null, new Date().toISOString())
  } catch (err) {
    logEvent('TRANSLATE', `sqlite put fail: ${err.message}`)
  }
}

export function setTranslateEnabled(v) {
  enabled = Boolean(v)
}

export function getTranslateStats() {
  let sqliteRows = 0
  try {
    const row = openDb().prepare('SELECT COUNT(*) AS n FROM translations').get()
    sqliteRows = Number(row?.n) || 0
  } catch {
    sqliteRows = 0
  }
  return {
    translated,
    total,
    enabled,
    cached: mem.size,
    sqliteRows,
    hitsMem,
    hitsDb,
    misses,
  }
}

async function callMyMemory(text) {
  const q = encodeURIComponent(text.slice(0, 450))
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|zh-TW`
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'DSE-Level-Up-Vuln-Tsunami/3.1' },
  })
  if (!res.ok) throw new Error(`translate HTTP ${res.status}`)
  const data = await res.json()
  const out = data?.responseData?.translatedText
  if (!out || /MYMEMORY WARNING/i.test(out)) throw new Error('translate quota or empty')
  return out
}

function enqueue(fn) {
  queue = queue.then(fn, fn)
  return queue
}

/**
 * Translate English → zh-TW.
 * Lookup order: memory → SQLite en→zh → MyMemory (then persist).
 */
export function translateToZh(cveId, english, delayMs = 500) {
  if (!enabled) {
    return Promise.resolve({ zh: null, en: english, failed: false, skipped: true })
  }

  // Memory keyed by English hash — same EN reuses across CVE ids
  const memKey = enKey(english)
  if (mem.has(memKey)) {
    const hit = mem.get(memKey)
    // Do not treat prior failures as permanent cache
    if (!hit.failed && hit.zh) {
      hitsMem += 1
      return Promise.resolve({ ...hit, from: 'memory' })
    }
  }

  const cached = dbGet(english)
  if (cached?.zh) {
    hitsDb += 1
    mem.set(memKey, cached)
    logEvent('TRANSLATE', `CACHE HIT ${cveId}`)
    return Promise.resolve(cached)
  }

  total += 1
  misses += 1
  return enqueue(async () => {
    // re-check after queue wait (another job may have filled SQLite)
    const again = dbGet(english)
    if (again?.zh) {
      hitsDb += 1
      misses = Math.max(0, misses - 1)
      mem.set(memKey, again)
      logEvent('TRANSLATE', `CACHE HIT ${cveId}`)
      return again
    }

    await new Promise((r) => setTimeout(r, delayMs))
    try {
      const zh = await callMyMemory(english)
      const row = { zh, en: english, failed: false, from: 'mymemory' }
      mem.set(memKey, row)
      dbPut(cveId, english, zh)
      translated += 1
      logEvent('TRANSLATE', `OK ${cveId} (saved sqlite)`)
      logEvent('TRANSLATE', `ZH: ${cveId} -> ${zh.slice(0, 120)}`)
      return row
    } catch (err) {
      const row = { zh: null, en: english, failed: true, error: err.message, from: 'error' }
      // soft-fail in memory only briefly — do not block future retries forever
      translated += 1
      logEvent('TRANSLATE', `FAIL ${cveId}: ${err.message}`)
      return row
    }
  })
}

export async function translateBatch(cves, delayMs = 500) {
  const out = []
  for (const c of cves) {
    const t = await translateToZh(c.id, c.description, delayMs)
    out.push({
      ...c,
      descriptionZh: t.failed ? '[翻譯失敗]' : t.zh || c.description,
      descriptionEn: c.description,
      translateFailed: Boolean(t.failed),
      translateSkipped: Boolean(t.skipped),
      translateFrom: t.from || null,
    })
  }
  return out
}
