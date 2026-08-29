# 形狀檢查：正確答案不可明顯長過最長干擾項。
# 舊版無論有無發現都 exit 0，令 `python3 shape2.py && echo 零` 恆真 ——
# 一個永遠報成功的檢查等於沒有檢查。現改為有發現即 exit 1。
import json, io, sys, unicodedata
def w(s): return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in s)/2
bad = 0
for f in sys.argv[1:]:
    d = json.load(io.open(f, encoding='utf-8'))
    for q in d:
        ws = [w(o) for o in q['options']]
        others = [x for i, x in enumerate(ws) if i != q['correctIndex']]
        gap = ws[q['correctIndex']] - max(others)
        if gap >= 6:
            print(f"  {q['id']}  正確 {ws[q['correctIndex']]:.0f} vs 最長干擾 {max(others):.0f}  超 {gap:.0f}")
            bad += 1
print(f"形狀超標 {bad} 條")
sys.exit(1 if bad else 0)
