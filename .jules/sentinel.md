# Sentinel's Journal

## 2026-11-03 - OAuth Redirect Sanitization Defense-in-Depth
**Vulnerability:** In OAuth callback flows (`/auth/callback?next=...`), basic prefix checks (like `startsWith('/') && !startsWith('//')`) are insufficient to prevent open redirects across diverse browser and parser implementations if backslashes, control characters, URL-encoded path separators (`%5c`, `%2f`), or executable pseudo-schemes (`javascript:`, `data:`) are permitted.
**Learning:** Browsers and HTTP client libraries may normalize URLs differently (e.g. converting `/\evil.com` to `//evil.com` or decoding `%5c` into `\`). A multi-layered check that combines prefix validation, character/encoding blocklists, and strict URL resolution against a fixed dummy origin (`http://localhost`) provides reliable, standards-compliant open-redirect protection.
**Prevention:** Always pair character and scheme sanitization with standard URL parser validation (`new URL(path, 'http://localhost')`) and ensure `origin` matches the dummy host and `pathname` remains rooted.
