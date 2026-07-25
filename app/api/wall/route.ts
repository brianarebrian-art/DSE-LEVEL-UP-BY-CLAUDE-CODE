import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { authorHandle } from '@/lib/wall/identity'
import { shouldSurfaceHotline } from '@/lib/wall/safety'
import { sanitizeTags } from '@/lib/wall/tags'

// 影子溫書室 API。
//   GET  — 出街 feed（【只】approved，最新在前）。公開，唔使登入都睇得。
//   POST — 發帖。要登入（問責）。一律 status='pending'，【冇 auto-publish】，等真人審。
// 全域 /api/* 60次/分/IP 限流由 proxy.ts 覆蓋；下面再加每人 pending 上限防洗版。
export const dynamic = 'force-dynamic'

const FEED_LIMIT = 50
const MAX_PENDING_PER_USER = 3 // 一個人最多 3 條喺 queue 度未審，防一人洗爆人手隊列

// Kill switch（spec §10「隨時可停」）：唔使改 code / 重新 deploy，環境變數一 set 就停收帖。
function wallOpen(): boolean {
  return (process.env.WALL_ENABLED ?? 'true').toLowerCase() === 'true'
}

// GET — 出街 feed。
export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('wall_posts')
      .select('id, author_hash, content, tags, likes_count, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(FEED_LIMIT)
    if (error) throw error
    const posts = data ?? []

    // 登入用戶：標返佢 like 咗邊幾條（一 query）。未登入 → 空集。
    let likedIds: string[] = []
    const userId = await getSyncUserId()
    if (userId && posts.length > 0) {
      const ids = posts.map((p) => p.id)
      const { data: likes } = await supabase
        .from('wall_likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', ids)
      likedIds = (likes ?? []).map((l) => l.post_id)
    }

    return NextResponse.json({
      open: wallOpen(),
      signedIn: !!userId,
      posts: posts.map((p) => ({ ...p, liked: likedIds.includes(p.id) })),
    })
  } catch (e) {
    safeLog('error', 'api/wall GET', e)
    // Supabase 未配置 / 表未建 → 前端降級為「暫時未開放」，唔穿崩。
    return NextResponse.json({ open: false, signedIn: false, posts: [], error: 'unavailable' }, { status: 200 })
  }
}

// POST — 發帖（一律 pending）。
export async function POST(request: Request) {
  if (!wallOpen()) {
    return NextResponse.json({ error: 'wall_closed' }, { status: 403 })
  }

  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { content?: unknown; tags?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const content = typeof body.content === 'string' ? body.content.trim() : ''
  if (!content || content.length > 500) {
    return NextResponse.json({ error: 'invalid content' }, { status: 400 })
  }
  const tags = sanitizeTags(body.tags)

  try {
    const supabase = getServiceSupabase()

    // 防洗版：一人最多 MAX_PENDING_PER_USER 條未審。
    const { count, error: countErr } = await supabase
      .from('wall_posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending')
    if (countErr) throw countErr
    if ((count ?? 0) >= MAX_PENDING_PER_USER) {
      return NextResponse.json({ error: 'too_many_pending' }, { status: 429 })
    }

    const { error } = await supabase.from('wall_posts').insert({
      user_id: userId,
      author_hash: authorHandle(userId),
      content,
      tags,
      status: 'pending', // ← 永遠 pending。冇任何路徑令帖自動出街。
    })
    if (error) throw error

    // 熱線 signpost：只影響「要唔要向發帖者本人彈熱線卡」，唔影響帖去向（照樣 pending）。
    return NextResponse.json({ ok: true, pending: true, showHotline: shouldSurfaceHotline(content) })
  } catch (e) {
    safeLog('error', 'api/wall POST', e)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
