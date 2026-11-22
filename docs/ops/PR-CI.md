# Pull request CI: diagnosis and verification

## Failure baseline (2026-11-22)

`main` at `88a62e7` and dependency PR #203 failed in `CI / lint-and-test / npm test`:
1,539 passed, 8 failed. PR #244 had four of those failures before it was merged.

- Four claim-parity failures: `public/llms.txt` still described the pool before the
  nine extra maths MC questions added by #234. The summary and real pool agreed;
  the public copy did not. Generate the public scope and summary together.
- One count-source failure: the new calm demo typed an unsupported question total
  and a separate subject count. Read the generated summary and active subjects.
- Three homepage failures: tests sliced source using a removed `HERO` comment and
  asserted an obsolete heading. Parse the semantic hero section instead; keep the
  real quick-start, link ordering, visibility and guest-path checks. Negative
  tests ensure removing the hero or quick-start cannot pass with an empty slice.

Running every QA gate independently also exposed term/register violations,
missing translations, a contrast warning, an unlinked demo, stale token docs and
unclassified routes. Do not stop diagnosis at the first failing gate.

The first repaired remote run then reached the previously blocked production
HTML smoke: 888 of 1,344 responses had issues. The 296 new topic-note routes
emitted generic `Article` data although the notes contract requires `TechArticle`
(three user agents per route). An actual page-output regression test reproduces
this mismatch and checks every generated topic's schema, headline and canonical
URL after the fix. The smoke summary now prints issue counts and representative
paths as well as retaining the full artifact; it still exits nonzero on failure.
The next run exposed the other shared topic-page defect: descriptions only used
`slice(0, 160)`, so all 296 were shorter than the required 150 code points. Topic
metadata now reuses the existing whole-sentence description builder (no padding,
truncation or weakened length limit), and the page-output test checks the actual
metadata for every generated topic as well.

ESLint and typecheck passed on this baseline. The dependency PR's red status was
not proof of an ESLint 10 regression. A separate Supabase Preview failure needs
its own provider diagnostic; it is not explained by the Actions logs.

## Workflow patch handoff

The Agent publisher cannot modify `.github/workflows/*`. The root-cause fixes,
locked tools and helper scripts in this PR are published normally, but the two
workflow files remain unchanged until a maintainer applies the companion
`dse-pr-ci-workflows.patch` supplied with this PR. The proposed workflow layout
below is **not active until that patch is committed**.

On this PR's branch, after downloading the patch:

```bash
git apply --check /path/to/dse-pr-ci-workflows.patch
git apply /path/to/dse-pr-ci-workflows.patch
git add .github/workflows/ci.yml .github/workflows/vercel-config-check.yml
git commit -m "ci: isolate checks and retain failure evidence"
git push
```

No installation-permission change is required or expected to remove the Agent
publisher restriction. Do not merge until the patched workflows themselves have
run successfully. Existing workflows still exercise the source fixes, but will
retain the original serial structure and duplicate build until then.

## Checks and evidence (after applying the workflow patch)

Both workflows run on main pushes and PR opened/synchronize/reopened events.
Success on a PR does not approve merging or production deployment.

| Check | Responsibility | Artifact |
| --- | --- | --- |
| `lint` | ESLint, zero warnings | `ci-lint-*` |
| `typecheck` | TypeScript 7 | `ci-typecheck-*` |
| `test` | Existing Node unit/integration tests and CI regression cases | `ci-test-*`: console log and `tests.xml` (JUnit) |
| `qa` | All 13 QA gates; every gate runs, any failure fails the job | `ci-qa-*`: per-gate logs and `qa/results.json` |
| `security` | webpack/proxy configuration, secret scan, production high+ audit | `ci-security-*` |
| `lint-and-test` | Existing check identity, requires the entire matrix to succeed | Matrix results |
| `Validate Vercel Config & Build` | Top-level config keys, one production build, real production HTML smoke | `build-seo-*`: build/server logs, HTML and `responses.json` |

