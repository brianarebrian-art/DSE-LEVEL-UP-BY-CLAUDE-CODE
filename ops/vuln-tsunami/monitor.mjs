#!/usr/bin/env node
// ============================================================================
// DSE Level Up — Vulnerability Tsunami Defence (desktop-isolated)
// CLI entry. Dashboard: node server.mjs  →  http://127.0.0.1:3005
// ============================================================================

import { loadEnv } from './lib/env.mjs'
import { loadConfig, runScan } from './lib/scan.mjs'

loadEnv()
const config = loadConfig()

function parseArgs(argv) {
  const args = {
    hours: Number(process.env.LOOKBACK_HOURS) || config.nvd.defaultLookbackHours,
    notify: process.env.NOTIFY === '1',
    kevOnly: false,
    quiet: false,
    json: false,
    resetSeen: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--hours') args.hours = Number(argv[++i])
    else if (a === '--notify') args.notify = true
    else if (a === '--kev-only') args.kevOnly = true
    else if (a === '--quiet') args.quiet = true
    else if (a === '--json') args.json = true
    else if (a === '--reset-seen') args.resetSeen = true
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node monitor.mjs [--hours N] [--notify] [--kev-only] [--json] [--reset-seen]
Dashboard: node server.mjs  →  http://127.0.0.1:3005`)
      process.exit(0)
    }
  }
  return args
}

const args = parseArgs(process.argv)

runScan(args)
  .then((result) => {
    if (args.json) {
      console.log(
        JSON.stringify(
          {
            window: result.window,
            counts: result.counts,
            newAlerts: result.newAlerts,
          },
          null,
          2,
        ),
      )
    } else {
      console.log(result.reportText)
    }
    if (result.hasNew) process.exitCode = 2
  })
  .catch((err) => {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`NVD monitor failed: ${msg}`)
    console.error('Fix: check NVD_API_KEY in ops/vuln-tsunami/.env, then re-run `node monitor.mjs`.')
    process.exit(1)
  })
