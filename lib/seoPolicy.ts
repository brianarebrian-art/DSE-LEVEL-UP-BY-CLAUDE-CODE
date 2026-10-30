/** Access control remains separate: this policy only controls search visibility. */
export const NOINDEX_ROUTE_PREFIXES = [
  '/account', '/admin', '/founder', '/dev', '/sign-in', '/sign-up', '/sign-in-error',
  '/dashboard', '/result', '/predictor', '/bookmarks', '/logic-log',
  '/concept-net', '/exam-day', '/capsule', '/answer-sheet', '/paper-warrior',
  '/practice', '/start', '/waiting', '/ai',
  '/relax', '/sensei', '/credits',
] as const

/** These four editorial drafts await the deployment/mobile release gate. */
export const EDITORIAL_DRAFT_ROUTES = [
  '/dse-maths/quadratic-equations',
  '/dse-english/writing-format',
  '/dse-maths/question-types/quadratic-discriminant',
  '/dse-physics/motion-equations',
] as const

export function shouldNoIndex(path: string): boolean {
  const pathname = path.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/'
  return NOINDEX_ROUTE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    EDITORIAL_DRAFT_ROUTES.some(route => pathname === route)
}
