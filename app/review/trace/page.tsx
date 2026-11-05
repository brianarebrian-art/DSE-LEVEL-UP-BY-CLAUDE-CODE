import { completeSeoMetadata } from '@/lib/seo'
import TraceWalk from './TraceWalk'

export const metadata = completeSeoMetadata({
  title: '先備回溯 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '答不上的課題會回溯兩層先備，並以問題引導下一步。', // i18n-exempt: zh-Hant fixed search metadata
  robots: { index: false, follow: true },
}, '/review/trace')

export default function ReviewTracePage() {
  return <TraceWalk />
}
