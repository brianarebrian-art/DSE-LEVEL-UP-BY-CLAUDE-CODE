import { QRCode } from 'dse-level-up'

// 純前端 QR 碼（零依賴、零 API）。用嚟畀學生將自己嘅溫書地圖／戰績卡
// 由電話帶去另一部機，唔使登入。

export function SiteLink() {
  return <QRCode value="https://dse-level-up-by-claude-code.vercel.app/" />
}

export function Larger() {
  return <QRCode value="https://dse-level-up-by-claude-code.vercel.app/practice" size={200} />
}
