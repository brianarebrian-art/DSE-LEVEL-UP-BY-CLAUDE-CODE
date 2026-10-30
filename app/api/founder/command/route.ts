import { NextResponse } from 'next/server'
import { createHash, randomUUID } from 'node:crypto'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { requireFounder, founderForbiddenBody } from '@/lib/auth/founderAllowlist'
import { assertSameOrigin } from '@/lib/founder/origin'
import { founderCacheHeaders, founderAiConfigured } from '@/lib/founder/env'
import { classifyCommand, searchFounderNav, payloadHash } from '@/lib/founder/command'
import { writeFounderAudit } from '@/lib/founder/audit'
import { loadPlatformOverview } from '@/lib/founder/metrics'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

type Body = {
  text?: string
  confirm?: boolean
  confirmationId?: string
  payloadHash?: string
}

export async function POST(request: Request) {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json(founderForbiddenBody(), { status: 403, headers: founderCacheHeaders() })
  }
  if (!assertSameOrigin(request)) {
    await writeFounderAudit({
      actor: founder,
      action: 'command.origin_denied',
      targetType: 'command',
      result: 'denied',
      summary: 'Origin/Referer check failed',
    })
    return NextResponse.json({ error: 'forbidden', message: '來源驗證失敗' }, { status: 403, headers: founderCacheHeaders() })
  }

  const read = await readJsonLimited<Body>(request, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json({ error: 'bad_request', message: '無效請求' }, { status: read.status, headers: founderCacheHeaders() })
  }
  const text = typeof read.value?.text === 'string' ? read.value.text.slice(0, 500) : ''
  const parsed = classifyCommand(text)
  const ai = founderAiConfigured() ? 'connected' : 'unconnected'

  // 副作用：需要確認
  if (parsed.requiresConfirm && !read.value?.confirm) {
    const payload = { actionId: parsed.actionId, params: parsed.params, text }
    const hash = payloadHash(parsed.actionId, payload)
    let confirmationId: string = randomUUID()
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('founder_command_confirmations')
        .insert({
          id: confirmationId,
          expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
          actor_sub: founder.googleSub,
          action: parsed.actionId,
          payload_hash: hash,
          payload_summary: `${parsed.label} · ${JSON.stringify(parsed.params).slice(0, 400)}`,
          impact_count: parsed.params.questionId ? 1 : 0,
        })
        .select('id')
        .single()
      if (error) throw error
      confirmationId = String(data.id)
    } catch (e) {
      safeLog('warn', 'founder command confirm insert failed — ephemeral confirm', e)
      // 仍回傳 ephemeral confirm（表未 migrate 時）
      confirmationId = `ephemeral:${hash.slice(0, 16)}`
    }
    return NextResponse.json(
      {
        ok: true,
        kind: parsed.kind,
        label: parsed.label,
        requiresConfirm: true,
        confirmationId,
        payloadHash: hash,
        payloadSummary: `將執行：${parsed.label}。參數：${JSON.stringify(parsed.params)}`,
        message: '此操作有副作用，請確認目標同影響後再執行。',
        ai,
      },
      { headers: founderCacheHeaders() },
    )
  }

  if (parsed.requiresConfirm && read.value?.confirm) {
    const hash = payloadHash(parsed.actionId, {
      actionId: parsed.actionId,
      params: parsed.params,
      text,
    })
    if (read.value.payloadHash !== hash) {
      await writeFounderAudit({
        actor: founder,
        action: 'command.confirm_mismatch',
        targetType: 'command',
        result: 'denied',
        summary: 'payload hash mismatch — requires re-confirm',
      })
      return NextResponse.json(
        { ok: false, message: '操作內容已變更，需要重新確認。', ai },
        { status: 409, headers: founderCacheHeaders() },
      )
    }
    // 消費 confirmation（若非 ephemeral）
    if (read.value.confirmationId && !String(read.value.confirmationId).startsWith('ephemeral:')) {
      try {
        const supabase = getServiceSupabase()
        const { data, error } = await supabase
          .from('founder_command_confirmations')
          .update({ consumed_at: new Date().toISOString() })
          .eq('id', read.value.confirmationId)
          .eq('actor_sub', founder.googleSub)
          .eq('payload_hash', hash)
          .is('consumed_at', null)
          .gt('expires_at', new Date().toISOString())
          .select('id')
          .maybeSingle()
        if (error) throw error
        if (!data) {
          return NextResponse.json(
            { ok: false, message: '確認已過期或已使用，請重新發起。', ai },
            { status: 409, headers: founderCacheHeaders() },
          )
        }
      } catch (e) {
        safeLog('warn', 'founder confirm consume failed', e)
      }
    }

    if (parsed.actionId === 'create_review_draft') {
      const qid = parsed.params.questionId
      if (!qid) {
        return NextResponse.json({ ok: false, message: '請喺指令中指定題號。', ai }, { headers: founderCacheHeaders() })
      }
      try {
        const supabase = getServiceSupabase()
        const fingerprint = createHash('sha256').update(`manual:${qid}`).digest('hex').slice(0, 40)
        const { error } = await supabase.from('founder_review_cases').upsert(
          {
            fingerprint,
            source: 'manual',
            question_id: qid.slice(0, 100),
            title: `覆核草稿：${qid}`.slice(0, 200),
            status: 'open',
            severity: 'normal',
            notes: '由 Founder 指令列建立草稿',
          },
          { onConflict: 'fingerprint' },
        )
        if (error) throw error
        await writeFounderAudit({
          actor: founder,
          action: 'review_case.create_draft',
          targetType: 'question',
          targetId: qid,
          result: 'ok',
          summary: 'Created review case draft via command bar',
        })
        return NextResponse.json(
          {
            ok: true,
            kind: parsed.kind,
            message: `已建立覆核任務草稿（題號 ${qid}）。`,
            links: [{ href: '/founder/quality', label: '前往覆核隊列' }],
            sources: [{ label: 'founder_review_cases' }],
            ai,
          },
          { headers: founderCacheHeaders() },
        )
      } catch (e) {
        safeLog('error', 'create review draft failed', e)
        return NextResponse.json(
          { ok: false, message: '無法寫入覆核草稿（表可能未 migrate）。', ai },
          { status: 503, headers: founderCacheHeaders() },
        )
      }
    }

    await writeFounderAudit({
      actor: founder,
      action: 'command.side_effect_unsupported',
      targetType: 'command',
      result: 'cancelled',
      summary: parsed.label.slice(0, 200),
    })
    return NextResponse.json(
      { ok: false, message: '此副作用操作尚未接駁實際執行器；已記錄審計且未改動資料。', ai },
      { headers: founderCacheHeaders() },
    )
  }

  // 唯讀／草稿
  try {
    if (parsed.actionId === 'search_nav') {
      const links = searchFounderNav(parsed.params.q || text).map((x) => ({
        href: x.href,
        label: `${x.group} · ${x.label}`,
      }))
      return NextResponse.json(
        {
          ok: true,
          kind: parsed.kind,
          label: parsed.label,
          message: links.length ? `搵到 ${links.length} 個相關模組。` : '冇匹配模組；可改用題號或中文關鍵字。',
          links,
          sources: [{ label: 'Founder 導航索引' }],
          ai,
        },
        { headers: founderCacheHeaders() },
      )
    }

    if (parsed.actionId === 'briefing_draft') {
      const o = await loadPlatformOverview()
      const parts = [
        `【${new Date().toLocaleDateString('zh-HK', { timeZone: 'Asia/Hong_Kong' })} 創辦人簡報】`,
        o.metrics.activeStudents7d.state === 'ok' ? `7日活躍 ${o.metrics.activeStudents7d.value}` : '7日活躍 無法計算',
        o.metrics.openReports.state === 'ok' ? `未處理回報 ${o.metrics.openReports.value}` : '回報 未接駁',
        o.metrics.pendingQualityReviews.state === 'ok'
          ? `待覆核 ${o.metrics.pendingQualityReviews.value}`
          : '覆核 未接駁',
        `情報 ${o.intel.length} 條`,
      ]
      return NextResponse.json(
        {
          ok: true,
          kind: 'draft',
          message: parts.join('；') + (ai === 'unconnected' ? '（本地草擬，未接 AI 潤飾）' : ''),
          links: [{ href: '/founder/briefing', label: '開啟簡報頁' }],
          sources: [{ label: 'loadPlatformOverview' }],
          ai,
        },
        { headers: founderCacheHeaders() },
      )
    }

    if (parsed.actionId === 'compare_reports') {
      try {
        const supabase = getServiceSupabase()
        const since = new Date(Date.now() - 28 * 86_400_000).toISOString()
        const { data, error } = await supabase
          .from('question_reports')
          .select('question_id, category, created_at')
          .gte('created_at', since)
          .limit(2000)
        if (error) throw error
        const byCat = new Map<string, number>()
        for (const r of data ?? []) {
          byCat.set(r.category, (byCat.get(r.category) ?? 0) + 1)
        }
        const summary = [...byCat.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => `${k}:${v}`)
          .join(' · ')
        return NextResponse.json(
          {
            ok: true,
            kind: 'readonly',
            message: summary
              ? `近 4 星期回報（按類別）：${summary}。樣本 ${data?.length ?? 0}。唔按科目拆（回報表無 subject 欄）；可用題號對照題庫。`
              : '近 4 星期冇回報紀錄。',
            links: [{ href: '/founder/quality/reports', label: '錯題回報' }],
            sources: [{ label: 'question_reports', href: '/founder/quality/reports' }],
            ai,
          },
          { headers: founderCacheHeaders() },
        )
      } catch {
        return NextResponse.json(
          { ok: false, message: 'question_reports 未接駁。', ai },
          { status: 503, headers: founderCacheHeaders() },
        )
      }
    }

    if (parsed.actionId === 'list_pending_reviews') {
      try {
        const supabase = getServiceSupabase()
        const { data, error } = await supabase
          .from('dse_question_quality_reviews')
          .select('question_id, subject_slug, review_stage, updated_at')
          .in('review_stage', ['queued', 'human_review', 'second_review'])
          .order('updated_at', { ascending: false })
          .limit(20)
        if (error) throw error
        const links = (data ?? []).map((r) => ({
          href: `/founder/questions/${encodeURIComponent(r.question_id)}`,
          label: `${r.question_id}（${r.subject_slug} · ${r.review_stage}）`,
        }))
        return NextResponse.json(
          {
            ok: true,
            kind: 'readonly',
            message: links.length ? `最近待覆核 ${links.length} 題（最多顯示 20）。` : '冇待覆核題目。',
            links: [{ href: '/founder/quality', label: '覆核隊列' }, ...links.slice(0, 10)],
            sources: [{ label: 'dse_question_quality_reviews' }],
            ai,
          },
          { headers: founderCacheHeaders() },
        )
      } catch {
        return NextResponse.json(
          { ok: false, message: '質素覆核表未接駁。', ai },
          { status: 503, headers: founderCacheHeaders() },
        )
      }
    }

    if (parsed.actionId === 'ai_cost_analysis') {
      try {
        const supabase = getServiceSupabase()
        const since = new Date(Date.now() - 7 * 86_400_000).toISOString()
        const { data, error } = await supabase
          .from('founder_ai_jobs')
          .select('cost_hkd, cost_amount, cost_currency, created_at, status')
          .gte('created_at', since)
          .limit(500)
        if (error) throw error
        const withCost = (data ?? []).filter((j) => j.cost_hkd != null || j.cost_amount != null)
        if (!withCost.length) {
          return NextResponse.json(
            {
              ok: true,
              kind: 'readonly',
              message: '本星期 AI 任務未有成本欄位資料（唔當 0）。',
              links: [{ href: '/founder/finance', label: '財務' }],
              sources: [{ label: 'founder_ai_jobs' }],
              ai,
            },
            { headers: founderCacheHeaders() },
          )
        }
        const hkd = withCost.reduce((s, j) => s + Number(j.cost_hkd ?? 0), 0)
        return NextResponse.json(
          {
            ok: true,
            kind: 'readonly',
            message: `近 7 日有成本紀錄嘅任務 ${withCost.length} 個；合計約 HKD ${Math.round(hkd * 100) / 100}（保留各列原始幣別）。`,
            links: [{ href: '/founder/ai', label: 'AI 任務' }],
            sources: [{ label: 'founder_ai_jobs' }],
            ai,
          },
          { headers: founderCacheHeaders() },
        )
      } catch {
        return NextResponse.json(
          { ok: false, message: 'AI 成本表未接駁。', ai },
          { status: 503, headers: founderCacheHeaders() },
        )
      }
    }

    const links = searchFounderNav(text)
    return NextResponse.json(
      {
        ok: true,
        kind: parsed.kind,
        message:
          ai === 'unconnected'
            ? 'Founder AI 未接駁。已提供本地搜尋結果；設定 FOUNDER_AI_API_KEY 與 FOUNDER_AI_BASE_URL 後先有模型回答。'
            : '已解析指令（模型路徑預留）。',
        links: links.map((x) => ({ href: x.href, label: x.label })),
        sources: [{ label: '本地指令分類器' }],
        ai,
      },
      { headers: founderCacheHeaders() },
    )
  } catch (e) {
    safeLog('error', 'founder command failed', e)
    return NextResponse.json({ ok: false, message: '指令處理失敗' }, { status: 500, headers: founderCacheHeaders() })
  }
}
