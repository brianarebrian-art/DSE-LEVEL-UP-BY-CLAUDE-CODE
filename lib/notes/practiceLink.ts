import { SITE_ORIGIN } from '@/lib/site'

/** 筆記／列印末頁用：掃 QR 即開該課題練習（公開 URL，無個人資料）。 */
export function practiceTopicPath(subjectId: string, topicId: string): string {
  const s = encodeURIComponent(subjectId)
  const t = encodeURIComponent(topicId)
  return `/practice?subject=${s}&topic=${t}`
}

export function practiceTopicUrl(subjectId: string, topicId: string): string {
  return `${SITE_ORIGIN}${practiceTopicPath(subjectId, topicId)}`
}
