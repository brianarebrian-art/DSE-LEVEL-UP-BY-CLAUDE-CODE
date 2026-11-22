import { readFileSync, existsSync } from 'node:fs'
const { scripts } = JSON.parse(readFileSync('package.json', 'utf8'))
for (const name of ['build', 'dev']) {
  if (!/--webpack/.test(scripts[name])) throw new Error(`package.json ${name} must use --webpack`)
}
for (const path of ['middleware.ts', 'src/middleware.ts']) {
  if (existsSync(path)) throw new Error(`${path} conflicts with proxy.ts (Next.js 16)`)
}
console.log('Build config passed: webpack, no conflicting middleware.ts')
