#!/usr/bin/env node
// scripts/qbank/pick-errors.mjs
// Force-multiplier: filter common-errors.json by subject + units, stdout JSON.
// Zero dependencies. Honesty-first: never hides ai_proposed status.

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, './common-errors.json');

const HELP = `Usage:
  node pick-errors.mjs <subject> [unit1] [unit2] ...

Examples:
  node pick-errors.mjs economics taxation supply_demand
  node pick-errors.mjs bafs partnership
  node pick-errors.mjs economics               # all econ errors

Exit codes:
  0  Success (JSON array written to stdout)
  1  No matching errors
  2  Bad arguments / help shown
  3  Cannot read common-errors.json
`;

function bail(code, msg) {
  if (msg) console.error(msg);
  process.exit(code);
}

// --- argument parsing --------------------------------------------------------
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP);
  bail(2);
}

const [, , subject, ...units] = process.argv;

if (!subject) {
  console.log(HELP);
  bail(2, 'Error: <subject> is required.');
}

// --- load db -----------------------------------------------------------------
let db;
try {
  db = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
} catch (e) {
  bail(3, `Error: cannot read ${DB_PATH}\n${e.message}`);
}

if (!Array.isArray(db?.errors)) {
  bail(3, 'Error: common-errors.json missing "errors" array.');
}

// --- filter ------------------------------------------------------------------
const out = db.errors.filter(e => {
  if (e.status === 'rejected') return false;
  if (e.subject !== subject) return false;
  if (units.length === 0) return true;
  return units.some(u => e.units?.includes(u));
});

// --- output ------------------------------------------------------------------
if (out.length === 0) {
  bail(1, `No errors matched: subject="${subject}" units=[${units.join(', ')}]`);
}

console.log(JSON.stringify(out, null, 2));
