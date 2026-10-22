#!/usr/bin/env python3
"""Validate the reviewed map only. Never generate proposals, routes or page text."""
import argparse
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = ['優先級', 'URL', '頁面類型', '目標搜尋意圖', 'H1', 'Title', 'Meta Description', '核心內容', '內部連結', '狀態', '判斷原因']


def main():
    cli = argparse.ArgumentParser(description='舊批量提案生成器已停用；本程式只讀取及驗證 V2。')
    cli.add_argument('--input', type=Path, default=ROOT / 'docs/seo-content-map-v2.csv')
    args = cli.parse_args()
    if not args.input.exists():
        cli.error('V2 尚未完成，不能用模板補足頁數。')
    with args.input.open(encoding='utf-8-sig', newline='') as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames != EXPECTED:
            cli.error('V2 欄位與使用者要求不一致。')
        rows = list(reader)
    for number, row in enumerate(rows, 2):
        if None in row or any(not str(row.get(key, '')).strip() for key in EXPECTED):
            cli.error(f'第 {number} 行欄位缺失；請修正審核結果，不能自動填文字。')
        if 'PUBLISH NOW' in row['優先級'] and row['狀態'] not in ('Published', 'VERIFIED'):
            cli.error(f'第 {number} 行未完成卻標示 PUBLISH NOW。')
    print(f'已檢查 {len(rows)} 筆 V2 審核紀錄；沒有寫入文件、生成網頁或宣稱已發布。')


if __name__ == '__main__':
    main()
