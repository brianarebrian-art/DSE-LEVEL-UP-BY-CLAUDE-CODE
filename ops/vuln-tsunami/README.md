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

1. **Ingestion** — every 60s NVD `cves/2.0?resultsPerPage=20`; fail → `api.allorigins.win`; fail → `[模擬]` mock
2. **Scoring** — CVSS×importance×exposure; batch `crit*4 + high*2 + total`; LEV4 if crit surge ≥15 / 10min
3. **Defense** — one-click 已攔截 + `vulntsunami.log`; optional `actions/block_ip.sh` + pfctl when `auto_block=true`
4. **Translate** — MyMemory `en|zh-TW`, 500ms gap; ZH primary / EN gray; toggle top-right

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
