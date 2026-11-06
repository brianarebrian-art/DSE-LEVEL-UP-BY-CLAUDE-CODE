'use client'

import { useState } from 'react'
import {
  A11Y_CHOICES,
  A11Y_IDS,
  A11Y_LABEL,
  FEATURE_CHOICES,
  FEATURE_IDS,
  FEATURE_LABEL,
  type A11yChoice,
  type A11yId,
  type FeatureChoice,
  type FeatureId,
  parseGeneralFeedback,
  reflectionCard,
} from '@/lib/generalFeedback'
import { useLocale } from '@/lib/i18n'

const FEATURE_HINT: Record<FeatureId, { zh: string; en: string }> = {
  just_one_card: { zh: '一撳就做一題', en: 'One press, one question' },
  error_analysis: { zh: '答錯之後自己揀嘅錯因', en: 'The cause you pick after a wrong answer' },
  focus_light: { zh: '做題時周邊淡落', en: 'Dims everything around the question' },
  quiet_mode: { zh: '收起分數、段位同計時', en: 'Hides scores, ranks and the timer' },
  emergency_room: { zh: '本站嘅溫習支援，唔係醫院', en: 'Study support on this site, not a hospital' },
  accessibility: { zh: '字級、對比、閱讀尺呢類', en: 'Type size, contrast, reading ruler and the like' },
}

const FEATURE_OPTION: Record<FeatureChoice, { zh: string; en: string }> = {
  not_tried: { zh: '未試過', en: 'Not tried' },
  helped_a_bit: { zh: '有啲幫助', en: 'Helped a bit' },
  very_useful: { zh: '好有用', en: 'Really useful' },
  not_for_me: { zh: '唔啱我', en: 'Not my way' },
}

const A11Y_OPTION: Record<A11yChoice, { zh: string; en: string }> = {
  not_tried: { zh: '未試過', en: 'Not tried' },
  comfortable: { zh: '用得順', en: 'Comfortable' },
  some_friction: { zh: '有啲阻滯', en: 'Some friction' },
  not_for_me: { zh: '唔適用', en: 'Not for me' },
}

const A11Y_QUESTION: Record<A11yId, { zh: string; en: string }> = {
  contrast: { zh: '對比（字同背景）', en: 'Contrast (text and background)' },
  keyboard: { zh: '鍵盤操作', en: 'Keyboard' },
  screen_reader: { zh: '螢幕閱讀器', en: 'Screen reader' },
  reduced_motion: { zh: '減少動態', en: 'Reduced motion' },
}

type Status = 'idle' | 'sending' | 'error'

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function choiceClass(on: boolean): string {
  return `inline-flex min-h-11 items-center justify-center rounded-xl border px-3 text-sm transition-colors motion-reduce:transition-none ${focusRing} ${
    on ? 'border-accent bg-accent/10 text-ink' : 'border-line-strong text-ink-soft hover:border-accent'
  }`
}

