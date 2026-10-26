import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

test('server Supabase client uses dedicated environment credentials and validates project ref before client creation', () => {
  const src = readFileSync('utils/supabase/server.ts', 'utf8')
  assert.match(src, /DSE_PREVIEW_SUPABASE_URL/)
  assert.match(src, /DSE_PREVIEW_SUPABASE_SERVICE_ROLE_KEY/)
  assert.match(src, /DSE_DEVELOPMENT_SUPABASE_URL/)
  assert.match(src, /DSE_DEVELOPMENT_SUPABASE_SERVICE_ROLE_KEY/)
  assert.match(src, /isAllowedSupabaseApiTarget\(selected\.url, selected\.target, selected\.projectRef\)/)
  assert.ok(src.indexOf('isAllowedSupabaseApiTarget') < src.indexOf('createClient('))
  assert.doesNotMatch(src, /target === 'preview'[\s\S]{0,180}NEXT_PUBLIC_SUPABASE_URL/)
})

test('production telemetry code path cannot emit events from Preview deployments', () => {
  for (const path of ['sentry.server.config.ts', 'sentry.edge.config.ts', 'instrumentation-client.ts']) {
    const src = readFileSync(path, 'utf8')
    assert.match(src, /enabled:\s*process\.env\.(?:VERCEL_ENV|DSE_CLIENT_TARGET_ENV) === 'production' && Boolean\(dsn\)/, path)
    assert.match(src, /tracesSampleRate:\s*0/, path)
    assert.match(src, /enableLogs:\s*false/, path)
  }
  const client = readFileSync('instrumentation-client.ts', 'utf8')
  assert.doesNotMatch(client, /Sentry\.replayIntegration\s*\(/)
  const server = readFileSync('sentry.server.config.ts', 'utf8')
  assert.match(server, /beforeSendTransaction:\s*\(\) => null/)
  const next = readFileSync('next.config.ts', 'utf8')
  assert.match(next, /sourcemaps:\s*\{\s*disable:\s*buildTarget !== 'production'/)
  assert.match(next, /tunnelRoute:\s*buildTarget === 'production' \? '\/monitoring' : undefined/)
})

test('cron cannot send pushes or mutate subscription data outside production', () => {
  const src = readFileSync('app/api/cron/exam-day-nudge/route.ts', 'utf8')
  assert.match(src, /process\.env\.VERCEL_ENV !== 'production'/)
  assert.ok(src.indexOf("process.env.VERCEL_ENV !== 'production'") < src.indexOf('getServiceSupabase()'))
  assert.ok(src.indexOf("process.env.VERCEL_ENV !== 'production'") < src.indexOf('sendEmptyPush('))
})
