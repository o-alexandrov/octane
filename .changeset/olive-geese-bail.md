---
'octane': patch
---

Add a compiler-emitted `$$stable` definition-site purity stamp (`markStable`,
also exported as the compact `__st` ABI) so components whose committed output is
a pure projection of their props snapshot bail out of shallow-equal parent
updates without a `memo` wrapper, and slim the runtime's changed-commit host-prop
path plus signal-instance identity storage. Props-equality bails (memo,
`$$stable`, implicit) now share one hazard veto — a held or dropped update, a
descendant compare veto, or an unpublished Effect Event payload always re-runs
the body — and discarded transitions restore a signal host binding's installed
control listener and disposal flag exactly.
