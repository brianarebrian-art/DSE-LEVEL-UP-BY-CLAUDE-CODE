import type { Metadata } from 'next'

// 老師大數據平台 — 版面守衛（Teacher Radar）。
//
// 點解冇喺呢度硬性擋人？真正嘅資料邊界喺 API 層：/api/teacher/* → requireRole('teacher')
// → 403，而且 service_role 查詢一律 scope 返 caller 自己（冇 IDOR）。呢個頁面本身係 client
// component，除非通過咗 server-side 角色檢查，否則攞唔到任何班別資料；未登入／學生身分會見到
// 友善提示（請登入／你係學生，去練習區啦）。如果喺 layout 硬性 redirect，就會連呢啲友善狀態
// 都殺埋，體驗更差、又冇多一分安全（資料早已喺 API 鎖死）。
//
// 所以 layout 只加兩樣真正有價值嘅嘢：
//   1. robots noindex —— 老師專區係 privileged surface，唔應該俾搜尋引擎索引。
//   2. 正式標題 —— 分頁／書籤顯示「老師大數據平台」。
export const metadata: Metadata = {
  title: '老師大數據平台 · DSE Level Up', // i18n-exempt: 靜態 SEO <title>（robots noindex 專區）
  robots: { index: false, follow: false },
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
