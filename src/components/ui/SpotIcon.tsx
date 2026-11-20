'use client'

import React from 'react'

/**
 * Small Morandi spot icons for marketing / calm pages where emoji slots were emptied.
 * 24×24 viewBox; stroke 2; matches ILLUSTRATION_SYSTEM (sage / clay / soft ink).
 */
export type SpotIconName =
  | 'adapt'
  | 'open-door'
  | 'spark-step'
  | 'care'
  | 'official'
  | 'analyze'
  | 'rewrite'
  | 'practise'
  | 'eye'
  | 'ear'
  | 'hand'
  | 'scent'
  | 'breath'
  | 'mood'
  | 'board'
  | 'guide'
  | 'calm-done'

export interface SpotIconProps extends React.SVGProps<SVGSVGElement> {
  name: SpotIconName
  size?: number | string
  label?: string
}

const SPOTS: Record<SpotIconName, (p: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  adapt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="12" r="2.5" />
      <path d="M8.5 12h3M14 7v10" />
      <path d="M14 7h4M14 17h4" />
      <circle cx="20" cy="7" r="2" />
      <circle cx="20" cy="17" r="2" />
    </svg>
  ),
  'open-door': (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 21V5a2 2 0 0 1 2-2h7v18H7a2 2 0 0 1-2-2z" />
      <path d="M14 3h3a2 2 0 0 1 2 2v16h-5" />
      <circle cx="11" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  'spark-step': (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  ),
  care: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  ),
  official: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 4h9l3 3v13H6z" />
      <path d="M15 4v3h3" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
  analyze: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="10" cy="10" r="6" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" />
      <line x1="8" y1="10" x2="12" y2="10" />
      <line x1="10" y1="8" x2="10" y2="12" />
    </svg>
  ),
  rewrite: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 7h10a3 3 0 0 1 0 6H8" />
      <path d="M8 13h8a3 3 0 0 1 0 6H4" />
      <path d="M16 5l3 3-8 8H8v-3l8-8z" />
    </svg>
  ),
  practise: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 19l2-1 9-9 2 2-9 9-2 1z" />
      <path d="M14 7l2 2" />
      <path d="M5 19h4" />
      <circle cx="18" cy="6" r="2" />
    </svg>
  ),
  eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  ear: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 12c0-3 2-5 4.5-5S17 9 17 12c0 2-1 3-2.5 3.5" />
      <path d="M8 12v2a4 4 0 0 0 4 4" />
      <path d="M6 10c0-4 3-7 7-7" />
    </svg>
  ),
  hand: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 11V7a1.5 1.5 0 0 1 3 0v4" />
      <path d="M11 10V6a1.5 1.5 0 0 1 3 0v5" />
      <path d="M14 11V7.5a1.5 1.5 0 0 1 3 0V14a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5v-3a1.5 1.5 0 0 1 3 0v2" />
    </svg>
  ),
  scent: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 14c0 2 1.5 4 3 4s3-2 3-4c0-3-3-4-3-7" />
      <path d="M8 20h8" />
      <path d="M10 8c0-1.5.8-3 2-3" />
    </svg>
  ),
  breath: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.5 6.5l1.5 1.5M18 16l1.5 1.5M3 12h2M19 12h2M4.5 17.5l1.5-1.5M18 8l1.5-1.5" opacity="0.55" />
    </svg>
  ),
  mood: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 14c.8 1.2 2 1.8 3 1.8s2.2-.6 3-1.8" />
      <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  board: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <line x1="7" y1="10" x2="17" y2="10" />
      <line x1="7" y1="14" x2="13" y2="14" />
    </svg>
  ),
  guide: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 4h9l3 3v13H5z" />
      <path d="M14 4v3h3" />
      <path d="M9 13l2 2 4-4" />
    </svg>
  ),
  'calm-done': (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  ),
}

export function SpotIcon({ name, size = 24, label, className = '', ...props }: SpotIconProps) {
  const render = SPOTS[name]
  if (!render) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[SpotIcon] Unknown name: ${name}`)
    }
    return null
  }
  return render({
    width: size,
    height: size,
    className: `spot-icon inline-block shrink-0 ${className}`.trim(),
    role: label ? 'img' : 'presentation',
    'aria-label': label,
    'aria-hidden': label ? undefined : true,
    focusable: false,
    ...props,
  })
}

export default SpotIcon
