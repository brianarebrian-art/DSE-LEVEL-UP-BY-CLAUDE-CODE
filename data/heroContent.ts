import type { Season } from '@/utils/season'

// 首頁 Hero 季節性文案（方向一）。雙語（en 三元），light-first 語調：學長學姐共情、
// 零 gamification、零醫療級宣稱、零虛構統計。CTA 標籤純文字（配 lucide ArrowRight SVG，
// 唔用 emoji 作功能圖標 —— 憲章 §1）。
//
// ── 2026-08-09 冠軍方案（Brian 提案，全年適用）────────────────────────────────
// 主識別（badge／主標題／副標題／主 CTA）四項全年統一，六季一致：
//   badge         📚 DSE LEVEL UP · 掌握邏輯
//   headline      掌握邏輯，唔係背答案
//   subhead       無論數字點變，你都識答。DSE 戰場上，你唔係一個人。
//   主 CTA        開始練習 → /subjects
// 「掌握邏輯，唔係背答案」本身即憲章 §9 核心金句，亦已見於 layout.tsx 的 SEO
// meta，故此更動令首頁與全站主張一致。
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
    badge: en ? '📚 DSE LEVEL UP · Master the logic' : '📚 DSE LEVEL UP · 掌握邏輯',
    headline1: en ? 'Master the logic,' : '掌握邏輯，',
    headline2: en ? 'not the answers' : '唔係背答案',
    subhead: en
      ? "However the numbers change, you'll still know the answer. You are not alone on the DSE battlefield."
      : '無論數字點變，你都識答。DSE 戰場上，你唔係一個人。',
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
