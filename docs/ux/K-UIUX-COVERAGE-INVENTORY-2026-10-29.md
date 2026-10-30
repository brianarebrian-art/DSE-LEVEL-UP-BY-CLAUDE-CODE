# K · 全站 UI／UX coverage inventory＋啟發式審核（DRAFT）

狀態：**待研究／待批准** · 2026-10-29  
真實學生研究：**另批**招募／同意。本包**唔開**全站視覺大翻新。

## 1. 設計系統現況

- Tailwind CSS v4 + `app/globals.css` tokens；`docs/tokens.md`  
- 自研組件 + lucide；無 shadcn  
- 憲章：永久免費、品牌鎖、莫兰迪＋cyber、WCAG AA、禁 gamification 復建  
- >3 檔產品改動要 Phase 1 + greenlight

## 2. 學生主線路由 inventory（優先）

| 路由 | 用途 | 狀態假設（待驗證） |
|---|---|---|
| `/` | 首頁／快捷練習 | 核心 |
| `/start` | 續練／導流 | 核心 |
| `/subjects`、`/subjects/[subject]` | 選科 | 核心 |
| `/practice` | 練習會話 | 核心 |
| `/result` | 結果 | 核心 |
| `/dashboard` | 進度總覽 | 核心 |
| `/bookmarks`、`/notes` | 書籤／筆記 | 次核心 |
| `/account` | 帳戶／刪除 | 核心（私隱） |
| `/(auth)/sign-in`、`sign-up`、`/sign-in-error` | 登入註冊 | 核心（跟 G） |
| `/privacy`、`/terms`、`/trust`、`/transparency` | 信任／法務 | 必達 |
| `/exam-day`、`/paper-warrior`、`/predictor` | 考試輔助 | 次 |
| `/relax/*` | 放鬆 | 次 |
| SEO `dse-*`、`/reading`、`/writing` 等 | 內容／SEO | 覆蓋要列但後改 |
| `/admin`、`/dev/*`、`/ai/*` | 非學生主線 | 唔入第一波視覺 |

裝置維度：375／390／768／1024／1920；主題：light／cyber／auto。  
狀態：未登入／已登入／同步中／錯誤／空狀態。

## 3. Nielsen 啟發式（首輪摘要 — 待實測標級）

| # | 原則 | 初步觀察（假設，待驗證） |
|---|---|---|
| 1 | 系統狀態可見 | 同步狀態有元件；錯誤頁存在 |
| 2 | 現實對應 | 廣東話情感層／書面語解析層 |
| 3 | 用戶控制 | 刪帳／同意閘；可跳過部分問卷 |
| 4 | 一致性 | tokens 單一來源；舊審計提過 Originkit 大多否決 |
| 5 | 防錯 | 刪帳要 confirm；calm／安靜模式 |
| 6 | 識別優於回憶 | 科目標籤／繼續卡 |
| 7 | 靈活高效 | 快捷四科；進階路徑較散 |
| 8 | 美觀極簡 | 憲章禁 clutter／gamification；大升級要守 |
| 9 | 錯誤復原 | sign-in-error；Sentry |
| 10 | 說明 | `/methodology`、`/transparency` |

## 4. 主要任務（學生）

A 開站→第一題 · B 做完一節 · C 睇解析 · D 再練 · E 登入同步 · F 刪資料 · G 考試日設定  

## 5. 下一步（另批）

- K1：視覺大升級 brief（方向／首波路由／動效預算）  
- K2：分波實作（殼→練習→帳戶／登入）  
- 真實學生研究協議  
