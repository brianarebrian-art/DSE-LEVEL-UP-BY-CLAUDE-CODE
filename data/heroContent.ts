import type { Season } from '@/utils/season'

// 首頁 Hero 季節性文案（方向一）。雙語（en 三元），light-first 語調：學長學姐共情、
// 零 gamification、零醫療級宣稱、零虛構統計。CTA 標籤純文字（配 lucide ArrowRight SVG，
// 唔用 emoji 作功能圖標 —— 憲章 §1）。過渡/放榜季導向 /waiting。

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

export function getSeasonalHero(season: Season, en: boolean): HeroCopy {
  switch (season) {
    case 'golden':
      return {
        badge: en ? '📚 New school year · 100% free' : '📚 新學年開始 · 完全免費',
        headline1: en ? 'A new year,' : '新學年，',
        headline2: en ? 'a fresh start' : '新開始',
        subhead: en
          ? 'Build the habit early — progress a little each day, with DSE students across Hong Kong.'
          : '及早養成習慣 —— 同全港 DSE 考生一齊，逐日進步一點。',
        ctaStartLabel: en ? 'Start revising' : '開始溫書',
        ctaStartHref: '/subjects',
        ctaSecLabel: en ? 'See how it works' : '睇吓點運作',
        ctaSecHref: '/methodology',
      }
    case 'stable':
      return {
        badge: en ? '📚 Steady progress · 100% free' : '📚 穩步前進 · 完全免費',
        headline1: en ? 'Steady progress,' : '穩步前進，',
        headline2: en ? 'a little better each day' : '每日進步一點',
        subhead: en
          ? 'Your error DNA has already pinned your blind spots — clear them one by one.'
          : '錯題 DNA 已經幫你搵到盲點，逐個擊破。',
        ctaStartLabel: en ? 'Keep revising' : '繼續溫書',
        ctaStartHref: '/subjects',
        ctaSecLabel: en ? 'See my progress' : '睇我的進度',
        ctaSecHref: '/dashboard',
      }
    case 'sprint':
      return {
        badge: en ? '📚 Final 100 days · 100% free' : '📚 最後 100 日 · 完全免費',
        headline1: en ? 'The final 100 days —' : '最後 100 日 ——',
        headline2: en ? "it's mark-grabbing, not revision" : '唔係溫書，係搶分',
        subhead: en
          ? 'Grab the marks the traps hide. Master the logic; the numbers can change, you still answer.'
          : '搶返啲被陷阱藏住嘅分。掌握邏輯，數字點變你都識答。',
        ctaStartLabel: en ? 'Start grabbing marks' : '開始搶分',
        ctaStartHref: '/subjects',
        ctaSecLabel: en ? 'See my progress' : '睇我的進度',
        ctaSecHref: '/dashboard',
      }
    case 'peak':
      return {
        badge: en ? '📚 Final 30 days · 100% free' : '📚 最後 30 日 · 完全免費',
        headline1: en ? 'The final 30 days —' : '最後 30 日 ——',
        headline2: en ? "we push through together" : '我哋一齊衝',
        subhead: en
          ? "Tired is normal. Do one question if that's all today allows — it still counts."
          : '攰係正常。今日淨係做到一題都算 —— 一樣有進步。',
        ctaStartLabel: en ? 'Practise now' : '即刻練習',
        ctaStartHref: '/subjects',
        ctaSecLabel: en ? 'Breathing space' : '減壓緩衝區',
        ctaSecHref: '/relax',
      }
    case 'transition':
      return {
        badge: en ? '📚 Exams done · we wait together' : '📚 考完試 · 一齊等放榜',
        headline1: en ? 'Whatever your score,' : '無論幾多分，',
        headline2: en ? 'you matter' : '你都值得',
        subhead: en
          ? "The exam being over doesn't mean it's over. Let's wait for results together."
          : '考完唔代表完，我哋一齊等放榜。',
        ctaStartLabel: en ? 'Waiting-room space' : '去等放榜專區',
        ctaStartHref: '/waiting',
        ctaSecLabel: en ? 'Breathing space' : '減壓緩衝區',
        ctaSecHref: '/relax',
      }
    case 'anxiety':
    default:
      return {
        badge: en ? '📚 Before results day · we are with you' : '📚 放榜前 · 我哋陪你',
        headline1: en ? 'Before results day,' : '放榜前，',
        headline2: en ? "we're with you" : '我哋陪你',
        subhead: en
          ? "Take a slow breath — you've prepared. Whatever the result, you deserve respect."
          : '深呼吸，你已經準備好咗。無論結果點，你都值得被尊重。',
        ctaStartLabel: en ? 'Waiting-room space' : '去等放榜專區',
        ctaStartHref: '/waiting',
        ctaSecLabel: en ? 'Breathing exercise' : '呼吸練習',
        ctaSecHref: '/waiting',
      }
  }
}
