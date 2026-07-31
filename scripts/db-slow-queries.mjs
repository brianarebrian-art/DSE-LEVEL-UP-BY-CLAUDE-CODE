#!/usr/bin/env node
/**
 * 慢查詢報告（藍圖功能 08 的 Supabase 一半）。
 *
 * 用途：當 Vercel Analytics 顯示某頁 LCP 偏高時，用呢個腳本睇返同一時段
 * Postgres 側有冇對應嘅慢查詢，避免盲目優化前端。
 *
 * ── 點解只做一半 ──────────────────────────────────────────────────────────────
 * 藍圖原本要「Vercel Analytics × pg_stat_statements 全鏈關聯」。Supabase 嗰半
 * 零成本（`pg_stat_statements` 已安裝啟用），但 Vercel 嗰半要 `@vercel/analytics`
 * —— 本專案未安裝，屬「禁新套件」；而且佢會向瀏覽器植入分析 beacon，
 * 對一個服務 12–18 歲學生、明文禁止追蹤未成年人嘅平台嚟講，
 * 呢個係創辦人先決定得嘅事，唔應該由工程順手加。故此只交付 Supabase 一半。
 *
 * ── 用法 ──────────────────────────────────────────────────────────────────────
 *   DATABASE_URL='postgresql://...' node scripts/db-slow-queries.mjs
 *   npm run qa:slowsql
 *
 * DATABASE_URL 喺 Supabase Dashboard → Project Settings → Database → Connection
 * string（用 pooler，port 6543）。呢個 env 本身已經係 Better Auth 切換所需，
 * 唔算新增設定項。
 *
 * 零新套件：只用已安裝嘅 `pg`。
 */
import { Pool } from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error(`
✗ 未設定 DATABASE_URL。

  呢個腳本要直連 Postgres 讀 pg_stat_statements —— PostgREST（supabase-js 行嗰條路）
  唔會暴露呢張系統視圖，所以唔可以用 NEXT_PUBLIC_SUPABASE_URL 代替。

  取得方法：Supabase Dashboard → Project Settings → Database → Connection string
  （揀 pooler，port 6543），然後：

      DATABASE_URL='postgresql://...' npm run qa:slowsql
`)
  process.exit(1)
}

// 過濾走 Supabase Studio／PostgREST 自身嘅內省查詢同 migration DDL ——
// 佢哋一定佔住排行頭幾位（讀 pg_extension、pg_timezone_names 之類），
// 但同學生見到嘅頁面速度完全無關，留住只會淹沒真正嘅訊號。
const NOISE = String.raw`(pg_stat_statements|information_schema|pg_catalog|pg_timezone_names|pg_extension|CREATE TABLE|ALTER TABLE|DROP TABLE|CREATE INDEX|CREATE POLICY|^\s*--)`

const SQL = `
select
  calls,
  round(total_exec_time::numeric, 1) as total_ms,
  round(mean_exec_time::numeric, 2)  as mean_ms,
  round(max_exec_time::numeric, 2)   as max_ms,
  rows,
  left(regexp_replace(query, '\\s+', ' ', 'g'), 120) as q
from pg_stat_statements
where query !~* $1
order by total_exec_time desc
limit $2;
`

const LIMIT = Number(process.argv[2]) || 15
const pool = new Pool({ connectionString: url })

try {
  const { rows } = await pool.query(SQL, [NOISE, LIMIT])

  if (rows.length === 0) {
    console.log(`
ℹ️  pg_stat_statements 入面【冇任何應用層查詢紀錄】。

  呢個唔係錯誤，通常代表：
    · 統計自上次 reset 之後未有真實流量，或
    · 期間冇用戶登入 —— 本平台只有登入用戶先會觸發 /api/progress 等
      資料庫呼叫，未登入用戶 100% 行 localStorage，完全唔掂 Postgres。

  要對照頁面速度同 SQL，先要有真實登入流量。
`)
    process.exit(0)
  }

  console.log(`\n  慢查詢 Top ${rows.length}（按累計耗時排序，已濾走 Studio／migration 噪音）\n`)
  console.log(
    '  ' +
      'total_ms'.padStart(10) + 'mean_ms'.padStart(10) + 'max_ms'.padStart(10) +
      'calls'.padStart(8) + '  query',
  )
  console.log('  ' + '─'.repeat(96))
  for (const r of rows) {
    console.log(
      '  ' +
        String(r.total_ms).padStart(10) +
        String(r.mean_ms).padStart(10) +
        String(r.max_ms).padStart(10) +
        String(r.calls).padStart(8) +
        '  ' + r.q,
    )
  }

  // 只標示，唔自動修 —— 加索引要睇實際查詢模式，唔應該由腳本代人決定。
  const slow = rows.filter((r) => Number(r.mean_ms) > 100)
  console.log(
    slow.length
      ? `\n  ⚠️  ${slow.length} 條查詢平均耗時 > 100ms，值得對照 Vercel Analytics 嘅 LCP 數據睇下有冇關聯。\n`
      : '\n  ✅ 所有查詢平均耗時 ≤ 100ms。\n',
  )
} catch (e) {
  console.error('✗ 查詢失敗：', e instanceof Error ? e.message : e)
  process.exit(1)
} finally {
  await pool.end()
}
