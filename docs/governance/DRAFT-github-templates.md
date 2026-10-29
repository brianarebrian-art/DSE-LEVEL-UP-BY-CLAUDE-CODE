# GitHub issue／PR templates（DRAFT — 需創辦人批准後先建立檔案）

狀態：**待批准** · 2026-10-29  
擬定路徑（批准後）：

- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/pull_request_template.md`

## Bug issue（摘要）

```yaml
name: Bug
description: Something broken for students
body:
  - type: textarea
    id: what
    attributes: { label: What happened?, description: Plain language, HK Chinese OK }
    validations: { required: true }
  - type: textarea
    id: repro
    attributes: { label: Steps to reproduce }
  - type: dropdown
    id: data
    attributes:
      label: Involves student account / progress data?
      options: [No, Yes — do not paste personal data]
```

## PR template（摘要）

```markdown
## Summary
- 

## Impact on students
- 

## Tests
- [ ] `npm test` / relevant isolation tests
- [ ] Manual check (describe)

## Risk
- Auth / RLS / deletion / wipe? (needs founder review)
- Production DB change? (must be separately approved)

## Merge
Draft until founder approves merge/deploy.
```

**本輪唔會**喺未批准前寫入 `.github/` 實體檔案。
