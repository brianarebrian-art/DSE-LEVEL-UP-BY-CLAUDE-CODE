import { NextResponse } from 'next/server'
import { getEntitlement, getEntitlementForDevice } from '@/lib/payment/entitlement'

// 登入後權限核對端點（Phase 2.1 ＋ 2.3 / 規格 §6.1）。
//
// 每次頁面載入都行呢條 —— 唔快取、唔預渲染。權限唔會存喺 client 任何地方
// （§6.2），所以每次都要問返 server。呢個係故意嘅成本：一個 round trip，
// 換返「清空瀏覽器資料之後權限唔會唔見咗」同「改部機時鐘過唔到期」。
//
// 回應【只有】tier 同 expires_at。冇 stripe id、冇金額、冇 SKU、冇交易歷史
// —— 前端渲染唔需要嗰啲，而每樣送落去嘅嘢都係一個有機會被記錄、
// 被快取、被截圖嘅嘢。
export const dynamic = 'force-dynamic'

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } }

// GET —— 純讀，唔帶裝置。畀唔需要 LRU 嘅地方用（例如伺服器渲染）。
export async function GET() {
  return NextResponse.json(await getEntitlement(), NO_STORE)
}

// POST —— 帶裝置 token，會 touch LRU（Phase 2.3）。
//
// 用 POST 而唔係 GET ?device=xxx：token 唔可以入 URL，
// 否則佢會出現喺伺服器日誌、referrer 同瀏覽紀錄入面。
// 而且呢個呼叫有副作用（更新 last_seen_at），POST 語意上亦啱。
export async function POST(req: Request) {
  let device: string | null = null
  try {
    const body = (await req.json()) as { device?: unknown }
    // 只認 UUID 格式。任何其他嘢當冇 —— 唔可以畀人塞任意字串入表。
    if (typeof body?.device === 'string' && /^[0-9a-f-]{36}$/i.test(body.device)) device = body.device
  } catch {
    device = null
  }

  return NextResponse.json(await getEntitlementForDevice(device), NO_STORE)
}
