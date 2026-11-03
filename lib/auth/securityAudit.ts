import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { formatAuditRow, type AuditLogEntry } from '@/lib/auth/securityAuditCore'

export type { AuditLogEntry }

/**
 * 寫入不可篡改之安全審計日誌（Zero PII 原則）。
 *
 * 嚴禁記錄密碼、Token、API Key 或完整學生個資。
 * IP 與 User Agent 自動進行加鹽/單向雜湊。
 */
export async function recordSecurityAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = getServiceSupabase()
    const row = formatAuditRow(entry)

    // 當前環境容錯：若 audit_logs 表未在本地建立，記錄 safeLog 不中斷業務
    const { error } = await supabase.from('audit_logs').insert(row)
    if (error && error.code !== '42P01') {
      safeLog('error', 'recordSecurityAudit write failed', error)
    }
  } catch (err) {
    safeLog('error', 'recordSecurityAudit unexpected error', err)
  }
}
