'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Heart, Moon, Send, Lock } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useAuthSession, authSignInGoogle } from '@/lib/auth/session'
import HotlineCard from '@/components/HotlineCard'
import { WALL_TAG_KEYS, WALL_TAG_EMOJI, type WallTagKey } from '@/lib/wall/tags'

interface WallPost {
  id: string
  author_hash: string
  content: string
  tags: string[]
  likes_count: number
  created_at: string
  liked: boolean
}

const TAG_LABEL: Record<WallTagKey, { zh: string; en: string }> = {
  night: { zh: '深夜溫書', en: 'Late-night study' },
  win: { zh: '小勝利', en: 'Small win' },
  sos: { zh: '求救', en: 'Need help' },
  growth: { zh: '成長', en: 'Growth' },
  support: { zh: '互相打氣', en: 'Cheering on' },
}

const MAX = 500

function timeAgo(iso: string, en: boolean): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return en ? 'just now' : '啱啱'
  if (m < 60) return en ? `${m} min ago` : `${m} 分鐘前`
  const h = Math.floor(m / 60)
  if (h < 24) return en ? `${h} hr ago` : `${h} 小時前`
  const d = Math.floor(h / 24)
  return en ? `${d} day${d > 1 ? 's' : ''} ago` : `${d} 日前`
}

