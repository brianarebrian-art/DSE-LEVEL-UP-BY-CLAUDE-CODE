import { generateText, gateway } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const mode = body?.mode === 'sop' ? 'sop' : 'students'

  try {
    const result = await generateText({
      model: gateway('openai/gpt-4o-mini'),
      system: '你是 DSE Level Up 的研究助理。只分析合成角色與產品原則，不使用或聲稱擁有真實學生資料。以繁體中文輸出，指出三個可驗證的觀察及一個限制。',
      prompt: mode === 'students' ? '模擬四名不同學習習慣的中學生進行 14 日溫習，分析間隔練習、錯因分類、情緒負荷的可能影響。' : '檢視一個以「先理解再評分、每次只推一個行動、內容紅線守門」為核心的 DSE 學習產品 SOP，找出風險與建議。',
      maxOutputTokens: 500,
    })
    return NextResponse.json({ text: result.text, source: 'Vercel AI Gateway approximation' })
  } catch {
    return NextResponse.json({ error: 'AI Gateway unavailable', source: 'local approximation' }, { status: 503 })
  }
}
