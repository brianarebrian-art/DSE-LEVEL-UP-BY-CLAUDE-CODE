# 草稿形狀檢查：正確答案不可明顯長過最長干擾項（學生可憑長度猜中）。
#
# 寬度計法【必須】與 scripts/qbank/_gate.mjs 的 visualLength() 一致：
# 剝走 LaTeX 標記與所有空白之後數字元。我先後估錯兩次 ——
# 一次把中日韓字當雙寬而 ASCII 當半寬（英文題漏報），
# 一次改用原始字元數（中文題誤報，因為空白未剝走）。
# 與其估，不如照抄權威實作。
#
# 另：舊版無論有無發現都 exit 0，令 `check && echo 通過` 恆真 ——
# 一個永遠報成功的檢查等於沒有檢查。現改為有發現即 exit 1。
import json, io, re, sys

LATEX_TO_VISUAL = [
    (re.compile(r'\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}'), r'\1/\2'),
    (re.compile(r'\\sqrt\s*\{([^{}]*)\}'), r'√\1'),
    (re.compile(r'\\(?:text|mathrm|operatorname)\s*\{([^{}]*)\}'), r'\1'),
    (re.compile(r'\\[a-zA-Z]+'), 'x'),
    (re.compile(r'[{}$^_\\]'), ''),
    (re.compile(r'\s+'), ''),
]
LIMIT = 6

def visual_length(s):
    out = str(s)
    for rx, rep in LATEX_TO_VISUAL:
        out = rx.sub(rep, out)
    return len(out)

bad = 0
for f in sys.argv[1:]:
    for q in json.load(io.open(f, encoding='utf-8')):
        v = [visual_length(o) for o in q['options']]
        ci = q['correctIndex']
        margin = v[ci] - max(x for i, x in enumerate(v) if i != ci)
        # 閘在 margin 恰好等於 LIMIT 時已經退回（實測：「闊 6 個視覺字，上限 6」→ 退回），
        # 故此處用 >= 而非 >。這是本腳本第三次計法出錯，前兩次分別是
        # 「永遠 exit 0」與「自創寬度計法」。
        if margin >= LIMIT:
            print(f"  {q['id']}  正確 {v[ci]} vs 最長干擾 {max(x for i,x in enumerate(v) if i!=ci)}  超 {margin}")
            bad += 1
print(f"形狀超標 {bad} 條")
sys.exit(1 if bad else 0)
