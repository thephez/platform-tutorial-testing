# Docusaurus + Lightweight Runner PoC

This folder contains a standalone proof of concept for an interactive docs site using Docusaurus
with an in-page Sandpack runner.

## Run locally

```bash
cd docs-poc/docusaurus-stackblitz
npm install
npm run start
```

Open http://localhost:3000 and navigate to:

- `/docs/evo-sdk-read-only-example`

## What this PoC demonstrates

- Docusaurus as the docs framework.
- Sandpack as a responsive, click-to-run in-page runner.
- A pattern for starting with read-only Evo-SDK tutorials and extending with Codespaces links for
  full-runtime/credentialed flows.
