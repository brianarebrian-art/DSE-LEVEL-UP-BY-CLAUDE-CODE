import { randomUUID } from 'node:crypto'

const SAFE_ID = /^[A-Za-z0-9_-]{8,64}$/

export function createCorrelationId(): string {
  return randomUUID()
}

export function normalizeCorrelationId(value?: string): string | null {
  return typeof value === 'string' && SAFE_ID.test(value) ? value : null
}
