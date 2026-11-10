# web-design-guidelines attribution

Source: https://github.com/vercel-labs/agent-skills
Path: `skills/web-design-guidelines/SKILL.md`
Pinned commit: `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`
Skill metadata: `author: vercel`, `version: 1.0.0`

The upstream README at that commit ends with:

> ## License
>
> MIT

That commit has no LICENSE file and `package.json` has no `license` field. The MIT declaration above is the upstream license statement. Do not treat the rest of `vercel-labs/agent-skills` as installed. Only `web-design-guidelines` is vendored.

The skill fetches review rules from https://github.com/vercel-labs/web-interface-guidelines (`command.md` on `main`). Those rules are fetched at review time. They are not a palette for this product.
