'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { subjects } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'
import type { Locale } from '@/lib/dictionary'

type Role = 'admin' | 'teacher' | 'subject_editor' | 'volunteer'
type Decision = 'pending' | 'approve_with_revision' | 'approve' | 'reject' | 'withdraw'
type CheckValue = string | null
type Bilingual = { zh: string; en: string }
interface Reviewer { name: string; role: Role }
interface Review {
  id: string; question_id: string; subject_slug: string; topic_label: string | null; question_type: string
  difficulty_label: string | null; marks: number | null; curriculum_code: string | null
  assessment_objective: string | null; cognitive_level: string | null; command_word_fit: CheckValue
  question_type_fit: CheckValue; syllabus_alignment: CheckValue; factual_accuracy: CheckValue
  answer_key_accuracy: CheckValue; marking_scheme_quality: CheckValue; language_format_quality: CheckValue
  difficulty_alignment: CheckValue; copyright_risk: CheckValue; empirical_calibration: CheckValue
  score_syllabus: number | null; score_assessment: number | null; score_answer: number | null
  score_language: number | null; score_difficulty: number | null; score_evidence: number | null
  total_score: number; review_stage: string; decision: Decision; reviewer_role: Role | null
  reviewer_name: string | null; reviewed_at: string | null; notes: string | null; updated_at: string
  ai_findings: { machine_checks_only?: boolean } | null
}
interface Question {
  id: string; subject: string; topic: string; type: string; difficulty: string; content: string; contentEn: string
  options: string[]; optionsEn: string[]; correctIndex: number | null; explanation: string; explanationEn: string
  referenceAnswer: string; referenceAnswerEn: string; markingScheme: string; markingSchemeEn: string
  marks: number | null; year: number | null; framework: string
}
interface Row { review: Review; question: Question | null }
interface Payload { rows: Row[]; count: number; limit: number; offset: number; summary: Record<string, number | Array<{ subject_slug: string; subject_name_zh: string }>>; reviewer: Reviewer }

const SCORE_FIELDS = ['score_syllabus', 'score_assessment', 'score_answer', 'score_language', 'score_difficulty', 'score_evidence'] as const
const CHECK_FIELDS = [
  ['syllabus_alignment', ['unverified', 'pass', 'borderline', 'fail']],
  ['factual_accuracy', ['unverified', 'pass', 'borderline', 'fail']],
  ['answer_key_accuracy', ['unverified', 'pass', 'borderline', 'fail']],
  ['marking_scheme_quality', ['unverified', 'pass', 'borderline', 'fail', 'not_applicable']],
  ['language_format_quality', ['unverified', 'pass', 'borderline', 'fail']],
  ['difficulty_alignment', ['unverified', 'pass', 'borderline', 'fail']],
  ['copyright_risk', ['unverified', 'clear', 'needs_review', 'high_risk']],
  ['empirical_calibration', ['not_started', 'insufficient_sample', 'in_range', 'out_of_range']],
] as const

type ScoreKey = typeof SCORE_FIELDS[number]
type CheckKey = typeof CHECK_FIELDS[number][0]

