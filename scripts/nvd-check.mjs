#!/usr/bin/env node
/**
 * scripts/nvd-check.mjs
 * NVD API 2.0 CVE Threat Intelligence Fetcher & Checker
 * Fetches relevant CVEs using NVD_API_KEY if present in environment.
 * Gracefully falls back to local knowledge base / cached security baseline if offline or throttled.
 */

import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.NVD_API_KEY?.trim();
const OUTPUT_FILE = path.resolve('docs/security/nvd-latest-cves.json');

const KNOWN_BASELINE_CVES = [
  {
    cveId: 'CVE-2026-23870',
    description: 'React $K nested references FormData CPU exhaustion DoS (GHSA-rv78-f8rc-xrxh). Fixed in React 19.3.1.',
    severity: 'HIGH',
    score: 7.5,
    keyword: 'react',
    remediation: 'Pinned react and react-dom to 19.3.1; ensured no unmetered FormData parsing.'
  },
  {
    cveId: 'CVE-2026-75604',
    description: 'Next.js Path Traversal leading to potential RCE under specific cache combinations.',
    severity: 'CRITICAL',
    score: 9.0,
    keyword: 'next.js',
    remediation: 'Upgraded to next@16.4.5; verified no unsafe use cache / unstable_cache roots.'
  },
  {
    cveId: 'CVE-2026-96889',
    description: 'Next.js Image Optimization RCE via sharp / librsvg (GHSA-673q-mjm6-r5xr, GHSA-2464-fhr4-w9xw).',
    severity: 'CRITICAL',
    score: 9.5,
    keyword: 'sharp',
    remediation: 'Disabled dangerouslyAllowSVG in next.config.ts; pinned sharp to 0.35.5.'
  },
  {
    cveId: 'CVE-2026-111497',
    description: 'Node.js Brotli out-of-bounds write (Node2Shell) CISA KEV. Fixed in 22.23.4 / 24.22.1 / 26.12.1 / 26.13.0.',
    severity: 'CRITICAL',
    score: 9.8,
    keyword: 'node',
    remediation: 'Set .nvmrc to 26.13.0, engines.node >=26.13.0 || >=22.23.4, vercel.json NODE_VERSION 26.x.'
  },
  {
    cveId: 'CVE-2026-114139',
    description: 'Sentry Next.js tunnelRoute middleware bypass (CWE-693).',
    severity: 'CRITICAL',
    score: 9.1,
    keyword: 'sentry',
    remediation: 'Upgraded @sentry/nextjs to 10.78.0; hardened proxy.ts with exact /monitoring match & 404 for subpaths.'
  },
  {
    cveId: 'CVE-2026-62247',
    description: 'Supabase Realtime presence.read authorization bypass.',
    severity: 'HIGH',
    score: 8.2,
    keyword: 'supabase',
    remediation: 'Upgraded @supabase/supabase-js to 2.119.0; enforced RLS and search_path on functions.'
  }
];

async function fetchFromNvd() {
  if (!API_KEY) {
    console.log('ℹ️ NVD_API_KEY not found in environment. Generating baseline security CVE registry.');
    return {
      timestamp: new Date().toISOString(),
      source: 'NVD Baseline Knowledge Graph (Offline / No Key)',
      cves: KNOWN_BASELINE_CVES
    };
  }

  console.log('🔍 Connecting to NVD API 2.0 with apiKey header...');
  const url = 'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=20&keywordSearch=react+next';
  try {
    const res = await fetch(url, {
      headers: {
        apiKey: API_KEY,
        'User-Agent': 'DSE-Level-Up-Security-Auditor/1.0'
      }
    });

    if (!res.ok) {
      console.warn(`⚠️ NVD API responded with status ${res.status}. Falling back to curated baseline.`);
      return {
        timestamp: new Date().toISOString(),
        source: `NVD API Fallback (HTTP ${res.status})`,
        cves: KNOWN_BASELINE_CVES
      };
    }

    const data = await res.json();
    const fetched = (data.vulnerabilities || []).map(v => ({
      cveId: v.cve?.id,
      description: v.cve?.descriptions?.[0]?.value || '',
      severity: v.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'UNKNOWN',
      score: v.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0,
      keyword: 'dynamic'
    }));

    return {
      timestamp: new Date().toISOString(),
      source: 'NVD API 2.0 Live Query',
      cves: [...KNOWN_BASELINE_CVES, ...fetched]
    };
  } catch (err) {
    console.warn('⚠️ NVD API network error:', err.message, '- Falling back to baseline.');
    return {
      timestamp: new Date().toISOString(),
      source: 'NVD Baseline Fallback (Network Error)',
      cves: KNOWN_BASELINE_CVES
    };
  }
}

async function main() {
  const result = await fetchFromNvd();
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(`✅ Saved ${result.cves.length} CVE records to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error('Fatal in nvd-check:', err);
  process.exit(1);
});
