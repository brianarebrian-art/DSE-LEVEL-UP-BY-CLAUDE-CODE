// 文章型頁面嘅發布／最後更新日期 —— 畀 components/Seo/ArticleJsonLd.tsx 用。
//
// ══ 點樣得出呢啲日期 ══
// 2026-09-15 由 git 真實紀錄生成：published ＝ app/<頁>/page.tsx 第一次 commit 嘅日期，
// modified ＝ app/<頁>/ 最後一次 commit 嘅日期。
// ⚠️ 一份規格書提議「預設 2026-09-15」—— 冇用。將 6 月已經存在嘅頁寫成 9 月發布，
//    係虛構日期（憲章 §8），而 datePublished 係對搜尋器同讀者嘅公開聲稱。
//
// ══ 之後點樣改 modified ══
// 只喺【實質改動】先改：內容改動超過約兩成、或者更正咗邏輯／事實。錯別字、排版、
// 重構唔改 —— 否則「最後更新」就只係話畀人知有人郁過個檔，唔係話佢啲內容新咗。
// 呢條規則機器判斷唔到，所以唔自動化；改嗰陣喺 commit message 講一句點解。
//
// ⚠️ 唔好加練習／科目頁（/subjects/*、/practice）：佢哋唔係文章。對住唔係文章嘅
//    頁標 Article，係誤導性結構化資料，Google 可以唔採用甚至人手處理。

export interface ArticleDates {
  /** YYYY-MM-DD */
  published: string
  /** YYYY-MM-DD，只喺實質改動時更新 */
  modified: string
}

export const ARTICLE_DATES: Record<string, ArticleDates> = {
  '/about': { published: '2026-06-18', modified: '2026-08-21' },
  '/methodology': { published: '2026-06-18', modified: '2026-09-02' },
  '/transparency': { published: '2026-07-01', modified: '2026-09-15' },
  '/prediction-method': { published: '2026-08-21', modified: '2026-09-09' },
  '/trust': { published: '2026-08-21', modified: '2026-09-05' },
  '/community-safety': { published: '2026-08-20', modified: '2026-09-05' },
}