export default function WallClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const { user, status } = useAuthSession()

  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(true)
  const [posts, setPosts] = useState<WallPost[]>([])
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<WallTagKey[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<'none' | 'pending' | 'toomany' | 'error' | 'closed'>('none')
  const [hotline, setHotline] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/wall', { cache: 'no-store' })
      const data = await res.json()
      setOpen(!!data.open)
      setPosts(Array.isArray(data.posts) ? data.posts : [])
    } catch {
      setOpen(false)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const remaining = MAX - content.length
  const canSubmit = content.trim().length > 0 && content.length <= MAX && !submitting

  const toggleTag = (k: WallTagKey) =>
    setTags((prev) => (prev.includes(k) ? prev.filter((t) => t !== k) : prev.length < 3 ? [...prev, k] : prev))

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    setNotice('none')
    setHotline(false)
    try {
      const res = await fetch('/api/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), tags }),
      })
      if (res.ok) {
        const data = await res.json()
        setContent('')
        setTags([])
        setNotice('pending')
        if (data.showHotline) setHotline(true)
      } else if (res.status === 429) {
        setNotice('toomany')
      } else if (res.status === 403) {
        setNotice('closed')
        setOpen(false)
      } else {
        setNotice('error')
      }
    } catch {
      setNotice('error')
    } finally {
      setSubmitting(false)
    }
  }

  async function like(id: string) {
    if (!user) {
      authSignInGoogle('/wall')
      return
    }
    // 樂觀更新，失敗回滾。
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes_count: p.likes_count + (p.liked ? -1 : 1) } : p)),
    )
    try {
      const res = await fetch('/api/wall/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: id }),
      })
      if (res.ok) {
        const data = await res.json()
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: data.liked, likes_count: data.likes_count } : p)))
      } else {
        void load()
      }
    } catch {
      void load()
    }
  }

  const composer = useMemo(() => {
    if (!open) {
      return (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 text-center text-sm text-[#6B6B6B]">
          <Lock size={18} className="mx-auto mb-2 text-[#B8860B]" />
          {en
            ? 'The wall is paused for now. The reflections below are still here for you.'
            : '個牆暫時休息緊。下面嘅留言仲喺度陪住你。'}
        </div>
      )
    }
    if (status === 'loading') {
      return <div className="h-32 rounded-2xl border border-black/[0.06] bg-white animate-pulse" />
    }
    if (!user) {
      return (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 text-center">
          <p className="text-sm text-[#6B6B6B]">
            {en ? 'Sign in to leave an anonymous message. You will show up only as “Student #XXXX”.' : '登入就可以匿名留言。你只會顯示為「考生 #XXXX」。'}
          </p>
          <button
            onClick={() => authSignInGoogle('/wall')}
            className="mt-3 min-h-11 inline-flex items-center gap-2 rounded-lg bg-[#00726C] px-4 py-2 text-sm font-medium text-white hover:bg-[#005F5A] transition-colors"
          >
            {en ? 'Sign in with Google' : 'Google 登入'}
          </button>
        </div>
      )
    }
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX))}
          rows={3}
          placeholder={en ? 'Write how you feel tonight…' : '寫低你今晚嘅心情…'}
          className="w-full resize-none rounded-lg border border-black/[0.08] bg-[#FAFAF8] p-3 text-sm text-[#2D2D2D] placeholder:text-[#9CA3AF] focus:border-[#008B84] focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {WALL_TAG_KEYS.map((k) => {
            const on = tags.includes(k)
            return (
              <button
                key={k}
                onClick={() => toggleTag(k)}
                className={`min-h-9 rounded-full px-3 py-1 text-xs transition-colors ${
                  on ? 'bg-[#008B84]/12 text-[#00726C] ring-1 ring-[#008B84]/40' : 'bg-black/[0.04] text-[#6B6B6B] hover:bg-black/[0.07]'
                }`}
              >
                {WALL_TAG_EMOJI[k]} {en ? TAG_LABEL[k].en : TAG_LABEL[k].zh}
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${remaining < 0 ? 'text-[#C2185B]' : 'text-[#9CA3AF]'}`}>
            {content.length} / {MAX}
          </span>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="min-h-11 inline-flex items-center gap-1.5 rounded-lg bg-[#00726C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005F5A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={14} /> {en ? 'Post' : '發布'}
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
          {en
            ? 'Every post is read by a real person before it goes public — this keeps everyone safe, so it may take a little while to appear.'
            : '每一則留言都會由真人睇過先公開 —— 為咗大家安全，可能要等一陣先出現。'}
        </p>
      </div>
    )
  }, [open, status, user, content, tags, remaining, canSubmit, en]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-medium text-[#1A1A1A]">
          <Moon size={22} className="text-[#7C3AED]" />
          {en ? 'Shadow Study Room' : '影子溫書室'}
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          {en ? 'An anonymous space to cheer each other on. Be kind — be safe.' : '匿名打氣互助牆 · 一齊撐住 · 安全空間'}
        </p>
      </header>

      {/* 熱線卡永遠置頂 —— 唔靠任何偵測 */}
      <div className="mb-5">
        <HotlineCard />
      </div>

      {composer}

      {/* 發帖後通知 */}
      {notice !== 'none' && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            notice === 'pending'
              ? 'border-[#008B84]/25 bg-[#008B84]/[0.06] text-[#00635E]'
              : 'border-[#B8860B]/30 bg-[#B8860B]/10 text-[#8a6608]'
          }`}
        >
          {notice === 'pending' && (en ? 'Thank you for sharing 💜 Your message is with a real person for review and will appear once approved.' : '多謝你嘅分享 💜 你嘅留言已交俾真人審核，通過後就會出現。')}
          {notice === 'toomany' && (en ? 'You already have a few messages waiting to be reviewed — give those a moment first 🌱' : '你有幾則留言仲喺度等緊審核 —— 等佢哋出咗先再發啦 🌱')}
          {notice === 'closed' && (en ? 'The wall is paused for now.' : '個牆暫時休息緊。')}
          {notice === 'error' && (en ? 'Something went wrong — please try again in a bit.' : '出咗少少問題 —— 遲啲再試多次。')}
        </div>
      )}

      {/* 發帖者本人撞到危機詞 → 溫柔多提一次熱線（唔 block 佢個帖） */}
      {hotline && (
        <div className="mt-3">
          <p className="mb-1.5 text-sm text-[#4A4A4A]">
            {en ? 'It sounds like tonight is heavy. Please talk to someone — you matter.' : '聽落今晚好沉重。搵個人傾下好嗎？你好重要。'}
          </p>
          <HotlineCard emphasis />
        </div>
      )}

      {/* Feed */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="h-24 rounded-2xl border border-black/[0.06] bg-white animate-pulse" />
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-sm text-[#6B6B6B]">
            {en ? 'No messages yet — be the first to leave a little light. 🌙' : '仲未有留言 —— 你可以係第一個留低一點光嘅人。🌙'}
          </div>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-black/[0.06] bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span className="font-medium text-[#7C3AED]">🌙 {p.author_hash}</span>
                <span>·</span>
                <span>{timeAgo(p.created_at, en)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#2D2D2D]">{p.content}</p>
              {p.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) =>
                    WALL_TAG_KEYS.includes(t as WallTagKey) ? (
                      <span key={t} className="rounded-full bg-black/[0.04] px-2 py-0.5 text-xs text-[#6B6B6B]">
                        {WALL_TAG_EMOJI[t as WallTagKey]} {en ? TAG_LABEL[t as WallTagKey].en : TAG_LABEL[t as WallTagKey].zh}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
              <div className="mt-3">
                <button
                  onClick={() => like(p.id)}
                  className={`min-h-11 inline-flex items-center gap-1.5 text-sm transition-colors ${
                    p.liked ? 'text-[#C2185B]' : 'text-[#9CA3AF] hover:text-[#C2185B]'
                  }`}
                  aria-pressed={p.liked}
                  aria-label={en ? 'Cheer this on' : '為佢打氣'}
                >
                  <Heart size={16} className={p.liked ? 'fill-[#C2185B]' : ''} /> {p.likes_count}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
