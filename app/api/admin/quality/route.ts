import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { requireReviewer, type ReviewerRole } from '@/lib/auth/reviewerAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'
const TABLE = 'dse_question_quality_reviews'
const STAGES = ['queued', 'ai_precheck', 'human_review', 'second_review', 'pilot_calibration', 'approved', 'revision_required', 'withdrawn'] as const
const DECISIONS = ['pending', 'approve_with_revision', 'approve', 'reject', 'withdraw'] as const
const CHECK_KEYS = [
  'syllabus_alignment', 'factual_accuracy', 'answer_key_accuracy', 'marking_scheme_quality',
  'language_format_quality', 'difficulty_alignment', 'copyright_risk', 'empirical_calibration',
] as const
const SCORE_KEYS = ['score_syllabus', 'score_assessment', 'score_answer', 'score_language', 'score_difficulty', 'score_evidence'] as const
const safeText = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const validEnum = <T extends readonly string[]>(value: unknown, choices: T): value is T[number] => typeof value === 'string' && choices.includes(value)
const clampScore = (value: unknown): number | null => {
  if (value === null || value === '' || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 && n <= 5 ? Math.round(n * 10) / 10 : null
}

function questionView(row: Record<string, unknown>) {
  const data = (row.data && typeof row.data === 'object' ? row.data : {}) as Record<string, unknown>
  const array = (key: string) => Array.isArray(data[key]) ? data[key].filter((v): v is string => typeof v === 'string') : []
  return {
    id: row.id,
    subject: row.subject,
    topic: row.topic,
    type: row.type,
    difficulty: row.difficulty,
    content: safeText(data.content ?? data.question ?? data.questionZh ?? data.contentZh, 12000),
    contentEn: safeText(data.contentEn ?? data.questionEn, 12000),
    options: array('options'),
    optionsEn: array('optionsEn'),
    correctIndex: typeof data.correctIndex === 'number' ? data.correctIndex : null,
    explanation: safeText(data.explanation, 12000),
    explanationEn: safeText(data.explanationEn, 12000),
    referenceAnswer: safeText(data.referenceAnswer, 16000),
    referenceAnswerEn: safeText(data.referenceAnswerEn, 16000),
    markingScheme: safeText(data.markingScheme, 16000),
    markingSchemeEn: safeText(data.markingSchemeEn, 16000),
    marks: data.marks ?? null,
    year: data.year ?? null,
    framework: safeText(data.framework, 160),
  }
}

async function getRows(params: URLSearchParams) {
  const subject = safeText(params.get('subject'), 40)
  const stage = safeText(params.get('stage'), 40)
  const decision = safeText(params.get('decision'), 40)
  const limit = Math.min(30, Math.max(1, Number(params.get('limit') ?? 12) || 12))
  const offset = Math.min(100000, Math.max(0, Number(params.get('offset') ?? 0) || 0))
  const supabase = getServiceSupabase()
  let query = supabase
    .from(TABLE)
    .select('id,question_id,rubric_version,subject_slug,topic_code,topic_label,question_type,difficulty_label,marks,suggested_time_seconds,curriculum_code,assessment_objective,cognitive_level,command_word_fit,question_type_fit,syllabus_alignment,factual_accuracy,answer_key_accuracy,marking_scheme_quality,language_format_quality,difficulty_alignment,copyright_risk,empirical_calibration,score_syllabus,score_assessment,score_answer,score_language,score_difficulty,score_evidence,total_score,review_stage,decision,ai_findings,human_findings,calibration_metrics,evidence_urls,reviewer_role,reviewer_name,reviewed_at,notes,updated_at', { count: 'exact' })
    .order('updated_at', { ascending: true })
    .range(offset, offset + limit - 1)
  if (subject) query = query.eq('subject_slug', subject)
  if (validEnum(stage, STAGES)) query = query.eq('review_stage', stage)
  if (validEnum(decision, DECISIONS)) query = query.eq('decision', decision)
  const { data, error, count } = await query
  if (error) throw error
  const reviews = (data ?? []) as Record<string, unknown>[]
  const ids = reviews.map((r) => String(r.question_id))
  const { data: questions, error: questionError } = ids.length
    ? await supabase.from('questions').select('id,subject,topic,type,difficulty,data').in('id', ids)
    : { data: [], error: null }
  if (questionError) throw questionError
  const questionMap = new Map((questions ?? []).map((q) => [String(q.id), questionView(q as Record<string, unknown>)]))
  return { rows: reviews.map((review) => ({ review, question: questionMap.get(String(review.question_id)) ?? null })), count: count ?? 0, limit, offset }
}

async function getSummary() {
  const supabase = getServiceSupabase()
  const counts = await Promise.all([
    ...STAGES.map(async (stage) => {
      const { count, error } = await supabase.from(TABLE).select('id', { count: 'exact', head: true }).eq('review_stage', stage)
      if (error) throw error
      return [stage, count ?? 0] as const
    }),
    (async () => {
      const { data, error } = await supabase.from('dse_curriculum_frameworks').select('subject_slug,subject_name_zh').order('subject_name_zh').limit(50)
      if (error) throw error
      return ['subjects', data ?? []] as const
    })(),
  ])
  return Object.fromEntries(counts)
}

export async function GET(request: Request) {
  const reviewer = await requireReviewer()
  if (!reviewer) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  try {
    const url = new URL(request.url)
    const [queue, summary] = await Promise.all([getRows(url.searchParams), getSummary()])
    return NextResponse.json({ ...queue, summary, reviewer: { name: reviewer.name, role: reviewer.role } }, { headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    safeLog('error', 'admin quality GET failed', error)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

function canApprove(role: ReviewerRole) {
  return role === 'admin' || role === 'teacher' || role === 'subject_editor'
}

export async function POST(request: Request) {
  const reviewer = await requireReviewer()
  if (!reviewer) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const read = await readJsonLimited<Record<string, unknown>>(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const body = read.value ?? {}
  const reviewId = safeText(body.reviewId, 80)
  const questionId = safeText(body.questionId, 200)
  const decision = validEnum(body.decision, DECISIONS) ? body.decision : 'pending'
  if (!reviewId || !questionId) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  if (decision === 'approve' && !canApprove(reviewer.role)) return NextResponse.json({ error: 'teacher_required' }, { status: 403 })
  const scoresRaw = body.scores && typeof body.scores === 'object' ? body.scores as Record<string, unknown> : {}
  const checksRaw = body.checks && typeof body.checks === 'object' ? body.checks as Record<string, unknown> : {}
  const mappingRaw = body.mapping && typeof body.mapping === 'object' ? body.mapping as Record<string, unknown> : {}
  const scores = Object.fromEntries(SCORE_KEYS.map((key) => [key, clampScore(scoresRaw[key])])) as Record<string, number | null>
  const checks = Object.fromEntries(CHECK_KEYS.map((key) => [key, safeText(checksRaw[key], 40) || null])) as Record<string, string | null>
  const notes = safeText(body.notes, 4000)
  const evidenceUrls = Array.isArray(body.evidenceUrls) ? body.evidenceUrls.filter((v): v is string => typeof v === 'string').slice(0, 12).map((v) => v.slice(0, 1000)) : []
  if (decision === 'approve') {
    const total = Object.values(scores).reduce<number>((sum, value) => sum + (value ?? 0), 0)
    const blocked = [
      total < 24 ? '總分未達 24/30' : '',
      checks.syllabus_alignment !== 'pass' ? '課綱未通過' : '',
      checks.answer_key_accuracy !== 'pass' ? '答案未通過' : '',
      checks.factual_accuracy !== 'pass' ? '事實／計算未通過' : '',
      checks.language_format_quality !== 'pass' ? '語言／格式未通過' : '',
      checks.difficulty_alignment !== 'pass' ? '難度未通過' : '',
      checks.copyright_risk !== 'clear' ? '版權未通過' : '',
      !checks.marking_scheme_quality || !['pass', 'not_applicable'].includes(checks.marking_scheme_quality) ? '評分準則未通過' : '',
    ].filter(Boolean)
    if (blocked.length) return NextResponse.json({ error: 'hard_gate_failed', blocked }, { status: 400 })
  }
  const reviewStage = decision === 'approve' ? 'approved' : decision === 'approve_with_revision' ? 'revision_required' : decision === 'reject' || decision === 'withdraw' ? 'withdrawn' : reviewer.role === 'volunteer' ? 'ai_precheck' : 'human_review'
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from(TABLE)
      .update({
        curriculum_code: safeText(mappingRaw.curriculum_code, 200) || null,
        assessment_objective: safeText(mappingRaw.assessment_objective, 1000) || null,
        cognitive_level: safeText(mappingRaw.cognitive_level, 40) || null,
        command_word_fit: safeText(checksRaw.command_word_fit, 40) || null,
        question_type_fit: safeText(checksRaw.question_type_fit, 40) || null,
        ...checks,
        ...scores,
        evidence_urls: evidenceUrls,
        review_stage: reviewStage,
        decision,
        human_findings: { mapping: mappingRaw, checks, scores, notes, saved_by_role: reviewer.role },
        reviewer_role: reviewer.role,
        reviewer_name: reviewer.name.slice(0, 200),
        reviewed_at: new Date().toISOString(),
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('question_id', questionId)
    if (error) throw error
    return NextResponse.json({ ok: true, reviewStage, decision })
  } catch (error) {
    safeLog('error', 'admin quality POST failed', error)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
