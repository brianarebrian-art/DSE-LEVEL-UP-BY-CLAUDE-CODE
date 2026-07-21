'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PenLine, Sparkles, Printer, RotateCcw, ChevronRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// ─────────────────────────────────────────────────────────────────────────────
// English Paper 2 — Writing Studio.
// A drafting canvas + interactive HKEAA 7-point self-assessment rubric, themed on
// the 2023 DSE P2 "Poems & Songs" controversy (an AI-composed entry winning a music
// contest). The actual HKEAA passage/question paper is NOT reproduced (it is not in
// the workspace and is copyrighted); this is an original practice task on the same
// theme, plus the public 7-point assessment criteria and a vocabulary booster.
//
// Light-first migration (Kate/Leo 2026-07-21, task #97): 清晨圖書館 palette.
// English-subject accent = purple #7C3AED; gold #B8860B highlights; teal #008B84
// for the "on target" word count. Weight 400/500 only, no font-extrabold.
// ─────────────────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'dse_writing_draft'

type DomainKey = 'content' | 'language' | 'organisation'

const DOMAINS: { key: DomainKey; zh: string; en: string; anchors: { band: number; en: string }[] }[] = [
  {
    key: 'content', zh: '內容 Content', en: 'Content',
    anchors: [
      { band: 7, en: 'Highly relevant; ideas fully developed with insight and originality — convincing throughout.' },
      { band: 5, en: 'Relevant; ideas adequately developed and generally convincing.' },
      { band: 3, en: 'Mostly relevant but thin or repetitive; only some development.' },
      { band: 1, en: 'Largely irrelevant or undeveloped.' },
    ],
  },
  {
    key: 'language', zh: '語言 Language', en: 'Language',
    anchors: [
      { band: 7, en: 'Wide range of accurate vocabulary and structures; errors rare and minor; fluent.' },
      { band: 5, en: 'Reasonable range; some errors that rarely impede meaning.' },
      { band: 3, en: 'Limited range; frequent errors that sometimes impede meaning.' },
      { band: 1, en: 'Very limited; errors throughout obscure meaning.' },
    ],
  },
  {
    key: 'organisation', zh: '組織 Organisation', en: 'Organisation',
    anchors: [
      { band: 7, en: 'Coherent and well-structured; effective paragraphing and cohesive devices.' },
      { band: 5, en: 'Generally coherent; adequate paragraphing and linking.' },
      { band: 3, en: 'Some structure but loose links; uneven paragraphing.' },
      { band: 1, en: 'Little discernible structure.' },
    ],
  },
]

const VOCAB: { phrase: string; meaning: string; example: string }[] = [
  { phrase: 'diminish human ingenuity', meaning: 'to lessen or weaken human creativity and inventive skill', example: 'Critics fear that flooding the charts with AI tracks will diminish human ingenuity.' },
  { phrase: 'infringe upon copyrights', meaning: 'to violate the legal rights of original creators', example: 'Training a model on songs without consent may infringe upon copyrights.' },
  { phrase: 'undermine artistic authenticity', meaning: 'to erode the genuineness and originality of a work of art', example: 'Mass-produced, algorithm-made songs could undermine artistic authenticity.' },
  { phrase: 'autonomous composition algorithms', meaning: 'software that composes music independently of human input', example: 'Autonomous composition algorithms can now generate a full symphony in seconds.' },
  { phrase: 'the hallmark of creative expression', meaning: 'the defining quality or mark of genuine creativity', example: 'Emotional depth, many argue, remains the hallmark of creative expression.' },
]

function bandLabel(avg: number, en: boolean): string {
  if (avg >= 6.5) return en ? 'Estimated 5** — exceptional' : '預估 5** — 卓越'
  if (avg >= 5.5) return en ? 'Estimated 5*/5 — strong' : '預估 5*/5 — 優秀'
  if (avg >= 4.5) return en ? 'Estimated 4 — on target' : '預估 4 — 達標'
  if (avg >= 3) return en ? 'Estimated 3 — developing' : '預估 3 — 待提升'
  return en ? 'Estimated 1–2 — needs rebuilding' : '預估 1–2 — 須重建基礎'
}

