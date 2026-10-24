import { NextResponse } from 'next/server'
import { DB_TIMEOUT_MS, buildHealthBody, healthHttpStatus, probeDatabase } from '@/lib/health'
import { safeLog } from '@/lib/safeLog'
import { getServiceSupabase } from '@/utils/supabase/server'

// GET /api/health —— 公開探測（Uptime Kuma、負載平衡器）。唔使登入。
//
// 200：status 係 ok 或 degraded。degraded 代表資料庫有回應，但慢過 lib/health.ts 嘅 DB_SLOW_MS。
// 503：status 係 error。資料庫查詢失敗、超時，或者未設定
//      NEXT_PUBLIC_SUPABASE_URL／SUPABASE_SERVICE_ROLE_KEY。
//
// 查詢用現成嘅 service-role client，打 question_bank_versions 嘅 HEAD + limit 1。
// 呢張表係開練習前嗰下版本 ping，細而且只攞主鍵欄，唔回傳任何行。
// 錯誤原文只入 safeLog，唔好放進 JSON（Postgres 訊息會帶表名）。
// proxy.ts 唔將呢條路徑計入 /api 限流，避免 429 被監控誤判為故障。

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function GET() {
  const database = await probeDatabase(supabaseConfigured(), {
    async query() {
      try {
        const { error } = await getServiceSupabase()
          .from('question_bank_versions')
          .select('subject', { head: true })
          .limit(1)
          .abortSignal(AbortSignal.timeout(DB_TIMEOUT_MS))
        if (error) safeLog('error', 'api/health database', error)
        return { error }
      } catch (err) {
        safeLog('error', 'api/health database', err)
        throw err
      }
    },
  })
  if (database.reason === 'not_configured') {
    // 唔傳 Error：dev 嘅 log overlay 會把 stack 畫成路由拋咗錯，但其實係預期嘅缺設定。
    safeLog('warn', 'api/health database', { message: 'not_configured' })
  }

  const body = buildHealthBody(database)
  return NextResponse.json(body, {
    status: healthHttpStatus(body.status),
    headers: { 'Cache-Control': 'no-store' },
  })
}
