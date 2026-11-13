'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { dictionary, type Dictionary, type Locale } from './dictionary'
import {
  interfaceLanguageAnnouncement,
  LOCALE_STORAGE_KEY,
  resolveLocale,
} from './localePreference'

export {
  interfaceLanguageAnnouncement,
  immersiveLanguageOffset,
  localeFromBrowserLanguage,
  LOCALE_STORAGE_KEY,
  parseStoredLocale,
  resolveLocale,
  isEnglishPaperSubject,
  paperText,
  showsStudentLanguageControl,
  tr,
} from './localePreference'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggle: () => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

// Client-only language state, persisted in localStorage. The whole UI switches
// 中/EN via React context — no i18n routing/middleware, so every page stays a
// static CDN asset ($0 at any traffic).
/** 介面語言 → <html lang> 嘅值。同 app/layout.tsx 伺服器端嘅預設（zh-HK）一致。 */
export function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'zh-HK'
}

function readStoredRaw(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStored(next: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // 私密模式寫不入。這次瀏覽仍然切換，不假裝已經記住。
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at 'zh' so the server-rendered HTML and the first client render
  // match (no hydration mismatch). A previously saved choice, or the browser
  // language when nothing valid is stored, is applied after mount.
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [announcement, setAnnouncement] = useState('')
  const userActed = useRef(false)

  useEffect(() => {
    // 不寫 localStorage。未選擇時只在這次瀏覽套用瀏覽器語言。
    const next = resolveLocale(readStoredRaw(), navigator.language)
    setLocaleState(next)
  }, [])

  // <html lang> 一定要跟住介面語言轉（WCAG 3.1.1，A 級）。
  // app/layout.tsx 伺服器端寫死 lang="zh-HK"（靜態頁冇得知學生揀咗乜），
  // 2026-09-25 之前切咗英文之後佢一直停喺 zh-HK —— 讀屏軟件會用廣東話聲線
  // 讀英文，非華語考生同用讀屏嘅 SEN 學生聽到嘅係一堆錯音。
  useEffect(() => {
    document.documentElement.lang = htmlLang(locale)
  }, [locale])

  useEffect(() => {
    if (!userActed.current) return
    setAnnouncement(interfaceLanguageAnnouncement(locale))
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    userActed.current = true
    setLocaleState(next)
    writeStored(next)
  }, [])

  const toggle = useCallback(() => {
    userActed.current = true
    setLocaleState((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh'
      writeStored(next)
      return next
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggle, t: dictionary[locale] }}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLocale(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLocale must be used within a LanguageProvider')
  return ctx
}

// Convenience hook for components that only need the translated strings.
export function useT(): Dictionary {
  return useLocale().t
}
