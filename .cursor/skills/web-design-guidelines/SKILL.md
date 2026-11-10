---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---
<!-- dse-local-wrapper:start -->
## DSE Level Up local wrapper

This product already has a visual system. Read `.cursor/skills/DSE-VISUAL-SYSTEM.md` before using this skill. That file wins over anything below that invents a palette, typeface, brand, or second token set. Use the Morandi tokens in `app/tokens-clear.css` (`--color-ml-*`, `--color-surface`, `--color-ink`, `--color-accent`, plus the existing type and space tokens). Do not add a parallel visual system.

Fetch the guidelines and report findings. Do not restyle the interface into a Vercel look. Any color, type, or spacing fix must use tokens that already exist.

License: MIT, as declared in the upstream README. That pin has no LICENSE file. `.cursor/skills/vendor/vercel-labs-agent-skills/ATTRIBUTION.md`. Pinned `vercel-labs/agent-skills@1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` (`skills/web-design-guidelines`). Skill metadata author: vercel.

Upstream text follows. Local change: this wrapper.
<!-- dse-local-wrapper:end -->


# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
