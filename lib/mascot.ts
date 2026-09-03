// 吉祥物登記處 —— 一張表管晒「有邊幾隻」同「邊頁擺邊隻」。
//
// ══ 點解要一張表而唔係各頁自己寫 ══
// 創辦人 2026-09-03 定咗兩條規則：
//   ① 每頁最多擺一隻
//   ② 做緊題目嘅時候唔好擺
// 呢兩條散落喺三十幾個頁面檔入面係守唔住嘅 —— 下次有人加一版新頁，
// 冇人會記得去揾規則喺邊。放晒喺呢度，測試就綁得住（見
// lib/__tests__/mascot.test.mts）。

/**
 * 可用姿勢。檔案喺 public/owl/。
 *
 * ⚠️ 貼紙表原本有七隻，以下兩隻【永久唔收】，唔好補返上嚟：
 *   · 打機 —— 主機係 Nintendo Switch，紅藍 Joy-Con ＋ 機身 logo 清晰可見
 *   · 攞平板 —— 平板背面有蘋果 logo
 * 憲章 §4 零版權侵犯。呢個站係公開、面向 12–18 歲用戶嘅教育平台；
 * 喺頁面長期擺一個帶住 Nintendo／Apple 商標嘅吉祥物，同「改寫題目避開
 * HKEAA 版權」係同一條線，而且商標比版權仲嚴，唔會因為係「畫嘅」而免責。
 * 要用嘅話要重畫件裝置去 logo 先。有測試鎖住呢個決定。
 *
 * 第七隻 skateboard 冇商標問題，切咗出嚟擺喺 public/owl/，
 * 但未上任何頁 —— 滑板 ＋「PLAY」塗鴉嘅街頭感同憲章 §9「學長學姐式共情」
 * 對唔上。留返等創辦人決定擺邊，唔硬塞。
 */
export const POSES = {
  reading: { w: 398, h: 321 },
  armchair: { w: 392, h: 348 },
  mug: { w: 256, h: 311 },
  'headset-mug': { w: 241, h: 325 },
  skateboard: { w: 303, h: 345 },
} as const

export type Pose = keyof typeof POSES

/** 商標姿勢黑名單。測試會讀呢張表，確保佢哋唔會靜靜雞返嚟。 */
export const BANNED_POSES = ['switch', 'tablet'] as const

/**
 * 規則②：做緊題目嘅頁面一隻都唔擺。
 *
 * 唔淨止係「唔好阻住」—— 一隻喺你啱啱答錯之後仲喺度笑緊嘅吉祥物，
 * 讀落係嘲笑，唔係陪伴（憲章 §7 大愛設計）。呢個係吉祥物最容易好心做壞事
 * 嘅位，所以寧可整條路由封死，唔靠各頁自己判斷。
 *
 * 前綴比對，子路由一齊計（例如 /source-lab/[id] 嘅史料作答）。
 */
export const NO_MASCOT_ROUTES = [
  '/practice',
  '/answer-sheet',
  '/paper-warrior',
  '/source-lab',
] as const

/**
 * 規則①：每頁最多一隻 —— 所以呢度係 route → pose 嘅一對一映射。
 * 加新頁就喺呢度加一行；一條路由寫兩次，TypeScript 自己會叫。
 *
 * 點解揀呢四個位：呢四版都係學生「停低咗」嘅時刻（入站、睇進度、抖、專注），
 * 唔係「做緊嘢」嘅時刻。吉祥物要建立嘅係認得出個網站，唔係喺人趕住做題
 * 嗰陣攞注意力。
 */
export const PLACEMENTS = {
  '/': 'reading',
  '/dashboard': 'mug',
  '/relax': 'armchair',
  '/focus': 'headset-mug',
} as const satisfies Record<string, Pose>

/** pathname 係咪落喺「唔准擺」嘅範圍（子路由一齊計）。 */
export function isNoMascotRoute(pathname: string): boolean {
  return NO_MASCOT_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))
}
