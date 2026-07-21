import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// v8.0 CLOUD-FIRST · API2 — SEN 偏好設定跨裝置同步。
//
// 呢個係 v8 入面唯一一個真缺口：`lib/sync.ts` 個 Snapshot 由頭到尾只覆蓋
// 進度／計數／topicStats／active_session，SEN 設定從來冇同步過 —— 一部機
// 調好字級行距，另一部機要重新調一次。對讀寫障礙學生嚟講呢個係真痛點。
//
// 同 v8 原 spec 唔同：身份用 getSyncUserId()（backend-agnostic，Auth.js 今日 /
// Better Auth 之後），唔係 spec 寫嘅 `auth()` from '@/auth'；Supabase helper 喺
// '@/utils/supabase/server' 唔係 '@/lib/supabase/server'；錯誤一律唔回傳原文
// （Postgres message 會洩露表名／欄名／約束細節）。

export const dynamic = 'force-dynamic'

const TABLE = 'user_settings'

// 白名單 + 逐欄夾邊界。呢啲值最終會寫落 <html> style 同 class，
// 而 localStorage 係用戶可改 —— 一律當唔可信輸入處理。
const LETTER_SPACINGS = ['normal', 'wide', 'extra-wide'] as const
type LetterSpacing = (typeof LETTER_SPACINGS)[number]

export interface CloudSettings {
  easy_font: boolean
  reading_ruler: boolean
  hide_timer: boolean
  calm_lock: boolean
  font_size: number
  line_height: number
  letter_spacing: LetterSpacing
  sensory_pref: unknown | null
  locale: 'zh' | 'en' | null
}

const clamp = (n: unknown, min: number, max: number, fallback: number) => {
  const v = Number(n)
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback
}

function sanitise(raw: Record<string, unknown>): CloudSettings {
  const ls = String(raw.letter_spacing)
  return {
    easy_font: raw.easy_font === true,
    reading_ruler: raw.reading_ruler === true,
    hide_timer: raw.hide_timer === true,
    calm_lock: raw.calm_lock === true,
    font_size: Math.round(clamp(raw.font_size, 12, 24, 16)),
    // 行距入面係 NUMERIC(2,1)，多過一位小數會被 Postgres 直接拒
    line_height: Math.round(clamp(raw.line_height, 1.2, 2, 1.6) * 10) / 10,
    letter_spacing: (LETTER_SPACINGS as readonly string[]).includes(ls)
      ? (ls as LetterSpacing)
      : 'normal',
    sensory_pref:
      raw.sensory_pref != null && typeof raw.sensory_pref === 'object' ? raw.sensory_pref : null,
    locale: raw.locale === 'zh' || raw.locale === 'en' ? raw.locale : null,
  }
}

// GET — 攞呢個用戶雲端嘅設定（未存過就 null，由 client 沿用本機現狀）。
export async function GET() {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId) // 擁有權喺呢度強制（service role 繞過 RLS）
      .maybeSingle()
    if (error) throw error

    if (!data) return NextResponse.json({ settings: null, updated_at: null })
    // user_id 唔回傳畀 client —— 佢已經知自己係邊個，冇必要喺 response 重複身份識別符
    const { user_id, updated_at, ...settings } = data
    void user_id
    return NextResponse.json({ settings, updated_at })
  } catch (e) {
    safeLog('error', 'api/sync/settings GET', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// POST — upsert 設定。Body: { settings: {...} }
export async function POST(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { settings?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  if (body.settings == null || typeof body.settings !== 'object') {
    return NextResponse.json({ error: 'missing settings object' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const updated_at = new Date().toISOString()
    const clean = sanitise(body.settings as Record<string, unknown>)
    const { error } = await supabase
      .from(TABLE)
      .upsert({ user_id: userId, ...clean, updated_at }, { onConflict: 'user_id' })
    if (error) throw error
    return NextResponse.json({ ok: true, updated_at, settings: clean })
  } catch (e) {
    safeLog('error', 'api/sync/settings POST', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
