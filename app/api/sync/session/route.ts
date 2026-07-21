import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import type { ActiveSession, SavedAnswer } from '@/lib/sessionResume'

// v8.0 CLOUD-FIRST · API1 — 做緊嘅練習 session 即時上雲。
//
// ⚠️ 同 v8 原 spec 最重要嘅一處分別：`answers` 存【選項文字】，唔存 correctIndex。
// 原 spec 寫 `answers JSONB -- [null, 0, 2, 1, ...] correctIndex`，但呢個平台由
// 2026-06-18 起就係按選項文字批改（`correctZh`），因為選項每次 render 都會
// Fisher-Yates 洗牌。存 index 嘅話，跨裝置續做時個 index 會對到另一個選項 ——
// 唔會報錯，只會靜默改錯卷。所以 payload 直接沿用已 shipped 嘅 ActiveSession 型別。
//
// 路徑更正（原 spec 三處都錯）：身份用 getSyncUserId()（backend-agnostic）唔係
// `auth()` from '@/auth'；Supabase helper 喺 '@/utils/supabase/server'；
// 錯誤唔回傳原文（Postgres message 會洩露表名／欄名）。

export const dynamic = 'force-dynamic'

const TABLE = 'user_sessions'

/** POST body。session_id 由 client 帶（每份卷一個），唔會 server 端亂生。 */
interface SessionPayload extends ActiveSession {
  sessionId: string
  deviceId: string
}

const isSavedAnswer = (v: unknown): v is SavedAnswer =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as SavedAnswer).selectedZh === 'string' &&
  typeof (v as SavedAnswer).isCorrect === 'boolean'

/**
 * Shape-guard。呢個 payload 由瀏覽器嚟，一律當唔可信輸入。
 * 特別注意 sessionId：原 spec 缺席時 server 自己 `crypto.randomUUID()`，
 * 咁樣每個 request 都會 upsert 唔中而插一行新 row → 無上限增長。呢度要求必填。
 */
function isSessionPayload(v: unknown): v is SessionPayload {
  if (!v || typeof v !== 'object') return false
  const s = v as Partial<SessionPayload>
  return (
    s.v === 1 &&
    typeof s.sessionId === 'string' &&
    s.sessionId.length > 0 &&
    s.sessionId.length <= 100 &&
    typeof s.deviceId === 'string' &&
    s.deviceId.length > 0 &&
    s.deviceId.length <= 100 &&
    typeof s.subjectId === 'string' &&
    (s.mode === 'normal' || s.mode === 'weakness') &&
    Array.isArray(s.questionIds) &&
    s.questionIds.length <= 200 &&
    s.questionIds.every((id) => typeof id === 'string') &&
    Array.isArray(s.answers) &&
    s.answers.every((a) => a === null || isSavedAnswer(a)) &&
    typeof s.current === 'number' &&
    s.current >= 0 &&
    typeof s.elapsed === 'number' &&
    s.elapsed >= 0
  )
}

// GET — 攞返呢個用戶最新一份未完成嘅卷（?session_id= 可指定某一份）。
export async function GET(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const sessionId = new URL(request.url).searchParams.get('session_id')

  try {
    const supabase = getServiceSupabase()
    let query = supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId) // 擁有權喺呢度強制（service role 繞過 RLS）
      .order('last_modified', { ascending: false })
      .limit(1)
    if (sessionId) query = query.eq('session_id', sessionId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ session: data?.[0] ?? null })
  } catch (e) {
    safeLog('error', 'api/sync/session GET', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// POST — upsert 做緊嘅 session。Body: SessionPayload
export async function POST(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  if (!isSessionPayload(body)) {
    return NextResponse.json({ error: 'invalid session payload' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const last_modified = new Date().toISOString()
    const { error } = await supabase.from(TABLE).upsert(
      {
        user_id: userId,
        session_id: body.sessionId,
        device_id: body.deviceId,
        subject_id: body.subjectId,
        topic_filter: body.topicFilter ?? null,
        mode: body.mode,
        question_ids: body.questionIds,
        current_index: body.current,
        answers: body.answers,
        time_spent: Math.round(body.elapsed),
        last_modified,
      },
      { onConflict: 'user_id,session_id' },
    )
    if (error) throw error
    return NextResponse.json({ ok: true, last_modified })
  } catch (e) {
    safeLog('error', 'api/sync/session POST', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// DELETE — 做完一份卷就清走（?session_id= 必填）。
export async function DELETE(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const sessionId = new URL(request.url).searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 })

  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('user_id', userId) // 只可以刪自己嘅
      .eq('session_id', sessionId)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/sync/session DELETE', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
