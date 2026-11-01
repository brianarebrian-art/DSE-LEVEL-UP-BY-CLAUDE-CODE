export const LEARNING_EVENT_NAMES = [
  'practice_session_started',
  'question_answered',
  'practice_session_completed',
] as const

export type LearningEventName = (typeof LEARNING_EVENT_NAMES)[number]

export interface LearningEvent {
  name: LearningEventName
  occurredAt: number
  subjectId: string
  sessionId: string
  properties: Record<string, string | number | boolean | null>
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Emits a privacy-minimal event for an optional analytics adapter.
 * It deliberately does not persist data or send a network request until a
 * reviewed storage integration and retention policy are enabled.
 */
export function emitLearningEvent(event: LearningEvent): void {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent('dse:learning-event', { detail: event }))
}
