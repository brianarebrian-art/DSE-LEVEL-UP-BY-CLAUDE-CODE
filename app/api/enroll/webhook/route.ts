import { NextRequest, NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'

interface InstagramMessageWebhookPayload {
  object?: string
  entry?: Array<{
    id?: string
    time?: number
    messaging?: Array<{
      sender?: { id: string }
      recipient?: { id: string }
      timestamp?: number
      message?: {
        mid?: string
        text?: string
      }
    }>
  }>
  // Direct test or mock payload format
  sender_id?: string
  student_name?: string
  target_subject?: string
  message_text?: string
}

export async function POST(req: NextRequest) {
  try {
    const read = await readJsonLimited(req, BODY_LIMIT.small)
    if (!read.ok) {
      return NextResponse.json({ error: read.error }, { status: read.status })
    }

    const body = read.value as InstagramMessageWebhookPayload

    // Parse sender and subject information from Instagram payload
    let senderId = body.sender_id || 'anonymous_ig_user'
    let messageText = body.message_text || ''

    if (body.entry && body.entry[0]?.messaging && body.entry[0].messaging[0]) {
      const msg = body.entry[0].messaging[0]
      senderId = msg.sender?.id || senderId
      messageText = msg.message?.text || messageText
    }

    const targetSubject = body.target_subject || (messageText.includes('英文') ? 'english' : 'math')

    // Generate simulated review item for enrollment triage
    const reviewItem = {
      id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id: senderId,
      source: 'instagram_dm',
      target_subject: targetSubject,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
      due_at: new Date(Date.now() + 86400000).toISOString(), // +1 day review follow-up
    }

    // Stripe Payment Link Template (configured per environment)
    const stripePaymentLink = process.env.STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_dse_level_up_mock'
    const replyTemplate = `多謝同學喺 Instagram 聯絡【溫習支援】！你揀選嘅專屬溫習計劃（${targetSubject}）已為你保留名額。請點擊連結完成啟動：${stripePaymentLink}?client_reference_id=${encodeURIComponent(senderId)}`

    return NextResponse.json({
      success: true,
      sender_id: senderId,
      review_item: reviewItem,
      stripe_payment_link: stripePaymentLink,
      reply_message: replyTemplate,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to process enrollment webhook', details: message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  // Instagram webhook verification challenge handler
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN || 'dse_level_up_verify_token'

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge || 'ok', { status: 200 })
  }

  return NextResponse.json({ status: 'active', endpoint: 'Instagram DM Enrollment Webhook' })
}
