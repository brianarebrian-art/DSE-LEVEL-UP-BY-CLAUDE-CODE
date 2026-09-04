// 用戶資料登記表 —— 每一張帶 `user_id` 嘅表，喺呢度登記一次。
//
// ══ 點解要有呢個檔 ══
// 2026-08-20 查證發現 /api/account/delete 只刪 `user_progress` 同 `profiles`。
// 但 `user_settings`（當時 114 行）、`wall_posts`、`wall_likes` 一樣帶 user_id，
// 一律冇刪。即係「你可以刪除自己嘅資料」呢句承諾，當時係假嘅。
//
// 呢類 bug 唔會由一次 code review 捉到：刪除路由同「新增一張表」呢兩件事，
// 永遠唔會喺同一個 PR 出現。所以唯一守得住嘅辦法係一張【單一登記表】+ 一條
// 測試，去比對 migrations 入面實際 create 咗、又未 drop 嘅表。
//
// 加新表帶 user_id？加落嚟。唔加 → lib/__tests__/user-data-erasure.test.mts 會紅。

/** 儲存該用戶自己資料、刪帳號時必須清走嘅表。 */
export const USER_SCOPED_TABLES = [
  'user_progress', // 雲端練習進度（分數、逐課題答對率、未完成嘅卷）
  'user_settings', // 無障礙同介面偏好（易讀字體、閱讀尺、字級⋯）
  'profiles', // 顯示名稱同角色
  // ↓ 影子溫書室已於 2026-08-21 由代碼庫刪走（docs/DECISION-no-interaction.md），
  //   但 `supabase/migrations/0011_drop_wall.sql` 【未套用】—— 兩張表仲喺生產。
  //   所以呢兩行【要留住】：刪帳號仍然要清得走殘留資料。0011 套用之後留住亦無害
  //   （刪除路由對 42P01「表唔存在」當 no-op）。
  'wall_posts',
  'wall_likes',
  'user_sessions', // 0010 已寫好但未 apply；表仲喺度，所以照刪（防守性）
  // 0014 Plus 裝置 LRU。同付費表唔同 —— 呢張【要刪】：佢冇稅務用途，
  // 淨係一堆「呢個瀏覽器設定檔幾時用過」嘅紀錄。刪帳號留住佢冇任何理由。
  'plus_devices',
] as const

/**
 * 刻意【唔】刪嘅表，每個必須有理由。
 * 冇理由嘅豁免遲早會變成「加咗落去就算」，到時個測試等於冇。
 */
export const NOT_USER_SCOPED = [
  {
    table: 'review_decisions',
    why: '題目審批紀錄。`reviewer_email` 係內部審題人（Brian／Yuna），唔係學生資料；' +
      '而且係學術問責紀錄，刪咗就無法交代邊條題由邊個批過。',
  },
  // ── 以下三張係 0013 付費表。憲章 §4.3：「訂閱紀錄保留 7 年（稅務需要），
  //    學習數據於 30 日內刪除」—— 即係付款同學習兩條軌，刪除規則唔同。
  //
  //    ⚠️ 呢三個豁免令 /privacy 嘅「你可以刪除自己嘅資料」變成【有例外】。
  //    例外本身合法（稅務保留係 PDPO 認可嘅目的），但頁面必須講出嚟，
  //    否則就係一句守唔住嘅承諾 —— 見 lib/__tests__/privacy-page.test.mts
  //    嘅精神：頁面聲稱嘅嘢要對得返實際代碼。
  //
  //    ⚠️ 更好嘅設計係「匿名化而非保留」：刪帳號時將 user_id 換成不可逆
  //    假名，金額／日期／SKU／Stripe id 照留（稅務要嘅係交易，唔係身分），
  //    身分嗰條線由 Stripe 保管（佢哋本身係法定收款紀錄持有人）。
  //    未做 —— 呢個係政策決定（保留可識別身分 7 年 vs 匿名化），
  //    要創辦人拍板，唔應該由實作靜靜哋選。
  {
    table: 'plus_entitlements',
    why: 'Plus 存取權交易紀錄。憲章 §4.3 要求訂閱紀錄保留 7 年作稅務用途 —— ' +
      '刪咗就交代唔到收過邊筆錢。⚠️ 現時連 user_id 一齊留，即係刪帳號後' +
      '呢個人喺付費表仍然可識別；/privacy 必須寫明此例外。待創辦人決定是否改為匿名化。',
  },
  {
    table: 'purchases',
    why: '一次性產品（單科試卷／衝刺包）交易紀錄。同 plus_entitlements 一樣受 §4.3 ' +
      '七年稅務保留約束。⚠️ 同樣連 user_id 一齊留，/privacy 必須寫明。',
  },
  {
    table: 'consent_logs',
    why: '年齡／監護人同意聲明。作用係交易爭議（chargeback）時證明用戶當時聲明過乜。' +
      '⚠️ 但 chargeback 窗口係月計，唔係 7 年 —— 呢張表冇理由陪住訂閱紀錄留咁耐。' +
      '待創辦人定一個實際保留期（建議 2 年）並加自動清除，而家係無限期保留。',
  },
] as const

export type UserScopedTable = (typeof USER_SCOPED_TABLES)[number]
