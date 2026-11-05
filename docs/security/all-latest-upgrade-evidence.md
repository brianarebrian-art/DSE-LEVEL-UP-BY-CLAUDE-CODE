# 核心依賴最新升級證據 (All Latest Upgrade Evidence)

**審計時間**：2026-11-05
**目標**：將專案核心關鍵依賴升級並鎖定至指定安全基準版本，消除已知 CVE 威脅。

---

## 1. 核心套件版本比對矩陣

| 套件名稱 | 升級前版本 | 鎖定升級後版本 | 鎖定方式 | 安全意義 |
| :--- | :--- | :--- | :--- | :--- |
| `react` | 19.2.6 | **19.3.1** | 精確鎖定 (`--save-exact`) | 防範 CVE-2026-23870 FormData $K DoS |
| `react-dom` | 19.2.6 | **19.3.1** | 精確鎖定 (`--save-exact`) | 與 React 核心版本同步一致 |
| `next` | 16.4.5 | **16.4.5** | 精確鎖定 | 防範 CVE-2026-75604 及快取洩漏漏洞 |
| `@sentry/nextjs` | 10.78.0 | **10.78.0** | 精確鎖定 | 防範 CVE-2026-114139 tunnelRoute 旁路 |
| `@supabase/supabase-js` | 2.119.0 | **2.119.0** | 精確鎖定 | 防範 CVE-2026-62247 Realtime 授權旁路 |
| `sharp` | 0.35.5 | **0.35.5** | 精確鎖定 + override | 防範 CVE-2026-96889 圖片解析 RCE |
| `@types/react` | 19.2.17 | **19.3.0** | 精確鎖定 | 支援 React 19.3 型別規範 |
| `@types/react-dom`| 19.2.3 | **19.3.0** | 精確鎖定 | 支援 React DOM 19.3 型別規範 |

---

## 2. 依賴樹精確驗證輸出 (`npm ls`)

執行指令：
```bash
npm ls next react react-dom @sentry/nextjs @supabase/supabase-js sharp
```

輸出結果：
```text
dse-level-up@0.1.0 /app
├─┬ @sentry/nextjs@10.78.0
│ ├─┬ @sentry/react@10.78.0
│ │ └── react@19.3.1 deduped
│ └── next@16.4.5 deduped
├─┬ @supabase/ssr@0.7.0
│ └── @supabase/supabase-js@2.119.0 deduped
├── @supabase/supabase-js@2.119.0
├─┬ @vercel/speed-insights@2.0.0
│ ├── next@16.4.5 deduped
│ └── react@19.3.1 deduped
├─┬ lucide-react@1.20.0
│ └── react@19.3.1 deduped
├─┬ next@16.4.5
│ ├── react-dom@19.3.1 deduped
│ ├── react@19.3.1 deduped
│ ├── sharp@0.35.5 deduped
│ └─┬ styled-jsx@5.1.6
│   └── react@19.3.1 deduped
├─┬ react-dom@19.3.1
│ └── react@19.3.1 deduped
├── react@19.3.1
└── sharp@0.35.5
```

所有子依賴均成功去重並精確對齊至目標安全基準版本。
