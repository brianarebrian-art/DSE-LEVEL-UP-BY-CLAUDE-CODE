import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { getSubjectQuestions } from '@/data/questions'
import { subjects } from '@/data/subjects'
import { safeLog } from '@/lib/safeLog'
import { ReviewPanel, type Batch, type HistoryRow } from './ReviewPanel'

// Admin 審核面板 — 只限 ADMIN_EMAILS 白名單（兩位創辦人）。中文單語內部工具。
// 身份唔夠 → 直接彈返首頁，頁面唔會透露自己存在啲乜。
export const dynamic = 'force-dynamic'

interface DraftRow {
  id: string
  subject: string
  topic?: string
  difficulty?: string
  question: string
  // 混合題型（2026-07-31）：MC 有 options／correctIndex，
  // 書寫題（text／long）改為 referenceAnswer（＋ long 可有 markingScheme）。
  type?: 'mc' | 'text' | 'long'
  options?: string[]
  correctIndex?: number
  referenceAnswer?: string
  markingScheme?: string
  explanation: string
  trapTypes?: string[]
  dnaTag?: string
}

const DRAFTS_DIR = join(process.cwd(), 'scripts', 'qbank', 'drafts')
const SENSEI_DIR = join(process.cwd(), 'data', 'sensei')

/** SENSEI 知識卡草稿。同題目共用同一個覆核面板，只係渲染分支唔同。 */
interface CardRow {
  id: string
  subject: string
  topic: string
  subTopic?: string
  difficulty?: string
  concept: string
  example: string
  examTechnique: string
  commonTrap: string
  keywords?: string[]
}

/**
 * 把 data/sensei/<科>/drafts/*.json 併入同一條覆核隊列。
 *
 * 點解唔另起一個面板：簽名紀律只應該有一套。多開一個介面，就會有第二套
 * 「邊個批准過」嘅規則，兩套將來一定會分歧。批次名加 `sensei/` 前綴，
 * pull-decisions.mjs 靠呢個前綴決定寫返邊個 decisions 檔。
 */
function loadSenseiBatches(): Batch[] {
  const out: Batch[] = []
  let subjectDirs: string[] = []
  try {
    subjectDirs = readdirSync(SENSEI_DIR, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()
  } catch (e) {
    safeLog('warn', 'admin: sensei dir unreadable', e)
    return []
  }
  for (const subject of subjectDirs) {
    const dir = join(SENSEI_DIR, subject, 'drafts')
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.decisions.json')).sort()) {
      const stem = file.replace(/\.json$/, '')
      try {
        const rows = JSON.parse(readFileSync(join(dir, file), 'utf8')) as CardRow[]
        if (!Array.isArray(rows) || rows.length === 0) continue
        let local: Record<string, string> = {}
        const decPath = join(dir, `${stem}.decisions.json`)
        if (existsSync(decPath)) local = (JSON.parse(readFileSync(decPath, 'utf8'))?.decisions ?? {}) as Record<string, string>
        out.push({
          batch: `sensei/${subject}/${stem}`,
          subject,
          rows: rows.map((r) => ({
            id: r.id,
            subject: r.subject,
            topic: r.subTopic ? `${r.topic}・${r.subTopic}` : r.topic,
            difficulty: r.difficulty ?? '',
            // `question` 喺卡片語境即係卡片標題；面板用佢做每行嘅頭。
            question: r.topic,
            type: 'card' as const,
            concept: r.concept,
            example: r.example,
            examTechnique: r.examTechnique,
            commonTrap: r.commonTrap,
            explanation: (r.keywords ?? []).join('、'), // i18n-exempt: admin 中文單語內部工具
            trapTypes: [],
            dnaTag: '',
            status: local[r.id] === 'approved' || local[r.id] === 'rejected' ? local[r.id] : 'pending',
            decidedBy: '',
          })),
        })
      } catch (e) {
        safeLog('warn', `admin: bad sensei drafts file ${subject}/${file}`, e)
      }
    }
  }
  return out
}

