#!/usr/bin/env python3
"""Read-only HTTP checks. Local production-mode HTML is not Google indexing evidence."""
import argparse
import concurrent.futures
import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ''
        self.h1 = []
        self.metadata = {}
        self.canonicals = []
        self.json_ld = []
        self.links = []
        self.ids = set()
        self.body_text = []
        self.tags = {}
        self.capture = None
        self.buffer = []
        self.script_attrs = {}
        self.ignored = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags[tag] = self.tags.get(tag, 0) + 1
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'meta':
            key = attrs.get('name', attrs.get('property', '')).lower()
            self.metadata.setdefault(key, []).append(attrs.get('content', ''))
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag in ('script', 'style'):
            self.ignored += 1
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.capture, self.buffer, self.script_attrs = 'json', [], attrs
        elif tag in ('h1', 'title'):
            self.capture, self.buffer = tag, []

    def handle_endtag(self, tag):
        if self.capture == tag or tag == 'script' and self.capture == 'json':
            text = ''.join(self.buffer).strip()
            if self.capture == 'h1':
                self.h1.append(text)
            elif self.capture == 'title':
                self.title = text
            else:
                self.json_ld.append({'text': text, 'nonce': self.script_attrs.get('nonce')})
            self.capture, self.buffer = None, []
        if tag in ('script', 'style'):
            self.ignored = max(0, self.ignored - 1)

    def handle_data(self, data):
        if self.capture:
            self.buffer.append(data)
        if not self.ignored:
            self.body_text.append(data)


def fetch(url, user_agent):
    request = Request(url, headers={'User-Agent': user_agent})
    try:
        response = urlopen(request, timeout=45)
    except HTTPError as error:
        response = error
    headers = {name.lower(): value for name, value in response.headers.items()}
    return response.status, response.geturl(), headers, response.read().decode('utf-8', 'replace')


