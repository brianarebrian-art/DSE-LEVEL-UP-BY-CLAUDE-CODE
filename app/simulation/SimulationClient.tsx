'use client'

import { useMemo, useState } from 'react'
import { Activity, Brain, Check, CircleAlert, FlaskConical, Play, RefreshCw, ShieldCheck, Sparkles, Users } from 'lucide-react'

type Mode = 'students' | 'sop'

type Agent = { name: string; profile: string; signal: string; score: number; color: string }

const agents: Agent[] = [
  { name: '阿晴', profile: '基礎穩定／時間有限', signal: '短時段、高頻率練習', score: 78, color: 'var(--color-ml-sage)' },
  { name: '子朗', profile: '概念有缺口／容易跳題', signal: '需要錯因提示先再做', score: 61, color: 'var(--color-ml-clay)' },
  { name: '芷妍', profile: '高焦慮／表現波動', signal: '先穩定情緒再輸出', score: 54, color: 'var(--color-ml-warn)' },
  { name: '浩然', profile: '主動探索／喜歡挑戰', signal: '需要清晰進階路線', score: 86, color: 'var(--color-ml-mist)' },
]

const studentFindings = [
  ['間隔練習', '最穩定改善留存', '82%'],
  ['即時揭示答案', '短期分數上升，翌日回落', '46%'],
  ['錯因分類', '令學生較願意重做', '71%'],
]

const sopFindings = [
  ['先理解，再評分', '保留錯誤後的下一步', '推薦'],
  ['一張卡一個行動', '減少首頁決策負荷', '推薦'],
  ['紅線守門', '所有內容通過術語與來源檢查', '必須'],
]

export default function SimulationClient() {
  const [mode, setMode] = useState<Mode>('students')
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const findings = mode === 'students' ? studentFindings : sopFindings
  const title = mode === 'students' ? '學生行為沙盒' : 'SOP 決策沙盒'
  const summary = useMemo(() => mode === 'students' ? '四個合成學生代理，模擬 14 日溫習週期。' : '將現有產品原則交給四個角色檢視，尋找衝突與可執行決策。', [mode])

  function runSimulation() {
    setRunning(true)
    setCompleted(false)
    window.setTimeout(() => { setRunning(false); setCompleted(true) }, 1100)
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface px-4 pb-28 pt-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <FlaskConical className="size-4" aria-hidden="true" /> Local approximation lab
            </div>
            <h1 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl">MiroFish 測試場</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">{summary} 這是本地近似測試，不代表真實學生數據或 MiroFish 執行結果。</p>
          </div>
          <button type="button" onClick={runSimulation} disabled={running} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition hover:bg-accent-hover disabled:opacity-60">
            {running ? <RefreshCw className="size-4 animate-spin" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {running ? '模擬中…' : '執行一輪模擬'}
          </button>
        </header>

        <div className="flex rounded-2xl border border-line bg-surface-raised p-1" role="tablist" aria-label="模擬模式">
          {([['students', '學生／學習行為', Users], ['sop', 'SOP／產品決策', ShieldCheck]] as const).map(([value, label, Icon]) => (
            <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => { setMode(value); setCompleted(false) }} className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition ${mode === value ? 'bg-surface-sunken text-ink' : 'text-ink-muted hover:text-ink'}`}>
              <Icon className="size-4" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="模擬摘要">
          <Metric icon={Activity} label="代理數" value="04" note="合成角色" />
          <Metric icon={Brain} label="觀察週期" value={mode === 'students' ? '14日' : '06輪'} note="固定條件" />
          <Metric icon={Sparkles} label="信號強度" value={completed ? '0.78' : '—'} note="非統計結論" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-line bg-surface-raised p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-ink-muted">角色不是個人資料，只用來測試流程反應。</p></div>
              <span className="rounded-full bg-surface-sunken px-3 py-1 text-xs text-ink-muted">{completed ? '已完成' : '待執行'}</span>
            </div>
            <div className="flex flex-col gap-3">
              {agents.map((agent) => <AgentRow key={agent.name} agent={agent} active={completed} />)}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface-raised p-5 sm:p-6">
            <div className="mb-5"><h2 className="text-lg font-semibold">初步觀察</h2><p className="mt-1 text-sm text-ink-muted">每項觀察都要再由真實測試驗證。</p></div>
            <div className="flex flex-col gap-3">{findings.map(([label, description, value]) => <div key={label} className="flex items-start justify-between gap-4 rounded-2xl bg-surface-sunken p-4"><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p></div><span className="shrink-0 text-xs font-semibold text-accent">{value}</span></div>)}</div>
          </div>
        </section>

        <aside className="flex items-start gap-3 rounded-2xl border border-line bg-surface-sunken p-4 text-sm text-ink-muted"><CircleAlert className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" /><p><strong className="text-ink">研究限制：</strong>本頁使用合成角色與固定規則；不會收集學生資料，亦不應用作評估個別學生、預測成績或取代教育專業判斷。</p></aside>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Activity; label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-line bg-surface-raised p-4"><Icon className="mb-3 size-4 text-accent" aria-hidden="true" /><p className="text-xs text-ink-muted">{label}</p><div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-semibold">{value}</span><span className="text-xs text-ink-muted">{note}</span></div></div>
}

function AgentRow({ agent, active }: { agent: Agent; active: boolean }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-line p-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${agent.color} 18%, transparent)`, color: agent.color }}>{agent.name.slice(0, 1)}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{agent.name}</p><span className="text-xs text-ink-muted">{active ? `${agent.score}%` : '—'}</span></div><p className="truncate text-xs text-ink-muted">{agent.profile} · {agent.signal}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunken"><div className="h-full rounded-full transition-all duration-700" style={{ width: active ? `${agent.score}%` : '0%', backgroundColor: agent.color }} /></div></div>{active && <Check className="size-4 text-accent" aria-label="完成" />}</div>
}