const SCORE_COPY: Record<ScoreKey, { label: Bilingual; help: Bilingual }> = {
  score_syllabus: { label: { zh: '課綱對應', en: 'Syllabus alignment' }, help: { zh: '能否指向現行課程指引／評核大綱的具體單元', en: 'Can it point to a specific unit in the current curriculum or assessment guide?' } },
  score_assessment: { label: { zh: '評核接軌', en: 'Assessment fit' }, help: { zh: '題型、卷別、指令詞、分值及認知要求', en: 'Question type, paper, command word, marks and cognitive demand.' } },
  score_answer: { label: { zh: '答案及評分準則', en: 'Answer and marking criteria' }, help: { zh: '答案唯一性、計算、逐分評分點及可接受答案', en: 'Answer uniqueness, calculations, mark-by-mark points and acceptable answers.' } },
  score_language: { label: { zh: '語言與格式', en: 'Language and format' }, help: { zh: '雙語等值、歧義、圖表、單位及作答空間', en: 'Bilingual equivalence, ambiguity, diagrams, units and answer space.' } },
  score_difficulty: { label: { zh: '難度與認知層級', en: 'Difficulty and cognitive level' }, help: { zh: '推理鏈、資料量、陷阱密度及建議時間', en: 'Reasoning chain, data volume, trap density and suggested time.' } },
  score_evidence: { label: { zh: '證據可審計性', en: 'Auditability of evidence' }, help: { zh: '來源版本、頁碼、角色、日期及修訂紀錄', en: 'Source version, page, role, date and revision record.' } },
}
const CHECK_COPY: Record<CheckKey, Bilingual> = {
  syllabus_alignment: { zh: '課綱對應', en: 'Syllabus alignment' },
  factual_accuracy: { zh: '事實／計算', en: 'Facts / calculations' },
  answer_key_accuracy: { zh: '答案鍵', en: 'Answer key' },
  marking_scheme_quality: { zh: '評分準則', en: 'Marking criteria' },
  language_format_quality: { zh: '語言／格式', en: 'Language / format' },
  difficulty_alignment: { zh: '難度校準', en: 'Difficulty calibration' },
  copyright_risk: { zh: '版權風險', en: 'Copyright risk' },
  empirical_calibration: { zh: '實測校準', en: 'Empirical calibration' },
}
const CHECK_VALUE_COPY: Record<string, Bilingual> = {
  unverified: { zh: '未核實', en: 'Unverified' }, pass: { zh: '通過', en: 'Pass' }, borderline: { zh: '待商榷', en: 'Borderline' }, fail: { zh: '未通過', en: 'Fail' }, not_applicable: { zh: '不適用', en: 'Not applicable' }, clear: { zh: '無風險', en: 'Clear' }, needs_review: { zh: '需要覆核', en: 'Needs review' }, high_risk: { zh: '高風險', en: 'High risk' }, not_started: { zh: '未開始', en: 'Not started' }, insufficient_sample: { zh: '樣本不足', en: 'Insufficient sample' }, in_range: { zh: '在範圍內', en: 'In range' }, out_of_range: { zh: '超出範圍', en: 'Out of range' },
}
const ROLE_COPY: Record<Role, Bilingual> = {
  admin: { zh: '管理員', en: 'Administrator' }, teacher: { zh: '教師', en: 'Teacher' }, subject_editor: { zh: '科目編輯', en: 'Subject editor' }, volunteer: { zh: '義工', en: 'Volunteer' },
}
const STAGE_COPY: Record<string, Bilingual> = {
  queued: { zh: '待處理', en: 'Queued' }, ai_precheck: { zh: 'AI／義工初審', en: 'AI / volunteer pre-check' }, human_review: { zh: '人工覆核', en: 'Human review' }, second_review: { zh: '第二覆核', en: 'Second review' }, pilot_calibration: { zh: '實測校準', en: 'Pilot calibration' }, approved: { zh: '已通過', en: 'Approved' }, revision_required: { zh: '需修訂', en: 'Revision required' }, withdrawn: { zh: '已收起', en: 'Withdrawn' },
}

const tr = (locale: Locale, zh: string, en: string) => locale === 'en' ? en : zh
const localized = (locale: Locale, copy: Bilingual) => tr(locale, copy.zh, copy.en)
const stageLabel = (stage: string, locale: Locale) => STAGE_COPY[stage] ? localized(locale, STAGE_COPY[stage]) : stage
const checkValueLabel = (value: string, locale: Locale) => CHECK_VALUE_COPY[value] ? localized(locale, CHECK_VALUE_COPY[value]) : value
const subjectName = (slug: string, locale: Locale) => {
  const subject = subjects.find((item) => item.id === slug || item.name === slug || item.nameEn === slug)
  return subject ? tr(locale, subject.name, subject.nameEn) : slug
}
const display = (value: string | null | undefined, locale: Locale) => value || tr(locale, '未填寫', 'Not provided')
const blankChecks = Object.fromEntries(CHECK_FIELDS.map(([key]) => [key, key === 'empirical_calibration' ? 'not_started' : 'unverified'])) as Record<string, string>

