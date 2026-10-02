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
