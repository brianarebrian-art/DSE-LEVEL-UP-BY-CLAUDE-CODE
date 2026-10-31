import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { getActiveSubjects, subjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import { safeLog } from '@/lib/safeLog'
import { getFounderDeployEnv, founderAiConfigured } from '@/lib/founder/env'

/** 指標元資料 —— 每個數字都要講清計算方式。 */
export type MetricMeta = {
  id: string
  label: string
  /** 計算方式（繁中） */
  formula: string
  timeRange: string
  timezone: 'Asia/Hong_Kong'
  source: string
  sampleSize: number | null
  updatedAt: string
  missingRule: string
}

export type MetricValue =
  | { state: 'ok'; value: number; meta: MetricMeta }
  | { state: 'unavailable'; reason: string; meta: MetricMeta }
  | { state: 'unconnected'; reason: string; meta: MetricMeta }

export type SubjectNode = {
  id: string
  name: string
  nameEn: string
  isActive: boolean
  questionCount: number
  /** 近 30 日練習節數（已登入雲端進度聚合）；冇資料 = null，唔當 0。 */
  sessions30d: number | null
}

export type IntelItem = {
  id: string
  severity: 'info' | 'warn' | 'alert' | 'tip'
  title: string
  impact: string
  firstSeenAt: string
  updatedAt: string
  owner: string
  status: string
  href: string
  fingerprint: string
}

export type PlatformOverview = {
  updatedAt: string
  deployEnv: ReturnType<typeof getFounderDeployEnv>
  platformStatus: 'optimal' | 'degraded' | 'unknown'
  metrics: {
    activeStudents7d: MetricValue
    newPractisers7d: MetricValue
    practiceSessions30d: MetricValue
    questionBankTotal: MetricValue
    openReports: MetricValue
    pendingQualityReviews: MetricValue
  }
  subjectNodes: SubjectNode[]
  intel: IntelItem[]
  aiJobs: {
    queued: number | null
    running: number | null
    needsHuman: number | null
    failed: number | null
    completed: number | null
    source: 'db' | 'unconnected'
    reason?: string
  }
  opsTasks: {
    open: number | null
    source: 'db' | 'unconnected'
    reason?: string
  }
  system: {
    apiLatency: MetricValue
    errorRate: MetricValue
    backgroundJobs: MetricValue
    aiProvider: MetricValue
    budget: MetricValue
  }
  notComputable: { metric: string; reason: string }[]
}

function nowIso() {
  return new Date().toISOString()
}

function meta(partial: Omit<MetricMeta, 'timezone' | 'updatedAt'> & { updatedAt?: string }): MetricMeta {
  return {
    timezone: 'Asia/Hong_Kong',
    updatedAt: partial.updatedAt ?? nowIso(),
    ...partial,
  }
}

type Attempt = { timestamp?: number; total?: number; score?: number; subjectId?: string }

function dayKeyHkt(ms: number): string {
  return new Date(ms).toLocaleDateString('en-CA', { timeZone: 'Asia/Hong_Kong' })
}

/**
 * 指揮中心總覽。優先讀真實資料；表未建立或查詢失敗 → unconnected／unavailable，
 * 唔回退假數字。正式環境永不注入 demo。
 */
export async function loadPlatformOverview(): Promise<PlatformOverview> {
  const updatedAt = nowIso()
  const activeSubjects = getActiveSubjects()
  let questionTotal = 0
  const subjectNodes: SubjectNode[] = subjects.map((s) => {
    let count = 0
    try {
      count = getSubjectQuestions(s.id).length
    } catch {
      count = 0
    }
    if (s.isActive) questionTotal += count
    return {
      id: s.id,
      name: s.name,
      nameEn: s.nameEn,
      isActive: s.isActive,
      questionCount: count,
      sessions30d: null,
    }
  })

  const questionBankTotal: MetricValue = {
    state: 'ok',
    value: questionTotal,
    meta: meta({
      id: 'question_bank_total',
      label: '題庫題數（活躍科目）',
      formula: '活躍科目 getSubjectQuestions().length 合計（靜態 barrel；唔含草稿）',
      timeRange: '即時快照',
      source: 'data/questions',
      sampleSize: activeSubjects.length,
      missingRule: '科目讀取失敗計 0 題並仍列出科目',
    }),
  }

  let activeStudents7d: MetricValue = {
    state: 'unavailable',
    reason: '未能讀取 user_progress',
    meta: meta({
      id: 'active_students_7d',
      label: '近 7 日活躍學生（已登入）',
      formula: 'user_progress.progress_data.dse_progress 內 timestamp 落喺近 7 日嘅 distinct user_id',
      timeRange: '滾動 7 日',
      source: 'user_progress',
      sampleSize: null,
      missingRule: '未登入練習唔計；冇資料 ≠ 0',
    }),
  }
  let newPractisers7d: MetricValue = {
    state: 'unavailable',
    reason: '未能讀取 user_progress',
    meta: meta({
      id: 'new_practisers_7d',
      label: '近 7 日首次練習學生',
      formula: '首次 AttemptRecord.timestamp 落喺近 7 日嘅 distinct user_id（非註冊人數）',
      timeRange: '滾動 7 日',
      source: 'user_progress',
      sampleSize: null,
      missingRule: '唔將註冊當活躍；只知首次練習時間',
    }),
  }
  let practiceSessions30d: MetricValue = {
    state: 'unavailable',
    reason: '未能讀取 user_progress',
    meta: meta({
      id: 'practice_sessions_30d',
      label: '近 30 日練習節數',
      formula: 'dse_progress 內 timestamp 落喺近 30 日且 total/score 合法嘅節數',
      timeRange: '滾動 30 日',
      source: 'user_progress',
      sampleSize: null,
      missingRule: '壞資料（score>total）剔除；未登入唔計',
    }),
  }

  const sessionsBySubject = new Map<string, number>()
  const intel: IntelItem[] = []

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from('user_progress').select('user_id, progress_data, updated_at')
    if (error) throw error
    const rows = (data ?? []) as { user_id: string; progress_data: unknown; updated_at: string | null }[]
    const now = Date.now()
    const DAY = 86_400_000
    const active7 = new Set<string>()
    const firstSeen = new Map<string, number>()
    let sessions30 = 0
    let sampleAttempts = 0

    for (const row of rows) {
      const pd = row.progress_data as Record<string, unknown> | null
      const list = pd && Array.isArray(pd.dse_progress) ? (pd.dse_progress as Attempt[]) : []
      for (const a of list) {
        const ts = typeof a?.timestamp === 'number' ? a.timestamp : null
        const total = typeof a?.total === 'number' ? a.total : null
        const score = typeof a?.score === 'number' ? a.score : null
        if (ts === null || total === null || score === null || score > total || total <= 0) continue
        sampleAttempts++
        const age = now - ts
        if (age <= 7 * DAY) active7.add(row.user_id)
        if (age <= 30 * DAY) {
          sessions30++
          const sid = typeof a.subjectId === 'string' ? a.subjectId : 'unknown'
          sessionsBySubject.set(sid, (sessionsBySubject.get(sid) ?? 0) + 1)
        }
        const prev = firstSeen.get(row.user_id)
        if (prev === undefined || ts < prev) firstSeen.set(row.user_id, ts)
      }
    }

    let new7 = 0
    for (const ts of firstSeen.values()) {
      if (now - ts <= 7 * DAY) new7++
    }

    activeStudents7d = {
      state: 'ok',
      value: active7.size,
      meta: meta({
        id: 'active_students_7d',
        label: '近 7 日活躍學生（已登入）',
        formula: 'user_progress.progress_data.dse_progress 內 timestamp 落喺近 7 日嘅 distinct user_id',
        timeRange: '滾動 7 日',
        source: 'user_progress',
        sampleSize: sampleAttempts,
        missingRule: '未登入練習唔計；冇資料 ≠ 0',
      }),
    }
    newPractisers7d = {
      state: 'ok',
      value: new7,
      meta: meta({
        id: 'new_practisers_7d',
        label: '近 7 日首次練習學生',
        formula: '首次 AttemptRecord.timestamp 落喺近 7 日嘅 distinct user_id（非註冊人數）',
        timeRange: '滾動 7 日',
        source: 'user_progress',
        sampleSize: firstSeen.size,
        missingRule: '唔將註冊當活躍；只知首次練習時間',
      }),
    }
    practiceSessions30d = {
      state: 'ok',
      value: sessions30,
      meta: meta({
        id: 'practice_sessions_30d',
        label: '近 30 日練習節數',
        formula: 'dse_progress 內 timestamp 落喺近 30 日且 total/score 合法嘅節數',
        timeRange: '滾動 30 日',
        source: 'user_progress',
        sampleSize: sampleAttempts,
        missingRule: '壞資料剔除；未登入唔計',
      }),
    }
  } catch (e) {
    safeLog('warn', 'founder overview: user_progress unavailable', e)
    activeStudents7d = { ...activeStudents7d, state: 'unavailable', reason: 'Supabase／user_progress 未能讀取' }
    newPractisers7d = { ...newPractisers7d, state: 'unavailable', reason: 'Supabase／user_progress 未能讀取' }
    practiceSessions30d = { ...practiceSessions30d, state: 'unavailable', reason: 'Supabase／user_progress 未能讀取' }
  }

  for (const node of subjectNodes) {
    if (sessionsBySubject.has(node.id)) node.sessions30d = sessionsBySubject.get(node.id)!
  }

  let openReports: MetricValue = {
    state: 'unconnected',
    reason: 'question_reports 未能讀取',
    meta: meta({
      id: 'open_reports',
      label: '未處理錯題回報',
      formula: "count(*) where status='open'",
      timeRange: '全部未結案',
      source: 'question_reports',
      sampleSize: null,
      missingRule: '表不存在或無權限 → 未接駁',
    }),
  }
  try {
    const supabase = getServiceSupabase()
    const { count, error } = await supabase
      .from('question_reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open')
    if (error) throw error
    openReports = {
      state: 'ok',
      value: count ?? 0,
      meta: meta({
        id: 'open_reports',
        label: '未處理錯題回報',
        formula: "count(*) where status='open'",
        timeRange: '全部未結案',
        source: 'question_reports',
        sampleSize: count ?? 0,
        missingRule: '空表顯示 0（真係冇未結案）',
      }),
    }
    if ((count ?? 0) > 0) {
      intel.push({
        id: `reports-open-${count}`,
        severity: 'warn',
        title: `有 ${count} 宗未處理錯題回報`,
        impact: '題庫質素／學生信任',
        firstSeenAt: updatedAt,
        updatedAt,
        owner: '創辦人',
        status: 'open',
        href: '/founder/quality/reports',
        fingerprint: 'question_reports:open',
      })
    }
  } catch (e) {
    safeLog('warn', 'founder overview: question_reports unavailable', e)
  }

  let pendingQualityReviews: MetricValue = {
    state: 'unconnected',
    reason: 'dse_question_quality_reviews 未能讀取',
    meta: meta({
      id: 'pending_quality_reviews',
      label: '待質素覆核',
      formula: "count where review_stage in ('queued','ai_precheck','human_review','second_review')",
      timeRange: '全部進行中',
      source: 'dse_question_quality_reviews',
      sampleSize: null,
      missingRule: '表未 migrate → 未接駁',
    }),
  }
  try {
    const supabase = getServiceSupabase()
    const { count, error } = await supabase
      .from('dse_question_quality_reviews')
      .select('id', { count: 'exact', head: true })
      .in('review_stage', ['queued', 'ai_precheck', 'human_review', 'second_review'])
    if (error) throw error
    pendingQualityReviews = {
      state: 'ok',
      value: count ?? 0,
      meta: meta({
        id: 'pending_quality_reviews',
        label: '待質素覆核',
        formula: "count where review_stage in ('queued','ai_precheck','human_review','second_review')",
        timeRange: '全部進行中',
        source: 'dse_question_quality_reviews',
        sampleSize: count ?? 0,
        missingRule: '空隊列顯示 0',
      }),
    }
    if ((count ?? 0) > 0) {
      intel.push({
        id: `quality-pending-${count}`,
        severity: 'info',
        title: `質素覆核隊列：${count} 題待處理`,
        impact: '發佈節奏',
        firstSeenAt: updatedAt,
        updatedAt,
        owner: '創辦人／覆核員',
        status: 'queued',
        href: '/founder/quality',
        fingerprint: 'quality_reviews:pending',
      })
    }
  } catch (e) {
    safeLog('warn', 'founder overview: quality reviews unavailable', e)
  }

  // AI jobs / ops — 新表；未 migrate 則未接駁
  let aiJobs: PlatformOverview['aiJobs'] = {
    queued: null,
    running: null,
    needsHuman: null,
    failed: null,
    completed: null,
    source: 'unconnected',
    reason: 'founder_ai_jobs 表未接駁或未能讀取',
  }
  let opsTasks: PlatformOverview['opsTasks'] = {
    open: null,
    source: 'unconnected',
    reason: 'founder_operational_tasks 表未接駁或未能讀取',
  }
  try {
    const supabase = getServiceSupabase()
    const statuses = ['queued', 'running', 'needs_human', 'failed', 'completed'] as const
    const counts: Record<string, number> = {}
    for (const st of statuses) {
      const { count, error } = await supabase
        .from('founder_ai_jobs')
        .select('id', { count: 'exact', head: true })
        .eq('status', st)
      if (error) throw error
      counts[st] = count ?? 0
    }
    aiJobs = {
      queued: counts.queued,
      running: counts.running,
      needsHuman: counts.needs_human,
      failed: counts.failed,
      completed: counts.completed,
      source: 'db',
    }
  } catch (e) {
    safeLog('warn', 'founder overview: ai jobs unavailable', e)
  }
  try {
    const supabase = getServiceSupabase()
    const { count, error } = await supabase
      .from('founder_operational_tasks')
      .select('id', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress', 'blocked'])
    if (error) throw error
    opsTasks = { open: count ?? 0, source: 'db' }
  } catch (e) {
    safeLog('warn', 'founder overview: ops tasks unavailable', e)
  }

  // 真實事故（合併 fingerprint）
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_incidents')
      .select('id, title, severity, status, impact, owner_label, first_seen_at, updated_at, fingerprint')
      .in('status', ['open', 'mitigating', 'monitoring'])
      .order('updated_at', { ascending: false })
      .limit(20)
    if (error) throw error
    for (const row of data ?? []) {
      const sev = row.severity === 'critical' ? 'alert' : row.severity === 'warn' ? 'warn' : 'info'
      intel.push({
        id: row.id,
        severity: sev,
        title: row.title,
        impact: row.impact ?? '未註明',
        firstSeenAt: row.first_seen_at,
        updatedAt: row.updated_at,
        owner: row.owner_label ?? '未指派',
        status: row.status,
        href: `/founder/ops/incidents?id=${encodeURIComponent(row.id)}`,
        fingerprint: row.fingerprint,
      })
    }
  } catch {
    // 表未建：唔塞假事故
  }

  // 合併重複 fingerprint
  const seenFp = new Set<string>()
  const mergedIntel = intel.filter((item) => {
    if (seenFp.has(item.fingerprint)) return false
    seenFp.add(item.fingerprint)
    return true
  })

  const unconnected = (id: string, label: string, reason: string): MetricValue => ({
    state: 'unconnected',
    reason,
    meta: meta({
      id,
      label,
      formula: '需要遙測／供應商 API',
      timeRange: '—',
      source: '未接駁',
      sampleSize: null,
      missingRule: '未接駁時唔顯示假數字',
    }),
  })

  const system = {
    apiLatency: unconnected('api_latency', 'API 延遲', '未接駁 APM／邊緣遙測'),
    errorRate: unconnected('error_rate', '錯誤率', '未接駁 Sentry 聚合 API'),
    backgroundJobs: unconnected('background_jobs', '背景任務', '未接駁專用 worker'),
    aiProvider: founderAiConfigured()
      ? {
          state: 'ok' as const,
          value: 1,
          meta: meta({
            id: 'ai_provider',
            label: 'AI 供應商',
            formula: 'FOUNDER_AI_API_KEY ＋ FOUNDER_AI_BASE_URL 已設定（唔探測在線）',
            timeRange: '設定快照',
            source: 'process.env（server）',
            sampleSize: 1,
            missingRule: '有 key ≠ 模型在線',
          }),
        }
      : unconnected('ai_provider', 'AI 供應商', '未設定 FOUNDER_AI_API_KEY／BASE_URL'),
    budget: unconnected('budget_usage', '預算使用', 'founder_budgets 未有本期資料時顯示未接駁'),
  }

  try {
    const supabase = getServiceSupabase()
    const today = dayKeyHkt(Date.now())
    const { data, error } = await supabase
      .from('founder_budgets')
      .select('amount, currency, amount_hkd, spent_amount, spent_hkd, period_start, period_end')
      .lte('period_start', today)
      .gte('period_end', today)
      .limit(1)
      .maybeSingle()
    if (error) throw error
    if (data && data.amount != null && Number(data.amount) > 0) {
      const spent = Number(data.spent_hkd ?? data.spent_amount ?? 0)
      const total = Number(data.amount_hkd ?? data.amount)
      const pct = Math.round((spent / total) * 1000) / 10
      system.budget = {
        state: 'ok',
        value: pct,
        meta: meta({
          id: 'budget_usage',
          label: '預算使用（%）',
          formula: 'spent_hkd／amount_hkd × 100（保留原始幣別欄位）',
          timeRange: `${data.period_start} → ${data.period_end}`,
          source: 'founder_budgets',
          sampleSize: 1,
          missingRule: '冇本期列 → 未接駁',
        }),
      }
    }
  } catch {
    // keep unconnected
  }

  const anyData =
    activeStudents7d.state === 'ok' || openReports.state === 'ok' || questionBankTotal.state === 'ok'
  const platformStatus: PlatformOverview['platformStatus'] = anyData ? 'optimal' : 'unknown'

  return {
    updatedAt,
    deployEnv: getFounderDeployEnv(),
    platformStatus,
    metrics: {
      activeStudents7d,
      newPractisers7d,
      practiceSessions30d,
      questionBankTotal,
      openReports,
      pendingQualityReviews,
    },
    subjectNodes,
    intel: mergedIntel,
    aiJobs,
    opsTasks,
    system,
    notComputable: [
      {
        metric: '未登入用戶活躍',
        reason: '未登入練習只在 localStorage；以上活躍數字係下限。',
      },
      {
        metric: '註冊人數',
        reason: '唔將註冊當活躍：活躍只計已登入且有練習紀錄嘅用戶；Auth 帳戶數 ≠ 活躍。',
      },
      {
        metric: '官方 DSE 等級',
        reason: '練習正確率唔等於考評局等級；唔喺此顯示等級宣稱。',
      },
      {
        metric: '綜合健康分數',
        reason: '冇解釋依據嘅合成分禁止顯示。',
      },
    ],
  }
}
