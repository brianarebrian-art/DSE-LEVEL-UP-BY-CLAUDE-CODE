#!/usr/bin/env node
/**
 * Vercel Ignored Build Step.
 * Exit 0 = skip this deployment. Exit 1 = build.
 *
 * Hobby Function Storage / Deployment Storage fill up when every Cursor /
 * Dependabot / docs-only PR gets a full Next.js preview. Skip those so only
 * app-affecting branches and production consume storage.
 *
 * Never skip production (VERCEL_ENV=production) or the main branch.
 */
import { execSync } from 'node:child_process'

const env = process.env.VERCEL_ENV || ''
const ref = process.env.VERCEL_GIT_COMMIT_REF || ''
const sha = process.env.VERCEL_GIT_COMMIT_SHA || ''

function skip(reason) {
  console.log(`[vercel-ignore-build] skip: ${reason}`)
  process.exit(0)
}

function build(reason) {
  console.log(`[vercel-ignore-build] build: ${reason}`)
  process.exit(1)
}

if (env === 'production' || ref === 'main' || ref === 'master') {
  build(`production/main (${env || 'unknown'} / ${ref || 'unknown'})`)
}

if (ref.startsWith('dependabot/')) {
  skip(`dependabot branch ${ref}`)
}

// Docs, agent skills, governance, and this ignore script itself do not need a preview.
const DOC_ONLY =
  /^(docs\/|\.cursor\/|\.github\/|content\/|scripts\/vercel-ignore-build\.mjs$|AGENTS\.md$|CLAUDE\.md$|README\.md$|LICENSE$|\.gitignore$)/

function changedPaths() {
  // Prefer the whole branch vs main so a docs-only tip commit cannot
  // hide earlier app changes on the same preview branch.
  const attempts = [
    'git diff --name-only origin/main...HEAD',
    'git diff --name-only main...HEAD',
    'git diff --name-only HEAD^ HEAD',
    sha ? `git diff-tree --no-commit-id --name-only -r ${sha}` : null,
  ].filter(Boolean)

  for (const cmd of attempts) {
    try {
      const out = execSync(cmd, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
      if (out) return out.split('\n').filter(Boolean)
    } catch {
      // try next
    }
  }
  return null
}

const paths = changedPaths()
if (paths && paths.length > 0 && paths.every((p) => DOC_ONLY.test(p))) {
  skip(`docs-only paths: ${paths.join(', ')}`)
}

build(paths ? `app-affecting paths (${paths.length} files)` : 'could not list paths; build to be safe')
