import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

/**
 * Phase 0：探測 Founder OS 營運表是否已喺資料庫（migration 0029）。
 * 唔假設本地檔名＝遠端已套用；以實際 SELECT 為準。
 */
export type FounderOsSchemaProbe = {
  auditedAt: string
  auditEvents: boolean
  operationalTasks: boolean
  featureFlags: boolean
  /** 全部核心表齊先算 ready */
  ready: boolean
}

async function tableReachable(table: string): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      // 42P01 undefined_table／PGRST 表唔存在 → false；其餘權限錯誤亦當未就緒
      safeLog('warn', `founder schema probe failed: ${table}`, error)
      return false
    }
    return true
  } catch (e) {
    safeLog('warn', `founder schema probe threw: ${table}`, e)
    return false
  }
}

export async function probeFounderOsSchema(): Promise<FounderOsSchemaProbe> {
  const [auditEvents, operationalTasks, featureFlags] = await Promise.all([
    tableReachable('founder_audit_events'),
    tableReachable('founder_operational_tasks'),
    tableReachable('founder_feature_flags'),
  ])
  return {
    auditedAt: new Date().toISOString(),
    auditEvents,
    operationalTasks,
    featureFlags,
    ready: auditEvents && operationalTasks && featureFlags,
  }
}
