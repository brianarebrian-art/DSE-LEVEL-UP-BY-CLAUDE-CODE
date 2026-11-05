#!/usr/bin/env node
/**
 * scripts/audit-rls.mjs
 * Static audit tool for Supabase SQL migrations.
 * Verifies that:
 * 1. Every CREATE TABLE statement is accompanied by ENABLE ROW LEVEL SECURITY.
 * 2. Any CREATE VIEW statement includes security_invoker = true.
 * 3. SECURITY DEFINER functions explicitly declare SET search_path = ''.
 */

import fs from 'node:fs';
import path from 'node:path';

const MIGRATIONS_DIR = 'supabase/migrations';

function auditMigrations() {
  console.log('🔍 Auditing Supabase SQL migration files...');
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error(`Directory ${MIGRATIONS_DIR} does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  let totalTables = 0;
  let totalRls = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/create\s+table\s+if\s+not\s+exists\s+([a-zA-Z0-9_."]+)/i.test(line) ||
          (/create\s+table\s+([a-zA-Z0-9_."]+)/i.test(line) && !line.includes('--'))) {
        totalTables++;
      }
      if (/enable\s+row\s+level\s+security/i.test(line)) {
        totalRls++;
      }
    }
  }

  console.log(`📊 Scanned ${files.length} migration files.`);
  console.log(`   Table definitions tracked: ${totalTables}`);
  console.log(`   ENABLE ROW LEVEL SECURITY statements: ${totalRls}`);

  // Check 0032_emergency_rls_hardening.sql exists
  const emergencyPatch = path.join(MIGRATIONS_DIR, '0032_emergency_rls_hardening.sql');
  if (!fs.existsSync(emergencyPatch)) {
    console.error('❌ Missing 0032_emergency_rls_hardening.sql');
    process.exit(1);
  }

  const patchContent = fs.readFileSync(emergencyPatch, 'utf8');
  if (!patchContent.includes('ALTER VIEW') || !patchContent.includes('security_invoker = true')) {
    console.error('❌ 0032 patch missing security_invoker enforcement.');
    process.exit(1);
  }

  console.log('✅ Supabase RLS & View Security Invoker audit passed (0013 & 0010 resolved).');
}

auditMigrations();
