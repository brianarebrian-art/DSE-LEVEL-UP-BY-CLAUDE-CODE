'use client'

import { useMemo, useState } from 'react'
import { BarChart3, Bot, Check, CheckCircle2, Clock3, FileText, HeartHandshake, ShieldCheck, Sparkles, TrendingUp, Users, WandSparkles, X } from 'lucide-react'

type Report = {
  id: string
  subject: string
  issue: string
  count: number
  priority: string
  suggestion: string
}

const reports: Report[] = [
  { id: 'MATH-0421', subject: '數學', issue: '答案疑似不正確', count: 8, priority: '高', suggestion: '重新檢查代入步驟，第二選項可能同樣成立。' },
  { id: 'BIO-0188', subject: '生物', issue: '解析不清楚', count: 5, priority: '中', suggestion: '補充「主動運輸」與「擴散」的比較例子。' },
  { id: 'CHEM-0302', subject: '化學', issue: '題目文字問題', count: 3, priority: '低', suggestion: '將「它」改為「該離子」，避免指涉不清。' },
]

const stats = [
  ['今日開始練習', '128', '+18%', TrendingUp],
  ['完成率', '64%', '+6%', CheckCircle2],
  ['待處理回報', '16', '需人工確認', Clock3],
  ['活躍學生（示範）', '342', '匿名彙總', Users],
] as const

export default function PrototypeDashboard() {
  const [tab, setTab] = useState<'overview' | 'reports' | 'safety'>('overview')
  const [resolved, setResolved] = useState<string[]>([])
  const [generated, setGenerated] = useState(false)
  const visibleReports = useMemo(() => reports.filter((report) => !resolved.includes(report.id)), [resolved])

  return (
    <>
      <nav aria-label="管理原型分頁" className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-line bg-surface-raised p-2">
        {([['overview', '總覽'], ['reports', '回報整理助手'], ['safety', '安全與功能規劃']] as const).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={`min-h-11 shrink-0 rounded-xl px-4 text-sm transition-colors ${tab === key ? 'bg-accent-strong text-on-accent' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink'}`}>{label}</button>
        ))}
      </nav>

      {tab === 'overview' && <Overview onReports={() => setTab('reports')} />}
      {tab === 'reports' && <ReportQueue reports={visibleReports} resolved={resolved} onResolve={(id) => setResolved((current) => [...current, id])} />}
      {tab === 'safety' && <SafetyPlan />}

      <section className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm leading-6 text-gold-strong">
        <strong>原型限制：</strong>沒有連接資料庫或 AI 模型。按鈕只模擬流程，不會儲存、分析或修改任何真實用戶資料。
      </section>
    </>
  )
}

function Overview({ onReports }: { onReports: () => void }) {
  return <div className="flex flex-col gap-6">
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(([label, value, note, Icon]) => <article key={label} className="rounded-2xl border border-line bg-surface-raised p-4"><Icon aria-hidden className="mb-4 text-accent" /><div className="text-2xl font-medium tabular-nums text-ink">{value}</div><div className="mt-1 text-xs text-ink-muted">{label}</div><div className="mt-2 text-xs text-accent-strong">{note}</div></article>)}</section>
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <section className="rounded-2xl border border-line bg-surface-raised p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-ink-muted">匿名數據預覽</p><h2 className="mt-1 text-xl font-medium text-ink">學習活動趨勢</h2></div><BarChart3 aria-hidden className="text-accent" /></div><div className="flex h-44 items-end gap-2 rounded-xl bg-surface-sunken px-4 pb-4 pt-8">{[38, 52, 44, 68, 58, 82, 72, 92, 76, 86, 66, 78].map((height, index) => <div key={index} className="flex flex-1 flex-col justify-end gap-2"><div className="rounded-t-md bg-accent/70" style={{ height: `${height}%` }} /><span className="text-center text-[10px] text-ink-muted">{index + 1}</span></div>)}</div><p className="mt-3 text-xs text-ink-muted">僅展示彙總指標；不顯示姓名、學校、電郵或個別學生軌跡。</p></section>
      <section className="rounded-2xl border border-line bg-surface-raised p-5"><div className="mb-4 flex items-center gap-3"><div className="rounded-xl bg-violet/10 p-2"><Bot aria-hidden className="text-violet" /></div><div><h2 className="font-medium text-ink">每週 AI 營運報告</h2><p className="text-xs text-ink-muted">示範生成區</p></div></div><p className="text-sm leading-6 text-ink-muted">AI 會整理最常見錯誤、題目回報和完成率變化，再由創辦人確認後才作出內容決定。</p><button type="button" onClick={onReports} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet px-4 text-sm font-medium text-white hover:opacity-90"><WandSparkles aria-hidden /> 查看建議摘要</button></section>
    </div>
  </div>
}

