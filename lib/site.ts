// 站點正式網址 —— 單一來源。
//
// 此值原本在 `app/layout.tsx`、`app/sitemap.ts` 各有一份字面值。收攏成單一常數
// 的直接原因：紙筆戰士會把對答案連結【印在實體試卷上】，紙一旦印出便無法修正，
// 網址寫錯等於學生掃出死連結。多處字面值正是這種錯誤的來源，故不留第二份。
export const SITE_ORIGIN = 'https://dse-level-up-by-claude-code.vercel.app'

// 官方社交帳戶（audit loop T03，2026-10-02）。頁尾及「關於我們」共用，經 ExternalLinkGate
// 先告知學生將離開本站。只用於網頁，不放上分享卡。
export const OFFICIAL_SOCIAL = [
  { platform: 'Instagram', handle: '@dselevelup', href: 'https://www.instagram.com/dselevelup' },
  { platform: 'Threads', handle: '@dselevelup', href: 'https://www.threads.com/@dselevelup' },
] as const

// 學生自發 Instagram 溫書群組的入口卡標示（創辦人回覆 36a，2026-10-08）。
// 群組頁本身已有「非官方」聲明及離站確認，但入口卡（呼吸空間、學習紀錄頁）原本只寫
// 「同戰友傾偈」「影子溫書室」，學生點擊前會以為是本站功能。凡連到 /relax/group 的卡
// 都必須顯示此句，由 lib/__tests__/ig-group-entry.test.mts 檢查。
export const IG_GROUP_ENTRY_NOTE = {
  zh: '喺 Instagram・站外・唔係官方',
  en: 'On Instagram · off-site · not official',
} as const
