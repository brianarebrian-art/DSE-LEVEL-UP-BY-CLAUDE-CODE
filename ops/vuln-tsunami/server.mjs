#!/usr/bin/env node
// ============================================================================
// Vulnerability Tsunami Defence — localhost dashboard
// Bind: 127.0.0.1:3005 only (never the official site on :3001)
// Usage: node server.mjs
// ============================================================================

import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { loadEnv, ROOT } from './lib/env.mjs'
import { readDashboardSnapshot, runScan } from './lib/scan.mjs'

loadEnv()

const HOST = '127.0.0.1'
const PORT = Number(process.env.VULN_TSUNAMI_PORT) || 3005
const PUBLIC = join(ROOT, 'public')

let scanInFlight = null

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
}

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  let payload = body
  if (Buffer.isBuffer(body)) {
    payload = body
  } else if (typeof body !== 'string') {
    payload = JSON.stringify(body)
  }
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
  const type = MIME[extname(file)] || 'application/octet-stream'
  send(res, 200, readFileSync(file), type)
  return true
}

const server = createServer(async (req, res) => {
  const host = req.headers.host || ''
  // Reject anything that is not localhost-facing
  if (host && !/^127\.0\.0\.1(?::\d+)?$/i.test(host) && !/^localhost(?::\d+)?$/i.test(host)) {
    return send(res, 403, 'localhost only')
  }

  const url = new URL(req.url || '/', `http://${HOST}:${PORT}`)
  const path = url.pathname

  try {
    if (req.method === 'GET' && path === '/api/status') {
      return send(res, 200, readDashboardSnapshot(), 'application/json; charset=utf-8')
    }

    if (req.method === 'POST' && path === '/api/scan') {
      if (scanInFlight) {
        return send(res, 409, { error: 'scan already running' }, 'application/json; charset=utf-8')
      }
      const body = await readJson(req)
      const hours = Number(body.hours) || 24
      scanInFlight = runScan({
        hours,
        notify: Boolean(body.notify),
        kevOnly: Boolean(body.kevOnly),
        quiet: true,
      })
      try {
        const result = await scanInFlight
        return send(
          res,
          200,
          {
            ok: true,
            window: result.window,
            counts: result.counts,
            newAlerts: result.newAlerts,
            reportText: result.reportText,
            queryErrors: result.queryErrors,
          },
          'application/json; charset=utf-8',
        )
      } finally {
        scanInFlight = null
      }
    }

    if (req.method === 'GET' && (path === '/' || path.startsWith('/assets/'))) {
      if (serveStatic(path, res)) return
    }

    if (serveStatic(path, res)) return
    return send(res, 404, 'not found')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return send(res, 500, { error: msg }, 'application/json; charset=utf-8')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Vulnerability Tsunami Defence`)
  console.log(`Open: http://127.0.0.1:${PORT}`)
  console.log(`Isolated from official site (:3001). Ctrl+C to stop.`)
  console.log(`Next: open the URL and press 「立即掃描」.`)
})
