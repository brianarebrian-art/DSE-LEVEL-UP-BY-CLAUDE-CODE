// Agentic Harness v5 · Phase 4 — SQL deny-list（$0；防越權破壞）
//
// 對映 OWASP MCP02（特權提升 / 越權 SQL）。Agent 對 Supabase 只應走白名單 server route；
// 萬一將來有任何 raw SQL 執行路徑，先過呢個 fail-safe guard（寧枉勿縱）。
// 破壞性 DDL / 大範圍 DML / 多語句串接一律拒；合法受控寫入交由上層 route 負責。

const DENY = /\b(drop|truncate|alter|grant|revoke|create\s+(role|user)|delete\s+from|update\b[\s\S]*\bset)\b/i

export interface SqlCheck {
  safe: boolean
  reason?: string
}

export function assertSafeSql(sql: string): SqlCheck {
  const s = sql.trim()
  // 多語句串接（分號後仍有非空白）＝拒（防注入串接）
  if (/;\s*\S/.test(s.replace(/;\s*$/, ''))) return { safe: false, reason: '多語句串接被拒' }
  if (DENY.test(s)) return { safe: false, reason: '偵測到破壞性 SQL（DROP/TRUNCATE/ALTER/GRANT/REVOKE/DELETE/UPDATE 等）' }
  return { safe: true }
}
