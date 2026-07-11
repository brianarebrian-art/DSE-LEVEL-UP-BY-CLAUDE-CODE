import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/utils/supabase/server'

// IG Group email 後備通道（化城避風港 3.0）— 連結失效／資源通知用。
// 用返全站唯一嘅 server-only Supabase client（service key 只喺 request 時讀 env，
// 永不落 bundle）。無需登入：/relax 對所有人開放，收 email 唔應該加登入牆。
// 濫用防線：proxy.ts 全域 /api/* 60次/分/IP 已覆蓋 + 格式/長度驗證 + unique 去重。
export const dynamic = 'force-dynamic'

const TABLE = 'ig_group_waitlist'
// 務實格式檢查（非完美 RFC5322，但擋到亂入）：xx@yy.zz，無空白
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  let body: { email?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from(TABLE).insert({ email })
    // 23505 = unique violation：已經留過 → 對用戶嚟講一樣係「已記錄」
    if (error && error.code !== '23505') throw error
    return NextResponse.json({ ok: true })
  } catch {
    // 唔向 client 洩漏 DB 內部訊息
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
