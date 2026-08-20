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
  'wall_posts', // 影子溫書室留言（連未審核嘅）
  'wall_likes', // 影子溫書室嘅心心
  'user_sessions', // 0010 已寫好但未 apply；表仲喺度，所以照刪（防守性）
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
] as const

export type UserScopedTable = (typeof USER_SCOPED_TABLES)[number]
