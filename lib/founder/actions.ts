'use server'

import { requireFounderApi } from '@/lib/auth/founderAllowlist'
import { writeFounderAudit } from '@/lib/founder/audit'
import { getServiceSupabase } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { createHash } from 'node:crypto'

async function originFromHeaders(): Promise<boolean> {
  const h = await headers()
  const origin = h.get('origin')
  const host = h.get('host')
  if (!host) return false
  if (!origin) {
    // Server Actions 通常有 Next-Action header；仍要求 Origin 存在。
    return false
  }
  try {
    const o = new URL(origin).host
    return o === host
  } catch {
    return false
  }
}

export type BatchPreviewResult = {
  ok: boolean
  error?: string
  count?: number
  ids?: string[]
  confirmationToken?: string
}

/** 批量上下架預覽（副作用前必須預覽＋確認）。正式改題庫檔需另批準。 */
export async function previewQuestionStatusBatch(input: {
  ids: string[]
  nextStatus: 'published' | 'withdrawn'
}): Promise<BatchPreviewResult> {
  const founder = await requireFounderApi()
  if (!founder) return { ok: false, error: 'forbidden' }
  if (!(await originFromHeaders())) return { ok: false, error: 'origin' }

  const ids = [...new Set((input.ids ?? []).map((x) => String(x).trim()).filter(Boolean))].slice(0, 200)
  if (!ids.length) return { ok: false, error: 'empty' }

  const payload = { ids, nextStatus: input.nextStatus }
  const confirmationToken = createHash('sha256')
    .update(JSON.stringify({ actor: founder.googleSub, ...payload }))
    .digest('hex')

  await writeFounderAudit({
    actor: founder,
    action: 'questions.batch_preview',
    targetType: 'question_batch',
    result: 'ok',
    summary: `preview ${ids.length} → ${input.nextStatus}`,
    meta: { count: ids.length, nextStatus: input.nextStatus },
  })

  return { ok: true, count: ids.length, ids, confirmationToken }
}

export async function confirmQuestionStatusBatch(input: {
  ids: string[]
  nextStatus: 'published' | 'withdrawn'
  confirmationToken: string
}): Promise<BatchPreviewResult> {
  const founder = await requireFounderApi()
  if (!founder) return { ok: false, error: 'forbidden' }
  if (!(await originFromHeaders())) return { ok: false, error: 'origin' }

  const ids = [...new Set((input.ids ?? []).map((x) => String(x).trim()).filter(Boolean))].slice(0, 200)
  const expected = createHash('sha256')
    .update(JSON.stringify({ actor: founder.googleSub, ids, nextStatus: input.nextStatus }))
    .digest('hex')
  if (input.confirmationToken !== expected) {
    await writeFounderAudit({
      actor: founder,
      action: 'questions.batch_confirm',
      targetType: 'question_batch',
      result: 'denied',
      summary: 'confirmation token mismatch',
    })
    return { ok: false, error: 'confirm_mismatch' }
  }

  // 持久化意圖到 review cases／publish batch；唔直接改正式題庫檔（需部署批准）。
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from('founder_publish_batches').insert({
      name: `batch-${input.nextStatus}-${Date.now()}`.slice(0, 160),
      status: input.nextStatus === 'published' ? 'pending_review' : 'draft',
      question_ids: ids,
      created_by_sub: founder.googleSub,
      notes: `Confirmed batch ${input.nextStatus}; static bank not mutated in-place.`,
    })
    if (error) throw error
  } catch {
    await writeFounderAudit({
      actor: founder,
      action: 'questions.batch_confirm',
      targetType: 'question_batch',
      result: 'error',
      summary: 'DB write failed — no static bank mutation performed',
      meta: { count: ids.length },
    })
    return { ok: false, error: 'db' }
  }

  await writeFounderAudit({
    actor: founder,
    action: 'questions.batch_confirm',
    targetType: 'question_batch',
    result: 'ok',
    summary: `confirmed ${ids.length} → ${input.nextStatus} (batch recorded)`,
    meta: { count: ids.length },
  })
  return { ok: true, count: ids.length, ids }
}
