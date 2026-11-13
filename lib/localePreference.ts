import type { Locale } from './dictionary'

/** 學生介面語言。與主題鍵 `dse-theme` 分開，切換語言不會改主題。 */
export const LOCALE_STORAGE_KEY = 'dse_locale'

/** 只有學生明確儲存的 `zh` / `en` 算已選擇。其他值（包括空字串）當作未選擇。 */
export function parseStoredLocale(raw: string | null | undefined): Locale | null {
  return raw === 'zh' || raw === 'en' ? raw : null
}

/**
 * 未選擇時的瀏覽器後備：`navigator.language` 以 en 開頭（en、en-GB、en-HK）為英文，其餘為中文。
 * 不讀 `navigator.languages`，避免與「只看 language」的規格分叉。
 */
export function localeFromBrowserLanguage(language: string | null | undefined): Locale {
  return (language ?? '').toLowerCase().startsWith('en') ? 'en' : 'zh'
}

/** 已儲存的選擇永遠優先於瀏覽器語言。 */
export function resolveLocale(stored: string | null | undefined, browserLanguage: string | null | undefined): Locale {
  return parseStoredLocale(stored) ?? localeFromBrowserLanguage(browserLanguage)
}

/**
 * 介面字串後備。英文缺漏或只有空白時回落到中文；中文亦空白時才用英文。
 * 兩邊都沒有可見文字時才回傳空字串。
 */
export function tr(zh: string, en: string | null | undefined, locale: Locale): string {
  const zhText = zh ?? ''
  const enText = en ?? ''
  if (locale === 'en' && enText.trim() !== '') return enText
  if (zhText.trim() !== '') return zhText
  return enText
}

/** 只在學生主動切換之後朗讀。首次繪製與掛載後套用已存／瀏覽器語言都不呼叫。 */
export function interfaceLanguageAnnouncement(locale: Locale): string {
  return locale === 'en' ? 'Interface language: English' : '介面語言：中文'
}

/** 考卷語言是英文的科目。其餘科目的題目原文是中文，英文欄只是介面翻譯。 */
const ENGLISH_PAPER_SUBJECTS = new Set(['english', 'english-literature'])

export function isEnglishPaperSubject(subjectId: string | null | undefined): boolean {
  return !!subjectId && ENGLISH_PAPER_SUBJECTS.has(subjectId)
}

/**
 * 題幹、選項、解析跟考卷，不跟介面語言。
 * 英文卷用英文欄（沒有英文欄時才用原文）；其他卷一律用原文。
 */
export function paperText(
  subjectId: string | null | undefined,
  source: string | null | undefined,
  english: string | null | undefined,
): string {
  const zh = source ?? ''
  const en = english ?? ''
  if (isEnglishPaperSubject(subjectId) && en.trim() !== '') return en
  return zh
}

/** 練習頁依學生選擇顯示翻譯；英文卷在中文介面下仍保留英文原題。 */
export function practiceText(
  subjectId: string | null | undefined,
  source: string | null | undefined,
  english: string | null | undefined,
  locale: Locale,
): string {
  const en = english ?? ''
  if (locale === 'en' && en.trim() !== '') return en
  return paperText(subjectId, source, english)
}

function isUnder(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`)
}

/** 創辦人指揮台與管理頁維持中文，不放學生語言按鈕。 */
export function showsStudentLanguageControl(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  if (isUnder(pathname, '/admin')) return false
  if (isUnder(pathname, '/founder')) return false
  return true
}

/**
 * 練習頁用 100dvh 直欄。語言按鈕疊在頂欄留白，不再把整頁往下推。
 * 其他沉浸頁沒有這條直欄，用 main 的上內距避開按鈕。
 */
export function immersiveLanguageOffset(pathname: string | null | undefined): boolean {
  if (!showsStudentLanguageControl(pathname)) return false
  if (!pathname) return false
  if (isUnder(pathname, '/practice')) return false
  return isUnder(pathname, '/relax') || isUnder(pathname, '/paper-warrior') || isUnder(pathname, '/answer-sheet')
}
