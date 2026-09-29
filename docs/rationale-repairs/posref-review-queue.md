# 位置詞候選：待人手判斷（C 類）

由 `scripts/qbank/classify-posref.mts --write` 生成，唔好人手改。

這些題目的解析有位置詞（例如「最後一項」），但分類器判斷不到它指的是選項還是題目內容。
在判斷之前，題目照常上線（Yuna 2026-09-29 第四次決定：C 類不即時收起）。

判斷方法：看一條例子，決定整個模板。指選項 → A（收起）；指題目內容 → B（保留）。
決定寫入 `scripts/qbank/posref-review-decisions.json`，鍵為 `科目/題號`，須填 `class`、`by`（代號）、`date`、`note`。
然後重跑本腳本。Claude 不會代填。

共 13 題，2 個模板。

## design-tech dath_me_#（1 題）

例子：`design-tech/dath_me_1`

- explanation「最後一項」：… ÷ 50 = 4。  【陷阱】800 N／MA 0.25 把力臂關係倒轉；MA 1 忽略了力臂差；最後一項算啱施力卻把 MA 倒轉。…
  - 訊號：（無）；按儲存次序指向第 4 個選項

題號：dath_me_1

## english-literature el_po_#_#（12 題）

例子：`english-literature/el_po_6_0`

- explanation「最後一項」：…nstructed in the poem and need not be the poet。要留意最後一項最容易失分 —— speaker 是詩中建構出來的聲音，未必等於詩人本人；把兩者劃上等號，分析就會滑…
  - 訊號：enumeration、option-overlap；按儲存次序指向第 4 個選項

題號：el_po_6_0、el_po_6_1、el_po_6_10、el_po_6_11、el_po_6_2、el_po_6_3、el_po_6_4、el_po_6_5、el_po_6_6、el_po_6_7、el_po_6_8、el_po_6_9
