/** 純邏輯：驗證碼格式（可 unit test，唔依賴 server-only）。 */

export function isSixDigitCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim())
}

export function normalizeTotpCode(raw: string): string {
  return raw.replace(/\s+/g, '').trim()
}