export default function QualityReviewClient({ initialReviewer }: { initialReviewer: Reviewer }) {
  const { locale } = useLocale()
  const [payload, setPayload] = useState<Payload | null>(null)
  const [subject, setSubject] = useState('')
  const [stage, setStage] = useState('queued')
  const [offset, setOffset] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const reviewer = payload?.reviewer ?? initialReviewer

  const load = useCallback(async (nextOffset = offset) => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams({ stage, limit: '12', offset: String(nextOffset) })
      if (subject) params.set('subject', subject)
      const res = await fetch(`/api/admin/quality?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const next = await res.json() as Payload
      setPayload(next); setOffset(nextOffset)
      setSelectedId((current) => current && next.rows.some((row) => row.review.id === current) ? current : next.rows[0]?.review.id ?? null)
    } catch { setError(tr(locale, '未能載入審核隊列，請檢查登入狀態或 Supabase 連線。', 'Unable to load the review queue. Check your sign-in status or Supabase connection.')) }
    finally { setLoading(false) }
  }, [locale, offset, stage, subject])

  useEffect(() => { void load(0) }, [load])

  const selected = useMemo(() => payload?.rows.find((row) => row.review.id === selectedId) ?? null, [payload, selectedId])
  useEffect(() => {
    if (!selected) return
    const r = selected.review
    setForm({
      scores: Object.fromEntries(SCORE_FIELDS.map((key) => [key, r[key] ?? null])),
      checks: Object.fromEntries(CHECK_FIELDS.map(([key]) => [key, r[key] ?? blankChecks[key]])),
      mapping: { curriculum_code: r.curriculum_code ?? '', assessment_objective: r.assessment_objective ?? '', cognitive_level: r.cognitive_level ?? '' },
      notes: r.notes ?? '',
    })
    setMessage('')
  }, [selected])

  const scores = (form.scores ?? {}) as Record<string, number | null>
  const checks = (form.checks ?? {}) as Record<string, string>
  const mapping = (form.mapping ?? {}) as Record<string, string>
  const total = SCORE_FIELDS.reduce((sum, key) => sum + (Number(scores[key]) || 0), 0)
  const setNested = (group: 'scores' | 'checks' | 'mapping', key: string, value: unknown) => setForm((current) => ({ ...current, [group]: { ...(current[group] as Record<string, unknown> ?? {}), [key]: value } }))
  const selectRow = (id: string) => { setSelectedId(id); setMessage('') }

  async function save(decision: Decision) {
    if (!selected || saving) return
    if (decision === 'approve' && reviewer.role === 'volunteer') return
    setSaving(true); setError(''); setMessage('')
    try {
      const res = await fetch('/api/admin/quality', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewId: selected.review.id, questionId: selected.review.question_id, decision, scores, checks, mapping, notes: form.notes ?? '', evidenceUrls: [] }) })
      const body = await res.json() as { error?: string; blocked?: string[] }
      if (!res.ok) {
        if (body.error === 'hard_gate_failed') throw new Error(tr(locale, `未能通過硬性閘門：${body.blocked?.map((key) => CHECK_COPY[key as CheckKey] ? localized(locale, CHECK_COPY[key as CheckKey]) : key).join('、') ?? '請補充資料'}`, `Required checks have not passed: ${body.blocked?.map((key) => CHECK_COPY[key as CheckKey] ? localized(locale, CHECK_COPY[key as CheckKey]) : key).join(', ') ?? 'provide the required information'}`))
        if (body.error === 'teacher_required') throw new Error(tr(locale, '只有教師、科目編輯或管理員可以標記通過。', 'Only teachers, subject editors or administrators can mark a question as approved.'))
        throw new Error(tr(locale, '儲存失敗，請稍後再試。', 'Save failed. Please try again later.'))
      }
      setMessage(decision === 'approve' ? tr(locale, '已記錄為「已通過」。題目仍須按既有發布流程入庫。', 'Recorded as “Approved”. The question must still follow the existing publication process.') : decision === 'approve_with_revision' ? tr(locale, '已記錄為「需要修訂」。', 'Recorded as “Revision required”.') : tr(locale, '覆核資料已儲存。', 'Review details saved.'))
      await load(offset)
    } catch (e) { setError(e instanceof Error ? e.message : tr(locale, '儲存失敗。', 'Save failed.')) }
    finally { setSaving(false) }
  }

  const pageEnd = Math.min(offset + (payload?.limit ?? 12), payload?.count ?? 0)
  const canApprove = reviewer.role !== 'volunteer'
  return (
    <section className="min-h-screen bg-surface text-ink-soft">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-b border-line pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tr(locale, '質素覆核 / DSE LEVEL UP', 'QUALITY CONTROL / DSE LEVEL UP')}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{tr(locale, '逐題質素覆核工作台', 'Question-by-question quality review')}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{tr(locale, '每一個分數都留下證據。AI／義工可先標記問題；只有合資格人工覆核者可以通過題目。', 'Every score leaves evidence. AI or volunteers can flag issues first; only qualified human reviewers can approve a question.')}</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-raised px-4 py-3 text-sm shadow-sm">
              <div className="font-medium text-ink">{reviewer.name}</div>
              <div className="mt-1 text-xs text-ink-muted">{localized(locale, ROLE_COPY[reviewer.role])} · {reviewer.role === 'volunteer' ? tr(locale, '不可直接通過', 'Cannot approve directly') : tr(locale, '可執行人工覆核', 'May conduct human review')}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label={tr(locale, '目前頁面', 'Current page')} value={payload ? `${offset + 1}–${pageEnd}` : '—'} />
            <Stat label={tr(locale, '符合篩選', 'Matching filter')} value={payload?.count?.toLocaleString() ?? '—'} />
            <Stat label={tr(locale, '待處理總數', 'Total queued')} value={Number(payload?.summary?.queued ?? 0).toLocaleString()} tone="text-gold-strong" />
            <Stat label={tr(locale, '已通過', 'Approved')} value={Number(payload?.summary?.approved ?? 0).toLocaleString()} tone="text-accent" />
          </div>
        </header>

        <section className="sticky top-0 z-10 -mx-4 mt-5 border-y border-line bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="quality-subject">{tr(locale, '科目', 'Subject')}</label>
            <select id="quality-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink">
              <option value="">{tr(locale, '全部科目', 'All subjects')}</option>
              {Array.isArray(payload?.summary?.subjects) && payload.summary.subjects.map((item) => <option key={item.subject_slug} value={item.subject_slug}>{subjectName(item.subject_slug, locale)}</option>)}
            </select>
            <label className="sr-only" htmlFor="quality-stage">{tr(locale, '審核狀態', 'Review status')}</label>
            <select id="quality-stage" value={stage} onChange={(e) => setStage(e.target.value)} className="rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink">
              <option value="">{tr(locale, '全部狀態', 'All statuses')}</option>
              {Object.keys(STAGE_COPY).map((key) => <option key={key} value={key}>{stageLabel(key, locale)}</option>)}
            </select>
            <button type="button" onClick={() => void load(0)} className="rounded-lg border border-line-strong px-3 py-2 text-sm text-ink hover:bg-surface-sunken">{tr(locale, '重新整理', 'Refresh')}</button>
            <span className="ml-auto text-xs text-ink-muted">{tr(locale, '一頁 12 題 · 只顯示已獲授權的審核資料', '12 questions per page · only authorised review data is shown')}</span>
          </div>
        </section>

        {(error || message) && <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose/30 bg-rose/5 text-rose-strong' : 'border-accent/30 bg-accent/5 text-accent'}`}>{error || message}</div>}

        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-line bg-surface-raised p-3 shadow-sm">
            <div className="flex items-center justify-between px-2 pb-3"><h2 className="font-semibold text-ink">{tr(locale, '審核隊列', 'Review queue')}</h2><span className="text-xs text-ink-muted">{loading ? tr(locale, '載入中', 'Loading') : tr(locale, `${payload?.rows.length ?? 0} 題`, `${payload?.rows.length ?? 0} questions`)}</span></div>
            <div className="space-y-2">
              {!loading && !payload?.rows.length && <p className="rounded-xl bg-surface-sunken p-4 text-sm text-ink-muted">{tr(locale, '這個篩選暫時沒有題目。', 'There are currently no questions for this filter.')}</p>}
              {payload?.rows.map((row) => <QueueItem key={row.review.id} row={row} selected={row.review.id === selectedId} onClick={() => selectRow(row.review.id)} locale={locale} />)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3"><button type="button" disabled={offset === 0 || loading} onClick={() => void load(Math.max(0, offset - (payload?.limit ?? 12)))} className="rounded-lg border border-line-strong px-3 py-2 text-xs disabled:opacity-40">{tr(locale, '上一頁', 'Previous')}</button><span className="text-xs text-ink-muted">{payload?.count ? `${offset + 1} / ${payload.count}` : '—'}</span><button type="button" disabled={pageEnd >= (payload?.count ?? 0) || loading} onClick={() => void load(offset + (payload?.limit ?? 12))} className="rounded-lg border border-line-strong px-3 py-2 text-xs disabled:opacity-40">{tr(locale, '下一頁', 'Next')}</button></div>
          </aside>

          <section className="min-w-0">
            {selected?.question ? <>
              <QuestionPanel row={selected} locale={locale} />
              <div className="mt-5 rounded-2xl border border-line bg-surface-raised p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet">{tr(locale, '評分量表 / 30 分', 'RUBRIC / 30 POINTS')}</p><h2 className="mt-1 text-xl font-semibold text-ink">{tr(locale, '逐項評分', 'Score each criterion')}</h2></div><div className="text-right"><div className="text-3xl font-semibold text-accent">{total}<span className="text-base text-ink-muted"> / 30</span></div><div className="text-xs text-ink-muted">{tr(locale, '24 分以上只是必要條件', '24 points or above is only a necessary condition')}</div></div></div>
                <div className="mt-4 grid gap-3 xl:grid-cols-2">{SCORE_FIELDS.map((key) => <ScoreRow key={key} locale={locale} label={localized(locale, SCORE_COPY[key].label)} help={localized(locale, SCORE_COPY[key].help)} value={scores[key] ?? null} onChange={(value) => setNested('scores', key, value)} />)}</div>
                <div className="mt-6 border-t border-line pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet">{tr(locale, '必要閘門 / 必須核實', 'HARD GATES / REQUIRED CHECKS')}</p><div className="grid gap-3 sm:grid-cols-2">{CHECK_FIELDS.map(([key, options]) => <CheckRow key={key} locale={locale} label={localized(locale, CHECK_COPY[key])} options={options} value={checks[key] ?? ''} onChange={(value) => setNested('checks', key, value)} />)}</div></div>
                <div className="mt-6 border-t border-line pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet">{tr(locale, '課綱映射', 'MAPPING / CURRICULUM')}</p><div className="grid gap-3 sm:grid-cols-3"><Field locale={locale} label={tr(locale, '課綱／課題編號', 'Curriculum / topic code')} value={mapping.curriculum_code ?? ''} onChange={(value) => setNested('mapping', 'curriculum_code', value)} placeholder={tr(locale, '例如：A1.2', 'e.g. A1.2')} /><Field locale={locale} label={tr(locale, '考核目標', 'Assessment objective')} value={mapping.assessment_objective ?? ''} onChange={(value) => setNested('mapping', 'assessment_objective', value)} placeholder={tr(locale, '能力／學習成果', 'Skill / learning outcome')} /><Field locale={locale} label={tr(locale, '認知層級', 'Cognitive level')} value={mapping.cognitive_level ?? ''} onChange={(value) => setNested('mapping', 'cognitive_level', value)} placeholder={tr(locale, '理解／應用／分析', 'Understand / apply / analyse')} /></div></div>
                <div className="mt-6"><label htmlFor="quality-notes" className="mb-2 block text-sm font-medium text-ink">{tr(locale, '覆核備註與修訂建議', 'Review notes and revision recommendations')}</label><textarea id="quality-notes" value={String(form.notes ?? '')} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} rows={4} maxLength={4000} placeholder={tr(locale, '記錄證據位置、常見錯誤、需補充的評分點或下一步。', 'Record evidence locations, common errors, missing marking points or next steps.')} className="w-full rounded-xl border border-line-strong bg-surface px-3 py-3 text-sm leading-6 text-ink outline-none focus:border-accent" /></div>
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5"><button type="button" disabled={saving} onClick={() => void save('pending')} className="rounded-xl bg-accent-strong px-4 py-3 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50">{saving ? tr(locale, '儲存中…', 'Saving…') : tr(locale, '儲存覆核草稿', 'Save review draft')}</button><button type="button" disabled={saving} onClick={() => void save('approve_with_revision')} className="rounded-xl border border-gold/50 px-4 py-3 text-sm font-medium text-gold-strong hover:bg-gold/5 disabled:opacity-50">{tr(locale, '需要修訂', 'Revision required')}</button><button type="button" disabled={saving || !canApprove} onClick={() => void save('approve')} className="rounded-xl border border-accent/50 px-4 py-3 text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-50">{canApprove ? tr(locale, '通過人工覆核', 'Approve human review') : tr(locale, '教師方可通過', 'Teacher approval required')}</button><span className="ml-auto text-xs text-ink-muted">{tr(locale, '目前：', 'Current: ')}{stageLabel(selected.review.review_stage, locale)}</span></div>
              </div>
            </> : <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center text-sm text-ink-muted">{tr(locale, '從左側隊列選擇一題開始。', 'Choose a question from the queue to begin.')}</div>}
          </section>
        </div>
        <footer className="mt-8 border-t border-line pt-4 text-xs leading-5 text-ink-muted">{tr(locale, '本介面只寫入質素評分及覆核紀錄，不會直接修改 live 題庫。`approved` 仍須經既有 pull-decisions → promote → wire → push 流程。', 'This interface records quality scores and review records only; it does not directly change the live question bank. `approved` still follows the existing pull-decisions → promote → wire → push process.')}</footer>
      </div>
    </section>
  )
}

