import { existsSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, loadEnv } from './env.mjs'
import { loadYamlFile } from './yaml.mjs'

const DEFAULT_ASSETS = [
  { id: 'next-web', name: 'Next.js', importance: 5, exposure: 5 },
  { id: 'supabase-auth', name: 'Supabase Auth', importance: 5, exposure: 4 },
  { id: 'supabase-db', name: 'Supabase DB', importance: 5, exposure: 3 },
  { id: 'vercel-edge', name: 'Vercel Edge', importance: 4, exposure: 5 },
  { id: 'node-runtime', name: 'Node.js Runtime', importance: 5, exposure: 4 },
  { id: 'sentry', name: 'Sentry', importance: 2, exposure: 2 },
  { id: 'katex', name: 'KaTeX', importance: 2, exposure: 3 },
  { id: 'sharp', name: 'sharp', importance: 2, exposure: 2 },
  { id: 'founder-mac', name: 'Founder MacBook', importance: 4, exposure: 2 },
  { id: 'google-oauth', name: 'Google OAuth', importance: 4, exposure: 4 },
  { id: 'speed-insights', name: 'Speed Insights', importance: 1, exposure: 2 },
  { id: 'practice-api', name: 'Practice API', importance: 4, exposure: 4 },
  { id: 'sync-api', name: 'Sync API', importance: 4, exposure: 3 },
  { id: 'admin', name: 'Admin Panel', importance: 3, exposure: 2 },
  { id: 'founder-os', name: 'Founder OS', importance: 3, exposure: 1 },
  { id: 'cdn-static', name: 'CDN Static', importance: 2, exposure: 5 },
]

let cached = null

export function loadAppConfig() {
  if (cached) return cached
  loadEnv()
  const yamlPath = join(ROOT, 'config.yaml')
  const example = join(ROOT, 'config.example.yaml')
  if (!existsSync(yamlPath) && existsSync(example)) {
    try {
      copyFileSync(example, yamlPath)
    } catch {
      /* ignore */
    }
  }
  const y = loadYamlFile(yamlPath) || {}
  const key = (y.nvd_api_key || process.env.NVD_API_KEY || '').trim()
  cached = {
    nvdApiKey: key,
    pollIntervalSec: Number(y.poll_interval_sec) || 60,
    resultsPerPage: Number(y.results_per_page) || 20,
    autoBlock: Boolean(y.auto_block),
    translateEnabled: y.translate_enabled !== false,
    translateDelayMs: Number(y.translate_delay_ms) || 500,
    dashboardPort: Number(y.dashboard_port) || 3005,
    wafEdrStatusUrl: y.waf_edr_status_url || 'http://127.0.0.1:8765/status',
    assets: Array.isArray(y.assets) && y.assets.length ? y.assets.slice(0, 16) : DEFAULT_ASSETS,
  }
  return cached
}

export function reloadAppConfig() {
  cached = null
  return loadAppConfig()
}
