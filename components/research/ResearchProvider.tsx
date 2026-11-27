'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { seedStore } from '@/lib/research/seed'
import { clearDrafts, loadBrowserStore, writeBrowserStore } from '@/lib/research/storage'
import type { PreviewMode, ResearchStore } from '@/lib/research/types'
import { EmptyState, ErrorState, LoadingState } from '@/components/research/ui'

type Phase = 'loading' | 'ready' | 'error'

interface ResearchContextValue {
  phase: Phase
  store: ResearchStore | null
  mode: PreviewMode | 'error'
  refresh: () => void
  retry: () => void
  restoreDemo: () => void
  update: (recipe: (store: ResearchStore) => ResearchStore) => boolean
}

const ResearchContext = createContext<ResearchContextValue | null>(null)

function visibleMode(phase: Phase, store: ResearchStore | null): PreviewMode | 'error' {
  if (phase === 'loading') return 'loading'
  if (phase === 'error' || !store) return 'error'
  return store.settings.preview
}

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [store, setStore] = useState<ResearchStore | null>(null)
  const storeRef = useRef<ResearchStore | null>(null)

  const refresh = useCallback(() => {
    try {
      const result = loadBrowserStore()
      if (!result.ok) {
        storeRef.current = null
        setStore(null)
        setPhase('error')
        return
      }
      storeRef.current = result.store
      setStore(result.store)
      setPhase('ready')
    } catch {
      storeRef.current = null
      setStore(null)
      setPhase('error')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const update = useCallback((recipe: (current: ResearchStore) => ResearchStore) => {
    const prev = storeRef.current
    if (!prev) return false
    const next = recipe(prev)
    try {
      writeBrowserStore(next)
    } catch {
      setPhase('error')
      return false
    }
    storeRef.current = next
    setStore(next)
    return true
  }, [])

  const restoreDemo = useCallback(() => {
    try {
      const next = seedStore()
      writeBrowserStore(next)
      clearDrafts()
      storeRef.current = next
      setStore(next)
      setPhase('ready')
    } catch {
      setPhase('error')
    }
  }, [])

  const retry = useCallback(() => {
    if (phase === 'ready' && store?.settings.preview === 'error') {
      update((current) => ({ ...current, settings: { ...current.settings, preview: 'ready' } }))
      return
    }
    refresh()
  }, [phase, refresh, store?.settings.preview, update])

  const value = useMemo<ResearchContextValue>(() => ({
    phase,
    store,
    mode: visibleMode(phase, store),
    refresh,
    retry,
    restoreDemo,
    update,
  }), [phase, refresh, restoreDemo, retry, store, update])

  return <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>
}

export function useResearch(): ResearchContextValue {
  const value = useContext(ResearchContext)
  if (!value) throw new Error('ResearchProvider missing')
  return value
}

export function ResearchGate({ children }: { children: ReactNode }) {
  const { mode, store, retry, restoreDemo } = useResearch()
  if (mode === 'loading') {
    return <LoadingState exitHref={store?.settings.preview === 'loading' ? '/research/admin/settings' : undefined} />
  }
  if (mode === 'error') return <ErrorState onRetry={retry} onRestore={restoreDemo} />
  if (mode === 'empty') return <EmptyState />
  return children
}
