#!/usr/bin/env node
// ============================================================================
// Vulnerability Tsunami Defence — full dashboard
// 127.0.0.1:3005 UI  ·  127.0.0.1:8765/status WAF·EDR stub
// Isolated from official site (:3001).
// ============================================================================

import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { loadEnv, ROOT } from './lib/env.mjs'
import { loadAppConfig } from './lib/config.mjs'
import {
  startEngine,
  getState,
  refreshOnce,
  apiBlock,
  apiToggleTranslate,
  apiEdr,
  apiPatch,
} from './lib/engine.mjs'
import { logEvent, readLogTail } from './lib/logger.mjs'
import { mockWafEdrStatus } from './lib/mock.mjs'

loadEnv()
const cfg = loadAppConfig()
const HOST = '127.0.0.1'
const PORT = cfg.dashboardPort || 3005
const PUBLIC = join(ROOT, 'public')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
}

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  let payload = body
  if (Buffer.isBuffer(body)) payload = body
  else if (typeof body !== 'string') payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Vuln-Tsunami': 'isolated-localhost',
    'X-Content-Type-Options': 'nosniff',
  })
  res.end(payload)
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > 64_000) {
        reject(new Error('body too large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      if (!chunks.length) return resolve({})
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function serveStatic(urlPath, res) {
  const rel = urlPath === '/' ? '/index.html' : urlPath
  if (rel.includes('..')) return send(res, 400, 'bad path')
  const file = join(PUBLIC, rel)
  if (!file.startsWith(PUBLIC) || !existsSync(file)) return false
  send(res, 200, readFileSync(file), MIME[extname(file)] || 'application/octet-stream')
  return true
}

function isLocalHost(host) {
  if (!host) return true
  return /^127\.0\.0\.1(?::\d+)?$/i.test(host) || /^localhost(?::\d+)?$/i.test(host)
}

const dashboard = createServer(async (req, res) => {
  if (!isLocalHost(req.headers.host || '')) return send(res, 403, 'localhost only')
  const url = new URL(req.url || '/', `http://${HOST}:${PORT}`)
  const path = url.pathname

  try {
    if (req.method === 'GET' && path === '/api/state') {
      return send(res, 200, getState(), 'application/json; charset=utf-8')
    }
    if (req.method === 'POST' && path === '/api/refresh') {
      const st = await refreshOnce({ forceTranslate: true })
      return send(res, 200, st, 'application/json; charset=utf-8')
    }
    if (req.method === 'POST' && path === '/api/block') {
      const body = await readJson(req)
      if (!body.cveId) return send(res, 400, { error: 'cveId required' }, 'application/json; charset=utf-8')
      const result = apiBlock(String(body.cveId), body.ip || null)
      return send(res, 200, { ...result, state: getState() }, 'application/json; charset=utf-8')
    }
    if (req.method === 'POST' && path === '/api/translate-toggle') {
      const body = await readJson(req)
      const stats = apiToggleTranslate(body.enabled !== false)
      return send(res, 200, { translate: stats, state: getState() }, 'application/json; charset=utf-8')
    }
    if (req.method === 'POST' && path === '/api/edr-isolate') {
      return send(res, 200, apiEdr((await readJson(req)).hostId), 'application/json; charset=utf-8')
    }
    if (req.method === 'POST' && path === '/api/patch-schedule') {
      return send(res, 200, apiPatch((await readJson(req)).package), 'application/json; charset=utf-8')
    }
    if (req.method === 'GET' && path === '/api/logs') {
      return send(res, 200, { logs: readLogTail(100) }, 'application/json; charset=utf-8')
    }
    // legacy
    if (req.method === 'GET' && path === '/api/status') {
      return send(res, 200, getState(), 'application/json; charset=utf-8')
    }

    if (serveStatic(path, res)) return
    return send(res, 404, 'not found')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logEvent('SYSTEM', `http error: ${msg}`)
    return send(res, 500, { error: msg }, 'application/json; charset=utf-8')
  }
})

// WAF / EDR status stub — desktop agent or this process
const wafPort = 8765
const wafServer = createServer((req, res) => {
  if (!isLocalHost(req.headers.host || '')) return send(res, 403, 'localhost only')
  const url = new URL(req.url || '/', `http://${HOST}:${wafPort}`)
  if (req.method === 'GET' && url.pathname === '/status') {
    const live = getState().wafEdr || mockWafEdrStatus()
    return send(
      res,
      200,
      {
        ok: true,
        source: 'vuln-tsunami-stub',
        simulated: true,
        waf: live.waf || { status: 'online', blocked_today: 0, label: '[模擬] WAF' },
        edr: live.edr || { status: 'standby', isolated_hosts: 0, label: '[模擬] EDR' },
        updatedAt: new Date().toISOString(),
      },
      'application/json; charset=utf-8',
    )
  }
  return send(res, 404, 'not found')
})

startEngine()

dashboard.listen(PORT, HOST, () => {
  console.log(`Vulnerability Tsunami Defence`)
  console.log(`Dashboard: http://127.0.0.1:${PORT}`)
  console.log(`WAF/EDR stub: http://127.0.0.1:${wafPort}/status`)
  console.log(`Isolated from official site (:3001). Ctrl+C to stop.`)
})

wafServer.listen(wafPort, HOST, () => {
  logEvent('SYSTEM', `WAF/EDR stub listening :${wafPort}`)
})
