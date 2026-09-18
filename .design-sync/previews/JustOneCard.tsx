import { JustOneCard } from 'dse-level-up'

// 「只做 1 題」入口。服務對象：低動機、抑鬱、或者見到「10 題」就即刻閂 app 嘅學生。
// 呢張卡唯一嘅工作係**拆低門檻** —— 所以佢冇進度條、冇連續日數、冇「仲差幾多」。
// 休息日護盾生效嗰日，佢會自動轉成無壓放鬆文案（見 lib/restDay.ts）。

export function Default() {
  return (
    <div className="max-w-md">
      <JustOneCard />
    </div>
  )
}

export function Stacked() {
  // dashboard 側欄用嘅直向版。
  return (
    <div className="max-w-xs">
      <JustOneCard stack />
    </div>
  )
}
