import Link from 'next/link'
import { loadPlatformOverview } from '@/lib/founder/metrics'
import { getServiceSupabase } from '@/utils/supabase/server'
import { getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import { requireFounder, founderBindingInstructions } from '@/lib/auth/founderAllowlist'
import { FOUNDER_EMAIL } from '@/lib/auth/founderIdentity'
import { founderAiConfigured, getFounderDeployEnv, founderEnvLabel } from '@/lib/founder/env'
import { safeLog } from '@/lib/safeLog'
import { AiJobActionsClient } from '@/components/founder/AiJobActionsClient'

function Unconnected({ children }: { children: string }) {
  return <p className="text-sm text-[var(--fos-muted)]">{children}</p>
}

export async function ModuleBody({ route }: { route: string }) {
  switch (route) {
    case '/founder/briefing':
      return <BriefingBody />
    case '/founder/decisions':
      return <DecisionsBody />
    case '/founder/students':
    case '/founder/students/retention':
    case '/founder/students/effectiveness':
      return <StudentsBody variant={route} />
    case '/founder/subjects':
    case '/founder/subjects/coverage':
      return <SubjectsBody variant={route} />
    case '/founder/quality':
    case '/founder/quality/reports':
    case '/founder/quality/copyright':
      return <QualityBody variant={route} />
    case '/founder/ai':
      return <AiJobsBody />
    case '/founder/ai/models':
      return <AiModelsBody />
    case '/founder/ai/prompts':
      return <PromptsBody />
    case '/founder/ops':
    case '/founder/goals':
      return <OpsTasksBody />
    case '/founder/ops/incidents':
      return <IncidentsBody />
    case '/founder/finance':
      return <FinanceBody />
    case '/founder/engineering':
    case '/founder/settings/integrations':
      return <IntegrationsBody />
    case '/founder/engineering/sessions':
      return <SessionsBody />
    case '/founder/engineering/security':
      return <SecurityBody />
    case '/founder/settings':
      return <SettingsIdentityBody />
    case '/founder/settings/audit':
      return <AuditBody />
    case '/founder/settings/flags':
      return <FlagsBody />
    case '/founder/ops/kb':
      return (
        <ul className="fos-panel space-y-2 p-4 text-sm">
          <li>
            <span className="text-[var(--fos-ink)]">內部 docs（repo）</span>
            <span className="text-[var(--fos-faint)]"> — 見 docs/charter.md、docs/founder-os.md</span>
          </li>
          <li>
            <Link href="/transparency" className="text-[var(--fos-cyan)]">
              透明度頁（公開）
            </Link>
          </li>
          <li>
            <Link href="/methodology" className="text-[var(--fos-cyan)]">
              方法論
            </Link>
          </li>
        </ul>
      )
    default:
      return (
        <div className="fos-panel p-4 text-sm text-[var(--fos-muted)]">
          此模組路由已建立並受 Founder 授權保護。資料來源尚未接駁或功能仍在擴充中——唔會顯示假成功狀態。
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/founder" className="text-[var(--fos-cyan)]">
              指揮中心
            </Link>
            <Link href="/founder/questions" className="text-[var(--fos-cyan)]">
              題庫工場
            </Link>
            <Link href="/founder/quality/reports" className="text-[var(--fos-cyan)]">
              錯題回報
            </Link>
          </div>
        </div>
      )
  }
}

async function BriefingBody() {
  const o = await loadPlatformOverview()
  const lines = [
    `環境：${founderEnvLabel(o.deployEnv)} · 狀態 ${o.platformStatus}`,
    o.metrics.activeStudents7d.state === 'ok'
      ? `近 7 日活躍（已登入）：${o.metrics.activeStudents7d.value}`
      : `近 7 日活躍：${o.metrics.activeStudents7d.state === 'unconnected' ? '未接駁' : '無法計算'}`,
    o.metrics.practiceSessions30d.state === 'ok'
      ? `近 30 日練習節：${o.metrics.practiceSessions30d.value}`
      : '近 30 日練習節：無法計算',
    o.metrics.questionBankTotal.state === 'ok'
      ? `題庫題數：${o.metrics.questionBankTotal.value}`
      : '題庫題數：—',
    o.metrics.openReports.state === 'ok'
      ? `未處理錯題回報：${o.metrics.openReports.value}`
      : '錯題回報：未接駁',
    o.metrics.pendingQualityReviews.state === 'ok'
      ? `待質素覆核：${o.metrics.pendingQualityReviews.value}`
      : '質素覆核：未接駁',
    `情報條目：${o.intel.length}（已合併重複）`,
  ]
  return (
    <div className="fos-panel space-y-2 p-4 text-sm whitespace-pre-wrap">
      <p className="fos-panel-title">今日創辦人簡報（本地彙整）</p>
      {lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
      <p className="text-xs text-[var(--fos-faint)]">此簡報由真實指標組成；未接駁 AI 潤飾。來源見各指標 meta。</p>
    </div>
  )
}

async function DecisionsBody() {
  const o = await loadPlatformOverview()
  if (o.intel.length === 0) {
    return <Unconnected>目前冇待決策情報。</Unconnected>
  }
  return (
    <ul className="space-y-2">
      {o.intel.map((i) => (
        <li key={i.id} className="fos-panel p-3 text-sm">
          <p className="font-medium">{i.title}</p>
          <p className="text-xs text-[var(--fos-muted)]">{i.impact}</p>
          <Link href={i.href} className="text-xs text-[var(--fos-cyan)]">
            處理 →
          </Link>
        </li>
      ))}
    </ul>
  )
}

async function StudentsBody({ variant }: { variant: string }) {
  const o = await loadPlatformOverview()
  return (
    <div className="space-y-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-3">
        <Stat label="7 日活躍" m={o.metrics.activeStudents7d} />
        <Stat label="7 日首次練習" m={o.metrics.newPractisers7d} />
        <Stat label="30 日練習節" m={o.metrics.practiceSessions30d} />
      </div>
      {variant.includes('retention') && (
        <p className="text-[var(--fos-muted)]">
          留存以「多日再出現」為準；冇遙測唔推算流失原因。本頁唔列出個別學生身份。
        </p>
      )}
      {variant.includes('effectiveness') && (
        <p className="text-[var(--fos-muted)]">
          練習正確率只係平台練習表現估算，
          <strong className="text-[var(--fos-warn)]">唔等於</strong>
          官方 DSE 等級。
        </p>
      )}
      <p className="text-xs text-[var(--fos-faint)]">憲章 §16.E：唔返回他人逐題答案；唔做跨用戶排名。</p>
      <p className="text-xs text-[var(--fos-muted)]">
        進階聚合：{' '}
        <Link href="/api/founder/students/stats" className="text-[var(--fos-cyan)]">
          /api/founder/students/stats
        </Link>
      </p>
    </div>
  )
}

async function SubjectsBody({ variant }: { variant: string }) {
  const active = getActiveSubjects()
  const rows = active.map((s) => {
    let count = 0
    try {
      count = getSubjectQuestions(s.id).length
    } catch {
      count = 0
    }
    return { ...s, count }
  })
  const sorted = [...rows].sort((a, b) => a.count - b.count)
  const list = variant.includes('coverage') ? sorted : rows
  return (
    <div className="fos-panel overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="text-xs text-[var(--fos-muted)]">
          <tr>
            <th className="px-3 py-2">科目</th>
            <th className="px-3 py-2">題數</th>
            <th className="px-3 py-2">優先級</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.id} className="border-t border-[var(--fos-border-soft)]">
              <td className="px-3 py-2">
                <Link href={`/founder/questions?subject=${s.id}`} className="text-[var(--fos-cyan)]">
                  {s.name}
                </Link>
              </td>
              <td className="px-3 py-2 tabular-nums">{s.count}</td>
              <td className="px-3 py-2 text-[var(--fos-muted)]">{s.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {variant.includes('coverage') && (
        <p className="p-3 text-xs text-[var(--fos-faint)]">已按題數由少到多排序（唔等同課綱完成度）。</p>
      )}
    </div>
  )
}

async function QualityBody({ variant }: { variant: string }) {
  type ReportRow = {
    id: number
    created_at: string
    question_id: string
    category: string
    status: string
  }
  type ReviewRow = {
    id: string
    question_id: string
    subject_slug: string
    review_stage: string
    decision: string
    total_score: number | null
  }

  if (variant.includes('reports') || variant.includes('copyright')) {
    let rows: ReportRow[] | null = null
    try {
      const supabase = getServiceSupabase()
      let q = supabase
        .from('question_reports')
        .select('id, created_at, question_id, category, locale, status')
        .order('created_at', { ascending: false })
        .limit(50)
      q = variant.includes('copyright') ? q.eq('category', 'copyright') : q.eq('status', 'open')
      const { data, error } = await q
      if (error) throw error
      rows = (data ?? []) as ReportRow[]
    } catch (e) {
      safeLog('warn', 'founder quality reports', e)
      return <Unconnected>資料來源未接駁或查詢失敗（唔顯示假隊列）。</Unconnected>
    }
    if (!rows.length) return <Unconnected>目前冇符合條件嘅回報。</Unconnected>
    return (
      <div className="fos-panel overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="text-xs text-[var(--fos-muted)]">
            <tr>
              <th className="px-3 py-2">時間</th>
              <th className="px-3 py-2">題號</th>
              <th className="px-3 py-2">類別</th>
              <th className="px-3 py-2">狀態</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[var(--fos-border-soft)]">
                <td className="px-3 py-2 text-xs text-[var(--fos-faint)]">
                  {new Date(r.created_at).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong', hour12: false })}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/founder/questions/${encodeURIComponent(r.question_id)}`} className="text-[var(--fos-cyan)]">
                    {r.question_id}
                  </Link>
                </td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  let reviews: ReviewRow[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('dse_question_quality_reviews')
      .select('id, question_id, subject_slug, review_stage, decision, total_score, updated_at')
      .in('review_stage', ['queued', 'ai_precheck', 'human_review', 'second_review'])
      .order('updated_at', { ascending: false })
      .limit(50)
    if (error) throw error
    reviews = (data ?? []) as ReviewRow[]
  } catch (e) {
    safeLog('warn', 'founder quality reviews', e)
    return <Unconnected>資料來源未接駁或查詢失敗（唔顯示假隊列）。</Unconnected>
  }
  if (!reviews.length) return <Unconnected>覆核隊列係空嘅。</Unconnected>
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--fos-muted)]">
        詳細評分介面：{' '}
        <Link href="/admin/quality" className="text-[var(--fos-cyan)]">
          /admin/quality
        </Link>
        （ADMIN_EMAILS；Founder 另受 sub 閘）。
      </p>
      <div className="fos-panel overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs text-[var(--fos-muted)]">
            <tr>
              <th className="px-3 py-2">題號</th>
              <th className="px-3 py-2">科目</th>
              <th className="px-3 py-2">階段</th>
              <th className="px-3 py-2">決定</th>
              <th className="px-3 py-2">分數</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-t border-[var(--fos-border-soft)]">
                <td className="px-3 py-2">
                  <Link href={`/founder/questions/${encodeURIComponent(r.question_id)}`} className="text-[var(--fos-cyan)]">
                    {r.question_id}
                  </Link>
                </td>
                <td className="px-3 py-2">{r.subject_slug}</td>
                <td className="px-3 py-2">{r.review_stage}</td>
                <td className="px-3 py-2">{r.decision}</td>
                <td className="px-3 py-2 tabular-nums">{r.total_score ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function AiJobsBody() {
  type Job = {
    id: string
    kind: string
    status: string
    title: string
    provider: string | null
    model: string | null
    error_message: string | null
    cost_hkd: number | null
    cost_currency: string | null
  }
  let jobs: Job[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_ai_jobs')
      .select('id, kind, status, title, provider, model, error_message, cost_hkd, cost_currency, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50)
    if (error) throw error
    jobs = (data ?? []) as Job[]
  } catch {
    return <Unconnected>founder_ai_jobs 未接駁（請套用 migration 0029）。</Unconnected>
  }
  if (!jobs.length) return <Unconnected>目前冇 AI 任務紀錄。</Unconnected>
  return (
    <ul className="space-y-2">
      {jobs.map((j) => (
        <li key={j.id} className="fos-panel p-3 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <span className="font-medium">{j.title}</span>
            <span className="text-xs text-[var(--fos-muted)]">{j.status}</span>
          </div>
          <p className="text-xs text-[var(--fos-faint)]">
            {j.kind}
            {j.provider ? ` · ${j.provider}` : ''}
            {j.model ? ` / ${j.model}` : ''}
            {j.cost_hkd != null ? ` · HKD ${j.cost_hkd}` : j.cost_currency ? ` · ${j.cost_currency}` : ''}
          </p>
          {j.error_message && <p className="mt-1 text-xs text-[var(--fos-danger)]">{j.error_message}</p>}
          <AiJobActionsClient id={j.id} status={j.status} />
        </li>
      ))}
    </ul>
  )
}

function AiModelsBody() {
  return (
    <div className="fos-panel space-y-2 p-4 text-sm">
      <p>Founder AI API：{founderAiConfigured() ? '已設定（server-only）' : '未接駁'}</p>
      <p className="text-xs text-[var(--fos-faint)]">唔會回傳 API Key；唔顯示模型「在線」除非有真實探測。</p>
    </div>
  )
}

async function PromptsBody() {
  type Prompt = { prompt_key: string; version: string; active: boolean; created_by: string }
  let rows: Prompt[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('dse_quality_prompt_versions')
      .select('prompt_key, version, active, created_by, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    rows = (data ?? []) as Prompt[]
  } catch {
    return <Unconnected>Prompt 表未接駁。</Unconnected>
  }
  if (!rows.length) return <Unconnected>冇 Prompt 版本。</Unconnected>
  return (
    <ul className="space-y-2 text-sm">
      {rows.map((p) => (
        <li key={`${p.prompt_key}-${p.version}`} className="fos-panel p-3">
          <span className="font-medium">{p.prompt_key}</span> · {p.version}
          {p.active ? <span className="ml-2 text-xs text-[var(--fos-ok)]">active</span> : null}
          <p className="text-xs text-[var(--fos-faint)]">by {p.created_by}</p>
        </li>
      ))}
    </ul>
  )
}

async function OpsTasksBody() {
  type Task = {
    id: string
    kind: string
    title: string
    status: string
    priority: string
    owner_label: string | null
  }
  let rows: Task[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_operational_tasks')
      .select('id, kind, title, status, priority, owner_label, due_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50)
    if (error) throw error
    rows = (data ?? []) as Task[]
  } catch {
    return <Unconnected>營運表未接駁（migration 0029）。</Unconnected>
  }
  if (!rows.length) return <Unconnected>目前冇營運任務。</Unconnected>
  return (
    <ul className="space-y-2">
      {rows.map((t) => (
        <li key={t.id} className="fos-panel p-3 text-sm">
          <p className="font-medium">{t.title}</p>
          <p className="text-xs text-[var(--fos-muted)]">
            {t.kind} · {t.status} · {t.priority}
            {t.owner_label ? ` · ${t.owner_label}` : ''}
          </p>
        </li>
      ))}
    </ul>
  )
}

async function IncidentsBody() {
  type Inc = {
    id: string
    title: string
    severity: string
    status: string
    impact: string | null
    owner_label: string | null
  }
  let rows: Inc[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_incidents')
      .select('id, title, severity, status, impact, owner_label, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50)
    if (error) throw error
    rows = (data ?? []) as Inc[]
  } catch {
    return <Unconnected>事故表未接駁（migration 0029）。</Unconnected>
  }
  if (!rows.length) return <Unconnected>目前冇事故紀錄。</Unconnected>
  return (
    <ul className="space-y-2">
      {rows.map((i) => (
        <li key={i.id} className="fos-panel p-3 text-sm">
          <p className="font-medium">
            [{i.severity}] {i.title}
          </p>
          <p className="text-xs text-[var(--fos-muted)]">
            {i.status} · {i.owner_label ?? '未指派'} · {i.impact ?? ''}
          </p>
        </li>
      ))}
    </ul>
  )
}

async function FinanceBody() {
  type Budget = {
    id: string
    label: string
    period_start: string
    period_end: string
    amount: number
    currency: string
    amount_hkd: number | null
    spent_amount: number
    spent_currency: string
    spent_hkd: number | null
  }
  let rows: Budget[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_budgets')
      .select('*')
      .order('period_start', { ascending: false })
      .limit(12)
    if (error) throw error
    rows = (data ?? []) as Budget[]
  } catch {
    return <Unconnected>預算表未接駁。</Unconnected>
  }
  if (!rows.length) {
    return (
      <Unconnected>
        未有預算列。憲章成本死鎖約 US$200／月；請喺 DB 新增 founder_budgets 列。金額會顯示 HKD（若有
        amount_hkd），並保留原始幣別。
      </Unconnected>
    )
  }
  return (
    <ul className="space-y-2">
      {rows.map((b) => (
        <li key={b.id} className="fos-panel p-3 text-sm">
          <p className="font-medium">{b.label}</p>
          <p className="text-xs text-[var(--fos-muted)]">
            {b.period_start} → {b.period_end} · 預算 {b.amount} {b.currency}
            {b.amount_hkd != null ? `（約 HKD ${b.amount_hkd}）` : ''}
          </p>
          <p className="text-xs">
            已用 {b.spent_amount} {b.spent_currency}
            {b.spent_hkd != null ? `（HKD ${b.spent_hkd}）` : ''}
          </p>
        </li>
      ))}
    </ul>
  )
}

async function IntegrationsBody() {
  type Row = { key: string; label: string; status: string; detail: string | null }
  let rows: Row[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from('founder_integration_status').select('*').order('key')
    if (error) throw error
    rows = (data ?? []) as Row[]
  } catch {
    return <Unconnected>整合狀態表未接駁。</Unconnected>
  }
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.key} className="fos-panel flex items-start justify-between gap-3 p-3 text-sm">
          <div>
            <p className="font-medium">{row.label}</p>
            <p className="text-xs text-[var(--fos-faint)]">{row.detail}</p>
          </div>
          <span className="text-xs text-[var(--fos-muted)]">{row.status}</span>
        </li>
      ))}
    </ul>
  )
}

async function SessionsBody() {
  const founder = await requireFounder()
  const { getFounderGate } = await import('@/lib/founder/mfa/gate')
  const { founderMfaIdleSec, founderMfaMaxAgeSec } = await import('@/lib/founder/mfa/config')
  const gate = await getFounderGate()
  const mfaAt =
    gate.state === 'full'
      ? new Date(gate.mfaVerifiedAt).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong', hour12: false })
      : '—'
  return (
    <div className="fos-panel space-y-2 p-4 text-sm">
      <p>目前 Founder session：{founder && gate.state === 'full' ? 'Google + TOTP（AAL2）有效' : '無完整授權'}</p>
      <p className="text-xs text-[var(--fos-muted)]">電郵：{founder?.email}</p>
      <p className="text-xs text-[var(--fos-muted)]">
        MFA 驗證時間（Asia/Hong_Kong）：{mfaAt}
        {gate.state === 'full' ? ` · 因素版本 ${gate.factorVersion}` : ''}
      </p>
      <p className="text-xs text-[var(--fos-muted)]">
        閒置上限 {founderMfaIdleSec()}s · 最長 {founderMfaMaxAgeSec()}s · 每次新登入都要 TOTP
      </p>
      <p className="text-xs text-[var(--fos-faint)]">
        撤銷：頂部「登出」（清除 Supabase session），或 Google 帳戶撤銷本應用授權。緊急撤銷 MFA：部署腳本{' '}
        <code>scripts/founder-mfa-emergency-revoke.mts</code>。MFA 狀態綁定登入工作階段，唔係 User 列上永久
        mfaPassed。
      </p>
    </div>
  )
}

async function SecurityBody() {
  type Ev = { id: number; created_at: string; action: string; summary: string | null }
  let rows: Ev[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_audit_events')
      .select('id, created_at, action, result, summary')
      .eq('result', 'denied')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    rows = (data ?? []) as Ev[]
  } catch {
    return <Unconnected>審計表未接駁。</Unconnected>
  }
  if (!rows.length) return <Unconnected>最近冇 denied 審計事件。</Unconnected>
  return (
    <ul className="space-y-2 text-sm">
      {rows.map((e) => (
        <li key={e.id} className="fos-panel p-3">
          <p>{e.action}</p>
          <p className="text-xs text-[var(--fos-faint)]">
            {new Date(e.created_at).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong', hour12: false })} ·{' '}
            {e.summary}
          </p>
        </li>
      ))}
    </ul>
  )
}

async function SettingsIdentityBody() {
  const founder = await requireFounder()
  const subSet = Boolean(process.env.FOUNDER_GOOGLE_SUB?.trim())
  return (
    <div className="fos-panel space-y-3 p-4 text-sm">
      <p>
        允許電郵（唯讀）：<code className="text-[var(--fos-cyan)]">{FOUNDER_EMAIL}</code>
      </p>
      <p>FOUNDER_GOOGLE_SUB：{subSet ? '已設定（值唔顯示）' : '未設定'}</p>
      <p>目前登入：{founder?.email ?? '—'}</p>
      <p>環境：{founderEnvLabel(getFounderDeployEnv())}</p>
      <p className="text-xs text-[var(--fos-muted)]">{founderBindingInstructions()}</p>
      <p className="text-xs text-[var(--fos-warn)]">Founder OS 不提供新增其他創辦人嘅一般介面。</p>
      <p className="text-xs text-[var(--fos-faint)]">
        進入後台必須：Google 身份（電郵＋sub＋email_verified）＋ Google Authenticator 相容 TOTP（AAL2）。TOTP
        唔取代身份檢查，亦唔係防釣魚驗證。詳見「安全設定」。
      </p>
    </div>
  )
}

async function AuditBody() {
  type Ev = {
    id: number
    created_at: string
    actor_email: string
    action: string
    target_type: string
    target_id: string | null
    result: string
  }
  let rows: Ev[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_audit_events')
      .select('id, created_at, actor_email, action, target_type, target_id, result, summary, correlation_id')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    rows = (data ?? []) as Ev[]
  } catch {
    return <Unconnected>審計表未接駁。</Unconnected>
  }
  if (!rows.length) return <Unconnected>尚未有審計事件。</Unconnected>
  return (
    <div className="fos-panel overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="text-xs text-[var(--fos-muted)]">
          <tr>
            <th className="px-3 py-2">時間</th>
            <th className="px-3 py-2">動作</th>
            <th className="px-3 py-2">目標</th>
            <th className="px-3 py-2">結果</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-t border-[var(--fos-border-soft)]">
              <td className="px-3 py-2 text-xs text-[var(--fos-faint)]">
                {new Date(e.created_at).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong', hour12: false })}
              </td>
              <td className="px-3 py-2">
                {e.action}
                <div className="text-[10px] text-[var(--fos-faint)]">{e.actor_email}</div>
              </td>
              <td className="px-3 py-2 text-xs">
                {e.target_type}
                {e.target_id ? `:${e.target_id}` : ''}
              </td>
              <td className="px-3 py-2">{e.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

async function FlagsBody() {
  type Flag = { key: string; label: string; description: string | null; enabled: boolean }
  let rows: Flag[] | null = null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from('founder_feature_flags').select('*').order('key')
    if (error) throw error
    rows = (data ?? []) as Flag[]
  } catch {
    return <Unconnected>功能開關表未接駁。</Unconnected>
  }
  return (
    <ul className="space-y-2">
      {rows.map((f) => (
        <li key={f.key} className="fos-panel flex justify-between gap-3 p-3 text-sm">
          <div>
            <p className="font-medium">{f.label}</p>
            <p className="text-xs text-[var(--fos-faint)]">{f.description}</p>
          </div>
          <span className={f.enabled ? 'text-[var(--fos-ok)]' : 'text-[var(--fos-muted)]'}>
            {f.enabled ? 'ON' : 'OFF'}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Stat({
  label,
  m,
}: {
  label: string
  m: { state: string; value?: number; reason?: string }
}) {
  return (
    <div className="fos-panel p-3">
      <p className="fos-metric-label">{label}</p>
      <p className="fos-metric-value text-[length:1.25rem]">
        {m.state === 'ok' && typeof m.value === 'number' ? m.value.toLocaleString('zh-HK') : '—'}
      </p>
      {m.state !== 'ok' && <p className="text-[10px] text-[var(--fos-faint)]">{m.reason ?? m.state}</p>}
    </div>
  )
}
