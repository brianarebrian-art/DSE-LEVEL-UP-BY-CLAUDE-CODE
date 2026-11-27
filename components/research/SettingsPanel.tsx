'use client'

import { useState } from 'react'
import { DENSITIES, PREVIEW_MODES, type Density, type PreviewMode } from '@/lib/research/types'
import { useResearch } from '@/components/research/ResearchProvider'
import { Button, ErrorState, LoadingState, Panel } from '@/components/research/ui'

const PREVIEW_LABEL: Record<PreviewMode, string> = {
  ready: '正常',
  loading: '載入中',
  empty: '空白',
  error: '錯誤',
}

const DENSITY_LABEL: Record<Density, string> = {
  comfortable: '標準',
  compact: '緊湊',
}

export function SettingsPanel() {
  const { phase, store, refresh, restoreDemo, update } = useResearch()
  const [confirmRestore, setConfirmRestore] = useState(false)
  if (phase === 'loading') return <LoadingState />
  if (phase === 'error' || !store) return <ErrorState onRetry={refresh} onRestore={restoreDemo} />
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">設定</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
          只影響呢部瀏覽器點樣顯示研究工作台。載入中、空白同錯誤係預覽，唔會刪走示範問卷或回覆。學生練習、題庫同登入都唔會改。
        </p>
      </div>
      <Panel title="顯示狀態預覽">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="顯示狀態">
          {PREVIEW_MODES.map((mode) => (
            <Button
              key={mode}
              variant={store.settings.preview === mode ? 'primary' : 'secondary'}
              aria-pressed={store.settings.preview === mode}
              onClick={() => update((current) => ({ ...current, settings: { ...current.settings, preview: mode } }))}
            >
              {PREVIEW_LABEL[mode]}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-muted">其他研究頁面會跟住呢個預覽。設定頁本身保持可操作，方便你返到正常。</p>
      </Panel>
      <Panel title="密度">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="密度">
          {DENSITIES.map((density) => (
            <Button
              key={density}
              variant={store.settings.density === density ? 'primary' : 'secondary'}
              aria-pressed={store.settings.density === density}
              onClick={() => update((current) => ({ ...current, settings: { ...current.settings, density } }))}
            >
              {DENSITY_LABEL[density]}
            </Button>
          ))}
        </div>
      </Panel>
      <Panel title="示範數據">
        <p className="text-sm leading-6 text-ink-soft">還原會用內置示範問卷同回覆覆蓋呢部瀏覽器嘅研究資料，並清走未送出嘅填寫草稿。</p>
        {confirmRestore ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="warning" onClick={() => { restoreDemo(); setConfirmRestore(false) }}>確認還原</Button>
            <Button onClick={() => setConfirmRestore(false)}>取消</Button>
          </div>
        ) : (
          <Button className="mt-3" onClick={() => setConfirmRestore(true)}>還原示範數據</Button>
        )}
      </Panel>
    </div>
  )
}
