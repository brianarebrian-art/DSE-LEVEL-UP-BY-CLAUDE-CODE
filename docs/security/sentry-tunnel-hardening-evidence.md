# Sentry 隧道安全加固證據報告 (Sentry Tunnel Hardening Evidence)

**審計時間**：2026-11-05
**漏洞背景**：CVE-2026-114139 (CVSS 9.1, CWE-693)。在 `@sentry/nextjs` 隧道模式下，未嚴格比對的 middleware 或 proxy 會因 `pathname.startsWith('/monitoring')` 而遭惡意子路徑（例如 `/monitoring/evil-bypass`）繞過認證或限流檢查。

---

## 1. 代理防護實作加固 (`proxy.ts`)

```typescript
// proxy.ts

// Hardening for CVE-2026-114139 tunnelRoute bypass:
// Sentry tunnelRoute uses exact '/monitoring'. Any subpath like '/monitoring/*' must be rejected with 404.
if (pathname === '/monitoring' || pathname === '/monitoring/') {
  // 精確放行 Sentry 遠端遙測收集端點
  return NextResponse.next()
}
if (pathname.startsWith('/monitoring/')) {
  // 任何子路徑一律阻斷，返回 404 JSON
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
```

---

## 2. 測試與驗證輸出

執行代理路由隔離測試：
```bash
npx --yes tsx -e "
import { proxy } from './proxy.ts';
import { NextRequest } from 'next/server';

function createReq(path: string) {
  return new NextRequest(new URL('https://www.dselevelup.com' + path));
}

const r1 = proxy(createReq('/monitoring'));
console.log('/monitoring status:', r1.status);

const r2 = proxy(createReq('/monitoring/'));
console.log('/monitoring/ status:', r2.status);

const r3 = proxy(createReq('/monitoring/evil-bypass'));
console.log('/monitoring/evil-bypass status:', r3.status);
"
```

輸出結果：
```text
/monitoring status: 200
/monitoring/ status: 200
/monitoring/evil-bypass status: 404
```

**結論**：CVE-2026-114139 隧道繞過弱點已徹底消除。
