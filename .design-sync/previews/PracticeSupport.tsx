import { PracticeSupport } from 'dse-level-up'

// 練習頁左下角無障礙工具角：易讀字體、字級調節（12–24px，經 <html> font-size
// 全站生效）、「今日夠了」零罪疚收工。
//
// ⚠️ 舊「唞一唞」呼吸掣已經由 PracticeSession 內嘅 RestMode 取代 ——
// 呢度喺 session 外層，停唔到練習計時，「休息」會變咗鐘照行。唔留兩個入口。

export function Default() {
  return (
    <div className="relative h-64 w-full">
      <PracticeSupport />
    </div>
  )
}
