---
'octane': patch
---

Clear the previous subtree when a return-value component returns `undefined` (#1186).

A body returning `undefined` skipped the output reconciler entirely, so
`cond && <Child/>` with an object-or-`undefined` `cond` left stale DOM mounted.
`undefined` now reconciles to empty like `null`/`false`/`''` — matching React
and Octane's own SSR — while imperative `@{}`/`__children$N` bodies that return
`undefined` after writing their own slots are unaffected.
