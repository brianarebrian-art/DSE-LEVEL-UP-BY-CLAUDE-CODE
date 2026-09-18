import { EncouragementWall } from 'dse-level-up'

// 打氣說話（Emma/UDL）— 溫暖共情、零責備。每日輪換 3 條（以日期作種子， 避免 hydration 不一致：mount 後才渲染）。 

export function Default() {
  return (
    <div className="max-w-lg">
      <EncouragementWall />
    </div>
  )
}
