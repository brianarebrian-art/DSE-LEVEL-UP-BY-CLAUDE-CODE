import type { Season } from '@/utils/season'

// 首頁 Hero 文案。雙語（en 三元），light-first：溫柔陪伴、低壓力、
// 零 gamification、零醫療級宣稱、零虛構統計。CTA 標籤純文字（配 lucide ArrowRight SVG，
// 唔用 emoji 作功能圖標 —— 憲章 §1）。
//
// ── 主識別全年統一（2026-10-22 Growth Designer zh-HK）────────────────────────
//   badge         📚 DSE LEVEL UP · 練邏輯
//   headline      練到識答為止 / 唔使死背
//   subhead       同一類題換咗數字再出。中四至中六都可以用——約 {mins} 分鐘一節，
//                 免費，唔使登入。溫習路上，你唔使一個人硬撐。
//                 {mins} 由首頁用 sessionMinutes() 代入，唔好寫死分鐘數。
// 可見主 CTA 係四科快捷開始上面嗰句「揀一科，開始 N 題」（題數用 SESSION_SIZE）。
//
// 【刻意保留季節差異的一項】副文字連結（ctaSecLabel／ctaSecHref）維持逐季不同。
// 放榜季（transition／anxiety，5 月及 6-8 月）通往 /waiting 與 /relax，
// 係情緒支援入口，不能斷（憲章 §7）。其餘季節係「睇我的進度」。
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
    badge: en ? '📚 DSE LEVEL UP · Practise the logic' : '📚 DSE LEVEL UP · 練邏輯',
    // 中文上行不設逗號：兩行之間本已有換行分隔，逗號在行末會多出一段視覺留白。
    // 英文保留逗號，因為上行係未完成嘅子句。
    headline1: en ? 'Practise until you can answer,' : '練到識答為止',
    headline2: en ? 'no need to memorise' : '唔使死背',
    subhead: en
      ? 'The same kind of question comes back with new numbers. For Secondary 4 to 6 — about {mins} minutes a session, free, no sign-in. You don’t have to get through revision alone.'
      : '同一類題換咗數字再出。中四至中六都可以用——約 {mins} 分鐘一節，免費，唔使登入。溫習路上，你唔使一個人硬撐。',
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
