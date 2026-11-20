// @typescript/typescript6 depends on a TypeScript 6 build whose bin is also
// named `tsc`. npm then points `npx tsc` at 6.x. The app and CI typecheck
// stay on the TypeScript 7 compiler in the `typescript` package.
import { existsSync, rmSync, symlinkSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'node_modules', 'typescript', 'bin', 'tsc')
const link = join(root, 'node_modules', '.bin', 'tsc')

if (!existsSync(target)) {
  console.error('link-typescript7-bin: node_modules/typescript/bin/tsc is missing')
  process.exit(1)
}

rmSync(link, { force: true })
symlinkSync('../typescript/bin/tsc', link)
