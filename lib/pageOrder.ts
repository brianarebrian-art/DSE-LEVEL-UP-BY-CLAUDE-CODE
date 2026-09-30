// 學生主瀏覽循環 —— PageNav 嘅【單一來源】。
//
// ══ 點解要有呢張表 ══
// 「每頁加 Forward／Backward」如果靠逐個 page.tsx 手動加 <PageNav>，就變成
// 一張要人記得去維護嘅清單。新開一條 route 冇人加，個 nav 就靜靜哋冇咗 ——
// 冇錯誤訊息、冇測試紅、冇人發現。2026-09-18 一日之內同一個模式撞到三次
//（/about 嘅 FAQ 講緊一個已剷除嘅鎖九日、守住佢嗰條測試兩個窿都對唔中、
// 手寫 token 表寫咗四個 repo 根本冇嘅變數），所以呢度唔行清單，行單一來源：
//
//   · PageNav 讀呢張表，唔喺表入面就自己收起 —— 零個 page.tsx 要改
//   · scripts/guard-nav.mjs 反向核：app/ 每一條 route 要麼喺 PAGE_ORDER，
//     要麼 immersive，要麼喺 EXCLUDED 並且寫低理由。三樣都唔係就 exit 1。
//
// 即係話新開一條 route 會即刻令 `npm run qa` 紅，逼人決定佢排第幾 ——
// 而唔係靜靜哋冇咗導航。
//
// ══ 點解係呢六條 ══
// 唔係揀出嚟嘅，係全站三條持久導航嘅交集（2026-09-18 實測）：
//   Navbar    /subjects /dashboard /bookmarks /notes（＋首頁 logo）
//   BottomNav /subjects /dashboard /bookmarks /account
//   Sidebar   /subjects /dashboard /bookmarks /relax
// 學生本身已經喺呢幾頁之間行，PageNav 只係加一條線性路徑，唔係發明新流程。
//
// ⚠️ /relax 出現喺 Sidebar，但佢係 IMMERSIVE_ROUTES —— 所以【唔喺】呢張表。
//    理由見下面對 immersive 嘅處理。

/** 有序循環。最後一條嘅「下一頁」返到第一條。 */
export const PAGE_ORDER = [
  '/',
  '/subjects',
  '/dashboard',
  '/bookmarks',
  '/notes',
  '/account',
] as const

/**
 * 刻意唔畀 PageNav 嘅 route，每條都要寫低理由。
 *
 * ⚠️ 全螢幕任務模式（/practice、/relax、/paper-warrior、/answer-sheet…）
 *    【唔喺呢度列】—— 佢哋由 `lib/immersiveRoutes.ts` 嘅 IMMERSIVE_ROUTES
 *    自動推導。抄多一份落嚟，兩張表遲早會分叉，而分叉嗰日冇人會知。
 *
 *    佢哋被排除嘅理由亦唔係「順手」：immersiveRoutes.ts 檔頭寫明全屏係為咗
 *    「唔好將『隨時可以走去第二度』呢個念頭一路擺喺眼前」。喺練習頁底部加
 *    一條前／後頁掣，就係將嗰個念頭原封不動擺返落去。
 */