export default function WritingPage() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, eng: string) => (en ? eng : zh)

  const [draft, setDraft] = useState('')
  const [scores, setScores] = useState<Record<DomainKey, number>>({ content: 0, language: 0, organisation: 0 })

  // Persist the draft locally so it survives reloads (never sent anywhere).
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) setDraft(saved)
  }, [])
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(DRAFT_KEY, draft), 400)
    return () => clearTimeout(id)
  }, [draft])

  const wordCount = useMemo(
    () => draft.trim().split(/\s+/).filter(Boolean).length,
    [draft]
  )

  const rated = Object.values(scores).filter((s) => s > 0).length
  const avg = rated === 3
    ? (scores.content + scores.language + scores.organisation) / 3
    : 0

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-[#7C3AED] bg-[#7C3AED]/[0.08] border border-[#7C3AED]/25 px-3 py-1 rounded-full mb-3">
            <PenLine size={13} /> {tr('英文卷二・寫作工作室', 'English Paper 2 · Writing Studio')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#1A1A1A] mb-2">
            {tr('AI 作曲爭議', 'The AI Music Contest Controversy')}
          </h1>
          <p className="text-[#6B6B6B] text-sm leading-relaxed">
            {tr(
              '取材自 2023 DSE 英文卷二「Poems & Songs」主題的原創練習題（非 HKEAA 官方試題複本）。',
              'An original practice task on the 2023 DSE English Paper 2 "Poems & Songs" theme (not a reproduction of the HKEAA paper).',
            )}
          </p>
        </div>

        {/* Prompt */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-6">
          <h2 className="font-medium mb-2 text-[#1A1A1A]">{tr('題目', 'The Task')}</h2>
          <p className="text-[#2D2D2D] text-sm leading-relaxed">
            {tr(
              '一個地區音樂比賽爆出爭議：一首由人工智能創作的參賽作品奪得冠軍。有人視之為創新，有人認為它違背了比賽的初衷。試撰寫一篇文章，論述應否容許 AI 創作的音樂與真人音樂家同場競技。（約 400 字）',
              'A regional music contest has been thrown into controversy after an AI-composed entry won first prize. Some hail it as innovation; others say it betrays the spirit of the competition. Write an article arguing whether AI-composed music should be allowed to compete alongside human musicians. (~400 words)',
            )}
          </p>
        </div>

        {/* Vocabulary booster */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#B8860B]" />
            <h2 className="font-medium text-[#1A1A1A]">{tr('5 個高分詞組 Vocabulary Booster', '5 Vocabulary Boosters')}</h2>
          </div>
          <div className="space-y-3">
            {VOCAB.map((v) => (
              <button
                key={v.phrase}
                onClick={() => setDraft((d) => (d.trimEnd() + (d.trim() ? ' ' : '') + v.phrase + ' ').replace(/^ /, ''))}
                className="w-full text-left group bg-[#F5F5F0] hover:bg-[#EDEDE8] border border-black/[0.06] hover:border-[#7C3AED]/40 rounded-xl px-4 py-3 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[#7C3AED] text-sm">{v.phrase}</span>
                  <span className="text-[11px] text-[#9CA3AF] group-hover:text-[#7C3AED] shrink-0 inline-flex items-center gap-0.5">
                    {tr('插入', 'Insert')} <ChevronRight size={12} />
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-1">{v.meaning}</p>
                <p className="text-xs text-[#9CA3AF] italic mt-1">“{v.example}”</p>
              </button>
            ))}
          </div>
        </div>

        {/* Drafting canvas */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-[#1A1A1A]">{tr('草稿區', 'Drafting Canvas')}</h2>
            <span className={`text-xs ${wordCount >= 380 ? 'text-[#008B84]' : 'text-[#9CA3AF]'}`}>
              {wordCount} {tr('字', 'words')}
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={14}
            placeholder={tr('在此開始你的文章……', 'Start writing your article here…')}
            className="w-full bg-[#FAFAF8] border border-black/[0.12] rounded-xl p-4 text-sm text-[#1A1A1A] leading-relaxed resize-y focus:outline-none focus:border-[#7C3AED]/60"
          />
          <div className="no-print flex flex-wrap gap-3 mt-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-[#F5F5F0] hover:bg-[#EDEDE8] border border-black/[0.10] text-[#2D2D2D] text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              <Printer size={15} /> {tr('列印 / 匯出 A4', 'Print / Export A4')}
            </button>
            <button
              onClick={() => { if (draft) { setDraft(''); localStorage.removeItem(DRAFT_KEY) } }}
              className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#6B6B6B] text-sm px-3 py-2.5 transition-all"
            >
              <RotateCcw size={14} /> {tr('清空', 'Clear')}
            </button>
          </div>
        </div>

        {/* Self-assessment rubric */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6">
          <h2 className="font-medium text-[#1A1A1A] mb-1">{tr('自評量表（HKEAA 7 分制）', 'Self-Assessment (HKEAA 7-point scale)')}</h2>
          <p className="text-xs text-[#9CA3AF] mb-5">
            {tr('按三大範疇為自己的文章評分（1 = 最弱，7 = 最強）。', 'Rate your own writing on the three domains (1 = weakest, 7 = strongest).')}
          </p>

          <div className="space-y-6">
            {DOMAINS.map((d) => (
              <div key={d.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#1A1A1A] text-sm">{tr(d.zh, d.en)}</span>
                  {scores[d.key] > 0 && (
                    <span className="text-xs text-[#7C3AED] font-medium">{scores[d.key]} / 7</span>
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((band) => (
                    <button
                      key={band}
                      onClick={() => setScores((s) => ({ ...s, [d.key]: band }))}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        scores[d.key] === band
                          ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                          : 'bg-[#F5F5F0] border-black/[0.10] text-[#6B6B6B] hover:border-black/[0.25]'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
                <ul className="text-[11px] text-[#9CA3AF] space-y-0.5">
                  {d.anchors.map((a) => (
                    <li key={a.band}><span className="text-[#6B6B6B] font-medium">{a.band}:</span> {a.en}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Overall band */}
          {avg > 0 && (
            <div className="mt-6 p-4 bg-[#7C3AED]/[0.06] border border-[#7C3AED]/25 rounded-xl text-center">
              <div className="text-xs text-[#6B6B6B] mb-1">{tr('綜合自評', 'Overall self-assessment')}</div>
              <div className="text-2xl font-medium text-[#7C3AED]">{avg.toFixed(1)} / 7</div>
              <div className="text-sm text-[#7C3AED] mt-1">{bandLabel(avg, en)}</div>
            </div>
          )}
          {rated > 0 && rated < 3 && (
            <p className="mt-4 text-xs text-[#9CA3AF] text-center">
              {tr('為三個範疇都評分後即顯示綜合等級。', 'Rate all three domains to see your overall band.')}
            </p>
          )}
        </div>

        {/* Back link */}
        <div className="no-print mt-8">
          <Link href="/subjects/english" className="text-[#7C3AED] hover:text-[#6D28D9] text-sm inline-flex items-center gap-1">
            {tr('← 返回英文科', '← Back to English')}
          </Link>
        </div>
      </div>
    </div>
  )
}