function Stat({ label, value, tone = 'text-ink' }: { label: string; value: string; tone?: string }) { return <div className="rounded-xl border border-line bg-surface-raised px-4 py-3"><div className={`text-xl font-semibold ${tone}`}>{value}</div><div className="mt-1 text-xs text-ink-muted">{label}</div></div> }
function QueueItem({ row, selected, onClick, locale }: { row: Row; selected: boolean; onClick: () => void; locale: Locale }) { const review = row.review; return <button type="button" onClick={onClick} className={`w-full rounded-xl border p-3 text-left transition ${selected ? 'border-accent bg-accent/5' : 'border-line hover:border-accent/40 hover:bg-surface-sunken'}`}><div className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-ink">{review.question_id}</span><span className="shrink-0 rounded-full bg-surface-sunken px-2 py-1 text-[10px] text-ink-muted">{stageLabel(review.review_stage, locale)}</span></div><div className="mt-2 truncate text-xs text-ink-muted">{subjectName(review.subject_slug, locale)} · {display(review.topic_label, locale)}</div><div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted"><span>{review.question_type.toUpperCase()} · {review.difficulty_label ?? tr(locale, '未標', 'Unlabelled')}</span><span>{Number(review.total_score ?? 0)} / 30</span></div></button> }
function QuestionPanel({ row, locale }: { row: Row; locale: Locale }) { const question = row.question!; return <div className="rounded-2xl border border-line bg-surface-raised p-4 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet/10 px-2.5 py-1 text-xs font-semibold text-violet">{subjectName(question.subject, locale)}</span><span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-ink-muted">{question.type.toUpperCase()}</span><span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-ink-muted">{question.difficulty}</span></div><h2 className="mt-3 text-lg font-semibold text-ink">{question.id}</h2><p className="mt-1 text-sm text-ink-muted">{tr(locale, '課題：', 'Topic: ')}{display(row.review.topic_label, locale)} · {tr(locale, '框架：', 'Framework: ')}{display(question.framework, locale)} · {tr(locale, '分值：', 'Marks: ')}{question.marks ?? tr(locale, '未填', 'Not provided')}</p></div><span className="rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-gold-strong">{row.review.ai_findings?.machine_checks_only ? tr(locale, '只完成機器預檢', 'Machine pre-check only') : tr(locale, '人工紀錄可追溯', 'Human record is traceable')}</span></div><div className="mt-5 grid gap-4 xl:grid-cols-2"><TextBlock locale={locale} title={tr(locale, '題目（中文）', 'Question (Chinese)')} text={question.content} /><TextBlock locale={locale} title={tr(locale, '題目（英文）', 'Question (English)')} text={question.contentEn} /></div>{question.options.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{question.options.map((option, index) => <div key={`${question.id}-${index}`} className={`rounded-xl border px-3 py-3 text-sm ${index === question.correctIndex ? 'border-accent/50 bg-accent/5 text-accent' : 'border-line bg-surface'}`}><span className="mr-2 text-xs text-ink-muted">{String.fromCharCode(65 + index)}.</span>{option}{index === question.correctIndex && <span className="ml-2 text-xs font-semibold">{tr(locale, '參考正解', 'Reference answer')}</span>}</div>)}</div>}<details className="mt-5 rounded-xl bg-surface-sunken p-3"><summary className="cursor-pointer text-sm font-medium text-ink">{tr(locale, '展開答案、解析及評分準則', 'Show answer, explanation and marking criteria')}</summary><div className="mt-3 grid gap-4 text-sm leading-6 xl:grid-cols-2"><TextBlock locale={locale} title={tr(locale, '參考答案', 'Reference answer')} text={question.referenceAnswer || question.explanation} /><TextBlock locale={locale} title={tr(locale, '評分準則', 'Marking criteria')} text={question.markingScheme || tr(locale, '未提供，非選擇題請補入逐分評分點。', 'Not provided; please add mark-by-mark criteria for non-MCQ questions.')} /><TextBlock locale={locale} title={tr(locale, '解析', 'Explanation')} text={question.explanation} /><TextBlock locale={locale} title={tr(locale, '答案／解析（英文）', 'Answer / explanation (English)')} text={question.referenceAnswerEn || question.explanationEn} /></div></details></div> }
function TextBlock({ title, text, locale }: { title: string; text: string; locale: Locale }) { return <div><h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</h3><p className="whitespace-pre-wrap text-sm leading-7 text-ink">{text || tr(locale, '未提供', 'Not provided')}</p></div> }
function ScoreRow({ label, help, value, onChange, locale }: { label: string; help: string; value: number | null; onChange: (value: number | null) => void; locale: Locale }) { return <div className="rounded-xl border border-line bg-surface p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-medium text-ink">{label}</div><div className="mt-1 text-xs leading-5 text-ink-muted">{help}</div></div><span className="shrink-0 text-sm font-semibold text-accent">{value ?? '—'} / 5</span></div><div className="mt-3 grid grid-cols-6 gap-1">{[0, 1, 2, 3, 4, 5].map((number) => <button key={number} type="button" aria-label={tr(locale, `${label} ${number} 分`, `${label}: ${number} points`)} onClick={() => onChange(number)} className={`rounded-md py-2 text-xs ${value === number ? 'bg-accent-strong text-on-accent' : 'bg-surface-sunken text-ink-muted hover:bg-accent/10 hover:text-accent'}`}>{number}</button>)}</div><button type="button" onClick={() => onChange(null)} className="mt-2 text-[11px] text-ink-muted underline">{tr(locale, '清除分數', 'Clear score')}</button></div> }
function CheckRow({ label, options, value, onChange, locale }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void; locale: Locale }) { return <label className="block rounded-xl border border-line bg-surface p-3"><span className="mb-2 block text-sm font-medium text-ink">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink"><option value="">{tr(locale, '未填寫', 'Not provided')}</option>{options.map((option) => <option key={option} value={option}>{checkValueLabel(option, locale)}</option>)}</select></label> }
function Field({ label, value, onChange, placeholder }: { locale: Locale; label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="block"><span className="mb-2 block text-xs font-medium text-ink-muted">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent" /></label> }
