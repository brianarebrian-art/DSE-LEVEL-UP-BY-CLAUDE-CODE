import type { MetadataRoute } from 'next'
import { getActiveSubjects } from '@/data/subjects'

// ── sitemap.xml（2026-07-29，Brian greenlight）────────────────────────────────
// 原則：**只收錄真實存在、且對爬蟲有內容可讀的公開頁**。
//
// 刻意不收錄的三類，逐類說明理由 ——
//
// ① `/question/{id}` ×5,167：外部規格曾要求逐題出 URL，但 `app/question/` 這個
//    路由段【並不存在】。照做等於主動邀請爬蟲索引 5,167 個 404，比沒有 sitemap
//    更差。日後若真的開設逐題頁，才在此加入。
// ② 個人化頁（`/dashboard`、`/dashboard/report`、`/result`、`/account`）：內容
//    全部由 localStorage 於客戶端產生，伺服器端渲染為空殼。收錄只會令爬蟲取得
//    一批空白頁，拖低整站品質評分。待各頁補上伺服器端內容後方可加入。
// ③ `/wall`（影子溫書室）：功能尚未上線 —— migration `0008_shadow_study_room.sql`
//    未套用，`wall_posts` 資料表並不存在。
// ④ `/admin`、`/sign-in`、`/sign-up`：權限頁，robots.txt 已明文 Disallow。
//
// 網域：dselevelup.hk 尚未購入，一律使用現行 Vercel 部署域（Brian 2026-07-29 拍板）。
const DOMAIN = 'https://dse-level-up-by-claude-code.vercel.app'

// 公開靜態頁。順序即優先級由高至低。
const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, freq: 'weekly' },
  { path: '/subjects', priority: 0.9, freq: 'weekly' },
  { path: '/practice', priority: 0.9, freq: 'weekly' },
  { path: '/notes', priority: 0.8, freq: 'weekly' },
  { path: '/methodology', priority: 0.8, freq: 'monthly' },
  { path: '/paper-warrior', priority: 0.7, freq: 'monthly' },
  { path: '/answer-sheet', priority: 0.6, freq: 'monthly' },
  { path: '/about', priority: 0.6, freq: 'monthly' },
  { path: '/transparency', priority: 0.6, freq: 'monthly' },
  { path: '/reading', priority: 0.6, freq: 'monthly' },
  { path: '/writing', priority: 0.6, freq: 'monthly' },
  { path: '/focus', priority: 0.5, freq: 'monthly' },
  { path: '/relax', priority: 0.5, freq: 'monthly' },
  { path: '/relax/breathing', priority: 0.4, freq: 'yearly' },
  { path: '/relax/grounding', priority: 0.4, freq: 'yearly' },
  { path: '/relax/solo', priority: 0.4, freq: 'yearly' },
  { path: '/relax/group', priority: 0.4, freq: 'yearly' },
  { path: '/waiting', priority: 0.4, freq: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // 科目 id 一律由 `getActiveSubjects()` 即時讀取，不另行硬編清單 ——
  // 硬編的 slug 與真實 id 脫節時會產生一批 404（例如 mathematics／math、
  // citizenship-and-social-development／csd）。衍生則永遠對得上。
  const subjectIds = getActiveSubjects().map((s) => s.id)

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${DOMAIN}${r.path}`,
      lastModified,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...subjectIds.map((id) => ({
      url: `${DOMAIN}/subjects/${id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...subjectIds.map((id) => ({
      url: `${DOMAIN}/notes/${id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
