// 全螢幕任務模式路由 —— 呢啲頁唔顯示 Navbar／Footer／底欄。
//
// ══ 點解要全屏 ══
// 沉浸式嘅定義就係零干擾。練習、專注、呼吸空間呢類頁，學生係喺度做一件
// 需要專注嘅事；頁頂一條導航列同頁底一大段連結（a）食走垂直空間、
// （b）令學生答題時容易誤撳離開、（c）將「隨時可以走去第二度」呢個念頭
// 一路擺喺眼前。
//
// ══ 點解係隱藏而唔係跟主題換色 ══
// 2026-09-02 莫蘭迪重設計嗰陣考慮過將 Navbar／Footer 一齊拉入莫蘭迪色系。
// 否決咗，理由有二：
//   1. 改色只係令接縫冇咁明顯，但接縫本身（練習頁有導航列）先係問題。
//   2. Navbar／Footer 喺 root layout，改佢哋會牽連 dashboard、landing
//      等所有頁，觸發大規模視覺迴歸；隱藏係零迴歸風險。
//
// ⚠️ 加路由入呢張表之前，先確認嗰頁【自己有返回路徑】——
// 冇嘅話學生會困死喺全屏狀態，只剩瀏覽器返回掣。
export const IMMERSIVE_ROUTES = [
  '/practice',
  '/focus',
  '/relax',
  '/paper-warrior',
  '/answer-sheet',
] as const

/** pathname 係咪落喺全螢幕任務模式（同一前綴嘅子路由一齊計）。 */
export function isImmersiveRoute(pathname: string | null): boolean {
  if (!pathname) return false
  return IMMERSIVE_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

// ── 莫蘭迪路由：已取消 ──────────────────────────────────────────────
// 2026-09-02 之前有一張 MORANDI_ROUTES，因為莫蘭迪色只鋪四個核心頁。
// 而家全站語意 token 已經整體指向莫蘭迪（app/globals.css 的 :root），
// 唔再需要逐條 route 開關 —— 呢張表連同 isMorandiRoute 一齊剷走。
// 保留呢段註釋，係因為「點解冇咗」比「有過乜」更容易有人重新加返。
