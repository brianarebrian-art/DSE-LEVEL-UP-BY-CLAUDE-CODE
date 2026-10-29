# K · 手機答題頁 Wave 2

狀態：**實作中（Draft PR）** · 2026-10-29（香港時間）  
來源：`docs/ux/dse-level-up-ui-ux-redesign-brief.pdf`（B. 手機答題頁）  
前置：Wave 1 首頁 PR #131

## 本 PR 範圍

- 頂欄 sticky：返回、科目、題數進度、狀態列合一  
- 題目卡 + 較大直向選項（手機 ≥56px）  
- 提示／可選捷徑預設收合  
- 底部 sticky：再試一次 + 下一題（送出後原流程顯示解析，唔跳頁）  
- 再試只清畫面；計分／錯題 log 用首次作答  

## 明確不做

- merge／deploy  
- 全域色 token remap  
- 改揀即交模型（維持選項即提交）  
