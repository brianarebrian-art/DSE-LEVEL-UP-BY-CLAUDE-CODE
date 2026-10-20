'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Role = 'admin' | 'teacher' | 'subject_editor' | 'volunteer'
type Decision = 'pending' | 'approve_with_revision' | 'approve' | 'reject' | 'withdraw'
type CheckValue = string | null
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

const SCORE_FIELDS = [
  ['score_syllabus', '課綱對應', '能否指向現行課程指引／評核大綱的具體單元'],
  ['score_assessment', '評核接軌', '題型、卷別、指令詞、分值及認知要求'],
  ['score_answer', '答案及評分準則', '答案唯一性、計算、逐分評分點及可接受答案'],
  ['score_language', '語言與格式', '雙語等值、歧義、圖表、單位及作答空間'],
  ['score_difficulty', '難度與認知層級', '推理鏈、資料量、陷阱密度及建議時間'],
  ['score_evidence', '證據可審計性', '來源版本、頁碼、角色、日期及修訂紀錄'],
] as const
const CHECK_FIELDS = [
  ['syllabus_alignment', '課綱對應', ['unverified', 'pass', 'borderline', 'fail']],
  ['factual_accuracy', '事實／計算', ['unverified', 'pass', 'borderline', 'fail']],
  ['answer_key_accuracy', '答案鍵', ['unverified', 'pass', 'borderline', 'fail']],
  ['marking_scheme_quality', '評分準則', ['unverified', 'pass', 'borderline', 'fail', 'not_applicable']],
  ['language_format_quality', '語言／格式', ['unverified', 'pass', 'borderline', 'fail']],
  ['difficulty_alignment', '難度校準', ['unverified', 'pass', 'borderline', 'fail']],
  ['copyright_risk', '版權風險', ['unverified', 'clear', 'needs_review', 'high_risk']],
  ['empirical_calibration', '實測校準', ['not_started', 'insufficient_sample', 'in_range', 'out_of_range']],
] as const
const roleLabel: Record<Role, string> = { admin: '管理員', teacher: '教師', subject_editor: '科目編輯', volunteer: '義工' }
const stageLabel: Record<string, string> = { queued: '待處理', ai_precheck: 'AI／義工初審', human_review: '人工覆核', second_review: '第二覆核', pilot_calibration: '實測校準', approved: '已通過', revision_required: '需修訂', withdrawn: '已收起' }
const subjectName = (payload: Payload | null, slug: string) => {
  const subjects = payload?.summary?.subjects
  return Array.isArray(subjects) ? subjects.find((s) => s.subject_slug === slug)?.subject_name_zh ?? slug : slug
}
const display = (value: string | null | undefined) => value || '未填寫'
const blankChecks = Object.fromEntries(CHECK_FIELDS.map(([key]) => [key, key === 'empirical_calibration' ? 'not_started' : 'unverified'])) as Record<string, string>

