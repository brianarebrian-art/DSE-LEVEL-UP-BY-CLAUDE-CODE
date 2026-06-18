'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { dictionary, type Dictionary, type Locale } from './dictionary'

const STORAGE_KEY = 'dse_locale'

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
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at 'zh' so the server-rendered HTML and the first client render
  // match (no hydration mismatch). A previously saved choice is applied after mount.
  const [locale, setLocaleState] = useState<Locale>('zh')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') setLocaleState(saved)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggle, t: dictionary[locale] }}>
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
