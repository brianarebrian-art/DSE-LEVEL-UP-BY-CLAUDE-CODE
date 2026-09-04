import { NextResponse } from 'next/server'
import { getEntitlement } from '@/lib/payment/entitlement'

// 登入後權限核對端點（Phase 2.1 / 規格 §6.1）。
//
// 每次頁面載入都行呢條 —— 唔快取、唔預渲染。權限唔會存喺 client 任何地方
// （§6.2），所以每次都要問返 server。呢個係故意嘅成本：一個 round trip，
// 換返「清空瀏覽器資料之後權限唔會唔見咗」同「改部機時鐘過唔到期」。
export const dynamic = 'force-dynamic'

export async function GET() {
  const ent = await getEntitlement()

  // 回應【只有】tier 同 expires_at。冇 stripe id、冇金額、冇 SKU、
  // 冇交易歷史 —— 前端渲染唔需要嗰啲，而每樣送落去嘅嘢都係一個
  // 有機會被記錄、被快取、被截圖嘅嘢。
  return NextResponse.json(ent, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
