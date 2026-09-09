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
  // 私隱政策同意紀錄（0019，2026-09-09）。
  //
  // 「刪帳號要唔要連同意紀錄一齊刪」值得諗一諗：留住佢就等於留住一筆
  // 「呢個人曾經同意過」嘅個人資料，而佢已經叫我哋走。PDPO 之下，
  // 抹除請求就係抹除 —— 唔可以自己揀留低一件對我哋有用嘅嘢。
  //
  // 而且刪走亦冇後果：佢日後再登入，會當成從未被問過，重新見到同意書。
  // 呢個結果係啱嘅 —— 佢確實係一個全新開始。
  'privacy_consents',
] as const

/**
 * 刻意【唔】刪嘅表，每個必須有理由。
 * 冇理由嘅豁免遲早會變成「加咗落去就算」，到時個測試等於冇。
 */
// ── Better Auth 自己嘅表（只喺 email/password 開咗之後先存在）──────────────
//
// ⚠️ 呢批【唔可以】直接塞入 USER_SCOPED_TABLES：嗰個迴圈一律行
// `.eq('user_id', …)`，而 Better Auth 用嘅係另一套 key。塞咗入去唔會靜靜哋
// 唔刪 —— 係會撞 42703（undefined_column）令成個抹除 500。
//
// 而且 key 嘅【值】都唔同：USER_SCOPED_TABLES 用嘅 userId 係 Google `sub`
// （見 lib/auth/server.ts），而呢批用嘅係 Better Auth 自己嘅 user id。
// 兩個 id 喺同一次抹除入面同時存在，所以要分開攞。
//
// `verification` 冇 user id —— 佢由 email 做 identifier。唔清嘅話，一個
// 刪咗帳號嘅學生嘅電郵會留喺嗰度直到 token 過期。所以照 email 清。
export const BETTER_AUTH_TABLES = [
  { table: 'session', key: 'userId', of: 'betterAuthUserId' },
  { table: 'account', key: 'userId', of: 'betterAuthUserId' },
  { table: 'user', key: 'id', of: 'betterAuthUserId' },
  { table: 'verification', key: 'identifier', of: 'email' },
] as const

export const NOT_USER_SCOPED = [
  {
    table: 'review_decisions',
    why: '題目審批紀錄。`reviewer_email` 係內部審題人（Brian／Yuna），唔係學生資料；' +
      '而且係學術問責紀錄，刪咗就無法交代邊條題由邊個批過。',
  },
] as const

export type UserScopedTable = (typeof USER_SCOPED_TABLES)[number]
