import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// Plus 權限核對 —— C-Strict 架構（規格 §6）。
//
// ⚠️ SERVER-ONLY。唔好由 client component import ——
// 佢拉到 getServiceSupabase()，個 service-role key 唔可以去到瀏覽器。
//
// ══ 三條唔可以退讓嘅規則 ══
//
// ① 權限【唔可以】寫入 localStorage 或 cookie（§6.2）。
//    唯一真源係 plus_entitlements 表。清空 Chrome 資料、換機、換瀏覽器，
//    重新登入之後權限照樣喺度 —— 因為佢從來冇存喺部機度。
//
// ② 到期【一定】由 server 判（§5.5）。呢度用 Postgres 嘅 now()，
//    唔係 JS 嘅 new Date()。學生改部機時鐘改極都冇用，
//    因為個比較根本唔喺佢部機度做。
//
// ③ 呢度【唔會】掂任何學習數據（§4.3）。入面冇錯題、冇弱項、冇正確率。
//    付款同學習兩條軌唯一嘅連結係 user_id。
//    反方向亦然：user_progress 唔准加 subscription_tier 快取欄 ——
//    一個會漂移嘅副本，遲早會出現「畀咗錢但顯示 free」或者更差嘅相反情況。

export type Tier = 'free' | 'plus'

export type Entitlement = {
  tier: Tier
  /** ISO 字串；free 為 null。純顯示用 —— 唔好攞返嚟喺 client 判斷到期。 */
  expiresAt: string | null
}

const FREE: Entitlement = { tier: 'free', expiresAt: null }

/**
 * 攞當前登入者嘅 Plus 權限。
 *
 * 冇登入 → free。查詢出錯 → free（fail-closed）。
 *
 * 點解出錯要 fail-closed 落 free：另一個方向係「Supabase 一有問題就人人變 Plus」。
 * 免費層本身已經完整可用（§3.1），所以 fail-closed 嘅代價係一個畀咗錢嘅學生
 * 短暫見唔到 Plus 功能 —— 唔開心，但唔會傷害到佢溫書。
 */
export async function getEntitlement(): Promise<Entitlement> {
  const userId = await getSyncUserId()
  if (!userId) return FREE

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('plus_entitlements')
      .select('expires_at')
      .eq('user_id', userId) // 擁有權喺呢度守（service role 繞過 RLS）
      .eq('status', 'active')
      // 到期比較交畀 Postgres —— now() 係伺服器時鐘，唔係學生部機。
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    if (!data?.expires_at) return FREE

    return { tier: 'plus', expiresAt: String(data.expires_at) }
  } catch (e) {
    // 唔 log user_id，唔 log 任何交易內容。
    safeLog('error', 'entitlement', e)
    return FREE
  }
}

/**
 * 一句話版本，畀只需要「係咪 Plus」嘅地方用。
 *
 * ⚠️ 呢個【唔係】用嚟鎖住 §3.1 永久免費層嘅。§3.1 列明嘅嘢
 *（AI 出題、即時對錯、簡短解析、SEN 專注模式、60 秒逆向鎖死引擎連三維自診、
 * 減壓緩衝區、跨裝置同步）任何情況下都唔准上鎖。
 * 呢個 helper 淨係用嚟開啟【加速工具】：計時 Paper 2 模式、匯出錯題 PDF 之類。
 */
export async function hasPlus(): Promise<boolean> {
  return (await getEntitlement()).tier === 'plus'
}
