import { ConceptNet } from 'dse-level-up'

// 概念網 —— 課題之間嘅關係圖。純 SVG，零圖表庫（憲章 §3 禁 Chart.js／D3／Recharts）。

export function Default() {
  return (
    <div className="max-w-2xl">
      <ConceptNet />
    </div>
  )
}
