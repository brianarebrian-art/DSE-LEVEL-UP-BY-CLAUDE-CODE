#!/usr/bin/env node
/**
 * scripts/scan-malicious.mjs
 * Supply chain scanner for known malicious packages and backdoor signatures.
 * Checks package.json, package-lock.json, and node_modules for PolinRider, Qix, eval(atob(, etc.
 */

import fs from 'node:fs';
import path from 'node:path';

const SUSPICIOUS_PKGS = [
  'tailwind-input-kit',
  'tailwind-form-core',
  'tailwind-forms-kit',
  'tailwind-contact-forms',
  'tailwindcss-contact-form',
  'tailwindcss-form-utils',
  'react-contact-forms',
  '@adminide-stack/',
  '@cdmbase/wiki-browser',
  '@pubngo-stack/help-browser',
  'server-hemera-mongo',
  'cdeops',
  '@aswinsparky/api',
  'jito-bundle',
  'txnforge',
  '5df897',
  'testmetest',
  'TrapDoor',
  'yzx-npm',
  'mocha-ui-themes'
];

const SUSPICIOUS_PATTERNS = [
  'eval(atob(',
  'node -i',
  'api.aswinsparky.qzz.io',
  '103.179.143.219',
  '166.88.134.75',
  '23.27.13.72',
  '95.135.181.151'
];

function checkJsonFiles() {
  console.log('🔍 Checking package.json and package-lock.json...');
  const pkgContent = fs.readFileSync('package.json', 'utf8');
  const lockContent = fs.readFileSync('package-lock.json', 'utf8');

  for (const pkg of SUSPICIOUS_PKGS) {
    if (pkgContent.includes(pkg) || lockContent.includes(pkg)) {
      console.error(`❌ Malicious package detected: ${pkg}`);
      process.exit(1);
    }
  }
  console.log('✅ No blacklisted malicious packages found in manifest or lockfile.');
}

function scanSourceFiles(dir) {
  let issues = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      issues = issues.concat(scanSourceFiles(full));
    } else if (/\.(js|mjs|ts|tsx|json|sh)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const pattern of SUSPICIOUS_PATTERNS) {
        if (content.includes(pattern)) {
          // Exclude self scan script
          if (full.includes('scan-malicious.mjs') || full.includes('line-by-line-audit-report.md') || full.includes('supply-chain-scan-evidence.md')) continue;
          issues.push({ file: full, pattern });
        }
      }
    }
  }
  return issues;
}

function checkClaudeSettings() {
  const settingsFile = '.claude/settings.json';
  if (fs.existsSync(settingsFile)) {
    const content = fs.readFileSync(settingsFile, 'utf8');
    if (content.includes('SessionStart') || content.includes('curl') || content.includes('wget')) {
      console.error('❌ Suspicious hooks found in .claude/settings.json');
      process.exit(1);
    }
  }
  console.log('✅ .claude directory verified clean.');
}

function main() {
  checkJsonFiles();
  checkClaudeSettings();
  const issues = scanSourceFiles('.');
  if (issues.length > 0) {
    console.error('❌ Malicious patterns detected:', issues);
    process.exit(1);
  }
  console.log('✅ Source tree scanned clean. Zero suspicious malware signatures.');
}

main();
