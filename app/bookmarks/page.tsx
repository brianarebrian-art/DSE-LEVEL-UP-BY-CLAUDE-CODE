import { completeSeoMetadata } from '@/lib/seo'
import BookmarksView from './BookmarksView'

// 收藏頁（#106）。內容 100% 由學生自己嘅 localStorage 指標 + 真題庫組成。
//
// 刻意唔入 Navbar：橫向條已有 7 條連結，檔頭實測中文 1,059px／英文 1,210px，
// 再加一條會喺 1280px 斷點迫爆。入口改由「我的進度」頁提供。
export const metadata = completeSeoMetadata({
  title: '我的收藏 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '查看你儲存在本機的 DSE Level Up 題目收藏。', // i18n-exempt: zh-Hant fixed search metadata
}, '/bookmarks')

export default function BookmarksPage() {
  return <BookmarksView />
}
