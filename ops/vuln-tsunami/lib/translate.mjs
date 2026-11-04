import { logEvent } from './logger.mjs'

const cache = new Map()
let queue = Promise.resolve()
let translated = 0
let total = 0
let enabled = true

export function setTranslateEnabled(v) {
  enabled = Boolean(v)
}

export function getTranslateStats() {
  return { translated, total, enabled, cached: cache.size }
}

async function callMyMemory(text) {
  const q = encodeURIComponent(text.slice(0, 450))
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|zh-TW`
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'DSE-Level-Up-Vuln-Tsunami/2.0' },
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
 * Translate English description → zh-TW. 500ms delay between calls.
 * Returns { zh, en, failed }
 */
export function translateToZh(cveId, english, delayMs = 500) {
  if (!enabled) {
    return Promise.resolve({ zh: null, en: english, failed: false, skipped: true })
  }
  if (cache.has(cveId)) {
    return Promise.resolve(cache.get(cveId))
  }
  total += 1
  return enqueue(async () => {
    await new Promise((r) => setTimeout(r, delayMs))
    try {
      const zh = await callMyMemory(english)
      const row = { zh, en: english, failed: false }
      cache.set(cveId, row)
      translated += 1
      logEvent('TRANSLATE', `OK ${cveId}`)
      logEvent('TRANSLATE', `ZH: ${cveId} -> ${zh.slice(0, 120)}`)
      return row
    } catch (err) {
      const row = { zh: null, en: english, failed: true, error: err.message }
      cache.set(cveId, row)
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
    })
  }
  return out
}
