#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract-hkeaa-drift.py —— 由考評局表 7c 抽出各科等級界線的【年度漂移】。

輸出：data/dse-level-drift.json
資料來源：《香港中學文憑考試歷年報考情況及成績統計》表 7c
         （2016–2025，甲類學科，日校考生），第 3–11 頁。

══ 點解要呢一份 ══
一個等級界線唔係一條固定嘅線。以生物科「5 級或以上」為例，2016–2025 十年
之間係 19.0 / 19.3 / 18.0 / 20.1 / 19.2 / 20.9 / 20.3 / 19.7 / 20.4 / 19.5 %
—— 即係話就算我哋量度一個學生量度得完全準確，佢對正嘅嗰條線本身每年都會
郁一郁。呢個唔係我哋嘅誤差，係考試制度本身嘅特性（水平參照，每年按評卷
結果訂線）。

呢個係一個【量得到】嘅不確定性來源。把佢寫出嚟，好過用一個拍腦袋嘅
「±0.5 級」去掩蓋。

用法：python3 scripts/qbank/extract-hkeaa-drift.py ~/Downloads/dseexamstat25_7.pdf
"""
import json
import re
import statistics
import sys
from pathlib import Path

try:
    import fitz
except ImportError:
    sys.exit('需要 PyMuPDF：pip3 install pymupdf')

LEVELS = ['5**', '5*+', '5+', '4+', '3+', '2+', '1+']
# 同 extract-hkeaa-2025.py 一致（該檔的 MAP + MERGE 合併規則）
MAP = {
    '生物': 'biology', '化學': 'chemistry', '物理': 'physics',
    '中國歷史': 'chinese-history', '中國語文': 'chinese', '中國文學': 'chinese-literature',
    '設計與應用科技': 'design-tech', '經濟': 'economics', '英國語文': 'english',
    '倫理與宗教': 'ethics-religious', '地理': 'geography',
    '健康管理與社會關懷': 'health-management', '歷史': 'history',
    '資訊及通訊科技': 'ict', '英語文學': 'english-literature',
    '必修部分': 'math', '延伸部分 (微積分與統計)': 'm1', '延伸部分 (代數與微積分)': 'm2',
    '音樂': 'music', '體育': 'pe', '旅遊與款待': 'ths', '視覺藝術': 'visual-arts',
    '會計': 'bafs', '商業管理': 'bafs',
    '食品科學與科技': 'technology-living', '服裝、成衣與紡織': 'technology-living',
}
YEAR = re.compile(r'^(20\d\d)$')


def main() -> None:
    pdf = Path(sys.argv[1] if len(sys.argv) > 1 else
               Path.home() / 'Downloads' / 'dseexamstat25_7.pdf').expanduser()
    if not pdf.exists():
        sys.exit(f'搵唔到 {pdf}')
    doc = fitz.open(pdf)

    # ── 分塊，唔用「最近見過嘅科目名」 ───────────────────────────────────
    # 科目名喺自己嗰十行嘅【垂直置中】位置（例如「生物」喺第 5 行），
    # 所以「最近見過」會把該科頭幾年嘅資料錯配畀上一科。實測：生物 2016–2020
    # 收到咗會計嘅數（13.5–14.4），2021–2025 先至係自己嘅（20.9–19.5）。
    #
    # 改為按年份序列分塊：年份一跌返轉頭就代表換咗科，然後喺該塊嘅 y 範圍
    # 之內搵科目名。
    blocks: list[dict] = []
    for p in range(2, 11):                       # 表 7c = 第 3–11 頁
        w = doc[p].get_text('words')
        by_y: dict[int, list[tuple[float, str]]] = {}
        for x0, y0, x1, y1, t, *_ in w:
            by_y.setdefault(round(y0 / 3), []).append((x0, t))
        cur: dict | None = None
        for k in sorted(by_y):
            toks = [t for _, t in sorted(by_y[k])]
            yrs = [t for t in toks if YEAR.match(t)]
            if not yrs:
                continue
            year = int(yrs[0])
            pcts = [float(t) for t in toks if re.match(r'^\d+\.\d+$', t)]
            if len(pcts) < 8:
                continue
            if cur is None or year <= cur['lastYear']:
                cur = {'page': p, 'k0': k, 'k1': k, 'lastYear': year, 'rows': {}}
                blocks.append(cur)
            cur['lastYear'] = year
            cur['k1'] = k
            cur['rows'][year] = pcts[-8:]

    # 每塊喺自己嘅 y 範圍之內搵科目名
    series: dict[str, list[dict]] = {}
    for b in blocks:
        w = doc[b['page']].get_text('words')
        left = [t for x0, y0, x1, y1, t, *_ in w
                if x0 < 150 and (b['k0'] - 2) * 3 <= y0 <= (b['k1'] + 2) * 3]
        blob = ' '.join(left)
        hit = next((zh for zh in MAP if zh in blob), None)
        if hit is None:
            continue
        series.setdefault(MAP[hit], []).append(b['rows'])

    out = {}
    for sid, parts in series.items():
        # BAFS／科技與生活 一科兩個單元，會有兩塊；同年取簡單平均。
        # （表 7c 冇逐年出席人數，故此處只作漂移量度，唔用嚟做加權邊界。）
        rows = {}
        allyears = sorted({y for pr in parts for y in pr})
        for y in allyears:
            got = [pr[y] for pr in parts if y in pr]
            rows[y] = [round(sum(c[i] for c in got) / len(got), 2) for i in range(8)]
        by_level = {}
        for i, lv in enumerate(LEVELS):
            vals = [rows[y][i] for y in sorted(rows)]
            if len(vals) < 5:
                continue
            by_level[lv] = {
                'series': vals,
                'sd': round(statistics.stdev(vals), 2),
                'min': min(vals),
                'max': max(vals),
                'range': round(max(vals) - min(vals), 2),
            }
        if by_level:
            out[sid] = {'years': sorted(rows), 'byLevel': by_level}

    doc_out = {
        'source': {
            'publication': '香港中學文憑考試歷年報考情況及成績統計，表 7c（2016–2025，甲類學科，日校考生）',
            'file': pdf.name,
            'pages': '3-11',
            'cohort': 'day-school',
            'extractedOn': '2026-08-23',
        },
        'meaning': '每個等級界線在 2016–2025 十年之間的累積百分率序列與標準差。'
                   'sd 代表「界線本身每年會郁幾多個百分點」—— 這是考試制度的特性'
                   '（水平參照，每年按評卷結果訂線），不是平台的量度誤差。',
        'subjects': out,
    }
    dest = Path(__file__).resolve().parents[2] / 'data' / 'dse-level-drift.json'
    dest.write_text(json.dumps(doc_out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'✓ {dest}')
    print(f'  {len(out)} 科')
    for sid in sorted(out):
        b = out[sid]['byLevel']
        print(f"   {sid:<20} 年數 {len(out[sid]['years'])}  "
              f"5+ sd={b.get('5+', {}).get('sd', '-'):>5}  4+ sd={b.get('4+', {}).get('sd', '-'):>5}  "
              f"3+ sd={b.get('3+', {}).get('sd', '-'):>5}")


if __name__ == '__main__':
    main()
