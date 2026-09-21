---
'octane': patch
---

Compile linked and workspace packages that receive Octane transitively. A package outside `node_modules` no longer needs a redundant `octane` entry in its own manifest to be recognized as Octane source: the compiler walks its declared runtime dependency closure and owns it when a package in that closure depends on Octane. Installed packages under `node_modules` still require their own declaration, and a package declaring `react` or `react-dom` keeps its own renderer.
