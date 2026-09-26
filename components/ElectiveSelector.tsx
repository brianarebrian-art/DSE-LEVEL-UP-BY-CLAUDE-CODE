'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import {
  ELECTIVES_EVENT,
  hasElectives,
  isCompleteSelection,
  readElectives,
  saveElective,
  strandRule,
  unitRule,
  type ElectiveSelection,
} from '@/lib/electives'

/**
 * The student's saved elective choice for one subject, kept in step across
 * components through ELECTIVES_EVENT. `ready` is false until localStorage has
 * been read, so callers never act on the pre-hydration empty value.
 */
export function useElectiveSelection(subject: string) {
  const [sel, setSel] = useState<ElectiveSelection | undefined>(undefined)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const read = () => {
      setSel(readElectives()[subject])
      setReady(true)
    }
    read()
    window.addEventListener(ELECTIVES_EVENT, read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener(ELECTIVES_EVENT, read)
      window.removeEventListener('storage', read)
    }
  }, [subject])
  return { sel, ready, complete: isCompleteSelection(subject, sel) }
}

type Unit = { id: string; en?: string; zh?: string }
const unitName = (u: Unit, en: boolean) => (en ? u.en || u.zh : u.zh || u.en) ?? u.id

/**
 * Shows the saved choice with a "change" button, and opens a dialog when the
 * subject has electives and nothing has been chosen yet. The dialog cannot be
 * dismissed without an answer, but "not assigned / not sure" is an answer: it
 * is saved and shows every question, so no student is forced to guess.
 */
export default function ElectiveSelector({ subject }: { subject: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const { sel, ready, complete } = useElectiveSelection(subject)
  const [editing, setEditing] = useState(false)

  if (!hasElectives(subject) || !ready) return null
  const open = editing || !complete

  const sr = strandRule(subject)
  const chosenStrand = sr?.units.find((u) => u.id === sel?.strand)
  const ur = unitRule(subject, sel?.strand)
  const chosenUnits = (ur?.units ?? []).filter((u) => sel?.units.includes(u.id))
  const summary = sel?.unassigned
    ? en ? 'Not set — showing every topic' : '未揀 —— 全部課題都會出'
    : [chosenStrand, ...chosenUnits].filter(Boolean).map((u) => unitName(u as Unit, en)).join(en ? ', ' : '、')

  return (
    <>
      {complete && (
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line bg-surface-raised px-4 py-3 text-sm">
          <span className="text-ink-muted">{en ? 'Your electives:' : '你嘅選修：'}</span>
          <span className="text-ink">{summary}</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="ml-auto min-h-11 px-2 text-accent underline underline-offset-4"
          >
            {en ? 'Change' : '更改'}
          </button>
        </div>
      )}
      {open && (
        <ElectiveDialog
          subject={subject}
          initial={sel}
          en={en}
          canCancel={complete}
          onDone={() => setEditing(false)}
        />
      )}
    </>
  )
}

function ElectiveDialog({
  subject,
  initial,
  en,
  canCancel,
  onDone,
}: {
  subject: string
  initial?: ElectiveSelection
  en: boolean
  canCancel: boolean
  onDone: () => void
}) {
  const sr = strandRule(subject)
  const [strand, setStrand] = useState<string | undefined>(initial?.unassigned ? undefined : initial?.strand)
  const [units, setUnits] = useState<string[]>(initial?.unassigned ? [] : initial?.units ?? [])
  const ur = unitRule(subject, strand)
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  const draft: ElectiveSelection = { strand, units: units.filter((id) => ur?.units.some((u) => u.id === id)) }
  const valid = isCompleteSelection(subject, draft)

  const pickStrand = (id: string) => {
    setStrand(id)
    setUnits([])
  }
  const toggleUnit = (id: string) => {
    if (!ur) return
    if (ur.choose === 1) return setUnits([id])
    setUnits((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < ur.choose ? [...cur, id] : cur))
  }
  const save = (sel: ElectiveSelection) => {
    saveElective(subject, sel)
    onDone()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="elective-dialog-title"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface-raised p-6 shadow-lg"
      >
        <h2 id="elective-dialog-title" ref={headingRef} tabIndex={-1} className="text-lg font-medium text-ink outline-none">
          {en ? 'Which electives has your school assigned?' : '你學校幫你揀咗邊個選修單元？'}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {en ? 'Not the ones you would like: the ones your school has already set.' : '唔係你想揀，係學校已經定咗嘅。'}
        </p>

        {sr && (
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-medium text-ink">{en ? 'Strand (choose 1)' : '組別（揀 1 個）'}</legend>
            <div className="grid gap-2">
              {sr.units.map((u) => (
                <label key={u.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2 has-[:checked]:border-accent has-[:checked]:bg-accent/[0.06]">
                  <input type="radio" name="strand" checked={strand === u.id} onChange={() => pickStrand(u.id)} className="accent-accent" />
                  <span className="text-ink">{unitName(u, en)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {ur && (!sr || strand) && (
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-medium text-ink">
              {en ? `Electives (choose ${ur.choose} of ${ur.of})` : `選修單元（${ur.of} 個揀 ${ur.choose} 個）`}
            </legend>
            <div className="grid gap-2">
              {ur.units.map((u) => {
                const checked = units.includes(u.id)
                const full = ur.choose > 1 && !checked && units.length >= ur.choose
                return (
                  <label
                    key={u.id}
                    className={`flex min-h-11 items-center gap-3 rounded-xl border border-line px-3 py-2 has-[:checked]:border-accent has-[:checked]:bg-accent/[0.06] ${full ? 'opacity-50' : 'cursor-pointer'}`}
                  >
                    <input
                      type={ur.choose === 1 ? 'radio' : 'checkbox'}
                      name="elective-unit"
                      checked={checked}
                      disabled={full}
                      onChange={() => toggleUnit(u.id)}
                      className="accent-accent"
                    />
                    <span className="text-ink">{unitName(u, en)}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-6 grid gap-2">
          <button
            type="button"
            disabled={!valid}
            onClick={() => save(draft)}
            className="min-h-11 rounded-xl bg-accent-strong px-4 font-medium text-on-accent transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {en ? 'Save' : '確定'}
          </button>
          <button
            type="button"
            onClick={() => save({ unassigned: true, units: [] })}
            className="min-h-11 rounded-xl border border-line-strong bg-surface-raised px-4 text-ink-soft transition-all hover:bg-surface-sunken"
          >
            {en ? 'Not assigned yet / not sure (show every topic)' : '學校未分／我唔知（全部課題都出）'}
          </button>
          {canCancel && (
            <button type="button" onClick={onDone} className="min-h-11 px-4 text-sm text-ink-muted underline underline-offset-4">
              {en ? 'Cancel' : '取消'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
