#!/usr/bin/env python3
"""Parse JSON-LD / H1 / CSP nonce for Rich Results *preparation* checks.

This script does NOT claim Google Rich Results eligibility. Founders must still
run https://search.google.com/test/rich-results on production URLs.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
import sys

# Same-directory import when run as `python3 scripts/seo/verify_rich_results.py`
sys.path.insert(0, str(Path(__file__).resolve().parent))
from verify_responses import PageParser, fetch  # noqa: E402


def flatten_types(nodes: list) -> list[str]:
    out: list[str] = []
    for node in nodes:
        if not isinstance(node, dict):
            continue
        t = node.get('@type')
        if isinstance(t, list):
            out.extend(str(x) for x in t)
        elif t:
            out.append(str(t))
    return out


def check_path(origin: str, canonical_origin: str, path: str, expect_noindex: bool) -> dict:
    status, _final, headers, html = fetch(origin.rstrip('/') + path, 'DSE-Level-Up-RichResults-QA')
    parser = PageParser()
    parser.feed(html)
    schema: list = []
    schema_errors: list[str] = []
    nonce_match = re.search(r"'nonce-([^']+)'", headers.get('content-security-policy', ''))
    for record in parser.json_ld:
        try:
            data = json.loads(record['text'])
            if isinstance(data, dict) and '@graph' in data:
                schema.extend(data['@graph'])
            elif isinstance(data, list):
                schema.extend(data)
            else:
                schema.append(data)
            if nonce_match and record.get('nonce') and record['nonce'] != nonce_match[1]:
                schema_errors.append('JSON-LD nonce does not match CSP')
        except (ValueError, TypeError) as err:
            schema_errors.append(str(err))

    issues: list[str] = []
    if status != 200:
        issues.append(f'HTTP {status}')
    if len(parser.h1) != 1:
        issues.append(f'H1 count {len(parser.h1)}')
    if not schema:
        issues.append('Missing JSON-LD')
    if not nonce_match:
        issues.append('Missing CSP nonce')
    issues.extend(schema_errors)

    types = flatten_types(schema)
    robots = ','.join(parser.metadata.get('robots', []) + parser.metadata.get('googlebot', []))
    noindex = 'noindex' in robots.lower() or 'noindex' in headers.get('x-robots-tag', '').lower()
    if noindex != expect_noindex:
        issues.append(f'noindex={noindex}, expected {expect_noindex}')

    expected_url = urljoin(canonical_origin.rstrip('/') + '/', path.lstrip('/'))
    for node in schema:
        if not isinstance(node, dict):
            continue
        if node.get('@type') in ('Article', 'TechArticle'):
            headline = node.get('headline')
            if headline and headline not in parser.h1:
                issues.append(f'Article headline differs from H1: {headline!r}')
        if node.get('@type') == 'BreadcrumbList':
            items = node.get('itemListElement') or []
            if not items:
                issues.append('BreadcrumbList empty')

    if not expect_noindex and 'BreadcrumbList' not in types:
        issues.append('Public page missing BreadcrumbList')

    return {
        'path': path,
        'status': status,
        'h1': parser.h1,
        'types': types,
        'noindex': noindex,
        'canonical_expected': expected_url,
        'issues': issues,
        'disclaimer': 'Local schema parse only — not Google Rich Results eligibility',
    }


def main() -> None:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--origin', required=True)
    cli.add_argument('--canonical-origin', required=True)
    cli.add_argument('--paths', required=True, help='Comma-separated paths')
    cli.add_argument('--expect-noindex', action='store_true')
    cli.add_argument('--output', required=True)
    cli.add_argument('--strict', action='store_true')
    args = cli.parse_args()
    if urlsplit(args.origin).scheme not in ('http', 'https'):
        cli.error('origin must be HTTP or HTTPS')

    paths = [p.strip() for p in args.paths.split(',') if p.strip()]
    results = [check_path(args.origin, args.canonical_origin, p, args.expect_noindex) for p in paths]
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    report = {
        'pages': results,
        'pages_with_issues': sum(1 for r in results if r['issues']),
        'google_rich_results_test': 'https://search.google.com/test/rich-results',
        'note': 'Run Google Rich Results Test on production after deploy; this script is not that test.',
    }
    (out / 'rich-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'checked': len(results), 'with_issues': report['pages_with_issues'], 'report': str(out / 'rich-results.json')}, ensure_ascii=False))
    if args.strict and report['pages_with_issues']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
