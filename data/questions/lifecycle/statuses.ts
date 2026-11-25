/**
 * Item review state machine — transitions must be enforced by DB + service layer.
 * Skipping grades is a bug.
 */
export const ITEM_STATUSES = [
  'DRAFT',
  'PARAM_CHECKED',
  'AI_BLIND_REVIEWED',
  'ADVERSARIAL_PASSED',
  'HUMAN_SPOT_CHECKED',
  'APPROVED',
  'RELEASED',
  'REJECTED',
  'RETIRED',
  'LEGACY_UNCALIBRATED',
  'CALIBRATION_INSUFFICIENT',
] as const

export type ItemStatus = (typeof ITEM_STATUSES)[number]

/** Allowed forward / side transitions. */
export const ALLOWED_TRANSITIONS: Record<ItemStatus, readonly ItemStatus[]> = {
  DRAFT: ['PARAM_CHECKED', 'REJECTED', 'RETIRED'],
  PARAM_CHECKED: ['AI_BLIND_REVIEWED', 'ADVERSARIAL_PASSED', 'REJECTED', 'DRAFT'],
  AI_BLIND_REVIEWED: ['ADVERSARIAL_PASSED', 'REJECTED', 'DRAFT'],
  ADVERSARIAL_PASSED: ['HUMAN_SPOT_CHECKED', 'REJECTED', 'DRAFT'],
  HUMAN_SPOT_CHECKED: ['APPROVED', 'REJECTED', 'DRAFT'],
  APPROVED: ['RELEASED', 'REJECTED'],
  RELEASED: ['RETIRED', 'CALIBRATION_INSUFFICIENT'],
  REJECTED: ['DRAFT', 'RETIRED'],
  RETIRED: [],
  LEGACY_UNCALIBRATED: ['DRAFT', 'RETIRED'],
  CALIBRATION_INSUFFICIENT: ['DRAFT', 'RELEASED', 'RETIRED'],
}

export function canTransition(from: ItemStatus, to: ItemStatus): boolean {
  return (ALLOWED_TRANSITIONS[from] as readonly string[]).includes(to)
}

export type StatusAudit = {
  itemId: string
  from: ItemStatus
  to: ItemStatus
  actor: string
  at: string
  evidenceId?: string
  version: number
  reason: string
}
