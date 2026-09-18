import { ExternalLinkGate } from 'dse-level-up'

// 離站提示閘。學生撳出去第三方平台之前先講一句 —— 唔係攔佢，係畀佢知道
// 自己即將離開，同埋嗰邊唔受呢度嘅私隱承諾保護。

export function ToInstagram() {
  return (
    <ExternalLinkGate href="https://www.instagram.com/" platform="Instagram">
      <span className="text-sm font-medium text-accent-strong underline underline-offset-2">
        去我哋嘅 Instagram
      </span>
    </ExternalLinkGate>
  )
}

export function WithExtraWarning() {
  return (
    <ExternalLinkGate
      href="https://www.hkeaa.edu.hk/"
      platform="HKEAA"
      extraWarning="官方試題請由 HKEAA 網站下載；本平台嘅題目全部係獨立改寫版本。"
    >
      <span className="text-sm font-medium text-accent-strong underline underline-offset-2">
        HKEAA 官方網站
      </span>
    </ExternalLinkGate>
  )
}
