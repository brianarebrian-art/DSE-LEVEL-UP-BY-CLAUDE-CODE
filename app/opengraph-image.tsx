import { ImageResponse } from 'next/og'

// 社交分享卡（og:image + twitter:image）。採用 Next.js 檔案約定，建置時產生一次，
// 執行期零成本、零新增套件 —— 符合 $180.81 成本死鎖。
//
// ⚠️ 刻意全英文：`ImageResponse` 內建字型不含中日韓字符集，寫中文會渲染成豆腐方塊。
// 若日後要放中文，必須自行提供並嵌入一套繁體字型（檔案體積約 5–10 MB，且要
// 逐字 subset），屆時再評估是否值得。
//
// 品牌色沿用 light-first 系統：底 #FAFAF8、字 #1A1A1A、強調 #008B84。
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'DSE Level Up — free HKDSE practice platform'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#FAFAF8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: 20, height: 76, backgroundColor: '#008B84', borderRadius: 4 }} />
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#1A1A1A' }}>
            DSE&nbsp;<span style={{ color: '#008B84' }}>Level Up</span>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 36, fontSize: 40, color: '#2D2D2D', lineHeight: 1.35 }}>
          Free HKDSE practice — 5,167 questions, 25 subjects
        </div>

        <div style={{ display: 'flex', marginTop: 20, fontSize: 28, color: '#6B6B6B' }}>
          Master the logic, not the answers.
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 21, color: '#9CA3AF' }}>
          Independently rewritten questions · Not affiliated with the HKEAA
        </div>
      </div>
    ),
    size,
  )
}
