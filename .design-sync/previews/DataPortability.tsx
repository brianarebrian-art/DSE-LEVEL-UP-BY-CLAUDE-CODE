import { DataPortability } from 'dse-level-up'

// 進度檔案導出／導入（$0 跨裝置方案，取代技術不成立嘅 QR Code 同步）。 純 client-side：<a download> 出 JSON、<input type="file"> 入 JSON，零後端、零新依賴。 

export function Default() {
  return (
    <div className="max-w-lg">
      <DataPortability />
    </div>
  )
}
