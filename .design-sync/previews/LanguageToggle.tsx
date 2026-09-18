import { LanguageToggle } from 'dse-level-up'

// 中／EN 切換。全站 i18n 靠 React context，冇 i18n routing、冇 middleware ——
// 所以每一頁都仍然係靜態 CDN 資產（$0，任何流量都係）。

export function Default() {
  return <LanguageToggle />
}