export default function QualityReviewClient({ initialReviewer }: { initialReviewer: Reviewer }) {
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
    } catch { setError('未能載入審核隊列，請檢查登入狀態或 Supabase 連線。') }
    finally { setLoading(false) }
  }, [offset, stage, subject])

  useEffect(() => { void load(0) }, [load])

  const selected = useMemo(() => payload?.rows.find((row) => row.review.id === selectedId) ?? null, [payload, selectedId])
  useEffect(() => {
    if (!selected) return
    const r = selected.review
    setForm({
      scores: Object.fromEntries(SCORE_FIELDS.map(([key]) => [key, r[key] ?? null])),
      checks: Object.fromEntries(CHECK_FIELDS.map(([key]) => [key, r[key] ?? blankChecks[key]])),
      mapping: { curriculum_code: r.curriculum_code ?? '', assessment_objective: r.assessment_objective ?? '', cognitive_level: r.cognitive_level ?? '' },
      notes: r.notes ?? '',
    })
    setMessage('')
  }, [selected])

  const scores = (form.scores ?? {}) as Record<string, number | null>
  const checks = (form.checks ?? {}) as Record<string, string>
  const mapping = (form.mapping ?? {}) as Record<string, string>
  const total = SCORE_FIELDS.reduce((sum, [key]) => sum + (Number(scores[key]) || 0), 0)
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
        if (body.error === 'hard_gate_failed') throw new Error(`未能通過硬性閘門：${body.blocked?.join('、') ?? '請補充資料'}`)
        if (body.error === 'teacher_required') throw new Error('只有教師、科目編輯或管理員可以標記通過。')
        throw new Error('儲存失敗，請稍後再試。')
      }
      setMessage(decision === 'approve' ? '已記錄為「已通過」。題目仍須按既有發布流程入庫。' : decision === 'approve_with_revision' ? '已記錄為「需要修訂」。' : '覆核資料已儲存。')
      await load(offset)
    } catch (e) { setError(e instanceof Error ? e.message : '儲存失敗。') }
    finally { setSaving(false) }
  }

  const pageEnd = Math.min(offset + (payload?.limit ?? 12), payload?.count ?? 0)
  const canApprove = reviewer.role !== 'volunteer'
  return (
    <main className="min-h-screen bg-surface text-ink-soft">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-b border-line pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">QUALITY CONTROL / DSE LEVEL UP</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">逐題質素覆核工作台</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">每一個分數都留下證據。AI／義工可先標記問題；只有合資格人工覆核者可以通過題目。</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-raised px-4 py-3 text-sm shadow-sm">
              <div className="font-medium text-ink">{reviewer.name}</div>
              <div className="mt-1 text-xs text-ink-muted">{roleLabel[reviewer.role]} · {reviewer.role === 'volunteer' ? '不可直接通過' : '可執行人工覆核'}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="目前頁面" value={payload ? `${offset + 1}–${pageEnd}` : '—'} />
            <Stat label="符合篩選" value={payload?.count?.toLocaleString() ?? '—'} />
            <Stat label="待處理總數" value={Number(payload?.summary?.queued ?? 0).toLocaleString()} tone="text-gold-strong" />
            <Stat label="已通過" value={Number(payload?.summary?.approved ?? 0).toLocaleString()} tone="text-accent" />
          </div>
        </header>

        <section className="sticky top-0 z-10 -mx-4 mt-5 border-y border-line bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="quality-subject">科目</label>
            <select id="quality-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink">
              <option value="">全部科目</option>
              {Array.isArray(payload?.summary?.subjects) && payload.summary.subjects.map((s) => <option key={s.subject_slug} value={s.subject_slug}>{s.subject_name_zh}</option>)}
            </select>
            <label className="sr-only" htmlFor="quality-stage">審核狀態</label>
            <select id="quality-stage" value={stage} onChange={(e) => setStage(e.target.value)} className="rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink">
              <option value="">全部狀態</option>
              {Object.entries(stageLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <button type="button" onClick={() => void load(0)} className="rounded-lg border border-line-strong px-3 py-2 text-sm text-ink hover:bg-surface-sunken">重新整理</button>
            <span className="ml-auto text-xs text-ink-muted">一頁 12 題 · 只顯示已獲授權的審核資料</span>
          </div>
        </section>

        {(error || message) && <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose/30 bg-rose/5 text-rose-strong' : 'border-accent/30 bg-accent/5 text-accent'}`}>{error || message}</div>}

        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-line bg-surface-raised p-3 shadow-sm">
            <div className="flex items-center justify-between px-2 pb-3"><h2 className="font-semibold text-ink">審核隊列</h2><span className="text-xs text-ink-muted">{loading ? '載入中' : `${payload?.rows.length ?? 0} 題`}</span></div>
            <div className="space-y-2">
              {!loading && !payload?.rows.length && <p className="rounded-xl bg-surface-sunken p-4 text-sm text-ink-muted">這個篩選暫時沒有題目。</p>}
              {payload?.rows.map((row) => <QueueItem key={row.review.id} row={row} selected={row.review.id === selectedId} onClick={() => selectRow(row.review.id)} />)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3"><button type="button" disabled={offset === 0 || loading} onClick={() => void load(Math.max(0, offset - (payload?.limit ?? 12)))} className="rounded-lg border border-line-strong px-3 py-2 text-xs disabled:opacity-40">上一頁</button><span className="text-xs text-ink-muted">{payload?.count ? `${offset + 1} / ${payload.count}` : '—'}</span><button type="button" disabled={pageEnd >= (payload?.count ?? 0) || loading} onClick={() => void load(offset + (payload?.limit ?? 12))} className="rounded-lg border border-line-strong px-3 py-2 text-xs disabled:opacity-40">下一頁</button></div>
          </aside>

          <section className="min-w-0">
            {selected?.question ? <>
              <QuestionPanel row={selected} />
              <div className="mt-5 rounded-2xl border border-line bg-surface-raised p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet">RUBRIC / 30 POINTS</p><h2 className="mt-1 text-xl font-semibold text-ink">逐項評分</h2></div><div className="text-right"><div className="text-3xl font-semibold text-accent">{total}<span className="text-base text-ink-muted"> / 30</span></div><div className="text-xs text-ink-muted">24 分以上只是必要條件</div></div></div>
                <div className="mt-4 grid gap-3 xl:grid-cols-2">{SCORE_FIELDS.map(([key, label, help]) => <ScoreRow key={key} label={label} help={help} value={scores[key] ?? null} onChange={(value) => setNested('scores', key, value)} />)}</div>
                <div className="mt-6 border-t border-line pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet">HARD GATES / 必須核實</p><div className="grid gap-3 sm:grid-cols-2">{CHECK_FIELDS.map(([key, label, options]) => <CheckRow key={key} label={label} options={options} value={checks[key] ?? ''} onChange={(value) => setNested('checks', key, value)} />)}</div></div>
                <div className="mt-6 border-t border-line pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet">MAPPING / 課綱映射</p><div className="grid gap-3 sm:grid-cols-3"><Field label="課綱／課題編號" value={mapping.curriculum_code ?? ''} onChange={(v) => setNested('mapping', 'curriculum_code', v)} placeholder="例如：A1.2" /><Field label="考核目標" value={mapping.assessment_objective ?? ''} onChange={(v) => setNested('mapping', 'assessment_objective', v)} placeholder="能力／學習成果" /><Field label="認知層級" value={mapping.cognitive_level ?? ''} onChange={(v) => setNested('mapping', 'cognitive_level', v)} placeholder="理解／應用／分析" /></div></div>
                <div className="mt-6"><label htmlFor="quality-notes" className="mb-2 block text-sm font-medium text-ink">覆核備註與修訂建議</label><textarea id="quality-notes" value={String(form.notes ?? '')} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} rows={4} maxLength={4000} placeholder="記錄證據位置、常見錯誤、需補充的評分點或下一步。" className="w-full rounded-xl border border-line-strong bg-surface px-3 py-3 text-sm leading-6 text-ink outline-none focus:border-accent" /></div>
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5"><button type="button" disabled={saving} onClick={() => void save('pending')} className="rounded-xl bg-accent-strong px-4 py-3 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50">{saving ? '儲存中…' : '儲存覆核草稿'}</button><button type="button" disabled={saving} onClick={() => void save('approve_with_revision')} className="rounded-xl border border-gold/50 px-4 py-3 text-sm font-medium text-gold-strong hover:bg-gold/5 disabled:opacity-50">需要修訂</button><button type="button" disabled={saving || !canApprove} onClick={() => void save('approve')} className="rounded-xl border border-accent/50 px-4 py-3 text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-50">{canApprove ? '通過人工覆核' : '教師方可通過'}</button><span className="ml-auto text-xs text-ink-muted">目前：{stageLabel[selected.review.review_stage] ?? selected.review.review_stage}</span></div>
              </div>
            </> : <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center text-sm text-ink-muted">從左側隊列選擇一題開始。</div>}
          </section>
        </div>
        <footer className="mt-8 border-t border-line pt-4 text-xs leading-5 text-ink-muted">本介面只寫入質素評分及覆核紀錄，不會直接修改 live 題庫。`approved` 仍須經既有 pull-decisions → promote → wire → push 流程。</footer>
      </div>
    </main>
  )
}

function Stat({ label, value, tone = 'text-ink' }: { label: string; value: string; tone?: string }) { return <div className="rounded-xl border border-line bg-surface-raised px-4 py-3"><div className={`text-xl font-semibold ${tone}`}>{value}</div><div className="mt-1 text-xs text-ink-muted">{label}</div></div> }
function QueueItem({ row, selected, onClick }: { row: Row; selected: boolean; onClick: () => void }) { const r = row.review; return <button type="button" onClick={onClick} className={`w-full rounded-xl border p-3 text-left transition ${selected ? 'border-accent bg-accent/5' : 'border-line hover:border-accent/40 hover:bg-surface-sunken'}`}><div className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-ink">{r.question_id}</span><span className="shrink-0 rounded-full bg-surface-sunken px-2 py-1 text-[10px] text-ink-muted">{stageLabel[r.review_stage] ?? r.review_stage}</span></div><div className="mt-2 truncate text-xs text-ink-muted">{subjectName(null, r.subject_slug)} · {display(r.topic_label)}</div><div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted"><span>{r.question_type.toUpperCase()} · {r.difficulty_label ?? '未標'}</span><span>{Number(r.total_score ?? 0)} / 30</span></div></button> }
function QuestionPanel({ row }: { row: Row }) { const q = row.question!; return <div className="rounded-2xl border border-line bg-surface-raised p-4 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet/10 px-2.5 py-1 text-xs font-semibold text-violet">{q.subject}</span><span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-ink-muted">{q.type.toUpperCase()}</span><span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-ink-muted">{q.difficulty}</span></div><h2 className="mt-3 text-lg font-semibold text-ink">{q.id}</h2><p className="mt-1 text-sm text-ink-muted">課題：{display(row.review.topic_label)} · framework：{display(q.framework)} · 分值：{q.marks ?? '未填'}</p></div><span className="rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-gold-strong">{row.review.ai_findings?.machine_checks_only ? '只完成機器預檢' : '人工紀錄可追溯'}</span></div><div className="mt-5 grid gap-4 xl:grid-cols-2"><TextBlock title="題目（中文）" text={q.content} /><TextBlock title="Question (English)" text={q.contentEn} /></div>{q.options.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{q.options.map((option, index) => <div key={`${q.id}-${index}`} className={`rounded-xl border px-3 py-3 text-sm ${index === q.correctIndex ? 'border-accent/50 bg-accent/5 text-accent' : 'border-line bg-surface'}`}><span className="mr-2 text-xs text-ink-muted">{String.fromCharCode(65 + index)}.</span>{option}{index === q.correctIndex && <span className="ml-2 text-xs font-semibold">參考正解</span>}</div>)}</div>}<details className="mt-5 rounded-xl bg-surface-sunken p-3"><summary className="cursor-pointer text-sm font-medium text-ink">展開答案、解析及評分準則</summary><div className="mt-3 grid gap-4 text-sm leading-6 xl:grid-cols-2"><TextBlock title="參考答案" text={q.referenceAnswer || q.explanation} /><TextBlock title="Marking scheme" text={q.markingScheme || '未提供，非選擇題請補入逐分評分點。'} /><TextBlock title="解析" text={q.explanation} /><TextBlock title="Answer / explanation (English)" text={q.referenceAnswerEn || q.explanationEn} /></div></details></div> }
function TextBlock({ title, text }: { title: string; text: string }) { return <div><h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</h3><p className="whitespace-pre-wrap text-sm leading-7 text-ink">{text || '未提供'}</p></div> }
function ScoreRow({ label, help, value, onChange }: { label: string; help: string; value: number | null; onChange: (value: number | null) => void }) { return <div className="rounded-xl border border-line bg-surface p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-medium text-ink">{label}</div><div className="mt-1 text-xs leading-5 text-ink-muted">{help}</div></div><span className="shrink-0 text-sm font-semibold text-accent">{value ?? '—'} / 5</span></div><div className="mt-3 grid grid-cols-6 gap-1">{[0, 1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-label={`${label} ${n} 分`} onClick={() => onChange(n)} className={`rounded-md py-2 text-xs ${value === n ? 'bg-accent-strong text-on-accent' : 'bg-surface-sunken text-ink-muted hover:bg-accent/10 hover:text-accent'}`}>{n}</button>)}</div><button type="button" onClick={() => onChange(null)} className="mt-2 text-[11px] text-ink-muted underline">清除分數</button></div> }
function CheckRow({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void }) { return <label className="block rounded-xl border border-line bg-surface p-3"><span className="mb-2 block text-sm font-medium text-ink">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink"><option value="">未填寫</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label> }
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="block"><span className="mb-2 block text-xs font-medium text-ink-muted">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent" /></label> }
