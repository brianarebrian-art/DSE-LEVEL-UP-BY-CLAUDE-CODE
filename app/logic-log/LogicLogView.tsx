'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil, Check, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import {
  buildLogEntries, currentStreak, isConsecutive, nodeSize, nodeTone, setMoodNote,
  subjectLabel, LOG_WINDOW_DAYS, MOOD_NOTE_MAX, type LogEntry,
} from '@/lib/logicLog'

// 規格書 §模組一「方式 A：時間軸」。方式 B（邏輯地圖）屬 Phase 2，未做。
//
// 大愛紅線（憲章 §7）：整頁不出現任何分數、正確率、等級。足跡記錄的是
// 「今日走過哪裡」，不是「今日考得多好」——一個全部答錯但做完二十題的日子，
// 在這條時間軸上與全對的日子一樣是一個亮起的節點。

const TONE_CLASS = {
  quiet: 'bg-ink-muted/40 border-ink-muted/40',
  cyan: 'bg-accent border-accent',
  pink: 'bg-rose border-rose',
  gold: 'bg-gold border-gold',
} as const

const SIZE_CLASS = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' } as const

function formatDate(date: string, en: boolean): string {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  if (en) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', weekday: 'long' })
  }
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日 · 星期${week}`
}

export default function LogicLogView() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [entries, setEntries] = useState<LogEntry[] | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => { setEntries(buildLogEntries()) }, [])

  const saveNote = (date: string) => {
    setMoodNote(date, draft)
    setEntries(buildLogEntries())
    setEditing(null)
  }

  if (entries === null) {
    return <main className="min-h-screen px-4 py-12"><div className="max-w-2xl mx-auto h-64 rounded-2xl bg-surface-raised animate-pulse" /></main>
  }

  const streak = currentStreak(entries)

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 min-h-11">
          <ArrowLeft className="w-4 h-4" />
          {en ? 'Back to progress' : '返回我的進度'}
        </Link>

        <h1 className="scatter-title text-3xl sm:text-4xl font-medium mb-2 text-ink">
          {en ? 'Study trail' : '溫習足跡'}
        </h1>
        <p className="text-ink-muted mb-8">
          {en
            ? `The last ${LOG_WINDOW_DAYS} days of where you have been — which subjects, which topics, which traps you named. No scores here.`
            : `最近 ${LOG_WINDOW_DAYS} 日你走過的地方——做過哪些科、碰過哪些課題、認出過哪些陷阱。這裡不記分數。`}
        </p>

        {streak >= 3 && (
          <div className="achievement-pop mb-8 rounded-2xl border border-gold/30 bg-gold/[0.08] px-5 py-4">
            <p className="text-ink font-medium">
              {en ? `${streak} days in a row` : `連續 ${streak} 日有足跡`}
            </p>
            <p className="text-sm text-ink-muted mt-1">
              {en
                ? 'A rest day never removes anything you have already walked.'
                : '休息一日不會取走你已經走過的路。'}
            </p>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface-raised p-8 text-center">
            <p className="text-ink mb-2">{en ? 'No trail yet' : '仲未有足跡'}</p>
            <p className="text-sm text-ink-muted mb-6">
              {en
                ? 'Finish one practice session and the first marker appears here — even a single question counts.'
                : '做完一節練習，第一個節點就會出現——就算只做一題都算。'}
            </p>
            <Link href="/subjects" className="inline-flex items-center min-h-11 px-5 rounded-xl bg-accent-strong text-white font-medium">
              {en ? 'Start practising' : '開始練習'}
            </Link>
          </div>
        ) : (
          <ol className="relative">
            {entries.map((e, i) => {
              const linked = i > 0 && isConsecutive(entries[i - 1].date, e.date)
              return (
                <li key={e.date} className="relative pl-8 pb-8">
                  {/* 連續日子之間的發光連接線（規格書 §模組一）。非連續就不畫，
                      空白本身就是誠實的表達，不用虛線去暗示「你斷了」。 */}
                  {linked && (
                    <span aria-hidden className="absolute left-[7px] -top-8 h-8 w-px bg-gradient-to-b from-transparent to-accent/50" />
                  )}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1.5 rounded-full border ${TONE_CLASS[nodeTone(e)]} ${SIZE_CLASS[nodeSize(e)]}`}
                  />
                  <div className="rounded-2xl border border-line bg-surface-raised p-5">
                    <p className="font-medium text-ink">{formatDate(e.date, en)}</p>
                    <p className="text-sm text-ink-muted mt-1">
                      {en
                        ? `${e.questionsCount} questions · ${e.sessions} session${e.sessions === 1 ? '' : 's'} · ${e.timeMinutes} min`
                        : `${e.questionsCount} 題 · ${e.sessions} 節 · ${e.timeMinutes} 分鐘`}
                    </p>

                    {e.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {e.subjects.map((s) => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent/[0.10] text-accent border border-accent/30">
                            {subjectLabel(s, en)}
                          </span>
                        ))}
                      </div>
                    )}

                    {e.topics.length > 0 && (
                      <p className="text-sm text-ink-muted mt-3">
                        <span className="text-ink">{en ? 'Topics covered: ' : '涉獵課題：'}</span>
                        {e.topics.slice(0, 6).join(en ? ', ' : '、')}
                        {e.topics.length > 6 && (en ? ` and ${e.topics.length - 6} more` : ` 等 ${e.topics.length} 個`)}
                      </p>
                    )}

                    {e.trapsFound.length > 0 && (
                      <p className="text-sm text-ink-muted mt-2">
                        <span className="text-gold">{en ? 'Traps you named: ' : '認出的陷阱：'}</span>
                        {e.trapsFound.slice(0, 4).join(en ? ', ' : '、')}
                      </p>
                    )}

                    {/* 心情備註——足跡上唯一真正儲存的東西（見 lib/logicLog.ts）。 */}
                    <div className="mt-4 pt-4 border-t border-line">
                      {editing === e.date ? (
                        <div className="flex items-start gap-2">
                          <textarea
                            autoFocus
                            value={draft}
                            maxLength={MOOD_NOTE_MAX}
                            onChange={(ev) => setDraft(ev.target.value)}
                            rows={2}
                            aria-label={en ? 'Note for this day' : '這一日的備註'}
                            placeholder={en ? 'e.g. finally got independent events' : '例如：終於搞懂咗獨立事件'}
                            className="flex-1 text-sm rounded-xl border border-line bg-surface-sunken px-3 py-2 text-ink"
                          />
                          <button onClick={() => saveNote(e.date)} aria-label={en ? 'Save note' : '儲存備註'} className="min-h-11 min-w-11 grid place-items-center rounded-xl bg-accent-strong text-white">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditing(null)} aria-label={en ? 'Cancel' : '取消'} className="min-h-11 min-w-11 grid place-items-center rounded-xl border border-line text-ink-muted">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditing(e.date); setDraft(e.moodNote ?? '') }}
                          className="w-full text-left text-sm text-ink-muted hover:text-ink flex items-center gap-2 min-h-11"
                        >
                          <Pencil className="w-3.5 h-3.5 shrink-0" />
                          {e.moodNote ?? (en ? 'Add a note for this day' : '為這一日寫一句')}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </main>
  )
}
