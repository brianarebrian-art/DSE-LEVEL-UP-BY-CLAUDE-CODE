#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract-hkeaa-2025.py —— 由考評局公開 PDF 抽出 2025 年各科成績分佈。

輸出：data/dse-2025-level-distribution.json
用途：等級預測 v3 的校準目標（見 docs 內該規格書 §2、§4.4）。

══ 為何要有這個腳本，而不是把數字打進 JSON ══
數字每年更新一次（放榜後）。手打 26 科 × 8 個百分率＝208 個數，錯一個
不會有人發現，而它會直接歪掉某一科的等級邊界。腳本可重跑、可覆核；
2026 年放榜後把新 PDF 放到同一位置再跑一次即可。

══ 資料來源（考評局公開發布，非官方分數線）══
《2025 年香港中學文憑考試考生在各科的成績分析》表 5a（日校考生），第 3–6 頁。
⚠️ 表 5a 列出的是「有多少百分比的考生取得某等級」，不是「取得多少分才有某
   等級」。考評局從來沒有公布過任何一科的分數線 —— DSE 用水平參照，分數線
   每年按評卷結果訂立。任何聲稱「官方 cut-off」的數字都不是官方的。

用法：
    python3 scripts/qbank/extract-hkeaa-2025.py ~/Downloads/dseexamstat25_5.pdf