def inspect(origin, canonical_origin, item, name, user_agent, output):
    path = item['path']
    try:
        status, final, headers, html = fetch(origin.rstrip('/') + path, user_agent)
        parser = PageParser()
        parser.feed(html)
        schema, schema_errors = [], []
        nonce_match = re.search(r"'nonce-([^']+)'", headers.get('content-security-policy', ''))
        for record in parser.json_ld:
            try:
                data = json.loads(record['text'])
                schema.extend(data.get('@graph', [data]) if isinstance(data, dict) else data)
                if nonce_match and record['nonce'] != nonce_match[1]:
                    schema_errors.append('JSON-LD nonce does not match the response CSP')
            except (ValueError, AttributeError, TypeError) as error:
                schema_errors.append(str(error))
        expected_canonical = urljoin(canonical_origin.rstrip('/') + '/', path.split('?')[0])
        issues = []
        if status != item.get('status', 200):
            issues.append(f'HTTP {status}')
        if status == 200:
            if len(parser.h1) != 1:
                issues.append(f'H1 count {len(parser.h1)}')
            canonical_values = [url.rstrip('/') if path == '/' else url for url in parser.canonicals]
            canonical_target = expected_canonical.rstrip('/') if path == '/' else expected_canonical
            if canonical_values != [canonical_target]:
                issues.append('Canonical missing, duplicated or incorrect')
            descriptions = parser.metadata.get('description', [])
            if len(descriptions) != 1 or not 150 <= len(descriptions[0]) <= 160:
                issues.append('Description must be unique in HTML and 150–160 Unicode characters')
            for key in ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']:
                if not parser.metadata.get(key):
                    issues.append('Missing ' + key)
            robots = ','.join(parser.metadata.get('robots', []) + parser.metadata.get('googlebot', [])) + headers.get('x-robots-tag', '')
            if ('noindex' in robots.lower()) != item.get('noindex', False):
                issues.append('Unexpected noindex policy')
            if item.get('in_sitemap', False) and 'noindex' in robots.lower():
                issues.append('Sitemap contains a noindex URL')
            if not schema:
                issues.append('Missing JSON-LD')
            issues.extend(schema_errors)
            types = [data.get('@type') for data in schema]
            if not item.get('noindex', False) and 'BreadcrumbList' not in types:
                issues.append('Public content missing BreadcrumbList')
            if path.startswith('/notes/') and not item.get('noindex', False) and 'TechArticle' not in types:
                issues.append('Public revision notes missing TechArticle')
            if not nonce_match:
                issues.append('Missing response CSP nonce')
            for data in schema:
                if data.get('@type') in ['Article', 'TechArticle'] and data.get('url') == expected_canonical:
                    if data.get('headline') not in parser.h1:
                        issues.append('Article headline differs from visible H1')
        record = {
            'path': path, 'user_agent': name, 'status': status, 'final_url': final,
            'title': parser.title, 'h1': parser.h1, 'canonical': parser.canonicals,
            'description': parser.metadata.get('description'),
            'description_length': [len(text) for text in parser.metadata.get('description', [])],
            'robots': parser.metadata.get('robots'), 'googlebot': parser.metadata.get('googlebot'),
            'x_robots_tag': headers.get('x-robots-tag'),
            'structured_types': [data.get('@type') for data in schema],
            'json_ld_errors': schema_errors,
            'internal_links': sorted(set(link for link in parser.links if link.startswith('/') and not link.startswith('//'))),
            'ids': sorted(parser.ids), 'text_length': len(' '.join(parser.body_text)),
            'in_sitemap': item.get('in_sitemap', False),
            'semantic_tags': parser.tags, 'issues': issues,
            'scope': 'HTTP response only; no Search Console or mobile interaction claim',
        }
        filename = (path.strip('/').replace('/', '__').replace('?', '_') or 'home') + '-' + name
        (output / (filename + '.html')).write_text(html, encoding='utf-8')
        return record
    except Exception as error:
        return {'path': path, 'user_agent': name, 'issues': [str(error)], 'scope': 'BLOCKED: request failed'}


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument('--origin', required=True)
    cli.add_argument('--canonical-origin', required=True)
    cli.add_argument('--routes', required=True)
    cli.add_argument('--output', required=True)
    cli.add_argument('--strict', action='store_true')
    cli.add_argument('--sitemap', action='store_true', help='Include all URLs in the origin sitemap.xml')
    args = cli.parse_args()
    if urlsplit(args.origin).scheme not in ['http', 'https']:
        cli.error('origin must be HTTP or HTTPS')
    routes = json.loads(Path(args.routes).read_text())
    manifest = {item['path'] or '/': {**item, 'path': item['path'] or '/'} for item in routes}
    if args.sitemap:
        status, _, _, xml = fetch(args.origin.rstrip('/') + '/sitemap.xml', 'DSE-Level-Up-Read-Only-QA')
        if status != 200:
            cli.error(f'Sitemap HTTP {status}')
        urls = [node.text for node in ET.fromstring(xml).findall('.//{*}loc')]
        if len(urls) != len(set(urls)):
            cli.error('Sitemap contains duplicate URLs')
        canonical = urlsplit(args.canonical_origin)
        for url in urls:
            parsed = urlsplit(url)
            if parsed.scheme != canonical.scheme or parsed.netloc != canonical.netloc:
                cli.error('Sitemap URL has an unexpected origin')
            path = parsed.path or '/'
            manifest.setdefault(path, {'path': path, 'noindex': False})
            manifest[path]['in_sitemap'] = True
    routes = list(manifest.values())
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    agents = {
        'visitor': 'Mozilla/5.0 DSE-Level-Up-Read-Only-QA',
        'googlebot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'social': 'Twitterbot/1.0',
    }
    tasks = [(item, name, agent) for item in routes for name, agent in agents.items()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda task: inspect(args.origin, args.canonical_origin, *task, output), tasks))
    (output / 'responses.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'responses': len(results), 'responses_with_issues': sum(bool(record['issues']) for record in results), 'report': str(output / 'responses.json')}, ensure_ascii=False))
    if args.strict and any(record['issues'] for record in results):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
