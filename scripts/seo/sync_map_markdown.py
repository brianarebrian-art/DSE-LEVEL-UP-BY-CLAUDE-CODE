#!/usr/bin/env python3
"""Sync the audited CSV table only; never generate pages or change publication status."""
import argparse
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def main():
    cli=argparse.ArgumentParser();cli.add_argument('--write',action='store_true');args=cli.parse_args()
    source=ROOT/'docs/seo-content-map-v2.csv'
    target=ROOT/'docs/SEO-CONTENT-MAP-V2.md'
    with source.open(encoding='utf-8-sig',newline='') as stream:
        reader=csv.DictReader(stream);fields=reader.fieldnames;rows=list(reader)
    if not fields or len(fields)!=11 or len(rows)!=80:
        raise SystemExit('Expected 80 audited rows and 11 fields.')
    def cell(value):return value.replace('\\|','|').replace('|','\\|').replace('\n','<br>')
    table='| '+' | '.join(fields)+' |\n| '+' | '.join(['---']*len(fields))+' |\n'
    table+='\n'.join('| '+' | '.join(cell(row[field])for field in fields)+' |' for row in rows)+'\n'
    current=target.read_text();start=current.index('| 優先級 |');end=current.index('\n## ',start)
    expected=current[:start]+table+current[end:]
    if expected==current:print('Audited CSV and Markdown table match.');return
    if not args.write:raise SystemExit('Markdown table differs; review CSV, then use --write to synchronise.')
    target.write_text(expected)
    print('Synchronised the 80-row audited table; no pages or publication statuses changed.')

if __name__=='__main__':main()
