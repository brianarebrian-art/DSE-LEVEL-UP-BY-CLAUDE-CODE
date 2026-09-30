// 考期模式：首頁的 DSE 倒數橫額由學生自行開啟（UX 循環 LOOP 26；創辦人決定 5，2026-09-30）。
//
// 以前倒數橫額在首頁頂常駐，每個訪客一打開網站就先見到「距 N 日」。對未有需要的學生，
// 這是一重沒有要求過的壓力。改為預設關閉，在「帳戶」頁開關。
//
// 只存在這部機（localStorage），不上雲：不屬於 lib/settingsSync.ts 的同步鍵，
// 信任中心列出的同步數目不變。
export const EXAM_COUNTDOWN_KEY = 'dse_exam_countdown'
export const EXAM_COUNTDOWN_EVENT = 'dse-exam-countdown'

export function isExamCountdownOn(): boolean {
  try {
    return localStorage.getItem(EXAM_COUNTDOWN_KEY) === '1'
  } catch {
    return false
  }
}

export function setExamCountdown(on: boolean): boolean {
  try {
    if (on) localStorage.setItem(EXAM_COUNTDOWN_KEY, '1')
    else localStorage.removeItem(EXAM_COUNTDOWN_KEY)
  } catch {
    // Storage blocked: the setting simply does not stick; the banner stays off.
  }
  window.dispatchEvent(new Event(EXAM_COUNTDOWN_EVENT))
  return isExamCountdownOn()
}
