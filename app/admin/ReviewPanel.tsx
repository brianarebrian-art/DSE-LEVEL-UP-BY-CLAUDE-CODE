'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

// Admin 審核面板互動層（中文單語內部工具，i18n-exempt 全檔適用）。
// 每撳「提交」即 POST 一筆去 /api/admin，成功後 800ms 自動跳去下一條待審題
// （唔 reload 成頁 —— 保住捲動位同已展開狀態）。
//
// 誠實界線：喺呢個面板撳「通過」只係【記錄一個決定】入 Supabase，唔等於題目
// 已入題庫。入庫仍需本地 pull-decisions → promote-drafts → 人手 wire → push。
// 所以計數一律叫「已記錄決定」，唔會顯示「累積簽名 +N」呢類會令人誤會即時入庫嘅字眼。

export interface BatchRow {
  id: string
  subject: string
  topic: string
  difficulty: string
  question: string
  // 2026-07-31：題庫已放寬至混合題型。MC 有 options／correctIndex；
  // 書寫題（text／long）冇，改為 referenceAnswer（＋ long 可有 markingScheme）。
  // 兩組欄位都設為選填，覆核面板按 `type` 分流顯示。
  // 2026-08-26：加 'card' —— SENSEI 知識卡共用同一條覆核隊列同同一套簽名紀律。
  type?: 'mc' | 'text' | 'long' | 'card'
  // 知識卡四段式（type === 'card' 時有）
  concept?: string
  example?: string
  examTechnique?: string
  commonTrap?: string
  options?: string[]
  correctIndex?: number
  referenceAnswer?: string
  markingScheme?: string
  explanation: string
  trapTypes: string[]
  dnaTag: string
  status: string // pending | approved | rejected
  decidedBy: string
}

export interface Batch {
  batch: string
  subject: string
  rows: BatchRow[]
}

export interface HistoryRow {
  batch: string
  draft_id: string
  subject: string
  topic: string | null
  decision: string
  comment: string | null
  reviewer_name: string | null
  created_at: string
}

type Decision = 'approved' | 'rejected' | 'pending'

// 草稿銀碼以 \$ 逃逸（LaTeX 閘要求）；顯示層還原做 $，唔郁底層數據。
const unesc = (s: string) => s.replace(/\\\$/g, '$')

// Light-first（憲章 §3，2026-07-22）：全檔由深色霓虹遷移為淺色 token。
// 決定色語意：通過=青 #008B84 / 退回=玫 #C2185B（非鮮紅）/ 暫緩=金 #B8860B。
// 互動邏輯（掃描、快捷鍵、自動跳題、Supabase 寫入）一律不變。
const DIFF_ZH: Record<string, string> = { basic: '基礎', intermediate: '核心', hard: '進階' } // i18n-exempt: admin
const STATUS_ZH: Record<string, string> = { pending: '待審', approved: '已通過', rejected: '已退回' } // i18n-exempt: admin

const keyOf = (batch: string, id: string) => `${batch}::${id}` // 全 ASCII，可安全做 DOM id

