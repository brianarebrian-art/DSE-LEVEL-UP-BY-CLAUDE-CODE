import { NextResponse } from 'next/server'
import { loadSubjectMCQuestions } from '@/data/questions/load'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { safeLog } from '@/lib/safeLog'
import { regrade, isSubmittedAnswers, MAX_ANSWERS } from '@/lib/verifyResult'

// POST /api/result/verify — 由服務端用答案庫重批一次，同前端計嘅分對數。
//
// 設計取捨（逐條寫低，因為每一條都係刻意嘅）：
//
// • 【唔要求登入】。全站 100% 免費、唔使登入就做得題；覆核加一道登入閘，
//   等於為咗一個純顯示層嘅核對而擋住未登入嘅學生。呢個 route 唔讀唔寫任何
//   用戶數據，冇身份可洩，所以匿名係啱嘅。
//
// • 【零儲存】。唔寫 Supabase、唔寫 log、唔記 IP。入面係學生答錯咗啲乜 ——
//   對一個 12–18 歲平台嚟講，呢啲嘢唔存落 server 就冇得洩。
//
// • 【只回匯總，唔回逐題對錯】。答案庫其實已經喺 client bundle（實測確認），
//   所以呢度回逐題對錯技術上唔算多洩密；但一個乾淨嘅「試一次睇啱唔啱」
//   端點係一個更方便嘅答案 oracle，冇必要親手造一個。
//
// • 【冇 rate limit】。Vercel serverless 每個 instance 記憶體獨立，in-memory
//   限流形同虛設（呢個係之前一份方案嘅實際錯誤）。真要限流要外部 store，
//   而呢個 route 純運算、零儲存、答案本身已公開 —— 唔值得為佢加依賴同成本。

export const dynamic = 'force-dynamic'

interface Body {
  subjectId: unknown
  answers: unknown
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  if (typeof body.subjectId !== 'string' || body.subjectId.length === 0 || body.subjectId.length > 60) {
    return NextResponse.json({ error: 'invalid subjectId' }, { status: 400 })
  }
  if (!isSubmittedAnswers(body.answers)) {
    return NextResponse.json(
      { error: `invalid answers (1–${MAX_ANSWERS} items required)` },
      { status: 400 },
    )
  }

  try {
    const bank = await loadSubjectMCQuestions(body.subjectId)
    if (bank.length === 0) {
      // 未知科目 —— 唔當錯誤，回一個「覆核唔到」畀前端靜靜收起。
      return NextResponse.json({ verified: false, reason: 'unknown_subject' })
    }

    // ⚠️ `correctZh` 唔係一個儲存欄位 —— MCQuestion 只有 `correctIndex` + `options[]`。
    // 前端喺 prepareQuestion() 度導出（PracticeSession.tsx:99），呢度必須用同一條式，
    // 否則答案表全部 undefined，個 route 會永遠靜靜回 verified:false 乜都驗唔到。
    const key = new Map(
      bank
        .map((q) => [q.id, q.options[q.correctIndex]] as const)
        .filter((pair): pair is readonly [string, string] => typeof pair[1] === 'string'),
    )
    const { score, total, unknownIds } = regrade(body.answers, (id) => key.get(id))

    if (total === 0) {
      return NextResponse.json({ verified: false, reason: 'no_matching_questions' })
    }

    const grade = predictGrade(score, getPracticeCutoffs(total, body.subjectId), body.subjectId).grade

    return NextResponse.json({
      verified: true,
      score,
      total,
      grade,
      // 幾多條 id 對唔上題庫（通常＝學生揸緊舊 bundle，或者題庫啱啱更新過）
      unmatched: unknownIds.length,
    })
  } catch (e) {
    safeLog('error', 'api/result/verify', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
