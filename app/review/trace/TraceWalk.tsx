'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { applyReview, intervalDays, weightsForReviewCount, type CardState } from '@/lib/fsrs/scheduler'
import { updateMastery } from '@/lib/fsrs/bkt'
import { keywordGap, socraticReply, tutorDrill, TUTOR_DRILLS, type TutorReply } from '@/lib/tutor/socratic'

type ScheduleView = {
  reviewInDays: number
  stability: number
  difficulty: number
  retrievability: number
  mastery: number
  personalized: false
}

export default function TraceWalk() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [topicId, setTopicId] = useState(TUTOR_DRILLS[0].topicId)
  const [misses, setMisses] = useState(0)
  const [reply, setReply] = useState<TutorReply | null>(null)
  const [card, setCard] = useState<CardState | null>(null)
  const [mastery, setMastery] = useState(0.3)
  const [schedule, setSchedule] = useState<ScheduleView | null>(null)
  const [note, setNote] = useState('')
  const [keywordNote, setKeywordNote] = useState<string | null>(null)
  const drill = tutorDrill(topicId) ?? TUTOR_DRILLS[0]
  const tr = (zh: string, eng: string) => (en ? eng : zh)

  async function scheduleReview(rating: 1 | 3, elapsedDays: number) {
    const localNext = applyReview(card, rating, elapsedDays)
    const localMastery = updateMastery(mastery, rating >= 3)
    const localView: ScheduleView = {
      reviewInDays: intervalDays(localNext.stability),
      stability: localNext.stability,
      difficulty: localNext.difficulty,
      retrievability: localNext.retrievability,
      mastery: localMastery,
      personalized: weightsForReviewCount(localNext.reviews).personalized,
    }
    setCard(localNext)
    setMastery(localMastery)
    try {
      const res = await fetch('/api/review/schedule', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rating, elapsedDays, previous: card, mastery }),
      })
      if (!res.ok) {
        setSchedule(localView)
        return
      }
      const data = await res.json() as { reviewInDays: number; next: CardState; mastery: number; weights: { personalized: false } }
      setCard(data.next)
      setMastery(data.mastery)
      setSchedule({
        reviewInDays: data.reviewInDays,
        stability: data.next.stability,
        difficulty: data.next.difficulty,
        retrievability: data.next.retrievability,
        mastery: data.mastery,
        personalized: data.weights.personalized,
      })
    } catch {
      setSchedule(localView)
    }
  }

  async function onChoose(optionId: string) {
    const correct = optionId === drill.correctOptionId
    if (correct) {
      setReply(null)
      setMisses(0)
      const gap = keywordGap(topicId, note)
      setKeywordNote(gap ? (en ? gap.en : gap.zh) : null)
      await scheduleReview(3, card ? 4 : 0)
      return
    }
    const nextMisses = misses + 1
    setMisses(nextMisses)
    setKeywordNote(null)
    const local = socraticReply(topicId, nextMisses, note)
    try {
      const res = await fetch('/api/tutor/socratic', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topicId, misses: nextMisses, studentText: note }),
      })
      if (res.ok) setReply(await res.json() as TutorReply)
      else setReply(local)
    } catch {
      setReply(local)
    }
    await scheduleReview(1, card ? 4 : 0)
  }

  function switchTopic(next: string) {
    setTopicId(next)
    setMisses(0)
    setReply(null)
    setCard(null)
    setMastery(0.3)
    setSchedule(null)
    setNote('')
    setKeywordNote(null)
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-xs tracking-wide text-ink-muted">{tr('先備回溯', 'Prerequisite trace')}</p>
      <div className="mt-3 flex items-start gap-3">
        <img src="/icons/knowledge-node.svg" alt="" width={40} height={40} className="mt-1" />
        <h1 className="min-w-0 font-serif text-3xl leading-tight text-ink">{tr('答不上時，先退回兩層', 'When a step does not land, walk back two layers')}</h1>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        {tr(
          '提示只問下一步。連續三次仍未對上，會改做一題相似題，並顯示另一個例子的圖。',
          'Hints only ask for the next step. After three misses, you get a similar item and a diagram of a different example.',
        )}
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={tr('課題', 'Topics')}>
        {TUTOR_DRILLS.map((item) => (
          <button
            key={item.topicId}
            type="button"
            role="tab"
            aria-selected={item.topicId === topicId}
            className="min-h-11 rounded-full border border-line px-4 text-sm text-ink active:scale-[0.98] aria-selected:bg-surface-sunken"
            onClick={() => switchTopic(item.topicId)}
          >
            {item.topicId === 'm2-differentiation'
              ? tr('微分', 'Differentiation')
              : item.topicId === 'chem-electrolysis'
                ? tr('電解', 'Electrolysis')
                : tr('遺傳', 'Genetics')}
          </button>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface-raised p-5" aria-labelledby="stem">
        <h2 id="stem" className="text-lg text-ink">{en ? drill.stem.en : drill.stem.zh}</h2>
        <div className="mt-4 grid gap-2">
          {drill.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="min-h-11 rounded-xl border border-line px-4 text-left text-sm text-ink active:scale-[0.98]"
              onClick={() => onChoose(option.id)}
            >
              {en ? option.label.en : option.label.zh}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm text-ink" htmlFor="keyword-note">
          {tr('若以文字作答，寫下你用到的詞', 'If you answer in words, write the terms you used')}
        </label>
        <input
          id="keyword-note"
          value={note}
          onChange={(event) => setNote(event.target.value.slice(0, 500))}
          className="mt-2 w-full min-h-11 rounded-xl border border-line bg-surface px-3 text-sm text-ink"
        />
      </section>

      {reply && (
        <section className="mt-4 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <h2 className="text-sm font-medium text-ink">{tr('再諗下', 'Look again')}</h2>
          <p className="mt-2 text-sm leading-6 text-ink">{en ? reply.prompt.en : reply.prompt.zh}</p>
          <h3 className="mt-4 text-sm font-medium text-ink">{tr('兩層先備', 'Two layers back')}</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {reply.prerequisites.map((node) => (
              <li key={node.id}>{en ? node.topic : node.topicZh}</li>
            ))}
          </ul>
          {reply.similar && (
            <p className="mt-4 text-sm leading-6 text-ink">{en ? reply.similar.en : reply.similar.zh}</p>
          )}
          {reply.explainerSrc && (
            <img
              src={reply.explainerSrc}
              alt={tr('另一個例子的圖解，不是本題答案', 'A diagram of a different example, not this item’s answer')}
              width={480}
              height={640}
              className="mt-4 w-full rounded-xl border border-line"
            />
          )}
          {reply.keywordPrompt && (
            <p className="mt-4 text-sm text-ink">{en ? reply.keywordPrompt.en : reply.keywordPrompt.zh}</p>
          )}
        </section>
      )}

      {keywordNote && <p className="mt-4 text-sm text-ink">{keywordNote}</p>}

      {schedule && (
        <section className="mt-4 rounded-2xl border border-line p-5" aria-label={tr('複習時間', 'Review time')}>
          <p className="text-sm text-ink">
            {tr(`約 ${schedule.reviewInDays} 日後再練這一節`, `Practise this node again in about ${schedule.reviewInDays} days`)}
          </p>
          <p className="mt-2 text-xs leading-5 text-ink-muted">
            {tr(
              `穩定度 ${schedule.stability.toFixed(2)}，難度 ${schedule.difficulty.toFixed(2)}，當時可提取性 ${schedule.retrievability.toFixed(2)}，掌握估計 ${schedule.mastery.toFixed(2)}。權重仍用預設。`,
              `Stability ${schedule.stability.toFixed(2)}, difficulty ${schedule.difficulty.toFixed(2)}, retrievability then ${schedule.retrievability.toFixed(2)}, mastery estimate ${schedule.mastery.toFixed(2)}. Weights stay on the default set.`,
            )}
          </p>
        </section>
      )}
    </div>
  )
}
