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

/** 憲章 §8.2 唔管呢個數 —— 修補 7 定 3 部。改佢唔使雙簽，但要諗清楚 UX。 */
export const MAX_PLUS_DEVICES = 3

/** 唔會每次頁面載入都寫 DB。同一部機一個鐘內只 touch 一次。 */
const LRU_TOUCH_INTERVAL_MS = 60 * 60 * 1000

/**
 * 帶裝置 LRU 嘅權限核對（Phase 2.3 方案 B）。
 *
 * 最近用開嘅 MAX_PLUS_DEVICES 部攞到 Plus。第 4 部一用，
 * 最耐冇用嗰部自動讓位 —— 讓位＝跌返 free，唔係被鎖走任何嘢。
 * §3.1 永久免費層對每一部機、每一個人、任何時候都完整可用。
 *
 * ══ 裝置檢查 fail-OPEN，同 entitlement 本身 fail-CLOSED 相反 ══
 * 呢個唔對稱係刻意嘅：
 *   · entitlement 查唔到 → free。因為「唔知佢有冇畀錢」嗰陣，
 *     當佢冇畀，最多係佢見唔到加速工具。
 *   · 裝置表查唔到 → 照畀 Plus。因為佢【已經確認畀咗錢】，
 *     而裝置上限係一個收入保護機制，唔係安全邊界。
 *     為咗我哋個 DB 出問題而剝一個付費學生嘅權限，講唔通。
 */
export async function getEntitlementForDevice(deviceToken: string | null): Promise<Entitlement> {
  const ent = await getEntitlement()
  if (ent.tier !== 'plus' || !deviceToken) return ent

  const userId = await getSyncUserId()
  if (!userId) return ent

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('plus_devices')
      .select('device_token, last_seen_at')
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false })
      .limit(MAX_PLUS_DEVICES + 1)
    if (error) throw error

    const rows = data ?? []
    const mine = rows.find((r) => r.device_token === deviceToken)
    const now = Date.now()

    // 節流：一個鐘內見過就唔再寫。
    const stale = !mine || now - new Date(String(mine.last_seen_at)).getTime() > LRU_TOUCH_INTERVAL_MS
    if (stale) {
      await supabase
        .from('plus_devices')
        .upsert({ user_id: userId, device_token: deviceToken, last_seen_at: new Date(now).toISOString() })
      // 啱啱 touch 過＝最近用開，一定喺 top N 入面。
      return ent
    }

    // 排名：喺最近用開嘅頭 N 部之內先攞到 Plus。
    const rank = rows.findIndex((r) => r.device_token === deviceToken)
    return rank >= 0 && rank < MAX_PLUS_DEVICES ? ent : { tier: 'free', expiresAt: ent.expiresAt }
  } catch (e) {
    safeLog('error', 'entitlement-device', e)
    return ent // fail-open —— 見上面註釋
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