export default function FeedbackClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [features, setFeatures] = useState<Partial<Record<FeatureId, FeatureChoice>>>({})
  const [a11y, setA11y] = useState<Partial<Record<A11yId, A11yChoice>>>({})
  const [a11yNote, setA11yNote] = useState('')
  const [hadMoment, setHadMoment] = useState(false)
  const [ahaText, setAhaText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [notice, setNotice] = useState('')
  const [card, setCard] = useState<{ title: string; text: string } | null>(null)
  const [copyNote, setCopyNote] = useState('')

  const tr = (zh: string, english: string) => (en ? english : zh)

  const submit = async () => {
    if (status === 'sending') return
    setNotice('')
    const parsed = parseGeneralFeedback({
      features,
      accessibility: { answers: a11y, note: a11yNote },
      aha: { had_moment: hadMoment, text: ahaText },
      locale: en ? 'en' : 'zh',
    })
    if (!parsed.ok) {
      setStatus('idle')
      setNotice(
        parsed.error === 'too long'
          ? tr('呢句太長，收短少少再送。', 'That note is a bit long. Shorten it, then send again.')
          : parsed.error === 'empty'
            ? tr('可以揀一項，或者寫一句。唔填都可以離開。', 'Pick one thing, or write a sentence. Leaving it blank is fine too.')
            : tr('有一項對唔上，再揀一次就得。', 'One answer did not fit. Pick it again.'),
      )
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback-general', {
        method: 'POST',
        credentials: 'omit',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.value),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (res.ok && data?.ok === true) {
        setCard(reflectionCard(parsed.value, en ? 'en' : 'zh'))
        setStatus('idle')
        return
      }
      setStatus('error')
      setNotice(
        res.status === 503 || data?.error === 'unavailable'
          ? tr('而家收唔到。你寫嘅字仲喺呢度，遲啲可以再試。', 'We could not take it just now. What you wrote is still here. You can try later.')
          : data?.error === 'too long'
            ? tr('呢句太長，收短少少再送。', 'That note is a bit long. Shorten it, then send again.')
            : data?.error === 'empty'
              ? tr('可以揀一項，或者寫一句。唔填都可以離開。', 'Pick one thing, or write a sentence. Leaving it blank is fine too.')
              : tr('傳送唔到。你寫嘅字仲喺呢度，可以再試一次。', 'That did not go through. What you wrote is still here. You can try again.'),
      )
    } catch {
      setStatus('error')
      setNotice(tr('傳送唔到。你寫嘅字仲喺呢度，可以再試一次。', 'That did not go through. What you wrote is still here. You can try again.'))
    }
  }

  const copyCard = async (payload: { title: string; text: string }) => {
    const note = `${payload.title}\n${payload.text}`
    try {
      await navigator.clipboard.writeText(note)
      setCopyNote(tr('抄咗。呢張卡冇分數。', 'Copied. This card has no score.'))
    } catch {
      setCopyNote(tr('抄唔到。你可以自己選取上面嗰句。', 'Could not copy. You can select the sentence above.'))
    }
  }

  const shareCard = async (payload: { title: string; text: string }) => {
    if (typeof navigator.share !== 'function') {
      await copyCard(payload)
      return
    }
    try {
      await navigator.share({ title: payload.title, text: payload.text })
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      setCopyNote(tr('分享唔到。可以改為抄低上面嗰句。', 'Could not share. You can copy the sentence above instead.'))
    }
  }

  if (card) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-sm text-ink-muted">{tr('多謝你講。以下係你自己嘅一句，可以抄或者分享。', 'Thank you for telling us. Here is your own sentence. You can copy or share it.')}</p>
        <article aria-live="polite" className="mt-4 rounded-2xl border border-line bg-surface-raised p-6">
          <p className="text-sm text-ink-muted">{tr('呢張卡冇分數', 'No score on this card')}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink">{card.title}</h1>
          <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-ink-soft">{card.text}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyCard(card)}
              className={`inline-flex min-h-11 items-center rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover motion-reduce:transition-none ${focusRing}`}
            >
              {tr('抄低呢句', 'Copy this note')}
            </button>
            <button
              type="button"
              onClick={() => shareCard(card)}
              className={`inline-flex min-h-11 items-center rounded-xl border border-line-strong px-4 text-sm text-ink-soft transition-colors hover:border-accent motion-reduce:transition-none ${focusRing}`}
            >
              {tr('分享呢句', 'Share this note')}
            </button>
          </div>
          {copyNote && (
            <p role="status" className="mt-3 text-sm text-ink-muted">
              {copyNote}
            </p>
          )}
          <p className="mt-4 text-sm text-ink-muted">{tr('可以關閉呢頁。', 'You can close this page.')}</p>
        </article>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{tr('匿名意見', 'Anonymous feedback')}</h1>
        <p className="mt-3 text-base leading-7 text-ink-soft">
          {tr(
            '呢頁可以唔填。我哋唔會記低你嘅帳戶、電郵或者 IP。冇分數，亦唔會催你交。',
            'This page is optional. We do not keep your account, email or IP. There is no score, and nothing hurries you to send it.',
          )}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {tr('慢慢揀就得，冇快慢之分。', 'Take your time. There is no pace to keep.')}
        </p>
      </header>

      <form
        className="space-y-10"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <section aria-labelledby="features-heading" className="space-y-6">
          <div>
            <h2 id="features-heading" className="text-lg font-medium text-ink">
              {tr('邊啲功能對你有用', 'Which parts helped')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              {tr('每項都可以唔揀。揀咗再撳一次就取消。', 'You can skip any of these. Press a choice again to clear it.')}
            </p>
          </div>
          {FEATURE_IDS.map((id) => (
            <fieldset key={id} disabled={status === 'sending'} className="min-w-0">
              <legend className="text-sm text-ink">
                {FEATURE_LABEL[id][en ? 'en' : 'zh']}
                <span className="mt-0.5 block text-xs text-ink-muted">{FEATURE_HINT[id][en ? 'en' : 'zh']}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {FEATURE_CHOICES.map((choice) => {
                  const on = features[id] === choice
                  return (
                    <button
                      key={choice}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFeatures((prev) => ({ ...prev, [id]: prev[id] === choice ? undefined : choice }))}
                      className={choiceClass(on)}
                    >
                      {FEATURE_OPTION[choice][en ? 'en' : 'zh']}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </section>

        <section aria-labelledby="a11y-heading" className="space-y-6 rounded-2xl border border-line bg-surface-sunken/60 p-4 sm:p-5">
          <div>
            <h2 id="a11y-heading" className="text-lg font-medium text-ink">
              {tr('無障礙', 'Accessibility')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              {tr('呢部分同上面分開。用唔到嘅項目，揀「唔適用」或者留空都得。', 'This part is separate. If something does not apply, pick “Not for me” or leave it blank.')}
            </p>
          </div>
          {A11Y_IDS.map((id) => (
            <fieldset key={id} disabled={status === 'sending'} className="min-w-0">
              <legend className="text-sm text-ink">{A11Y_QUESTION[id][en ? 'en' : 'zh']}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {A11Y_CHOICES.map((choice) => {
                  const on = a11y[id] === choice
                  return (
                    <button
                      key={choice}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setA11y((prev) => ({ ...prev, [id]: prev[id] === choice ? undefined : choice }))}
                      className={choiceClass(on)}
                    >
                      {A11Y_OPTION[choice][en ? 'en' : 'zh']}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
          <label className="block text-sm text-ink">
            {tr('想補充一句（可以留空）', 'Add a sentence (optional)')}
            <textarea
              value={a11yNote}
              maxLength={400}
              disabled={status === 'sending'}
              onChange={(event) => setA11yNote(event.target.value)}
              rows={3}
              autoComplete="off"
              className={`mt-2 w-full rounded-xl border border-line-strong bg-surface-raised px-3 py-2 text-base leading-7 text-ink ${focusRing}`}
            />
          </label>
        </section>

        <section aria-labelledby="aha-heading" className="space-y-3">
          <h2 id="aha-heading" className="text-lg font-medium text-ink">
            {tr('原來係咁', 'Oh, so that’s how')}
          </h2>
          <p className="text-sm leading-6 text-ink-muted">
            {tr('如果有個瞬間令你明白多咗少少，可以講。冇都完全冇問題。', 'If a moment made something click, you can say so. Nothing is wrong if there was not one.')}
          </p>
          <button
            type="button"
            aria-pressed={hadMoment}
            disabled={status === 'sending'}
            onClick={() => setHadMoment((value) => !value)}
            className={choiceClass(hadMoment)}
          >
            {tr('有過原來係咁嘅瞬間', 'I have had an “oh, so that’s how” moment')}
          </button>
          <label className="block text-sm text-ink">
            {tr('如果想講，可以寫低嗰一下（可以留空）', 'If you want to, write that moment (optional)')}
            <textarea
              value={ahaText}
              maxLength={400}
              disabled={status === 'sending'}
              onChange={(event) => setAhaText(event.target.value)}
              rows={4}
              autoComplete="off"
              className={`mt-2 w-full rounded-xl border border-line-strong bg-surface-raised px-3 py-2 text-base leading-7 text-ink ${focusRing}`}
            />
          </label>
        </section>

        <div>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={status === 'sending'}
            className={`inline-flex min-h-11 items-center rounded-xl bg-accent-strong px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-default disabled:opacity-70 motion-reduce:transition-none ${focusRing}`}
          >
            {status === 'sending' ? tr('送出緊', 'Sending') : tr('送出意見', 'Send feedback')}
          </button>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm leading-6 text-ink-muted">
            {notice}
          </p>
        </div>
      </form>
    </div>
  )
}