export const EXCLUDED: Record<string, string> = {
  // 唔係畀學生嘅
  '/admin': '管理後台，唔應該有學生導航',
  '/dev/answer-cards': '開發工具頁',
  '/dev/long-session': '開發工具頁',

  // 流程中途，有自己嘅去向
  '/(auth)/sign-in': '登入流程，中途插入循環會令人半路走咗',
  '/(auth)/sign-up': '註冊流程，同上',
  '/result': '一節練習嘅終點頁，本身已經帶住下一步',
  '/start': '「開始練習」中轉頁，按本機紀錄即時轉去練習或科目列表，本身冇內容',
  '/sign-in-error': '登入失敗落腳頁（auth.ts pages.error），本身帶住返去練習的連結',
  '/waiting': '情緒支援落腳頁，唔應該喺呢度催人去下一頁',

  // 動態詳情頁：由上層列表入，返回路徑係返上層
  '/cantonese/[sceneId]': '動態詳情頁，返回路徑係返 /cantonese',
  '/cantonese/learn': '廣東話學習方法頁，由 /cantonese 入，返回路徑係返 /cantonese',
  '/notes/[subject]': '動態詳情頁，返回路徑係返 /notes',
  '/source-lab/[id]': '動態詳情頁，返回路徑係返 /source-lab',
  '/subjects/[subject]': '動態詳情頁，返回路徑係返 /subjects',

  // Footer 資訊／法務頁：由 Footer 直達，唔屬瀏覽循環
  '/about': 'Footer 資訊頁',
  '/community-safety': 'Footer 資訊頁',
  '/methodology': 'Footer 資訊頁',
  '/prediction-method': 'Footer 資訊頁',
  '/privacy': 'Footer 法務頁',
  '/transparency': 'Footer 資訊頁',
  '/trust': 'Footer 資訊頁',

  // 支線功能頁：由 /subjects 或各自入口入，唔喺主循環
  //
  // ⚠️ /cantonese 刻意【唔入】PAGE_ORDER。本檔開頭寫明循環嗰六條係
  //    Navbar ∩ BottomNav ∩ Sidebar 嘅交集，而 /cantonese 唔喺任何一條
  //    持久導航入面。為咗一個新頁破自己一日前先寫低嘅規則，個規則就變裝飾。
  //    2026-09-26 起入口改為「不考之地」（/off-syllabus），首頁當眼卡已移走。
  //    入口唔擺科目總覽，因為新來港支援唔屬於任何一科。
  '/cantonese': '新來港日常廣東話（業餘班·非正規生活支援），由 /off-syllabus 入，唔屬任何科目',
  // 2026-09-26 Yuna：非 DSE 範圍內容嘅集合頁，入口喺三橫選單同側欄最尾，刻意唔入循環。
  '/off-syllabus': '不考之地：非 DSE 考核範圍內容，由三橫選單及側欄入，唔屬主循環',
  '/off-syllabus/[category]': '動態詳情頁（話題卡範疇），返回路徑係返 /off-syllabus',
  '/capsule': '支線功能頁',
  '/concept-net': '支線功能頁',
  '/exam-day': '支線功能頁',
  '/logic-log': '支線功能頁',
  '/predictor': '支線功能頁，由側欄「等級預測」入；個人化內容，同 /dashboard 一樣唔入 sitemap',
  '/reading': '支線功能頁',
  '/sensei': '支線功能頁',
  '/source-lab': '支線功能頁',
  '/writing': '支線功能頁',
}

export type OrderedRoute = (typeof PAGE_ORDER)[number]

/** pathname 喺循環入面嘅位置；唔喺就 -1。 */
export function orderIndex(pathname: string | null): number {
  if (!pathname) return -1
  // 尾斜線正規化：Next.js 預設唔帶，但外部連結／手動輸入可能帶。
  const p = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return (PAGE_ORDER as readonly string[]).indexOf(p)
}


/**
 * 每頁底部的「下一步」（UX 循環 LOOP 34；第二份 loop prompt §23）。
 *
 * 以前 PageNav 按 PAGE_ORDER 出「上一頁：首頁／下一頁：我的進度」—— 那是網站的頁面樹，
 * 不是學生想做的事。改為按頁面給兩個去處：第一個一律是繼續練習（/start 按本機紀錄決定去哪），
 * 第二個是這一頁之後最常要做的事。PAGE_ORDER 仍然是「哪些頁有這一行」的單一來源，
 * scripts/guard-nav.mjs 照舊要求每條 route 分類。
 */
export interface IntentLink { href: string; zh: string; en: string }
const PRACTISE: IntentLink = { href: '/start', zh: '繼續練習', en: 'Keep practising' }
export const INTENT_LINKS: Record<(typeof PAGE_ORDER)[number], readonly [IntentLink, IntentLink]> = {
  '/': [PRACTISE, { href: '/subjects', zh: '揀其他科目', en: 'Choose another subject' }],
  '/subjects': [PRACTISE, { href: '/bookmarks', zh: '查看錯題', en: 'Review saved questions' }],
  '/dashboard': [{ ...PRACTISE, zh: '再做 10 題', en: 'Ten more questions' }, { href: '/bookmarks', zh: '查看錯題', en: 'Review saved questions' }],
  '/bookmarks': [{ ...PRACTISE, zh: '再做 10 題', en: 'Ten more questions' }, { href: '/dashboard', zh: '睇進度', en: 'See progress' }],
  '/notes': [PRACTISE, { href: '/subjects', zh: '揀科目', en: 'Choose a subject' }],
  '/account': [PRACTISE, { href: '/dashboard', zh: '睇進度', en: 'See progress' }],
}

export function intentLinks(pathname: string | null): readonly [IntentLink, IntentLink] | null {
  const i = orderIndex(pathname)
  return i < 0 ? null : INTENT_LINKS[PAGE_ORDER[i]]
}
