import { generateText, gateway } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const mode = body?.mode === 'sop' ? 'sop' : 'students'

  try {
    const result = await generateText({
      model: gateway('openai/gpt-4o-mini'),
      system: '你是 DSE Level Up 的研究助理。只分析合成角色與產品原則，不使用或聲稱擁有真實學生資料。以繁體中文輸出，指出三個可驗證的觀察及一個限制。',
      prompt: mode === 'students' ? '根據以下合成研究摘要，模擬四名不同學習習慣的中學生進行 14 日溫習：免登入 5–10 分鐘短練、即時錯因分類與一鍵再練、非強制且可設定頻率的提醒。請輸出三個可用真實事件驗證的觀察及一個限制。研究摘要：強制登入會造成流失；簡短、可執行的診斷較適合碎片時間；所有留存與比例均不可視為真實數據。' : '根據以下 DSE Level Up 研究摘要審視 SOP：P0 是免登入短練入口、題目審核狀態、一鍵回報及 48–72 小時初步回覆 SLA、簡短診斷模板、透明說明匿名使用與可選同步。請指出三個產品決策風險或驗證建議及一個限制。不得作出升分保證或虛假教師審核聲稱。',
      maxOutputTokens: 500,
    })
    return NextResponse.json({ text: result.text, source: 'Vercel AI Gateway approximation' })
  } catch {
    return NextResponse.json({ error: 'AI Gateway unavailable', source: 'local approximation' }, { status: 503 })
  }
}