需要 PyMuPDF（fitz）。
"""
import json
import re
import sys
from pathlib import Path

try:
    import fitz
except ImportError:
    sys.exit('需要 PyMuPDF：pip3 install pymupdf')

PCT = re.compile(r'^\d+(?:\.\d+)?%$')
LEVELS = ['5**', '5*+', '5+', '4+', '3+', '2+', '1+']

# 考評局科目名 → 平台 subject id。
# 兩處刻意合併，各有理由：
#   · BAFS 分「會計」與「商業管理」兩個選修單元，平台只有一個 bafs 題庫，
#     故按出席人數加權平均。
#   · 科技與生活 分「食品科學與科技」與「服裝、成衣與紡織」，同理。
# 合併本身會令該科的邊界略為失真，故 JSON 內以 `merged` 欄如實標示。
MAP = {
    '生物': 'biology',
    '化學': 'chemistry',
    '物理': 'physics',
    '中國歷史': 'chinese-history',
    '中國語文': 'chinese',
    '中國文學': 'chinese-literature',
    '設計與應用科技': 'design-tech',
    '經濟': 'economics',
    '英國語文': 'english',
    '倫理與宗教': 'ethics-religious',
    '地理': 'geography',
    '健康管理與社會關懷': 'health-management',
    '歷史': 'history',
    '資訊及通訊科技': 'ict',
    '英語文學': 'english-literature',
    '必修部分': 'math',
    '延伸部分 (微積分與統計)': 'm1',
    '延伸部分 (代數與微積分)': 'm2',
    '音樂': 'music',
    '體育': 'pe',
    '旅遊與款待': 'ths',
    '視覺藝術': 'visual-arts',
}
MERGE = {
    'bafs': ['會計', '商業管理'],
    'technology-living': ['食品科學與科技', '服裝、成衣與紡織'],
}
# 規格書 §3.2：出席人數少於此值的科目，百分率受抽樣波動影響太大，
# 不得單獨作為校準目標。
SMALL_SAMPLE = 200

# 「出席人數 No. sat」欄的 x 區間（實測：第 3 頁 225–236、第 4 頁 223–233）。
SAT_X = (218, 250)


def rows_from(pdf: Path):
    """由表 5a 的四頁抽出每一個『總數』區塊。用座標而非行序 —— 這是一份
    表格 PDF，線性文字次序會把科目名與數字打散。"""
    doc = fitz.open(pdf)
    out = []
    for p in range(2, 6):                       # 表 5a = 第 3–6 頁
        w = doc[p].get_text('words')            # (x0, y0, x1, y1, text, ...)
        males = sorted(y0 for x0, y0, x1, y1, t, *_ in w if t == '男生')
        totals = sorted(y0 for x0, y0, x1, y1, t, *_ in w if t == '總數')
        for my in males:
            ty = next((t for t in totals if t > my), None)
            if ty is None:
                continue
            prev = max([t for t in totals if t < my], default=my - 72)
            # 科目名在最左一欄，跨三個性別列
            name = [t for x0, y0, x1, y1, t, *_ in w if x0 < 150 and prev + 4 < y0 < ty + 12]
            pct = sorted(((x0, t) for x0, y0, x1, y1, t, *_ in w
                          if PCT.match(t) and ty + 3 < y0 < ty + 15), key=lambda z: z[0])
            # 出席人數 (No. sat) 專屬的 x 區間。必須靠座標分欄，唔可以靠文字：
            # 考評局把千位用空格分隔，PyMuPDF 會拆成獨立 token，於是「534 498」
            # （報考 534、出席 498 兩個數）同「13 659」（一個數 13,659）喺純文字
            # 上完全無法分辨 —— 實測會把 498 讀成 534498，令小樣本科目漏標。
            sat_toks = sorted(((x0, t) for x0, y0, x1, y1, t, *_ in w
                               if not PCT.match(t) and SAT_X[0] < x0 < SAT_X[1] and ty < y0 < ty + 9),
                              key=lambda z: z[0])
            if len(pct) != 8:
                continue
            out.append({
                'name': name,
                'sat': sat_toks,
                'pct': [float(t[:-1]) for _, t in pct],
            })
    doc.close()
    return out


def sat_of(tokens):
    """把「出席人數」欄的 token 併返一個整數（千位分隔已由座標分欄保證同欄）。"""
    joined = ''.join(t for _, t in tokens if re.match(r'^\d+$', t))
    return int(joined) if joined else 0


def main() -> None:
    pdf = Path(sys.argv[1] if len(sys.argv) > 1 else
               Path.home() / 'Downloads' / 'dseexamstat25_5.pdf').expanduser()
    if not pdf.exists():
        sys.exit(f'搵唔到 {pdf}')

    raw = rows_from(pdf)
    by_zh = {}
    for r in raw:
        zh = ' '.join(x for x in r['name'] if re.search(r'[一-鿿]', x))
        key = next((k for k in list(MAP) + sum(MERGE.values(), []) if k in zh), None)
        if key is None:
            continue
        by_zh[key] = {'sat': sat_of(r['sat']), 'pct': r['pct']}

    subjects = {}
    for zh, sid in MAP.items():
        if zh not in by_zh:
            continue
        d = by_zh[zh]
        subjects[sid] = {
            'hkeaaZh': zh,
            'sat': d['sat'],
            'cumulative': dict(zip(LEVELS, d['pct'][:7])),
            'u': d['pct'][7],
            'smallSample': d['sat'] < SMALL_SAMPLE,
        }
    for sid, parts in MERGE.items():
        got = [(p, by_zh[p]) for p in parts if p in by_zh]
        if not got:
            continue
        tot = sum(g['sat'] for _, g in got)
        cum = {}
        for i, lv in enumerate(LEVELS):
            cum[lv] = round(sum(g['pct'][i] * g['sat'] for _, g in got) / tot, 1)
        subjects[sid] = {
            'hkeaaZh': ' + '.join(p for p, _ in got),
            'sat': tot,
            'cumulative': cum,
            'u': round(sum(g['pct'][7] * g['sat'] for _, g in got) / tot, 1),
            'smallSample': tot < SMALL_SAMPLE,
            'merged': [{'part': p, 'sat': g['sat']} for p, g in got],
        }

    doc = {
        'source': {
            'publication': '2025 年香港中學文憑考試考生在各科的成績分析（表 5a，日校考生）',
            'publicationEn': '2025 HKDSE Analysis of results of candidates in each subject (Table 5a, day school candidates)',
            'file': pdf.name,
            'pages': '3-6',
            'year': 2025,
            'cohort': 'day-school',
            'extractedOn': '2026-08-23',
            'caveat': '表 5a 列出的是各級考生累積百分率，不是分數線。考評局從來沒有公布過任何一科的分數線 —— DSE 用水平參照，分數線每年按評卷結果訂立。',
        },
        'notes': {
            'noCrossSubjectComparison': '嚴禁用本表比較「邊科易攞 5 級」。選修科有自我選擇偏差：M2 有 34.4% 考生達 5 級以上、體育 3.6%，但兩科報考人群結構完全不同。學生因此轉科而跟不上，是平台造成的實質傷害。',
            'smallSample': f'出席人數少於 {SMALL_SAMPLE} 的科目已標記 smallSample —— 一兩個考生就能移動幾個百分點，不得單獨作為校準目標。',
            'senExcluded': '本檔不含任何特殊需要考生統計（該統計在表 3g）。群體統計永不進入個人估算。',
            'mathFootnote': '考評局註明：數學必修部分及延伸部分視為同一個科目組合；考生同時應考兩部分時，取成績較好的一個。',
        },
        'subjects': subjects,
        'binarySubjects': {
            'csd': {
                'hkeaaZh': '公民與社會發展',
                'sat': 42062,
                'attained': 93.2,
                'unattained': 6.8,
                'note': '本科只設達標／未達標，永不輸出 1–5 等級。',
            },
        },
    }
    out = Path(__file__).resolve().parents[2] / 'data' / 'dse-2025-level-distribution.json'
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'✓ {out.relative_to(Path.cwd()) if str(out).startswith(str(Path.cwd())) else out}')
    print(f'  {len(subjects)} 科 + 1 個達標制科目')
    for sid, s in sorted(subjects.items(), key=lambda kv: kv[1]['cumulative']['5+']):
        flag = '  ⚠ 小樣本' if s['smallSample'] else ''
        print(f"   {sid:<20} 5+={s['cumulative']['5+']:>5}%  4+={s['cumulative']['4+']:>5}%  "
              f"3+={s['cumulative']['3+']:>5}%  2+={s['cumulative']['2+']:>5}%  (n={s['sat']}){flag}")


if __name__ == '__main__':
    main()
