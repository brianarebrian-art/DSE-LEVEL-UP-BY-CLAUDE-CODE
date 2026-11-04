# Vulnerability Tsunami Defence

Desktop-only NVD real-time monitor for **DSE Level Up**.

**Isolated from the official website.** Never import into `app/`. Never put keys in Vercel.

Dashboard UI follows the layered spec: Ingestion → Scoring → Defense → ZH translate.  
Output / agent copy also follows [i-have-adhd](https://github.com/ayghri/i-have-adhd).  
MenuBar uses text **VT** (no emoji — project rule).

## Open (about 1 minute)

1. `cd ops/vuln-tsunami`
2. `cp config.example.yaml config.yaml` — paste `nvd_api_key`
3. `node server.mjs`
4. Open [http://127.0.0.1:3005](http://127.0.0.1:3005)

Also serves WAF/EDR stub: [http://127.0.0.1:8765/status](http://127.0.0.1:8765/status)

## Layers

1. **Ingestion (每分鐘)** — NVD + CISA KEV + optional VulnCheck；合併去重；CMDB `assets` + WAF/EDR `:8765/status|/logs`
2. **Scoring** — 海嘯分 = `CVSS × 資產重要度 × 網絡暴露面`；**LEV4 = 10 分鐘內嚴重 > 15**
3. **Defense Matrix** — LEV4+ 自動：WAF 規則檔 + EDR 隔離 + Patch 排程；全部寫 `vulntsunami.log`（`auto_defense_live=false` 時 dry-run）
4. **Translate** — MyMemory `en|zh-TW`；ZH 主 / EN 灰

## Mac MenuBar

```bash
pip install rumps   # optional
python3 mac/main.py
```

Menu: Refresh / Open Dashboard / Open Log (2 clicks). Label: **VT**.

## Safety

- Binds `127.0.0.1` only
- `auto_block: false` by default (pfctl is real firewall)
- NVD key only in `config.yaml` or `.env` (gitignored)
