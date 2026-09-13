// DELETE /api/me —— PDPO 刪除權（雲端半邊）。
//
// ⚠️ 呢個檔【唔可以】有自己嘅刪除邏輯。佢淨係將 app/api/account/delete/route.ts
//    嘅 POST handler 以 DELETE 動詞再出一次。
//
// 點解唔另寫一份：兩個會刪資料嘅入口，遲早會有一個跟唔上 lib/privacy/userData.ts
// 嘅登記表 —— 2026-08-20 之前就發生過一次（原路由硬編兩張表，靜靜哋留低
// user_settings 同 wall_posts）。一個實作、兩個名，就冇得分叉。
// lib/__tests__/wipe-device.test.mts 測試 ③ 守住呢一點。
//
// 點解要有 /api/me：DELETE /api/me 係 REST 慣例嘅寫法，目標書亦係咁指定。
// 舊路徑 POST /api/account/delete 保留 —— 已經載入咗舊版頁面嘅瀏覽器仍然會打佢。
//
// 行為完全相同：要登入（否則 401）、要 body { confirm: true }（否則 400）、
// 有任何一張表刪唔到就回 500 ＋ 表名，唔會回 ok。
export const dynamic = 'force-dynamic'

export { POST as DELETE } from '../account/delete/route'
