import { MasteryRing } from 'dse-level-up'

// 掌握度環。數字係學生自己嘅答題紀錄，唔同人之間唔會比較（憲章 §16.E 約束 3）。
// 低分嗰格刻意都係中性呈現 —— §7 大愛設計紅線：唔准有打擊自信嘅元素，
// 所以「3/14」唔會變紅、唔會有交叉。

export function Strong() {
  return <MasteryRing label="供求分析" correct={17} total={20} />
}

export function Developing() {
  return <MasteryRing label="彈性計算" correct={9} total={20} />
}

export function JustStarted() {
  return <MasteryRing label="市場失效" correct={3} total={14} />
}

export function SubjectRow() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <MasteryRing label="供求分析" correct={17} total={20} size={72} />
      <MasteryRing label="彈性計算" correct={9} total={20} size={72} />
      <MasteryRing label="市場失效" correct={3} total={14} size={72} />
    </div>
  )
}
