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
// ③ 舊「影子溫書室」（`/wall`）已於 2026-08-21 整個移除 —— 見 docs/DECISION-no-interaction.md。
//    本站【永久】唔提供任何用戶對用戶互動，所以呢度亦唔會再出現社群類路由。
// ④ `/admin`、`/sign-in`、`/sign-up`：權限頁，robots.txt 已明文 Disallow。
//
// 網域：dselevelup.hk 尚未購入，一律使用現行 Vercel 部署域（Brian 2026-07-29 拍板）。
// 2026-08-14 收攏為單一來源，理由見 lib/site.ts。
import { SITE_ORIGIN as DOMAIN } from '@/lib/site'
import { sourceLabEntries } from '@/data/history-sources'

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
  { path: '/privacy', priority: 0.6, freq: 'monthly' },
  { path: '/community-safety', priority: 0.6, freq: 'monthly' },
  { path: '/capsule', priority: 0.5, freq: 'monthly' },
  { path: '/prediction-method', priority: 0.6, freq: 'monthly' },
  { path: '/trust', priority: 0.7, freq: 'monthly' },
  { path: '/accessibility', priority: 0.6, freq: 'monthly' },
  { path: '/reading', priority: 0.6, freq: 'monthly' },
  { path: '/source-lab', priority: 0.6, freq: 'monthly' },
  { path: '/sensei', priority: 0.7, freq: 'weekly' },
  { path: '/writing', priority: 0.6, freq: 'monthly' },
  { path: '/focus', priority: 0.5, freq: 'monthly' },
  { path: '/relax', priority: 0.5, freq: 'monthly' },
  { path: '/relax/breathing', priority: 0.4, freq: 'yearly' },
  { path: '/relax/grounding', priority: 0.4, freq: 'yearly' },
  { path: '/relax/solo', priority: 0.4, freq: 'yearly' },
  { path: '/relax/group', priority: 0.4, freq: 'yearly' },
  { path: '/relax/virtual-supermarket', priority: 0.4, freq: 'yearly' },
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
    // 史料判讀室條目。同科目頁一樣由資料衍生，唔硬編 —— 硬編清單同真實 id
    // 脫節時會產生一批 404。
    ...sourceLabEntries.map((e) => ({
      url: `${DOMAIN}/source-lab/${e.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
