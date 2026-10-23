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
// ② 個人化頁（`/dashboard`、`/predictor`、`/result`、`/account`）：內容
//    全部由 localStorage 於客戶端產生，伺服器端渲染為空殼。收錄只會令爬蟲取得
//    一批空白頁，拖低整站品質評分。待各頁補上伺服器端內容後方可加入。
// ③ 舊「影子溫書室」（`/wall`）已於 2026-08-21 整個移除 —— 見 docs/DECISION-no-interaction.md。
//    本站【永久】唔提供任何用戶對用戶互動，所以呢度亦唔會再出現社群類路由。
// ④ `/admin`、`/sign-in`、`/sign-up`：權限／登入頁。搜尋可見性由 metadata
//    robots noindex 控制（lib/seoPolicy.ts），不是 robots.txt Disallow ——
//    Disallow ≠ 登入閘，亦唔代替授權。robots.ts 只 Disallow `/api/`。
// ⑤ 任務外殼（`/practice`、`/relax`、`/paper-warrior`、`/answer-sheet`、`/waiting`、
//    `/capsule`、`/sensei`、`/ai/*`）同編輯草稿：`shouldNoIndex` —— **唔寫入**
//    STATIC_ROUTES，避免清單同政策打架（過濾 alone 唔夠做文件）。
//
// 網域：www.dselevelup.com（2026-10-09 創辦人回覆 58a），由 lib/site.ts 匯入。
import { SITE_ORIGIN as DOMAIN } from '@/lib/site'
import { sourceLabEntries } from '@/data/history-sources'
import { ARTICLE_DATES } from '@/lib/articleDates'
import { BANK_UPDATED_AT } from '@/data/questions/bank-dates.generated'
import { CATEGORIES } from '@/data/offSyllabus'
import { shouldNoIndex } from '@/lib/seoPolicy'
import { SCENE_IDS } from '@/data/cantonese'

const lastModifiedOf = (path: string): { lastModified?: string } => {
  const d = ARTICLE_DATES[path]
  return d ? { lastModified: d.modified || d.published } : {}
}

// 公開靜態頁。只列 indexable 路徑；順序即優先級由高至低。
const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, freq: 'weekly' },
  { path: '/dse-maths', priority: 0.9, freq: 'weekly' },
  { path: '/dse-english', priority: 0.9, freq: 'weekly' },
  { path: '/subjects', priority: 0.9, freq: 'weekly' },
  { path: '/notes', priority: 0.8, freq: 'weekly' },
  { path: '/methodology', priority: 0.8, freq: 'monthly' },
  { path: '/about', priority: 0.6, freq: 'monthly' },
  { path: '/transparency', priority: 0.6, freq: 'monthly' },
  { path: '/privacy', priority: 0.6, freq: 'monthly' },
  { path: '/terms', priority: 0.5, freq: 'monthly' },
  { path: '/community-safety', priority: 0.6, freq: 'monthly' },
  { path: '/prediction-method', priority: 0.6, freq: 'monthly' },
  { path: '/trust', priority: 0.7, freq: 'monthly' },
  { path: '/reading', priority: 0.6, freq: 'monthly' },
  { path: '/source-lab', priority: 0.6, freq: 'monthly' },
  { path: '/off-syllabus', priority: 0.7, freq: 'weekly' },
  { path: '/writing', priority: 0.6, freq: 'monthly' },
  { path: '/cantonese', priority: 0.4, freq: 'monthly' },
  { path: '/cantonese/learn', priority: 0.4, freq: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const subjectIds = getActiveSubjects().map((s) => s.id)

  return [
    ...STATIC_ROUTES.filter((r) => !shouldNoIndex(r.path || '/')).map((r) => ({
      url: `${DOMAIN}${r.path}`,
      ...lastModifiedOf(r.path),
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...subjectIds.map((id) => ({
      url: `${DOMAIN}/subjects/${id}`,
      ...(BANK_UPDATED_AT[id] ? { lastModified: BANK_UPDATED_AT[id].date } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...subjectIds.map((id) => ({
      url: `${DOMAIN}/notes/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...sourceLabEntries.map((e) => ({
      url: `${DOMAIN}/source-lab/${e.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${DOMAIN}/off-syllabus/${c.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...SCENE_IDS.map((id) => ({
      url: `${DOMAIN}/cantonese/${id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ]
}
