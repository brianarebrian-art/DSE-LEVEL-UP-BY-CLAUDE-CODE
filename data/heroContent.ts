import type { Season } from '@/utils/season'

// 首頁 Hero 季節性文案（方向一）。雙語（en 三元），light-first 語調：學長學姐共情、
// 零 gamification、零醫療級宣稱、零虛構統計。CTA 標籤純文字（配 lucide ArrowRight SVG，
// 唔用 emoji 作功能圖標 —— 憲章 §1）。
//
// ── 2026-08-09 冠軍方案（Brian 提案，全年適用）────────────────────────────────
// 主識別（badge／主標題／副標題／主 CTA）四項全年統一，六季一致：
//   badge         DSE LEVEL UP · 選擇題練判斷
//   headline      練判斷 / 唔係成張卷
//   subhead       選擇題只練到窄窄一種技能：睇穿陷阱。唔等於掌握成張 DSE 卷。
//                 （2026-10-23 信任審計：舊句「掌握邏輯，唔係背答案」可被讀成成卷掌握。
//                 2026-10-08 創辦人回覆 47a 已刪「無論數字點變，你都識答」。）
//   主 CTA        開始練習 → /subjects
// 首頁主張對齊 /methodology：選擇題只練一種窄技能，不是成卷掌握。
//
// 【刻意保留季節差異的一項】副 CTA（ctaSecLabel／ctaSecHref）維持逐季不同。
// 冠軍方案並未指定副 CTA，而放榜季（transition／anxiety，5 月及 6-8 月）的副 CTA
// 正是通往 /waiting 與 /relax 的情緒支援入口。主識別轉為戰鬥語調之後，這條路更加
// 不能斷 —— 一個放榜前夕來到首頁的考生，主位見到「開始練習」，副位仍然見到
// 「呼吸練習」，兩者並存才符合憲章 §7 大愛設計。
//
// 季節模組（utils/season.ts）刻意保留而非刪除：日後若要恢復季節性主文案，
// 只需在下方各 case 改回專屬字串，無須重建架構。
export interface HeroCopy {
  badge: string
  headline1: string
  headline2: string // 漸變強調部分
  subhead: string
  ctaStartLabel: string
  ctaStartHref: string
  ctaSecLabel: string
  ctaSecHref: string
}

// 冠軍方案共用部分 —— 六季一致，改一處即全年生效。
function championCore(en: boolean) {
  return {
    badge: en ? 'DSE LEVEL UP · Multiple-choice judgement' : 'DSE LEVEL UP · 選擇題練判斷',
    headline1: en ? 'Train the judgement,' : '練判斷',
    headline2: en ? 'not the whole paper' : '唔係成張卷',
    subhead: en
      ? 'Multiple-choice only trains one narrow skill: spotting a trap. The same kind of question, new numbers. It is not mastery of a DSE paper.'
      : '選擇題只練到窄窄一種技能：睇穿陷阱。同一類題換數字再練。呢個唔等於掌握成張 DSE 卷。',
    ctaStartLabel: en ? 'Start practising' : '開始練習',
    // 全科入口。注意路由為複數 `/subjects`（app/subjects/），單數 `/subject` 不存在。
    ctaStartHref: '/subjects',
  }
}

export function getSeasonalHero(season: Season, en: boolean): HeroCopy {
  const core = championCore(en)

  switch (season) {
    case 'golden':
      return {
        ...core,
        ctaSecLabel: en ? 'See how it works' : '睇吓點運作',
        ctaSecHref: '/methodology',
      }
    case 'stable':
      return {
        ...core,
        ctaSecLabel: en ? 'See my progress' : '睇我的進度',
        ctaSecHref: '/dashboard',
      }
    case 'sprint':
      return {
        ...core,
        ctaSecLabel: en ? 'See my progress' : '睇我的進度',
        ctaSecHref: '/dashboard',
      }
    case 'peak':
      return {
        ...core,
        ctaSecLabel: en ? 'Breathing space' : '呼吸空間',
        ctaSecHref: '/relax',
      }
    case 'transition':
      // 5 月考完過渡期：主位戰鬥語調，副位保留等放榜專區入口。
      return {
        ...core,
        ctaSecLabel: en ? 'Waiting-room space' : '去等放榜專區',
        ctaSecHref: '/waiting',
      }
    case 'anxiety':
    default:
      // 6-8 月等放榜：同上，副位保留呼吸練習入口。
      return {
        ...core,
        ctaSecLabel: en ? 'Breathing exercise' : '呼吸練習',
        ctaSecHref: '/waiting',
      }
  }
}
