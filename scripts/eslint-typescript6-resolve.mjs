// typescript-eslint 8.72 loads `typescript` at import time and refuses 7.x,
// which has no JavaScript compiler API. The app and `tsc` stay on TypeScript 7.
// This hook runs before eslint-config-next is imported, so ESLint's require
// resolves the TypeScript 6 API package instead.
import { registerHooks } from 'node:module'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'typescript') {
      return nextResolve('@typescript/typescript6', context)
    }
    return nextResolve(specifier, context)
  },
})
