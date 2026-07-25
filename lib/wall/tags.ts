// 影子溫書室嘅預設情緒標籤 —— 存穩定 key（唔存顯示文字），令 中/EN 切換同日後改字
// 都唔會令舊帖對唔上。顯示 label 喺 UI 由 i18n 提供（見 dictionary.wall.tags）。
//
// 用 whitelist：API 只接受呢 5 個 key，任何其他 tag 一律丟棄（防注入任意文字入 tag）。

export const WALL_TAG_KEYS = ['night', 'win', 'sos', 'growth', 'support'] as const
export type WallTagKey = (typeof WALL_TAG_KEYS)[number]

// 每個 tag 嘅代表 emoji（顯示用；文字 label 行 i18n）。
export const WALL_TAG_EMOJI: Record<WallTagKey, string> = {
  night: '🌙',
  win: '✨',
  sos: '🆘',
  growth: '🌱',
  support: '💜',
}

export function isWallTagKey(v: unknown): v is WallTagKey {
  return typeof v === 'string' && (WALL_TAG_KEYS as readonly string[]).includes(v)
}

// 清洗 client 傳嚟嘅 tags：只留 whitelist、去重、最多 3 個。
export function sanitizeTags(input: unknown): WallTagKey[] {
  if (!Array.isArray(input)) return []
  const out: WallTagKey[] = []
  for (const v of input) {
    if (isWallTagKey(v) && !out.includes(v)) out.push(v)
    if (out.length >= 3) break
  }
  return out
}
