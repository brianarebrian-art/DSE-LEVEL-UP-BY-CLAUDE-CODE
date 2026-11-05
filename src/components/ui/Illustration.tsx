'use client'

import React from 'react'

export type IllustrationName = 'empty-state' | 'error-state'

export interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  name: IllustrationName
  width?: number | string
  height?: number | string
  className?: string
  alt?: string
}

const ILLUSTRATIONS: Record<IllustrationName, (props: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  'empty-state': (p) => (
    <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="16" y="24" width="128" height="76" rx="8" fill="var(--color-surface, #FAF8F5)" stroke="var(--color-line, #E5E0D8)" />
      <path d="M40 76C54 70 70 72 80 78C90 72 106 70 120 76V44C106 38 90 40 80 46C70 40 54 38 40 44V76Z" fill="#F4EFEA" stroke="var(--color-accent, #2D5A43)" strokeWidth="2" />
      <line x1="80" y1="46" x2="80" y2="78" stroke="var(--color-accent, #2D5A43)" strokeWidth="2" />
      <line x1="50" y1="52" x2="70" y2="52" stroke="var(--color-ink-soft, #8C827A)" strokeWidth="1.5" />
      <line x1="50" y1="60" x2="68" y2="60" stroke="var(--color-ink-soft, #8C827A)" strokeWidth="1.5" />
      <line x1="92" y1="52" x2="110" y2="52" stroke="var(--color-ink-soft, #8C827A)" strokeWidth="1.5" />
      <line x1="92" y1="60" x2="108" y2="60" stroke="var(--color-ink-soft, #8C827A)" strokeWidth="1.5" />
      <circle cx="120" cy="30" r="3" fill="var(--color-accent, #2D5A43)" stroke="none" />
      <circle cx="36" cy="32" r="2" fill="var(--color-ink-soft, #8C827A)" stroke="none" />
    </svg>
  ),
  'error-state': (p) => (
    <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="16" y="20" width="128" height="80" rx="8" fill="var(--color-surface, #FAF8F5)" stroke="var(--color-line, #E5E0D8)" />
      <path d="M80 34L104 44V60C104 74 94 86 80 90C66 86 56 74 56 60V44L80 34Z" fill="#FBF2EB" stroke="var(--color-accent-strong, #8B3A2B)" strokeWidth="2" />
      <line x1="80" y1="48" x2="80" y2="64" stroke="var(--color-accent-strong, #8B3A2B)" strokeWidth="2" />
      <circle cx="80" cy="74" r="1.5" fill="var(--color-accent-strong, #8B3A2B)" stroke="none" />
      <path d="M116 38A24 24 0 0 1 128 60" stroke="var(--color-ink-soft, #8C827A)" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M44 82A24 24 0 0 1 32 60" stroke="var(--color-ink-soft, #8C827A)" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  ),
}

export function Illustration({
  name,
  width = 160,
  height = 120,
  className = '',
  alt,
  ...props
}: IllustrationProps) {
  const illustrationRenderer = ILLUSTRATIONS[name]

  if (!illustrationRenderer) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Illustration] Unknown illustration name: ${name}`)
    }
    return null
  }

  return illustrationRenderer({
    width,
    height,
    className: `illustration original-illustration inline-block shrink-0 ${className}`.trim(),
    role: alt ? 'img' : 'presentation',
    'aria-label': alt,
    'aria-hidden': alt ? undefined : true,
    ...props,
  })
}

export default Illustration
