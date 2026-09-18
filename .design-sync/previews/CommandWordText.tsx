import { CommandWordText } from 'dse-level-up'

// 指令字高亮。⚠️ 呢個唔係「預設亮」—— 學生喺錯因自診揀咗「審題陷阱」之後先亮，
// 唔係一開波就餵提示。所以 design 入面唔應該當佢係普通 highlight 用。
// 詞庫收得好窄：「所有權」唔會亮（法律名詞）、「消除了」唔會亮（動詞+了）、
// 英文 "not" 唔會嘭中 "note"／"cannot"。

export function Chinese() {
  return (
    <p className="max-w-lg text-sm leading-relaxed text-ink">
      <CommandWordText
        text="下列關於共用品的描述，哪一項並非正確？除了非排他性之外，共用品必須同時具備非競爭性。"
        soft={false}
      />
    </p>
  )
}

export function English() {
  return (
    <p className="max-w-lg text-sm leading-relaxed text-ink">
      <CommandWordText
        text="Which of the following is not a feature of a public good? A public good must be non-excludable, and only rivalry distinguishes it from a common resource."
        soft={false}
      />
    </p>
  )
}

export function SoftForSen() {
  // 柔和呈現（dse_calm_lock）：降飽和高亮，畀對高對比敏感嘅學生。
  return (
    <p className="max-w-lg text-sm leading-relaxed text-ink">
      <CommandWordText
        text="下列關於共用品的描述，哪一項並非正確？除了非排他性之外，共用品必須同時具備非競爭性。"
        soft
      />
    </p>
  )
}

export function WithMath() {
  // 數式段原封不動交返 MathText —— 高亮永不掂 KaTeX 內部。
  return (
    <p className="max-w-lg text-sm leading-relaxed text-ink">
      <CommandWordText text="若 $b^2 - 4ac < 0$，則方程必須沒有實根。" soft={false} />
    </p>
  )
}