export function ReviewPanel({ batches, history, dbOk }: { batches: Batch[]; history: HistoryRow[]; dbOk: boolean }) {
  // 扁平化：跨批次嘅有序題目清單，供「下一條」遞進用。
  const flat = useMemo(
    () => batches.flatMap((b) => b.rows.map((row) => ({ batch: b.batch, row }))),
    [batches],
  )

  // 逐題狀態集中喺父層管理（提交後就地更新，唔重載頁）。
  const [statuses, setStatuses] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const { batch, row } of flat) m[keyOf(batch, row.id)] = row.status
    return m
  })
  const [activeKey, setActiveKey] = useState<string | null>(() => {
    const first = flat.find(({ row }) => row.status === 'pending')
    return first ? keyOf(first.batch, first.row.id) : null
  })
  const [recorded, setRecorded] = useState(0) // 本節已記錄決定數

  // activeKey 一變就將該卡捲入畫面中央。
  useEffect(() => {
    if (!activeKey) return
    document.getElementById(`card-${activeKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeKey])

  // 由 fromKey 之後搵下一條 pending；搵唔到就繞返頭搵最早一條；再冇就 null。
  const nextPending = useCallback(
    (statusMap: Record<string, string>, fromKey: string): string | null => {
      const idx = flat.findIndex(({ batch, row }) => keyOf(batch, row.id) === fromKey)
      for (let i = idx + 1; i < flat.length; i++) {
        const k = keyOf(flat[i].batch, flat[i].row.id)
        if (statusMap[k] === 'pending') return k
      }
      for (let i = 0; i < idx; i++) {
        const k = keyOf(flat[i].batch, flat[i].row.id)
        if (statusMap[k] === 'pending') return k
      }
      return null
    },
    [flat],
  )

  const onDecided = useCallback(
    (key: string, decision: Decision) => {
      setStatuses((prev) => {
        const updated = { ...prev, [key]: decision }
        setActiveKey(nextPending(updated, key))
        return updated
      })
      setRecorded((n) => n + 1)
    },
    [nextPending],
  )

  const total = flat.length
  const decidedCount = Object.values(statuses).filter((s) => s !== 'pending').length
  const pendingCount = total - decidedCount
  const allDone = total > 0 && pendingCount === 0

  return (
    <div>
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-accent-strong">📋 待審隊列{/* i18n-exempt: admin */}</h2>
          {total > 0 && (
            <span className="text-sm text-ink-muted">
              本節已記錄 {recorded} · 待審 {pendingCount} / {total}{/* i18n-exempt: admin */}
            </span>
          )}
        </div>

        {total > 0 && (
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-accent-strong transition-all duration-300" style={{ width: `${(decidedCount / total) * 100}%` }} />
          </div>
        )}

        {batches.length === 0 && (
          <p className="text-sm text-ink-muted">而家冇任何草稿批次 —— 出咗新草稿先會喺度出現。{/* i18n-exempt: admin */}</p>
        )}

        {allDone && (
          <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
            <div className="mb-2 text-4xl">🎉</div>
            <h3 className="mb-1 text-xl font-medium text-accent-strong">隊列清空！{/* i18n-exempt: admin */}</h3>
            <p className="text-sm text-ink-muted">本節已記錄 {recorded} 條決定。{/* i18n-exempt: admin */}</p>
            <p className="mx-auto mt-3 max-w-md text-xs text-ink-muted">
              ⚠️ 記錄決定 ≠ 入題庫。呢啲決定要喺本地行 pull-decisions → promote-drafts → 人手 wire → push 先正式入庫並顯示「人手核對題」badge。{/* i18n-exempt: admin */}
            </p>
          </div>
        )}

        {batches.map((b) => (
          <BatchBlock key={b.batch} batch={b} statuses={statuses} activeKey={activeKey} onActivate={setActiveKey} onDecided={onDecided} dbOk={dbOk} />
        ))}

        {!dbOk && total > 0 && (
          <p className="mt-4 text-xs text-gold-strong">
            ⚠️ Supabase 未連通，暫時淨係睇得、記錄唔到 —— 撳鍵可以預選決定，但「提交」要等資料庫接通。{/* i18n-exempt: admin */}
          </p>
        )}
        {dbOk && total > 0 && (
          <p className="mt-4 text-xs text-ink-muted">
            ⌨️ 快捷鍵：A / R / P（或 1 / 2 / 3）= 通過 / 退回 / 暫緩 · Enter = 提交（打緊備註時唔會觸發）。{/* i18n-exempt: admin */}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-violet">📜 審核歷史（雲端最新 200 筆）{/* i18n-exempt: admin */}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-ink-muted">未有雲端紀錄。{/* i18n-exempt: admin */}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line-strong">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-sunken text-xs text-ink-muted">
                <tr>
                  <th className="px-3 py-2">時間{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">批次 / 題目{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">決定{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">覆核人{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">備註{/* i18n-exempt: admin */}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-ink-muted">{h.created_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{h.batch} · {h.draft_id}</td>
                    <td className="px-3 py-2">{STATUS_ZH[h.decision] ?? h.decision}</td>
                    <td className="px-3 py-2">{h.reviewer_name ?? '—'}</td>
                    <td className="px-3 py-2 text-xs text-ink-muted">{h.comment ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function BatchBlock({
  batch,
  statuses,
  activeKey,
  onActivate,
  onDecided,
  dbOk,
}: {
  batch: Batch
  statuses: Record<string, string>
  activeKey: string | null
  onActivate: (key: string) => void
  onDecided: (key: string, decision: Decision) => void
  dbOk: boolean
}) {
  const pending = batch.rows.filter((r) => statuses[keyOf(batch.batch, r.id)] === 'pending').length
  return (
    <div className="mb-6 rounded-2xl border border-line-strong bg-surface-sunken p-4">
      <h3 className="mb-3 font-semibold">
        {batch.batch}
        <span className="ml-2 text-sm text-ink-muted">
          {batch.subject} · {batch.rows.length} 題 · 待審 {pending}{/* i18n-exempt: admin */}
        </span>
      </h3>
      {batch.rows.map((r) => {
        const key = keyOf(batch.batch, r.id)
        return (
          <ReviewCard
            key={key}
            cardKey={key}
            batchName={batch.batch}
            row={r}
            status={statuses[key] ?? 'pending'}
            isActive={activeKey === key}
            onActivate={onActivate}
            onDecided={onDecided}
            dbOk={dbOk}
          />
        )
      })}
    </div>
  )
}

function ReviewCard({
  cardKey,
  batchName,
  row,
  status,
  isActive,
  onActivate,
  onDecided,
  dbOk,
}: {
  cardKey: string
  batchName: string
  row: BatchRow
  status: string
  isActive: boolean
  onActivate: (key: string) => void
  onDecided: (key: string, decision: Decision) => void
  dbOk: boolean
}) {
  const [choice, setChoice] = useState<Decision | null>(null)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(false) // 提交成功後短暫「已記錄，載入下一題…」
  const [err, setErr] = useState('')

  const submit = useCallback(async () => {
    if (!choice || busy || !dbOk) return
    setBusy(true)
    setErr('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: batchName, draft_id: row.id, subject: row.subject, topic: row.topic, decision: choice, comment }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setFlash(true)
      // 畀 800ms 睇到「已記錄」狀態，再通知父層更新狀態 + 遞進下一題。
      setTimeout(() => onDecided(cardKey, choice), 800)
    } catch {
      setErr('提交失敗 —— 檢查網絡或 Supabase 配置後再試。') // i18n-exempt: admin
      setBusy(false)
    }
  }, [choice, busy, dbOk, batchName, row.id, row.subject, row.topic, comment, cardKey, onDecided])

  // 快捷鍵只喺「活躍卡」生效（同一時間只有一張活躍 → 只有一個 listener）。
  useEffect(() => {
    if (!isActive || flash) return
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return // 打緊備註，唔搶鍵
      switch (e.key.toLowerCase()) {
        case 'a': case '1': setChoice('approved'); e.preventDefault(); break
        case 'r': case '2': setChoice('rejected'); e.preventDefault(); break
        case 'p': case '3': setChoice('pending'); e.preventDefault(); break
        case 'enter': if (choice) { e.preventDefault(); void submit() } break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, flash, choice, submit])

  const expanded = isActive
  const statusChip =
    status === 'approved' ? 'text-accent border-accent/40' : status === 'rejected' ? 'text-rose border-rose/40' : 'text-gold border-gold/40'

  return (
    <div id={`card-${cardKey}`} className={`mb-3 rounded-xl border bg-surface-raised p-4 ${isActive ? 'border-accent/50' : 'border-line-strong'}`}>
      <button type="button" onClick={() => onActivate(cardKey)} className="flex w-full items-center gap-2 text-left">
        <span className={`rounded-full border px-2 py-0.5 text-xs ${statusChip}`}>{STATUS_ZH[status] ?? status}</span>
        {row.difficulty && <span className="rounded bg-surface-sunken px-2 py-0.5 text-xs text-ink-muted">{DIFF_ZH[row.difficulty] ?? row.difficulty}</span>}
        {row.dnaTag && <span className="rounded bg-surface-sunken px-2 py-0.5 text-xs text-ink-muted">🧠 {row.dnaTag}</span>}
        {row.type && row.type !== 'mc' && (
          <span className="rounded bg-surface-sunken px-2 py-0.5 text-xs text-accent">{row.type === 'card' ? '知識卡' : row.type === 'long' ? '長題目' : '文字題'}{/* i18n-exempt: admin */}</span>
        )}
        <span className="min-w-0 flex-1 truncate text-sm">{row.id} · {unesc(row.question)}</span>
        <span className="text-ink-muted">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div className="mt-3">
          <p className="mb-3 leading-relaxed">{unesc(row.question)}</p>
          {row.type === 'card' ? (
            /* SENSEI 知識卡：覆核人要睇嘅係四段內容本身啱唔啱、學生睇完會唔會誤解。
               冇選項、冇正解、冇分數 —— 憲章 §16.A：卡片一分都唔出。 */
            <div className="mb-3 space-y-2">
              {([
                ['概念', row.concept], // i18n-exempt: admin 中文單語內部工具
                ['例子', row.example], // i18n-exempt: admin 中文單語內部工具
                ['考試技巧', row.examTechnique], // i18n-exempt: admin 中文單語內部工具
                ['常見陷阱', row.commonTrap], // i18n-exempt: admin 中文單語內部工具
              ] as const).map(([label, body]) => (
                <div key={label} className="rounded-lg border border-line-strong bg-surface-sunken p-3 text-sm leading-relaxed">
                  <span className="mb-1 block text-xs font-medium text-accent">{label}{/* i18n-exempt: admin */}</span>
                  {unesc(body ?? '（缺失 —— 呢張唔應該過到閘，請退回）') /* i18n-exempt: admin 覆核面板 */}
                </div>
              ))}
              <p className="text-xs leading-relaxed text-gold">
                ⚠️ 知識卡：SENSEI 只【檢索】呢啲內容，唔會自行生成，亦唔會出任何分數。{/* i18n-exempt: admin */}
              </p>
            </div>
          ) : (row.type ?? 'mc') === 'mc' ? (
            <div className="mb-3 space-y-2">
              {(row.options ?? []).map((opt, i) => (
                <div key={i} className={`rounded-lg border p-3 text-sm ${i === row.correctIndex ? 'border-accent/50 bg-accent/10' : 'border-line-strong'}`}>
                  {unesc(opt)}
                  {i === row.correctIndex && <span className="ml-2 text-xs font-medium text-accent">✓ 正解{/* i18n-exempt: admin */}</span>}
                  {row.trapTypes[i] && row.trapTypes[i] !== 'correct' && (
                    <span className="ml-2 rounded bg-surface-sunken px-1.5 py-0.5 text-xs text-ink-muted">{row.trapTypes[i]}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* 書寫題：冇選項可揀，覆核人要睇嘅係「參考答案本身啱唔啱、
               夠唔夠學生自己對照判斷」。冇得睇就等於盲批。 */
            <div className="mb-3 space-y-2">
              <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm leading-relaxed">
                <span className="mb-1 block text-xs font-medium text-accent">參考答案（學生提交後見到，用作自評）{/* i18n-exempt: admin */}</span>
                {unesc(row.referenceAnswer ?? '（缺失 —— 呢條唔應該過到閘，請退回）') /* i18n-exempt: admin 覆核面板，只有實名審批人見到 */}
              </div>
              {row.markingScheme && (
                <div className="rounded-lg border border-line-strong bg-surface-sunken p-3 text-sm leading-relaxed">
                  <span className="mb-1 block text-xs text-ink-muted">評分準則 / 步驟分{/* i18n-exempt: admin */}</span>
                  {unesc(row.markingScheme)}
                </div>
              )}
              <p className="text-xs leading-relaxed text-gold">
                ⚠️ {row.type === 'long' ? '長題目' : '文字題'}：機器【永不】批改，學生對照參考答案自評。{/* i18n-exempt: admin */}
              </p>
            </div>
          )}
          <div className="mb-4 rounded-lg border border-line-strong bg-surface-sunken p-3 text-sm leading-relaxed">
            <span className="mb-1 block text-xs text-ink-muted">{row.type === 'card' ? '檢索關鍵詞' : '解析'}{/* i18n-exempt: admin */}</span>
            {unesc(row.explanation)}
          </div>

          {flash ? (
            <p className="text-sm font-medium text-accent">✓ 已記錄，載入下一題…{/* i18n-exempt: admin */}</p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <DecisionBtn label="✅ 通過" /* i18n-exempt: admin */ active={choice === 'approved'} activeCls="bg-accent-strong text-on-accent" onClick={() => setChoice('approved')} />
              <DecisionBtn label="❌ 退回" /* i18n-exempt: admin */ active={choice === 'rejected'} activeCls="bg-rose text-white" onClick={() => setChoice('rejected')} />
              <DecisionBtn label="⏸️ 暫緩" /* i18n-exempt: admin */ active={choice === 'pending'} activeCls="bg-gold text-white" onClick={() => setChoice('pending')} />
              <input
                type="text"
                placeholder="備註（可選）" // i18n-exempt: admin
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-w-40 flex-1 rounded-lg border border-line-strong bg-surface-sunken px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => void submit()}
                disabled={!choice || busy || !dbOk}
                className="rounded-lg bg-accent-strong px-5 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
              >
                {busy ? '提交中…' : '提交決定'}{/* i18n-exempt: admin */}
              </button>
              {status !== 'pending' && <span className="text-xs text-ink-muted">（已裁決過，可再提交覆蓋）{/* i18n-exempt: admin */}</span>}
              {err && <span className="text-xs text-rose">{err}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DecisionBtn({ label, active, activeCls, onClick }: { label: string; active: boolean; activeCls: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200 ${active ? activeCls : 'bg-surface-sunken text-ink-muted hover:bg-line'}`}
    >
      {label}
    </button>
  )
}
