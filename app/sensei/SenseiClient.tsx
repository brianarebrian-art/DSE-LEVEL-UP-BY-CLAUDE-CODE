'use client'

import { useState } from 'react'
import { Search, Sparkles, BookOpen, Target, AlertTriangle, Lightbulb } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { isIdentityQuestion, IDENTITY_ANSWER, AI_BADGE } from '@/lib/sensei/identity'
import { rankCards, type Match } from '@/lib/sensei/intent'
import { loadSenseiCards } from '@/data/sensei/load'
import { SENSEI_SUBJECTS } from '@/data/sensei/types'

// SENSEI 零模型版。學生問一句，我哋【檢索】一張真人簽過名嘅卡，【唔生成】任何內容。
//
// 三個狀態，全部都要老實：
//   identity —— 問身份 → 逐字答憲章 §16.B 嗰段，唔繞開、唔打哈哈
//   hit      —— 搵到卡 → 四段式攤開，附上命中咗邊幾個詞
//   miss     —— 搵唔到 → 老實講搵唔到，唔准砌一個答案出嚟

type Result =
  | { kind: 'identity' }
  | { kind: 'hit'; matches: Match[] }
  | { kind: 'miss' }

export default function SenseiClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    const q = input.trim()
    if (!q) return

    // 身份問題最優先 —— 喺任何檢索之前處理，確保永遠答得到。
    if (isIdentityQuestion(q)) { setResult({ kind: 'identity' }); return }

    setBusy(true)
    try {
      const banks = await Promise.all(SENSEI_SUBJECTS.map((s) => loadSenseiCards(s)))
      const matches = rankCards(q, banks.flat())
      setResult(matches.length ? { kind: 'hit', matches } : { kind: 'miss' })
    } finally {
      setBusy(false)
    }
  }

  const sections = [
    { key: 'concept', Icon: Lightbulb, zh: '概念', en: 'Concept' },
    { key: 'example', Icon: BookOpen, zh: '例子', en: 'Example' },
    { key: 'examTechnique', Icon: Target, zh: '考試技巧', en: 'Exam technique' },
    { key: 'commonTrap', Icon: AlertTriangle, zh: '常見陷阱', en: 'Common trap' },
  ] as const

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-3xl mx-auto">
        {/* 憲章 §16.B 執行要求 1：永遠顯示、唔遮得住嘅 AI 標示。
            唔可以摺埋、唔可以只喺首次出現。 */}
        <div className="inline-flex items-center gap-2 text-xs text-accent bg-accent/[0.08] border border-accent/25 px-3 py-1 rounded-full mb-3">
          <Sparkles size={13} /> {en ? AI_BADGE.en : AI_BADGE.zh}
        </div>

        <h1 className="text-2xl sm:text-3xl font-medium text-ink mb-2">SENSEI</h1>
        <p className="text-ink-muted text-sm leading-relaxed mb-6">
          {en
            ? 'Ask about a concept. Sensei does not write answers — it looks up a knowledge card that a named person has already checked, and shows it to you. If there is no card, it says so.'
            : '問一個概念。Sensei 不會自行寫答案 —— 它檢索一張已由具名真人審核過的知識卡並展示給你。沒有卡片時，它會直接說沒有。'}
        </p>

        <form onSubmit={ask} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={en ? 'e.g. why do public goods have a free-rider problem?' : '例如：點解共用品會有搭便車問題？'}
              aria-label={en ? 'Ask Sensei' : '向 Sensei 提問'}
              className="flex-1 min-w-0 rounded-lg bg-ink/[0.04] border border-ink/15 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent/15 border border-accent/40 px-4 py-2 text-sm text-accent disabled:opacity-50"
            >
              <Search size={14} /> {en ? 'Ask' : '問'}
            </button>
          </div>
        </form>

        {result?.kind === 'identity' && (
          <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4 text-sm leading-relaxed text-ink-soft">
            {en ? IDENTITY_ANSWER.en : IDENTITY_ANSWER.zh}
          </div>
        )}

        {result?.kind === 'miss' && (
          <div className="rounded-xl border border-ink/15 bg-ink/[0.03] p-4 text-sm leading-relaxed text-ink-muted">
            {en
              ? 'No knowledge card covers that yet. Sensei will not make one up — a card only appears here after a person has written and approved it.'
              : '暫時沒有知識卡涵蓋這一題。Sensei 不會自行編一個出來 —— 卡片必須經真人撰寫並批准後才會在此出現。'}
          </div>
        )}

        {result?.kind === 'hit' && (
          <div className="space-y-4">
            {result.matches.map(({ card, hits }) => (
              <article key={card.id} className="rounded-xl border border-ink/15 bg-ink/[0.03] p-4">
                <header className="mb-3">
                  <h2 className="text-base font-medium text-ink">{card.topic}</h2>
                  <p className="text-[11px] text-ink-muted mt-1">
                    {en ? 'Matched: ' : '命中：'}{hits.join('、')}
                    {' · '}
                    {en ? 'reviewed by ' : '審核人 '}{card.reviewer}（{card.reviewedAt}）
                  </p>
                </header>
                {/* 四段式逐段攤開。分段本身就係 ADHD 友善格式，唔使額外開關。 */}
                <dl className="space-y-3">
                  {sections.map(({ key, Icon, zh, en: enLabel }) => (
                    <div key={key}>
                      <dt className="flex items-center gap-1.5 text-xs text-accent mb-1">
                        <Icon size={12} /> {en ? enLabel : zh}
                      </dt>
                      <dd className="text-sm leading-relaxed text-ink-soft">
                        {(en && card[`${key}En` as const]) || card[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