Artifacts expire after seven days; test results are never cached as a substitute
for running tests. npm caches downloaded packages, not `node_modules`. The Next
cache is only `.next/cache`, keyed by OS, Node version file, lockfile, Next config
and commit. The built output used by the smoke test is from that job's build.

Each matrix job has a 10-minute limit; build/HTML smoke has 20 minutes and the
aggregate has two. Adjust these after examining observed durations. Only older
runs of the same PR/workflow are cancelled. Main pushes are not cancelled by this
setting. Matrix failures do not cancel other checks.

The Vercel property guard is **not full nested JSON Schema validation**. It rejects
unknown top-level keys and `NODE_VERSION`, bounds each schema request to 10 seconds,
retries at most three times, and fails if validation could not run. Network errors
must not silently produce a successful validation result.

## Reproduce locally

Use `.nvmrc` and the committed lockfile. `tsx` is an exact devDependency; tests and
generators no longer install an untracked execution environment through `npx`.

```bash
nvm use
npm ci
npm run lint -- . --max-warnings=0
npm run typecheck
npm test
npm run test:ci
npm run qa
npm run secret:scan
npm audit --omit=dev --audit-level=high
node scripts/ci/build-config.mjs
node scripts/ci/vercel-config.mjs
npm run build
```

Run memory-heavy build and full tests sequentially on small local machines.
The checks require no production credentials, Supabase service-role key or Sentry
upload token. They do not validate live authenticated database behavior or Sentry
source-map upload. Do not add dummy secrets to hide a missing integration.

Production HTML integration (leave the server running in a separate terminal):

```bash
npm run start -- -p 3001 -H 127.0.0.1
python3 scripts/seo/verify_responses.py \
  --origin http://127.0.0.1:3001 \
  --canonical-origin https://www.dselevelup.com \
  --routes docs/seo-verification-routes.json \
  --sitemap --strict --output artifacts/seo-smoke
```

`/calm-demo` is a developer-only UI example. It must render in development, return
404 in production mode (including Vercel previews), remain noindex, and have no
student navigation entry. The Node environment tests and production HTTP smoke
cover this deliberate routing policy. Its buttons illustrate UI state, not real
practice sessions or saved time capsules.

## Prevent recurrence

- After changing a question or published pool: `npm run gen:summary`. This updates
  hashes, dates and the marked question-scope block in `public/llms.txt` together.
  Do not hand-edit generated files. Run it twice and inspect the diff for stability.
- Preserve manually maintained prose outside the generated llms block. Existing
  claim and real-bank parity tests remain required.
- After CSS token changes: `npm run tokens:doc`, then `npm run qa`.
- New routes need explicit navigation classification and a real entry/back path,
  or a documented developer-only policy enforced by code, not just a whitelist.
- Validate both language choices, including labels and structured data; use existing
  semantic text tokens rather than weakening contrast or translation rules. The
  QR/print card deliberately stays white, so its caption also uses theme-invariant
  dark ink; a dark-theme semantic muted token on that white card is not safe.
- Never use `continue-on-error`, delete failing tests, suppress the exit status of
  a pipeline, or trust a cached green test result to pass these checks.
- Do not add broad `docs/**` path exclusions: token docs and SEO route manifests
  participate in QA. Required workflows skipped by a path filter can remain Pending.
- Existing `lint-and-test` and `Validate Vercel Config & Build` names are preserved.
  Branch protection/rulesets must still be checked by a repository administrator;
  this source change does not change GitHub's required-check configuration.
- Coordinate with existing CI PR #193 and generated-token PR #218 rather than
  merging stale workflow changes or generated output over the current branch.

## Security and rollback

Production high/critical audit remains blocking. The dev-only `zod` high advisory
was addressed by updating its allowed transitive version, not a forced dependency
upgrade. Moderate development-tool advisories and the pinned tsx Node deprecation
warning need separate compatibility work; do not apply `npm audit fix --force` in
CI or disable the warning globally.

Revert the focused source or workflow commit to roll back. No database schema,
production environment variable, deployment protection or GitHub branch rule is
changed by this repair. Keep source/claim parity together when reverting content.
