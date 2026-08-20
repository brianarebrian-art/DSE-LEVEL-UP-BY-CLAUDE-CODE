'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart, Moon, Send, Lock, Flag } from 'lucide-react'
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

/** 舉報信 —— 主旨帶住帖 id 頭 8 碼，等我哋喺 queue 度搵得返係邊條。跟用戶語言。 */
function reportMailto(postId: string, en: boolean): string {
  const subject = en
    ? `[DSE Level Up] Report post ${postId.slice(0, 8)}`
    : `[DSE Level Up] 舉報留言 ${postId.slice(0, 8)}`
  const body = (
    en
      ? [
          `Post reference: ${postId}`,
          '',
          'I would like to report this post because:',
          '',
          '(Please say briefly what happened. If you or somebody else is in danger right now, please do not wait for our reply — call 999, or the Samaritans on 2896 0000 / Suicide Prevention Services on 2382 0000.)',
        ]
      : [
          `帖編號：${postId}`,
          '',
          '我想舉報呢則留言，因為：',
          '',
          '（請簡單講吓發生咩事。如果你或者其他人而家有即時危險，請唔好等我哋回覆 —— 即刻致電 999，或者撒瑪利亞會 2896 0000 / 生命熱線 2382 0000。）',
        ]
  ).join('\n')
  return `mailto:dselevelup@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
        <div className="rounded-2xl border border-line bg-surface-raised p-6 text-center text-sm text-ink-muted">
          <Lock size={18} className="mx-auto mb-2 text-gold" />
          {en
            ? 'The wall is paused for now. The reflections below are still here for you.'
            : '個牆暫時休息緊。下面嘅留言仲喺度陪住你。'}
        </div>
      )
    }
    if (status === 'loading') {
      return <div className="h-32 rounded-2xl border border-line bg-surface-raised animate-pulse" />
    }
    if (!user) {
      return (
        <div className="rounded-2xl border border-line bg-surface-raised p-6 text-center">
          <p className="text-sm text-ink-muted">
            {en ? 'Sign in to leave an anonymous message. You will show up only as “Student #XXXX”.' : '登入就可以匿名留言。你只會顯示為「考生 #XXXX」。'}
          </p>
          <button
            onClick={() => authSignInGoogle('/wall')}
            className="mt-3 min-h-11 inline-flex items-center gap-2 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover transition-colors"
          >
            {en ? 'Sign in with Google' : 'Google 登入'}
          </button>
        </div>
      )
    }
    return (
      <div className="rounded-2xl border border-line bg-surface-raised p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX))}
          rows={3}
          placeholder={en ? 'Write how you feel tonight…' : '寫低你今晚嘅心情…'}
          className="w-full resize-none rounded-lg border border-line bg-surface p-3 text-sm text-ink-soft placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {WALL_TAG_KEYS.map((k) => {
            const on = tags.includes(k)
            return (
              <button
                key={k}
                onClick={() => toggleTag(k)}
                className={`min-h-9 rounded-full px-3 py-1 text-xs transition-colors ${
                  on ? 'bg-accent/12 text-accent-strong ring-1 ring-accent/40' : 'bg-line text-ink-muted hover:bg-line'
                }`}
              >
                {WALL_TAG_EMOJI[k]} {en ? TAG_LABEL[k].en : TAG_LABEL[k].zh}
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${remaining < 0 ? 'text-rose' : 'text-ink-muted'}`}>
            {content.length} / {MAX}
          </span>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="min-h-11 inline-flex items-center gap-1.5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={14} /> {en ? 'Post' : '發布'}
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
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
        <h1 className="flex items-center gap-2 text-2xl font-medium text-ink">
          <Moon size={22} className="text-violet" />
          {en ? 'Shadow Study Room' : '影子溫書室'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {en
            ? 'An anonymous space to cheer each other on. Every post is read by a real person before it appears.'
            : '匿名打氣互助牆 · 一齊撐住 · 每一則都由真人睇過先出現'}
        </p>
      </header>

      {/* 熱線卡永遠置頂 —— 唔靠任何偵測 */}
      <div className="mb-5">
        <HotlineCard />
      </div>

      {/* 社群守則 + 匿名嘅實際含義。
          放喺 composer【上面】—— 同 /relax/group 個免責一樣嘅道理：規則要喺行動之前
          出現先有用。「安全空間」四隻字守唔守得住，睇嘅係下面呢啲具體嘢，唔係口號。
          「匿名」呢段【必須照實寫】：wall_posts 每行實際存住 user_id（見
          app/api/wall/route.ts:96），只係唔出街。講到似「我哋乜都唔知」就係講大話。 */}
      <details className="mb-5 rounded-2xl border border-line bg-surface-raised p-4">
        <summary className="cursor-pointer list-none text-sm font-medium text-ink-soft">
          🛡️ {en ? 'House rules & what “anonymous” actually means' : '呢度嘅規矩 · 同埋「匿名」實際係咩意思'}
        </summary>

        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-ink-muted">
          <li>{en ? '· Never post your phone number, address, school or photos — yours or anyone else’s.' : '· 唔好貼電話、地址、就讀學校或者相片 —— 你自己嘅同人哋嘅都唔好。'}</li>
          <li>{en ? '· Don’t ask anyone here for contact details, photos, or to move to private chat.' : '· 唔好喺呢度問人攞聯絡方法、相片，或者叫人私下傾。'}</li>
          <li>{en ? '· No bullying, harassment or discrimination.' : '· 唔准欺凌、騷擾、歧視。'}</li>
          <li>{en ? '· Nothing sexual, violent, or that encourages self-harm.' : '· 唔准性、暴力，或者鼓勵自我傷害嘅內容。'}</li>
          <li>{en ? '· If a post breaks these, it simply never goes public. Repeatedly doing it means posting gets paused for that account.' : '· 違規嘅留言唔會公開。重複違規嘅帳戶會被暫停發帖。'}</li>
        </ul>

        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          {en
            ? '“Anonymous” means other students only ever see “Student #XXXX”, and that number changes every day so nobody can link your posts together. It does not mean we know nothing: your post is stored with your account id so that a real person can review it and so we can act if someone is being harmed. We do not show it to other users.'
            : '「匿名」係指其他同學只會見到「考生 #XXXX」，而且個號碼每日都會變，所以冇人可以將你唔同日嘅留言串埋一齊。但佢唔等於我哋乜都唔知：你嘅留言會連同你嘅帳戶編號一齊儲存，好讓真人可以審核，亦好讓有人受到傷害時我哋處理得到。我哋唔會將佢展示畀其他用戶。'}
        </p>

        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          {en
            ? 'This wall is not a crisis service and we are not counsellors. If you or someone else is in danger right now, call 999 or one of the hotlines above.'
            : '呢個牆唔係危機支援服務，我哋亦唔係輔導員。如果你或者其他人而家有即時危險，請致電 999 或者上面嘅熱線。'}
        </p>

        <p className="mt-2 text-xs leading-relaxed">
          <Link href="/community-safety" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'Full community safety guidelines →' : '完整社群安全守則 →'}
          </Link>
        </p>
      </details>

      {composer}

      {/* 發帖後通知 */}
      {notice !== 'none' && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            notice === 'pending'
              ? 'border-accent/25 bg-accent/[0.06] text-accent-strong'
              : 'border-gold/30 bg-gold/10 text-gold-strong'
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
          <p className="mb-1.5 text-sm text-ink-soft">
            {en ? 'It sounds like tonight is heavy. Please talk to someone — you matter.' : '聽落今晚好沉重。搵個人傾下好嗎？你好重要。'}
          </p>
          <HotlineCard emphasis />
        </div>
      )}

      {/* Feed */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="h-24 rounded-2xl border border-line bg-surface-raised animate-pulse" />
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface-raised p-8 text-center text-sm text-ink-muted">
            {en ? 'No messages yet — be the first to leave a little light. 🌙' : '仲未有留言 —— 你可以係第一個留低一點光嘅人。🌙'}
          </div>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-line bg-surface-raised p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <span className="font-medium text-violet">🌙 {p.author_hash}</span>
                <span>·</span>
                <span>{timeAgo(p.created_at, en)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{p.content}</p>
              {p.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) =>
                    WALL_TAG_KEYS.includes(t as WallTagKey) ? (
                      <span key={t} className="rounded-full bg-line px-2 py-0.5 text-xs text-ink-muted">
                        {WALL_TAG_EMOJI[t as WallTagKey]} {en ? TAG_LABEL[t as WallTagKey].en : TAG_LABEL[t as WallTagKey].zh}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => like(p.id)}
                  className={`min-h-11 inline-flex items-center gap-1.5 text-sm transition-colors ${
                    p.liked ? 'text-rose' : 'text-ink-muted hover:text-rose'
                  }`}
                  aria-pressed={p.liked}
                  aria-label={en ? 'Cheer this on' : '為佢打氣'}
                >
                  <Heart size={16} className={p.liked ? 'fill-rose' : ''} /> {p.likes_count}
                </button>

                {/* 舉報。刻意用 mailto 而唔係一個 /api/wall/report ——
                    後者要新表、要 migration、要創辦人批；而「有個掣但寫入唔到」
                    比冇掣更差（見 /relax/group 個 email 表單：寫入一張從未存在
                    嘅表，由第一日起每個學生撳完都見到「未能記錄」）。
                    mailto 唔靚，但今日真係到得到人手上，而且 $0。 */}
                <a
                  href={reportMailto(p.id, en)}
                  className="min-h-11 inline-flex items-center gap-1 text-xs text-ink-muted transition-colors hover:text-accent-strong"
                >
                  <Flag size={13} aria-hidden /> {en ? 'Report' : '舉報'}
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