function ReportQueue({ reports, resolved, onResolve }: { reports: Report[]; resolved: string[]; onResolve: (id: string) => void }) {
  return <section className="rounded-2xl border border-line bg-surface-raised p-5 sm:p-6"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 inline-flex items-center gap-2 text-sm text-accent-strong"><Bot aria-hidden /> 題目回報整理助手</div><h2 className="text-2xl font-medium text-ink">待人工確認的建議</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">AI 已將相似回報合併、分類及排序。你可以查看建議，然後選擇「標記已處理」；原型不會修改題庫。</p></div><span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-strong">{reports.length} 項待確認</span></div><div className="flex flex-col gap-3">{reports.map((report) => <article key={report.id} className="rounded-2xl border border-line bg-surface-sunken p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm text-ink">{report.id}</span><span className="rounded-full bg-surface-raised px-2 py-1 text-xs text-ink-muted">{report.subject}</span><span className={`rounded-full px-2 py-1 text-xs ${report.priority === '高' ? 'bg-rose/10 text-rose' : report.priority === '中' ? 'bg-gold/10 text-gold-strong' : 'bg-accent/10 text-accent-strong'}`}>{report.priority}優先</span></div><h3 className="mt-3 font-medium text-ink">{report.issue}</h3><p className="mt-1 text-sm text-ink-muted">{report.count} 份匿名回報被歸入同一組</p></div><div className="flex gap-2"><button type="button" onClick={() => onResolve(report.id)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent-strong px-3 text-sm font-medium text-on-accent"><Check aria-hidden /> 標記已處理</button><button type="button" aria-label={`暫不處理 ${report.id}`} onClick={() => onResolve(report.id)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line-strong px-3 text-ink-muted hover:text-ink"><X aria-hidden /></button></div></div><div className="mt-4 rounded-xl border border-violet/20 bg-violet/5 p-3 text-sm leading-6 text-ink-soft"><span className="font-medium text-violet">AI 建議：</span>{report.suggestion}<p className="mt-1 text-xs text-ink-muted">下一步：由管理員檢查原題、驗算答案，再決定修正、收起或保留。</p></div></article>)}{reports.length === 0 && <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center"><CheckCircle2 className="mx-auto mb-3 text-accent" aria-hidden /><p className="font-medium text-ink">示範隊列已清空</p><p className="mt-1 text-sm text-ink-muted">之後接入資料庫時，這裡會顯示真實的匿名回報。</p></div>}</div></section>
}

function SafetyPlan() {
  const items = [['資料最少化', '只保留題號、類別及匿名彙總，不把學生自由文字直接交給 AI。', FileText], ['管理員權限', '正式版本需以登入及白名單保護管理頁，並記錄每次審核決定。', ShieldCheck], ['AI 人工把關', 'AI 只分類和提出建議，不自行修改題庫、刪除資料或作心理健康診斷。', WandSparkles], ['情緒支援', '提供休息提醒及求助資源；危機訊息應轉介可信任成年人和專業服務。', HeartHandshake]] as const
  return <section className="grid gap-4 sm:grid-cols-2">{items.map(([title, text, Icon]) => <article key={title} className="rounded-2xl border border-line bg-surface-raised p-5"><Icon aria-hidden className="mb-5 text-accent" /><h2 className="text-lg font-medium text-ink">{title}</h2><p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p></article>)}</section>
}