function loadBatches(): Batch[] {
  let files: string[] = []
  try {
    files = readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.json') && !f.endsWith('.decisions.json'))
  } catch (e) {
    safeLog('warn', 'admin: drafts dir unreadable', e)
    return []
  }
  const batches: Batch[] = []
  for (const file of files.sort()) {
    const stem = file.replace(/\.json$/, '')
    try {
      const rows = JSON.parse(readFileSync(join(DRAFTS_DIR, file), 'utf8')) as DraftRow[]
      if (!Array.isArray(rows) || rows.length === 0) continue
      // 本地已有嘅 decisions（review.html 匯出流程）都計入狀態
      let local: Record<string, string> = {}
      const decPath = join(DRAFTS_DIR, `${stem}.decisions.json`)
      if (existsSync(decPath)) {
        const doc = JSON.parse(readFileSync(decPath, 'utf8'))
        local = (doc?.decisions ?? {}) as Record<string, string>
      }
      batches.push({
        batch: stem,
        subject: rows[0]?.subject ?? 'unknown',
        rows: rows.map((r) => ({
          id: r.id,
          subject: r.subject,
          topic: r.topic ?? '',
          difficulty: r.difficulty ?? '',
          question: r.question,
          type: r.type ?? 'mc',
          options: r.options,
          correctIndex: r.correctIndex,
          referenceAnswer: r.referenceAnswer,
          markingScheme: r.markingScheme,
          explanation: r.explanation,
          trapTypes: r.trapTypes ?? [],
          dnaTag: r.dnaTag ?? '',
          status: local[r.id] === 'approved' || local[r.id] === 'rejected' ? local[r.id] : 'pending',
          decidedBy: '',
        })),
      })
    } catch (e) {
      safeLog('warn', `admin: bad drafts file ${file}`, e)
    }
  }
  return batches
}

export default async function AdminPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/')

  // ── 全站覆蓋率（實時由真題庫計，唔寫死數字）─────────────────────────────
  let liveTotal = 0
  let reviewedTotal = 0
  for (const s of subjects) {
    const qs = getSubjectQuestions(s.id)
    liveTotal += qs.length
    reviewedTotal += qs.filter((q) => q.framework === 'reviewed').length
  }

  // ── 隊列 + 歷史（Supabase 未配置時降級為「本地 decisions only」照用）────
  const batches = [...loadBatches(), ...loadSenseiBatches()]
  let history: HistoryRow[] = []
  let dbOk = true
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('review_decisions')
      .select('batch, draft_id, subject, topic, decision, comment, reviewer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    history = (data ?? []) as HistoryRow[]
    // DB 決定覆蓋本地狀態（同一題取最新一筆 —— data 已按時間倒序，first win）
    const latest = new Map<string, HistoryRow>()
    for (const d of history) {
      const key = `${d.batch}::${d.draft_id}`
      if (!latest.has(key)) latest.set(key, d)
    }
    for (const b of batches) {
      for (const r of b.rows) {
        const hit = latest.get(`${b.batch}::${r.id}`)
        if (hit) {
          r.status = hit.decision
          r.decidedBy = hit.reviewer_name ?? ''
        }
      }
    }
  } catch (e) {
    dbOk = false
    safeLog('warn', 'admin: supabase unavailable, local-only mode', e)
  }

  const pendingCount = batches.reduce((n, b) => n + b.rows.filter((r) => r.status === 'pending').length, 0)
  const pct = liveTotal > 0 ? ((reviewedTotal / liveTotal) * 100).toFixed(2) : '0'

  return (
    // Light-first（憲章 §3，2026-07-22 遷移）：/admin 係最後一個仍為深色霓虹嘅內部工具，
    // 依 dashboard/result 慣例補 bg-surface text-ink-soft（<body> 仍暗色，唔補就穿底）。
    <div className="min-h-screen bg-surface text-ink-soft">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-medium text-ink">🔒 審核面板{/* i18n-exempt: admin 內部工具，只限創辦人 */}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {admin.name}（{admin.email}）{/* i18n-exempt: admin */}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="全站 Live 題數" /* i18n-exempt: admin */ value={liveTotal.toLocaleString()} className="text-accent" />
            <StatCard label="人手簽名題數" /* i18n-exempt: admin */ value={reviewedTotal.toLocaleString()} className="text-violet" />
            <StatCard label="覆蓋率" /* i18n-exempt: admin */ value={`${pct}%`} className="text-gold" />
            <StatCard label="待審題數" /* i18n-exempt: admin */ value={pendingCount.toLocaleString()} className="text-rose" />
          </div>
          {!dbOk && (
            <p className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold-strong">
              ⚠️ Supabase 未連通 —— 決定暫時冇得喺網上儲存，隊列狀態只反映 repo 內本地 decisions。{/* i18n-exempt: admin */}
            </p>
          )}
        </header>

        <ReviewPanel batches={batches} history={history} dbOk={dbOk} />

        <p className="mt-10 text-xs text-ink-muted">
          入庫唯一路徑：pull-decisions → promote-drafts（本地）→ 人手 wire → push。呢個面板只記錄決定，唔會自動改題庫。{/* i18n-exempt: admin */}
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised px-4 py-3">
      <div className={`text-2xl font-semibold ${className}`}>{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
    </div>
  )
}
