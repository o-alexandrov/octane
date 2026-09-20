---
'octane': patch
---

Add a compiler-emitted `$$stable` definition-site purity stamp (`markStable`,
also exported as the compact `__st` ABI) so components whose committed output is
a pure projection of their props snapshot bail out of shallow-equal parent
updates without a `memo` wrapper, and slim the runtime's changed-commit host-prop
path plus signal-instance identity storage.
