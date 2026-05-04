import {builtinModules} from "node:module"

// Anything that ships in `dependencies` or comes from Node core is resolved
// by the consumer at runtime — never bundle it. Cover both the bare specifier
// and the `node:` prefixed form so the result does not depend on which form
// a particular source file uses. cached-fn has no production dependencies, so
// the only externals are Node builtins (and the package self-reference used
// by src/cached-fn.ts to pull its own .d.ts through the published `exports`).
const externals = new Set<string>([
    ...builtinModules,
    ...builtinModules.map(m => `node:${m}`),
    "cached-fn",
])

export const isExternal = (id: string): boolean => externals.has(id)
