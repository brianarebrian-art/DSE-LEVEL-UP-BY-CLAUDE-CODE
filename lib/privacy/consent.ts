// 私隱政策同意 —— 版本、文案摘要、client 端狀態。
//
// ══ 設計判斷（2026-09-09，Phase 2；Phase 1 報告見 docs/PHASE1-privacy-consent-gate.md）══
//
// 【選項 B】唔同意 ≠ 用唔到網站。
// 同意書真正授權嘅係「你嘅資料離唔離開部機」，唔係「你用唔用得呢個網站」。
// 全站唔使登入都做得晒所有題目（憲章 §3 全部功能免費、無門檻），所以將同意
// 同「用唔用得」綁埋，會喺 sign-in 頁豎一道牆，趕走最需要幫嘅嗰批學生。
//
// 實作上呢點靠一個位成立：SyncProvider 只喺 `consent === 'granted'` 先同步。
// 唔同意 → localStorage 一個字都冇少，練習、雷達圖、SEN 設定全部照行。
//
// 【POLICY_VERSION 係全份設計最重要嗰樣嘢】
// 冇版本號，同意紀錄就淨係證明到「佢撳過個掣」，證明唔到佢究竟同意咗乜。
// 文案改咗而版本號冇 bump，舊紀錄會靜靜哋扮成「佢同意過新版」。
// 呢個判斷同已剷走嗰張 `consent_logs`（0013_plus_payment.sql 檔頭）一模一樣 ——
// 嗰啲理由今日一樣成立，所以照抄。
// 迴歸鎖：lib/__tests__/privacy-consent.test.mts 會 hash 私隱頁文案，
// 改咗而版本號冇 bump 就 fail build。

/**
 * 私隱政策版本。**改 /privacy 文案就要 bump 呢個。**
 *
 * v1 —— 2026-09-09 首版。內容基準：2026-09-08 §16.E 修訂之後嘅 /privacy，
 * 即係已經包含「未完成嗰節連你揀咗邊個選項」同「錯因自診」會上雲。
 *
 * v2 —— 2026-09-11。新增一項上傳：【你開過 app 嘅日期】（一日一行，
 * migration 0018 重建嘅 user_sessions）。同時明文寫低「未登入唔會記錄你嚟過」。
 *
 * ⚠️ 呢次一定要 bump，唔可以只更新指紋：新增咗一個【採集類別】，
 * 而唔係執錯字。一個喺 v1 撳過同意嘅學生，從來冇見過「會記低你開過 app 嘅日期」
 * 呢句 —— 攞佢張舊同意書去蓋新採集，就係本檔頭講嗰個「舊紀錄靜靜哋扮成同意咗新版」。
 */
export const POLICY_VERSION = '2026-09-11.v2'

/** 同意狀態。`unknown` = 未問過或者查緊。 */
export type ConsentState = 'unknown' | 'granted' | 'declined'

/**
 * 同意書要答嘅三條問題。
 *
 * 用戶群係 12–18 歲 —— 唔可以係一幅法律 wall of text。每條一句講完。
 * 完整條文喺 /privacy，呢度係摘要，兩邊唔可以講唔同嘢。
 */
export interface ConsentPoint {
  zh: string
  en: string
}

export const CONSENT_POINTS: { q: ConsentPoint; a: ConsentPoint }[] = [
  {
    q: { zh: '我哋會攞你啲咩？', en: 'What do we take?' },
    a: {
      zh: '你嘅練習進度、逐個課題嘅答對率、未做完嗰份卷（連你每題揀咗邊個選項）、同埋你答錯之後揀嘅錯因。',
      en: 'Your practice progress, your accuracy per topic, any unfinished set (including which option you picked on each question), and the cause you picked after a wrong answer.',
    },
  },
  {
    q: { zh: '攞嚟做咩？', en: 'What is it for?' },
    a: {
      zh: '一個用途：令你換部機都接得返。手機做到一半，返到屋企用 iPad 繼續 —— 就係為咗呢件事，冇第二個用途。',
      en: 'One purpose: so you can pick up where you left off on another device. Half a set on your phone, finish it on your iPad at home — that is the whole reason, and there is no second use.',
    },
  },
  {
    q: { zh: '邊個睇到？', en: 'Who can see it?' },
    a: {
      zh: '淨係你自己。唔會畀學校、老師、補習社、家長或者任何第三方，亦唔會攞你同其他學生比較或者排名。',
      en: 'Only you. Never your school, teacher, tutor, parents or any third party, and never used to compare or rank you against other students.',
    },
  },
]

/** 唔同意會點 —— 要講到明明白白，唔可以令人以為做過嘅嘢會冇咗。 */
export const DECLINE_NOTE = {
  zh: '唔同意都照用得晒成個網站 —— 所有題目、所有科目、所有功能，一樣都唔會少。分別只係你嘅進度淨係留喺呢部機，唔會跟你去第二部機。你隨時可以喺「我嘅帳戶」度改。',
  en: 'Declining still gives you the entire site — every question, every subject, every feature, nothing withheld. The only difference is that your progress stays on this device instead of following you to another one. You can change this any time from your account page.',
}

/** 本機記住「今次已經問過」，避免同一個 session 彈完又彈。 */
export const CONSENT_LOCAL_KEY = 'dse_consent_asked'
