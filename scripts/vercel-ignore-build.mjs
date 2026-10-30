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
 *
 * Path listing must cover the whole preview branch (or the whole shallow
 * clone), not just the tip commit — Vercel Ignored Build Step clones with
 * depth ~10 and usually has no origin/main, so a tip-only docs commit must
 * not hide earlier app changes on the same branch.
 */
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const env = process.env.VERCEL_ENV || ''
const ref = process.env.VERCEL_GIT_COMMIT_REF || ''

function skip(reason) {
  console.log(`[vercel-ignore-build] skip: ${reason}`)
  process.exit(0)
}

function build(reason) {
  console.log(`[vercel-ignore-build] build: ${reason}`)
  process.exit(1)
}

/** Docs / agent / governance paths that do not need a preview deploy. */
export const DOC_ONLY =
  /^(docs\/|\.cursor\/|\.github\/|content\/|scripts\/vercel-ignore-build\.mjs$|AGENTS\.md$|CLAUDE\.md$|README\.md$|LICENSE$|\.gitignore$)/

function runGit(cmd, exec = execSync) {
  return exec(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()
}

function lines(out) {
  return out ? out.split('\n').filter(Boolean) : []
}

/**
 * Files changed on this preview branch.
 *
 * Prefer `origin/main...HEAD` / `main...HEAD`. When those refs are missing
 * (typical Vercel shallow clone), fall back to the union of diffs from every
 * shallow-boundary root to HEAD — the full depth window, never tip-only.
 *
 * Tip-only fallbacks (parent-of-HEAD / single-SHA tree listing) are
 * intentionally omitted: they false-skip when a docs tip sits on top of
 * app commits.
 */
export function changedPaths(exec = execSync) {
  const attempts = [
    () => lines(runGit('git diff --name-only origin/main...HEAD', exec)),
    () => lines(runGit('git diff --name-only main...HEAD', exec)),
    () => {
      // Shallow roots = commits with no parent in this clone (depth boundary).
      const roots = lines(runGit('git rev-list --max-parents=0 HEAD', exec))
      if (roots.length === 0) return []
      const set = new Set()
      for (const root of roots) {
        for (const p of lines(runGit(`git diff --name-only ${root} HEAD`, exec))) {
          set.add(p)
        }
      }
      return [...set]
    },
  ]

  for (const attempt of attempts) {
    try {
      const paths = attempt()
      if (paths.length > 0) return paths
    } catch {
      // try next
    }
  }
  return null
}

export function shouldSkipDocsOnly(paths) {
  return Boolean(paths && paths.length > 0 && paths.every((p) => DOC_ONLY.test(p)))
}

function main() {
  if (env === 'production' || ref === 'main' || ref === 'master') {
    build(`production/main (${env || 'unknown'} / ${ref || 'unknown'})`)
  }

  if (ref.startsWith('dependabot/')) {
    skip(`dependabot branch ${ref}`)
  }

  const paths = changedPaths()
  if (shouldSkipDocsOnly(paths)) {
    skip(`docs-only paths: ${paths.join(', ')}`)
  }

  build(paths ? `app-affecting paths (${paths.length} files)` : 'could not list paths; build to be safe')
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  main()
}
