import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// ❤️ toggle。要登入。只可以 like 已出街（approved）嘅帖。
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { post_id?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  const postId = typeof body.post_id === 'string' ? body.post_id : ''
  if (!postId) return NextResponse.json({ error: 'missing post_id' }, { status: 400 })

  try {
    const supabase = getServiceSupabase()

    // 只可以 like approved 帖（唔俾透過 like 探測 pending/rejected 帖存在與否）。
    const { data: post, error: postErr } = await supabase
      .from('wall_posts')
      .select('id, status')
      .eq('id', postId)
      .maybeSingle()
    if (postErr) throw postErr
    if (!post || post.status !== 'approved') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    const { data: existing } = await supabase
      .from('wall_likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      await supabase.from('wall_likes').delete().eq('post_id', postId).eq('user_id', userId)
    } else {
      const { error: insErr } = await supabase.from('wall_likes').insert({ post_id: postId, user_id: userId })
      if (insErr && insErr.code !== '23505') throw insErr
    }

    // 由 wall_likes 真實 count 回寫 likes_count（避免 +1/-1 漂移）。
    const { count } = await supabase
      .from('wall_likes')
      .select('post_id', { count: 'exact', head: true })
      .eq('post_id', postId)
    const likes_count = count ?? 0
    await supabase.from('wall_posts').update({ likes_count }).eq('id', postId)

    return NextResponse.json({ ok: true, liked: !existing, likes_count })
  } catch (e) {
    safeLog('error', 'api/wall/like POST', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
