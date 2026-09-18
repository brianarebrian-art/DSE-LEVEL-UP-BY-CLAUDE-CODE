import { RadarChart } from 'dse-level-up'

// 純 SVG 雷達圖，零圖表庫 —— 憲章 §3 明文禁 Chart.js／D3／Recharts
// （唔係風格偏好，係 §5 成本死鎖同「嚴禁新增套件」）。
// 每條軸係一個能力維度，值 0–1。

const talent = [
  { label: '空間幾何直覺', value: 0.82 },
  { label: '代數操作', value: 0.64 },
  { label: '數據詮釋', value: 0.71 },
  { label: '文字轉方程', value: 0.45 },
  { label: '估算與驗算', value: 0.58 },
]

export function TalentRadar() {
  return <RadarChart axes={talent} />
}

// ⚠️ 冇 `size` 嗰格 —— 預覽卡每格各自縮放，兩格淨係尺寸唔同睇落一模一樣，
// 對睇卡嘅人零資訊，而且會撞 variantsIdentical。要試尺寸請睇 .d.ts。

export function ThreeAxis() {
  // 錯因三軸（A／B／C）用嘅就係同一個組件。
  return (
    <RadarChart
      axes={[
        { label: '概念盲區', value: 0.7 },
        { label: '審題陷阱', value: 0.35 },
        { label: '運算粗心', value: 0.5 },
      ]}
    />
  )
}
